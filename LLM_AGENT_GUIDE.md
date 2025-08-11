# LLM Agent Guide for Literature Manager

This guide documents the endpoints and workflows that LLM agents should use to interact with the Literature Manager system.

## Overview

The LLM agent is responsible for:
1. Processing PDFs and generating summaries
2. Interacting with the server to get queued tasks
3. Saving results back to the server

**Important**: The LLM agent CANNOT:
- Perform web searches (use server endpoints)
- Download PDFs (requires user action)
- Directly modify the database (use server endpoints)

## Key Endpoints for LLM Agent

### 1. Get Summary Queue
```
GET http://localhost:8000/api/summary-queue/?status=pending
```
Returns list of papers that need summaries. Each item includes:
- `paper_id`: Semantic Scholar ID
- `pdf_path`: Local path to PDF file
- `paper_title`: Title of the paper
- `paper_authors`: List of authors

### 2. Mark Paper as Processing
```
POST http://localhost:8000/api/summary-queue/{paper_id}/process
```
Call this when you start processing a paper to prevent duplicate work.

### 3. Save Paper Summary
```
POST http://localhost:8000/api/papers/{paper_id}/summary
Body: { "summary": "your generated summary text" }
```
Save the generated summary. This will:
- Update the paper status to "SUMMARIZED"
- Mark the queue item as "completed"

## Workflow for Summary Generation

1. **Check Queue**: Call GET `/api/summary-queue/` to get pending papers
2. **Mark Processing**: For each paper you process, call POST `/api/summary-queue/{paper_id}/process`
3. **Read PDF**: Read the PDF file from the path provided in the queue item
4. **Generate Summary**: Create a comprehensive summary of the paper
5. **Save Summary**: Call POST `/api/papers/{paper_id}/summary` with the generated summary

## Example Python Script for LLM Agent

```python
import requests
import time

# Server configuration
SERVER_URL = "http://localhost:8000"

def process_summary_queue():
    # Get pending items
    response = requests.get(f"{SERVER_URL}/api/summary-queue/?status=pending")
    queue_items = response.json()
    
    print(f"Found {len(queue_items)} papers to summarize")
    
    for item in queue_items:
        paper_id = item['paper_id']
        pdf_path = item['pdf_path']
        title = item.get('paper_title', 'Unknown')
        
        print(f"Processing: {title}")
        
        # Mark as processing
        requests.post(f"{SERVER_URL}/api/summary-queue/{paper_id}/process")
        
        # TODO: Read PDF and generate summary
        # summary = generate_summary_from_pdf(pdf_path)
        summary = f"Summary for {title}..."  # Placeholder
        
        # Save summary
        response = requests.post(
            f"{SERVER_URL}/api/papers/{paper_id}/summary",
            json={"summary": summary}
        )
        
        if response.status_code == 200:
            print(f"✓ Completed: {title}")
        else:
            print(f"✗ Failed: {title}")
        
        time.sleep(1)  # Be nice to the server

if __name__ == "__main__":
    process_summary_queue()
```

## Other Useful Endpoints

### Get Paper Details
```
GET http://localhost:8000/api/papers/{paper_id}
```

### Get All Papers
```
GET http://localhost:8000/api/papers/
```
Query parameters:
- `status`: Filter by status (queried, gated, imported, pdf_ready, summarized)
- `has_pdf`: Filter by PDF availability (true/false)
- `has_summary`: Filter by summary availability (true/false)

### Get Overview
```
GET http://localhost:8000/api/overview/
```
Returns comprehensive statistics about the system.

## Running the Server

1. Install MongoDB locally or use MongoDB Atlas
2. Set environment variables in `.env`:
   ```
   MONGODB_URL=mongodb://localhost:27017
   DB_NAME=litmanager
   ```
3. Install dependencies: `source env/bin/activate && pip install -r requirements.txt`
4. Run server: `python main.py`

## Integration with Review Timer

The review timer interface (@lit-timer) can be integrated with the review session endpoints:
- Create sessions via POST `/api/review-sessions/`
- Track progress via POST `/api/review-sessions/{session_id}/papers/{paper_id}/complete`
- Save notes via POST `/api/review-notes/`