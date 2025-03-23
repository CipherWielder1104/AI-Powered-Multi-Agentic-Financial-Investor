/**
 * Utility function to download a file
 */
export function downloadFile(content: string, filename: string, type: string) {
  // Create a blob with the content
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)

  // Create a temporary link and trigger download
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  // Clean up
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

/**
 * Utility function to download CSV data
 */
export function downloadCSV(data: any[], filename: string) {
  // Convert data to CSV format
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          // Handle values that might contain commas
          const value = row[header]?.toString() || ""
          return value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ),
  ]

  const csvContent = csvRows.join("\n")
  downloadFile(csvContent, filename, "text/csv")
}

