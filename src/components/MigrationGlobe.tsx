import { useRef, useState, useEffect, useMemo } from 'react'
import Globe from 'react-globe.gl'
import { Calendar, Info, Users, TrendingUp } from 'lucide-react'
import { type AncestrySegment } from '../utils/csvParser'

interface MigrationGlobeProps {
  segments: AncestrySegment[]
  selectedAncestry?: string | null
  onCountryClick?: (country: any) => void
}

interface MigrationPath {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  ancestry: string
  period: string
  description: string
  color: string
  strokeWidth: number
}

interface CountryData {
  name: string
  lat: number
  lng: number
  ancestry: string[]
  population: number
  density: number
}

interface TimelineEvent {
  year: number
  event: string
  ancestry: string
}

// Historical migration data
const MIGRATION_DATA: Record<string, MigrationPath[]> = {
  'Ashkenazi Jewish': [
    {
      startLat: 31.7683, startLng: 35.2137, // Jerusalem
      endLat: 41.9028, endLng: 12.4964, // Rome
      ancestry: 'Ashkenazi Jewish',
      period: '1st-5th century CE',
      description: 'Jewish diaspora from Judea to Rome',
      color: '#8B5CF6',
      strokeWidth: 2
    },
    {
      startLat: 41.9028, startLng: 12.4964, // Rome
      endLat: 50.0755, endLng: 14.4378, // Prague
      ancestry: 'Ashkenazi Jewish',
      period: '8th-10th century',
      description: 'Migration to Central Europe',
      color: '#8B5CF6',
      strokeWidth: 2.5
    },
    {
      startLat: 50.0755, startLng: 14.4378, // Prague
      endLat: 52.2297, endLng: 21.0122, // Warsaw
      ancestry: 'Ashkenazi Jewish',
      period: '13th-17th century',
      description: 'Eastward expansion into Poland',
      color: '#8B5CF6',
      strokeWidth: 3
    }
  ],
  'Italian': [
    {
      startLat: 37.9838, startLng: 23.7275, // Athens
      endLat: 40.8518, endLng: 14.2681, // Naples
      ancestry: 'Italian',
      period: '8th century BCE',
      description: 'Greek colonization of Southern Italy',
      color: '#10B981',
      strokeWidth: 2
    },
    {
      startLat: 45.4642, startLng: 9.1900, // Milan
      endLat: 41.9028, endLng: 12.4964, // Rome
      ancestry: 'Italian',
      period: '3rd century BCE',
      description: 'Celtic migrations',
      color: '#10B981',
      strokeWidth: 2
    },
    {
      startLat: 52.5200, startLng: 13.4050, // Berlin (Germanic)
      endLat: 45.4642, endLng: 9.1900, // Milan
      ancestry: 'Italian',
      period: '5th century CE',
      description: 'Germanic invasions',
      color: '#10B981',
      strokeWidth: 2.5
    }
  ],
  'Eastern European': [
    {
      startLat: 51.9194, startLng: 31.4784, // Pripet Marshes
      endLat: 50.0755, endLng: 14.4378, // Prague
      ancestry: 'Eastern European',
      period: '6th century',
      description: 'Slavic expansion westward',
      color: '#F59E0B',
      strokeWidth: 2
    },
    {
      startLat: 51.9194, startLng: 31.4784, // Pripet Marshes
      endLat: 55.7558, endLng: 37.6173, // Moscow
      ancestry: 'Eastern European',
      period: '6th-8th century',
      description: 'Slavic expansion eastward',
      color: '#F59E0B',
      strokeWidth: 2.5
    },
    {
      startLat: 47.3730, startLng: 94.2620, // Mongolia
      endLat: 50.4501, endLng: 30.5234, // Kiev
      ancestry: 'Eastern European',
      period: '13th century',
      description: 'Mongol invasions',
      color: '#F59E0B',
      strokeWidth: 3
    }
  ]
}

// Country ancestry data
const COUNTRY_ANCESTRY_DATA: CountryData[] = [
  { name: 'Poland', lat: 51.9194, lng: 19.1451, ancestry: ['Ashkenazi Jewish', 'Eastern European'], population: 37950000, density: 123 },
  { name: 'Italy', lat: 41.8719, lng: 12.5674, ancestry: ['Italian'], population: 60360000, density: 206 },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, ancestry: ['Ashkenazi Jewish', 'Eastern European'], population: 83240000, density: 240 },
  { name: 'Ukraine', lat: 48.3794, lng: 31.1656, ancestry: ['Eastern European', 'Ashkenazi Jewish'], population: 43730000, density: 75 },
  { name: 'Russia', lat: 61.5240, lng: 105.3188, ancestry: ['Eastern European'], population: 146170000, density: 9 },
  { name: 'Israel', lat: 31.0461, lng: 34.8516, ancestry: ['Ashkenazi Jewish'], population: 9364000, density: 424 },
  { name: 'United States', lat: 37.0902, lng: -95.7129, ancestry: ['Ashkenazi Jewish', 'Italian', 'Eastern European'], population: 331900000, density: 36 },
  { name: 'Greece', lat: 39.0742, lng: 21.8243, ancestry: ['Italian'], population: 10720000, density: 83 },
  { name: 'Czech Republic', lat: 49.8175, lng: 15.4730, ancestry: ['Eastern European', 'Ashkenazi Jewish'], population: 10700000, density: 139 },
  { name: 'Hungary', lat: 47.1625, lng: 19.5033, ancestry: ['Eastern European'], population: 9750000, density: 108 }
]

// Timeline events
const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: -800, event: 'Greek colonization of Southern Italy begins', ancestry: 'Italian' },
  { year: -300, event: 'Celtic tribes settle in Northern Italy', ancestry: 'Italian' },
  { year: 70, event: 'Destruction of Second Temple, Jewish diaspora begins', ancestry: 'Ashkenazi Jewish' },
  { year: 400, event: 'Germanic invasions of Roman Empire', ancestry: 'Italian' },
  { year: 600, event: 'Slavic expansion from Pripet Marshes', ancestry: 'Eastern European' },
  { year: 800, event: 'Jewish communities established in Rhineland', ancestry: 'Ashkenazi Jewish' },
  { year: 900, event: 'Magyar settlement in Hungary', ancestry: 'Eastern European' },
  { year: 1200, event: 'Mongol invasions of Eastern Europe', ancestry: 'Eastern European' },
  { year: 1300, event: 'Jewish migration eastward to Poland', ancestry: 'Ashkenazi Jewish' },
  { year: 1850, event: 'Mass migrations to Americas begin', ancestry: 'All' }
]

export function MigrationGlobe({ segments, selectedAncestry, onCountryClick }: MigrationGlobeProps) {
  const globeEl = useRef<any>()
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [timelineYear, setTimelineYear] = useState<number>(2020)
  const [isPlaying, setIsPlaying] = useState(false)
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.5)

  // Calculate ancestry percentages
  const ancestryPercentages = useMemo(() => {
    const total = segments.length
    const counts: Record<string, number> = {}
    
    segments.forEach(segment => {
      counts[segment.ancestry] = (counts[segment.ancestry] || 0) + 1
    })
    
    const percentages: Record<string, number> = {}
    Object.entries(counts).forEach(([ancestry, count]) => {
      percentages[ancestry] = (count / total) * 100
    })
    
    return percentages
  }, [segments])

  // Filter migration paths based on timeline
  const activePaths = useMemo(() => {
    const paths: MigrationPath[] = []
    
    Object.entries(MIGRATION_DATA).forEach(([ancestry, migrations]) => {
      if (selectedAncestry && ancestry !== selectedAncestry) return
      
      migrations.forEach(migration => {
        const startYear = parseInt(migration.period.match(/-?\d+/)?.[0] || '0')
        if (startYear <= timelineYear) {
          paths.push({
            ...migration,
            strokeWidth: selectedAncestry === ancestry ? migration.strokeWidth * 1.5 : migration.strokeWidth
          })
        }
      })
    })
    
    return paths
  }, [selectedAncestry, timelineYear])

  // Auto-play timeline
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setTimelineYear(year => {
        if (year >= 2020) {
          setIsPlaying(false)
          return -1000
        }
        return year + 50
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [isPlaying])

  // Initialize globe
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.5
      globeEl.current.pointOfView({ lat: 45, lng: 10, altitude: 2.5 })
    }
  }, [])

  const handleCountryClick = (country: CountryData) => {
    setSelectedCountry(country)
    if (onCountryClick) {
      onCountryClick(country)
    }
  }

  const getCountryColor = (country: CountryData) => {
    if (!selectedAncestry) return 'rgba(139, 92, 246, 0.3)'
    
    if (country.ancestry.includes(selectedAncestry)) {
      return 'rgba(139, 92, 246, 0.8)'
    }
    
    return 'rgba(139, 92, 246, 0.1)'
  }

  const getHeatmapData = () => {
    return COUNTRY_ANCESTRY_DATA.map(country => ({
      lat: country.lat,
      lng: country.lng,
      weight: (country.density / 500) * heatmapIntensity,
      ancestry: country.ancestry
    }))
  }

  return (
    <div className="relative w-full h-[800px] bg-slate-900 rounded-3xl overflow-hidden">
      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Arc data for migration paths
        arcsData={activePaths}
        arcStartLat={d => (d as MigrationPath).startLat}
        arcStartLng={d => (d as MigrationPath).startLng}
        arcEndLat={d => (d as MigrationPath).endLat}
        arcEndLng={d => (d as MigrationPath).endLng}
        arcColor={d => (d as MigrationPath).color}
        arcDashLength={0.5}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={d => (d as MigrationPath).strokeWidth}
        
        // Points for countries
        pointsData={COUNTRY_ANCESTRY_DATA}
        pointLat={d => (d as CountryData).lat}
        pointLng={d => (d as CountryData).lng}
        pointColor={d => getCountryColor(d as CountryData)}
        pointAltitude={0.1}
        pointRadius={d => Math.sqrt((d as CountryData).population) / 10000}
        pointLabel={d => `
          <div class="bg-black/90 text-white p-2 rounded">
            <div class="font-bold">${(d as CountryData).name}</div>
            <div class="text-sm">Population: ${((d as CountryData).population / 1000000).toFixed(1)}M</div>
            <div class="text-sm">Ancestries: ${(d as CountryData).ancestry.join(', ')}</div>
          </div>
        `}
        onPointClick={handleCountryClick}
        
        // Heatmap layer
        heatmapsData={[getHeatmapData()]}
        heatmapPointLat={d => (d as any).lat}
        heatmapPointLng={d => (d as any).lng}
        heatmapPointWeight={d => (d as any).weight}
        heatmapTopAltitude={0.01}
        heatmapsTransitionDuration={3000}
      />
      
      {/* Timeline Controls */}
      <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Migration Timeline</h3>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'} Animation
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-purple-200">
            <span>1000 BCE</span>
            <span className="font-bold text-white text-lg">
              {timelineYear < 0 ? `${Math.abs(timelineYear)} BCE` : `${timelineYear} CE`}
            </span>
            <span>2020 CE</span>
          </div>
          
          <input
            type="range"
            min="-1000"
            max="2020"
            value={timelineYear}
            onChange={(e) => setTimelineYear(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((timelineYear + 1000) / 3020) * 100}%, #4C1D95 ${((timelineYear + 1000) / 3020) * 100}%, #4C1D95 100%)`
            }}
          />
          
          {/* Timeline Events */}
          <div className="mt-4 max-h-32 overflow-y-auto">
            {TIMELINE_EVENTS
              .filter(event => event.year <= timelineYear)
              .sort((a, b) => b.year - a.year)
              .slice(0, 3)
              .map((event, idx) => (
                <div key={idx} className="text-sm text-purple-200 py-1">
                  <span className="font-medium text-white">
                    {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                  </span>
                  : {event.event}
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-8 left-8 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-3">Ancestry Composition</h3>
        <div className="space-y-2">
          {Object.entries(ancestryPercentages).map(([ancestry, percentage]) => (
            <div
              key={ancestry}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                selectedAncestry && selectedAncestry !== ancestry ? 'opacity-50' : ''
              }`}
              onClick={() => setSelectedCountry(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: MIGRATION_DATA[ancestry]?.[0]?.color || '#8B5CF6'
                }}
              />
              <span className="text-xs text-purple-200">
                {ancestry} ({percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-3">Visualization Controls</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-purple-200 block mb-1">Population Density</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={heatmapIntensity}
              onChange={(e) => setHeatmapIntensity(parseFloat(e.target.value))}
              className="w-32 h-1 bg-purple-900/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* Selected Country Info */}
      {selectedCountry && (
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{selectedCountry.name}</h3>
              <p className="text-purple-300 text-sm">Population: {(selectedCountry.population / 1000000).toFixed(1)}M</p>
            </div>
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-purple-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-purple-300 mb-1">Ancestries Present</p>
              <div className="flex flex-wrap gap-2">
                {selectedCountry.ancestry.map(anc => (
                  <span
                    key={anc}
                    className="px-2 py-1 bg-purple-600/30 text-purple-200 rounded-lg text-xs"
                  >
                    {anc}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-purple-200">
                Density: {selectedCountry.density} per km²
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Tooltip */}
      <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/20 max-w-xs">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-400 mt-0.5" />
          <p className="text-xs text-purple-200">
            Click on countries to explore ancestry details. Use the timeline to see historical migration patterns.
          </p>
        </div>
      </div>
    </div>
  )
}