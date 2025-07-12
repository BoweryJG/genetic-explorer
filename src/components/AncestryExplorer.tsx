import { useState } from 'react'
import { Search, Globe, Dna, History, TrendingUp } from 'lucide-react'
import { BraveSearchService } from '../services/braveSearch'
import { type AncestrySegment } from '../utils/csvParser'

interface AncestryExplorerProps {
  ancestry: string
  segments: AncestrySegment[]
  braveApiKey?: string
}

interface SearchResult {
  title: string
  url: string
  description: string
}

interface Trait {
  category: string
  description: string
}

interface AncestryInsight {
  overview: string
  genetics: string[]
  history: string
  migration: string
  traits: Trait[]
}

export function AncestryExplorer({ ancestry, segments, braveApiKey }: AncestryExplorerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'genetics' | 'history' | 'traits'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!braveApiKey || !searchQuery) return
    
    setIsSearching(true)
    try {
      const braveSearch = new BraveSearchService(braveApiKey)
      const results = await braveSearch.searchAncestry(searchQuery, ancestry)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const totalLength = segments.reduce((sum, seg) => sum + (seg.endPoint - seg.startPoint), 0)
  const chromosomes = Array.from(new Set(segments.map(s => s.chromosome))).sort()

  const insights = getAncestryInsights(ancestry)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{ancestry} Ancestry Explorer</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-1 flex items-center gap-2 ${
            activeTab === 'overview' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('genetics')}
          className={`pb-2 px-1 flex items-center gap-2 ${
            activeTab === 'genetics' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Dna className="w-4 h-4" />
          Genetics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 flex items-center gap-2 ${
            activeTab === 'history' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>
        <button
          onClick={() => setActiveTab('traits')}
          className={`pb-2 px-1 flex items-center gap-2 ${
            activeTab === 'traits' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Traits
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Segments</p>
                <p className="text-2xl font-bold">{segments.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Chromosomes</p>
                <p className="text-2xl font-bold">{chromosomes.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Length</p>
                <p className="text-2xl font-bold">{(totalLength / 1_000_000).toFixed(1)}M bp</p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">About {ancestry} Ancestry</h3>
              <p className="text-gray-700">{insights.overview}</p>
            </div>
          </div>
        )}

        {activeTab === 'genetics' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Genetic Characteristics</h3>
            <ul className="space-y-2">
              {insights.genetics.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <Dna className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historical Context</h3>
            <p className="text-gray-700">{insights.history}</p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Migration Patterns</h4>
              <p className="text-blue-800">{insights.migration}</p>
            </div>
          </div>
        )}

        {activeTab === 'traits' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Common Traits & Health Considerations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.traits.map((trait: Trait, idx: number) => (
                <div key={idx} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-800">{trait.category}</p>
                  <p className="text-sm text-gray-600">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Section */}
        {braveApiKey && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Research {ancestry} Ancestry</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={`Search about ${ancestry} genetics, history, or culture...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((result, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                    <a 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {result.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function getAncestryInsights(ancestry: string): AncestryInsight {
  const insights: Record<string, AncestryInsight> = {
    'Ashkenazi Jewish': {
      overview: 'Ashkenazi Jewish ancestry traces to Jewish communities that settled in Central and Eastern Europe during the Middle Ages. This population maintained genetic distinctiveness through centuries of endogamy, creating one of the most genetically identifiable populations.',
      genetics: [
        'Unique genetic bottleneck ~600-800 years ago',
        'Higher carrier frequency for certain genetic conditions (BRCA1/2, Tay-Sachs)',
        'Distinct mitochondrial DNA lineages tracing to Middle Eastern origins',
        'Evidence of European admixture (30-60%) with Middle Eastern ancestry'
      ],
      history: 'Ashkenazi communities formed in the Rhineland during the 10th century, later migrating eastward. Despite persecution and isolation, they maintained cultural and genetic continuity.',
      migration: 'Initial migration from the Levant to Italy (1st-5th century CE), then to the Rhineland (8th-10th century), followed by eastward expansion into Poland and Russia (13th-17th century).',
      traits: [
        { category: 'Cognitive', description: 'Some studies suggest higher average performance in certain cognitive domains' },
        { category: 'Health Risks', description: 'Increased risk for BRCA mutations, familial dysautonomia, and certain metabolic conditions' },
        { category: 'Advantages', description: 'Potential resistance to tuberculosis and certain infectious diseases' }
      ]
    },
    'Italian': {
      overview: 'Italian ancestry reflects the complex history of the Italian peninsula, from ancient Romans to medieval city-states. This ancestry often shows a north-south genetic gradient.',
      genetics: [
        'High genetic diversity due to historical admixture',
        'Mediterranean adaptations for diet and climate',
        'Ancient Greek and Middle Eastern influences in Southern Italy',
        'Celtic and Germanic influences in Northern Italy'
      ],
      history: 'Italy has been a crossroads of civilizations for millennia, from the Etruscans and Greeks to Romans, and later invasions by Germanic tribes, Arabs, and Normans.',
      migration: 'Historic migrations include Greek colonization (8th century BCE), Roman expansion, Germanic invasions (5th century CE), and Arab conquest of Sicily (9th century CE).',
      traits: [
        { category: 'Metabolism', description: 'Adaptations for Mediterranean diet, including efficient olive oil metabolism' },
        { category: 'Health', description: 'Lower risk of cardiovascular disease with traditional diet' },
        { category: 'Lactose', description: 'Variable lactose tolerance, lower in south' }
      ]
    },
    'Eastern European': {
      overview: 'Eastern European ancestry encompasses diverse Slavic, Baltic, and Finno-Ugric populations. This region shows significant genetic diversity due to complex migration patterns.',
      genetics: [
        'High frequency of light eye and hair color variants',
        'Adaptations to high-latitude environments',
        'Evidence of ancient hunter-gatherer ancestry',
        'Genetic influence from steppe populations'
      ],
      history: 'Eastern Europe has seen waves of migration from Slavic expansions (6th century) to Mongol invasions (13th century) and recent population movements.',
      migration: 'Major migrations include Slavic expansion from the Pripet Marshes, Magyar settlement in Hungary, and various nomadic invasions from the Eurasian steppe.',
      traits: [
        { category: 'Alcohol', description: 'Higher frequency of alcohol dehydrogenase variants' },
        { category: 'Lactose', description: 'High lactose tolerance prevalence' },
        { category: 'Climate', description: 'Adaptations for cold climate and low UV exposure' }
      ]
    }
  }

  return insights[ancestry] || {
    overview: `${ancestry} represents a unique genetic heritage with its own history of migration and adaptation.`,
    genetics: ['Unique genetic markers', 'Population-specific variants', 'Historical admixture patterns'],
    history: 'This ancestry has a rich history worth exploring through genetic and historical research.',
    migration: 'Migration patterns have shaped the genetic landscape of this population.',
    traits: [
      { category: 'General', description: 'Population-specific traits and adaptations' }
    ]
  }
}