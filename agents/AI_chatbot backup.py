from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
from mftool import Mftool
import os

# Securely set API Key (avoid hardcoding)
if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = "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"  # Replace with actual API key or set it in the environment

# Web Agent: Fetches web data using DuckDuckGo
web_agent = Agent(
    name="Web Agent",
    model=Groq(id="llama-3.3-70b-specdec"),
    tools=[DuckDuckGo()],
    instructions=[
        "Use duckduckgo_news to fetch actual articles and return structured data.",
        "Provide direct responses instead of explaining the process.",
        "Include proper source links in the response."
    ],
    show_tool_calls=False,  # Hides debug logs
    markdown=True
)

# Finance Agent: Fetches stock and company data from Yahoo Finance
finance_agent = Agent(
    name="Finance Agent",
    role="Get financial data",
    model=Groq(id="llama-3.3-70b-specdec"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True)],
    instructions=[
        "Retrieve stock and financial data using the appropriate tools.",
        "Use tables to display numerical data for better readability.",
        "Ensure stock prices and analyst recommendations are always up-to-date."
    ],
    show_tool_calls=False,
    markdown=True
)

# Tax Agent: Retrieves tax-related information with government sources
tax_agent = Agent(
    name="Tax Agent",
    model=Groq(id="llama-3.3-70b-specdec"),
    tools=[DuckDuckGo()],
    instructions=[
        "Use https://www.incometaxindia.gov.in for tax-related queries.",
        "Ensure all responses include official government sources for credibility.",
        "Summarize complex tax regulations clearly with relevant examples."
    ],
    show_tool_calls=False,
    markdown=True
)

"""
This module provides wrapper functions for the mftool library.
Each function fetches mutual fund-related data, making it easy to integrate with an AI agent.
"""
# Initialize Mftool instance
mf = Mftool()

class MutualFundTools:
    """ A wrapper class to integrate mutual fund functions as agent tools. """

    @staticmethod
    def get_available_schemes(amc_name: str) -> dict:
        return mf.get_available_schemes(amc_name)

    @staticmethod
    def get_scheme_quote(scheme_code: str) -> dict:
        return mf.get_scheme_quote(scheme_code)

    @staticmethod
    def get_scheme_details(scheme_code: str) -> dict:
        return mf.get_scheme_details(scheme_code)

    @staticmethod
    def get_scheme_historical_nav(scheme_code: str, as_dataframe: bool = False):
        return mf.get_scheme_historical_nav(scheme_code, as_Dataframe=as_dataframe)

    @staticmethod
    def validate_scheme_code(scheme_code: str) -> bool:
        schemes = mf.get_scheme_details(scheme_code)
        return bool(schemes)

    @staticmethod
    def get_scheme_codes() -> dict:
        return mf.get_scheme_codes()

    @staticmethod
    def is_valid_amc(amc_name: str) -> bool:
        schemes = mf.get_available_schemes(amc_name)
        return bool(schemes)

    @staticmethod
    def get_all_amcs() -> list:
        return list(set(scheme['fund_house'] for scheme in mf.get_scheme_details().values()))


# Mutual Fund (MF) Agent: Handles all Mutual Fund-related queries
mf_agent = Agent(
    name="MF Agent",
    model=Groq(id="llama-3.3-70b-specdec"),
    tools=[
        MutualFundTools.get_available_schemes,
        MutualFundTools.get_scheme_details,
        MutualFundTools.get_scheme_historical_nav,
        MutualFundTools.get_scheme_quote,
        MutualFundTools.validate_scheme_code
    ],
    instructions=[
        "Retrieve mutual fund details using the available functions.",
        "Use tables to present NAV data, historical performance, and fund details.",
        "If a mutual fund query is out of scope, forward the request to the Web Agent."
    ],
    show_tool_calls=False,
    markdown=True,
)

# Agent Team: Coordinates all agents efficiently
agent_team = Agent(
    model=Groq(id="llama-3.3-70b-specdec"),
    team=[web_agent, finance_agent, tax_agent, mf_agent],
    instructions=[
        "Direct queries to the appropriate agent based on context.",
        "Always return structured, direct responses instead of process explanations.",
        "Ensure financial and tax-related information includes sources.",
        "Use tables for numerical and structured data presentation.",
        "pass on the input to the following agents in valid  string format"
    ],
    show_tool_calls=False,
    markdown=True,
)

# Interactive mode
def run_agent(inp):
# print("Hello, how can I help you?")
# inp = input()
    return agent_team.run(inp).content

if __name__ == "__main__":
    inp= input()
    print(run_agent(inp))