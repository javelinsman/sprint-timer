from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import aiofiles
from pathlib import Path

from database.connection import connect_to_mongo, close_mongo_connection, get_database
from database.models import Paper, Query, ReviewSession, ReviewNote, PaperStatus, SummaryQueueItem
from services.semantic_scholar import SemanticScholarService
from services.paper_service import PaperService
from services.review_service import ReviewService


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="Literature Manager API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for PDFs
pdf_dir = Path("stored_pdfs")
pdf_dir.mkdir(exist_ok=True)
app.mount("/stored_pdfs", StaticFiles(directory="stored_pdfs"), name="stored_pdfs")

# Initialize services
ss_service = SemanticScholarService()
paper_service = PaperService()
review_service = ReviewService()


@app.get("/")
async def root():
    return {"message": "Literature Manager API", "version": "1.0.0"}


# Query endpoints
@app.post("/api/queries/")
async def create_query(query_string: str, description: Optional[str] = None):
    """Create a new query and fetch papers from Semantic Scholar"""
    try:
        # Search papers using Semantic Scholar (with reasonable limit)
        papers = await ss_service.search_papers(query_string, limit=20)
        
        # Create query record
        query = Query(
            query_string=query_string,
            description=description,
            paper_ids=[p["paperId"] for p in papers],
            total_results=len(papers),
            last_run=datetime.utcnow()
        )
        
        # Save query to database
        query_id = await paper_service.save_query(query)
        
        # Save papers to database
        for paper_data in papers:
            paper = Paper(
                semantic_scholar_id=paper_data["paperId"],
                title=paper_data.get("title", ""),
                authors=[a.get("name", "") for a in paper_data.get("authors", [])],
                year=paper_data.get("year"),
                abstract=paper_data.get("abstract"),
                venue=paper_data.get("venue"),
                citation_count=paper_data.get("citationCount"),
                reference_count=paper_data.get("referenceCount"),
                url=paper_data.get("url"),
                pdf_url=paper_data.get("openAccessPdf", {}).get("url") if paper_data.get("openAccessPdf") else None,
                query_tags=[query_string],
                status=PaperStatus.QUERIED
            )
            await paper_service.upsert_paper(paper)
        
        return {"query_id": query_id, "papers_found": len(papers)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/queries/")
async def list_queries():
    """List all queries"""
    queries = await paper_service.list_queries()
    return queries


@app.get("/api/queries/{query_id}/papers")
async def get_query_papers(query_id: str):
    """Get all papers from a specific query"""
    papers = await paper_service.get_papers_by_query(query_id)
    return papers


# Paper management endpoints
@app.get("/api/papers/")
async def list_papers(
    status: Optional[PaperStatus] = None,
    query_tag: Optional[str] = None,
    has_pdf: Optional[bool] = None,
    has_summary: Optional[bool] = None
):
    """List papers with optional filters"""
    papers = await paper_service.list_papers(
        status=status,
        query_tag=query_tag,
        has_pdf=has_pdf,
        has_summary=has_summary
    )
    return papers


@app.get("/api/papers/{paper_id}")
async def get_paper(paper_id: str):
    """Get a specific paper by Semantic Scholar ID"""
    paper = await paper_service.get_paper(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper


@app.post("/api/papers/{paper_id}/gate")
async def gate_paper(paper_id: str):
    """Mark a paper as gated (selected for import)"""
    success = await paper_service.update_paper_status(paper_id, PaperStatus.GATED)
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"message": "Paper gated successfully"}


@app.post("/api/papers/{paper_id}/import")
async def import_paper(paper_id: str):
    """Mark a paper as imported"""
    success = await paper_service.update_paper_status(paper_id, PaperStatus.IMPORTED)
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"message": "Paper imported successfully"}


@app.post("/api/papers/{paper_id}/reject")
async def reject_paper(paper_id: str):
    """Mark a paper as rejected"""
    success = await paper_service.update_paper_status(paper_id, PaperStatus.REJECTED)
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"message": "Paper rejected successfully"}


@app.post("/api/papers/{paper_id}/pdf")
async def upload_pdf(paper_id: str, file: UploadFile = File(...)):
    """Upload PDF for a paper"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # Create pdfs directory if it doesn't exist
    pdf_dir = Path("stored_pdfs")
    pdf_dir.mkdir(exist_ok=True)
    
    # Save file
    file_path = pdf_dir / f"{paper_id}.pdf"
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Update paper record
    success = await paper_service.update_paper_pdf(paper_id, str(file_path))
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Add to summary queue
    await paper_service.add_to_summary_queue(paper_id, str(file_path))
    
    return {"message": "PDF uploaded successfully", "path": str(file_path)}


@app.delete("/api/papers/{paper_id}")
async def delete_paper(paper_id: str):
    """Delete a paper and its associated data"""
    success = await paper_service.delete_paper(paper_id)
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Delete PDF file if exists
    pdf_path = Path("stored_pdfs") / f"{paper_id}.pdf"
    if pdf_path.exists():
        pdf_path.unlink()
    
    return {"message": "Paper deleted successfully"}


@app.delete("/api/queries/{query_id}")
async def delete_query(query_id: str):
    """Delete a query and optionally its associated papers"""
    success = await paper_service.delete_query(query_id)
    if not success:
        raise HTTPException(status_code=404, detail="Query not found")
    
    return {"message": "Query deleted successfully"}


# Summary queue endpoints (for LLM agent)
@app.get("/api/summary-queue/")
async def get_summary_queue(status: Optional[str] = "pending"):
    """Get papers in the summary queue"""
    items = await paper_service.get_summary_queue(status)
    return items


@app.post("/api/summary-queue/{paper_id}/process")
async def mark_summary_processing(paper_id: str):
    """Mark a paper as being processed for summary"""
    success = await paper_service.update_queue_status(paper_id, "processing")
    if not success:
        raise HTTPException(status_code=404, detail="Queue item not found")
    return {"message": "Marked as processing"}


@app.post("/api/papers/{paper_id}/summary")
async def save_paper_summary(paper_id: str, summary: str):
    """Save summary for a paper (called by LLM agent)"""
    success = await paper_service.save_summary(paper_id, summary)
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Update queue status
    await paper_service.update_queue_status(paper_id, "completed")
    
    return {"message": "Summary saved successfully"}


# Review session endpoints
@app.post("/api/review-sessions/")
async def create_review_session(
    name: str,
    paper_ids: List[str],
    time_per_paper: int
):
    """Create a new review session"""
    session = ReviewSession(
        name=name,
        paper_ids=paper_ids,
        time_per_paper=time_per_paper,
        total_time=time_per_paper * len(paper_ids)
    )
    session_id = await review_service.create_session(session)
    return {"session_id": session_id}


@app.get("/api/review-sessions/")
async def list_review_sessions(active_only: bool = False):
    """List review sessions"""
    sessions = await review_service.list_sessions(active_only)
    return sessions


@app.get("/api/review-sessions/{session_id}")
async def get_review_session(session_id: str):
    """Get a specific review session"""
    session = await review_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.post("/api/review-sessions/{session_id}/papers/{paper_id}/complete")
async def mark_paper_reviewed(session_id: str, paper_id: str):
    """Mark a paper as reviewed in a session"""
    success = await review_service.mark_paper_complete(session_id, paper_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to mark paper as complete")
    return {"message": "Paper marked as reviewed"}


@app.post("/api/review-notes/")
async def create_review_note(
    paper_id: str,
    session_id: str,
    content: str,
    time_spent: int
):
    """Create a review note"""
    note = ReviewNote(
        paper_id=paper_id,
        session_id=session_id,
        content=content,
        time_spent=time_spent
    )
    note_id = await review_service.create_note(note)
    return {"note_id": note_id}


@app.get("/api/review-notes/paper/{paper_id}")
async def get_paper_review_notes(paper_id: str):
    """Get all review notes for a paper"""
    notes = await review_service.get_notes_for_paper(paper_id)
    return notes


@app.get("/api/review-notes/session/{session_id}")
async def get_session_review_notes(session_id: str):
    """Get all review notes for a session"""
    notes = await review_service.get_notes_for_session(session_id)
    return notes


# Overview endpoint
@app.get("/api/overview/")
async def get_overview():
    """Get comprehensive overview of all papers and their status"""
    overview = await paper_service.get_overview()
    return overview


if __name__ == "__main__":
    import uvicorn
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(app, host=host, port=port)