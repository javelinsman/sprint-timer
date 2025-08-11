#!/usr/bin/env python3
"""
Test script for Literature Manager API
Run this after starting the server to test basic functionality
"""

import requests
import json
import time

import os
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv("PORT", "8000")
SERVER_URL = f"http://localhost:{PORT}"

def test_server_connection():
    """Test if server is running"""
    try:
        response = requests.get(f"{SERVER_URL}/")
        if response.status_code == 200:
            print("✓ Server is running")
            print(f"  Response: {response.json()}")
            return True
        else:
            print("✗ Server returned error")
            return False
    except requests.ConnectionError:
        print("✗ Cannot connect to server. Please start the server first.")
        return False

def test_create_query():
    """Test creating a literature query"""
    print("\n2. Testing query creation...")
    
    query_data = {
        "query_string": "visual analytics literature review",
        "description": "Test query for visual analytics papers"
    }
    
    response = requests.post(
        f"{SERVER_URL}/api/queries/",
        params=query_data
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Query created successfully")
        print(f"  Query ID: {result.get('query_id')}")
        print(f"  Papers found: {result.get('papers_found')}")
        return result.get('query_id')
    else:
        print(f"✗ Failed to create query: {response.status_code}")
        print(f"  Error: {response.text}")
        return None

def test_list_queries():
    """Test listing queries"""
    print("\n3. Testing query listing...")
    
    response = requests.get(f"{SERVER_URL}/api/queries/")
    
    if response.status_code == 200:
        queries = response.json()
        print(f"✓ Listed {len(queries)} queries")
        for q in queries[:3]:  # Show first 3
            print(f"  - {q.get('query_string')} ({q.get('total_results')} papers)")
        return True
    else:
        print(f"✗ Failed to list queries: {response.status_code}")
        return False

def test_list_papers():
    """Test listing papers"""
    print("\n4. Testing paper listing...")
    
    response = requests.get(f"{SERVER_URL}/api/papers/")
    
    if response.status_code == 200:
        papers = response.json()
        print(f"✓ Listed {len(papers)} papers")
        for p in papers[:3]:  # Show first 3
            print(f"  - {p.get('title', 'No title')[:60]}...")
        return True
    else:
        print(f"✗ Failed to list papers: {response.status_code}")
        return False

def test_get_overview():
    """Test overview endpoint"""
    print("\n5. Testing overview endpoint...")
    
    response = requests.get(f"{SERVER_URL}/api/overview/")
    
    if response.status_code == 200:
        overview = response.json()
        print(f"✓ Got overview successfully")
        print(f"  Total papers: {overview.get('total_papers')}")
        print(f"  Papers with PDF: {overview.get('papers_with_pdf')}")
        print(f"  Papers with summary: {overview.get('papers_with_summary')}")
        print(f"  Total queries: {overview.get('total_queries')}")
        return True
    else:
        print(f"✗ Failed to get overview: {response.status_code}")
        return False

def test_create_review_session():
    """Test creating a review session"""
    print("\n6. Testing review session creation...")
    
    # First get some papers
    response = requests.get(f"{SERVER_URL}/api/papers/")
    if response.status_code != 200:
        print("✗ Cannot get papers for review session")
        return None
    
    papers = response.json()
    if len(papers) < 2:
        print("✗ Not enough papers for review session (need at least 2)")
        return None
    
    # Create session with first 3 papers
    paper_ids = [p["semantic_scholar_id"] for p in papers[:3]]
    
    session_data = {
        "name": "Test Review Session",
        "paper_ids": paper_ids,
        "time_per_paper": 30  # 30 minutes per paper
    }
    
    response = requests.post(
        f"{SERVER_URL}/api/review-sessions/",
        params={
            "name": session_data["name"],
            "time_per_paper": session_data["time_per_paper"]
        },
        json=paper_ids
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Review session created")
        print(f"  Session ID: {result.get('session_id')}")
        return result.get('session_id')
    else:
        print(f"✗ Failed to create review session: {response.status_code}")
        print(f"  Error: {response.text}")
        return None

def test_summary_queue():
    """Test summary queue endpoint"""
    print("\n7. Testing summary queue...")
    
    response = requests.get(f"{SERVER_URL}/api/summary-queue/")
    
    if response.status_code == 200:
        queue = response.json()
        print(f"✓ Got summary queue")
        print(f"  Pending items: {len(queue)}")
        for item in queue[:2]:  # Show first 2
            print(f"  - {item.get('paper_title', 'No title')[:50]}...")
        return True
    else:
        print(f"✗ Failed to get summary queue: {response.status_code}")
        return False

def main():
    print("=" * 60)
    print("Literature Manager API Test Suite")
    print("=" * 60)
    
    # Test 1: Server connection
    print("\n1. Testing server connection...")
    if not test_server_connection():
        print("\nPlease start the server first:")
        print("  ./start_server.sh")
        return
    
    # Small delay between tests
    time.sleep(0.5)
    
    # Test 2: Create query (this will fetch papers from Semantic Scholar)
    query_id = test_create_query()
    time.sleep(0.5)
    
    # Test 3: List queries
    test_list_queries()
    time.sleep(0.5)
    
    # Test 4: List papers
    test_list_papers()
    time.sleep(0.5)
    
    # Test 5: Get overview
    test_get_overview()
    time.sleep(0.5)
    
    # Test 6: Create review session
    session_id = test_create_review_session()
    time.sleep(0.5)
    
    # Test 7: Summary queue
    test_summary_queue()
    
    print("\n" + "=" * 60)
    print("Test suite completed!")
    print("=" * 60)

if __name__ == "__main__":
    main()