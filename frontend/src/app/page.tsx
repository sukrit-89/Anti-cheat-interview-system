'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Scene3D } from '@/components/3d/Scene3D'
import { HeroScene } from '@/components/3d/HeroScene'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Code, Brain, BarChart3, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      {/* 3D Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <Scene3D>
          <HeroScene />
        </Scene3D>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
            <span className="text-xl font-bold">AI Interview</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[80vh] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm">
            🚀 Powered by AI Agents
          </div>
          
          <h1 className="mb-6 text-6xl font-bold leading-tight md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Next-Gen
            </span>
            <br />
            Technical Interviews
          </h1>
          
          <p className="mb-8 text-xl text-white/60 md:text-2xl">
            AI-powered platform with real-time evaluation,
            <br />
            live coding, and autonomous agent assessment
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400">10K+</div>
              <div className="text-sm text-white/60">Interviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400">95%</div>
              <div className="text-sm text-white/60">Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">5</div>
              <div className="text-sm text-white/60">AI Agents</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-white/60">Everything you need for modern technical interviews</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            <CardContent className="p-12">
              <h2 className="mb-4 text-4xl font-bold">Ready to Transform Your Hiring?</h2>
              <p className="mb-8 text-xl text-white/60">
                Join hundreds of companies using AI-powered interviews
              </p>
              <Link href="/register">
                <Button size="lg" className="text-lg">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-white/60">
          <p>© 2026 AI Interview Platform. Built for scalability. Designed for production.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Video,
    title: 'Live Video Interviews',
    description: 'WebRTC-powered video streaming with real-time collaboration',
  },
  {
    icon: Code,
    title: 'Code Editor',
    description: 'Monaco editor with syntax highlighting and execution',
  },
  {
    icon: Brain,
    title: 'AI Agents',
    description: '5 autonomous agents analyzing coding, speech, and behavior',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Metrics',
    description: 'Live performance tracking and instant feedback',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'JWT authentication with role-based access control',
  },
  {
    icon: Zap,
    title: 'Event-Driven',
    description: 'Redis pub/sub for scalable real-time updates',
  },
]
