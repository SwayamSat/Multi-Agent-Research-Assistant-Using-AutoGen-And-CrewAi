from crewai import Task

class ResearchTasks:
    def refine_task(self, agent, topic):
        return Task(
            description=f"""Analyze the following research topic: '{topic}'.
            1. Clarify the scope.
            2. Suggest 3-5 specific subtopics.
            3. Refine it into a clear, focused research question.
            Output the FINAL REFINED TOPIC clearly at the end.""",
            expected_output="A refined research topic and specific research questions.",
            agent=agent
        )

    def discovery_task(self, agent):
        return Task(
            description="""Using the refined topic from the previous task, search for relevant papers on arXiv.
            1. Use the search_arxiv tool.
            2. Find at least 3-5 relevant papers.
            3. Return a list of papers with their Titles, URLs, and Summaries.""",
            expected_output="A list of 3-5 relevant research papers with details.",
            agent=agent
        )

    def synthesis_task(self, agent):
        return Task(
            description="""Analyze the papers found in the previous task.
            1. Extract key findings, methodologies, and results.
            2. Identify common themes and contradictions.
            3. Synthesize this information into a set of core insights.""",
            expected_output="A synthesized summary of key insights from the discovered papers.",
            agent=agent
        )

    def report_task(self, agent):
        return Task(
            description="""Compile a comprehensive research report based on the synthesized insights.
            The report must include:
            - Title
            - Executive Summary
            - Key Findings
            - Methodology Review (based on papers)
            - Conclusion
            Format it in Markdown.""",
            expected_output="A professional markdown-formatted research report.",
            agent=agent
        )

    def gap_analysis_task(self, agent):
        return Task(
            description="""Analyze the generated research report.
            1. Identify what is missing in the current literature.
            2. Highlight limitations of the studies found.
            3. Propose 3 specific directions for future research.
            Append this gap analysis to the final output.""",
            expected_output="A section on research gaps and future directions.",
            agent=agent
        )
