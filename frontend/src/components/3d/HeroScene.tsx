'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function FloatingShape({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial
          color="#8B5CF6"
          attach="material"
          distort={0.5}
          speed={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}

export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
      
      <FloatingShape position={[0, 0, 0]} />
      <FloatingShape position={[4, 2, -2]} />
      <FloatingShape position={[-4, -2, -2]} />
      
      {/* Particles */}
      <Points />
    </>
  )
}

function Points() {
  const ref = useRef<THREE.Points>(null)
  const particlesRef = useRef<Float32Array | null>(null)
  
  if (!particlesRef.current) {
    const particles = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3
      particles[i3] = (Math.random() - 0.5) * 20
      particles[i3 + 1] = (Math.random() - 0.5) * 20
      particles[i3 + 2] = (Math.random() - 0.5) * 20
    }
    particlesRef.current = particles
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8B5CF6" transparent opacity={0.6} />
    </points>
  )
}
