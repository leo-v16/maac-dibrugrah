'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Text3D, 
  Center, 
  Environment, 
  MeshTransmissionMaterial, 
  Float,
  PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';

// Default heavy font URL for immediate results
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

function KineticLetter({ char, position }: { char: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();
  
  // Base states for spring-back effect
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const targetPosition = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    if (!meshRef.current) return;

    // Convert mouse normalized coordinates to world coordinates roughly
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;

    const mousePoint = new THREE.Vector3(x, y, 0);
    const letterPoint = new THREE.Vector3(
      meshRef.current.position.x,
      meshRef.current.position.y,
      0
    );

    const dist = mousePoint.distanceTo(letterPoint);
    const radius = 2.5; // Influence radius

    if (dist < radius) {
      // Repulsion logic
      const power = (1 - dist / radius) * 2;
      
      // Tilt away from mouse
      targetRotation.current.x = (y - meshRef.current.position.y) * -0.5 * power;
      targetRotation.current.y = (x - meshRef.current.position.x) * 0.5 * power;
      
      // Push back on Z
      targetPosition.current.z = -1 * power;
    } else {
      // Return to origin
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
      targetPosition.current.z = 0;
    }

    // Smooth "Spring" Interpolation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation.current.y, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetPosition.current.z, 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Center position={position}>
        <Text3D
          ref={meshRef}
          font={FONT_URL}
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {char}
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.2}
            roughness={0}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.04}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.1}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
            color="#FFB703" // MAAC Gold Tint
          />
        </Text3D>
      </Center>
    </Float>
  );
}

export default function WelcomeGlassText() {
  const letters = useMemo(() => "WELCOME".split(""), []);
  const spacing = 0.9;

  return (
    <div className="w-full h-[400px] md:h-[600px] bg-transparent relative overflow-visible">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <Environment preset="city" />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#FFB703" />
        <spotLight position={[0, -10, 0]} intensity={0.5} color="#2D5BFF" />

        <group position={[-(letters.length * spacing) / 2 + 0.4, 0, 0]}>
          {letters.map((char, i) => (
            <KineticLetter 
              key={i} 
              char={char} 
              position={[i * spacing, 0, 0]} 
            />
          ))}
        </group>
      </Canvas>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-10 w-full text-center pointer-events-none">
        <span className="text-white/20 text-[10px] font-heading uppercase tracking-[0.4em] animate-pulse">
          Move cursor to perturb the glass
        </span>
      </div>
    </div>
  );
}
