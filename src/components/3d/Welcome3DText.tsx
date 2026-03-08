'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedText() {
  const textRef = useRef<any>(null);

  useFrame((state) => {
    if (textRef.current) {
      // Wild rotation and movement following mouse
      const time = state.clock.getElapsedTime();
      const x = (state.mouse.x * Math.PI) / 4;
      const y = (state.mouse.y * Math.PI) / 4;
      
      textRef.current.rotation.x = THREE.MathUtils.lerp(textRef.current.rotation.x, -y, 0.1);
      textRef.current.rotation.y = THREE.MathUtils.lerp(textRef.current.rotation.y, x, 0.1);
      
      // Subtle scale pulse
      const s = 1 + Math.sin(time * 2) * 0.05;
      textRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={2}>
      <Text
        ref={textRef}
        fontSize={0.8}
        maxWidth={20}
        font="/fonts/Montserrat-Bold.ttf" // Optional, will fallback if not found
        textAlign="left"
        anchorX="left"
        anchorY="middle"
      >
        MAAC DIBRUGARH
        <MeshDistortMaterial
          speed={3}
          distort={0.3}
          radius={1}
          color="#FFD700"
          metalness={0.8}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </Text>
    </Float>
  );
}

export default function Welcome3DText() {
  return (
    <div className="w-full h-full min-h-[100px] flex items-center">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#FFD700" />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#2D5BFF" />
          <AnimatedText />
        </Suspense>
      </Canvas>
    </div>
  );
}
