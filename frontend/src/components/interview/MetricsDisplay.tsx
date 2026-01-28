'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Eye, MessageSquare, Code2 } from 'lucide-react'

interface MetricsDisplayProps {
  metrics?: {
    engagement?: number
    codeQuality?: number
    communication?: number
    problemSolving?: number
  }
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const defaultMetrics = {
    engagement: 0,
    codeQuality: 0,
    communication: 0,
    problemSolving: 0,
    ...metrics
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" />
            Live Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MetricBar
            label="Engagement"
            value={defaultMetrics.engagement}
            icon={Eye}
            color="purple"
          />
          <MetricBar
            label="Code Quality"
            value={defaultMetrics.codeQuality}
            icon={Code2}
            color="blue"
          />
          <MetricBar
            label="Communication"
            value={defaultMetrics.communication}
            icon={MessageSquare}
            color="green"
          />
          <MetricBar
            label="Problem Solving"
            value={defaultMetrics.problemSolving}
            icon={Activity}
            color="pink"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function MetricBar({ 
  label, 
  value, 
  icon: Icon,
  color 
}: { 
  label: string
  value: number
  icon: any
  color: string
}) {
  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-sm">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
