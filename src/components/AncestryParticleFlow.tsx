import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Effects } from '@react-three/drei';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Custom shader material for particles with glow effect
const ParticleShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.5, 0.5, 0.5),
    opacity: 1.0,
    size: 1.0,
    glowIntensity: 1.0,
  },
  // Vertex shader
  `
    uniform float time;
    uniform float size;
    
    attribute vec3 targetPosition;
    attribute float startTime;
    attribute float speed;
    attribute vec3 ancestryColor;
    attribute float generation;
    
    varying vec3 vColor;
    varying float vOpacity;
    varying float vDistance;
    
    void main() {
      vColor = ancestryColor;
      
      // Calculate progress based on time and start time
      float progress = clamp((time - startTime) * speed, 0.0, 1.0);
      
      // Smooth easing function
      float eased = progress * progress * (3.0 - 2.0 * progress);
      
      // Interpolate position with curved path
      vec3 currentPos = position;
      vec3 target = targetPosition;
      
      // Add some curve to the path
      float midHeight = 2.0 + generation * 0.5;
      vec3 midPoint = (currentPos + target) * 0.5;
      midPoint.y += midHeight;
      
      vec3 finalPos;
      if (eased < 0.5) {
        finalPos = mix(currentPos, midPoint, eased * 2.0);
      } else {
        finalPos = mix(midPoint, target, (eased - 0.5) * 2.0);
      }
      
      // Add some turbulence
      finalPos.x += sin(time * 0.5 + startTime * 10.0) * 0.1;
      finalPos.z += cos(time * 0.5 + startTime * 10.0) * 0.1;
      
      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size based on distance and generation
      float distanceSize = size * (300.0 / length(mvPosition.xyz));
      gl_PointSize = distanceSize * (1.0 + generation * 0.2);
      
      // Fade particles as they reach target
      vOpacity = 1.0 - progress * 0.3;
      vDistance = length(mvPosition.xyz);
    }
  `,
  // Fragment shader
  `
    uniform float glowIntensity;
    
    varying vec3 vColor;
    varying float vOpacity;
    varying float vDistance;
    
    void main() {
      // Create circular particle with glow
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) discard;
      
      // Soft edge with glow
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha *= vOpacity;
      
      // Add glow effect
      vec3 glow = vColor * glowIntensity * (1.0 - dist) * 2.0;
      vec3 finalColor = vColor + glow;
      
      // Distance fog
      float fog = 1.0 - smoothstep(10.0, 50.0, vDistance);
      
      gl_FragColor = vec4(finalColor, alpha * fog);
    }
  `
);

extend({ ParticleShaderMaterial });

// Ancestry data structure
interface AncestryData {
  id: string;
  name: string;
  color: string;
  percentage: number;
  generation: number;
}

interface ParticleSystemProps {
  ancestries: AncestryData[];
  timelinePosition: number;
  viewMode: 'flow' | 'cluster' | 'spiral';
  particleCount: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  ancestries,
  timelinePosition,
  viewMode,
  particleCount,
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<any>(null);
  const { camera } = useThree();

  // Generate particle attributes
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const startTimes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const generations = new Float32Array(particleCount);

    let particleIndex = 0;

    ancestries.forEach((ancestry) => {
      const ancestryParticles = Math.floor(particleCount * (ancestry.percentage / 100));
      const color = new THREE.Color(ancestry.color);

      for (let i = 0; i < ancestryParticles && particleIndex < particleCount; i++) {
        const idx = particleIndex * 3;

        // Starting positions (ancestors) - spread in space based on generation
        const angle = (Math.random() * Math.PI * 2);
        const radius = 10 + ancestry.generation * 5;
        const height = ancestry.generation * 3;

        positions[idx] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
        positions[idx + 1] = height + (Math.random() - 0.5) * 2;
        positions[idx + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;

        // Target positions based on view mode
        if (viewMode === 'flow') {
          // Flow to center (user)
          targetPositions[idx] = (Math.random() - 0.5) * 2;
          targetPositions[idx + 1] = 0;
          targetPositions[idx + 2] = (Math.random() - 0.5) * 2;
        } else if (viewMode === 'cluster') {
          // Cluster by ancestry
          const clusterAngle = (ancestries.indexOf(ancestry) / ancestries.length) * Math.PI * 2;
          const clusterRadius = 5;
          targetPositions[idx] = Math.cos(clusterAngle) * clusterRadius + (Math.random() - 0.5);
          targetPositions[idx + 1] = (Math.random() - 0.5) * 2;
          targetPositions[idx + 2] = Math.sin(clusterAngle) * clusterRadius + (Math.random() - 0.5);
        } else {
          // Spiral pattern
          const spiralProgress = i / ancestryParticles;
          const spiralAngle = spiralProgress * Math.PI * 4;
          const spiralRadius = spiralProgress * 8;
          targetPositions[idx] = Math.cos(spiralAngle) * spiralRadius;
          targetPositions[idx + 1] = spiralProgress * 5 - 2.5;
          targetPositions[idx + 2] = Math.sin(spiralAngle) * spiralRadius;
        }

        // Colors
        colors[idx] = color.r;
        colors[idx + 1] = color.g;
        colors[idx + 2] = color.b;

        // Timing
        startTimes[particleIndex] = Math.random() * 2;
        speeds[particleIndex] = 0.3 + Math.random() * 0.4;
        generations[particleIndex] = ancestry.generation;

        particleIndex++;
      }
    });

    return {
      positions,
      targetPositions,
      colors,
      startTimes,
      speeds,
      generations,
    };
  }, [ancestries, particleCount, viewMode]);

  // Update geometry attributes
  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
      geometry.setAttribute('targetPosition', new THREE.BufferAttribute(particles.targetPositions, 3));
      geometry.setAttribute('ancestryColor', new THREE.BufferAttribute(particles.colors, 3));
      geometry.setAttribute('startTime', new THREE.BufferAttribute(particles.startTimes, 1));
      geometry.setAttribute('speed', new THREE.BufferAttribute(particles.speeds, 1));
      geometry.setAttribute('generation', new THREE.BufferAttribute(particles.generations, 1));
    }
  }, [particles]);

  // Animation loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime * timelinePosition;
      materialRef.current.glowIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry />
      <particleShaderMaterial
        ref={materialRef}
        size={50}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Trail effect for particles
const ParticleTrails: React.FC<{ color: string }> = ({ color }) => {
  const trailRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (trailRef.current) {
      trailRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={trailRef}>
      <torusGeometry args={[5, 0.1, 8, 50]} />
      <meshBasicMaterial color={color} opacity={0.2} transparent />
    </mesh>
  );
};

// Main component
export interface AncestryParticleFlowProps {
  ancestries?: AncestryData[];
  particleCount?: number;
  className?: string;
}

const AncestryParticleFlow: React.FC<AncestryParticleFlowProps> = ({
  ancestries = [
    { id: '1', name: 'European', color: '#4472C4', percentage: 45, generation: 3 },
    { id: '2', name: 'African', color: '#ED7D31', percentage: 25, generation: 4 },
    { id: '3', name: 'Asian', color: '#A5A5A5', percentage: 20, generation: 2 },
    { id: '4', name: 'Native American', color: '#FFC000', percentage: 10, generation: 5 },
  ],
  particleCount = 5000,
  className = '',
}) => {
  const [timelinePosition, setTimelinePosition] = useState(1);
  const [viewMode, setViewMode] = useState<'flow' | 'cluster' | 'spiral'>('flow');

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 10, 30], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#000011']} />
        <fog attach="fog" color="#000011" near={10} far={100} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <ParticleSystem
          ancestries={ancestries}
          timelinePosition={timelinePosition}
          viewMode={viewMode}
          particleCount={particleCount}
        />
        
        {/* Add trail effects for each ancestry */}
        {ancestries.map((ancestry) => (
          <ParticleTrails key={ancestry.id} color={ancestry.color} />
        ))}
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
        />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4">
        <div className="mb-4">
          <label className="text-white text-sm mb-2 block">Timeline Position</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={timelinePosition}
            onChange={(e) => setTimelinePosition(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('flow')}
            className={`px-4 py-2 rounded ${
              viewMode === 'flow' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Flow View
          </button>
          <button
            onClick={() => setViewMode('cluster')}
            className={`px-4 py-2 rounded ${
              viewMode === 'cluster' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Cluster View
          </button>
          <button
            onClick={() => setViewMode('spiral')}
            className={`px-4 py-2 rounded ${
              viewMode === 'spiral' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Spiral View
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Ancestries</h3>
        {ancestries.map((ancestry) => (
          <div key={ancestry.id} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ancestry.color }}
            />
            <span className="text-white text-sm">
              {ancestry.name} - {ancestry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AncestryParticleFlow;