import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crewai import Crew, Process
from crew.agents import ResearchAgents
from crew.tasks import ResearchTasks

# Load environment variables
load_dotenv()

app = FastAPI(title="Multi-Agent Research Assistant (CrewAI)")

class ResearchRequest(BaseModel):
    topic: str

class ResearchResponse(BaseModel):
    result: str

@app.get("/")
def home():
    return {"message": "Welcome to the Multi-Agent Research Assistant API. Use POST /researchagents to start research."}

@app.post("/researchagents", response_model=ResearchResponse)
def run_research_agents(request: ResearchRequest):
    """
    Endpoint to trigger the research agents.
    """
    topic = request.topic
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")

    try:
        # Instantiate Agents
        agents = ResearchAgents()
        refiner = agents.topic_refiner()
        discoverer = agents.paper_discoverer()
        synthesizer = agents.insight_synthesizer()
        compiler = agents.report_compiler()
        gap_analyst = agents.gap_analyst()

        # Instantiate Tasks
        tasks = ResearchTasks()
        task1 = tasks.refine_task(refiner, topic)
        task2 = tasks.discovery_task(discoverer)
        task3 = tasks.synthesis_task(synthesizer)
        task4 = tasks.report_task(compiler)
        task5 = tasks.gap_analysis_task(gap_analyst)

        # Create Crew
        crew = Crew(
            agents=[refiner, discoverer, synthesizer, compiler, gap_analyst],
            tasks=[task1, task2, task3, task4, task5],
            process=Process.sequential,
            verbose=True
        )

        # Kickoff
        result = crew.kickoff()
        
        return ResearchResponse(result=str(result))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
