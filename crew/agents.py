import os
from crewai import Agent, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
from crew.tools import ArxivTools

# Function to get the LLM
def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    # Custom Gemini Client wrapped for CrewAI/LangChain
    return LLM(
        model="gemini/gemini-1.5-pro", # Using 1.5 Pro for better reasoning
        api_key=api_key,
        temperature=0.7
    )

class ResearchAgents:
    def __init__(self):
        self.llm = get_llm()

    def topic_refiner(self):
        return Agent(
            role='Research Topic Refiner',
            goal='Clarify and refine the user\'s research topic',
            backstory='You are an expert academic advisor. Your job is to take a vague research interest and refine it into a specific, viable research topic with clear scope.',
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def paper_discoverer(self):
        return Agent(
            role='Paper Discovery Specialist',
            goal='Find relevant and high-quality research papers',
            backstory='You are a skilled librarian and researcher. You know how to search arXiv effectively to find the most relevant papers for a given topic.',
            tools=[ArxivTools.search_arxiv],
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def insight_synthesizer(self):
        return Agent(
            role='Research Insight Synthesizer',
            goal='Extract and synthesize key insights from papers',
            backstory='You are an analytical thinker. You read paper summaries and extract the most important findings, methodologies, and common themes.',
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def report_compiler(self):
        return Agent(
            role='Report Compiler',
            goal='Compile findings into a professional research report',
            backstory='You are a professional technical writer. You take synthesized insights and organize them into a well-structured, academic standard report.',
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def gap_analyst(self):
        return Agent(
            role='Research Gap Analyst',
            goal='Identify opportunities for future research',
            backstory='You are a visionary researcher. You look at what has been done and identify what is missing, proposing novel directions for future work.',
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
