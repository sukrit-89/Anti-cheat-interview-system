import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { AGENT_CONFIGS, type AgentState } from '@/types/agent';
import { cn } from '@/lib/utils';
import {
  Code2,
  Mic,
  Eye,
  Brain,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface AgentSidebarProps {
  agentState: AgentState;
}

const agentIcons = {
  coding: Code2,
  speech: Mic,
  vision: Eye,
  reasoning: Brain,
  evaluation: Award,
};

function MetricBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: delay + 0.1,
          }}
        />
      </div>
    </motion.div>
  );
}

function AgentCard({
  config,
  agentState,
  delay,
}: {
  config: (typeof AGENT_CONFIGS)[0];
  agentState: AgentState;
  delay: number;
}) {
  const Icon = agentIcons[config.id as keyof typeof agentIcons];
  const stateData = agentState[config.id as keyof AgentState];

  const getMetricValue = () => {
    switch (config.id) {
      case 'coding':
        return (stateData as AgentState['coding']).score;
      case 'speech':
        return (stateData as AgentState['speech']).clarity;
      case 'vision':
        return (stateData as AgentState['vision']).confidence;
      case 'reasoning':
        return (stateData as AgentState['reasoning']).depth;
      case 'evaluation':
        return (stateData as AgentState['evaluation']).overall;
      default:
        return 0;
    }
  };

  const getStatusText = () => {
    switch (config.id) {
      case 'coding':
        return (stateData as AgentState['coding']).status;
      case 'speech':
        return `${(stateData as AgentState['speech']).pace} wpm`;
      case 'vision':
        return (stateData as AgentState['vision']).posture;
      case 'reasoning':
        return (stateData as AgentState['reasoning']).approach;
      case 'evaluation':
        return (stateData as AgentState['evaluation']).recommendation;
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        'p-3 rounded-xl border transition-all',
        'bg-white/[0.03] border-white/[0.06]',
        'hover:bg-white/[0.05] hover:border-white/[0.1]'
      )}
      style={{
        boxShadow: `0 0 20px ${config.color}10`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white/90">{config.name}</p>
          <p className="text-xs text-white/40 capitalize">{getStatusText()}</p>
        </div>
      </div>
      <MetricBar
        label="Activity"
        value={getMetricValue()}
        color={config.color}
        delay={delay + 0.1}
      />
    </motion.div>
  );
}

export function AgentSidebar({ agentState }: AgentSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative h-full transition-all duration-300',
        isCollapsed ? 'w-12' : 'w-72'
      )}
    >
      <GlassCard className="h-full flex flex-col" delay={0.1}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-white/90">
                Agent Metrics
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white/60" />
            )}
          </button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {AGENT_CONFIGS.map((config, index) => (
              <AgentCard
                key={config.id}
                config={config}
                agentState={agentState}
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        )}

        {/* Collapsed state - vertical icons */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4 gap-4">
            {AGENT_CONFIGS.map((config) => {
              const Icon = agentIcons[config.id as keyof typeof agentIcons];
              return (
                <div
                  key={config.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                  title={config.name}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
