import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type AgentConfig } from '@/types/agent';

interface AgentEntityProps {
  config: AgentConfig;
  index: number;
  activityLevel: number;
  isCoding?: boolean;
}

export function AgentEntity({ config, index, activityLevel, isCoding = false }: AgentEntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const initialAngle = useMemo(() => (index * Math.PI * 2) / 4, [index]);

  const geometry = useMemo(() => {
    switch (config.shape) {
      case 'box':
        return new THREE.BoxGeometry(0.6, 0.6, 0.6);
      case 'sphere':
        return new THREE.SphereGeometry(0.35, 16, 16);
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(0.4, 0);
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8);
      case 'octahedron':
        return new THREE.OctahedronGeometry(0.45, 0);
      default:
        return new THREE.BoxGeometry(0.6, 0.6, 0.6);
    }
  }, [config.shape]);

  const wireframeGeometry = useMemo(() => {
    const geo = geometry.clone();
    return new THREE.WireframeGeometry(geo);
  }, [geometry]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const time = Date.now() * 0.001;
    const orbitTime = time * config.orbitSpeed + initialAngle;

    // Orbital motion
    if (config.orbitRadius > 0) {
      meshRef.current.position.x = Math.cos(orbitTime) * config.orbitRadius;
      meshRef.current.position.z = Math.sin(orbitTime) * config.orbitRadius;
    } else {
      meshRef.current.position.x = 0;
      meshRef.current.position.z = 0;
    }

    // Vertical bobbing
    meshRef.current.position.y = Math.sin(time * config.bobSpeed) * config.bobAmplitude;

    // Rotation
    const speedMultiplier = isCoding && config.id === 'coding' ? 5 : 1;
    meshRef.current.rotation.x += delta * 0.5 * speedMultiplier;
    meshRef.current.rotation.y += delta * 0.3 * speedMultiplier;

    // Scale based on activity (0.5 to 2.0)
    const targetScale = 0.5 + (activityLevel / 100) * 1.5;
    const currentScale = meshRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    meshRef.current.scale.setScalar(newScale);

    // Update wireframe
    if (wireframeRef.current) {
      wireframeRef.current.position.copy(meshRef.current.position);
      wireframeRef.current.rotation.copy(meshRef.current.rotation);
      wireframeRef.current.scale.copy(meshRef.current.scale);
    }

    // Update glow
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      const glowScale = newScale * 1.5 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group>
      {/* Main mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments ref={wireframeRef} geometry={wireframeGeometry}>
        <lineBasicMaterial color={config.color} transparent opacity={0.5} />
      </lineSegments>

      {/* Glow effect */}
      <mesh ref={glowRef} geometry={geometry}>
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
