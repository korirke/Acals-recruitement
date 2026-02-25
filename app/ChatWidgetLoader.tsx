"use client"
import { useEffect } from "react"

interface RAGChatWidgetOptions {
  apiUrl: string
  title: string
  theme: "auto" | "light" | "dark"
  avatar?: string
  showTime?: boolean
  placeholder?: string
  popupMessage?: string
  popupDelay?: number
  popupAutoHideDelay?: number
}

interface RAGChatWidgetConstructor {
  new (options: RAGChatWidgetOptions): void
}

// Extend window type globally
declare global {
  interface Window {
    RAGChatWidget?: RAGChatWidgetConstructor
  }
}

export default function ChatWidgetLoader() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "https://rag-chat-widget-git-main-kiprutokels-projects.vercel.app/assets/embed-script.js"
    script.type = "module"
    script.async = true
    script.onload = () => {
      if (typeof window !== "undefined" && window.RAGChatWidget) {
        new window.RAGChatWidget({
          apiUrl: "https://rag-render-newy.onrender.com/api",
          title: "FCL Assistant",
          theme: "auto",
          avatar:
            "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
          showTime: true,
          placeholder: "Ask me about fortune...",
          popupMessage: "Hello, how can I assist you?",
          popupDelay: 1000,
          popupAutoHideDelay: 60000,
        })
      } else {
        console.error("RAGChatWidget still not loaded")
      }
    }
    document.body.appendChild(script)
  }, [])

  return null
}
