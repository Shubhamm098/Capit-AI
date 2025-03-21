from mftool import Mftool
from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv



"""
This module provides wrapper functions for the `mftool` library.
Each function fetches mutual fund-related data, making it easy to integrate with an AI agent.
"""
load_dotenv()
# Initialize Mftool instance
mf = Mftool()

def get_available_schemes(amc_name: str) -> str:
    """
    Retrieves all available mutual fund schemes for a given Asset Management Company (AMC).
    
    Parameters:
        amc_name (str): The name of the asset management company (e.g., 'ICICI').
    
    Returns:
        str: A formatted string listing all schemes with their codes
    """
    schemes = mf.get_available_schemes(amc_name)
    if isinstance(schemes, dict):
        # Convert dictionary to formatted string
        formatted_schemes = "\n".join([f"Code: {code} - Name: {name}" for code, name in schemes.items()])
        return formatted_schemes
    return str(schemes)

def get_scheme_quote(scheme_code: str) -> dict:
    """
    Fetches real-time NAV details of a specific mutual fund scheme.
    
    Parameters:
        scheme_code (str): The scheme code of the mutual fund.
    
    Returns:
        dict: Contains scheme name, last updated date, NAV, and other details.
    """
    return mf.get_scheme_quote(scheme_code)

def get_scheme_details(scheme_code: str) -> str:
    """
    Retrieves detailed information about a specific mutual fund scheme.
    
    Parameters:
        scheme_code (str): The scheme code of the mutual fund.
    
    Returns:
        str: Contains details such as scheme type, category, fund house, and inception date.
    """
    details = mf.get_scheme_details(scheme_code)
    if isinstance(details, dict):
        # Convert dictionary to formatted string
        formatted_details = "\n".join([f"{key}: {value}" for key, value in details.items()])
        return formatted_details
    return str(details)

def get_scheme_historical_nav(scheme_code: str, as_dataframe: bool = False):
    """
    Retrieves the historical NAV data of a given mutual fund scheme.
    
    Parameters:
        scheme_code (str): The scheme code of the mutual fund.
        as_dataframe (bool): Whether to return the result as a Pandas DataFrame. Defaults to False.
    
    Returns:
        dict or DataFrame: A dictionary or DataFrame containing historical NAV data.
    """
    return mf.get_scheme_historical_nav(scheme_code, as_Dataframe=as_dataframe)

def validate_scheme_code(scheme_code: str) -> str:
    """
    Validates whether a given scheme code exists in the mutual fund database.
    
    Parameters:
        scheme_code (str): The scheme code to validate.
    
    Returns:
        str: A message indicating whether the scheme code is valid
    """
    try:
        schemes = mf.get_scheme_details(scheme_code)
        if schemes:
            return "Valid scheme code"
        return "Invalid scheme code"
    except Exception as e:
        return f"Error validating scheme code: {str(e)}"

def get_scheme_codes() -> dict:
    """
    Retrieves all mutual fund scheme codes.
    
    Returns:
        dict: A dictionary containing scheme codes of only 20 schemes and corresponding scheme names.
    """
    return mf.get_scheme_codes().items()[:20]

def is_valid_amc(amc_name: str) -> bool:
    """
    Checks if the given Asset Management Company (AMC) name exists.
    
    Parameters:
        amc_name (str): The name of the asset management company.
    
    Returns:
        bool: True if AMC exists, False otherwise.
    """
    schemes = mf.get_available_schemes(amc_name)
    return bool(schemes)

def get_all_amcs() -> str:
    """
    Retrieves a list of top 20 registered Asset Management Companies (AMCs).
    
    Returns:
        str: A formatted string containing all AMC names
    """
    try:
        # Get all scheme details
        schemes = mf.get_scheme_codes()
        # Extract unique fund houses
        amcs = set()
        for scheme_info in schemes.values():
            if isinstance(scheme_info, str) and ' - ' in scheme_info:
                amc = scheme_info.split(' - ')[0].strip()
                amcs.add(amc)
        
        # Format the output
        formatted_amcs = "\nAvailable AMCs:\n" + "\n".join(sorted(amcs))
        return formatted_amcs
    except Exception as e:
        return f"Error fetching AMC names: {str(e)}"


mf_agent = Agent(
    name="MF Agent",
    model=Groq(id="llama-3.3-70b-versatile"),
    # model=Groq(id="gpt-3.5-turbo"),
    tools=[get_available_schemes, get_scheme_details, get_scheme_historical_nav, get_scheme_quote, validate_scheme_code],
    instructions=[
        "You are a mutual fund expert. Your primary role is to help users get information about mutual funds.",
        "Always use the provided tools to fetch real data when responding to queries.",
        "For scheme details, first validate the scheme code before fetching details.",
        "Present numerical data in a clear, tabulated format.",
        "If you need to search for information beyond the tools' scope, use the web agent.",
        "Always explain the data you present in simple terms."
    ],
    show_tool_calls=True,
    markdown=True,
    debug_mode=True,
)

# Remove the manual input and replace with a function that processes the query
def process_mf_query(query: str):
    response = mf_agent.print_response(query)
    return response

# Example usage
if __name__ == "__main__":
    print("Ask me about mutual funds!")
    query = input()
    response = process_mf_query(query)
    print(response)

if validate_scheme_code("HSBC Corporate Bond Fund - Regular Growth"):
    scheme_details = get_scheme_details("120503")
    if isinstance(scheme_details, dict):
        fund_name = scheme_details.get('fund_name', 'Unknown Fund')
        print(f"Fund Name: {fund_name}")
    else:
        print("Unexpected response format.")