# Literature Management System Architecture

## Overview
A comprehensive literature management system that enables users to search, collect, summarize, and review academic papers. The system uses Semantic Scholar as the primary data source and MongoDB for persistence, with manual user intervention for PDF acquisition and LLM-assisted summarization.

## Core Components

### 1. Database Schema (MongoDB)

#### Collections

**papers**
```javascript
{
  _id: ObjectId,
  semantic_scholar_id: String (unique, primary identifier),
  title: String,
  authors: [String],
  abstract: String,
  year: Number,
  venue: String,
  citation_count: Number,
  reference_count: Number,
  doi: String,
  arxiv_id: String,
  pdf_url: String (from Semantic Scholar),
  pdf_stored: Boolean (default: false),
  pdf_path: String (GridFS reference or file path),
  note_exists: Boolean (default: false),
  note_path: String,
  status: String (enum: ['discovered', 'imported', 'pdf_uploaded', 'summarized']),
  created_at: Date,
  updated_at: Date
}
```

**queries**
```javascript
{
  _id: ObjectId,
  query_string: String,
  search_parameters: Object (fields, year_range, etc.),
  result_count: Number,
  paper_ids: [String] (semantic_scholar_ids),
  executed_at: Date,
  user_id: String (if implementing user management)
}
```

**paper_queries** (Many-to-Many relationship)
```javascript
{
  _id: ObjectId,
  paper_id: String (semantic_scholar_id),
  query_id: ObjectId,
  position_in_results: Number,
  added_to_library: Boolean,
  added_at: Date
}
```

**import_queue**
```javascript
{
  _id: ObjectId,
  query_id: ObjectId,
  paper_id: String (semantic_scholar_id),
  status: String (enum: ['pending', 'approved', 'rejected']),
  reviewed_at: Date
}
```

**summarization_queue**
```javascript
{
  _id: ObjectId,
  paper_id: String (semantic_scholar_id),
  pdf_path: String,
  status: String (enum: ['pending', 'processing', 'completed', 'failed']),
  error_message: String,
  created_at: Date,
  completed_at: Date
}
```

**review_sessions**
```javascript
{
  _id: ObjectId,
  title: String,
  paper_ids: [String] (semantic_scholar_ids),
  status: String (enum: ['active', 'paused', 'completed']),
  time_allocations: [{
    paper_id: String,
    allocated_minutes: Number,
    spent_minutes: Number
  }],
  created_at: Date,
  completed_at: Date
}
```

**review_notes**
```javascript
{
  _id: ObjectId,
  session_id: ObjectId,
  paper_id: String (semantic_scholar_id),
  content: String (markdown),
  created_at: Date,
  updated_at: Date
}
```

### 2. FastAPI Server Implementation

#### Base Configuration
```python
# config.py
SEMANTIC_SCHOLAR_API_KEY = "..."
MONGODB_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "literature_manager"
PDF_STORAGE_PATH = "./pdfs"
NOTES_STORAGE_PATH = "./notes"
```

#### API Endpoints

##### Query Management
```
POST /api/queries/execute
Body: {
  query: string,
  limit?: number (default: 100),
  fields?: string[],
  year_range?: [start, end]
}
Response: {
  query_id: string,
  results: [paper_metadata],
  total_count: number
}
```

```
GET /api/queries
Response: [{
  query_id: string,
  query_string: string,
  executed_at: datetime,
  result_count: number,
  imported_count: number
}]
```

```
GET /api/queries/{query_id}/results
Response: [{
  paper: paper_metadata,
  in_library: boolean,
  has_pdf: boolean,
  has_note: boolean
}]
```

##### Gatekeeping
```
POST /api/import/review
Body: {
  query_id: string,
  approved_paper_ids: [string],
  rejected_paper_ids: [string]
}
Response: {
  imported_count: number,
  papers_needing_pdf: [paper_id]
}
```

##### PDF Management
```
POST /api/papers/{paper_id}/upload-pdf
Body: multipart/form-data with PDF file
Response: {
  success: boolean,
  paper_id: string,
  added_to_summarization_queue: boolean
}
```

```
GET /api/papers/pending-pdfs
Response: [{
  paper_id: string,
  title: string,
  pdf_url: string (from Semantic Scholar if available),
  added_at: datetime
}]
```

##### Summarization Queue (for LLM Agent)
```
GET /api/summarization/queue
Response: [{
  paper_id: string,
  title: string,
  pdf_path: string,
  status: string
}]
```

```
GET /api/summarization/next
Response: {
  paper_id: string,
  title: string,
  pdf_path: string
} or null
```

```
POST /api/summarization/complete
Body: {
  paper_id: string,
  summary_content: string (markdown),
  note_path: string
}
Response: {
  success: boolean,
  next_paper: paper_metadata or null
}
```

##### Paper Overview
```
GET /api/papers
Query params: 
  - has_pdf: boolean
  - has_note: boolean
  - query_id: string
  - review_session_id: string
Response: [{
  paper_id: string,
  title: string,
  authors: [string],
  year: number,
  status: string,
  has_pdf: boolean,
  has_note: boolean,
  from_queries: [query_info],
  review_sessions: [session_info],
  citation_count: number
}]
```

```
GET /api/papers/{paper_id}
Response: {
  ...complete paper metadata,
  pdf_path: string,
  note_path: string,
  queries: [query_info],
  review_notes: [review_note]
}
```

##### Review Sessions
```
POST /api/reviews/create
Body: {
  title: string,
  paper_ids: [string],
  time_allocations?: [{
    paper_id: string,
    minutes: number
  }]
}
Response: {
  session_id: string,
  access_url: string
}
```

```
GET /api/reviews/sessions
Response: [{
  session_id: string,
  title: string,
  status: string,
  paper_count: number,
  created_at: datetime,
  progress_percentage: number
}]
```

```
GET /api/reviews/{session_id}
Response: {
  session_info,
  papers: [paper_with_allocation],
  notes: [review_note]
}
```

```
POST /api/reviews/{session_id}/notes
Body: {
  paper_id: string,
  content: string (markdown)
}
Response: {
  note_id: string,
  saved: boolean
}
```

```
PUT /api/reviews/{session_id}/status
Body: {
  status: string ('paused' | 'completed')
}
```

### 3. LLM Agent Integration

#### Commands for LLM Agent

The LLM agent should be invoked manually with these commands:

**Process Summarization Queue**
```bash
# Command the user will run
llm-agent summarize-papers

# What the agent should do:
1. GET /api/summarization/queue to see all pending papers
2. For each pending paper:
   a. GET /api/summarization/next to claim a paper
   b. Read PDF from provided path
   c. Generate comprehensive summary markdown
   d. Save summary to notes directory
   e. POST /api/summarization/complete with summary content
3. Continue until queue is empty
```

**Review Session Support**
```bash
# Command the user will run
llm-agent assist-review --session-id <id>

# What the agent should do:
1. GET /api/reviews/{session_id} to get session details
2. For each paper in session:
   a. Read PDF and existing summary
   b. Provide interactive assistance during review
   c. Help formulate review notes
3. Save notes via POST /api/reviews/{session_id}/notes
```

### 4. Frontend Requirements

#### Views

**Query Management View**
- Execute new queries with parameters
- View query history
- See results per query with import status

**Gatekeeping View**
- Display query results in cards/table
- Show paper metadata (title, authors, abstract preview)
- Checkbox selection for import
- Batch approve/reject buttons
- Visual indicators for already-imported papers

**PDF Upload View**
- List of papers needing PDFs
- Drag-and-drop upload zone
- Direct links to paper URLs
- Batch upload support
- Progress indicators

**Paper Library View**
- Filterable/sortable table of all papers
- Columns: Title, Authors, Year, Status, PDF, Note, Queries, Reviews
- Quick filters: Has PDF, Has Note, By Query, By Review Session
- Search functionality
- Export capabilities

**Review Session View**
- Create new review session
- Select papers for review
- Set time allocations
- Timer interface (like current lit-timer)
- Split view: PDF + Notes
- Session pause/resume
- Progress tracking

### 5. Implementation Workflow

#### Phase 1: Database and Basic Server
1. Set up MongoDB with collections
2. Implement Semantic Scholar integration
3. Create query execution and storage endpoints
4. Build import queue management

#### Phase 2: PDF and Summarization Pipeline
1. Implement PDF upload endpoints
2. Create summarization queue
3. Document LLM agent commands
4. Test PDF storage (GridFS vs filesystem)

#### Phase 3: Review System
1. Build review session management
2. Create note-taking endpoints
3. Integrate timer functionality
4. Link papers to review sessions

#### Phase 4: Frontend Integration
1. Adapt current lit-timer for review sessions
2. Build query and gatekeeping interfaces
3. Create paper library view
4. Implement PDF upload workflow

#### Phase 5: LLM Agent Scripts
1. Create summarization script
2. Build review assistance script
3. Add batch processing capabilities
4. Implement error handling and retry logic

### 6. Data Flow Examples

#### Query to Library Flow
```
User executes query → Server fetches from Semantic Scholar
→ Results stored in DB → User reviews in gatekeeping view
→ User selects papers → Papers marked for import
→ System shows PDF needed → User uploads PDFs
→ PDFs stored → Added to summarization queue
→ User runs LLM agent → Summaries generated
→ Papers fully processed in library
```

#### Review Session Flow
```
User selects papers → Creates review session
→ Sets time allocations → Starts timer
→ Views PDF + Notes → Writes review notes
→ Pauses/resumes as needed → Marks complete
→ Review notes linked to papers permanently
```

### 7. Technical Considerations

#### Semantic Scholar API Manager
**Centralized Rate-Limited API Manager Implementation**

```python
# semantic_scholar_manager.py
import asyncio
import time
from typing import Optional, Dict, Any, List
from collections import deque
from datetime import datetime, timedelta
import aiohttp
from fastapi import HTTPException

class SemanticScholarManager:
    """
    Centralized manager for Semantic Scholar API requests.
    Enforces 1 request per second rate limit.
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.semanticscholar.org/graph/v1"
        self.last_request_time = 0
        self.request_queue = deque()
        self.cache = {}  # Simple in-memory cache
        self.cache_ttl = 3600  # 1 hour cache TTL
        self.min_interval = 1.0  # 1 second between requests
        self._lock = asyncio.Lock()
        self._processing = False
        
    async def _wait_for_rate_limit(self):
        """Ensure we don't exceed 1 request per second"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.min_interval:
            await asyncio.sleep(self.min_interval - time_since_last)
        self.last_request_time = time.time()
    
    async def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make actual API request with rate limiting"""
        async with self._lock:
            await self._wait_for_rate_limit()
            
            headers = {"x-api-key": self.api_key} if self.api_key else {}
            url = f"{self.base_url}/{endpoint}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, params=params) as response:
                    if response.status == 429:  # Rate limited
                        retry_after = int(response.headers.get('Retry-After', 60))
                        raise HTTPException(
                            status_code=429,
                            detail=f"Rate limited. Retry after {retry_after} seconds"
                        )
                    response.raise_for_status()
                    return await response.json()
    
    async def search_papers(self, query: str, limit: int = 100, 
                           fields: List[str] = None, 
                           year_range: tuple = None) -> Dict:
        """
        Search papers with caching and rate limiting
        """
        # Generate cache key
        cache_key = f"search:{query}:{limit}:{fields}:{year_range}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if time.time() - cached_time < self.cache_ttl:
                return cached_data
        
        # Prepare parameters
        params = {
            "query": query,
            "limit": limit,
            "fields": ",".join(fields) if fields else "paperId,title,authors,abstract,year,venue,citationCount,referenceCount,externalIds,openAccessPdf"
        }
        
        if year_range:
            params["year"] = f"{year_range[0]}-{year_range[1]}"
        
        # Make request
        result = await self._make_request("paper/search", params)
        
        # Cache result
        self.cache[cache_key] = (result, time.time())
        
        return result
    
    async def get_paper(self, paper_id: str, fields: List[str] = None) -> Dict:
        """
        Get single paper details with caching
        """
        cache_key = f"paper:{paper_id}:{fields}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if time.time() - cached_time < self.cache_ttl:
                return cached_data
        
        # Prepare parameters
        params = {
            "fields": ",".join(fields) if fields else "paperId,title,authors,abstract,year,venue,citationCount,referenceCount,externalIds,openAccessPdf"
        }
        
        # Make request
        result = await self._make_request(f"paper/{paper_id}", params)
        
        # Cache result
        self.cache[cache_key] = (result, time.time())
        
        return result
    
    async def batch_get_papers(self, paper_ids: List[str], 
                              fields: List[str] = None) -> List[Dict]:
        """
        Get multiple papers with rate limiting.
        Processes requests sequentially to respect rate limit.
        """
        results = []
        for paper_id in paper_ids:
            try:
                paper = await self.get_paper(paper_id, fields)
                results.append(paper)
            except Exception as e:
                results.append({"paperId": paper_id, "error": str(e)})
        return results
    
    async def get_paper_citations(self, paper_id: str, 
                                  limit: int = 100,
                                  fields: List[str] = None) -> Dict:
        """Get citations for a paper"""
        params = {
            "limit": limit,
            "fields": ",".join(fields) if fields else "paperId,title,authors,year,citationCount"
        }
        return await self._make_request(f"paper/{paper_id}/citations", params)
    
    async def get_paper_references(self, paper_id: str,
                                   limit: int = 100,
                                   fields: List[str] = None) -> Dict:
        """Get references for a paper"""
        params = {
            "limit": limit,
            "fields": ",".join(fields) if fields else "paperId,title,authors,year,citationCount"
        }
        return await self._make_request(f"paper/{paper_id}/references", params)
    
    def clear_cache(self):
        """Clear the cache manually"""
        self.cache.clear()
    
    def get_queue_status(self) -> Dict:
        """Get current queue and rate limit status"""
        return {
            "queue_length": len(self.request_queue),
            "last_request": datetime.fromtimestamp(self.last_request_time).isoformat() if self.last_request_time else None,
            "cache_size": len(self.cache),
            "processing": self._processing
        }

# Singleton instance
_semantic_scholar_manager = None

def get_semantic_scholar_manager(api_key: str) -> SemanticScholarManager:
    """Get or create the singleton Semantic Scholar manager"""
    global _semantic_scholar_manager
    if _semantic_scholar_manager is None:
        _semantic_scholar_manager = SemanticScholarManager(api_key)
    return _semantic_scholar_manager
```

**Integration in FastAPI Server**

```python
# main.py
from fastapi import FastAPI, Depends
from semantic_scholar_manager import get_semantic_scholar_manager

app = FastAPI()

# Initialize manager at startup
@app.on_event("startup")
async def startup_event():
    manager = get_semantic_scholar_manager(SEMANTIC_SCHOLAR_API_KEY)

# Dependency injection
async def get_ss_manager():
    return get_semantic_scholar_manager(SEMANTIC_SCHOLAR_API_KEY)

# Use in endpoints
@app.post("/api/queries/execute")
async def execute_query(
    query: QueryRequest,
    ss_manager: SemanticScholarManager = Depends(get_ss_manager)
):
    try:
        results = await ss_manager.search_papers(
            query.query,
            limit=query.limit,
            fields=query.fields,
            year_range=query.year_range
        )
        # Process and store results
        return results
    except HTTPException as e:
        if e.status_code == 429:
            # Handle rate limiting gracefully
            return {"error": "Rate limited", "retry_after": 60}
        raise

@app.get("/api/semantic-scholar/status")
async def get_api_status(
    ss_manager: SemanticScholarManager = Depends(get_ss_manager)
):
    return ss_manager.get_queue_status()
```

#### Benefits of Centralized Manager
- **Automatic rate limiting**: Ensures 1 req/sec limit is never exceeded
- **Request queuing**: Handles burst requests gracefully
- **Caching**: Reduces redundant API calls
- **Error handling**: Centralized retry logic and rate limit handling
- **Monitoring**: Track API usage and queue status
- **Thread-safe**: Uses asyncio locks for concurrent request safety

#### PDF Storage
- Option 1: MongoDB GridFS for PDFs in database
- Option 2: Filesystem with paths in database
- Consider size limits and backup strategies

#### LLM Agent Communication
- Agent pulls work from queue (poll-based)
- No direct server → agent push
- Idempotent operations for retry safety
- Clear error reporting for failed summaries

#### Frontend State Management
- Consider Redux/Zustand for complex state
- Optimistic updates for better UX
- WebSocket for real-time status updates (optional)

### 8. Security Considerations

- Validate uploaded PDFs (file type, size limits)
- Sanitize markdown content from LLM
- Rate limit API endpoints
- Consider user authentication for multi-user setup
- Secure storage of API keys

### 9. Future Enhancements

- Citation network visualization
- Automatic paper recommendations
- Collaborative review sessions
- Integration with reference managers (Zotero, Mendeley)
- Full-text search across PDFs and notes
- Paper relationship mapping
- Export to various formats (BibTeX, RIS)