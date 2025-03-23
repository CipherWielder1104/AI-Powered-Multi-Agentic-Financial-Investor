// "use client"

// import { useState, useEffect } from "react"

// interface Report {
//   name: string
//   content: string
// }

// export function useReports() {
//   const [reports, setReports] = useState<Report[]>([])
//   const [isLoadingReports, setIsLoadingReports] = useState(true)

//   useEffect(() => {
//     async function fetchReports() {
//       try {
//         // Simulate API call with delay
//         await new Promise((resolve) => setTimeout(resolve, 3500))

//         // Mock reports data
//         const mockReports: Report[] = [
//           {
//             name: "Value Investing Analysis.txt",
//             content: `# Value Investing Analysis Report
            
// Date: ${new Date().toLocaleDateString()}

// ## Overview
// This report analyzes the top value investment opportunities based on fundamental metrics including P/E ratio, dividend yield, and book value.

// ## Key Findings
// 1. Banking sector stocks show strong value characteristics with reasonable P/E ratios and healthy dividend yields.
// 2. Infrastructure companies present good value with strong balance sheets and reasonable valuations.
// 3. Several IT companies are trading below their 5-year average P/E ratios, presenting potential value opportunities.

// ## Detailed Analysis
// The stocks were evaluated based on the following criteria:
// - P/E ratio compared to industry average
// - Price-to-book value
// - Dividend yield
// - Return on equity
// - Debt-to-equity ratio
// - Free cash flow yield

// ## Recommendations
// Consider allocating capital to the top 3 value stocks identified in this analysis, with a suggested holding period of 3-5 years to realize full value potential.`,
//           },
//           {
//             name: "Growth Stock Analysis.txt",
//             content: `# Growth Stock Analysis Report
            
// Date: ${new Date().toLocaleDateString()}

// ## Overview
// This report identifies high-growth potential stocks based on revenue growth, earnings momentum, and market opportunity.

// ## Key Findings
// 1. Technology sector continues to show strong growth potential with several mid-cap companies expanding rapidly.
// 2. Financial technology companies are disrupting traditional banking with innovative solutions.
// 3. Healthcare and pharmaceutical companies focused on innovative treatments show promising growth trajectories.

// ## Detailed Analysis
// The stocks were evaluated based on the following criteria:
// - Revenue growth rate (3-year CAGR)
// - Earnings growth rate (3-year CAGR)
// - Return on invested capital
// - Market share growth
// - Industry growth potential
// - Management quality and execution

// ## Recommendations
// The identified growth stocks may be suitable for investors with a higher risk tolerance and a time horizon of at least 2-3 years.`,
//           },
//           {
//             name: "Risk-Averse Investment Strategy.txt",
//             content: `# Risk-Averse Investment Strategy Report
            
// Date: ${new Date().toLocaleDateString()}

// ## Overview
// This report focuses on identifying stable, low-volatility stocks suitable for risk-averse investors seeking capital preservation with moderate growth.

// ## Key Findings
// 1. Consumer staples companies offer stability with consistent cash flows and lower beta values.
// 2. Utility companies provide steady dividends and relatively stable price movements.
// 3. Blue-chip companies with strong balance sheets offer relative safety during market downturns.

// ## Detailed Analysis
// The stocks were evaluated based on the following criteria:
// - Beta (volatility relative to market)
// - Dividend consistency and growth
// - Balance sheet strength
// - Earnings stability
// - Industry defensiveness
// - Historical drawdown performance

// ## Recommendations
// The identified low-risk stocks are suitable for conservative investors, retirees, or as a stabilizing component of a diversified portfolio.`,
//           },
//           {
//             name: "Sector Rotation Analysis.txt",
//             content: `# Sector Rotation Analysis Report
            
// Date: ${new Date().toLocaleDateString()}

// ## Overview
// This report analyzes the current economic cycle and identifies sectors positioned to outperform in the coming 12-18 months.

// ## Key Findings
// 1. As interest rates stabilize, financial sector stocks may benefit from improved net interest margins.
// 2. Infrastructure and industrial sectors show promise with increased government spending on development projects.
// 3. Healthcare sector offers defensive characteristics with growth potential from innovation.

// ## Detailed Analysis
// The analysis considers:
// - Current position in the economic cycle
// - Monetary policy trends
// - Fiscal policy initiatives
// - Sector performance in similar historical periods
// - Relative valuation metrics across sectors

// ## Recommendations
// Consider tactical allocation shifts to overweight the identified sectors while maintaining strategic asset allocation targets.`,
//           },
//           {
//             name: "Technical Analysis Overview.txt",
//             content: `# Technical Analysis Overview Report
            
// Date: ${new Date().toLocaleDateString()}

// ## Overview
// This report provides technical analysis of key stocks and market indices to identify potential entry and exit points.

// ## Key Findings
// 1. Several stocks are approaching key support or resistance levels that may provide trading opportunities.
// 2. Market breadth indicators suggest improving market health despite recent volatility.
// 3. Sector rotation patterns indicate money flow shifting toward cyclical sectors.

// ## Detailed Analysis
// The technical analysis includes:
// - Price trend analysis using moving averages
// - Support and resistance level identification
// - Relative strength analysis
// - Volume pattern analysis
// - Momentum indicator readings
// - Chart pattern recognition

// ## Recommendations
// Technical signals should be used in conjunction with fundamental analysis for optimal decision-making. The identified patterns suggest potential short to medium-term trading opportunities.`,
//           },
//         ]

//         setReports(mockReports)
//         setIsLoadingReports(false)
//       } catch (error) {
//         console.error("Error fetching reports:", error)
//         setIsLoadingReports(false)
//       }
//     }

//     fetchReports()
//   }, [])

//   return { reports, isLoadingReports }
// }




"use client"

import { useState, useEffect } from "react"

interface Report {
  name: string
  content: string
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      try {
        // Fetch reports from the API
        const response = await fetch('http://localhost:5000/api/stocks/reports')
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports')
        }
        
        // Parse the JSON response
        const reportsData: Record<string, string> = await response.json()

        // Transform the data into the expected format
        const formattedReports: Report[] = Object.keys(reportsData).map((name) => ({
          name,
          content: reportsData[name],
        }))

        setReports(formattedReports)
        setIsLoadingReports(false)
      } catch (error) {
        console.error("Error fetching reports:", error)
        setIsLoadingReports(false)
      }
    }

    fetchReports()
  }, [])

  return { reports, isLoadingReports }
}
