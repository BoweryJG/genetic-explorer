import { useState, useEffect } from 'react'
import { Info, Search, Dna, Globe2, Activity, LogOut } from 'lucide-react'
import { parseAncestryCSV, groupByChromosome, calculateAncestryPercentages, type AncestrySegment } from './utils/csvParser'
import { ChromosomeVisualization } from './components/ChromosomeVisualization'
import { AncestryPieChart } from './components/AncestryPieChart'
import { AncestryExplorer } from './components/AncestryExplorer'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth()
  const [segments, setSegments] = useState<AncestrySegment[]>([])
  const [selectedAncestry, setSelectedAncestry] = useState<string | null>(null)
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Automatically load the data on mount when user is authenticated
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const response = await fetch('/sample-data.csv')
        const text = await response.text()
        const parsedSegments = parseAncestryCSV(text)
        setSegments(parsedSegments)
      } catch (err) {
        setError('Failed to load genetic data.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [user])


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
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-purple-200 text-sm">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {authLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 text-center max-w-2xl w-full border border-white/20 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            </div>
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 text-center max-w-2xl w-full border border-white/20 shadow-2xl">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6">
                  <Dna className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Genetic Heritage Explorer</h2>
              <p className="text-purple-200 mb-8 text-lg">
                Sign in with Google to explore your genetic ancestry
              </p>
              
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-800 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 text-center max-w-2xl w-full border border-white/20 shadow-2xl">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Loading Your Genetic Data</h2>
              <p className="text-purple-200 text-lg">Analyzing your ancestry composition...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-12 text-center max-w-2xl w-full border border-white/20 shadow-2xl">
              <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-200 rounded-xl">
                {error}
              </div>
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