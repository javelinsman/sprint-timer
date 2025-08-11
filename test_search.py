#!/usr/bin/env python
"""Test Semantic Scholar search directly"""

from semanticscholar import SemanticScholar
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("SS_API_KEY")
print(f"Using API key: {api_key[:10] if api_key else 'None'}...")

# Initialize client
sch = SemanticScholar(api_key=api_key, timeout=10)

print("Testing search with limit=2...")
try:
    # Search with very small limit
    results = sch.search_paper("machine learning", limit=2)
    papers = list(results)
    print(f"Found {len(papers)} papers")
    
    for i, paper in enumerate(papers, 1):
        print(f"{i}. {paper.title}")
        print(f"   Authors: {', '.join([a.name for a in (paper.authors or [])][:3])}")
        print(f"   Year: {paper.year}")
        
except Exception as e:
    print(f"Error: {e}")
    print(f"Error type: {type(e)}")