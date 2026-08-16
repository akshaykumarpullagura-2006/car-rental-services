'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { VehicleCategory, VEHICLES } from '@/hooks/useVehicle';
import { motion, AnimatePresence } from 'framer-motion';
import { removeBackgroundFromImage } from '@/lib/imageUtils';

interface VehicleViewerProps {
  category: VehicleCategory;
  isTransitioning?: boolean;
}

// Seamless 3D Car Model with dynamic background removal for 100% transparency
function ImageCarModel({
  imagePath,
  mousePos,
  scale = [4.5, 3.2],
  yOffset = 0.1,
}: {
  imagePath: string;
  mousePos: { x: number; y: number };
  scale?: [number, number];
  yOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imagePath;
    img.onload = () => {
      if (!isMounted) return;
      // Convert white/studio background pixels to transparent alpha=0
      const transparentSrc = removeBackgroundFromImage(img);
      const loader = new THREE.TextureLoader();
      loader.load(transparentSrc, (loaded) => {
        if (!isMounted) return;
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.needsUpdate = true;
        setTexture(loaded);
      });
    };
    return () => {
      isMounted = false;
    };
  }, [imagePath]);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth 3D mouse tracking tilt & rotational float
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.45 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mousePos.y * 0.22,
        0.06
      );
    }
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Front Face Transparent Car Mesh */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[scale[0], scale[1]]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          alphaTest={0.01}
        />
      </mesh>
      {/* Back Face Transparent Car Mesh (Mirrored for 360 Rotation) */}
      <mesh position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[scale[0], scale[1]]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          alphaTest={0.01}
        />
      </mesh>
      {/* 3D Showcase Gold Stage Base Ring */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.2, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.2}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

// 1. Suzuki Swift Model (White Hatchback with Transparent Background)
function SwiftModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  return <ImageCarModel imagePath="/images/swift-3d.png" mousePos={mousePos} scale={[4.4, 3.4]} yOffset={0.15} />;
}

// 2. Mahindra Thar Model (Red 4x4 Off-Road SUV with Transparent Background)
function TharModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  return <ImageCarModel imagePath="/images/thar-3d.jpg" mousePos={mousePos} scale={[4.6, 3.5]} yOffset={0.1} />;
}

// 3. Toyota Fortuner Model (White Executive SUV with Transparent Background)
function FortunerModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  return <ImageCarModel imagePath="/images/fortuner-3d.png" mousePos={mousePos} scale={[4.8, 3.3]} yOffset={0.1} />;
}

// 4. Lamborghini Aventador 3D Model (Yellow Exotic Supercar)
function LamborghiniModel({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const headLightL = useRef<THREE.PointLight>(null);
  const headLightR = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mousePos.y * 0.1, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mousePos.x * 0.08, 0.05);
    }
    const pulse = 1.8 + Math.sin(state.clock.getElapsedTime() * 5) * 0.4;
    if (headLightL.current) headLightL.current.intensity = pulse;
    if (headLightR.current) headLightR.current.intensity = pulse;
  });

  const yellowPaint = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFD700'),
    metalness: 0.92,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });

  const carbonFiber = new THREE.MeshStandardMaterial({ color: '#0F1015', roughness: 0.5, metalness: 0.8 });
  const goldAccent = new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.95, roughness: 0.1 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#0B0C10', roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.8 });

  return (
    <group ref={groupRef} position={[0, -0.28, 0]} scale={[1.15, 1.15, 1.15]}>
      {/* Low-Slung Wedge Chassis */}
      <mesh material={yellowPaint} position={[0, 0.35, 0]}>
        <boxGeometry args={[2.25, 0.42, 4.6]} />
      </mesh>
      {/* Aggressive Cockpit Cabin */}
      <mesh material={glass} position={[0, 0.65, -0.2]}>
        <boxGeometry args={[1.7, 0.35, 2.2]} />
      </mesh>
      {/* Side Air Scoop Intakes */}
      <mesh material={carbonFiber} position={[1.12, 0.35, -0.6]}>
        <boxGeometry args={[0.08, 0.25, 1.2]} />
      </mesh>
      <mesh material={carbonFiber} position={[-1.12, 0.35, -0.6]}>
        <boxGeometry args={[0.08, 0.25, 1.2]} />
      </mesh>

      {/* Prominent Rear Wing Spoiler */}
      <group position={[0, 0.72, -2.1]}>
        <mesh material={carbonFiber}>
          <boxGeometry args={[2.1, 0.04, 0.35]} />
        </mesh>
        <mesh material={carbonFiber} position={[0.7, -0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.2]} />
        </mesh>
        <mesh material={carbonFiber} position={[-0.7, -0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.2]} />
        </mesh>
      </group>

      {/* Y-Shaped LED Headlights */}
      <group position={[0.7, 0.38, 2.28]}>
        <mesh>
          <boxGeometry args={[0.45, 0.08, 0.06]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <pointLight ref={headLightL} color="#FFFFFF" intensity={2.5} distance={6} />
      </group>
      <group position={[-0.7, 0.38, 2.28]}>
        <mesh>
          <boxGeometry args={[0.45, 0.08, 0.06]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <pointLight ref={headLightR} color="#FFFFFF" intensity={2.5} distance={6} />
      </group>

      {/* Wide Low-Profile Wheels */}
      {[
        [0.98, 0.24, 1.45],
        [-0.98, 0.24, 1.45],
        [1.02, 0.26, -1.45],
        [-1.02, 0.26, -1.45],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh material={carbonFiber} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.32, 32]} />
          </mesh>
          <mesh material={goldAccent} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.34, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const VehicleViewer: React.FC<VehicleViewerProps> = ({ category, isTransitioning = false }) => {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const vehicleInfo = VEHICLES[category] || VEHICLES.basic;

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
      <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center bg-dark-500/40 rounded-3xl border border-gold-400/20 space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
        <div className="text-gold-400 font-semibold text-xs tracking-widest uppercase">
          Initializing Luxury 3D Showroom...
        </div>
      </div>
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="w-full h-full min-h-[350px] lg:min-h-[440px] relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* Gold Skeleton Loading Overlay during 700ms Vehicle Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-10 h-10 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
            <div className="text-gold-300 font-extrabold text-xs tracking-wider uppercase font-mono animate-pulse">
              Loading {vehicleInfo.name} 3D Model...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Viewer Container */}
      {category === 'basic' ? (
        <div className="w-full h-full min-h-[350px] lg:min-h-[440px] relative rounded-3xl overflow-hidden bg-transparent">
          <iframe
            title="Suzuki Swift 2021 3D Interactive Model"
            src="https://sketchfab.com/models/beb15f9a28174dd79d0cab0c87fd0488/embed?autostart=1&transparent=1&ui_theme=dark&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_share=0&ui_download=0&ui_hint=0"
            className="w-full absolute -top-24 -bottom-24 left-0 right-0 h-[calc(100%+192px)] border-0 rounded-3xl pointer-events-auto scale-110 sm:scale-105 transform transition-transform"
            style={{ background: 'transparent' }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      ) : category === 'medium' ? (
        <div className="w-full h-full min-h-[350px] lg:min-h-[440px] relative rounded-3xl overflow-hidden bg-transparent">
          <iframe
            title="Mahindra Thar 4x4 3D Interactive Model"
            src="https://sketchfab.com/models/f045413d71d743c58682881cb7421d64/embed?autostart=1&transparent=1&ui_theme=dark&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_share=0&ui_download=0&ui_hint=0"
            className="w-full absolute -top-24 -bottom-24 left-0 right-0 h-[calc(100%+192px)] border-0 rounded-3xl pointer-events-auto scale-110 sm:scale-105 transform transition-transform"
            style={{ background: 'transparent' }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      ) : category === 'luxury' ? (
        <div className="w-full h-full min-h-[350px] lg:min-h-[440px] relative rounded-3xl overflow-hidden bg-transparent">
          <iframe
            title="Toyota Fortuner 2021 3D Interactive Model"
            src="https://sketchfab.com/models/a70b997f11b7482e9affbf318a508f85/embed?autostart=1&transparent=1&ui_theme=dark&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_share=0&ui_download=0&ui_hint=0"
            className="w-full absolute -top-24 -bottom-24 left-0 right-0 h-[calc(100%+192px)] border-0 rounded-3xl pointer-events-auto scale-110 sm:scale-105 transform transition-transform"
            style={{ background: 'transparent' }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full h-full min-h-[350px] lg:min-h-[440px] relative rounded-3xl overflow-hidden bg-transparent">
          <iframe
            title="Lamborghini Aventador 3D Interactive Model"
            src="https://sketchfab.com/models/bf2f4e712d9c4734a7ce45dbd9aec862/embed?autostart=1&transparent=1&ui_theme=dark&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_share=0&ui_download=0&ui_hint=0"
            className="w-full absolute -top-24 -bottom-24 left-0 right-0 h-[calc(100%+192px)] border-0 rounded-3xl pointer-events-auto scale-110 sm:scale-105 transform transition-transform"
            style={{ background: 'transparent' }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      )}

      {/* Dynamic Bottom Label Badge */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-gold-400/30 text-xs text-gray-200 pointer-events-none flex items-center gap-2 shadow-2xl">
        <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping shrink-0" />
        <span className="font-semibold text-[11px] sm:text-xs truncate">{vehicleInfo.badgeLabel}</span>
      </div>
    </div>
  );
};
