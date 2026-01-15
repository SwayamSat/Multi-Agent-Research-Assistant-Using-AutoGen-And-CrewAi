import asyncio
import os
from dotenv import load_dotenv
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_core.tools import FunctionTool
from tools.custom_gemini_client import CustomGeminiClient
# Import agents
from agents.research_agents import create_research_agents
from agents.user_proxy import create_user_proxy
from tools.arxiv_search import search_arxiv

# Load env variables
load_dotenv()

async def run_workflow():
    # Load config from env
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return

    # Initialize Model Client using CustomGeminiClient
    model_client = CustomGeminiClient(
        api_key=api_key,
        model="gemini-1.5-flash"
    )

    # Prepare Tools
    # search_arxiv needs to be a Tool
    paper_search_tool = FunctionTool(
        search_arxiv, 
        description="Search arXiv for papers based on a query."
    )
    
    # Create Agents
    # Pass tools to create_research_agents so they can be assigned to Paper_Discovery_Agent
    agents_dict = create_research_agents(model_client, paper_discovery_tools=[paper_search_tool])
    user_proxy = create_user_proxy()

    # Define the Team
    # We use RoundRobin for simplicity as per original design intention
    # Termination: "TERMINATE"
    termination = TextMentionTermination(text="TERMINATE")
    
    team = RoundRobinGroupChat(
        participants=[
            user_proxy,
            agents_dict["topic_refinement_agent"],
            agents_dict["paper_discovery_agent"],
            agents_dict["insight_agent"],
            agents_dict["report_agent"],
            agents_dict["gap_agent"]
        ],
        termination_condition=termination
    )

    # Run the workflow
    print("Initiating Research Assistant (AutoGen 0.4)...")
    initial_message = """I want to research "Multi-Agent Systems for Autonomous Driving". 
Please refine this topic, find relevant papers, synthesize insights, compile a report, and identify research gaps.
"""
    
    # Run
    await team.run(task=initial_message)

def main():
    asyncio.run(run_workflow())

if __name__ == "__main__":
    main()
