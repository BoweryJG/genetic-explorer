import { type AncestrySegment } from '../utils/csvParser'

interface ChromosomeVisualizationProps {
  chromosome: string
  segments: AncestrySegment[]
  onSegmentClick?: (segment: AncestrySegment) => void
}

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

// Chromosome lengths in base pairs
const CHROMOSOME_LENGTHS: Record<string, number> = {
  'chr1': 249250621,
  'chr2': 242193529,
  'chr3': 198295559,
  'chr4': 190214555,
  'chr5': 181538259,
  'chr6': 170805979,
  'chr7': 159345973,
  'chr8': 145138636,
  'chr9': 138394717,
  'chr10': 133797422,
  'chr11': 135086622,
  'chr12': 133275309,
  'chr13': 114364328,
  'chr14': 107043718,
  'chr15': 101991189,
  'chr16': 90338345,
  'chr17': 83257441,
  'chr18': 80373285,
  'chr19': 58617616,
  'chr20': 64444167,
  'chr21': 46709983,
  'chr22': 50818468,
  'chrX': 156040895,
  'chrY': 57227415
}

export function ChromosomeVisualization({ 
  chromosome, 
  segments, 
  onSegmentClick 
}: ChromosomeVisualizationProps) {
  const chrLength = CHROMOSOME_LENGTHS[chromosome] || 250000000
  const width = 800
  const height = 100
  const scale = width / chrLength

  // Sort segments by copy number and start position
  const sortedSegments = [...segments].sort((a, b) => {
    if (a.copyNumber !== b.copyNumber) return a.copyNumber - b.copyNumber
    return a.startPoint - b.startPoint
  })

  // Group by copy number
  const copy1Segments = sortedSegments.filter(s => s.copyNumber === 1)
  const copy2Segments = sortedSegments.filter(s => s.copyNumber === 2)

  return (
    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
      <h3 className="text-lg font-semibold mb-2 text-white">{chromosome}</h3>
      
      <svg width={width} height={height} className="w-full">
        {/* Chromosome background */}
        <rect
          x={0}
          y={20}
          width={width}
          height={25}
          fill="rgba(255,255,255,0.1)"
          rx={12}
        />
        <rect
          x={0}
          y={55}
          width={width}
          height={25}
          fill="rgba(255,255,255,0.1)"
          rx={12}
        />

        {/* Copy 1 segments */}
        {copy1Segments.map((segment, idx) => (
          <rect
            key={`${segment.ancestry}-${idx}`}
            x={segment.startPoint * scale}
            y={20}
            width={(segment.endPoint - segment.startPoint) * scale}
            height={25}
            fill={ANCESTRY_COLORS[segment.ancestry] || '#999'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSegmentClick?.(segment)}
          >
            <title>
              {segment.ancestry}
              {'\n'}Start: {segment.startPoint.toLocaleString()}
              {'\n'}End: {segment.endPoint.toLocaleString()}
              {'\n'}Length: {(segment.endPoint - segment.startPoint).toLocaleString()} bp
            </title>
          </rect>
        ))}

        {/* Copy 2 segments */}
        {copy2Segments.map((segment, idx) => (
          <rect
            key={`${segment.ancestry}-${idx}`}
            x={segment.startPoint * scale}
            y={55}
            width={(segment.endPoint - segment.startPoint) * scale}
            height={25}
            fill={ANCESTRY_COLORS[segment.ancestry] || '#999'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSegmentClick?.(segment)}
          >
            <title>
              {segment.ancestry}
              {'\n'}Start: {segment.startPoint.toLocaleString()}
              {'\n'}End: {segment.endPoint.toLocaleString()}
              {'\n'}Length: {(segment.endPoint - segment.startPoint).toLocaleString()} bp
            </title>
          </rect>
        ))}

        {/* Labels */}
        <text x={5} y={15} className="text-xs fill-purple-300">Copy 1</text>
        <text x={5} y={50} className="text-xs fill-purple-300">Copy 2</text>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from(new Set(segments.map(s => s.ancestry))).map(ancestry => (
          <div key={ancestry} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: ANCESTRY_COLORS[ancestry] || '#999' }}
            />
            <span className="text-xs text-purple-300">{ancestry}</span>
          </div>
        ))}
      </div>
    </div>
  )
}