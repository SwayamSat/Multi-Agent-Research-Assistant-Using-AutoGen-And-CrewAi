import autogen
import os
from dotenv import load_dotenv
from agents.research_agents import create_research_agents
from agents.user_proxy import create_user_proxy
from tools.arxiv_search import search_arxiv
from tools.user_interaction import approve_papers

# Load env variables
load_dotenv()

def main():
    # Load config
    # Load config from env
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return

    config_list = [
        {
            "model": "gemini-1.5-pro",
            "api_key": api_key,
            "api_type": "google"
        }
    ]

    # Create Agents
    agents = create_research_agents(config_list)
    user_proxy = create_user_proxy(config_list)

    # Register Tools
    # Register 'search_arxiv' for Paper_Discovery_Agent to CALL, and User_Proxy to EXECUTE
    autogen.register_function(
        search_arxiv,
        caller=agents["paper_discovery_agent"],
        executor=user_proxy,
        name="search_arxiv",
        description="Search arXiv for papers."
    )
    
    # Register 'approve_papers' for User_Proxy to EXECUTE (if agent calls it) or User to trigger.
    # Actually, allow Paper_Discovery_Agent to CALL it to confirm? Or User calls it?
    # Let's simple register it for the UserProxy to be able to execute it if suggested.
    autogen.register_function(
        approve_papers,
        caller=agents["paper_discovery_agent"],
        executor=user_proxy,
        name="approve_papers",
        description="Approve specific papers from the list."
    )
    autogen.register_function(
        approve_papers,
        caller=agents["topic_refinement_agent"], # Also allow topic agent
        executor=user_proxy,
        name="approve_topics", # Reuse function, different name? No, keep it simple.
        description="Approve specific options."
    )
    
    # Also register for Topic Agent if it needs to explore? 
    # Prompt said "Topic Refinement... based on... retrieved paper abstracts". 
    # Maybe Topic Agent needs search too? Let's give it access just in case, or rely on Discovery Agent.
    # Users prompt implies Topic Agent refines, THEN Discovery Agent searches.
    # But to refine based on abstracts, it needs pappers. 
    # Let's assume Topic Agent proposes query, Discovery Agent searches.
    
    # Define Group Chat
    groupchat = autogen.GroupChat(
        agents=[
            user_proxy,
            agents["topic_refinement_agent"],
            agents["paper_discovery_agent"],
            agents["insight_agent"],
            agents["report_agent"],
            agents["gap_agent"]
        ],
        messages=[],
        max_round=50,
        speaker_selection_method="auto" 
    )
    
    manager = autogen.GroupChatManager(
        groupchat=groupchat, 
        llm_config={"config_list": config_list}
    )

    # Start the workflow
    print("Initiating Research Assistant...")
    user_proxy.initiate_chat(
        manager,
        message="""I want to research "Multi-Agent Systems for Autonomous Driving". 
Please refine this topic, find relevant papers, synthesize insights, compile a report, and identify research gaps.
"""
    )

if __name__ == "__main__":
    main()
