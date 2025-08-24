'use client'

import { useMessages } from '../../hooks/useMessages'
import { MessageList } from '../../components/MessageList'
import { MessageInput } from '../../components/MessageInput'
import { ConnectionStatus } from '../../components/ConnectionStatus'

export default function InboxPage() {
  const { messages, isConnected, sendMessage, isSending } = useMessages()

  const handleSend = (content: string, recipient: string) => {
    sendMessage({ content, recipient })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                統合インボックス
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                All your messages in one place
              </p>
            </div>
            <ConnectionStatus isConnected={isConnected} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col bg-white shadow-lg my-4 rounded-lg overflow-hidden">
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} isSending={isSending} />
      </main>
    </div>
  )
}