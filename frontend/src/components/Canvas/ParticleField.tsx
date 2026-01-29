import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 50;

export function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const positions: Float32Array = new Float32Array(PARTICLE_COUNT * 3);
    const speeds: Float32Array = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;
      speeds[i] = Math.random() * 0.02 + 0.005;
    }

    return { positions, speeds };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Throttle updates for better performance
    if (state.clock.elapsedTime % 0.1 < 0.016) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        dummy.position.set(
          particles.positions[i3],
          particles.positions[i3 + 1] + Math.sin(Date.now() * 0.0005 + i) * 0.05,
          particles.positions[i3 + 2]
        );
        dummy.scale.setScalar(0.03 + Math.sin(Date.now() * 0.001 + i) * 0.01);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
