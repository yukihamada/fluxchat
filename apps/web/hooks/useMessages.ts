import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Message {
  id: string
  content: string
  sender: string
  recipient: string
  source: string
  timestamp: string
}

export interface SendMessageParams {
  content: string
  recipient: string
  source?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export function useMessages(userId?: string) {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Fetch initial messages
  const { data: initialMessages } = useQuery({
    queryKey: ['messages', 'inbox'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/messages/inbox`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      return response.json()
    },
    refetchOnWindowFocus: false,
  })

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const response = await fetch(`${API_BASE}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },
    onSuccess: (data) => {
      // Optimistically add to local state
      setMessages(prev => [...prev, data])
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  // Connect to SSE stream
  useEffect(() => {
    const userParam = userId || 'default-user'
    const eventSource = new EventSource(`${API_BASE}/api/stream?user_id=${userParam}`)

    eventSource.onopen = () => {
      console.log('SSE connection opened')
      setIsConnected(true)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      setIsConnected(false)
    }

    eventSource.addEventListener('connected', (event) => {
      console.log('Connected to stream:', event.data)
    })

    eventSource.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data)
        setMessages(prev => [...prev, message])
        
        // Invalidate queries to update UI
        queryClient.invalidateQueries({ queryKey: ['messages'] })
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    })

    eventSource.addEventListener('heartbeat', (event) => {
      // Keep connection alive
      console.debug('Heartbeat:', event.data)
    })

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [userId, queryClient])

  // Combine initial messages with real-time messages
  const allMessages = [...(initialMessages || []), ...messages]
    .filter((msg, index, self) => 
      self.findIndex(m => m.id === msg.id) === index
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return {
    messages: allMessages,
    isConnected,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  }
}