import pandas as pd
import numpy as np
import yfinance as yf
import datetime
import matplotlib.pyplot as plt


class TradingStrategy:
    def __init__(self, symbol):
        """Initialize the trading strategy for NSE stocks."""
        self.symbol = symbol + ".NS"  # Append NSE suffix for Yahoo Finance

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

        start_year = df['date'].dt.year.min()
        end_year = df['date'].dt.year.max()
        print(f"Data available from {start_year} to {end_year}")

        return df

    def calculate_indicators(self, df, rsi_period=14, momentum_period=20, bars_back=200, envelope_percent=14):
        """Calculate trading indicators based on TradingView's RB Knox strategy."""
        df['200_ma'] = df['close'].ewm(span=200, adjust=False).mean()
        df['envelope_upper'] = df['200_ma'] * (1 + envelope_percent / 100)
        df['envelope_lower'] = df['200_ma'] * (1 - envelope_percent / 100)

        delta = df['close'].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window=rsi_period).mean()
        avg_loss = loss.rolling(window=rsi_period).mean()
        rs = avg_gain / avg_loss
        df['rsi'] = 100 - (100 / (1 + rs))

        df['roc'] = df['close'].pct_change(momentum_period) * 100

        df['knox_divergence'] = ((df['roc'] < 0) & (df['close'].diff() > 0) & (df['rsi'] > 65)) | \
                                ((df['roc'] > 0) & (df['close'].diff() < 0) & (df['rsi'] < 35))
        df['knox_divergence'] = df['knox_divergence'].astype(int)

        return df

    def generate_signals(self, df):
        """Generate buy/sell signals based on indicators."""
        df['signal'] = 0
        df.loc[(df['knox_divergence'] == 1) & (df['rsi'] < 35), 'signal'] = 1
        df.loc[(df['knox_divergence'] == 1) & (df['rsi'] > 65), 'signal'] = -1
        return df

    def calculate_cagr(self, df, years=5):
        """Calculate CAGR for given years."""
        start_price = df['close'].iloc[-years * 252] if len(df) > years * 252 else df['close'].iloc[0]
        end_price = df['close'].iloc[-1]
        cagr = ((end_price / start_price) ** (1 / years)) - 1
        return cagr * 100

    def backtest_strategy(self, df):
        """Backtest the trading strategy on historical data."""
        initial_cash = 100000
        cash = initial_cash
        position = 0
        buy_price = 0
        wins, losses = 0, 0
        last_trades = []
        last_trade_days_ago = None
        last_trade_type = None

        for i in range(len(df)):
            if df['signal'].iloc[i] == 1 and cash > 0:
                position = cash / df['close'].iloc[i]
                buy_price = df['close'].iloc[i]
                cash = 0
                last_trade_days_ago = (df['date'].iloc[-1] - df['date'].iloc[i]).days
                last_trade_type = 'BUY'
            elif df['signal'].iloc[i] == -1 and position > 0:
                sell_price = df['close'].iloc[i]
                profit = (sell_price - buy_price) / buy_price * 100
                if profit > 0:
                    wins += 1
                else:
                    losses += 1
                cash = position * sell_price
                position = 0
                last_trades.append((df['date'].iloc[i].date(), sell_price, profit))
                last_trade_days_ago = (df['date'].iloc[-1] - df['date'].iloc[i]).days
                last_trade_type = 'SELL'

        final_value = cash if position == 0 else position * df['close'].iloc[-1]
        total_cagr = self.calculate_cagr(df, years=len(df) // 252)
        past_5_years_cagr = self.calculate_cagr(df, years=5)
        current_trend = "UP" if df['close'].iloc[-1] > df['close'].iloc[-20] else "DOWN"
        recommendation = "BUY" if position > 0 else "SELL" if cash > 0 else "HOLD"

        print("\n=== Backtest Results ===")
        print("Last 5 Trades:")
        for trade in last_trades[-5:]:
            print(f"Date: {trade[0]}, Sell Price: ₹{trade[1]:.2f}, Profit: {trade[2]:.2f}%")
        print(f"\nWins: {wins}, Losses: {losses}")
        print(f"CAGR (Past 5 Years): {past_5_years_cagr:.2f}%")
        print(f"Total CAGR: {total_cagr:.2f}%")
        print(f"Last Trade: {last_trade_type} {last_trade_days_ago} days ago")
        print(f"Current Trend: {current_trend}")
        print(f"Current Recommendation: {recommendation}\n")

    def run_strategy(self):
        """Run the complete trading strategy analysis."""
        df = self.fetch_historical_data(years=20)

        if df is None or len(df) < 200:
            print("Error: Insufficient data for analysis")
            return None

        df = self.calculate_indicators(df)
        df = self.generate_signals(df)

        self.backtest_strategy(df)


symbol = input("Enter the NSE stock symbol (e.g., RELIANCE, TCS): ").strip().upper()
strategy = TradingStrategy(symbol)
strategy.run_strategy()
