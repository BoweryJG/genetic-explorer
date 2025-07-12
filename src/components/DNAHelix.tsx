import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Types for ancestry segments
interface AncestrySegment {
  id: string;
  start: number;
  end: number;
  ancestry: string;
  color: string;
}

interface DNAHelixProps {
  ancestrySegments?: AncestrySegment[];
  autoRotate?: boolean;
  interactive?: boolean;
}

// Base pair colors
const BASE_PAIR_COLORS = {
  AT: { A: '#4A90E2', T: '#F5A623' }, // Blue/Orange
  GC: { G: '#7ED321', C: '#D0021B' }  // Green/Red
};

// Custom shader for glowing effect
const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float strength = pow(0.8 - abs(dot(vNormal, vPositionNormal)), 2.0);
    gl_FragColor = vec4(glowColor, strength * intensity);
  }
`;

// DNA Strand Component
const DNAStrand: React.FC<{
  radius: number;
  height: number;
  isLeft: boolean;
  ancestrySegments?: AncestrySegment[];
}> = ({ radius, height, isLeft, ancestrySegments = [] }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  const sphereCount = 50;
  const positions = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < sphereCount; i++) {
      const t = i / (sphereCount - 1);
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 4 + (isLeft ? 0 : Math.PI);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, [radius, height, isLeft, sphereCount]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    positions.forEach((pos, i) => {
      tempObject.position.copy(pos);
      tempObject.scale.setScalar(0.15);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      // Color based on ancestry segments
      const normalizedPosition = i / sphereCount;
      let color = new THREE.Color('#ffffff');
      
      for (const segment of ancestrySegments) {
        if (normalizedPosition >= segment.start && normalizedPosition <= segment.end) {
          color = new THREE.Color(segment.color);
          break;
        }
      }
      
      meshRef.current!.setColorAt(i, color);
    });
    
    meshRef.current.instanceColor!.needsUpdate = true;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, sphereCount]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhongMaterial emissive="#ffffff" emissiveIntensity={0.5} />
    </instancedMesh>
  );
};

// Base Pair Component
const BasePairs: React.FC<{
  radius: number;
  height: number;
  highlightSegment?: { start: number; end: number };
}> = ({ radius, height, highlightSegment }) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const basePairCount = 25;
  const basePairs = useMemo(() => {
    const pairs: Array<{ position: THREE.Vector3; type: 'AT' | 'GC' }> = [];
    
    for (let i = 0; i < basePairCount; i++) {
      const t = i / (basePairCount - 1);
      const y = (t - 0.5) * height;
      const type = Math.random() > 0.5 ? 'AT' : 'GC';
      pairs.push({ position: new THREE.Vector3(0, y, 0), type });
    }
    
    return pairs;
  }, [height, basePairCount]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.intensity.value = 
        0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {basePairs.map((pair, i) => {
        const t = i / (basePairCount - 1);
        const angle1 = t * Math.PI * 4;
        const angle2 = angle1 + Math.PI;
        
        const isHighlighted = highlightSegment && 
          t >= highlightSegment.start && 
          t <= highlightSegment.end;
        
        return (
          <group key={i} position={pair.position}>
            {/* Left base */}
            <mesh position={[Math.cos(angle1) * radius, 0, Math.sin(angle1) * radius]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial 
                color={pair.type === 'AT' ? BASE_PAIR_COLORS.AT.A : BASE_PAIR_COLORS.GC.G}
                emissive={pair.type === 'AT' ? BASE_PAIR_COLORS.AT.A : BASE_PAIR_COLORS.GC.G}
                emissiveIntensity={isHighlighted ? 1 : 0.3}
              />
            </mesh>
            
            {/* Right base */}
            <mesh position={[Math.cos(angle2) * radius, 0, Math.sin(angle2) * radius]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial 
                color={pair.type === 'AT' ? BASE_PAIR_COLORS.AT.T : BASE_PAIR_COLORS.GC.C}
                emissive={pair.type === 'AT' ? BASE_PAIR_COLORS.AT.T : BASE_PAIR_COLORS.GC.C}
                emissiveIntensity={isHighlighted ? 1 : 0.3}
              />
            </mesh>
            
            {/* Connection */}
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, radius * 2, 8]} />
              <shaderMaterial
                ref={materialRef}
                vertexShader={glowVertexShader}
                fragmentShader={glowFragmentShader}
                uniforms={{
                  glowColor: { value: new THREE.Color(isHighlighted ? '#ffffff' : '#88ccff') },
                  intensity: { value: 0.5 }
                }}
                transparent
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Particle System for added visual effect
const ParticleSystem: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.5);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return [pos, col];
  }, [particleCount]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + i) * 0.001;
      
      if (positions[i3 + 1] > 5) positions[i3 + 1] = -5;
      if (positions[i3 + 1] < -5) positions[i3 + 1] = 5;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.6} />
    </points>
  );
};

// Main DNA Helix Component
const DNAHelixVisualization: React.FC<{
  ancestrySegments?: AncestrySegment[];
  highlightSegment?: { start: number; end: number };
}> = ({ ancestrySegments = [], highlightSegment }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Auto rotation
    groupRef.current.rotation.y += 0.003;
    
    // Mouse interaction
    groupRef.current.rotation.x = mouse.y * 0.2;
    groupRef.current.position.x = mouse.x * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef}>
        {/* DNA Strands */}
        <DNAStrand 
          radius={1.5} 
          height={6} 
          isLeft={true} 
          ancestrySegments={ancestrySegments}
        />
        <DNAStrand 
          radius={1.5} 
          height={6} 
          isLeft={false} 
          ancestrySegments={ancestrySegments}
        />
        
        {/* Base Pairs */}
        <BasePairs 
          radius={1.5} 
          height={6} 
          highlightSegment={highlightSegment}
        />
        
        {/* Glow effect */}
        <mesh>
          <cylinderGeometry args={[2, 2, 6.5, 32, 1, true]} />
          <shaderMaterial
            vertexShader={glowVertexShader}
            fragmentShader={glowFragmentShader}
            uniforms={{
              glowColor: { value: new THREE.Color('#4488ff') },
              intensity: { value: 0.3 }
            }}
            transparent
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Main Component
const DNAHelix: React.FC<DNAHelixProps> = ({ 
  ancestrySegments = [], 
  interactive = true 
}) => {
  const [highlightedSegment, setHighlightedSegment] = useState<{ start: number; end: number } | undefined>();

  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* DNA Helix */}
        <DNAHelixVisualization 
          ancestrySegments={ancestrySegments}
          highlightSegment={highlightedSegment}
        />
        
        {/* Particle System */}
        <ParticleSystem />
        
        {/* Controls */}
        {interactive && <OrbitControls enablePan={false} enableZoom={true} />}
      </Canvas>
      
      {/* Ancestry Legend */}
      {ancestrySegments.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Ancestry Segments</h3>
          {ancestrySegments.map(segment => (
            <div 
              key={segment.id}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '5px',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHighlightedSegment({ start: segment.start, end: segment.end })}
              onMouseLeave={() => setHighlightedSegment(undefined)}
            >
              <div style={{
                width: 15,
                height: 15,
                backgroundColor: segment.color,
                marginRight: 8,
                borderRadius: '3px'
              }} />
              <span style={{ fontSize: '12px' }}>{segment.ancestry}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DNAHelix;