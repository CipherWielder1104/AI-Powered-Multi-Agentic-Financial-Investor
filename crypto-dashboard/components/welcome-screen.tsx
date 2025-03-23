// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { ArrowRight, BarChart3, TrendingUp, LineChart } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"

// interface WelcomeScreenProps {
//   onStart: () => void
// }

// export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
//   const [isLoading, setIsLoading] = useState(false)

//   const handleStart = () => {
//     setIsLoading(true)
//     // Simulate loading time before showing dashboard
//     setTimeout(() => {
//       onStart()
//     }, 2000)
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="text-center max-w-3xl"
//       >
//         <motion.div
//           className="flex justify-center mb-8"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1, rotate: 360 }}
//           transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
//         >
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>
//             <div className="relative h-24 w-24 rounded-full bg-primary flex items-center justify-center">
              
//                 <div className="absolute top-0 left-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
//                 {/* Replace with your new logo */}
//                 <img src="../Dezerv_logo.jpeg" alt="New Logo" className="h-6 w-6" />
//               </div>
//               <TrendingUp className="h-12 w-12 text-primary-foreground" />
//             </div>
//           </div>
//         </motion.div>

//         <motion.h1
//           className="text-4xl font-bold mb-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//         >
//           Stock Analysis Dashboard
//         </motion.h1>

//         <motion.p
//           className="text-muted-foreground mb-8 text-lg"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.7 }}
//         >
//           Discover top investment opportunities across different investment strategies with our advanced stock analysis
//           engine.
//         </motion.p>

//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9 }}
//         >
//           <Card className="p-4 flex flex-col items-center text-center">
//             <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
//               <BarChart3 className="h-6 w-6 text-blue-500" />
//             </div>
//             <h3 className="font-medium mb-2">Value Investing</h3>
//             <p className="text-sm text-muted-foreground">Find undervalued stocks with strong fundamentals</p>
//           </Card>

//           <Card className="p-4 flex flex-col items-center text-center">
//             <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
//               <TrendingUp className="h-6 w-6 text-green-500" />
//             </div>
//             <h3 className="font-medium mb-2">Growth Investing</h3>
//             <p className="text-sm text-muted-foreground">Discover high-growth potential opportunities</p>
//           </Card>

//           <Card className="p-4 flex flex-col items-center text-center">
//             <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
//               <LineChart className="h-6 w-6 text-amber-500" />
//             </div>
//             <h3 className="font-medium mb-2">Risk-Averse</h3>
//             <p className="text-sm text-muted-foreground">Identify stable stocks with lower volatility</p>
//           </Card>
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
//           <Button
//             size="lg"
//             onClick={handleStart}
//             disabled={isLoading}
//             className={`gap-2 text-lg px-8 py-6 relative ${isLoading ? "overflow-hidden" : ""}`}
//           >
//             {isLoading ? (
//               <>
//                 <span>Generating Recommendations...</span>
//                 <span className="absolute inset-0 rounded-md pointer-events-none">
//                   <span
//                     className="absolute inset-0 rounded-md animate-gradient-x bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0"
//                     style={{
//                       animation: "gradient-border 2s ease infinite",
//                       WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                       WebkitMaskComposite: "xor",
//                       maskComposite: "exclude",
//                       padding: "2px",
//                       borderRadius: "0.5rem",
//                       opacity: 1,
//                     }}
//                   />
//                 </span>
//               </>
//             ) : (
//               <>
//                 Generate Recommendations
//                 <ArrowRight className="h-5 w-5" />
//               </>
//             )}
//           </Button>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, BarChart3, TrendingUp, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setIsLoading(true)
    // Simulate loading time before showing dashboard
    setTimeout(() => {
      onStart()
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        {/* Company Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Image src="/Dezerv_logo.jpeg" alt="Dezerv Logo" width={180} height={60} className="rounded-md" />
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>
            <div className="relative h-24 w-24 rounded-full bg-primary flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Stock Analysis Dashboard
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Discover top investment opportunities across different investment strategies with our advanced stock analysis
          engine.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-medium mb-2">Value Investing</h3>
            <p className="text-sm text-muted-foreground">Find undervalued stocks with strong fundamentals</p>
          </Card>

          <Card className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-medium mb-2">Growth Investing</h3>
            <p className="text-sm text-muted-foreground">Discover high-growth potential opportunities</p>
          </Card>

          <Card className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
              <LineChart className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-medium mb-2">Risk-Averse</h3>
            <p className="text-sm text-muted-foreground">Identify stable stocks with lower volatility</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Button
            size="lg"
            onClick={handleStart}
            disabled={isLoading}
            className={`gap-2 text-lg px-8 py-6 relative ${isLoading ? "animate-gradient-button text-white" : ""}`}
          >
            {isLoading ? (
              <>
                <span className="relative z-10">Generating Recommendations...</span>
              </>
            ) : (
              <>
                Generate Recommendations
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

