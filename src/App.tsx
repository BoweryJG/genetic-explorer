import { useState, useCallback } from 'react'
import { Upload, Info, Search, Dna, Globe2, Activity } from 'lucide-react'
import { parseAncestryCSV, groupByChromosome, calculateAncestryPercentages, type AncestrySegment } from './utils/csvParser'
import { ChromosomeVisualization } from './components/ChromosomeVisualization'
import { AncestryPieChart } from './components/AncestryPieChart'
import { AncestryExplorer } from './components/AncestryExplorer'
import './App.css'

function App() {
  const [segments, setSegments] = useState<AncestrySegment[]>([])
  const [selectedAncestry, setSelectedAncestry] = useState<string | null>(null)
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const parsedSegments = parseAncestryCSV(text)
      setSegments(parsedSegments)
    } catch (err) {
      setError('Failed to parse CSV file. Please ensure it\'s a valid 23andMe ancestry composition file.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const groupedByChromosome = groupByChromosome(segments)
  const ancestryPercentages = calculateAncestryPercentages(segments)
  const chromosomes = Object.keys(groupedByChromosome).sort((a, b) => {
    const aNum = parseInt(a.replace('chr', '').replace('X', '23').replace('Y', '24'))
    const bNum = parseInt(b.replace('chr', '').replace('X', '23').replace('Y', '24'))
    return aNum - bNum
  })

  const getSegmentsByAncestry = (ancestry: string) => {
    return segments.filter(s => s.ancestry === ancestry)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Dna className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Genetic Heritage Explorer</h1>
                <p className="text-purple-200 text-sm">Decode your ancestry with AI-powered insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Powered by Brave Search</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {segments.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 text-center max-w-2xl w-full border border-white/20 shadow-2xl">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6">
                  <Upload className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Upload Your Genetic Data</h2>
              <p className="text-purple-200 mb-8 text-lg">
                Drop your 23andMe ancestry composition CSV file to begin exploring your genetic heritage
              </p>
              
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <span className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 group-hover:from-purple-500 group-hover:to-pink-500">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Choose File
                    </>
                  )}
                </span>
              </label>
              
              {error && (
                <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-200 rounded-xl">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Segments', value: segments.length, icon: Globe2 },
                { label: 'Unique Ancestries', value: Object.keys(ancestryPercentages).length, icon: Dna },
                { label: 'Chromosomes', value: chromosomes.length, icon: Activity },
                { label: 'Primary Ancestry', value: Object.entries(ancestryPercentages).sort((a, b) => b[1] - a[1])[0]?.[0], icon: Search }
              ].map((stat, idx) => (
                <div key={idx} className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-purple-200">{stat.label}</p>
                    <stat.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Main Visualization Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
                <AncestryPieChart 
                  data={ancestryPercentages}
                  onSegmentClick={setSelectedAncestry}
                />
              </div>
              
              {/* Insights Panel */}
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Genetic Insights</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-200 mb-1">Interactive Exploration</p>
                        <p className="text-purple-300 text-sm">Click any ancestry in the chart to dive deep into your genetic heritage, historical migrations, and unique traits.</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAncestry && (
                    <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20">
                      <p className="text-sm text-purple-200 mb-1">Currently Exploring</p>
                      <p className="text-xl font-bold text-white">{selectedAncestry}</p>
                      <p className="text-purple-300 text-sm mt-1">
                        {(ancestryPercentages[selectedAncestry] || 0).toFixed(2)}% of your genome
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Ancestry Explorer */}
            {selectedAncestry && (
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
                <AncestryExplorer
                  ancestry={selectedAncestry}
                  segments={getSegmentsByAncestry(selectedAncestry)}
                  braveApiKey={import.meta.env.VITE_BRAVE_API_KEY}
                />
              </div>
            )}

            {/* Chromosome Browser */}
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Chromosome Browser</h2>
                <select
                  value={selectedChromosome || ''}
                  onChange={(e) => setSelectedChromosome(e.target.value || null)}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                >
                  <option value="">All Chromosomes</option>
                  {chromosomes.map(chr => (
                    <option key={chr} value={chr}>{chr}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {(selectedChromosome ? [selectedChromosome] : chromosomes).map(chr => (
                  <ChromosomeVisualization
                    key={chr}
                    chromosome={chr}
                    segments={groupedByChromosome[chr] || []}
                    onSegmentClick={(segment) => setSelectedAncestry(segment.ancestry)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App