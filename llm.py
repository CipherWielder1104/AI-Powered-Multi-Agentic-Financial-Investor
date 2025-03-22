import ollama
import pandas as pd

# Load your stock data
top_20 = pd.read_csv('cent\\combined_stocks_with_scores.csv')  # Replace with your actual CSV path

# Function to generate financial report using Ollama
def generate_stock_report(stock_data):
    # Extract stock information
    stock_name = stock_data['Stock Name']
    value_score = stock_data['Value Investor Score']
    growth_score = stock_data['Growth Investor Score']
    risk_score = stock_data['Risk-Averse Investor Score']
    aggregate_score = stock_data['Aggregate Score']
    pe_ratio = stock_data['P/E Ratio']
    market_cap = stock_data['Market Cap (Rs. Cr.)']
    dividend_yield = stock_data['Dividend Yield (%)']
    net_profit = stock_data['Net Profit (Qtr) (Rs. Cr.)']
    qtr_profit_var = stock_data['Qtr Profit Var (%)']
    sales_qtr = stock_data['Sales (Qtr) (Rs. Cr.)']
    qtr_sales_var = stock_data['Qtr Sales Var (%)']
    roce = stock_data['ROCE (%)']
    public_holding = stock_data['Public Holding']
    debt_to_equity = stock_data['Debt to Equity']
    profit_prev_12m = stock_data['Profit Prev 12M (Rs. Cr.)']
    sales_var_5yrs = stock_data['Sales Var (5Yrs) (%)']
    profit_var_5yrs = stock_data['Profit Var (5Yrs) (%)']

    # Prepare the prompt for the Llama model
    prompt = f"""
    Generate a very detailed financial report for the stock {stock_name} based on the below details. Consider all the parameters carefully and give an official type of report:
    - **Value Investor Score**: {value_score}
    - **Growth Investor Score**: {growth_score}
    - **Risk-Averse Investor Score**: {risk_score}
    - **Aggregate Score**: {aggregate_score}
    - **P/E Ratio**: {pe_ratio}
    - **Market Cap**: {market_cap} Cr.
    - **Dividend Yield**: {dividend_yield}%
    - **Net Profit (Quarter)**: {net_profit} Cr.
    - **Quarter Profit Variation**: {qtr_profit_var}%
    - **Quarter Sales**: {sales_qtr} Cr.
    - **Quarter Sales Variation**: {qtr_sales_var}%
    - **ROCE**: {roce}%
    - **Public Holding**: {public_holding}%
    - **Debt-to-Equity Ratio**: {debt_to_equity}
    - **Profit for Previous 12 Months**: {profit_prev_12m} Cr.
    - **Sales Variation (5 Years)**: {sales_var_5yrs}%
    - **Profit Variation (5 Years)**: {profit_var_5yrs}%

    Based on the above information, provide a detailed financial analysis, performance evaluation, and future investment recommendations. It should be a detailed financial report.
    """

    # Use Ollama to generate the report
    response = ollama.chat(
        model='deepseek-r1:1.5b',  # Use the model you have installed
        messages=[{'role': 'user', 'content': prompt}]
    )

    # Return the generated report
    return response['message']['content']

# Function to remove the think section from the report
def remove_think_section(report):
    start_index = report.find('<think>')  # Find the start of the think section
    end_index = report.find('</think>')  # Find the end of the think section
    
    if start_index != -1 and end_index != -1:
        # Remove the think section from the report
        cleaned_report = report[:start_index] + report[end_index + len('</think>'):]
        return cleaned_report
    else:
        return report  # Return original report if no think section found

# Function to save the report as a text file
def save_report_as_text(report, stock_name):
    text_filename = f"{stock_name}_financial_report.txt"
    
    with open(text_filename, 'w', encoding='utf-8') as file:
        file.write(f"Financial Report for {stock_name}\n\n")
        file.write(report)
    
    print(f"Report saved as: {text_filename}")

# Loop through the top 5 stocks and generate reports
for index, row in top_20.head(5).iterrows():  # .head(5) ensures only the first 5 stocks are processed
    stock_report = generate_stock_report(row)
    cleaned_report = remove_think_section(stock_report)  # Clean the report by removing the think section
    save_report_as_text(cleaned_report, row['Stock Name'])

