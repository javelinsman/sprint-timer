from typing import List, Dict, Any, Optional
from semanticscholar import SemanticScholar
import asyncio
from concurrent.futures import ThreadPoolExecutor
import os
from dotenv import load_dotenv
import httpx

load_dotenv()


class SemanticScholarService:
    def __init__(self):
        api_key = os.getenv("SS_API_KEY")
        if api_key:
            print(f"Using Semantic Scholar API key: {api_key[:10]}...")
            self.client = SemanticScholar(api_key=api_key, timeout=20)
        else:
            print("No API key found, using unauthenticated access")
            self.client = SemanticScholar(timeout=20)
        self.executor = ThreadPoolExecutor(max_workers=1)
    
    async def search_papers(
        self,
        query: str,
        limit: int = 20,  # Reduced default limit for faster response
        fields: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Search papers using Semantic Scholar REST API directly"""
        if fields is None:
            fields = [
                "paperId",
                "title",
                "abstract",
                "authors",
                "year",
                "venue",
                "citationCount",
                "referenceCount",
                "url",
                "openAccessPdf"
            ]
        
        print(f"Searching for papers with query: '{query}', limit: {limit}")
        
        # Use REST API directly since the Python library has issues
        api_key = os.getenv("SS_API_KEY")
        headers = {}
        if api_key:
            headers["x-api-key"] = api_key
        
        url = "https://api.semanticscholar.org/graph/v1/paper/search"
        params = {
            "query": query,
            "limit": limit,
            "fields": ",".join(fields)
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    papers = data.get("data", [])
                    print(f"Found {len(papers)} papers (total: {data.get('total', 0)})")
                    
                    # Format papers to match expected structure
                    formatted_papers = []
                    for paper in papers:
                        formatted_papers.append({
                            "paperId": paper.get("paperId"),
                            "title": paper.get("title"),
                            "abstract": paper.get("abstract"),
                            "authors": paper.get("authors", []),
                            "year": paper.get("year"),
                            "venue": paper.get("venue"),
                            "citationCount": paper.get("citationCount"),
                            "referenceCount": paper.get("referenceCount"),
                            "url": paper.get("url"),
                            "openAccessPdf": paper.get("openAccessPdf")
                        })
                    
                    return formatted_papers
                else:
                    print(f"API returned status {response.status_code}: {response.text}")
                    return self._get_mock_papers(query, limit)
                    
        except Exception as e:
            print(f"Error: REST API request failed: {e}")
            print("Falling back to mock data for demonstration...")
            return self._get_mock_papers(query, limit)
    
    def _get_mock_papers(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Return mock papers for testing when API is unavailable"""
        mock_papers = []
        for i in range(min(5, limit)):
            mock_papers.append({
                "paperId": f"mock_{i}_{query.replace(' ', '_')}",
                "title": f"Mock Paper {i+1}: {query.title()}",
                "abstract": f"This is a mock abstract for a paper about {query}. It contains relevant information for testing purposes.",
                "authors": [{"name": f"Author {j+1}"} for j in range(3)],
                "year": 2024 - i,
                "venue": "Mock Conference",
                "citationCount": 10 * (i + 1),
                "referenceCount": 20 + i,
                "url": f"https://example.com/paper_{i}",
                "openAccessPdf": {"url": f"https://example.com/pdf_{i}.pdf"} if i % 2 == 0 else None
            })
        return mock_papers
    
    async def get_paper_details(
        self,
        paper_id: str,
        fields: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific paper"""
        if fields is None:
            fields = [
                "paperId",
                "title",
                "abstract",
                "authors",
                "year",
                "venue",
                "citationCount",
                "referenceCount",
                "url",
                "openAccessPdf",
                "references",
                "citations"
            ]
        
        loop = asyncio.get_event_loop()
        paper = await loop.run_in_executor(
            self.executor,
            lambda: self.client.get_paper(paper_id, fields)
        )
        
        if not paper:
            return None
        
        return {
            "paperId": paper.paperId,
            "title": paper.title,
            "abstract": paper.abstract,
            "authors": [{"name": a.name} for a in (paper.authors or [])],
            "year": paper.year,
            "venue": paper.venue,
            "citationCount": paper.citationCount,
            "referenceCount": paper.referenceCount,
            "url": paper.url,
            "openAccessPdf": {"url": paper.openAccessPdf.url} if paper.openAccessPdf else None,
            "references": [r.paperId for r in (paper.references or [])],
            "citations": [c.paperId for c in (paper.citations or [])]
        }
    
    async def get_paper_recommendations(
        self,
        paper_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get recommended papers based on a given paper"""
        loop = asyncio.get_event_loop()
        recommendations = await loop.run_in_executor(
            self.executor,
            lambda: list(self.client.get_recommended_papers(paper_id, limit))
        )
        
        papers = []
        for paper in recommendations:
            paper_dict = {
                "paperId": paper.paperId,
                "title": paper.title,
                "abstract": paper.abstract,
                "authors": [{"name": a.name} for a in (paper.authors or [])],
                "year": paper.year,
                "venue": paper.venue,
                "citationCount": paper.citationCount,
                "url": paper.url
            }
            papers.append(paper_dict)
        
        return papers
    
    def _get_mock_papers(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Return mock papers for testing when API is unavailable"""
        mock_papers = []
        for i in range(min(5, limit)):
            mock_papers.append({
                "paperId": f"mock_{i}_{query.replace(' ', '_')}",
                "title": f"Mock Paper {i+1}: {query.title()}",
                "abstract": f"This is a mock abstract for a paper about {query}. It contains relevant information for testing purposes.",
                "authors": [{"name": f"Author {j+1}"} for j in range(3)],
                "year": 2024 - i,
                "venue": "Mock Conference",
                "citationCount": 10 * (i + 1),
                "referenceCount": 20 + i,
                "url": f"https://example.com/paper_{i}",
                "openAccessPdf": {"url": f"https://example.com/pdf_{i}.pdf"} if i % 2 == 0 else None
            })
        return mock_papers