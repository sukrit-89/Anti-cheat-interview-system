import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export const createWebSocketConnection = (sessionId: string): Socket => {
  const socket = io(`${WS_URL}/ws/session/${sessionId}`, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket
}

export const createLiveMonitorConnection = (sessionId: string): Socket => {
  const socket = io(`${WS_URL}/ws/live/${sessionId}`, {
    transports: ['websocket'],
    reconnection: true,
  })

  return socket
}
