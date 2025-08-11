from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class PaperStatus(str, Enum):
    QUERIED = "queried"
    GATED = "gated"
    IMPORTED = "imported"
    PDF_READY = "pdf_ready"
    SUMMARIZED = "summarized"
    REJECTED = "rejected"


class Paper(BaseModel):
    semantic_scholar_id: str
    title: str
    authors: List[str]
    year: Optional[int] = None
    abstract: Optional[str] = None
    venue: Optional[str] = None
    citation_count: Optional[int] = None
    reference_count: Optional[int] = None
    url: Optional[str] = None
    pdf_url: Optional[str] = None
    
    status: PaperStatus = PaperStatus.QUERIED
    query_tags: List[str] = Field(default_factory=list)
    pdf_stored: bool = False
    pdf_path: Optional[str] = None
    summary_note: Optional[str] = None
    summary_created_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class Query(BaseModel):
    id: Optional[str] = None
    query_string: str
    description: Optional[str] = None
    paper_ids: List[str] = Field(default_factory=list)
    total_results: int = 0
    gated_count: int = 0
    imported_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_run: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ReviewSession(BaseModel):
    id: Optional[str] = None
    name: str
    paper_ids: List[str] = Field(default_factory=list)
    time_per_paper: int  # in minutes
    total_time: int  # in minutes
    completed_papers: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ReviewNote(BaseModel):
    id: Optional[str] = None
    paper_id: str
    session_id: str
    content: str
    time_spent: int  # in seconds
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class SummaryQueueItem(BaseModel):
    paper_id: str
    pdf_path: str
    status: str = "pending"  # pending, processing, completed, failed
    error_message: Optional[str] = None
    added_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None