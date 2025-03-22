import streamlit as st
import subprocess
import pandas as pd

def run_script(script_name):
    """Runs a Python script and prints output."""
    result = subprocess.run(['python3', script_name], capture_output=True, text=True)
    st.text(result.stdout)
    st.text(result.stderr)

st.title("AI-Powered Robo Advisor")

if st.button("Help Me Invest"):
    st.write("Fetching profitability metrics...")
    run_script("profitability_metrics.py")
    
    st.write("Running investor strategies...")
    run_script("value_investor.py")
    run_script("growth_investor.py")
    run_script("risk_averse_investor.py")
    
    st.write("Aggregating investor insights...")
    run_script("aggregator.py")
    
    # Load and display aggregated stock scores
    df = pd.read_csv("combined_stocks_with_scores.csv")
    st.write("### Top Stocks Based on Aggregate Score")
    st.dataframe(df.head(10))
    
    st.write("Running pricing analysis...")
    for stock in df['Ticker'].head(5):  # Analyze top 5 stocks
        st.write(f"Analyzing {stock}...")
        run_script("pricing_analysis.py")
    
    st.success("Analysis complete! Check the reports for insights.")
