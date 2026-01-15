from autogen_agentchat.agents import AssistantAgent
from autogen_core.models import ChatCompletionClient
from typing import Dict, List, Any

def create_research_agents(model_client: ChatCompletionClient, paper_discovery_tools: List[Any] = []) -> Dict[str, AssistantAgent]:
    """
    Creates and returns the research agents with specific system messages.
    """
    
    # Task 3: Topic Refinement Agent
    topic_refinement_agent = AssistantAgent(
        name="Topic_Refinement_Agent",
        model_client=model_client,
        system_message="""You are an expert Research Topic Refiner.
Your goal is to help the user clarify and refine their research topic.
1. Analyze the user's initial query.
2. Suggest 3-5 subtopics or specific research directions.
3. Ask clarifying questions if the topic is too broad.
4. Output the REFINED TOPIC clearly.
Reply with 'TERMINATE' when your task is complete.
"""
    )

    # Task 4: Paper Discovery Agent
    paper_discovery_agent = AssistantAgent(
        name="Paper_Discovery_Agent",
        model_client=model_client,
        tools=paper_discovery_tools,
        system_message="""You are a Paper Discovery Specialist.
Your goal is to find the most relevant papers for the refined topic.
1. Use the 'search_arxiv' tool to find papers.
2. You can perform multiple searches with different queries if needed.
3. Filter results by relevance and recency (handled by the tool, but you choose the query).
4. List the selected papers with their titles, URLs, and brief summaries.
Reply with 'TERMINATE' when your task is complete.
"""
    )

    # Task 5: Insight Synthesizer Agent
    insight_agent = AssistantAgent(
        name="Insight_Synthesizer_Agent",
        model_client=model_client,
        system_message="""You are a Research Insight Synthesizer.
Your goal is to extract key findings from the discovered papers.
1. Read the titles and abstracts (and content if provided) of the discovered papers.
2. Synthesize common themes, methodologies, and results.
3. Identify contradictions or consensus among the papers.
4. Provide a structured summary of insights.
Reply with 'TERMINATE' when your task is complete.
"""
    )

    # Task 6: Report Compiler Agent
    report_agent = AssistantAgent(
        name="Report_Compiler_Agent",
        model_client=model_client,
        system_message="""You are a Professional Report Compiler.
Your goal is to compile the research findings into a coherent report.
Format the report with:
- Title
- Executive Summary
- Key Findings (synthesized from insights)
- Methodology Review
- Conclusion
Ensure the tone is academic and professional.
Reply with 'TERMINATE' when your task is complete.
"""
    )

    # Task 7: Gap Analysis Agent
    gap_agent = AssistantAgent(
        name="Gap_Analysis_Agent",
        model_client=model_client,
        system_message="""You are a Research Gap Analyst.
Your goal is to identify missing pieces in the current literature.
1. Analyze the compiled report.
2. Identify unanswered questions, limitations in current studies, or underexplored areas.
3. Suggest specific future research directions or experiments.
Reply with 'TERMINATE' when your task is complete.
"""
    )

    return {
        "topic_refinement_agent": topic_refinement_agent,
        "paper_discovery_agent": paper_discovery_agent,
        "insight_agent": insight_agent,
        "report_agent": report_agent,
        "gap_agent": gap_agent
    }
