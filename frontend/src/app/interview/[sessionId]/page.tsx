'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CodeEditor } from '@/components/interview/CodeEditor'
import { MetricsDisplay } from '@/components/interview/MetricsDisplay'
import { useWebSocket } from '@/hooks/useWebSocket'
import { sessionAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Video, Mic, MicOff, VideoOff, PhoneOff, Monitor } from 'lucide-react'
import dynamic from 'next/dynamic'

const LiveKitRoom = dynamic(
  () => import('@livekit/components-react').then((mod) => mod.LiveKitRoom),
  { ssr: false }
)

const VideoConference = dynamic(
  () => import('@livekit/components-react').then((mod) => mod.VideoConference),
  { ssr: false }
)

export default function InterviewRoom() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const sessionId = params?.sessionId as string
  
  const [session, setSession] = useState<any>(null)
  const [token, setToken] = useState<string>('')
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [metrics, setMetrics] = useState({
    engagement: 75,
    codeQuality: 65,
    communication: 80,
    problemSolving: 70,
  })

  const { events, sendEvent } = useWebSocket(sessionId)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchSession()
  }, [user, sessionId])

  useEffect(() => {
    // Update metrics from WebSocket events
    events.forEach(event => {
      if (event.type === 'metrics') {
        setMetrics(prev => ({ ...prev, ...event.data }))
      }
    })
  }, [events])

  const fetchSession = async () => {
    try {
      const response = await sessionAPI.get(parseInt(sessionId))
      setSession(response.data)
      
      // In production, get LiveKit token from backend
      // For now, using placeholder
      setToken('placeholder-token')
    } catch (error) {
      console.error('Failed to fetch session:', error)
    }
  }

  const handleCodeChange = (code: string) => {
    sendEvent('coding_event', {
      session_id: sessionId,
      code,
      timestamp: new Date().toISOString()
    })
  }

  const handleEndSession = async () => {
    try {
      await sessionAPI.end(parseInt(sessionId))
      router.push('/recruiter')
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-white/60">Loading session...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-6 py-3 backdrop-blur-xl">
        <div>
          <h1 className="text-lg font-semibold">{session.title}</h1>
          <p className="text-sm text-white/60">{user?.full_name}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={videoEnabled ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => setVideoEnabled(!videoEnabled)}
          >
            {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            variant={audioEnabled ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          {user?.role === 'recruiter' && (
            <Button variant="ghost" size="sm">
              <Monitor className="h-4 w-4 mr-2" />
              Monitor
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleEndSession}>
            <PhoneOff className="h-4 w-4 mr-2" />
            End
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Video Panel */}
        <div className="w-80 border-r border-white/10 bg-black/30 p-4">
          <Card className="mb-4 overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {/* LiveKit video will go here */}
              <div className="text-white/40 text-sm">Video Feed</div>
              {/* Uncomment when LiveKit is configured:
              <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                connect={true}
              >
                <VideoConference />
              </LiveKitRoom>
              */}
            </div>
          </Card>
          
          <MetricsDisplay metrics={metrics} />
        </div>

        {/* Right: Code Editor */}
        <div className="flex-1">
          <CodeEditor onChange={handleCodeChange} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-white/10 bg-black/50 px-6 py-2 backdrop-blur-xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-white/60">Session: {session.session_code}</span>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
              {session.status}
            </span>
          </div>
          <div className="text-white/40">
            Duration: {session.duration_minutes} minutes
          </div>
        </div>
      </div>
    </div>
  )
}
