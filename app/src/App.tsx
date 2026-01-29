import { useState, useCallback, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentSimulation } from '@/hooks/useAgentSimulation';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { GlassCard } from '@/components/UI/GlassCard';
import { EditorPanel } from '@/components/UI/EditorPanel';
import { VideoGrid } from '@/components/UI/VideoGrid';
import { AgentSidebar } from '@/components/UI/AgentSidebar';
import { AGENT_CONFIGS } from '@/types/agent';
import { Activity, Cpu, Zap } from 'lucide-react';

// Lazy load the 3D components for better performance
const AgentConstellation = lazy(() =>
  import('@/components/Canvas/AgentConstellation').then((mod) => ({
    default: mod.AgentConstellation,
  }))
);

function StatusBar({ agentCount }: { agentCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="flex items-center justify-between px-6 py-3"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-green-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="text-sm text-white/80">
            {agentCount} Agents Active
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <Cpu className="w-4 h-4" />
          <span className="text-sm">Neural Network Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white/50">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">Real-time Analysis</span>
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono">60 FPS</span>
        </div>
      </div>
    </motion.div>
  );
}

function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="flex items-center gap-3"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <span className="text-lg font-bold text-white font-mono">I</span>
        </div>
        <motion.div
          className="absolute inset-0 rounded-xl bg-cyan-400/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold font-mono">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            InterGEN
          </span>
        </h1>
        <p className="text-xs text-white/40 tracking-wider">
          NEURAL CONSTELLATION
        </p>
      </div>
    </motion.div>
  );
}

// Loading fallback for 3D canvas
function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        <span className="text-sm text-white/50 font-mono">
          Initializing 3D Environment...
        </span>
      </div>
    </div>
  );
}

function App() {
  const agentState = useAgentSimulation();
  const { mousePosition, isReducedMotion } = useMouseParallax(5);
  const [isCoding, setIsCoding] = useState(false);

  const handleTyping = useCallback((typing: boolean) => {
    setIsCoding(typing);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b1120]">
      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {agentState.evaluation.recommendation === 'strong_hire'
          ? 'Evaluation: Strong hire recommendation'
          : agentState.evaluation.recommendation === 'hire'
          ? 'Evaluation: Hire recommendation'
          : 'Evaluation: Reject recommendation'}
      </div>

      {/* BACKGROUND LAYER (z-0): R3F Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          <Suspense fallback={null}>
            <AgentConstellation
              agentState={agentState}
              isCoding={isCoding}
              mousePosition={mousePosition}
              isReducedMotion={isReducedMotion}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* MIDDLE LAYER (z-10): 3D Agent Constellation is inside Canvas */}
      {/* This layer is handled by the Canvas component above */}

      {/* FOREGROUND LAYER (z-50): Glassmorphic UI Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div className="h-full flex flex-col p-4 md:p-6 gap-4">
          {/* Top Row: Logo and Header */}
          <div className="flex items-center justify-between pointer-events-auto">
            <Logo />

            {/* Top-right: Video Grid */}
            <div className="w-80 hidden lg:block">
              <VideoGrid />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex gap-4 min-h-0">
            {/* Left Sidebar: Agent Metrics */}
            <div className="hidden md:block pointer-events-auto">
              <AgentSidebar agentState={agentState} />
            </div>

            {/* Center: Monaco Editor */}
            <div className="flex-1 pointer-events-auto min-h-0">
              <EditorPanel onTyping={handleTyping} />
            </div>

            {/* Right: Video Grid (tablet view) */}
            <div className="w-64 hidden xl:block pointer-events-auto">
              <GlassCard className="h-full p-4" delay={0.35}>
                <h3 className="text-sm font-medium text-white/70 mb-4">
                  Live Participants
                </h3>
                <VideoGrid />
              </GlassCard>
            </div>
          </div>

          {/* Bottom: Status Bar */}
          <div className="pointer-events-auto">
            <GlassCard className="rounded-xl" delay={0.7}>
              <StatusBar agentCount={AGENT_CONFIGS.length} />
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      <Suspense fallback={<CanvasFallback />}>
        <AnimatePresence>
          {false && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-[100] flex items-center justify-center bg-[#0b1120]"
            >
              <CanvasFallback />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
