import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface AncestryPieChartProps {
  data: Record<string, number>
  onSegmentClick?: (ancestry: string) => void
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

export function AncestryPieChart({ data, onSegmentClick }: AncestryPieChartProps) {
  const chartData = Object.entries(data)
    .map(([ancestry, percentage]) => ({
      name: ancestry,
      value: parseFloat(percentage.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md p-3 border border-white/20 rounded-lg shadow-xl">
          <p className="font-semibold text-white">{payload[0].name}</p>
          <p className="text-purple-300">{payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Ancestry Composition</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ value }) => value && value > 2 ? `${value}%` : ''}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={ANCESTRY_COLORS[entry.name] || '#999'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSegmentClick?.(entry.name)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {chartData.map((item) => (
          <div 
            key={item.name} 
            className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => onSegmentClick?.(item.name)}
          >
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: ANCESTRY_COLORS[item.name] || '#999' }}
            />
            <span className="flex-1 text-purple-200">{item.name}</span>
            <span className="font-semibold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}