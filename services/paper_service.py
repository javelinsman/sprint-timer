from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from database.connection import get_database
from database.models import Paper, Query, PaperStatus, SummaryQueueItem


class PaperService:
    def __init__(self):
        pass
    
    async def save_query(self, query: Query) -> str:
        """Save a query to the database"""
        db = get_database()
        query_dict = query.dict(exclude_unset=True)
        result = await db.queries.insert_one(query_dict)
        return str(result.inserted_id)
    
    async def list_queries(self) -> List[Dict[str, Any]]:
        """List all queries"""
        db = get_database()
        queries = []
        async for query in db.queries.find().sort("created_at", -1):
            query["_id"] = str(query["_id"])
            queries.append(query)
        return queries
    
    async def get_papers_by_query(self, query_id: str) -> List[Dict[str, Any]]:
        """Get papers associated with a query"""
        db = get_database()
        query = await db.queries.find_one({"_id": ObjectId(query_id)})
        if not query:
            return []
        
        papers = []
        async for paper in db.papers.find({"semantic_scholar_id": {"$in": query["paper_ids"]}}):
            paper["_id"] = str(paper["_id"])
            papers.append(paper)
        return papers
    
    async def upsert_paper(self, paper: Paper) -> bool:
        """Insert or update a paper"""
        db = get_database()
        paper_dict = paper.dict(exclude_unset=True)
        
        # Check if paper exists
        existing = await db.papers.find_one({"semantic_scholar_id": paper.semantic_scholar_id})
        
        if existing:
            # Update query tags if paper exists
            existing_tags = set(existing.get("query_tags", []))
            new_tags = set(paper.query_tags)
            all_tags = list(existing_tags.union(new_tags))
            
            paper_dict["query_tags"] = all_tags
            paper_dict["updated_at"] = datetime.utcnow()
            
            await db.papers.update_one(
                {"semantic_scholar_id": paper.semantic_scholar_id},
                {"$set": paper_dict}
            )
        else:
            await db.papers.insert_one(paper_dict)
        
        return True
    
    async def list_papers(
        self,
        status: Optional[PaperStatus] = None,
        query_tag: Optional[str] = None,
        has_pdf: Optional[bool] = None,
        has_summary: Optional[bool] = None
    ) -> List[Dict[str, Any]]:
        """List papers with filters"""
        db = get_database()
        filter_dict = {}
        
        if status:
            filter_dict["status"] = status
        if query_tag:
            filter_dict["query_tags"] = query_tag
        if has_pdf is not None:
            filter_dict["pdf_stored"] = has_pdf
        if has_summary is not None:
            if has_summary:
                filter_dict["summary_note"] = {"$ne": None}
            else:
                filter_dict["summary_note"] = None
        
        papers = []
        async for paper in db.papers.find(filter_dict).sort("created_at", -1):
            paper["_id"] = str(paper["_id"])
            papers.append(paper)
        return papers
    
    async def get_paper(self, paper_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific paper"""
        db = get_database()
        paper = await db.papers.find_one({"semantic_scholar_id": paper_id})
        if paper:
            paper["_id"] = str(paper["_id"])
        return paper
    
    async def update_paper_status(self, paper_id: str, status: PaperStatus) -> bool:
        """Update paper status"""
        db = get_database()
        result = await db.papers.update_one(
            {"semantic_scholar_id": paper_id},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    async def update_paper_pdf(self, paper_id: str, pdf_path: str) -> bool:
        """Update paper with PDF information"""
        db = get_database()
        result = await db.papers.update_one(
            {"semantic_scholar_id": paper_id},
            {"$set": {
                "pdf_stored": True,
                "pdf_path": pdf_path,
                "status": PaperStatus.PDF_READY,
                "updated_at": datetime.utcnow()
            }}
        )
        return result.modified_count > 0
    
    async def save_summary(self, paper_id: str, summary: str) -> bool:
        """Save summary for a paper"""
        db = get_database()
        result = await db.papers.update_one(
            {"semantic_scholar_id": paper_id},
            {"$set": {
                "summary_note": summary,
                "summary_created_at": datetime.utcnow(),
                "status": PaperStatus.SUMMARIZED,
                "updated_at": datetime.utcnow()
            }}
        )
        return result.modified_count > 0
    
    async def add_to_summary_queue(self, paper_id: str, pdf_path: str) -> bool:
        """Add a paper to the summary queue"""
        db = get_database()
        queue_item = SummaryQueueItem(
            paper_id=paper_id,
            pdf_path=pdf_path
        )
        
        # Upsert to avoid duplicates
        await db.summary_queue.update_one(
            {"paper_id": paper_id},
            {"$set": queue_item.dict()},
            upsert=True
        )
        return True
    
    async def get_summary_queue(self, status: str = "pending") -> List[Dict[str, Any]]:
        """Get items from summary queue"""
        db = get_database()
        items = []
        async for item in db.summary_queue.find({"status": status}).sort("added_at", 1):
            item["_id"] = str(item["_id"])
            # Get paper details
            paper = await db.papers.find_one({"semantic_scholar_id": item["paper_id"]})
            if paper:
                item["paper_title"] = paper.get("title", "")
                item["paper_authors"] = paper.get("authors", [])
            items.append(item)
        return items
    
    async def update_queue_status(self, paper_id: str, status: str) -> bool:
        """Update queue item status"""
        db = get_database()
        update_dict = {"status": status}
        if status == "processing":
            update_dict["processed_at"] = datetime.utcnow()
        elif status == "completed":
            update_dict["processed_at"] = datetime.utcnow()
        
        result = await db.summary_queue.update_one(
            {"paper_id": paper_id},
            {"$set": update_dict}
        )
        return result.modified_count > 0
    
    async def delete_paper(self, paper_id: str) -> bool:
        """Delete a paper and its associated data"""
        db = get_database()
        
        # Delete paper
        result = await db.papers.delete_one({"semantic_scholar_id": paper_id})
        if result.deleted_count == 0:
            return False
        
        # Delete associated review notes
        await db.review_notes.delete_many({"paper_id": paper_id})
        
        # Remove from summary queue
        await db.summary_queue.delete_one({"paper_id": paper_id})
        
        return True
    
    async def delete_query(self, query_id: str) -> bool:
        """Delete a query"""
        db = get_database()
        
        try:
            result = await db.queries.delete_one({"_id": ObjectId(query_id)})
            return result.deleted_count > 0
        except:
            return False
    
    async def get_overview(self) -> Dict[str, Any]:
        """Get comprehensive overview"""
        db = get_database()
        
        # Get counts by status
        status_counts = {}
        for status in PaperStatus:
            count = await db.papers.count_documents({"status": status})
            status_counts[status] = count
        
        # Get total counts
        total_papers = await db.papers.count_documents({})
        papers_with_pdf = await db.papers.count_documents({"pdf_stored": True})
        papers_with_summary = await db.papers.count_documents({"summary_note": {"$ne": None}})
        
        # Get query statistics
        total_queries = await db.queries.count_documents({})
        
        # Get recent papers
        recent_papers = []
        async for paper in db.papers.find().sort("created_at", -1).limit(10):
            paper["_id"] = str(paper["_id"])
            recent_papers.append(paper)
        
        # Get queue status
        queue_pending = await db.summary_queue.count_documents({"status": "pending"})
        queue_processing = await db.summary_queue.count_documents({"status": "processing"})
        queue_completed = await db.summary_queue.count_documents({"status": "completed"})
        
        return {
            "total_papers": total_papers,
            "papers_with_pdf": papers_with_pdf,
            "papers_with_summary": papers_with_summary,
            "status_counts": status_counts,
            "total_queries": total_queries,
            "recent_papers": recent_papers,
            "summary_queue": {
                "pending": queue_pending,
                "processing": queue_processing,
                "completed": queue_completed
            }
        }