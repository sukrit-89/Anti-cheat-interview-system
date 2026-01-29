import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AgentEntity } from './AgentEntity';
import { ParticleField } from './ParticleField';
import { AGENT_CONFIGS, type AgentState } from '@/types/agent';

interface AgentConstellationProps {
  agentState: AgentState;
  isCoding: boolean;
  mousePosition: { normalizedX: number; normalizedY: number };
  isReducedMotion: boolean;
}

export function AgentConstellation({
  agentState,
  isCoding,
  mousePosition,
  isReducedMotion,
}: AgentConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const activityLevels = useMemo(
    () => ({
      coding: agentState.coding.score,
      speech: agentState.speech.clarity,
      vision: agentState.vision.confidence,
      reasoning: agentState.reasoning.depth,
      evaluation: agentState.evaluation.overall,
    }),
    [agentState]
  );

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    const centerAgent = AGENT_CONFIGS.find((a) => a.orbitRadius === 0);
    const orbitalAgents = AGENT_CONFIGS.filter((a) => a.orbitRadius > 0);

    if (centerAgent) {
      orbitalAgents.forEach(() => {
        positions.push(0, 0, 0);
        positions.push(0, 0, 0);
      });
    }

    for (let i = 0; i < orbitalAgents.length; i++) {
      positions.push(0, 0, 0);
      positions.push(0, 0, 0);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // Mouse parallax rotation
    if (!isReducedMotion) {
      const targetRotationX = mousePosition.normalizedY * 0.1;
      const targetRotationY = mousePosition.normalizedX * 0.1;

      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
    }

    // Update connection lines
    if (linesRef.current) {
      const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.001;
      const centerAgent = AGENT_CONFIGS.find((a) => a.orbitRadius === 0);
      const orbitalAgents = AGENT_CONFIGS.filter((a) => a.orbitRadius > 0);

      let idx = 0;

      // Lines from center to orbital agents
      if (centerAgent) {
        orbitalAgents.forEach((agent, i) => {
          const orbitTime = time * agent.orbitSpeed + (i * Math.PI * 2) / 4;
          const x = Math.cos(orbitTime) * agent.orbitRadius;
          const z = Math.sin(orbitTime) * agent.orbitRadius;
          const y = Math.sin(time * agent.bobSpeed) * agent.bobAmplitude;

          positions[idx++] = 0;
          positions[idx++] = Math.sin(time * centerAgent.bobSpeed) * centerAgent.bobAmplitude;
          positions[idx++] = 0;
          positions[idx++] = x;
          positions[idx++] = y;
          positions[idx++] = z;
        });
      }

      // Lines between orbital agents
      for (let i = 0; i < orbitalAgents.length; i++) {
        const current = orbitalAgents[i];
        const next = orbitalAgents[(i + 1) % orbitalAgents.length];

        const currentTime = time * current.orbitSpeed + (i * Math.PI * 2) / 4;
        const nextTime = time * next.orbitSpeed + (((i + 1) % orbitalAgents.length) * Math.PI * 2) / 4;

        positions[idx++] = Math.cos(currentTime) * current.orbitRadius;
        positions[idx++] = Math.sin(time * current.bobSpeed) * current.bobAmplitude;
        positions[idx++] = Math.sin(currentTime) * current.orbitRadius;
        positions[idx++] = Math.cos(nextTime) * next.orbitRadius;
        positions[idx++] = Math.sin(time * next.bobSpeed) * next.bobAmplitude;
        positions[idx++] = Math.sin(nextTime) * next.orbitRadius;
      }

      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particle field background */}
      <ParticleField />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0f172a', 10, 30]} />

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </lineSegments>

      {/* Agent entities */}
      {AGENT_CONFIGS.map((config, index) => (
        <AgentEntity
          key={config.id}
          config={config}
          index={index}
          activityLevel={activityLevels[config.id as keyof typeof activityLevels]}
          isCoding={isCoding}
        />
      ))}
    </group>
  );
}
