from autogen_agentchat.agents import UserProxyAgent
from typing import Dict, List

def create_user_proxy() -> UserProxyAgent:
    """
    Creates the User Proxy Agent for human interaction.
    """
    user_proxy = UserProxyAgent(
        name="User_Proxy",
        description="A human admin."
    )
    return user_proxy
