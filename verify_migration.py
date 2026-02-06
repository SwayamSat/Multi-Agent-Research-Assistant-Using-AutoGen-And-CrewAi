try:
    from crew.agents import ResearchAgents
    from crew.tasks import ResearchTasks
    from crew.tools import ArxivTools
    from main import app
    print("Imports successful")
    
    agents = ResearchAgents()
    print("ResearchAgents instantiated")
    
    tasks = ResearchTasks()
    print("ResearchTasks instantiated")

    print("Verification Passed")
except Exception as e:
    print(f"Verification Failed: {e}")
    exit(1)
