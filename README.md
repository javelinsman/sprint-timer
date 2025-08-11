# Literature Manager System

A comprehensive literature query and review management system with MongoDB backend, FastAPI server, and LLM agent integration.

## System Architecture

The system consists of:
- **MongoDB Database**: Stores papers, queries, review sessions, and notes
- **FastAPI Server**: Provides REST API endpoints for all operations
- **Semantic Scholar Integration**: Fetches paper metadata and searches
- **LLM Agent Interface**: Processes PDFs and generates summaries
- **Web Interface** (to be integrated): User interface for managing papers

## Features

### Core Functionality
1. **Query Management** (a): Search and fetch papers from Semantic Scholar
2. **Gatekeeping** (b): Review and select papers for import
3. **PDF Management** (c): Upload and store PDF files
4. **Summary Generation** (d): LLM agent generates summaries for papers
5. **Overview** (e): Comprehensive view of all papers and their status
6. **Review Sessions** (f): Timed review sessions with note-taking

### Paper Workflow
1. User creates query → Papers fetched from Semantic Scholar (status: QUERIED)
2. User reviews papers → Selects papers to gate (status: GATED)
3. User imports papers → Marks for import (status: IMPORTED)
4. User uploads PDFs → Files stored locally (status: PDF_READY)
5. LLM agent processes → Generates summaries (status: SUMMARIZED)

## Installation

### Prerequisites
- Python 3.13+
- MongoDB (local or Atlas)
- Virtual environment at `env/`

### Setup
```bash
# Install dependencies
source env/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URL

# Start MongoDB (if local)
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Start the server
./start_server.sh
# Or directly: python main.py
```

## API Endpoints

### Query Management
- `POST /api/queries/` - Create query and fetch papers
- `GET /api/queries/` - List all queries
- `GET /api/queries/{id}/papers` - Get papers from query

### Paper Management
- `GET /api/papers/` - List papers (with filters)
- `GET /api/papers/{id}` - Get specific paper
- `POST /api/papers/{id}/gate` - Mark as gated
- `POST /api/papers/{id}/import` - Mark as imported
- `POST /api/papers/{id}/pdf` - Upload PDF file
- `POST /api/papers/{id}/summary` - Save summary

### Review Sessions
- `POST /api/review-sessions/` - Create session
- `GET /api/review-sessions/` - List sessions
- `GET /api/review-sessions/{id}` - Get session details
- `POST /api/review-sessions/{id}/papers/{paper_id}/complete` - Mark paper reviewed

### Review Notes
- `POST /api/review-notes/` - Create note
- `GET /api/review-notes/paper/{id}` - Get notes for paper
- `GET /api/review-notes/session/{id}` - Get notes for session

### LLM Agent Endpoints
- `GET /api/summary-queue/` - Get papers needing summaries
- `POST /api/summary-queue/{id}/process` - Mark as processing
- `POST /api/papers/{id}/summary` - Save generated summary

### Overview
- `GET /api/overview/` - Get system statistics

## Testing

Run the test suite to verify installation:
```bash
# Start server in one terminal
./start_server.sh

# Run tests in another terminal
python test_api.py
```

## LLM Agent Usage

The LLM agent should:
1. Fetch pending papers from `/api/summary-queue/`
2. Mark each as processing
3. Read PDF file from provided path
4. Generate summary
5. Save via `/api/papers/{id}/summary`

See `LLM_AGENT_GUIDE.md` for detailed instructions.

## Database Schema

### Collections
- **papers**: Paper metadata and status
- **queries**: Search queries and results
- **review_sessions**: Review session configuration
- **review_notes**: Notes from review sessions
- **summary_queue**: Queue for PDF processing

### Paper Status Flow
```
QUERIED → GATED → IMPORTED → PDF_READY → SUMMARIZED
```

## Integration Points

### Web Interface (@lit-timer)
The React-based timer interface can be integrated with:
- Review session API endpoints
- Real-time progress tracking
- Note submission

### PDF Storage
PDFs are stored in `stored_pdfs/` directory with naming convention:
`{semantic_scholar_id}.pdf`

### Future Enhancements
- Batch PDF upload
- Automatic PDF download (where available)
- Citation network visualization
- Recommendation system
- Export functionality

## Environment Variables

```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=litmanager
HOST=0.0.0.0
PORT=8000
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list`
- Check connection URL in `.env`
- Verify database permissions

### Semantic Scholar Rate Limits
- API has rate limits for searches
- Consider adding delays between queries
- Use API key for higher limits (optional)

### PDF Processing
- Ensure `stored_pdfs/` directory has write permissions
- Check file size limits in upload endpoint
- Verify PDF path in summary queue

## Project Structure
```
lit-sprint/
├── database/
│   ├── __init__.py
│   ├── connection.py      # MongoDB connection
│   └── models.py          # Pydantic models
├── services/
│   ├── __init__.py
│   ├── semantic_scholar.py # SS API integration
│   ├── paper_service.py   # Paper operations
│   └── review_service.py  # Review operations
├── stored_pdfs/           # PDF storage
├── main.py               # FastAPI application
├── requirements.txt      # Dependencies
├── .env.example         # Environment template
├── start_server.sh      # Startup script
├── test_api.py         # Test suite
├── LLM_AGENT_GUIDE.md  # Agent documentation
└── README.md          # This file
```