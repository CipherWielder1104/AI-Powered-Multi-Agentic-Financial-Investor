import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from flask import Flask, jsonify


HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Cookie': 'sessionid=g8i5cvrk4hhqa8r3gj1bwbrsekzium6w; csrftoken=4qLcWOrOksyb7Dn65gA3lMtabaUmdB4T'
}

def get_page_data(url, page=1):
    """Fetch paginated stock data from Screener.in"""
    params = {'query': 'Net profit preceding 12months > 200 AND Sales growth 5Years > 10 AND Profit growth 5Years > 15 AND Market Capitalization >100000', 'page': page, 'limit': 50}

    try:
        response = requests.get(url, headers=HEADERS, params=params, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching page {page}: {e}")
        return None

def parse_stock_data(html):
    """Extract stock metrics from HTML content"""
    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find('table', {'class': 'data-table'})
    
    if not table:
        print("Table structure changed! Update selectors.")
        return []
    
    stocks = []
    for row in table.find_all('tr')[1:]:  # Skip header
        cols = row.find_all('td')
        
        if len(cols) < 10:
            continue
        link = cols[1].find('a')['href'] if cols[1].find('a') else None
        # print(link)
        # Stock Name,URL,CMP (Rs.),P/E Ratio,Market Cap (Rs. Cr.),Dividend Yield (%),Net Profit (Qtr) (Rs. Cr.),Qtr Profit Var (%),Sales (Qtr) (Rs. Cr.),Qtr Sales Var (%),ROCE (%),Profit Prev 12M (Rs. Cr.),Sales Var (5Yrs) (%),Profit Var (5Yrs) (%)
        # stock = {
        #     'name': cols[1].get_text(strip=True),
        #     'link': link,
        #     'cmp': cols[2].get_text(strip=True),
        #     'pe_ratio': cols[3].get_text(strip=True),
        #     'market_cap': cols[4].get_text(strip=True),
        #     'div_yield': cols[5].get_text(strip=True),
        #     'net_profit': cols[6].get_text(strip=True),
        #     'profit_growth': cols[7].get_text(strip=True),
        #     'sales': cols[8].get_text(strip=True),
        #     'sales_growth': cols[9].get_text(strip=True),
        #     'roce': cols[10].get_text(strip=True),
        #     'Debt to Equity': cols[15].get_text(strip=True),
        #     'Public Holding': cols[14].get_text(strip=True),
        # }

        stock = {
            'Stock Name': cols[1].get_text(strip=True),
            'URL': link,
            'Ticker': link.split('/')[2],
            'CMP (Rs.)': cols[2].get_text(strip=True),
            'P/E Ratio': cols[3].get_text(strip=True),
            'Market Cap (Rs. Cr.)': cols[4].get_text(strip=True),
            'Dividend Yield (%)': cols[5].get_text(strip=True),
            'Net Profit (Qtr) (Rs. Cr.)': cols[6].get_text(strip=True),
            'Qtr Profit Var (%)': cols[7].get_text(strip=True),
            'Sales (Qtr) (Rs. Cr.)': cols[8].get_text(strip=True),
            'Qtr Sales Var (%)': cols[9].get_text(strip=True),
            'ROCE (%)': cols[10].get_text(strip=True),
            'Public Holding': cols[14].get_text(strip=True),
            'Debt to Equity': cols[15].get_text(strip=True),
            'Profit Prev 12M (Rs. Cr.)': cols[16].get_text(strip=True),
            'Sales Var (5Yrs) (%)': cols[17].get_text(strip=True),
            'Profit Var (5Yrs) (%)': cols[18].get_text(strip=True)
        }
        stocks.append(stock)
    return stocks

def scrape_screener(url, max_pages=5):
    """Scrape multiple pages from Screener.in"""
    all_stocks = []
    
    for page in range(1, max_pages+1):
        html = get_page_data(url, page)
        if not html:
            break
            
        stocks = parse_stock_data(html)
        if not stocks:
            print(f"Stopped at page {page} - no more data")
            break
            
        all_stocks.extend(stocks)
        print(f"Page {page} scraped: {len(stocks)} stocks")
        time.sleep(1.5)  # Respect rate limits
        
    return pd.DataFrame(all_stocks)

# Example usage
SCREENER_URL = "https://www.screener.in//screen/raw/"
df = scrape_screener(SCREENER_URL, max_pages=1)

from datetime import datetime

def get_latest_transcript_pdf(company_url):
    """Extract latest transcript PDF URL from company page"""
    try:
        print(f"Processing {company_url}")
        time.sleep(1.1)  # Respect rate limits
        response = requests.get(company_url, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the Concalls section
        concalls_section = soup.find('h3', string='Concalls')
        if not concalls_section:
            print("No Concalls section found")
            return None
        
        
            
        transcripts = []
        for item in concalls_section.find_next('ul').find_all('li'):
            text = item.get_text(strip=True)
            if 'Transcript' in text:
                # Extract date from text like "Feb 2025Transcript PPT REC"
                date_str = text.split('Transcript')[0].strip()
                pdf_link = item.find('a', string='PDF')['href'] if item.find('a', string='PDF') else None
                
                if date_str and pdf_link:
                    # Parse date without day (assumes format like "Feb 2025")
                    date = datetime.strptime(date_str, "%b %Y")
                    transcripts.append((date, pdf_link))
        
        if not transcripts:
            return None
            
        # Get most recent transcript
        latest = max(transcripts, key=lambda x: x[0])
        return f"<https://www.screener.in{latest>[1]}"

    except Exception as e:
        print(f"Error processing {company_url}: {e}")
        return None

# Usage with your existing dataframe
# df['transcript_pdf'] = df['link'].apply(
#     lambda x: get_latest_transcript_pdf(f"https://www.screener.in{x}") if x else None
# )

# Save updated CSV
# df.to_csv('screener_data_with_transcripts.csv', index=False)


if not df.empty:
    df.to_csv('screener_stock_details.csv', index=False)
    print(f"Saved {len(df)} stocks to screener_stock_details.csv")
else:
    print("No data scraped")

# params = {'query': 'Market capitalization > 500 AND Price to earning < 15 AND Return on capital employed > 22%', 'page': 2}
# print(requests.get('https://www.screener.in/screen/raw/', headers=HEADERS, params=params).text)