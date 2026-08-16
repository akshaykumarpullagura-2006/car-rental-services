'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { HERO_CAR_MODEL_PATH } from '@/lib/constants';

// Procedural 3D Luxury Supercar Model with Pulsing Headlights & Metallic Paint
function LuxuryCarModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  const carRef = useRef<THREE.Group>(null);
  const headLightLeftRef = useRef<THREE.PointLight>(null);
  const headLightRightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (carRef.current) {
      // Mouse Parallax Offset
      const targetRotX = mousePos.y * 0.12;
      const targetRotY = mousePos.x * 0.15;
      carRef.current.rotation.x = THREE.MathUtils.lerp(carRef.current.rotation.x, targetRotX, 0.05);
      carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, -targetRotY * 0.5, 0.05);
    }

    // Pulsing LED Headlight Intensity
    const pulse = 1.5 + Math.sin(state.clock.getElapsedTime() * 4) * 0.3;
    if (headLightLeftRef.current) headLightLeftRef.current.intensity = pulse;
    if (headLightRightRef.current) headLightRightRef.current.intensity = pulse;
  });

  // Metallic & Glass Materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0B0D14'),
    metalness: 0.95,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.95,
  });

  const goldAccentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D4AF37'),
    metalness: 0.9,
    roughness: 0.2,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1A1C24'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    thickness: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#111318'),
    roughness: 0.85,
  });

  return (
    <group ref={carRef} position={[0, -0.2, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Chassis Body */}
      <mesh material={bodyMaterial} position={[0, 0.45, 0]}>
        <boxGeometry args={[2.15, 0.55, 4.4]} />
      </mesh>

      {/* Aerodynamic Cabin Roof */}
      <mesh material={glassMaterial} position={[0, 0.85, -0.2]}>
        <boxGeometry args={[1.8, 0.45, 2.3]} />
      </mesh>

      {/* Gold Metallic Side Strip */}
      <mesh material={goldAccentMaterial} position={[1.08, 0.35, 0]}>
        <boxGeometry args={[0.04, 0.12, 3.8]} />
      </mesh>
      <mesh material={goldAccentMaterial} position={[-1.08, 0.35, 0]}>
        <boxGeometry args={[0.04, 0.12, 3.8]} />
      </mesh>

      {/* Front Gold Grille */}
      <mesh material={goldAccentMaterial} position={[0, 0.4, 2.21]}>
        <boxGeometry args={[1.4, 0.25, 0.04]} />
      </mesh>

      {/* Glowing LED Headlights */}
      <group position={[0.7, 0.5, 2.2]}>
        <mesh>
          <boxGeometry args={[0.4, 0.1, 0.05]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <pointLight ref={headLightLeftRef} color="#FFFFFF" intensity={2} distance={5} />
      </group>

      <group position={[-0.7, 0.5, 2.2]}>
        <mesh>
          <boxGeometry args={[0.4, 0.1, 0.05]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <pointLight ref={headLightRightRef} color="#FFFFFF" intensity={2} distance={5} />
      </group>

      {/* Tail Light Strip */}
      <mesh position={[0, 0.55, -2.21]}>
        <boxGeometry args={[1.9, 0.08, 0.05]} />
        <meshBasicMaterial color="#FF1A1A" />
      </mesh>

      {/* 4 Wheels */}
      {[
        [0.95, 0.3, 1.4],
        [-0.95, 0.3, 1.4],
        [0.95, 0.3, -1.4],
        [-0.95, 0.3, -1.4],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh material={rubberMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.3, 32]} />
          </mesh>
          <mesh material={goldAccentMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.32, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const HeroCarCanvas: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handlePointerDown = () => {
    setAutoRotate(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handlePointerUp = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 3000);
  };

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[420px] flex items-center justify-center bg-dark-500/40 rounded-3xl border border-gold-400/20">
        <div className="text-gold-400 font-semibold animate-pulse text-sm">
          Loading 3D Luxury Showroom...
        </div>
      </div>
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="w-full h-full min-h-[420px] lg:min-h-[550px] relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[3.8, 2.2, 5.2]} fov={45} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={2.0} color="#FFF8E7" castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.9} color="#D4AF37" />
        <pointLight position={[0, 6, 0]} intensity={1.5} color="#FFFFFF" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <LuxuryCarModel mousePos={mousePos} />
        </Float>

        <ContactShadows
          position={[0, -0.6, 0]}
          opacity={0.7}
          scale={10}
          blur={2}
          far={4}
          color="#000000"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-dark-500/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-400/30 text-[11px] text-gray-300 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
        <span>3D Interactive Vehicle Canvas • Drag to Rotate 360°</span>
      </div>
    </div>
  );
};
