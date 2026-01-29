import { useState, useEffect, useCallback, useRef } from 'react';
import { type AgentState } from '@/types/agent';

const initialState: AgentState = {
  coding: { score: 75, status: 'analyzing', complexity: 3 },
  speech: { clarity: 82, pace: 120, fillerWords: 5 },
  vision: { eyeContact: 78, posture: 'good', confidence: 85 },
  reasoning: { depth: 70, approach: 'optimal', steps: 4 },
  evaluation: { overall: 78, recommendation: 'hire' },
};

function interpolateValue(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function useAgentSimulation() {
  const [agentState, setAgentState] = useState<AgentState>(initialState);
  const targetStateRef = useRef<AgentState>(initialState);
  const animationFrameRef = useRef<number | null>(null);

  const generateRandomTarget = useCallback((): AgentState => {
    return {
      coding: {
        score: Math.floor(Math.random() * 35) + 60,
        status: Math.random() > 0.3 ? 'analyzing' : 'idle',
        complexity: Math.floor(Math.random() * 5) + 1,
      },
      speech: {
        clarity: Math.floor(Math.random() * 35) + 60,
        pace: Math.floor(Math.random() * 60) + 90,
        fillerWords: Math.floor(Math.random() * 15),
      },
      vision: {
        eyeContact: Math.floor(Math.random() * 35) + 60,
        posture: Math.random() > 0.2 ? 'good' : 'poor',
        confidence: Math.floor(Math.random() * 35) + 60,
      },
      reasoning: {
        depth: Math.floor(Math.random() * 35) + 60,
        approach: Math.random() > 0.3 ? 'optimal' : 'suboptimal',
        steps: Math.floor(Math.random() * 6) + 2,
      },
      evaluation: {
        overall: Math.floor(Math.random() * 35) + 60,
        recommendation: Math.random() > 0.7 ? 'strong_hire' : Math.random() > 0.3 ? 'hire' : 'reject',
      },
    };
  }, []);

  // Update target state every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      targetStateRef.current = generateRandomTarget();
    }, 3000);

    return () => clearInterval(interval);
  }, [generateRandomTarget]);

  // Smooth interpolation animation
  useEffect(() => {
    const animate = () => {
      setAgentState((prev) => {
        const target = targetStateRef.current;
        const factor = 0.05; // Smooth interpolation factor

        return {
          coding: {
            score: Math.round(interpolateValue(prev.coding.score, target.coding.score, factor)),
            status: target.coding.status,
            complexity: target.coding.complexity,
          },
          speech: {
            clarity: Math.round(interpolateValue(prev.speech.clarity, target.speech.clarity, factor)),
            pace: Math.round(interpolateValue(prev.speech.pace, target.speech.pace, factor)),
            fillerWords: Math.round(interpolateValue(prev.speech.fillerWords, target.speech.fillerWords, factor)),
          },
          vision: {
            eyeContact: Math.round(interpolateValue(prev.vision.eyeContact, target.vision.eyeContact, factor)),
            posture: target.vision.posture,
            confidence: Math.round(interpolateValue(prev.vision.confidence, target.vision.confidence, factor)),
          },
          reasoning: {
            depth: Math.round(interpolateValue(prev.reasoning.depth, target.reasoning.depth, factor)),
            approach: target.reasoning.approach,
            steps: target.reasoning.steps,
          },
          evaluation: {
            overall: Math.round(interpolateValue(prev.evaluation.overall, target.evaluation.overall, factor)),
            recommendation: target.evaluation.recommendation,
          },
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return agentState;
}
