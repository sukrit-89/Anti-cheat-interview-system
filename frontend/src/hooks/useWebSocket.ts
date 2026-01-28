import { useEffect, useState } from 'react'
import { createWebSocketConnection } from '@/lib/websocket'
import type { Socket } from 'socket.io-client'

export interface SessionEvent {
  type: string
  data: any
  timestamp: string
}

export function useWebSocket(sessionId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [events, setEvents] = useState<SessionEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    const ws = createWebSocketConnection(sessionId)
    setSocket(ws)

    ws.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    })

    ws.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    ws.on('session_event', (event: SessionEvent) => {
      setEvents((prev) => [...prev, event])
    })

    ws.on('coding_event', (data: any) => {
      setEvents((prev) => [...prev, { type: 'coding', data, timestamp: new Date().toISOString() }])
    })

    ws.on('metrics_update', (data: any) => {
      setEvents((prev) => [...prev, { type: 'metrics', data, timestamp: new Date().toISOString() }])
    })

    return () => {
      ws.disconnect()
    }
  }, [sessionId])

  const sendEvent = (type: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(type, data)
    }
  }

  return { socket, events, isConnected, sendEvent }
}
