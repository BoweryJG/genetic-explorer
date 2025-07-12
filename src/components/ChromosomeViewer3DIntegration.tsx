import { useState, useEffect } from 'react'
import { ChromosomeViewer3D } from './ChromosomeViewer3D'
import { type AncestrySegment } from '../utils/csvParser'

interface ChromosomeViewer3DIntegrationProps {
  segments: AncestrySegment[]
}

export function ChromosomeViewer3DIntegration({ segments }: ChromosomeViewer3DIntegrationProps) {
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-[800px] bg-gradient-to-b from-purple-900/20 to-black rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading 3D Chromosome Visualization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-purple-600/20 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30">
          <h4 className="text-sm text-purple-300 mb-1">Total Chromosomes</h4>
          <p className="text-2xl font-bold text-white">23 pairs</p>
        </div>
        <div className="bg-purple-600/20 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30">
          <h4 className="text-sm text-purple-300 mb-1">Ancestry Segments</h4>
          <p className="text-2xl font-bold text-white">{segments.length}</p>
        </div>
        <div className="bg-purple-600/20 rounded-xl p-4 backdrop-blur-sm border border-purple-500/30">
          <h4 className="text-sm text-purple-300 mb-1">Unique Ancestries</h4>
          <p className="text-2xl font-bold text-white">
            {new Set(segments.map(s => s.ancestry)).size}
          </p>
        </div>
      </div>

      {/* 3D Visualization */}
      <ChromosomeViewer3D
        segments={segments}
        onChromosomeSelect={setSelectedChromosome}
        selectedChromosome={selectedChromosome}
      />

      {/* Selected chromosome details */}
      {selectedChromosome && (
        <div className="bg-purple-600/20 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">
            {selectedChromosome} Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Segments on this chromosome */}
            <div>
              <h4 className="text-sm text-purple-300 mb-2">Ancestry Segments</h4>
              <div className="space-y-2">
                {segments
                  .filter(s => s.chromosome === selectedChromosome)
                  .map((segment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-black/30 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{
                            backgroundColor:
                              ANCESTRY_COLORS[segment.ancestry] || '#999'
                          }}
                        />
                        <span className="text-sm text-white">
                          {segment.ancestry}
                        </span>
                      </div>
                      <span className="text-xs text-white/60">
                        Copy {segment.copyNumber}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Chromosome statistics */}
            <div>
              <h4 className="text-sm text-purple-300 mb-2">Statistics</h4>
              <div className="space-y-2 text-white/80 text-sm">
                <div className="flex justify-between">
                  <span>Total Coverage:</span>
                  <span className="font-mono">
                    {(
                      segments
                        .filter(s => s.chromosome === selectedChromosome)
                        .reduce((acc, s) => acc + (s.endPoint - s.startPoint), 0) /
                      1000000
                    ).toFixed(1)}{' '}
                    Mb
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Largest Segment:</span>
                  <span className="font-mono">
                    {(
                      Math.max(
                        ...segments
                          .filter(s => s.chromosome === selectedChromosome)
                          .map(s => s.endPoint - s.startPoint)
                      ) / 1000000
                    ).toFixed(1)}{' '}
                    Mb
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Re-export ancestry colors for use in the integration
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