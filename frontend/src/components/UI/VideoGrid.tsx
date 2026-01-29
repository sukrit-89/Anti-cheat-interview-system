import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Video, VideoOff, Mic, MicOff, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VideoTileProps {
  name: string;
  role: string;
  isLocal?: boolean;
  delay?: number;
}

function VideoTile({ name, role, isLocal = false, delay = 0 }: VideoTileProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  return (
    <GlassCard
      delay={delay}
      hoverScale={1.02}
      glowColor={isLocal ? '#00d4ff' : undefined}
      className="relative aspect-video overflow-hidden"
    >
      {/* Video placeholder / Avatar */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        {isVideoOn ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br',
                  isLocal
                    ? 'from-cyan-500/30 to-blue-600/30'
                    : 'from-purple-500/30 to-pink-600/30'
                )}
              >
                <User className="w-8 h-8 text-white/70" />
              </div>
              {/* Speaking indicator */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center">
              <User className="w-10 h-10 text-white/50" />
            </div>
            <span className="text-sm text-white/50">Camera off</span>
          </div>
        )}
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/90">{name}</p>
            <p className="text-xs text-white/50">{role}</p>
          </div>
          {isLocal && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={cn(
                  'p-1.5 rounded-lg transition-all',
                  isMicOn
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-red-500/50 hover:bg-red-500/70'
                )}
                aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? (
                  <Mic className="w-4 h-4 text-white/80" />
                ) : (
                  <MicOff className="w-4 h-4 text-white/80" />
                )}
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={cn(
                  'p-1.5 rounded-lg transition-all',
                  isVideoOn
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-red-500/50 hover:bg-red-500/70'
                )}
                aria-label={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? (
                  <Video className="w-4 h-4 text-white/80" />
                ) : (
                  <VideoOff className="w-4 h-4 text-white/80" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* You badge for local user */}
      {isLocal && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-cyan-500/30 border border-cyan-500/50">
          <span className="text-xs text-cyan-300 font-medium">You</span>
        </div>
      )}
    </GlassCard>
  );
}

export function VideoGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <VideoTile name="Alex Chen" role="Candidate" isLocal delay={0.3} />
      <VideoTile name="Sarah Miller" role="Technical Lead" delay={0.4} />
      <VideoTile name="James Park" role="Senior Engineer" delay={0.5} />
      <VideoTile name="AI Panel" role="Neural Constellation" delay={0.6} />
    </div>
  );
}
