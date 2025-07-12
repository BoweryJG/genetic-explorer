import { useState } from 'react'
import { ChromosomeViewer3D } from './ChromosomeViewer3D'
import { type AncestrySegment } from '../utils/csvParser'

// Example ancestry segments data
const EXAMPLE_SEGMENTS: AncestrySegment[] = [
  // Chromosome 1
  { ancestry: 'Ashkenazi Jewish', copyNumber: 1, chromosome: 'chr1', startPoint: 0, endPoint: 15000000 },
  { ancestry: 'Italian', copyNumber: 1, chromosome: 'chr1', startPoint: 15000000, endPoint: 45000000 },
  { ancestry: 'Eastern European', copyNumber: 1, chromosome: 'chr1', startPoint: 45000000, endPoint: 80000000 },
  { ancestry: 'French & German', copyNumber: 2, chromosome: 'chr1', startPoint: 0, endPoint: 35000000 },
  { ancestry: 'Northwestern European', copyNumber: 2, chromosome: 'chr1', startPoint: 35000000, endPoint: 80000000 },
  
  // Chromosome 2
  { ancestry: 'Spanish & Portuguese', copyNumber: 1, chromosome: 'chr2', startPoint: 0, endPoint: 25000000 },
  { ancestry: 'Greek & Balkan', copyNumber: 1, chromosome: 'chr2', startPoint: 25000000, endPoint: 60000000 },
  { ancestry: 'Southern European', copyNumber: 2, chromosome: 'chr2', startPoint: 0, endPoint: 40000000 },
  { ancestry: 'Broadly European', copyNumber: 2, chromosome: 'chr2', startPoint: 40000000, endPoint: 90000000 },
  
  // Chromosome 3
  { ancestry: 'Ashkenazi Jewish', copyNumber: 1, chromosome: 'chr3', startPoint: 0, endPoint: 30000000 },
  { ancestry: 'Italian', copyNumber: 1, chromosome: 'chr3', startPoint: 30000000, endPoint: 70000000 },
  { ancestry: 'Eastern European', copyNumber: 2, chromosome: 'chr3', startPoint: 0, endPoint: 50000000 },
  
  // Add more segments for other chromosomes...
  { ancestry: 'French & German', copyNumber: 1, chromosome: 'chr4', startPoint: 0, endPoint: 40000000 },
  { ancestry: 'Northwestern European', copyNumber: 2, chromosome: 'chr4', startPoint: 0, endPoint: 35000000 },
  
  { ancestry: 'Spanish & Portuguese', copyNumber: 1, chromosome: 'chr5', startPoint: 10000000, endPoint: 50000000 },
  { ancestry: 'Greek & Balkan', copyNumber: 2, chromosome: 'chr5', startPoint: 0, endPoint: 45000000 },
  
  { ancestry: 'Ashkenazi Jewish', copyNumber: 1, chromosome: 'chr6', startPoint: 0, endPoint: 25000000 },
  { ancestry: 'Italian', copyNumber: 2, chromosome: 'chr6', startPoint: 20000000, endPoint: 60000000 },
  
  { ancestry: 'Eastern European', copyNumber: 1, chromosome: 'chr7', startPoint: 15000000, endPoint: 55000000 },
  { ancestry: 'French & German', copyNumber: 2, chromosome: 'chr7', startPoint: 0, endPoint: 40000000 },
  
  { ancestry: 'Northwestern European', copyNumber: 1, chromosome: 'chr8', startPoint: 0, endPoint: 30000000 },
  { ancestry: 'Spanish & Portuguese', copyNumber: 2, chromosome: 'chr8', startPoint: 10000000, endPoint: 50000000 },
  
  { ancestry: 'Greek & Balkan', copyNumber: 1, chromosome: 'chr9', startPoint: 5000000, endPoint: 45000000 },
  { ancestry: 'Southern European', copyNumber: 2, chromosome: 'chr9', startPoint: 0, endPoint: 35000000 },
  
  { ancestry: 'Broadly European', copyNumber: 1, chromosome: 'chr10', startPoint: 0, endPoint: 40000000 },
  { ancestry: 'Ashkenazi Jewish', copyNumber: 2, chromosome: 'chr10', startPoint: 15000000, endPoint: 55000000 },
  
  // X chromosome
  { ancestry: 'Italian', copyNumber: 1, chromosome: 'chrX', startPoint: 0, endPoint: 40000000 },
  { ancestry: 'Eastern European', copyNumber: 1, chromosome: 'chrX', startPoint: 40000000, endPoint: 80000000 },
  { ancestry: 'French & German', copyNumber: 2, chromosome: 'chrX', startPoint: 0, endPoint: 60000000 },
  
  // Y chromosome (only one copy)
  { ancestry: 'Northwestern European', copyNumber: 1, chromosome: 'chrY', startPoint: 0, endPoint: 20000000 },
]

export function ChromosomeViewer3DExample() {
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null)
  const [segments] = useState<AncestrySegment[]>(EXAMPLE_SEGMENTS)

  const handleChromosomeSelect = (chromosome: string | null) => {
    setSelectedChromosome(chromosome)
    console.log('Selected chromosome:', chromosome)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            3D Chromosome Visualization
          </h1>
          <p className="text-xl opacity-80">
            Explore your genetic ancestry in stunning 3D
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Interactive Chromosome Explorer
            </h2>
            <p className="text-white/70">
              Click on any chromosome to zoom in and explore your ancestry segments in detail.
              Each colored segment represents a different ancestral origin.
            </p>
          </div>

          <ChromosomeViewer3D
            segments={segments}
            onChromosomeSelect={handleChromosomeSelect}
            selectedChromosome={selectedChromosome}
          />

          {selectedChromosome && (
            <div className="mt-6 p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">
                Chromosome Details: {selectedChromosome}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                <div>
                  <span className="font-medium">Total Segments:</span>{' '}
                  {segments.filter(s => s.chromosome === selectedChromosome).length}
                </div>
                <div>
                  <span className="font-medium">Unique Ancestries:</span>{' '}
                  {new Set(
                    segments
                      .filter(s => s.chromosome === selectedChromosome)
                      .map(s => s.ancestry)
                  ).size}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span>
                All 23 chromosome pairs in realistic 3D
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span>
                Glowing ancestry segments with smooth transitions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span>
                Interactive zoom and rotation controls
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span>
                Heat map visualization of segment density
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">✓</span>
                Performance optimized with LOD support
              </li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Controls</h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">🖱️</span>
                Left click + drag to rotate view
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">🖱️</span>
                Right click + drag to pan camera
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">⚲</span>
                Scroll to zoom in/out
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">👆</span>
                Click chromosome to focus
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">↺</span>
                Auto-rotate when idle
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}