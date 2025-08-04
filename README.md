# CENT.

**CENT.** is a powerful multi-agentic framework for building AI-driven financial advisors. It automates the entire investment research process—from fundamental analysis to generating a final financial report. This system is designed to provide comprehensive, data-driven insights tailored to different investment strategies.


## How It Works

The CENT. workflow is a sophisticated pipeline where specialized agents work together to analyze potential investments. The process combines fundamental analysis, technical analysis, and AI-driven insights to produce a detailed report.

### 1. Fundamental Analysis

The process begins with the **Stock Inspector Agent**, which uses a screener to scrape and analyze stocks. This data is then passed to three specialized agents:

- **Growth Investor Agent**: Focuses on companies with strong growth potential.  
- **Value Investor Agent**: Identifies undervalued stocks with solid fundamentals.  
- **Risk Manager Agent**: Assesses the risk profile of each stock.

### 2. Technical Analysis

Insights from the fundamental analysis agents are passed to the **Stock Orchestrator Agent**, which collaborates with the **Price Action Agent** to perform detailed technical analysis using indicators such as:

- Envelopes  
- RV Knox Divergence

### 3. AI Analysis & Backtesting

The output from the technical analysis phase undergoes **backtesting** to evaluate the historical performance of the strategy. A final, all-encompassing agent then:

- Integrates all results  
- Uses custom prompts  
- Generates a comprehensive **Financial Report** combining all insights into a clear, actionable summary.


## Why CENT.?

- **Automation**: Reduces the need for manual research by automating complex financial analysis.

- **Customization**: Tailor the agents to your specific investment philosophy—whether you're a growth, value, or risk-averse investor.

- **Accuracy**: Combines multiple analytical approaches (fundamental, technical, and AI) to provide deeper, more reliable insights.

- **Scalability**: The modular, multi-agentic architecture allows for easy expansion and integration of new analytical tools and strategies.

## [Project Description(PDF)](./Project%20Description_Cent..pdf)


![The above image describes the workflow of the tool. Each block can be used as a an individual agent or in series and parallel](https://github.com/NG2411/cent/blob/main/cent_flow.jpg?raw=true)
