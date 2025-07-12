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

interface CacheEntry {
  data: BraveSearchResult[]
  timestamp: number
}

export class BraveSearchService {
  private apiKey: string
  private baseUrl = 'https://api.search.brave.com/res/v1'
  private cache: Map<string, CacheEntry> = new Map()
  private cacheExpirationMs = 60 * 60 * 1000 // 1 hour
  private rateLimitDelay = 1000 // 1 second between requests
  private lastRequestTime = 0

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getCacheKey(query: string): string {
    return query.toLowerCase().trim()
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheExpirationMs
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest))
    }
    this.lastRequestTime = Date.now()
  }

  async searchAncestry(query: string, ancestry?: string): Promise<BraveSearchResult[]> {
    const enhancedQuery = ancestry 
      ? `${ancestry} ancestry ${query}` 
      : query

    // Check cache first
    const cacheKey = this.getCacheKey(enhancedQuery)
    const cachedEntry = this.cache.get(cacheKey)
    if (cachedEntry && this.isCacheValid(cachedEntry)) {
      return cachedEntry.data
    }

    try {
      // Enforce rate limiting
      await this.enforceRateLimit()

      const response = await fetch(`${this.baseUrl}/web/search?q=${encodeURIComponent(enhancedQuery)}&count=10`, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': this.apiKey
        }
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        throw new Error(`Brave Search API error: ${response.statusText}`)
      }

      const data: BraveSearchResponse = await response.json()
      const results = data.web?.results || []

      // Cache the results
      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      })

      return results
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

  // New method 1: Search ancestry history
  async searchAncestryHistory(ancestry: string): Promise<BraveSearchResult[]> {
    const queries = [
      `${ancestry} ancestry historical timeline events`,
      `${ancestry} people history origins civilization`,
      `${ancestry} ancient history archaeological evidence`
    ]

    try {
      const results = await Promise.all(
        queries.map(q => this.searchAncestry(q))
      )

      // Flatten and deduplicate results
      const allResults = results.flat()
      const uniqueResults = Array.from(
        new Map(allResults.map(r => [r.url, r])).values()
      )

      // Sort by relevance (results from multiple queries rank higher)
      const urlCounts = new Map<string, number>()
      allResults.forEach(r => {
        urlCounts.set(r.url, (urlCounts.get(r.url) || 0) + 1)
      })

      return uniqueResults.sort((a, b) => 
        (urlCounts.get(b.url) || 0) - (urlCounts.get(a.url) || 0)
      )
    } catch (error) {
      console.error(`Error searching ancestry history for ${ancestry}:`, error)
      throw error
    }
  }

  // New method 2: Search genetic traits
  async searchGeneticTraits(ancestry: string): Promise<BraveSearchResult[]> {
    const queries = [
      `${ancestry} genetic traits characteristics phenotypes`,
      `${ancestry} DNA health predispositions diseases`,
      `${ancestry} ancestry genetic markers haplogroups`,
      `${ancestry} population genetics studies research`
    ]

    try {
      const results = await Promise.all(
        queries.map(q => this.searchAncestry(q))
      )

      const allResults = results.flat()
      const uniqueResults = Array.from(
        new Map(allResults.map(r => [r.url, r])).values()
      )

      return uniqueResults
    } catch (error) {
      console.error(`Error searching genetic traits for ${ancestry}:`, error)
      throw error
    }
  }

  // New method 3: Search migration patterns
  async searchMigrationPatterns(ancestry: string): Promise<BraveSearchResult[]> {
    const queries = [
      `${ancestry} migration patterns routes history`,
      `${ancestry} diaspora movement population spread`,
      `${ancestry} ancestry geographic distribution maps`,
      `${ancestry} historical migration waves timeline`
    ]

    try {
      const results = await Promise.all(
        queries.map(q => this.searchAncestry(q))
      )

      const allResults = results.flat()
      const uniqueResults = Array.from(
        new Map(allResults.map(r => [r.url, r])).values()
      )

      return uniqueResults
    } catch (error) {
      console.error(`Error searching migration patterns for ${ancestry}:`, error)
      throw error
    }
  }

  // New method 4: Search cultural information
  async searchCulturalInfo(ancestry: string): Promise<BraveSearchResult[]> {
    const queries = [
      `${ancestry} culture traditions customs practices`,
      `${ancestry} traditional food cuisine recipes`,
      `${ancestry} language dialects linguistic heritage`,
      `${ancestry} music art dance cultural expressions`,
      `${ancestry} festivals celebrations cultural events`
    ]

    try {
      const results = await Promise.all(
        queries.map(q => this.searchAncestry(q))
      )

      const allResults = results.flat()
      const uniqueResults = Array.from(
        new Map(allResults.map(r => [r.url, r])).values()
      )

      return uniqueResults
    } catch (error) {
      console.error(`Error searching cultural info for ${ancestry}:`, error)
      throw error
    }
  }

  // New method 5: Search famous people
  async searchFamousPeople(ancestry: string): Promise<BraveSearchResult[]> {
    const queries = [
      `famous ${ancestry} people historical figures leaders`,
      `notable ${ancestry} scientists inventors innovators`,
      `${ancestry} artists writers musicians celebrities`,
      `${ancestry} ancestry prominent individuals achievements`
    ]

    try {
      const results = await Promise.all(
        queries.map(q => this.searchAncestry(q))
      )

      const allResults = results.flat()
      const uniqueResults = Array.from(
        new Map(allResults.map(r => [r.url, r])).values()
      )

      return uniqueResults
    } catch (error) {
      console.error(`Error searching famous people for ${ancestry}:`, error)
      throw error
    }
  }

  // Utility method to clear expired cache entries
  clearExpiredCache(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isCacheValid(entry)) {
        this.cache.delete(key)
      }
    }
  }

  // Utility method to clear all cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: string[] } {
    this.clearExpiredCache()
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}