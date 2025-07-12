export interface AncestrySegment {
  ancestry: string
  copyNumber: number
  chromosome: string
  startPoint: number
  endPoint: number
}

export function parseAncestryCSV(csvContent: string): AncestrySegment[] {
  const lines = csvContent.trim().split('\n')
  const segments: AncestrySegment[] = []
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const [ancestry, copy, chromosome, startPoint, endPoint] = line.split(',')
    
    segments.push({
      ancestry: ancestry.trim(),
      copyNumber: parseInt(copy),
      chromosome: chromosome.trim(),
      startPoint: parseInt(startPoint),
      endPoint: parseInt(endPoint)
    })
  }
  
  return segments
}

export function groupByAncestry(segments: AncestrySegment[]): Record<string, AncestrySegment[]> {
  return segments.reduce((acc, segment) => {
    if (!acc[segment.ancestry]) {
      acc[segment.ancestry] = []
    }
    acc[segment.ancestry].push(segment)
    return acc
  }, {} as Record<string, AncestrySegment[]>)
}

export function groupByChromosome(segments: AncestrySegment[]): Record<string, AncestrySegment[]> {
  return segments.reduce((acc, segment) => {
    if (!acc[segment.chromosome]) {
      acc[segment.chromosome] = []
    }
    acc[segment.chromosome].push(segment)
    return acc
  }, {} as Record<string, AncestrySegment[]>)
}

export function calculateAncestryPercentages(segments: AncestrySegment[]): Record<string, number> {
  // Approximate genome size (in base pairs)
  const GENOME_SIZE = 3_000_000_000
  
  const ancestryLengths: Record<string, number> = {}
  
  segments.forEach(segment => {
    const length = segment.endPoint - segment.startPoint
    if (!ancestryLengths[segment.ancestry]) {
      ancestryLengths[segment.ancestry] = 0
    }
    ancestryLengths[segment.ancestry] += length
  })
  
  const percentages: Record<string, number> = {}
  Object.entries(ancestryLengths).forEach(([ancestry, length]) => {
    percentages[ancestry] = (length / GENOME_SIZE) * 100
  })
  
  return percentages
}