import autogen
from typing import Dict, List

def create_user_proxy(config_list: List[Dict]) -> autogen.UserProxyAgent:
    """
    Creates the User Proxy Agent for human interaction.
    """
    user_proxy = autogen.UserProxyAgent(
        name="User_Proxy",
        system_message="""A human admin. 
You are the interface for the human user.
- Approve/Reject plans.
- Provide feedback on topics and reports.
- Execute code/tools if necessary (though agents should do most work).
""",
        code_execution_config={"work_dir": "research_output", "use_docker": False},
        human_input_mode="ALWAYS",  # Enables human-in-the-loop at every step if needed, or specific points
        is_termination_msg=lambda x: x.get("content", "") and x.get("content", "").rstrip().endswith("TERMINATE")
    )
    return user_proxy
