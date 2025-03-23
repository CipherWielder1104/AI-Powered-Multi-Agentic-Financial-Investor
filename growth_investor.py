import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Load dataset
df = pd.read_csv("screener_stock_details.csv")

# Features used for growth profitability scoring
features = [
    "P/E Ratio", "Market Cap (Rs. Cr.)", 
    "Net Profit (Qtr) (Rs. Cr.)", "Qtr Profit Var (%)", "Sales (Qtr) (Rs. Cr.)", 
    "Qtr Sales Var (%)", "ROCE (%)", "Profit Prev 12M (Rs. Cr.)", 
    "Sales Var (5Yrs) (%)", "Profit Var (5Yrs) (%)"
]

# Convert selected columns to numeric (handle missing values)
df[features] = df[features].apply(pd.to_numeric, errors='coerce')
df = df.dropna()

# Normalize features
scaler = MinMaxScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df[features]), columns=features)

# Growth Investor weights (P/E ratio negatively weighted, growth-oriented factors positively weighted)
weights = [-0.20, 0.15, 0.05, 0.05, 0.05, 0.05, 0.15, 0.05, 0.20, 0.20]

# Compute profitability score using dot product
df["Profitability Score"] = np.dot(df_scaled, weights)

# Rank stocks based on profitability score
df_sorted = df.sort_values(by="Profitability Score", ascending=False)

# Save ranked stocks for Growth Investor
df_sorted.to_csv("growth_investor_ranked_stocks.csv", index=False)

# Show top 10 profitable stocks
# print(df_sorted[['Stock Name', 'Profitability Score']].head(10))
