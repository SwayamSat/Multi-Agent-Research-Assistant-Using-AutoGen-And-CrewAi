from typing import List

def approve_papers(indices: List[int], feedback: str = "") -> str:
    """
    Record user approval of specific papers.
    
    Args:
        indices (List[int]): List of indices of the papers to approve (1-based).
        feedback (str): Optional feedback or instructions for the next step.
        
    Returns:
        str: Confirmation message.
    """
    return f"Papers {indices} approved. Feedback: {feedback}"
