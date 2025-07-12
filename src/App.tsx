import React, { useState, useEffect, useRef } from 'react'
import { Info, Search, Dna, Globe2, Activity, LogOut, Heart, Users, ChevronDown } from 'lucide-react'
import { parseAncestryCSV, groupByChromosome, calculateAncestryPercentages, type AncestrySegment } from './utils/csvParser'
import { ChromosomeVisualization } from './components/ChromosomeVisualization'
import { AncestryPieChart } from './components/AncestryPieChart'
import { AncestryExplorer } from './components/AncestryExplorer'
import { MigrationGlobe } from './components/MigrationGlobe'
import { DNAHelix } from './components/DNAHelix'
import { ChromosomeViewer3D } from './components/ChromosomeViewer3D'
import { AncestryParticleFlow } from './components/AncestryParticleFlow'
import { HealthInsights } from './components/HealthInsights'
import { HaploGroupPredictor } from './components/HaploGroupPredictor'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth()
  const [segments, setSegments] = useState<AncestrySegment[]>([])
  const [selectedAncestry, setSelectedAncestry] = useState<string | null>(null)
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeVisualization, setActiveVisualization] = useState<'dna' | 'chromosomes' | 'particles'>('dna')
  const [geneticDiversityScore, setGeneticDiversityScore] = useState(0)
  const [neanderthalPercentage, setNeanderthalPercentage] = useState(0)
  
  // Refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null)
  const visualizationsRef = useRef<HTMLDivElement>(null)
  const healthRef = useRef<HTMLDivElement>(null)
  const haploRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)

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
        
        // Calculate genetic diversity score (based on number of unique ancestries and their distribution)
        const ancestryPercentages = calculateAncestryPercentages(parsedSegments)
        const numAncestries = Object.keys(ancestryPercentages).length
        const entropy = Object.values(ancestryPercentages).reduce((sum, pct) => {
          const p = pct / 100
          return sum - (p > 0 ? p * Math.log2(p) : 0)
        }, 0)
        const maxEntropy = Math.log2(numAncestries)
        const diversityScore = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0
        setGeneticDiversityScore(Math.round(diversityScore))
        
        // Calculate Neanderthal percentage (simulated for demo)
        const neanderthalPct = Math.random() * 3 + 0.5 // Between 0.5% and 3.5%
        setNeanderthalPercentage(Number(neanderthalPct.toFixed(2)))
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
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  // Add intersection observer for navigation dots
  useEffect(() => {
    if (!user || isLoading) return
    
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0
    }
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Update active section based on what's in view
          // This could be used for navigation dots or other UI updates
        }
      })
    }
    
    const observer = new IntersectionObserver(observerCallback, observerOptions)
    
    // Observe all section refs
    const refs = [heroRef, visualizationsRef, healthRef, haploRef, globeRef]
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })
    
    return () => observer.disconnect()
  }, [user, isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-deep border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg glass-neon">
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
                  <span className="text-purple-200 text-sm glass-badge">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="glass-button flex items-center gap-2"
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
            <div className="glass-iridescent p-12 text-center max-w-2xl w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            </div>
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-holographic p-12 text-center max-w-2xl w-full">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6 glass-neon">
                  <Dna className="w-16 h-16 text-white dna-base-pair" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Genetic Heritage Explorer</h2>
              <p className="text-purple-200 mb-8 text-lg">
                Sign in with Google to explore your genetic ancestry
              </p>
              
              <button
                onClick={signInWithGoogle}
                className="glass-button inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
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
            <div className="glass-deep p-12 text-center max-w-2xl w-full">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6 glass-neon">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Loading Your Genetic Data</h2>
              <p className="text-purple-200 text-lg">Analyzing your ancestry composition...</p>
              <div className="mt-6 glass-progress mx-auto w-64">
                <div className="glass-progress-bar" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-card p-12 text-center max-w-2xl w-full">
              <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-200 rounded-xl glass-neon">
                {error}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Navigation Dots */}
            <div className="nav-dots hidden lg:block">
              {[
                { ref: heroRef, label: 'Home' },
                { ref: visualizationsRef, label: '3D Visualizations' },
                { ref: healthRef, label: 'Health & Traits' },
                { ref: haploRef, label: 'Haplogroups' },
                { ref: globeRef, label: 'Migration Map' }
              ].map((section, idx) => (
                <div
                  key={idx}
                  className="nav-dot"
                  onClick={() => scrollToSection(section.ref)}
                  title={section.label}
                />
              ))}
            </div>
            
            {/* Hero Section with 3D DNA Helix Background */}
            <div ref={heroRef} className="relative min-h-screen -mt-[104px] pt-[104px] overflow-hidden">
              <div className="absolute inset-0 z-0">
                <DNAHelix />
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
                <div className="text-center mb-12">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                    Explore Your Genetic Story
                  </h1>
                  <p className="text-xl md:text-2xl text-purple-200 mb-8 animate-fade-in-delay">
                    Dive deep into your ancestry with AI-powered insights and stunning visualizations
                  </p>
                  <button
                    onClick={() => scrollToSection(visualizationsRef)}
                    className="glass-button inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold"
                  >
                    Start Exploring
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                  </button>
                </div>

                {/* Enhanced Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                  {[
                    { label: 'Total Segments', value: segments.length, icon: Globe2 },
                    { label: 'Unique Ancestries', value: Object.keys(ancestryPercentages).length, icon: Dna },
                    { label: 'Chromosomes', value: chromosomes.length, icon: Activity },
                    { label: 'Primary Ancestry', value: Object.entries(ancestryPercentages).sort((a, b) => b[1] - a[1])[0]?.[0], icon: Search },
                    { label: 'Genetic Diversity', value: `${geneticDiversityScore}%`, icon: Users },
                    { label: 'Neanderthal DNA', value: `${neanderthalPercentage}%`, icon: Dna }
                  ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 transform transition-all duration-200 hover:scale-105">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-purple-200 text-sm">{stat.label}</p>
                        <stat.icon className="w-5 h-5 text-purple-400 chromosome-element" />
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
              {/* 3D Visualizations Section */}
              <div ref={visualizationsRef} className="pt-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">Interactive 3D Visualizations</h2>
                  <p className="text-xl text-purple-200">Explore your genetic data in stunning 3D</p>
                </div>

                {/* Visualization Tabs */}
                <div className="flex justify-center mb-8">
                  <div className="glass-iridescent rounded-full p-1 overflow-x-auto">
                    <div className="flex gap-2">
                      {['dna', 'chromosomes', 'particles'].map((viz) => (
                        <button
                          key={viz}
                          onClick={() => setActiveVisualization(viz as any)}
                          className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
                            activeVisualization === viz
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white glass-neon'
                              : 'text-purple-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {viz === 'dna' ? 'DNA Helix' : viz === 'chromosomes' ? 'Chromosomes' : 'Particle Flow'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Visualization */}
                <div className="glass-deep h-[600px] relative overflow-hidden">
                  <div className="dna-decorator" />
                  <React.Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-purple-200">Loading 3D visualization...</p>
                      </div>
                    </div>
                  }>
                    {activeVisualization === 'dna' && <DNAHelix />}
                    {activeVisualization === 'chromosomes' && (
                      <ChromosomeViewer3D
                        segments={segments}
                        selectedChromosome={selectedChromosome || undefined}
                        onChromosomeClick={(chr) => setSelectedChromosome(chr)}
                      />
                    )}
                    {activeVisualization === 'particles' && (
                      <AncestryParticleFlow
                        ancestryData={ancestryPercentages}
                        selectedAncestry={selectedAncestry || undefined}
                      />
                    )}
                  </React.Suspense>
                </div>
              </div>

              {/* Ancestry Analysis Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="glass-card p-8">
                  <AncestryPieChart 
                    data={ancestryPercentages}
                    onSegmentClick={setSelectedAncestry}
                  />
                </div>
                
                {/* Selected Ancestry Explorer */}
                <div className="glass-iridescent p-8">
                  {selectedAncestry ? (
                    <AncestryExplorer
                      ancestry={selectedAncestry}
                      segments={getSegmentsByAncestry(selectedAncestry)}
                      braveApiKey={import.meta.env.VITE_BRAVE_API_KEY}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Info className="w-16 h-16 text-purple-400 mx-auto mb-4 chromosome-element" />
                        <p className="text-xl text-purple-200">Click an ancestry in the pie chart to explore</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Health & Traits Section */}
              <div ref={healthRef} className="pt-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">Health & Genetic Traits</h2>
                  <p className="text-xl text-purple-200">Discover insights about your health predispositions and unique traits</p>
                </div>
                
                <div className="glass-deep p-8">
                  <HealthInsights segments={segments} />
                </div>
              </div>

              {/* Haplogroup Predictions Section */}
              <div ref={haploRef} className="pt-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">Haplogroup Predictions</h2>
                  <p className="text-xl text-purple-200">Trace your ancient maternal and paternal lineages</p>
                </div>
                
                <div className="glass-holographic p-8">
                  <HaploGroupPredictor segments={segments} />
                </div>
              </div>

              {/* Migration Globe Section */}
              <div ref={globeRef} className="pt-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">Global Migration Patterns</h2>
                  <p className="text-xl text-purple-200">Explore the historical migration paths of your ancestors</p>
                </div>
                
                <div className="glass-neon p-8">
                  <MigrationGlobe
                    segments={segments}
                    selectedAncestry={selectedAncestry}
                    onCountryClick={(country) => {
                      console.log('Country clicked:', country)
                    }}
                  />
                </div>
              </div>

              {/* Chromosome Browser */}
              <div className="pt-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">Chromosome Browser</h2>
                  <p className="text-xl text-purple-200">Explore your genetic segments across all chromosomes</p>
                </div>
                
                <div className="glass-deep p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Select Chromosome</h3>
                    <select
                      value={selectedChromosome || ''}
                      onChange={(e) => setSelectedChromosome(e.target.value || null)}
                      className="glass-input"
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
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App