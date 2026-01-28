'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sessionAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Plus, Calendar, Clock, Users, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Session {
  id: number
  title: string
  description?: string
  session_code: string
  status: string
  scheduled_at: string
  duration_minutes: number
  created_at: string
}

export default function RecruiterDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (user.role !== 'recruiter') {
      router.push('/candidate')
      return
    }

    fetchSessions()
  }, [user, router])

  const fetchSessions = async () => {
    try {
      const response = await sessionAPI.list()
      setSessions(response.data)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
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
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Interview Sessions</h1>
              <p className="mt-2 text-white/60">Manage and monitor your technical interviews</p>
            </div>
            
            <Link href="/recruiter/create">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Session
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Total Sessions</p>
                    <p className="text-3xl font-bold">{sessions.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Live Now</p>
                    <p className="text-3xl font-bold">
                      {sessions.filter(s => s.status === 'LIVE').length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Scheduled</p>
                    <p className="text-3xl font-bold">
                      {sessions.filter(s => s.status === 'SCHEDULED').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Completed</p>
                    <p className="text-3xl font-bold">
                      {sessions.filter(s => s.status === 'COMPLETED').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-pink-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-white/60">Loading sessions...</p>
                </CardContent>
              </Card>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="mb-4 text-white/60">No sessions yet</p>
                  <Link href="/recruiter/create">
                    <Button>Create Your First Session</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="group transition-all hover:border-purple-500/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{session.title}</CardTitle>
                          <CardDescription>{session.description}</CardDescription>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-white/60">
                              Code: <span className="font-mono text-purple-400">{session.session_code}</span>
                            </span>
                            <span className={`rounded-full px-2 py-1 text-xs ${
                              session.status === 'LIVE' ? 'bg-green-500/20 text-green-400' :
                              session.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/interview/${session.id}/monitor`}>
                            <Button variant="outline" size="sm">
                              Monitor
                            </Button>
                          </Link>
                          <Link href={`/interview/${session.id}`}>
                            <Button size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
