'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sessionAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { LogIn, Loader2, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function CandidateDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [sessionCode, setSessionCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (user.role !== 'candidate') {
      router.push('/recruiter')
    }
  }, [user, router])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await sessionAPI.join({ session_code: sessionCode })
      const { session_id } = response.data
      router.push(`/interview/${session_id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to join session')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
            <span className="text-xl font-bold">AI Interview</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/60">
              {user?.full_name} ({user?.role})
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold gradient-text">Welcome, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-xl text-white/60">Ready for your interview?</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
                <LogIn className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl">Join Interview Session</CardTitle>
              <CardDescription>Enter the 6-character code provided by your interviewer</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleJoin} className="space-y-6">
                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Session Code
                  </label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="ABC123"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    required
                    className="text-center text-2xl font-mono tracking-widest"
                  />
                  <p className="text-xs text-white/40">
                    The code is case-insensitive and usually 6 characters
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join Session'
                  )}
                </Button>
              </form>

              <div className="mt-8 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                <h3 className="mb-2 font-semibold text-purple-400">Before You Join:</h3>
                <ul className="space-y-1 text-sm text-white/60">
                  <li>✓ Test your camera and microphone</li>
                  <li>✓ Find a quiet, well-lit space</li>
                  <li>✓ Have a stable internet connection</li>
                  <li>✓ Close unnecessary applications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/60">
                <ol className="list-decimal space-y-2 pl-4">
                  <li>Enter the session code</li>
                  <li>Join the video call</li>
                  <li>Complete coding challenges</li>
                  <li>Receive AI-powered evaluation</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/60">
                <ul className="space-y-2">
                  <li>• Live video interview</li>
                  <li>• Real-time code editor</li>
                  <li>• AI behavior analysis</li>
                  <li>• Instant feedback</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
