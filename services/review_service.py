from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from database.connection import get_database
from database.models import ReviewSession, ReviewNote


class ReviewService:
    def __init__(self):
        pass
    
    async def create_session(self, session: ReviewSession) -> str:
        """Create a new review session"""
        db = get_database()
        session_dict = session.dict(exclude_unset=True)
        result = await db.review_sessions.insert_one(session_dict)
        return str(result.inserted_id)
    
    async def list_sessions(self, active_only: bool = False) -> List[Dict[str, Any]]:
        """List review sessions"""
        db = get_database()
        filter_dict = {}
        if active_only:
            filter_dict["is_active"] = True
        
        sessions = []
        async for session in db.review_sessions.find(filter_dict).sort("created_at", -1):
            session["_id"] = str(session["_id"])
            # Calculate progress
            total_papers = len(session.get("paper_ids", []))
            completed_papers = len(session.get("completed_papers", []))
            session["progress_percentage"] = (completed_papers / total_papers * 100) if total_papers > 0 else 0
            sessions.append(session)
        return sessions
    
    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific review session"""
        db = get_database()
        try:
            session = await db.review_sessions.find_one({"_id": ObjectId(session_id)})
            if session:
                session["_id"] = str(session["_id"])
                # Get papers details
                papers = []
                for paper_id in session.get("paper_ids", []):
                    paper = await db.papers.find_one({"semantic_scholar_id": paper_id})
                    if paper:
                        paper["_id"] = str(paper["_id"])
                        paper["is_completed"] = paper_id in session.get("completed_papers", [])
                        # Get review notes for this paper in this session
                        notes = []
                        async for note in db.review_notes.find({
                            "paper_id": paper_id,
                            "session_id": session_id
                        }):
                            note["_id"] = str(note["_id"])
                            notes.append(note)
                        paper["review_notes"] = notes
                        papers.append(paper)
                session["papers"] = papers
                
                # Calculate progress
                total_papers = len(session.get("paper_ids", []))
                completed_papers = len(session.get("completed_papers", []))
                session["progress_percentage"] = (completed_papers / total_papers * 100) if total_papers > 0 else 0
            return session
        except:
            return None
    
    async def mark_paper_complete(self, session_id: str, paper_id: str) -> bool:
        """Mark a paper as completed in a session"""
        db = get_database()
        try:
            # Add paper to completed list if not already there
            session = await db.review_sessions.find_one({"_id": ObjectId(session_id)})
            if not session:
                return False
            
            completed_papers = session.get("completed_papers", [])
            if paper_id not in completed_papers:
                completed_papers.append(paper_id)
            
            update_dict = {
                "completed_papers": completed_papers,
                "updated_at": datetime.utcnow()
            }
            
            # Check if all papers are completed
            if len(completed_papers) == len(session.get("paper_ids", [])):
                update_dict["is_active"] = False
                update_dict["completed_at"] = datetime.utcnow()
            
            result = await db.review_sessions.update_one(
                {"_id": ObjectId(session_id)},
                {"$set": update_dict}
            )
            return result.modified_count > 0
        except:
            return False
    
    async def create_note(self, note: ReviewNote) -> str:
        """Create a review note"""
        db = get_database()
        note_dict = note.dict(exclude_unset=True)
        result = await db.review_notes.insert_one(note_dict)
        return str(result.inserted_id)
    
    async def get_notes_for_paper(self, paper_id: str) -> List[Dict[str, Any]]:
        """Get all review notes for a paper"""
        db = get_database()
        notes = []
        async for note in db.review_notes.find({"paper_id": paper_id}).sort("created_at", -1):
            note["_id"] = str(note["_id"])
            # Get session info
            session = await db.review_sessions.find_one({"_id": ObjectId(note["session_id"])})
            if session:
                note["session_name"] = session.get("name", "")
            notes.append(note)
        return notes
    
    async def get_notes_for_session(self, session_id: str) -> List[Dict[str, Any]]:
        """Get all review notes for a session"""
        db = get_database()
        notes = []
        async for note in db.review_notes.find({"session_id": session_id}).sort("created_at", -1):
            note["_id"] = str(note["_id"])
            # Get paper info
            paper = await db.papers.find_one({"semantic_scholar_id": note["paper_id"]})
            if paper:
                note["paper_title"] = paper.get("title", "")
                note["paper_authors"] = paper.get("authors", [])
            notes.append(note)
        return notes
    
    async def update_note(self, note_id: str, content: str) -> bool:
        """Update a review note"""
        db = get_database()
        try:
            result = await db.review_notes.update_one(
                {"_id": ObjectId(note_id)},
                {"$set": {
                    "content": content,
                    "updated_at": datetime.utcnow()
                }}
            )
            return result.modified_count > 0
        except:
            return False
    
    async def get_session_statistics(self, session_id: str) -> Dict[str, Any]:
        """Get statistics for a review session"""
        db = get_database()
        try:
            session = await db.review_sessions.find_one({"_id": ObjectId(session_id)})
            if not session:
                return {}
            
            # Calculate total time spent
            total_time_spent = 0
            note_count = 0
            async for note in db.review_notes.find({"session_id": session_id}):
                total_time_spent += note.get("time_spent", 0)
                note_count += 1
            
            total_papers = len(session.get("paper_ids", []))
            completed_papers = len(session.get("completed_papers", []))
            
            return {
                "total_papers": total_papers,
                "completed_papers": completed_papers,
                "remaining_papers": total_papers - completed_papers,
                "progress_percentage": (completed_papers / total_papers * 100) if total_papers > 0 else 0,
                "total_time_allocated": session.get("total_time", 0),
                "total_time_spent_seconds": total_time_spent,
                "total_time_spent_minutes": total_time_spent / 60,
                "average_time_per_paper": (total_time_spent / completed_papers) if completed_papers > 0 else 0,
                "total_notes": note_count,
                "is_active": session.get("is_active", True),
                "created_at": session.get("created_at"),
                "completed_at": session.get("completed_at")
            }
        except:
            return {}