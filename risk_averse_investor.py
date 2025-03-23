import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Load dataset
df = pd.read_csv("screener_stock_details.csv")

# Features used for profitability scoring
features = [
    "Public Holding","Debt to Equity"
]

# Convert selected columns to numeric (handle missing values)
df[features] = df[features].apply(pd.to_numeric, errors='coerce')
df = df.dropna()

# Normalize features
scaler = MinMaxScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df[features]), columns=features)

# Risk-Averse Investor weights 
weights = [-0.25,-0.1]

# Compute profitability score using dot product
df["Profitability Score"] = np.dot(df_scaled, weights)

# Rank stocks based on profitability score
df_sorted = df.sort_values(by="Profitability Score", ascending=False)

# Save ranked stocks for Risk-Averse Investor
df_sorted.to_csv("risk_averse_investor_ranked_stocks.csv", index=False)

# Show top 10 profitable stocks
# print(df_sorted[['Stock Name', 'Profitability Score']].head(10))
