def web_search(query):
    """
    Perform a web search and return formatted results
    """
    from web_search_tool import web_search as search_tool
    
    try:
        results = search_tool(query)
        formatted_results = "Latest Financial News:\n\n"
        
        for result in results:
            if isinstance(result, dict):
                title = result.get('title', '')
                snippet = result.get('snippet', '')
                url = result.get('url', '')
                formatted_results += f"• {title}\n"
                formatted_results += f"  {snippet}\n"
                formatted_results += f"  Source: {url}\n\n"
                
        return formatted_results
    except Exception as e:
        return f"Error fetching news: {str(e)}" 