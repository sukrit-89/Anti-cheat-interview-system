import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AgentEntity } from './AgentEntity';
import { ParticleField } from './ParticleField';
import { AGENT_CONFIGS, type AgentState } from '../../types/agent';

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

  useFrame((state) => {
    if (!groupRef.current) return;

    // Throttle updates for better performance
    if (state.clock.elapsedTime % 0.1 < 0.016) {
      // Mouse parallax rotation
      if (!isReducedMotion) {
        const targetRotationX = mousePosition.normalizedY * 0.05;
        const targetRotationY = mousePosition.normalizedX * 0.05;

        groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.03;
        groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.03;
      }

      // Update connection lines (simplified)
      if (linesRef.current) {
        const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
        const time = Date.now() * 0.0005; // Slower animation
        const centerAgent = AGENT_CONFIGS.find((a) => a.orbitRadius === 0);
        const orbitalAgents = AGENT_CONFIGS.filter((a) => a.orbitRadius > 0);

        let idx = 0;

        // Lines from center to orbital agents (simplified)
        if (centerAgent) {
          orbitalAgents.forEach((agent, i) => {
            const orbitTime = time * agent.orbitSpeed + (i * Math.PI * 2) / 4;
            const x = Math.cos(orbitTime) * agent.orbitRadius;
            const z = Math.sin(orbitTime) * agent.orbitRadius;
            const y = Math.sin(time * agent.bobSpeed) * agent.bobAmplitude * 0.5; // Reduced amplitude

            positions[idx++] = 0;
            positions[idx++] = 0;
            positions[idx++] = 0;
            positions[idx++] = x;
            positions[idx++] = y;
            positions[idx++] = z;
          });
        }

        linesRef.current.geometry.attributes.position.needsUpdate = true;
      }
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
