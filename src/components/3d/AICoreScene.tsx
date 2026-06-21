"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

function CoreOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#7c3aed"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
          wireframe={true}
        />
      </Sphere>
      {/* Inner glowing core */}
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color="#c2c1ff"
          emissive="#8b5cf6"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={pointsRef}>
      <Stars radius={5} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export default function AICoreScene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#c2c1ff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#7c3aed" />
        <CoreOrb />
        <Particles />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
