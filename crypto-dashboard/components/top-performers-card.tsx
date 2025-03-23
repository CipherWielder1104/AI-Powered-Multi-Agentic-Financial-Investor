"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { StockData } from "@/types/stock"
import { ExternalLink, Loader2 } from "lucide-react"

interface TopPerformersCardProps {
  title: string
  stocks: StockData[]
  isLoading: boolean
  color: "blue" | "green" | "amber"
}

export function TopPerformersCard({ title, stocks, isLoading, color }: TopPerformersCardProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-500/5 shadow-blue-500/10",
    green: "from-green-500/20 to-green-500/5 shadow-green-500/10",
    amber: "from-amber-500/20 to-amber-500/5 shadow-amber-500/10",
  }

  const glowVariants = {
    loading: {
      boxShadow: [
        "0 0 10px 2px rgba(var(--color-rgb), 0.3)",
        "0 0 20px 4px rgba(var(--color-rgb), 0.5)",
        "0 0 10px 2px rgba(var(--color-rgb), 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
    loaded: {
      boxShadow: "0 0 10px 2px rgba(var(--color-rgb), 0.2)",
    },
  }

  const colorRgb = {
    blue: "59, 130, 246",
    green: "34, 197, 94",
    amber: "245, 158, 11",
  }

  return (
    <motion.div
      initial="loading"
      animate={isLoading ? "loading" : "loaded"}
      variants={glowVariants}
      style={{ "--color-rgb": colorRgb[color] } as any}
    >
      <Card className={`p-5 h-full bg-gradient-to-b ${colorClasses[color]} shadow-lg`}>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground text-sm">Crunching the latest data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stocks.slice(0, 3).map((stock, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`font-medium flex items-center ${index === 0 ? "text-lg" : "text-base"}`}>
                    {stock.stockName}
                    <a
                      href={stock.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-mono">{stock.ticker}</span>
                    <span>•</span>
                    <span>₹{stock.cmp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${index === 0 ? "text-lg" : "text-base"}`}>
                    {Number.parseFloat(stock.aggregateScore).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}

