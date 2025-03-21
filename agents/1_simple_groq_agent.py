from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv, load_dotenv

load_dotenv()

agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile")
)

inp = input("hello im capitAI , what is your query")

agent.print_response(inp)