"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { StockData } from "@/types/stock"
import { ExternalLink, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TopAggregateStocksProps {
  stocks: StockData[]
  isLoading: boolean
}

export function TopAggregateStocks({ stocks, isLoading }: TopAggregateStocksProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <Card className="p-6 mb-8 bg-gradient-to-b from-primary/10 to-primary/5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Top Performing Stocks</h2>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg p-5 bg-muted/30 space-y-3">
              <Skeleton className="h-6 w-3/4 animate-pulse bg-gray-500" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4 animate-pulse bg-gray-400" />
                <Skeleton className="h-4 w-4 rounded-full animate-pulse bg-gray-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-16 animate-pulse bg-gray-400" />
                    <Skeleton className="h-4 w-12 animate-pulse bg-gray-300" />
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t space-y-1">
                <Skeleton className="h-3 w-24 animate-pulse bg-gray-400" />
                <Skeleton className="h-6 w-16 animate-pulse bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stocks.slice(0, 3).map((stock, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative rounded-lg p-5 ${
                index === 0 ? "bg-primary/20 border border-primary/30" : index === 1 ? "bg-secondary/30" : "bg-muted/50"
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  #1 PICK
                </div>
              )}
              <div className={`font-bold mb-1 ${index === 0 ? "text-xl" : "text-lg"}`}>{stock.stockName}</div>
              <div className="flex justify-between items-center mb-3">
                <div className="font-mono text-sm">{stock.ticker}</div>
                <a
                  href={stock.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                  <div className="font-medium">₹{stock.cmp}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">P/E Ratio</div>
                  <div className="font-medium">{stock.peRatio}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ROCE</div>
                  <div className="font-medium">{stock.roce}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Dividend</div>
                  <div className="font-medium">{stock.dividendYield}%</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground mb-1">Aggregate Score</div>
                <div className={`font-bold ${index === 0 ? "text-2xl text-primary" : "text-xl"}`}>
                  {Number.parseFloat(stock.aggregateScore).toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Card>
  )
}

