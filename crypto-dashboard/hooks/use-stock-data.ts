"use client"

import { useState, useEffect } from "react"
import type { StockData } from "@/types/stock"

// Mock data for demonstration
// const mockStockData: StockData[] = [
//   {
//     stockName: "Reliance Industries",
//     valueInvestorScore: "8.7",
//     growthInvestorScore: "7.9",
//     riskAverseInvestorScore: "6.8",
//     aggregateScore: "7.8",
//     url: "https://example.com/reliance",
//     ticker: "RELIANCE",
//     cmp: "2450.75",
//     peRatio: "28.5",
//     marketCap: "1654321",
//     dividendYield: "0.8",
//     netProfitQtr: "16543",
//     qtrProfitVar: "12.5",
//     salesQtr: "156432",
//     qtrSalesVar: "8.7",
//     roce: "14.5",
//     publicHolding: "49.2",
//     debtToEquity: "0.65",
//     profitPrev12M: "65432",
//     salesVar5Yrs: "15.6",
//     profitVar5Yrs: "18.2",
//   },
//   {
//     stockName: "HDFC Bank",
//     valueInvestorScore: "9.2",
//     growthInvestorScore: "7.5",
//     riskAverseInvestorScore: "8.9",
//     aggregateScore: "8.5",
//     url: "https://example.com/hdfc",
//     ticker: "HDFCBANK",
//     cmp: "1650.30",
//     peRatio: "22.1",
//     marketCap: "912345",
//     dividendYield: "1.2",
//     netProfitQtr: "12345",
//     qtrProfitVar: "15.2",
//     salesQtr: "98765",
//     qtrSalesVar: "12.3",
//     roce: "18.2",
//     publicHolding: "52.8",
//     debtToEquity: "0.45",
//     profitPrev12M: "45678",
//     salesVar5Yrs: "16.8",
//     profitVar5Yrs: "19.5",
//   },
//   {
//     stockName: "Infosys",
//     valueInvestorScore: "7.8",
//     growthInvestorScore: "8.5",
//     riskAverseInvestorScore: "7.9",
//     aggregateScore: "8.1",
//     url: "https://example.com/infosys",
//     ticker: "INFY",
//     cmp: "1450.60",
//     peRatio: "24.3",
//     marketCap: "612345",
//     dividendYield: "2.5",
//     netProfitQtr: "6543",
//     qtrProfitVar: "8.7",
//     salesQtr: "32456",
//     qtrSalesVar: "10.5",
//     roce: "25.6",
//     publicHolding: "65.4",
//     debtToEquity: "0.12",
//     profitPrev12M: "23456",
//     salesVar5Yrs: "12.4",
//     profitVar5Yrs: "14.8",
//   },
//   {
//     stockName: "Tata Consultancy Services",
//     valueInvestorScore: "8.1",
//     growthInvestorScore: "7.8",
//     riskAverseInvestorScore: "8.5",
//     aggregateScore: "8.1",
//     url: "https://example.com/tcs",
//     ticker: "TCS",
//     cmp: "3250.45",
//     peRatio: "26.8",
//     marketCap: "1198765",
//     dividendYield: "1.8",
//     netProfitQtr: "9876",
//     qtrProfitVar: "7.6",
//     salesQtr: "48765",
//     qtrSalesVar: "9.2",
//     roce: "42.5",
//     publicHolding: "27.8",
//     debtToEquity: "0.05",
//     profitPrev12M: "38765",
//     salesVar5Yrs: "11.2",
//     profitVar5Yrs: "13.5",
//   },
//   {
//     stockName: "ICICI Bank",
//     valueInvestorScore: "8.5",
//     growthInvestorScore: "7.9",
//     riskAverseInvestorScore: "7.6",
//     aggregateScore: "8.0",
//     url: "https://example.com/icici",
//     ticker: "ICICIBANK",
//     cmp: "950.25",
//     peRatio: "20.5",
//     marketCap: "654321",
//     dividendYield: "1.5",
//     netProfitQtr: "7654",
//     qtrProfitVar: "18.5",
//     salesQtr: "34567",
//     qtrSalesVar: "14.2",
//     roce: "16.8",
//     publicHolding: "63.2",
//     debtToEquity: "0.78",
//     profitPrev12M: "28765",
//     salesVar5Yrs: "15.2",
//     profitVar5Yrs: "17.8",
//   },
//   {
//     stockName: "Hindustan Unilever",
//     valueInvestorScore: "7.2",
//     growthInvestorScore: "6.8",
//     riskAverseInvestorScore: "9.1",
//     aggregateScore: "7.7",
//     url: "https://example.com/hul",
//     ticker: "HINDUNILVR",
//     cmp: "2650.80",
//     peRatio: "65.4",
//     marketCap: "587654",
//     dividendYield: "2.2",
//     netProfitQtr: "2345",
//     qtrProfitVar: "5.6",
//     salesQtr: "12345",
//     qtrSalesVar: "7.8",
//     roce: "32.5",
//     publicHolding: "38.5",
//     debtToEquity: "0.15",
//     profitPrev12M: "9876",
//     salesVar5Yrs: "8.5",
//     profitVar5Yrs: "10.2",
//   },
//   {
//     stockName: "Bharti Airtel",
//     valueInvestorScore: "6.8",
//     growthInvestorScore: "8.2",
//     riskAverseInvestorScore: "6.5",
//     aggregateScore: "7.2",
//     url: "https://example.com/airtel",
//     ticker: "BHARTIARTL",
//     cmp: "850.45",
//     peRatio: "32.1",
//     marketCap: "498765",
//     dividendYield: "0.5",
//     netProfitQtr: "1987",
//     qtrProfitVar: "25.6",
//     salesQtr: "28765",
//     qtrSalesVar: "18.5",
//     roce: "12.5",
//     publicHolding: "44.2",
//     debtToEquity: "1.25",
//     profitPrev12M: "7654",
//     salesVar5Yrs: "18.5",
//     profitVar5Yrs: "22.5",
//   },
//   {
//     stockName: "Asian Paints",
//     valueInvestorScore: "6.5",
//     growthInvestorScore: "8.7",
//     riskAverseInvestorScore: "8.2",
//     aggregateScore: "7.8",
//     url: "https://example.com/asianpaints",
//     ticker: "ASIANPAINT",
//     cmp: "3150.25",
//     peRatio: "85.6",
//     marketCap: "302145",
//     dividendYield: "0.7",
//     netProfitQtr: "1234",
//     qtrProfitVar: "9.8",
//     salesQtr: "7654",
//     qtrSalesVar: "12.5",
//     roce: "28.5",
//     publicHolding: "27.5",
//     debtToEquity: "0.08",
//     profitPrev12M: "4567",
//     salesVar5Yrs: "14.5",
//     profitVar5Yrs: "16.8",
//   },
//   {
//     stockName: "Larsen & Toubro",
//     valueInvestorScore: "8.9",
//     growthInvestorScore: "7.2",
//     riskAverseInvestorScore: "6.9",
//     aggregateScore: "7.7",
//     url: "https://example.com/lt",
//     ticker: "LT",
//     cmp: "2450.75",
//     peRatio: "28.5",
//     marketCap: "345678",
//     dividendYield: "1.1",
//     netProfitQtr: "3456",
//     qtrProfitVar: "15.6",
//     salesQtr: "23456",
//     qtrSalesVar: "11.2",
//     roce: "15.6",
//     publicHolding: "51.2",
//     debtToEquity: "0.85",
//     profitPrev12M: "12345",
//     salesVar5Yrs: "10.5",
//     profitVar5Yrs: "12.8",
//   },
//   {
//     stockName: "Bajaj Finance",
//     valueInvestorScore: "7.5",
//     growthInvestorScore: "9.2",
//     riskAverseInvestorScore: "7.1",
//     aggregateScore: "7.9",
//     url: "https://example.com/bajajfinance",
//     ticker: "BAJFINANCE",
//     cmp: "6750.30",
//     peRatio: "35.8",
//     marketCap: "407865",
//     dividendYield: "0.3",
//     netProfitQtr: "2876",
//     qtrProfitVar: "22.5",
//     salesQtr: "12876",
//     qtrSalesVar: "19.8",
//     roce: "21.5",
//     publicHolding: "56.8",
//     debtToEquity: "2.35",
//     profitPrev12M: "9876",
//     salesVar5Yrs: "25.6",
//     profitVar5Yrs: "28.9",
//   },
// ]

export function useStockData() {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentApiStage, setCurrentApiStage] = useState(0)

  const [valueTopStocks, setValueTopStocks] = useState<StockData[]>([])
  const [growthTopStocks, setGrowthTopStocks] = useState<StockData[]>([])
  const [riskAverseTopStocks, setRiskAverseTopStocks] = useState<StockData[]>([])
  const [topAggregateStocks, setTopAggregateStocks] = useState<StockData[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulate API calls with delays
        setIsLoading(true)

        // Stage 1: Fetch base data
        // setCurrentApiStage(0)
        // await new Promise((resolve) => setTimeout(resolve, 1500))

        // // Stage 2: Calculate value scores
        // setCurrentApiStage(1)
        // await new Promise((resolve) => setTimeout(resolve, 1200))

        // // Stage 3: Calculate growth scores
        // setCurrentApiStage(2)
        // await new Promise((resolve) => setTimeout(resolve, 1300))

        // // Stage 4: Calculate risk scores
        // setCurrentApiStage(3)
        // await new Promise((resolve) => setTimeout(resolve, 1400))

        // // Stage 5: Generate aggregate scores
        // setCurrentApiStage(4)
        // await new Promise((resolve) => setTimeout(resolve, 1000))
        setCurrentApiStage(0);
        const baseData = await fetch('http://localhost:5000/api/stocks/base').then(res => res.json());
        console.log(baseData);
        
        // Stage 2: Calculate value scores
        setCurrentApiStage(1);
        const valueScores = await fetch('http://localhost:5000/api/stocks/value-scores').then(res => res.json());
        
        // Stage 3: Calculate growth scores
        setCurrentApiStage(2);
        const growthScores = await fetch('http://localhost:5000/api/stocks/growth-scores').then(res => res.json());
        
        // Stage 4: Calculate risk scores
        setCurrentApiStage(3);
        const riskScores = await fetch('http://localhost:5000/api/stocks/risk-scores').then(res => res.json());
        
        // Stage 5: Generate aggregate scores
        setCurrentApiStage(4);
        const aggregateScores = await fetch('http://localhost:5000/api/stocks/aggregate-scores').then(res => res.json());

        // Set the data
        setStockData(aggregateScores);


        const combinedData = aggregateScores.map(stock => ({
          stockName: stock["Stock Name"],
          valueInvestorScore: stock["Value Investor Score"].toString(),
          growthInvestorScore: stock["Growth Investor Score"].toString(),
          riskAverseInvestorScore: stock["Risk-Averse Investor Score"].toString(),
          aggregateScore: stock["Aggregate Score"].toString(),
          url: stock["URL"],
          ticker: stock["Ticker"],
          cmp: stock["CMP (Rs.)"].toString(),
          peRatio: stock["P/E Ratio"].toString(),
          marketCap: stock["Market Cap (Rs. Cr.)"].toString(),
          dividendYield: stock["Dividend Yield (%)"].toString(),
          netProfitQtr: stock["Net Profit (Qtr) (Rs. Cr.)"].toString(),
          qtrProfitVar: stock["Qtr Profit Var (%)"].toString(),
          salesQtr: stock["Sales (Qtr) (Rs. Cr.)"].toString(),
          qtrSalesVar: stock["Qtr Sales Var (%)"].toString(),
          roce: stock["ROCE (%)"].toString(),
          publicHolding: stock["Public Holding"].toString(),
          debtToEquity: stock["Debt to Equity"].toString(),
          profitPrev12M: stock["Profit Prev 12M (Rs. Cr.)"].toString(),
          salesVar5Yrs: stock["Sales Var (5Yrs) (%)"].toString(),
          profitVar5Yrs: stock["Profit Var (5Yrs) (%)"].toString()
        }));

        setStockData(combinedData);

        // Sort and set top stocks for each category
        const valueStocks = [...combinedData]
          .sort((a, b) => Number.parseFloat(b.valueInvestorScore) - Number.parseFloat(a.valueInvestorScore))
          .slice(0, 3)

        const growthStocks = [...combinedData]
          .sort((a, b) => Number.parseFloat(b.growthInvestorScore) - Number.parseFloat(a.growthInvestorScore))
          .slice(0, 3)

        const riskAverseStocks = [...combinedData]
          .sort((a, b) => Number.parseFloat(b.riskAverseInvestorScore) - Number.parseFloat(a.riskAverseInvestorScore))
          .slice(0, 3)

        const aggregateStocks = [...combinedData]
          .sort((a, b) => Number.parseFloat(b.aggregateScore) - Number.parseFloat(a.aggregateScore))
          .slice(0, 3)

        setValueTopStocks(valueStocks)
        setGrowthTopStocks(growthStocks)
        setRiskAverseTopStocks(riskAverseStocks)
        setTopAggregateStocks(aggregateStocks)

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching stock data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    stockData,
    isLoading,
    currentApiStage,
    valueTopStocks,
    growthTopStocks,
    riskAverseTopStocks,
    topAggregateStocks,
  }
}






// "use client"

// import { useState, useEffect } from "react"
// import type { StockData } from "@/types/stock"

// // Mock data remains for fallback
// const mockStockData: StockData[] = [
//   // ... (keeping all the original mock data)
// ]

// export function useStockData() {
//   const [stockData, setStockData] = useState<StockData[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [currentApiStage, setCurrentApiStage] = useState(0)

//   const [valueTopStocks, setValueTopStocks] = useState<StockData[]>([])
//   const [growthTopStocks, setGrowthTopStocks] = useState<StockData[]>([])
//   const [riskAverseTopStocks, setRiskAverseTopStocks] = useState<StockData[]>([])
//   const [topAggregateStocks, setTopAggregateStocks] = useState<StockData[]>([])

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setIsLoading(true)
//         let processedData = []

//         // Stage 1: Fetch base data
//         setCurrentApiStage(0)
//         const baseResponse = await fetch('http://localhost:5000/api/stocks/base')
//         const baseDataText = await baseResponse.text()
//         const baseData = parseCSVtoJSON(baseDataText)
        
//         // Stage 2: Calculate value scores
//         setCurrentApiStage(1)
//         const valueResponse = await fetch('http://localhost:5000/api/stocks/value-scores')
//         const valueDataText = await valueResponse.text()
//         const valueScores = parseCSVtoJSON(valueDataText)
        
//         // Stage 3: Calculate growth scores
//         setCurrentApiStage(2)
//         const growthResponse = await fetch('http://localhost:5000/api/stocks/growth-scores')
//         const growthDataText = await growthResponse.text()
//         const growthScores = parseCSVtoJSON(growthDataText)
        
//         // Stage 4: Calculate risk scores
//         setCurrentApiStage(3)
//         const riskResponse = await fetch('http://localhost:5000/api/stocks/risk-scores')
//         const riskDataText = await riskResponse.text()
//         const riskScores = parseCSVtoJSON(riskDataText)
        
//         // Stage 5: Generate aggregate scores
//         setCurrentApiStage(4)
//         const aggregateResponse = await fetch('http://localhost:5000/api/stocks/aggregate-scores')
//         const aggregateDataText = await aggregateResponse.text()
//         const aggregateScores = parseCSVtoJSON(aggregateDataText)

//         // Since all APIs return the same data format, we'll use data from all responses
//         // For a real implementation, we'd merge the data based on stock ticker

//         // Process and map the data to the required format
//         processedData = baseData.map((stockItem) => {
//           console.log(stockItem);
//           const ticker = stockItem["Ticker"]
//           // Find corresponding items from other score lists (in real case these would be different)
//           const valueItem = valueScores.find(item => item["Ticker"] === ticker) || stockItem
//           const growthItem = growthScores.find(item => item["Ticker"] === ticker) || stockItem
//           const riskItem = riskScores.find(item => item["Ticker"] === ticker) || stockItem
//           const aggregateItem = aggregateScores.find(item => item["Ticker"] === ticker) || stockItem
          
//           // Generate scores for each investor type based on relevant metrics
//           // In a real implementation, these would come from the different API responses
//           const valueScore = calculateValueScore(stockItem).toFixed(1)
//           const growthScore = calculateGrowthScore(stockItem).toFixed(1)
//           const riskScore = calculateRiskScore(stockItem).toFixed(1)
//           const aggScore = calculateAggregateScore(valueScore, growthScore, riskScore)
          
//           return {
//             stockName: stockItem["Stock Name"],
//             ticker: stockItem["Ticker"],
//             url: "https://example.com" + stockItem["URL"],
//             cmp: stockItem["CMP (Rs.)"].toString(),
//             peRatio: stockItem["P/E Ratio"].toString(),
//             marketCap: stockItem["Market Cap (Rs. Cr.)"].toString(),
//             dividendYield: stockItem["Dividend Yield (%)"].toString(),
//             netProfitQtr: stockItem["Net Profit (Qtr) (Rs. Cr.)"].toString(),
//             qtrProfitVar: stockItem["Qtr Profit Var (%)"].toString(),
//             salesQtr: stockItem["Sales (Qtr) (Rs. Cr.)"].toString(),
//             qtrSalesVar: stockItem["Qtr Sales Var (%)"].toString(),
//             roce: stockItem["ROCE (%)"].toString(),
//             publicHolding: stockItem["Public Holding"].toString(),
//             debtToEquity: stockItem["Debt to Equity"].toString(),
//             profitPrev12M: stockItem["Profit Prev 12M (Rs. Cr.)"].toString(),
//             salesVar5Yrs: stockItem["Sales Var (5Yrs) (%)"].toString(),
//             profitVar5Yrs: stockItem["Profit Var (5Yrs) (%)"].toString(),
//             valueInvestorScore: valueScore,
//             growthInvestorScore: growthScore,
//             riskAverseInvestorScore: riskScore,
//             aggregateScore: aggScore
//           }
//         })

//         setStockData(processedData)

//         // Sort and set top stocks for each category
//         const valueStocks = [...processedData]
//           .sort((a, b) => Number.parseFloat(b.valueInvestorScore) - Number.parseFloat(a.valueInvestorScore))
//           .slice(0, 3)

//         const growthStocks = [...processedData]
//           .sort((a, b) => Number.parseFloat(b.growthInvestorScore) - Number.parseFloat(a.growthInvestorScore))
//           .slice(0, 3)

//         const riskAverseStocks = [...processedData]
//           .sort((a, b) => Number.parseFloat(b.riskAverseInvestorScore) - Number.parseFloat(a.riskAverseInvestorScore))
//           .slice(0, 3)

//         const aggregateStocks = [...processedData]
//           .sort((a, b) => Number.parseFloat(b.aggregateScore) - Number.parseFloat(a.aggregateScore))
//           .slice(0, 3)

//         setValueTopStocks(valueStocks)
//         setGrowthTopStocks(growthStocks)
//         setRiskAverseTopStocks(riskAverseStocks)
//         setTopAggregateStocks(aggregateStocks)

//         setIsLoading(false)
//       } catch (error) {
//         console.error("Error fetching stock data:", error)
        
//         // Fallback to mock data if the API calls fail
//         setStockData(mockStockData)
        
//         // Sort and set top stocks from mock data
//         const valueStocks = [...mockStockData]
//           .sort((a, b) => Number.parseFloat(b.valueInvestorScore) - Number.parseFloat(a.valueInvestorScore))
//           .slice(0, 3)

//         const growthStocks = [...mockStockData]
//           .sort((a, b) => Number.parseFloat(b.growthInvestorScore) - Number.parseFloat(a.growthInvestorScore))
//           .slice(0, 3)

//         const riskAverseStocks = [...mockStockData]
//           .sort((a, b) => Number.parseFloat(b.riskAverseInvestorScore) - Number.parseFloat(a.riskAverseInvestorScore))
//           .slice(0, 3)

//         const aggregateStocks = [...mockStockData]
//           .sort((a, b) => Number.parseFloat(b.aggregateScore) - Number.parseFloat(a.aggregateScore))
//           .slice(0, 3)

//         setValueTopStocks(valueStocks)
//         setGrowthTopStocks(growthStocks)
//         setRiskAverseTopStocks(riskAverseStocks)
//         setTopAggregateStocks(aggregateStocks)
        
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Helper function to parse CSV to JSON
//   function parseCSVtoJSON(csvText) {
//     const lines = csvText.split("\n")
//     const headers = lines[0].split(",").map(header => header.trim())
    
//     const result = []
//     for (let i = 1; i < lines.length; i++) {
//       if (lines[i].trim() === "") continue
      
//       const obj = {}
//       const currentLine = lines[i].split(",")
      
//       for (let j = 0; j < headers.length; j++) {
//         // Handle numeric values
//         const value = currentLine[j]?.trim()
//         obj[headers[j]] = isNaN(value) ? value : parseFloat(value)
//       }
      
//       result.push(obj)
//     }
    
//     return result
//   }

//   // Functions to calculate scores based on metrics
//   function calculateValueScore(stock) {
//     // Example algorithm for value score (customize as needed)
//     const peScore = stock["P/E Ratio"] < 30 ? 10 : 5
//     const dyScore = stock["Dividend Yield (%)"] * 3
//     const roceScore = stock["ROCE (%)"] / 20
    
//     return (peScore + dyScore + roceScore) / 3 * 10
//   }

//   function calculateGrowthScore(stock) {
//     // Example algorithm for growth score
//     const profitGrowthScore = stock["Profit Var (5Yrs) (%)"] / 3
//     const salesGrowthScore = stock["Sales Var (5Yrs) (%)"] / 3
//     const qtrGrowthScore = stock["Qtr Profit Var (%)"] / 5
    
//     return (profitGrowthScore + salesGrowthScore + qtrGrowthScore) / 3 * 10
//   }

//   function calculateRiskScore(stock) {
//     // Example algorithm for risk score
//     const debtScore = stock["Debt to Equity"] < 0.5 ? 10 : 5
//     const publicHoldingScore = stock["Public Holding"] / 10
//     const volatilityScore = 7 // Fixed score (would be based on volatility in real case)
    
//     return (debtScore + publicHoldingScore + volatilityScore) / 3 * 10
//   }

//   function calculateAggregateScore(valueScore, growthScore, riskScore) {
//     // Equal weighted average of all scores
//     return ((parseFloat(valueScore) + parseFloat(growthScore) + parseFloat(riskScore)) / 3).toFixed(1)
//   }

//   return {
//     stockData,
//     isLoading,
//     currentApiStage,
//     valueTopStocks,
//     growthTopStocks,
//     riskAverseTopStocks,
//     topAggregateStocks,
//   }
// }
