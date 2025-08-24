'use client'

import { useState, FormEvent, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSend: (content: string, recipient: string) => void
  isSending?: boolean
}

export function MessageInput({ onSend, isSending }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [recipient, setRecipient] = useState('default-user')

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    
    if (content.trim() && recipient.trim()) {
      onSend(content, recipient)
      setContent('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient"
          className="px-3 py-2 border rounded-lg text-sm flex-shrink-0 w-32"
        />
        <div className="flex-1 text-sm text-gray-500 flex items-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={3}
          className="flex-1 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!content.trim() || !recipient.trim() || isSending}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed self-end"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
}