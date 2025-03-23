"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {!showDashboard ? <WelcomeScreen onStart={() => setShowDashboard(true)} /> : <Dashboard />}
    </div>
  )
}

