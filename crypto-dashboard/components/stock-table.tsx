"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react"
import type { StockData } from "@/types/stock"

interface StockTableProps {
  data: StockData[]
  isLoading: boolean
}

export function StockTable({ data, isLoading }: StockTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<StockData>[] = [
    {
      accessorKey: "stockName",
      header: "Stock Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("stockName")}</div>,
    },
    {
      accessorKey: "ticker",
      header: "Ticker",
      cell: ({ row }) => <div className="font-mono">{row.getValue("ticker")}</div>,
    },
    {
      accessorKey: "aggregateScore",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Aggregate Score
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => {
        const score = Number.parseFloat(row.getValue("aggregateScore"))
        return <div className="font-medium">{score.toFixed(2)}</div>
      },
    },
    {
      accessorKey: "cmp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            CMP (₹)
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
    },
    {
      accessorKey: "peRatio",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            P/E Ratio
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
    },
    {
      accessorKey: "marketCap",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Market Cap (Cr)
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("marketCap"))
        const formatted = new Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 0,
        }).format(amount)
        return <div>₹{formatted}</div>
      },
    },
    {
      accessorKey: "dividendYield",
      header: "Dividend Yield",
      cell: ({ row }) => {
        return <div>{row.getValue("dividendYield")}%</div>
      },
    },
    {
      accessorKey: "roce",
      header: "ROCE",
      cell: ({ row }) => {
        return <div>{row.getValue("roce")}%</div>
      },
    },
    {
      accessorKey: "url",
      header: "",
      cell: ({ row }) => {
        const url = row.getValue("url") as string
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </a>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    globalFilterFn: (row, columnId, value) => {
      const safeValue = (() => {
        const val = row.getValue(columnId)
        return typeof val === "number" ? String(val) : val
      })()

      return safeValue?.toString().toLowerCase().includes(value.toLowerCase())
    },
    filterFns: {
      fuzzy: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        return String(value).toLowerCase().includes(filterValue.toLowerCase())
      },
    },
  })

  if (isLoading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 0, 270, 270, 0],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="mb-4"
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="text-muted-foreground text-lg">Crunching the latest stock data...</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search stocks..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className={row.getIsSelected() ? "bg-muted/50" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </motion.div>
  )
}

