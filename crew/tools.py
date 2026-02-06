from crewai.tools import tool
import arxiv
from typing import List, Dict, Any

class ArxivTools:
    @tool("Search arXiv")
    def search_arxiv(query: str):
        """
        Search arXiv for papers based on a query. 
        Useful for finding research papers on specific topics.
        """
        # Default parameters
        max_results = 5
        sort_by_relevance = True
        
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
                "summary": r.summary.replace("\n", " "),
                "url": r.entry_id,
                "published": str(r.published.date()),
                "authors": [a.name for a in r.authors],
                "categories": r.categories
            })
        
        # Format the results into a string for the LLM
        output = ""
        for p in results:
            output += f"Title: {p['title']}\nURL: {p['url']}\nSummary: {p['summary']}\n---\n"
            
        return output
