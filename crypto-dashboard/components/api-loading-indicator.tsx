"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"

interface ApiLoadingIndicatorProps {
  currentStage: number
}

export function ApiLoadingIndicator({ currentStage }: ApiLoadingIndicatorProps) {
  const stages = [
    "Fetching base data",
    "Calculating value scores",
    "Calculating growth scores",
    "Calculating risk scores",
    "Generating aggregate scores",
  ]

  return (
    <Card className="p-4 bg-card/50 backdrop-blur">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-2">
            {index < currentStage ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </motion.div>
            ) : index === currentStage ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6 text-primary" />
              </motion.div>
            ) : (
              <div className="h-6 w-6 rounded-full border border-muted" />
            )}
            <span
              className={`text-lg ${index < currentStage ? "text-muted-foreground" : index === currentStage ? "text-foreground" : "text-muted-foreground/50"}`}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}