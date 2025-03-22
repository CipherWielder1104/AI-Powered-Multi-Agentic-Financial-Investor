import pandas as pd
import numpy as np
import yfinance as yf
import datetime
import matplotlib.pyplot as plt
from scipy.stats import linregress

class TradingStrategy:
    def __init__(self, symbol):
        """Initialize the trading strategy for NSE stocks."""
        self.symbol = symbol + ".NS"  # NSE suffix for Yahoo Finance
    
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
        return df
    
    def calculate_indicators(self, df, rsi_period=14, momentum_period=20):
        """Calculate indicators: 200-day MA, RSI, Rate of Change (ROC), and RB Knox."""
        df['200_ma'] = df['close'].rolling(window=200).mean()
        
        # RSI Calculation
        delta = df['close'].diff()
        gain = delta.where(delta > 0, 0).rolling(window=rsi_period).mean()
        loss = -delta.where(delta < 0, 0).rolling(window=rsi_period).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # Rate of Change (Momentum)
        df['roc'] = df['close'].pct_change(momentum_period) * 100
        
        # Trend Slope
        df['trend'] = 0.0
        for i in range(momentum_period, len(df)):
            slice_y = df.iloc[i-momentum_period:i]['close'].values
            slice_x = np.arange(len(slice_y))
            slope, _, _, _, _ = linregress(slice_x, slice_y)
            df.loc[i, 'trend'] = slope
        
        # RB Knox Indicator
        df['rb_knox'] = (df['rsi'] + df['roc'] + df['trend'] * 10) / 3
        return df
    
    def generate_signals(self, df):
        """Generate buy/sell signals based on 200 MA and RB Knox."""
        df['signal'] = 0
        
        buy_condition = (df['close'] < df['200_ma']) & (df['rb_knox'] > 50)
        df.loc[buy_condition, 'signal'] = 1
        
        sell_condition = df['rsi'] > 70  # Overbought condition for selling
        df.loc[sell_condition, 'signal'] = -1
        
        return df
    
    def backtest_strategy(self, df):
        """Backtest the strategy and display successful trades."""
        initial_cash = 100000  # Initial investment in INR
        cash = initial_cash
        position = 0
        buy_price = 0
        wins, losses = 0, 0
        trade_details = []

        for i in range(len(df)):
            if df['signal'].iloc[i] == 1:  # Buy signal
                if cash > 0:
                    position = cash / df['close'].iloc[i]
                    buy_price = df['close'].iloc[i]
                    cash = 0  # Invest all cash
                    trade_details.append(f"BUY at {buy_price:.2f} on {df['date'].iloc[i].date()}")

            elif df['signal'].iloc[i] == -1 and position > 0:  # Sell signal
                sell_price = df['close'].iloc[i]
                profit = (sell_price - buy_price) / buy_price * 100
                if profit > 0:
                    wins += 1
                else:
                    losses += 1
                
                cash = position * sell_price  # Convert position to cash
                position = 0
                trade_details.append(f"SELL at {sell_price:.2f} on {df['date'].iloc[i].date()} | Profit: {profit:.2f}%")

        final_value = cash if position == 0 else position * df['close'].iloc[-1]
        profit_percentage = ((final_value - initial_cash) / initial_cash) * 100

        print("\n=== Backtest Results ===")
        for trade in trade_details:
            print(trade)

        print(f"\nWins: {wins}, Losses: {losses}")
        if wins + losses > 0:
            print(f"Success Rate: {wins / (wins + losses) * 100:.2f}%")
        print(f"Total Portfolio Growth: {profit_percentage:.2f}%\n")
    
    def predict_next_buy(self, df):
        """Predict in how many days the next buy opportunity will arise based on historical patterns."""
        buy_indices = df[df['signal'] == 1].index.tolist()
        
        if len(buy_indices) < 2:
            print("Not enough buy signals to make a reliable prediction.")
            return None

        buy_intervals = np.diff(buy_indices)
        avg_buy_interval = int(np.mean(buy_intervals)) if len(buy_intervals) > 0 else None
        
        if avg_buy_interval:
            next_buy_date = df['date'].iloc[-1] + datetime.timedelta(days=avg_buy_interval)
            print(f"Predicted next buy date: {next_buy_date.date()}")
        return avg_buy_interval

    def estimate_target_profit(self, df):
        """Estimate target profit based on historical data after buy signals."""
        buy_points = df[df['signal'] == 1].index.tolist()
        profits = []
        
        for buy_idx in buy_points:
            future_prices = df.loc[buy_idx:buy_idx+30, 'close']
            if len(future_prices) > 1:
                max_profit = (future_prices.max() - df.loc[buy_idx, 'close']) / df.loc[buy_idx, 'close'] * 100
                profits.append(max_profit)
        
        if profits:
            avg_profit = np.mean(profits)
            print(f"Estimated target profit: {avg_profit:.2f}%")
        else:
            print("Not enough data to estimate target profit.")
    
    def run_strategy(self):
        """Run the complete strategy analysis."""
        df = self.fetch_historical_data(years=20)
        
        if df is None or len(df) < 200:
            print("Error: Insufficient data for analysis")
            return None
        
        df = self.calculate_indicators(df)
        df = self.generate_signals(df)
        
        print(f"\nStock: {self.symbol}")
        print(f"Current Price: ₹{df['close'].iloc[-1]:.2f}")
        print(f"200-Day MA: ₹{df['200_ma'].iloc[-1]:.2f}")
        print(f"RB Knox Indicator: {df['rb_knox'].iloc[-1]:.2f}")
        
        # Backtest and show successful trades
        self.backtest_strategy(df)
        
        # Predict next buy timing
        self.predict_next_buy(df)
        
        # Estimate target profit
        self.estimate_target_profit(df)

# Ask the user for stock input
symbol = input("Enter the NSE stock symbol (e.g., RELIANCE, TCS): ").strip().upper()

# Run strategy
strategy = TradingStrategy(symbol)
strategy.run_strategy()
