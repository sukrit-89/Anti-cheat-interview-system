export interface AgentState {
  coding: {
    score: number;
    status: 'analyzing' | 'idle';
    complexity: number;
  };
  speech: {
    clarity: number;
    pace: number;
    fillerWords: number;
  };
  vision: {
    eyeContact: number;
    posture: 'good' | 'poor';
    confidence: number;
  };
  reasoning: {
    depth: number;
    approach: 'optimal' | 'suboptimal';
    steps: number;
  };
  evaluation: {
    overall: number;
    recommendation: 'strong_hire' | 'hire' | 'reject';
  };
}

export interface AgentConfig {
  id: string;
  name: string;
  color: string;
  shape: 'box' | 'sphere' | 'icosahedron' | 'torusKnot' | 'octahedron';
  orbitRadius: number;
  orbitSpeed: number;
  bobSpeed: number;
  bobAmplitude: number;
}

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 'coding',
    name: 'CodingAgent',
    color: '#00d4ff',
    shape: 'box',
    orbitRadius: 3,
    orbitSpeed: 0.5,
    bobSpeed: 1.5,
    bobAmplitude: 0.3,
  },
  {
    id: 'speech',
    name: 'SpeechAgent',
    color: '#ff006e',
    shape: 'sphere',
    orbitRadius: 4,
    orbitSpeed: 0.35,
    bobSpeed: 1.2,
    bobAmplitude: 0.25,
  },
  {
    id: 'vision',
    name: 'VisionAgent',
    color: '#fb5607',
    shape: 'icosahedron',
    orbitRadius: 5,
    orbitSpeed: 0.25,
    bobSpeed: 1.0,
    bobAmplitude: 0.35,
  },
  {
    id: 'reasoning',
    name: 'ReasoningAgent',
    color: '#8338ec',
    shape: 'torusKnot',
    orbitRadius: 6,
    orbitSpeed: 0.15,
    bobSpeed: 0.8,
    bobAmplitude: 0.4,
  },
  {
    id: 'evaluation',
    name: 'EvaluationAgent',
    color: '#ffbe0b',
    shape: 'octahedron',
    orbitRadius: 0,
    orbitSpeed: 0,
    bobSpeed: 0.5,
    bobAmplitude: 0.2,
  },
];
