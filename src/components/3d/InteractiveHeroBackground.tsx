'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouseWorld;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Base organic wave calculation
    float elevation = sin(modelPosition.x * 1.5 + uTime * 0.4) * 0.15
                    + sin(modelPosition.z * 1.5 + uTime * 0.2) * 0.15;
                    
    // Calculate distance to mouse for the magnetic pull effect
    float distanceToMouse = distance(vec2(modelPosition.x, modelPosition.z), uMouseWorld);
    
    // Smooth magnetic distortion peaking near the cursor
    float mouseEffect = smoothstep(2.5, 0.0, distanceToMouse) * 0.8;
    
    elevation += mouseEffect;
    vElevation = elevation; // Pass to fragment shader for color mixing
    
    modelPosition.y += elevation;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColorBase;
  uniform vec3 uColorGlow;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Generate a responsive wireframe grid pattern mathematically (no textures)
    vec2 grid = fract(vUv * 40.0);
    float lineThickness = 0.05;
    float isLine = step(grid.x, lineThickness) + step(grid.y, lineThickness);
    isLine = clamp(isLine, 0.0, 1.0);

    // Discard empty spaces entirely to save render performance
    if (isLine < 0.5) discard;

    // Mix Base color (Gold) with Glow color (Royal Blue) based on vertex elevation
    float glowIntensity = smoothstep(0.1, 0.8, vElevation);
    vec3 color = mix(uColorBase, uColorGlow, glowIntensity);

    // Dynamic alpha fading
    float alpha = 0.4 + glowIntensity * 0.6;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

function Terrain() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  
  // Ref for mouse positions to avoid React state triggers on every frame
  const mouse = useRef(new THREE.Vector2(-100, -100));
  const targetMouse = useRef(new THREE.Vector2(-100, -100));
  
  // Reusable objects for raycasting
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates for Three.js (-1 to +1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        targetMouse.current.set(intersection.x, intersection.z);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, raycaster, plane]);

  useFrame((state) => {
    if (materialRef.current) {
      // Update time for the wave animation
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smoothly interpolate the mouse position for fluid, natural interaction
      mouse.current.lerp(targetMouse.current, 0.1);
      materialRef.current.uniforms.uMouseWorld.value.copy(mouse.current);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      {/* 64x64 segments is highly optimized while providing enough vertex density for smooth waves */}
      <planeGeometry args={[30, 30, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={useMemo(() => ({
          uTime: { value: 0 },
          uMouseWorld: { value: new THREE.Vector2(-100, -100) },
          uColorBase: { value: new THREE.Color('#FFD700') }, // MAAC Gold
          uColorGlow: { value: new THREE.Color('#2D5BFF') }, // Royal Blue
        }), [])}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function InteractiveHeroBackground() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance Strategy: Pause rendering completely when not in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full bg-obsidian-black">
      {isVisible && (
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }} dpr={[1, 1.5]}>
          <fog attach="fog" args={['#0B0B0C', 5, 15]} />
          <Terrain />
        </Canvas>
      )}
    </div>
  );
}
