from flask import Flask, jsonify
from phi.agent import Agent
from phi.model.groq import Groq
from phi.search import DuckDuckGo
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get the Groq API key from the environment variable
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize the Web Agent
web_agent = Agent(
    name="Web Agent",
    model=Groq(id="llama-3.3-70b-versatile", api_key=groq_api_key),  # Pass the API key here
    tools=[DuckDuckGo()],
    instructions=["Always include sources"],
    show_tool_calls=True,
    markdown=True
)

@app.route('/web-agent', methods=['GET'])
def get_web_agent_info():
    # Example endpoint to return agent information
    return jsonify({"name": web_agent.name, "instructions": web_agent.instructions})

if __name__ == '__main__':
    app.run(debug=True)