"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUpRight, Download, BarChart3, Home, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TopPerformersCard } from "@/components/top-performers-card"
import { ApiLoadingIndicator } from "@/components/api-loading-indicator"
import { TopAggregateStocks } from "@/components/top-aggregate-stocks"
import { StockTable } from "@/components/stock-table"
import { useStockData } from "@/hooks/use-stock-data"
import { useReports } from "@/hooks/use-reports"

export function Dashboard() {
  const {
    stockData,
    isLoading,
    currentApiStage,
    valueTopStocks,
    growthTopStocks,
    riskAverseTopStocks,
    topAggregateStocks,
  } = useStockData()

  const { reports, isLoadingReports } = useReports()
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="grid lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: 0 }}
            className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
          >
            <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <span className="font-bold text-xl">cent.</span>
        </div>

        <nav className="space-y-2 px-2 py-4">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "analysis" ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab("analysis")}
          >
            <BarChart3 className="h-4 w-4" />
            Analysis
          </Button>

          <div className="pt-4">
            <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">Reports</h3>
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-1">
                {reports.map((report, index) => (
                  <Button
                    key={index}
                    variant={activeTab === `report-${index}` ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm font-normal gap-2"
                    onClick={() => setActiveTab(`report-${index}`)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{report.name.split(".")[0]}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="p-6 overflow-auto h-screen">
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Stock Analysis Dashboard</h1>
                <p className="text-muted-foreground">
                  View top performing stocks across different investment strategies
                </p>
              </div>
              <ApiLoadingIndicator currentStage={currentApiStage} />
            </div>

            {/* Top performers cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <TopPerformersCard
                title="Value Investor Picks"
                stocks={valueTopStocks}
                isLoading={isLoading}
                color="blue"
              />
              <TopPerformersCard
                title="Growth Investor Picks"
                stocks={growthTopStocks}
                isLoading={isLoading}
                color="green"
              />
              <TopPerformersCard
                title="Risk-Averse Picks"
                stocks={riskAverseTopStocks}
                isLoading={isLoading}
                color="amber"
              />
            </div>

            {/* Top aggregate stocks */}
            <TopAggregateStocks stocks={topAggregateStocks} isLoading={isLoading} />
          </motion.div>
        )}

        {activeTab === "analysis" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Stock Analysis</h1>
              <p className="text-muted-foreground">Detailed analysis of all stocks in our database</p>
            </div>

            <Card className="p-6">
              <StockTable data={stockData} isLoading={isLoading} />
            </Card>
          </motion.div>
        )}

        {/* Report view */}
        {reports.map((report, index) => {
          if (activeTab === `report-${index}`) {
            return (
              <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{report.name}</h2>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap h-[70vh] overflow-auto">
                    {report.content}
                  </div>
                </Card>
              </motion.div>
            )
          }
          return null
        })}
      </main>
    </div>
  )
}

