'use client'

import { useEffect, useRef } from 'react'
import { Message } from '../hooks/useMessages'

interface MessageListProps {
  messages: Message[]
}

const sourceColors = {
  native: 'border-blue-500',
  tg: 'border-purple-500',
  dma: 'border-green-500',
  external: 'border-gray-500',
}

const sourceBgColors = {
  native: 'bg-blue-100',
  tg: 'bg-purple-100',
  dma: 'bg-green-100',
  external: 'bg-gray-100',
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet. Start a conversation!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`border-l-4 ${sourceColors[message.source as keyof typeof sourceColors] || sourceColors.external} pl-4 py-2`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm">{message.sender}</p>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800">{message.content}</p>
            </div>
            <span 
              className={`text-xs text-gray-700 ${sourceBgColors[message.source as keyof typeof sourceBgColors] || sourceBgColors.external} px-2 py-1 rounded ml-2`}
            >
              {message.source}
            </span>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}