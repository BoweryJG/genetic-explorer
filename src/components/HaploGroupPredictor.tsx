import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, MapPin, Clock, Dna, Users, Globe2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  Line,
  ZoomableGroup
} from 'react-simple-maps';
import { scaleTime } from 'd3-scale';
import { 
  predictHaplogroups, 
  haplogroupTimeline, 
  HaplogroupPrediction,
  HaplogroupData 
} from '@/utils/haploGroupPredictor';

interface HaploGroupPredictorProps {
  ancestryData: Record<string, number>;
  gender?: 'male' | 'female' | 'unknown';
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HaploGroupPredictor: React.FC<HaploGroupPredictorProps> = ({ 
  ancestryData, 
  gender = 'unknown' 
}) => {
  const [predictions, setPredictions] = useState<HaplogroupData | null>(null);
  const [selectedHaplogroup, setSelectedHaplogroup] = useState<HaplogroupPrediction | null>(null);
  const [activeTab, setActiveTab] = useState(gender === 'female' ? 'mtDNA' : 'yDNA');

  useEffect(() => {
    const haplogroups = predictHaplogroups(ancestryData, gender);
    setPredictions(haplogroups);
    
    // Set initial selected haplogroup
    if (haplogroups) {
      if (activeTab === 'yDNA' && haplogroups.yDNA.length > 0) {
        setSelectedHaplogroup(haplogroups.yDNA[0]);
      } else if (activeTab === 'mtDNA' && haplogroups.mtDNA.length > 0) {
        setSelectedHaplogroup(haplogroups.mtDNA[0]);
      }
    }
  }, [ancestryData, gender, activeTab]);

  const getColorForAge = (yearsAgo: number) => {
    const maxAge = 70000;
    const ratio = yearsAgo / maxAge;
    return `hsl(${280 - ratio * 280}, 70%, 50%)`;
  };

  const TimelineComponent = () => {
    const currentYear = new Date().getFullYear();
    const timeScale = scaleTime()
      .domain([-200000, currentYear])
      .range([0, 100]);

    return (
      <div className="relative h-32 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg opacity-20" />
        
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2" />
        
        {/* Timeline events */}
        {haplogroupTimeline.map((event, index) => {
          const position = timeScale(event.year);
          const isRelevant = event.type === 'both' || event.type === activeTab;
          
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      isRelevant ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ left: `${position}%`, top: '50%' }}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      isRelevant ? 'bg-blue-500' : 'bg-gray-400'
                    } border-2 border-white shadow-md`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <p className="font-semibold">{event.event}</p>
                    <p className="text-sm text-gray-600">{Math.abs(event.year).toLocaleString()} years ago</p>
                    <p className="text-xs mt-1">{event.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        
        {/* Labels */}
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">200,000 BCE</div>
        <div className="absolute -bottom-6 right-0 text-xs text-gray-500">Present</div>
      </div>
    );
  };

  const MigrationMap = ({ haplogroup }: { haplogroup: HaplogroupPrediction }) => {
    return (
      <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
        <ComposableMap projection="geoNaturalEarth1">
          <ZoomableGroup zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E5E7EB"
                    stroke="#D1D5DB"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>
            
            {/* Migration path */}
            {haplogroup.migrationPath.length > 1 && (
              <>
                {/* Draw lines between points */}
                {haplogroup.migrationPath.slice(0, -1).map((point, index) => {
                  const nextPoint = haplogroup.migrationPath[index + 1];
                  return (
                    <Line
                      key={`line-${index}`}
                      from={point.coordinates}
                      to={nextPoint.coordinates}
                      stroke={getColorForAge(point.yearsAgo)}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeOpacity={0.8}
                    />
                  );
                })}
                
                {/* Draw markers */}
                {haplogroup.migrationPath.map((point, index) => (
                  <Marker key={`marker-${index}`} coordinates={point.coordinates}>
                    <circle
                      r={6}
                      fill={getColorForAge(point.yearsAgo)}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{ 
                        fontSize: '12px', 
                        fill: '#374151',
                        fontWeight: 'bold'
                      }}
                    >
                      {point.location}
                    </text>
                  </Marker>
                ))}
              </>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  };

  const HaplogroupCard = ({ 
    haplogroup, 
    type 
  }: { 
    haplogroup: HaplogroupPrediction; 
    type: 'yDNA' | 'mtDNA' 
  }) => {
    const isSelected = selectedHaplogroup?.haplogroup === haplogroup.haplogroup;
    
    return (
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => setSelectedHaplogroup(haplogroup)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-lg font-semibold flex items-center gap-2">
                {haplogroup.haplogroup}
                <Badge variant="outline" className="text-xs">
                  {type === 'yDNA' ? 'Paternal' : 'Maternal'}
                </Badge>
              </h4>
              <p className="text-sm text-gray-600 mt-1">{haplogroup.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {(haplogroup.probability * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500">probability</p>
            </div>
          </div>
          
          <Progress 
            value={haplogroup.probability * 100} 
            className="h-2 mb-3"
          />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Origin: {haplogroup.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{haplogroup.age.toLocaleString()} years ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!predictions) {
    return <div>Loading predictions...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="h-6 w-6" />
          Deep Ancestry & Haplogroup Analysis
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Haplogroups are genetic populations that share a common ancestor. Y-DNA traces your direct paternal line, while mtDNA traces your direct maternal line.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Human Migration Timeline
          </h3>
          <TimelineComponent />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="yDNA" 
              disabled={gender === 'female'}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Paternal Line (Y-DNA)
            </TabsTrigger>
            <TabsTrigger value="mtDNA" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Maternal Line (mtDNA)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="yDNA" className="mt-6">
            {gender === 'female' ? (
              <div className="text-center py-8 text-gray-500">
                <Dna className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Y-DNA analysis is only available for biological males</p>
                <p className="text-sm mt-2">Y-chromosomes are passed from father to son</p>
              </div>
            ) : predictions.yDNA.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {predictions.yDNA.slice(0, 3).map((haplogroup) => (
                    <HaplogroupCard 
                      key={haplogroup.haplogroup} 
                      haplogroup={haplogroup} 
                      type="yDNA"
                    />
                  ))}
                </div>
                
                {selectedHaplogroup && activeTab === 'yDNA' && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Globe2 className="h-5 w-5" />
                      Migration Path for {selectedHaplogroup.haplogroup}
                    </h3>
                    <MigrationMap haplogroup={selectedHaplogroup} />
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedHaplogroup.migrationPath.map((point, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-4 h-4 rounded-full mx-auto mb-1"
                            style={{ backgroundColor: getColorForAge(point.yearsAgo) }}
                          />
                          <p className="text-sm font-medium">{point.location}</p>
                          <p className="text-xs text-gray-500">
                            {point.yearsAgo.toLocaleString()} years ago
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No Y-DNA predictions available for your ancestry composition
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="mtDNA" className="mt-6">
            {predictions.mtDNA.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {predictions.mtDNA.slice(0, 3).map((haplogroup) => (
                    <HaplogroupCard 
                      key={haplogroup.haplogroup} 
                      haplogroup={haplogroup} 
                      type="mtDNA"
                    />
                  ))}
                </div>
                
                {selectedHaplogroup && activeTab === 'mtDNA' && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Globe2 className="h-5 w-5" />
                      Migration Path for {selectedHaplogroup.haplogroup}
                    </h3>
                    <MigrationMap haplogroup={selectedHaplogroup} />
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedHaplogroup.migrationPath.map((point, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-4 h-4 rounded-full mx-auto mb-1"
                            style={{ backgroundColor: getColorForAge(point.yearsAgo) }}
                          />
                          <p className="text-sm font-medium">{point.location}</p>
                          <p className="text-xs text-gray-500">
                            {point.yearsAgo.toLocaleString()} years ago
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No mtDNA predictions available for your ancestry composition
              </p>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Educational Information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Understanding Your Deep Ancestry
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              • Haplogroups represent branches of the human family tree defined by genetic markers
            </p>
            <p>
              • Y-DNA follows your father's father's father's line back thousands of years
            </p>
            <p>
              • mtDNA follows your mother's mother's mother's line back to "Mitochondrial Eve"
            </p>
            <p>
              • These predictions are based on population genetics and your ancestry composition
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HaploGroupPredictor;