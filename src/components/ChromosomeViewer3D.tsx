import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Html, 
  Environment,
  Float,
  PerformanceMonitor
} from '@react-three/drei'
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  DepthOfField,
  Vignette
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { type AncestrySegment } from '../utils/csvParser'
import { motion } from 'framer-motion'
import { useControls } from 'leva'

interface ChromosomeViewer3DProps {
  segments: AncestrySegment[]
  selectedChromosome?: string | null
}

// Chromosome data with proper lengths and centromere positions
const CHROMOSOME_DATA = [
  { id: 'chr1', length: 249250621, centromere: 125000000, pair: 1 },
  { id: 'chr2', length: 242193529, centromere: 93300000, pair: 2 },
  { id: 'chr3', length: 198295559, centromere: 91000000, pair: 3 },
  { id: 'chr4', length: 190214555, centromere: 50400000, pair: 4 },
  { id: 'chr5', length: 181538259, centromere: 48400000, pair: 5 },
  { id: 'chr6', length: 170805979, centromere: 61000000, pair: 6 },
  { id: 'chr7', length: 159345973, centromere: 59900000, pair: 7 },
  { id: 'chr8', length: 145138636, centromere: 45600000, pair: 8 },
  { id: 'chr9', length: 138394717, centromere: 49000000, pair: 9 },
  { id: 'chr10', length: 133797422, centromere: 40200000, pair: 10 },
  { id: 'chr11', length: 135086622, centromere: 53700000, pair: 11 },
  { id: 'chr12', length: 133275309, centromere: 35800000, pair: 12 },
  { id: 'chr13', length: 114364328, centromere: 17900000, pair: 13 },
  { id: 'chr14', length: 107043718, centromere: 17600000, pair: 14 },
  { id: 'chr15', length: 101991189, centromere: 19000000, pair: 15 },
  { id: 'chr16', length: 90338345, centromere: 36600000, pair: 16 },
  { id: 'chr17', length: 83257441, centromere: 24000000, pair: 17 },
  { id: 'chr18', length: 80373285, centromere: 17200000, pair: 18 },
  { id: 'chr19', length: 58617616, centromere: 26500000, pair: 19 },
  { id: 'chr20', length: 64444167, centromere: 27500000, pair: 20 },
  { id: 'chr21', length: 46709983, centromere: 13200000, pair: 21 },
  { id: 'chr22', length: 50818468, centromere: 14700000, pair: 22 },
  { id: 'chrX', length: 156040895, centromere: 60600000, pair: 23 },
  { id: 'chrY', length: 57227415, centromere: 12500000, pair: 23 },
]

const ANCESTRY_COLORS: Record<string, string> = {
  'Ashkenazi Jewish': '#8B4513',
  'Italian': '#228B22',
  'Eastern European': '#4B0082',
  'French & German': '#FFD700',
  'Spanish & Portuguese': '#DC143C',
  'Greek & Balkan': '#00CED1',
  'Northwestern European': '#FF8C00',
  'Southern European': '#9370DB',
  'Broadly European': '#696969',
  'Broadly Northwestern European': '#FFA500',
  'Broadly Southern European': '#DA70D6',
  'European': '#708090',
  'North African': '#8FBC8F',
  'Western Asian & North African': '#BDB76B',
  'Unassigned': '#D3D3D3'
}


// Single chromosome component
function Chromosome({ 
  data, 
  position, 
  segments, 
  isSelected,
  onSelect,
  quality = 'high'
}: {
  data: typeof CHROMOSOME_DATA[0]
  position: [number, number, number]
  segments: AncestrySegment[]
  isSelected: boolean
  onSelect: () => void
  quality: 'low' | 'medium' | 'high'
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const maxLength = Math.max(...CHROMOSOME_DATA.map(c => c.length))
  const scale = 10 / maxLength
  const length = data.length * scale
  const centromerePos = (data.centromere / data.length) * length
  
  // Calculate segment density for heat map
  const segmentDensity = useMemo(() => {
    const density = new Array(20).fill(0)
    segments.forEach(segment => {
      const startBin = Math.floor((segment.startPoint / data.length) * 20)
      const endBin = Math.floor((segment.endPoint / data.length) * 20)
      for (let i = startBin; i <= endBin && i < 20; i++) {
        density[i]++
      }
    })
    return density
  }, [segments, data.length])

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y += 0.005
      }
      if (hovered) {
        meshRef.current.scale.setScalar(1.1)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const cylinderSegments = quality === 'high' ? 32 : quality === 'medium' ? 16 : 8

  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      floatingRange={[-0.1, 0.1]}
    >
      <group 
        ref={meshRef} 
        position={position}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main chromosome body - p arm */}
        <mesh position={[0, -centromerePos / 2, 0]}>
          <cylinderGeometry args={[0.15, 0.18, centromerePos, cylinderSegments]} />
          <meshPhysicalMaterial
            color={isSelected ? '#ff6b6b' : '#e0e0e0'}
            metalness={0.2}
            roughness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive={isSelected ? '#ff6b6b' : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>

        {/* Main chromosome body - q arm */}
        <mesh position={[0, (length - centromerePos) / 2, 0]}>
          <cylinderGeometry args={[0.18, 0.15, length - centromerePos, cylinderSegments]} />
          <meshPhysicalMaterial
            color={isSelected ? '#ff6b6b' : '#e0e0e0'}
            metalness={0.2}
            roughness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive={isSelected ? '#ff6b6b' : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>

        {/* Centromere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.12, cylinderSegments, cylinderSegments / 2]} />
          <meshPhysicalMaterial
            color="#666666"
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Ancestry segments with glow effect */}
        {segments.map((segment, idx) => {
          const segmentStart = (segment.startPoint / data.length) * length - length / 2
          const segmentEnd = (segment.endPoint / data.length) * length - length / 2
          const segmentLength = segmentEnd - segmentStart
          const segmentCenter = (segmentStart + segmentEnd) / 2
          
          return (
            <mesh key={idx} position={[0, segmentCenter, 0]}>
              <cylinderGeometry args={[0.2, 0.2, segmentLength, cylinderSegments]} />
              <meshPhysicalMaterial
                color={ANCESTRY_COLORS[segment.ancestry] || '#999999'}
                transparent
                opacity={0.7}
                emissive={ANCESTRY_COLORS[segment.ancestry] || '#999999'}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0}
              />
            </mesh>
          )
        })}

        {/* Heat map visualization */}
        {quality !== 'low' && segmentDensity.map((density, idx) => {
          const y = (idx / 20) * length - length / 2
          const intensity = density / Math.max(...segmentDensity)
          
          return intensity > 0 ? (
            <mesh key={`heat-${idx}`} position={[0.25, y, 0]}>
              <boxGeometry args={[0.05, length / 20, 0.05]} />
              <meshBasicMaterial
                color={new THREE.Color(intensity, 0, 1 - intensity)}
                transparent
                opacity={0.6}
              />
            </mesh>
          ) : null
        })}

        {/* Chromosome label */}
        {hovered && (
          <Html distanceFactor={10}>
            <div className="bg-black/80 px-3 py-2 rounded-lg text-white text-sm backdrop-blur-sm">
              <div className="font-bold">{data.id}</div>
              <div className="text-xs opacity-80">
                Length: {(data.length / 1000000).toFixed(1)} Mb
              </div>
              <div className="text-xs opacity-80">
                Segments: {segments.length}
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Main 3D scene component
function ChromosomeScene({ 
  segments, 
  selectedChromosome 
}: ChromosomeViewer3DProps) {
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high')
  const { camera } = useThree()
  
  // Group segments by chromosome
  const segmentsByChromosome = useMemo(() => {
    const grouped: Record<string, AncestrySegment[]> = {}
    segments.forEach(segment => {
      if (!grouped[segment.chromosome]) {
        grouped[segment.chromosome] = []
      }
      grouped[segment.chromosome].push(segment)
    })
    return grouped
  }, [segments])

  // Arrange chromosomes in a grid
  const chromosomePositions = useMemo(() => {
    const positions: Array<{ data: typeof CHROMOSOME_DATA[0]; position: [number, number, number] }> = []
    const cols = 6
    const spacing = 2.5
    
    CHROMOSOME_DATA.forEach((chr, idx) => {
      const row = Math.floor(idx / cols)
      const col = idx % cols
      positions.push({
        data: chr,
        position: [
          (col - cols / 2) * spacing,
          0,
          (row - 2) * spacing
        ]
      })
    })
    
    return positions
  }, [])

  // Camera animation for selected chromosome
  useEffect(() => {
    if (selectedChromosome && camera) {
      const selected = chromosomePositions.find(p => p.data.id === selectedChromosome)
      if (selected) {
        // Animate camera to focus on selected chromosome
        const targetPosition = new THREE.Vector3(
          selected.position[0],
          selected.position[1] + 2,
          selected.position[2] + 3
        )
        // Simple lerp animation (you could use gsap for smoother animation)
        const animateCamera = () => {
          camera.position.lerp(targetPosition, 0.1)
          camera.lookAt(new THREE.Vector3(...selected.position))
        }
        const interval = setInterval(animateCamera, 16)
        setTimeout(() => clearInterval(interval), 1000)
      }
    }
  }, [selectedChromosome, camera, chromosomePositions])

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setQuality('low')}
        onIncline={() => setQuality('high')}
        flipflops={3}
        onFallback={() => setQuality('medium')}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {chromosomePositions.map(({ data, position }) => (
        <Chromosome
          key={data.id}
          data={data}
          position={position}
          segments={segmentsByChromosome[data.id] || []}
          isSelected={selectedChromosome === data.id}
          onSelect={() => {}}
          quality={quality}
        />
      ))}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate={!selectedChromosome}
        autoRotateSpeed={0.5}
      />
      
      <Environment preset="sunset" />
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.1}
          bokehScale={3}
        />
        <Vignette offset={0.1} darkness={0.4} />
      </EffectComposer>
    </>
  )
}

// Main component
export function ChromosomeViewer3D({ 
  segments, 
  selectedChromosome 
}: ChromosomeViewer3DProps) {
  const [showLegend, setShowLegend] = useState(true)
  
  // Get unique ancestries for legend
  const uniqueAncestries = useMemo(() => {
    const ancestries = new Set(segments.map(s => s.ancestry))
    return Array.from(ancestries)
  }, [segments])

  // Leva controls for debugging/customization
  const { 
    showHeatMap, 
    glowIntensity,
    cameraAutoRotate 
  } = useControls('Visualization', {
    showHeatMap: true,
    glowIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    cameraAutoRotate: true,
  })

  return (
    <div className="relative w-full h-[800px] bg-gradient-to-b from-purple-900/20 to-black rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <ChromosomeScene
          segments={segments}
          selectedChromosome={selectedChromosome}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/60 backdrop-blur-md rounded-xl p-4 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Chromosome Explorer 3D</h2>
          <p className="text-sm opacity-80">
            Click on any chromosome to zoom in and explore ancestry segments
          </p>
        </motion.div>
        
        {selectedChromosome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-md rounded-xl p-4 text-white"
          >
            <h3 className="text-lg font-semibold mb-2">Selected: {selectedChromosome}</h3>
            <button
              onClick={() => onChromosomeSelect?.(null)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
            >
              Back to Overview
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 text-white max-w-xs"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Ancestry Legend</h3>
            <button
              onClick={() => setShowLegend(false)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uniqueAncestries.map(ancestry => (
              <div key={ancestry} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: ANCESTRY_COLORS[ancestry] || '#999' }}
                />
                <span className="text-sm">{ancestry}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        <p>🖱️ Left click + drag to rotate • Right click + drag to pan • Scroll to zoom</p>
      </div>
    </div>
  )
}