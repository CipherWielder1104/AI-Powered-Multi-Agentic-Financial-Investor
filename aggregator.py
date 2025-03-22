import pandas as pd

# Load the original dataset with all the data
df_original = pd.read_csv("screener_stock_details.csv")

# Load individual CSV files for each investor type
df_value = pd.read_csv("value_investor_ranked_stocks.csv")
df_growth = pd.read_csv("growth_investor_ranked_stocks.csv")
df_risk_averse = pd.read_csv("risk_averse_investor_ranked_stocks.csv")

# Add individual scores to the original dataframe by merging based on "Stock Name"
df_combined = df_original[['Stock Name']]  # Start with the original stock names

# Merge the profitability scores from each investor type
df_combined = df_combined.merge(df_value[['Stock Name', 'Profitability Score']].rename(columns={'Profitability Score': 'Value Investor Score'}), on='Stock Name', how='left')
df_combined = df_combined.merge(df_growth[['Stock Name', 'Profitability Score']].rename(columns={'Profitability Score': 'Growth Investor Score'}), on='Stock Name', how='left')
df_combined = df_combined.merge(df_risk_averse[['Stock Name', 'Profitability Score']].rename(columns={'Profitability Score': 'Risk-Averse Investor Score'}), on='Stock Name', how='left')

# Compute the aggregate score (average of individual scores)
df_combined['Aggregate Score'] = df_combined[['Value Investor Score', 'Growth Investor Score', 'Risk-Averse Investor Score']].mean(axis=1)

# Rank stocks based on aggregate score
df_combined = df_combined.sort_values(by="Aggregate Score", ascending=False)

# Now merge the original dataset with the scores to include all data in the final CSV
df_final = df_combined.merge(df_original, on='Stock Name', how='left')

# Save the final merged dataframe with all stock data and scores
df_final.to_csv("combined_stocks_with_scores.csv", index=False)

# Show top 10 stocks based on aggregate score along with their full data
print(df_final.head(10))
