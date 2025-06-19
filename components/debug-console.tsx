"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Trash2, Copy } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  type: "log" | "error" | "warn" | "info"
  message: string
  stack?: string
}

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const addLog = (type: LogEntry["type"], message: string, stack?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      stack,
    }
    setLogs((prev) => [...prev.slice(-49), newLog]) // Keep last 50 logs
  }

  useEffect(() => {
    // Override console methods
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    const originalInfo = console.info

    console.log = (...args) => {
      originalLog(...args)
      addLog("log", args.join(" "))
    }

    console.error = (...args) => {
      originalError(...args)
      addLog("error", args.join(" "))
    }

    console.warn = (...args) => {
      originalWarn(...args)
      addLog("warn", args.join(" "))
    }

    console.info = (...args) => {
      originalInfo(...args)
      addLog("info", args.join(" "))
    }

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      addLog("error", `Unhandled Error: ${event.message}`, event.error?.stack)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addLog("error", `Unhandled Promise Rejection: ${event.reason}`)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Initial system info
    addLog("info", `User Agent: ${navigator.userAgent}`)
    addLog("info", `URL: ${window.location.href}`)
    addLog("info", `Screen: ${window.screen.width}x${window.screen.height}`)
    addLog("info", `Viewport: ${window.innerWidth}x${window.innerHeight}`)

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
      console.info = originalInfo
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const clearLogs = () => {
    setLogs([])
    addLog("info", "Console cleared")
  }

  const copyLogs = () => {
    const logText = logs.map((log) => `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`).join("\n")
    navigator.clipboard.writeText(logText)
    addLog("info", "Logs copied to clipboard")
  }

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400"
      case "warn":
        return "text-yellow-400"
      case "info":
        return "text-blue-400"
      default:
        return "text-green-400"
    }
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 text-white"
        size="sm"
      >
        Debug Console
      </Button>
    )
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-white border-t border-gray-600 ${
        isMinimized ? "h-12" : "h-80"
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Debug Console ({logs.length})</span>
          <div className="flex space-x-1">
            <Button onClick={clearLogs} size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button onClick={copyLogs} size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setIsMinimized(!isMinimized)} size="sm" variant="ghost" className="h-6 w-6 p-0">
            {isMinimized ? "▲" : "▼"}
          </Button>
          <Button onClick={() => setIsVisible(false)} size="sm" variant="ghost" className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Logs */}
      {!isMinimized && (
        <div className="h-full overflow-y-auto p-2 text-xs font-mono">
          {logs.map((log) => (
            <div key={log.id} className="mb-1">
              <span className="text-gray-400">[{log.timestamp}]</span>{" "}
              <span className={`font-semibold ${getLogColor(log.type)}`}>{log.type.toUpperCase()}:</span>{" "}
              <span className="text-white">{log.message}</span>
              {log.stack && <pre className="text-red-300 text-xs mt-1 ml-4">{log.stack}</pre>}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  )
}
