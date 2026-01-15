import arxiv
from typing import List, Dict, Any

def search_arxiv(query: str, max_results: int = 5, sort_by_relevance: bool = True) -> List[Dict[str, Any]]:
    """
    Search arXiv for papers based on a query.

    Args:
        query (str): The search query (e.g., 'multi-agent systems', 'cat:cs.AI').
        max_results (int): Maximum number of results to return.
        sort_by_relevance (bool): Whether to sort by relevance (True) or submitted date (False).

    Returns:
        List[Dict[str, Any]]: A list of dictionaries containing paper details.
    """
    client = arxiv.Client()
    
    sort_criterion = arxiv.SortCriterion.Relevance if sort_by_relevance else arxiv.SortCriterion.SubmittedDate

    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=sort_criterion
    )

    results = []
    for r in client.results(search):
        results.append({
            "title": r.title,
            "summary": r.summary,
            "url": r.entry_id,
            "published": str(r.published.date()),
            "authors": [a.name for a in r.authors],
            "categories": r.categories
        })
    
    return results

if __name__ == "__main__":
    # Test the function
    papers = search_arxiv("multi-agent reinforcement learning", max_results=2)
    for p in papers:
        print(f"Title: {p['title']}")
        print(f"URL: {p['url']}")
        print("-" * 20)
