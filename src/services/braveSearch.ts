interface BraveSearchResult {
  title: string
  url: string
  description: string
  age?: string
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[]
  }
  query: {
    original: string
  }
}

export class BraveSearchService {
  private apiKey: string
  private baseUrl = 'https://api.search.brave.com/res/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchAncestry(query: string, ancestry?: string): Promise<BraveSearchResult[]> {
    const enhancedQuery = ancestry 
      ? `${ancestry} ancestry ${query}` 
      : query

    try {
      const response = await fetch(`${this.baseUrl}/web/search?q=${encodeURIComponent(enhancedQuery)}&count=10`, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.statusText}`)
      }

      const data: BraveSearchResponse = await response.json()
      return data.web?.results || []
    } catch (error) {
      console.error('Brave Search error:', error)
      throw error
    }
  }

  async searchGeneticTrait(trait: string, ancestries: string[]): Promise<BraveSearchResult[]> {
    const queries = ancestries.map(ancestry => 
      `${ancestry} genetic ${trait} research studies`
    )
    
    const results = await Promise.all(
      queries.map(q => this.searchAncestry(q))
    )
    
    // Flatten and deduplicate results
    const allResults = results.flat()
    const uniqueResults = Array.from(
      new Map(allResults.map(r => [r.url, r])).values()
    )
    
    return uniqueResults
  }

  async searchChromosomeInfo(chromosome: string, ancestries: string[]): Promise<BraveSearchResult[]> {
    const query = `chromosome ${chromosome} genetic traits ${ancestries.join(' ')} ancestry`
    return this.searchAncestry(query)
  }

  async searchHistoricalContext(ancestry: string, timeperiod?: string): Promise<BraveSearchResult[]> {
    const query = timeperiod 
      ? `${ancestry} history migration ${timeperiod}` 
      : `${ancestry} history migration genetics`
    return this.searchAncestry(query)
  }
}