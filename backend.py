from flask import Flask, jsonify, request
import profitability_metrics as base_data
import growth_investor as growth_scores, value_investor as value_scores, risk_averse_investor as risk_scores
import aggregator as aggregate_scores
# import llm_new
import price_analysis
import io
import pandas as pd
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/stocks/base', methods=['GET'])
def get_base_data():
    try:
        df = pd.read_csv("screener_stock_details.csv")
        json_data = df.to_dict(orient='records')
        return jsonify(json_data)
    except Exception as e:
        return jsonify({"error": f"Failed to process: {str(e)}"}), 500

@app.route('/api/stocks/value-scores', methods=['GET'])
def get_value_scores():
    try:
        df = pd.read_csv("screener_stock_details.csv")
        json_data = df.to_dict(orient='records')
        return jsonify(json_data)
    except Exception as e:
        return jsonify({"error": f"Failed to process: {str(e)}"}), 500

@app.route('/api/stocks/growth-scores', methods=['GET'])
def get_growth_scores():
    try:
        df = pd.read_csv("screener_stock_details.csv")
        json_data = df.to_dict(orient='records')
        return jsonify(json_data)
    except Exception as e:
        return jsonify({"error": f"Failed to process: {str(e)}"}), 500

@app.route('/api/stocks/risk-scores', methods=['GET'])
def get_risk_scores():
    try:
        df = pd.read_csv("screener_stock_details.csv")
        json_data = df.to_dict(orient='records')
        return jsonify(json_data)
    except Exception as e:
        return jsonify({"error": f"Failed to process: {str(e)}"}), 500

@app.route('/api/stocks/aggregate-scores', methods=['GET'])
def get_aggregate_scores():
    try:
        df = pd.read_csv("combined_stocks_with_scores.csv")
        json_data = df.to_dict(orient='records')
        return jsonify(json_data)
    except Exception as e:
        return jsonify({"error": f"Failed to process: {str(e)}"}), 500


@app.route('/api/stocks/reports', methods=['GET'])
def get_reports_list():
    """
    Endpoint to list available reports.
    
    Returns:
        Response: A JSON response containing a list of available reports
    """
    # import llm_new
    try:
        # Path to the 'reports' folder
        reports_folder = 'reports'

        # List all files in the 'reports' directory and filter for .txt files
        report_files = [f for f in os.listdir(reports_folder) if f.endswith('.txt')]

        # Read contents of each .txt file
        reports_data = {}
        for file_name in report_files:
            file_path = os.path.join(reports_folder, file_name)
            with open(file_path, 'r') as file:
                content = file.read()
                reports_data[file_name] = content

        # Return the reports and their contents as JSON
        return jsonify(reports_data)
    except Exception as e:
        app.logger.error(f"Error listing reports: {str(e)}")
        return jsonify({"error": f"Failed to list reports: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
