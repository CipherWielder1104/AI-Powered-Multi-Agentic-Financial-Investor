"use client"

import { useEffect, useState } from "react"
import { marked } from "marked"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    // Set up marked options
    marked.use({
      breaks: true,
      gfm: true,
    })

    // Convert markdown to HTML
    setHtml(marked.parse(content))
  }, [content])

  return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

