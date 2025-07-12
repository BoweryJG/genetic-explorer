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
        <div className="bg-white p-2 border border-gray-200 rounded shadow">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">{payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Ancestry Composition</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => value && value > 2 ? `${name}: ${value}%` : ''}
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

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {chartData.map((item) => (
          <div 
            key={item.name} 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
            onClick={() => onSegmentClick?.(item.name)}
          >
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: ANCESTRY_COLORS[item.name] || '#999' }}
            />
            <span className="flex-1">{item.name}</span>
            <span className="font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}