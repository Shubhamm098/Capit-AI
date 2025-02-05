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

def get_available_schemes(amc_name: str) -> dict:
    """
    Retrieves all available mutual fund schemes for a given Asset Management Company (AMC).
    
    Parameters:
        amc_name (str): The name of the asset management company (e.g., 'ICICI').
    
    Returns:
        dict: A dictionary with scheme codes as keys and scheme names as values.
    """
    return mf.get_available_schemes(amc_name)

def get_scheme_quote(scheme_code: str) -> dict:
    """
    Fetches real-time NAV details of a specific mutual fund scheme.
    
    Parameters:
        scheme_code (str): The scheme code of the mutual fund.
    
    Returns:
        dict: Contains scheme name, last updated date, NAV, and other details.
    """
    return mf.get_scheme_quote(scheme_code)

def get_scheme_details(scheme_code: str) -> dict:
    """
    Retrieves detailed information about a specific mutual fund scheme.
    
    Parameters:
        scheme_code (str): The scheme code of the mutual fund.
    
    Returns:
        dict: Contains details such as scheme type, category, fund house, and inception date.
    """
    return mf.get_scheme_details(scheme_code)

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

def validate_scheme_code(scheme_code: str) -> bool:
    """
    Validates whether a given scheme code exists in the mutual fund database.
    
    Parameters:
        scheme_code (str): The scheme code to validate.
    
    Returns:
        bool: True if the scheme code is valid, False otherwise.
    """
    schemes = mf.get_scheme_details(scheme_code)
    return bool(schemes)

def get_scheme_codes() -> dict:
    """
    Retrieves all mutual fund scheme codes.
    
    Returns:
        dict: A dictionary containing scheme codes and corresponding scheme names.
    """
    return mf.get_scheme_codes()

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

def get_all_amcs() -> list:
    """
    Retrieves a list of all registered Asset Management Companies (AMCs).
    
    Returns:
        list: A list of all AMCs.
    """
    return list(set(scheme['fund_house'] for scheme in mf.get_scheme_details().values()))


mf_agent = Agent(
     name="MF Agent",
     model=Groq(id="llama-3.3-70b-versatile"),
    tools=[get_available_schemes, get_scheme_details, get_scheme_historical_nav, get_scheme_quote, validate_scheme_code, ],
    instructions=[
        "Use tables to display data.",
        "use these functions whenever needed",
        "if any query related to mutual funds out of the scope of mftool, use web agent"
    ],
    show_tool_calls=True,
    markdown=True,
    debug_mode=True,
)
print("ask me !!")
inp = input()
mf_agent.print_response(inp)

if validate_scheme_code("HSBC Corporate Bond Fund - Regular Growth"):
    scheme_details = get_scheme_details("120503")
    if isinstance(scheme_details, dict):
        fund_name = scheme_details.get('fund_name', 'Unknown Fund')
        print(f"Fund Name: {fund_name}")
    else:
        print("Unexpected response format.")