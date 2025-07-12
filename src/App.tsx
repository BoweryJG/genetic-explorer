import { useState, useCallback } from 'react'
import { Upload, Info, Search } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Genetic Heritage Explorer</h1>
            </div>
            <div className="text-sm text-gray-600">
              Powered by Supabase & Brave Search
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {segments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Upload Your 23andMe Data</h2>
            <p className="text-gray-600 mb-6">
              Upload your ancestry_composition CSV file to explore your genetic heritage
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
              <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {isLoading ? 'Processing...' : 'Choose File'}
              </span>
            </label>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AncestryPieChart 
                data={ancestryPercentages}
                onSegmentClick={setSelectedAncestry}
              />
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Total Segments</span>
                    <span className="font-semibold">{segments.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Unique Ancestries</span>
                    <span className="font-semibold">{Object.keys(ancestryPercentages).length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Chromosomes Analyzed</span>
                    <span className="font-semibold">{chromosomes.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Primary Ancestry</span>
                    <span className="font-semibold">
                      {Object.entries(ancestryPercentages).sort((a, b) => b[1] - a[1])[0]?.[0]}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Pro Tip</p>
                      <p>Click on any ancestry in the pie chart to explore detailed insights, historical context, and research papers about that heritage.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Ancestry Explorer */}
            {selectedAncestry && (
              <AncestryExplorer
                ancestry={selectedAncestry}
                segments={getSegmentsByAncestry(selectedAncestry)}
                braveApiKey={import.meta.env.VITE_BRAVE_API_KEY}
              />
            )}

            {/* Chromosome Visualizations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Chromosome Browser</h2>
              <div className="mb-4">
                <select
                  value={selectedChromosome || ''}
                  onChange={(e) => setSelectedChromosome(e.target.value || null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Chromosomes</option>
                  {chromosomes.map(chr => (
                    <option key={chr} value={chr}>{chr}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
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