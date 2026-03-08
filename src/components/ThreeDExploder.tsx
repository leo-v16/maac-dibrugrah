'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function createTextParticles() {
  if (typeof window === 'undefined') return { positions: new Float32Array(0), colors: new Float32Array(0) };
  
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { positions: new Float32Array(0), colors: new Float32Array(0) };

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = '900 140px sans-serif'; // Using standard sans-serif for max compatibility
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText("WELCOME TO", canvas.width / 2, canvas.height / 2 - 80);
  ctx.fillText("MAAC DIBRUGARH", canvas.width / 2, canvas.height / 2 + 80);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const positions = [];
  const colors = [];
  
  // Step controls particle density. Lower step = more particles (heavier performance)
  const step = 4; 
  
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const idx = (y * canvas.width + x) * 4;
      if (imgData[idx] > 128) { // If pixel is white enough
        // Map 2D pixel coordinates to 3D space
        const posX = (x - canvas.width / 2) * 0.025;
        const posY = -(y - canvas.height / 2) * 0.025;
        const posZ = (Math.random() - 0.5) * 0.8;
        
        positions.push(posX, posY, posZ);
        
        // Dynamic Brand Colors
        const rand = Math.random();
        let color;
        if (rand > 0.4) {
          color = new THREE.Color('#FFB703'); // Gold
        } else if (rand > 0.1) {
          color = new THREE.Color('#ffffff'); // White
        } else {
          color = new THREE.Color('#2D5BFF'); // Electric Blue
        }
        colors.push(color.r, color.g, color.b);
      }
    }
  }

  return { 
    positions: new Float32Array(positions), 
    colors: new Float32Array(colors) 
  };
}

function ParticleText() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => createTextParticles(), []);
  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);
  
  const { mouse, viewport } = useThree();
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current || positions.length === 0) return;
    
    time.current += delta;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionsAttr.array as Float32Array;
    
    // Convert normalized mouse coordinates (-1 to +1) to world coordinates based on viewport
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    
    for (let i = 0; i < posArray.length; i += 3) {
      const origX = originalPositions[i];
      const origY = originalPositions[i + 1];
      const origZ = originalPositions[i + 2];
      
      const currX = posArray[i];
      const currY = posArray[i + 1];
      const currZ = posArray[i + 2];

      const dx = mouseX - currX;
      const dy = mouseY - currY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDistance = 4; // Forcefield radius
      
      if (dist < maxDistance) {
        // EXPLOSION / REPULSION FORCE
        const force = Math.pow((maxDistance - dist) / maxDistance, 3);
        const angle = Math.atan2(dy, dx);
        
        const targetX = currX - Math.cos(angle) * force * 3;
        const targetY = currY - Math.sin(angle) * force * 3;
        const targetZ = currZ + (Math.random() - 0.5) * force * 15; // Scatter heavily in Z-axis

        posArray[i] += (targetX - currX) * 0.15;
        posArray[i + 1] += (targetY - currY) * 0.15;
        posArray[i + 2] += (targetZ - currZ) * 0.15;
      } else {
        // MAGNETIZE BACK WITH JITTER
        const jitter = Math.sin(time.current * 15 + i) * 0.03;
        
        posArray[i] += (origX - currX) * 0.08 + (Math.random() - 0.5) * jitter;
        posArray[i + 1] += (origY - currY) * 0.08 + (Math.random() - 0.5) * jitter;
        posArray[i + 2] += (origZ - currZ) * 0.08 + (Math.random() - 0.5) * jitter;
      }
    }
    
    positionsAttr.needsUpdate = true;
  });

  if (positions.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        vertexColors 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ThreeDExploder() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-obsidian-black text-maac-gold font-heading uppercase tracking-[0.3em] animate-pulse">
        Initializing VFX Engine...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-obsidian-black overflow-hidden group cursor-crosshair">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-maac-gold/10 via-obsidian-black to-obsidian-black pointer-events-none" />
      
      <div className="absolute top-10 w-full text-center z-10 pointer-events-none">
        <span className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-1">
          <span className="text-white/40 text-[10px] font-heading uppercase tracking-[0.3em]">
            Move Your Mouse To Interact
          </span>
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, 16], fov: 45 }} dpr={[1, 2]}>
        <ParticleText />
      </Canvas>
    </div>
  );
}
