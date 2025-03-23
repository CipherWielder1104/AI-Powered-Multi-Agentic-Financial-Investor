import pandas as pd
import numpy as np
import yfinance as yf
import datetime
import matplotlib.pyplot as plt
import sys
import io

# Ensure stdout supports Unicode (UTF-8)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
file = open("reports/backtesting.txt", "w")


class TradingStrategy:
    def __init__(self, symbol):
        """Initialize the trading strategy for NSE stocks."""
        self.symbol = symbol + ".NS"  # Append NSE suffix for Yahoo Finance

    def print_current_price(self):
        """Print the current stock price."""
        stock = yf.Ticker(self.symbol)
        stock_info = stock.history(period="1d")
        current_price = stock_info['Close'].iloc[0]
        print(f"The current price of {self.symbol} is: ₹{current_price:.2f}")

    def fetch_historical_data(self, years=20):
        """Fetch historical stock data from Yahoo Finance."""
        stock = yf.Ticker(self.symbol)
        df = stock.history(period=f"{years}y")
        df.reset_index(inplace=True)

        if df.empty:
            print("Error: No data found for the given stock symbol.")
            return None

        df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
        df.columns = ['date', 'open', 'high', 'low', 'close', 'volume']

        # df.to_csv(f"{self.symbol}_historical_data.csv", mode='a', index=False, header=not pd.io.common.file_exists(f"{self.symbol}_historical_data.csv"))

        # Display the available data range
        start_year = df['date'].dt.year.min()
        end_year = df['date'].dt.year.max()
        print(f"Data available from {start_year} to {end_year}")

        return df

    def calculate_indicators(self, df, rsi_period=14, momentum_period=20, bars_back=200, envelope_percent=14):
        """Calculate trading indicators based on TradingView's RB Knox strategy."""
        # 200-day moving average (EMA) for trend confirmation
        df['200_ma'] = df['close'].ewm(span=200, adjust=False).mean()

        # Envelope Bands (Support & Resistance)
        df['envelope_upper'] = df['200_ma'] * (1 + envelope_percent / 100)
        df['envelope_lower'] = df['200_ma'] * (1 - envelope_percent / 100)

        # Relative Strength Index (RSI)
        delta = df['close'].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window=rsi_period).mean()
        avg_loss = loss.rolling(window=rsi_period).mean()
        rs = avg_gain / avg_loss
        df['rsi'] = 100 - (100 / (1 + rs))

        # Momentum Indicator (Rate of Change)
        df['roc'] = df['close'].pct_change(momentum_period) * 100

        # Identify Knoxville Divergence (Reversal Signal)
        df['knox_divergence'] = ((df['roc'] < 0) & (df['close'].diff() > 0) & (df['rsi'] > 65)) | \
                                ((df['roc'] > 0) & (df['close'].diff() < 0) & (df['rsi'] < 35))
        df['knox_divergence'] = df['knox_divergence'].astype(int)

        return df


    def calculate_cagr(self, df, years=5):
        """Calculate CAGR for given years."""
        start_price = df['close'].iloc[-years * 252] if len(df) > years * 252 else df['close'].iloc[0]
        end_price = df['close'].iloc[-1]
        cagr = ((end_price / start_price) ** (1 / years)) - 1
        return cagr * 100
    def generate_signals(self, df):
        """Generate buy/sell signals based on indicators."""
        df['signal'] = 0  # Default to no action
        df.loc[(df['knox_divergence'] == 1) & (df['rsi'] < 35), 'signal'] = 1  # Buy signal
        df.loc[(df['knox_divergence'] == 1) & (df['rsi'] > 65), 'signal'] = -1  # Sell signal
        return df

    def backtest_strategy(self, df):
        """Backtest the trading strategy on historical data."""
        stop_loss = 0
        limit_buy = 0
        last_trade_days_ago = None
        last_trade_type = None
        last_trades = []  # Store last 5 buy/sell trades

        # Iterate through historical data to track last 5 trades
        for i in range(len(df)):
            if df['signal'].iloc[i] == 1:  # Buy signal
                buy_price = df['close'].iloc[i]
                stop_loss = buy_price * 0.95  # 5% stop loss
                limit_buy = buy_price * 0.98  # Limit buy 2% lower
                last_trade_days_ago = (df['date'].iloc[-1] - df['date'].iloc[i]).days
                last_trade_type = 'BUY'
                last_trades.append((df['date'].iloc[i], 'BUY', buy_price))
            elif df['signal'].iloc[i] == -1:  # Sell signal
                sell_price = df['close'].iloc[i]
                last_trade_days_ago = (df['date'].iloc[-1] - df['date'].iloc[i]).days
                last_trade_type = 'SELL'
                last_trades.append((df['date'].iloc[i], 'SELL', sell_price))

        last_trades = last_trades[-10:]  # Keep only last 10 trades

        # Determine current market trend (up/down)
        current_trend = "UP" if df['close'].iloc[-1] > df['close'].iloc[-20] else "DOWN"
        recommendation = "HOLD/NO ACTION"

        # Generate recommendation based on last trade and current trend
        if last_trades:
            last_trade_type = last_trades[-1][1]  # Last trade was BUY or SELL

            if last_trade_type == "BUY" and current_trend == "UP":
                recommendation = "HOLD/NO ACTION"
            elif last_trade_type == "BUY" and current_trend == "DOWN":
                recommendation = "SELL"
            elif last_trade_type == "SELL" and current_trend == "UP":
                recommendation = "BUY"
            elif last_trade_type == "SELL" and current_trend == "DOWN":
                recommendation = "HOLD/NO ACTION"

        # Calculate CAGR
        total_cagr = self.calculate_cagr(df, years=len(df) // 252)
        past_5_years_cagr = self.calculate_cagr(df, years=5)
        # Display backtest results
        print("\n=== Backtest Results ===", file=file)

        print("Last 10 Trades:", file=file)
        for trade in last_trades:
            print(f"Date: {trade[0].date()}, Type: {trade[1]}, Price: ₹{trade[2]:.2f}", file=file)


        # print(f"Last Trade: {last_trade_type} {last_trade_days_ago} days ago", file=file)
        # print(f"CAGR (Past 5 Years): {past_5_years_cagr:.2f}%", file=file)
        # print(f"Total CAGR: {total_cagr:.2f}%", file=file)

        # print(f"Current Trend: {current_trend}")
        # print(f"Current Recommendation: {recommendation}", file=file)
        # print(f"Suggested Stop Loss: ₹{stop_loss:.2f}", file=file)
        # print(f"Suggested Limit Buy: ₹{limit_buy:.2f}\n", file=file)

    def run_strategy(self):
        """Run the complete trading strategy analysis."""
        self.print_current_price()  # Print current price
        df = self.fetch_historical_data(years=20)
        if df is None or len(df) < 200:
            print("Error: Insufficient data for analysis")
            return None
        df = self.calculate_indicators(df)
        df = self.generate_signals(df)
        self.backtest_strategy(df)


def process_csv_and_run():
    """Reads stock symbols from the CSV, runs the strategy, and appends results to a new file."""
    df = pd.read_csv("combined_stocks_with_scores.csv")  # Read input CSV

    if 'Ticker' not in df.columns:
        print("Error: 'Ticker' column not found in the CSV file.")
        return
    
    tickers = df['Ticker'].dropna().head(5)  # Select first five stock tickers
    results = []

    for symbol in tickers:
        print(f"\nRunning strategy for {symbol}", file=file)
        strategy = TradingStrategy(symbol)
        stock_df = strategy.fetch_historical_data()
        if stock_df is not None:
            stock_df = strategy.calculate_indicators(stock_df)
            stock_df = strategy.generate_signals(stock_df)
            strategy.backtest_strategy(stock_df)

            # Collect results
            last_close = stock_df['close'].iloc[-1]
            total_cagr = strategy.calculate_cagr(stock_df, years=len(stock_df) // 252)
            past_5_years_cagr = strategy.calculate_cagr(stock_df, years=5)

            results.append([symbol, last_close, total_cagr, past_5_years_cagr])

    # Convert results to DataFrame
    results_df = pd.DataFrame(results, columns=['Ticker', 'Last Close', 'Total CAGR', 'CAGR (5 Years)'])

    # Merge with original CSV data
    merged_df = df.merge(results_df, on='Ticker', how='left')

    # Save to new CSV file
    merged_df.to_csv("final_chart.csv", index=False)

    print("\nFinal results saved to final_chart.csv")

# Call the function to process the first five stocks
process_csv_and_run()
file.close()