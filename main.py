import streamlit as st
import subprocess
import pandas as pd
import os

def run_script(script_name):
    """Runs a Python script and prints output."""
    result = subprocess.run(['python3', script_name], capture_output=True, text=True)
    with st.expander(f"Output of {script_name}"):
        st.text(result.stdout)
        if result.stderr:
            st.error(result.stderr)

def download_csv(file_path, label, key):
    """Helper function to add a download button for CSV files."""
    if os.path.exists(file_path):
        with open(file_path, "rb") as f:
            st.download_button(label=label, data=f, file_name=os.path.basename(file_path), mime="text/csv", key=key)

st.title("AI-Powered Robo Advisor")
st.markdown("#### Intelligent investment recommendations based on multiple strategies")

if st.button("Help Me Invest"):
    with st.spinner("Analyzing investment opportunities..."):
        progress = st.progress(0)
        
        # Run profitability metrics script
        st.write("Fetching profitability metrics...")
        run_script("profitability_metrics.py")
        download_csv("profitability_metrics.csv", "Download Profitability Metrics", "download_metrics")
        progress.progress(20)
        
        st.markdown("### Investment Strategies")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("#### Value Investor")
            run_script("value_investor.py")
            download_csv("value_stocks.csv", "Download Value Picks", "download_value")
        
        with col2:
            st.markdown("#### Growth Investor")
            run_script("growth_investor.py")
            download_csv("growth_stocks.csv", "Download Growth Picks", "download_growth")
        
        with col3:
            st.markdown("#### Risk-Averse Investor")
            run_script("risk_averse_investor.py")
            download_csv("risk_averse_stocks.csv", "Download Risk-Averse Picks", "download_risk")
        
        progress.progress(60)
        
        st.write("Aggregating investor insights...")
        run_script("aggregator.py")
        download_csv("combined_stocks_with_scores.csv", "Download Aggregated Results", "download_aggregated")
        progress.progress(80)
        
        if os.path.exists("combined_stocks_with_scores.csv"):
            df = pd.read_csv("combined_stocks_with_scores.csv")
            st.markdown("### Top Stocks Based on Aggregate Score")
            st.dataframe(df.head(10))
            
            st.markdown("### Detailed Price Analysis")
            top_stocks = df['Ticker'].head(5).tolist()
            tabs = st.tabs([f"{stock}" for stock in top_stocks])
            
            for i, stock in enumerate(top_stocks):
                with tabs[i]:
                    st.write(f"Analyzing {stock}...")
                    run_script(f"pricing_analysis.py")
                    download_csv(f"{stock}_analysis.csv", f"Download {stock} Analysis", f"download_{stock}")
        
        progress.progress(100)
        st.success("Analysis complete! Review the recommendations above.")
        
        st.markdown("### Download All Reports")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            download_csv("all_analysis.zip", "Download Complete Analysis (ZIP)", "download_all_zip")
        with col2:
            download_csv("combined_stocks_with_scores.csv", "Download Summary Report (CSV)", "download_summary")
        with col3:
            download_csv("investment_report.pdf", "Download PDF Report", "download_pdf")
