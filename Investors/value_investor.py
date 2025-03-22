import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Load dataset
df = pd.read_csv("screener_stock_details.csv")

# Features relevant to a Value Investor (from your columns)
value_investor_features = [
    "P/E Ratio", "ROCE (%)"
]

# Convert selected columns to numeric (handle missing values)
df[value_investor_features] = df[value_investor_features].apply(pd.to_numeric, errors='coerce')
df = df.dropna()

# Normalize features
scaler = MinMaxScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df[value_investor_features]), columns=value_investor_features)

# Weights for Value Investor (P/E should be negatively weighted, others positively weighted)
value_investor_weights = [-0.10, 0.60]  # Adjusted weights based on the investor's preferences

# Compute profitability score using dot product
df["Profitability Score"] = np.dot(df_scaled, value_investor_weights)

# Rank stocks based on profitability score
df_sorted_value = df.sort_values(by="Profitability Score", ascending=False)

# Save ranked stocks for Value Investor
df_sorted_value.to_csv("value_investor_ranked_stocks.csv", index=False)

# Show top 10 profitable stocks for Value Investor
print(df_sorted_value[['Stock Name', 'Profitability Score']].head(10))
