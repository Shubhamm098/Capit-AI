from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
from dotenv import load_dotenv

load_dotenv()

web_agent = Agent(
    name="Web Agent",
    role="Search the web for information",
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[DuckDuckGo()],
    instructions=[
        "Always include sources",
        "Provide concise and relevant information",
        "Break down complex queries into smaller searches"
    ],
    show_tool_calls=True,
    markdown=True,
    debug_mode=True,  # Enable debug mode to see what's happening
)

finance_agent = Agent(
    name="Finance Agent",
    role="Get financial data",
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True)],
    instructions=["Use tables to display data"],
    show_tool_calls=True,
    markdown=True,
)

tax_agent = Agent(
    name="Tax Agent",
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[DuckDuckGo()],
    instructions=[
        "Use this website for any queries related to tax: `https://www.incometaxindia.gov.in`",
        "Always include sources for tax-related information."
    ],
    show_tool_calls=True,
    markdown=True
)

agent_team = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    team=[web_agent, finance_agent, tax_agent],
    instructions=["Always include sources", "Use tables to display data",
                  ],
    show_tool_calls=True,
    markdown=True,
)

print("Hello, how can I help you?")
inp = input()
agent_team.print_response(inp)
