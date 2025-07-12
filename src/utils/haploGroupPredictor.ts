// Haplogroup prediction based on ancestry composition

export interface HaplogroupPrediction {
  haplogroup: string;
  probability: number;
  description: string;
  origin: string;
  age: number; // years ago
  migrationPath: Array<{
    location: string;
    coordinates: [number, number]; // [longitude, latitude]
    yearsAgo: number;
  }>;
}

export interface HaplogroupData {
  yDNA: HaplogroupPrediction[];
  mtDNA: HaplogroupPrediction[];
}

// Y-DNA haplogroups data
const yDNAHaplogroups: Record<string, Omit<HaplogroupPrediction, 'probability'>> = {
  'R1b': {
    haplogroup: 'R1b',
    description: 'Most common in Western Europe, associated with Indo-European expansion',
    origin: 'Western Asia',
    age: 25000,
    migrationPath: [
      { location: 'Central Asia', coordinates: [70, 45], yearsAgo: 25000 },
      { location: 'Eastern Europe', coordinates: [35, 50], yearsAgo: 20000 },
      { location: 'Central Europe', coordinates: [15, 50], yearsAgo: 15000 },
      { location: 'Western Europe', coordinates: [-5, 45], yearsAgo: 10000 }
    ]
  },
  'R1a': {
    haplogroup: 'R1a',
    description: 'Common in Eastern Europe, Central Asia, and South Asia',
    origin: 'Eurasian Steppes',
    age: 22000,
    migrationPath: [
      { location: 'Central Asia', coordinates: [70, 45], yearsAgo: 22000 },
      { location: 'Eastern Europe', coordinates: [40, 55], yearsAgo: 18000 },
      { location: 'Scandinavia', coordinates: [15, 60], yearsAgo: 12000 },
      { location: 'South Asia', coordinates: [75, 25], yearsAgo: 10000 }
    ]
  },
  'J2': {
    haplogroup: 'J2',
    description: 'Associated with spread of agriculture from Fertile Crescent',
    origin: 'Mesopotamia',
    age: 30000,
    migrationPath: [
      { location: 'Mesopotamia', coordinates: [44, 33], yearsAgo: 30000 },
      { location: 'Anatolia', coordinates: [35, 39], yearsAgo: 25000 },
      { location: 'Greece', coordinates: [22, 39], yearsAgo: 20000 },
      { location: 'Italy', coordinates: [12, 42], yearsAgo: 15000 }
    ]
  },
  'I1': {
    haplogroup: 'I1',
    description: 'Nordic/Germanic, associated with ancient Scandinavians',
    origin: 'Northern Europe',
    age: 28000,
    migrationPath: [
      { location: 'Balkans', coordinates: [20, 45], yearsAgo: 28000 },
      { location: 'Central Europe', coordinates: [15, 50], yearsAgo: 20000 },
      { location: 'Scandinavia', coordinates: [10, 60], yearsAgo: 15000 },
      { location: 'Britain', coordinates: [-2, 54], yearsAgo: 10000 }
    ]
  },
  'G2a': {
    haplogroup: 'G2a',
    description: 'Early European farmers, spread with Neolithic agriculture',
    origin: 'Caucasus',
    age: 30000,
    migrationPath: [
      { location: 'Caucasus', coordinates: [45, 42], yearsAgo: 30000 },
      { location: 'Anatolia', coordinates: [35, 39], yearsAgo: 25000 },
      { location: 'Greece', coordinates: [22, 39], yearsAgo: 20000 },
      { location: 'Central Europe', coordinates: [15, 48], yearsAgo: 15000 }
    ]
  },
  'E1b1b': {
    haplogroup: 'E1b1b',
    description: 'Common in North Africa, Horn of Africa, and Mediterranean',
    origin: 'Northeast Africa',
    age: 35000,
    migrationPath: [
      { location: 'East Africa', coordinates: [35, 5], yearsAgo: 35000 },
      { location: 'North Africa', coordinates: [10, 30], yearsAgo: 25000 },
      { location: 'Mediterranean', coordinates: [15, 35], yearsAgo: 15000 },
      { location: 'Balkans', coordinates: [20, 42], yearsAgo: 10000 }
    ]
  },
  'Q': {
    haplogroup: 'Q',
    description: 'Native American paternal lineage',
    origin: 'Central Asia',
    age: 35000,
    migrationPath: [
      { location: 'Central Asia', coordinates: [70, 45], yearsAgo: 35000 },
      { location: 'Siberia', coordinates: [100, 60], yearsAgo: 25000 },
      { location: 'Beringia', coordinates: [-150, 65], yearsAgo: 20000 },
      { location: 'Americas', coordinates: [-100, 45], yearsAgo: 15000 }
    ]
  },
  'O': {
    haplogroup: 'O',
    description: 'Dominant in East and Southeast Asia',
    origin: 'East Asia',
    age: 40000,
    migrationPath: [
      { location: 'Southeast Asia', coordinates: [105, 15], yearsAgo: 40000 },
      { location: 'Southern China', coordinates: [110, 25], yearsAgo: 30000 },
      { location: 'Northern China', coordinates: [115, 40], yearsAgo: 20000 },
      { location: 'Japan/Korea', coordinates: [130, 37], yearsAgo: 15000 }
    ]
  }
};

// mtDNA haplogroups data
const mtDNAHaplogroups: Record<string, Omit<HaplogroupPrediction, 'probability'>> = {
  'H': {
    haplogroup: 'H',
    description: 'Most common European maternal lineage',
    origin: 'Near East',
    age: 25000,
    migrationPath: [
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 25000 },
      { location: 'Anatolia', coordinates: [35, 39], yearsAgo: 20000 },
      { location: 'Europe', coordinates: [15, 50], yearsAgo: 15000 },
      { location: 'Western Europe', coordinates: [-5, 45], yearsAgo: 10000 }
    ]
  },
  'U': {
    haplogroup: 'U',
    description: 'Ancient European hunter-gatherer lineage',
    origin: 'Near East',
    age: 55000,
    migrationPath: [
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 55000 },
      { location: 'Europe', coordinates: [25, 45], yearsAgo: 45000 },
      { location: 'Northern Europe', coordinates: [15, 55], yearsAgo: 35000 },
      { location: 'Scandinavia', coordinates: [10, 60], yearsAgo: 25000 }
    ]
  },
  'K': {
    haplogroup: 'K',
    description: 'Important in European and Near Eastern populations',
    origin: 'Near East',
    age: 35000,
    migrationPath: [
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 35000 },
      { location: 'Anatolia', coordinates: [35, 39], yearsAgo: 30000 },
      { location: 'Europe', coordinates: [20, 45], yearsAgo: 25000 },
      { location: 'Northern Europe', coordinates: [15, 55], yearsAgo: 20000 }
    ]
  },
  'J': {
    haplogroup: 'J',
    description: 'Associated with spread of agriculture from Near East',
    origin: 'Near East',
    age: 45000,
    migrationPath: [
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 45000 },
      { location: 'Anatolia', coordinates: [35, 39], yearsAgo: 35000 },
      { location: 'Europe', coordinates: [20, 45], yearsAgo: 25000 },
      { location: 'Northern Europe', coordinates: [10, 55], yearsAgo: 15000 }
    ]
  },
  'T': {
    haplogroup: 'T',
    description: 'Found across Europe, Near East, and North Africa',
    origin: 'Mesopotamia',
    age: 30000,
    migrationPath: [
      { location: 'Mesopotamia', coordinates: [44, 33], yearsAgo: 30000 },
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 25000 },
      { location: 'Europe', coordinates: [20, 45], yearsAgo: 20000 },
      { location: 'North Africa', coordinates: [10, 30], yearsAgo: 15000 }
    ]
  },
  'L3': {
    haplogroup: 'L3',
    description: 'African lineage, ancestor of all non-African mtDNA',
    origin: 'East Africa',
    age: 70000,
    migrationPath: [
      { location: 'East Africa', coordinates: [35, 5], yearsAgo: 70000 },
      { location: 'Northeast Africa', coordinates: [35, 15], yearsAgo: 60000 },
      { location: 'Arabian Peninsula', coordinates: [45, 20], yearsAgo: 50000 },
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 45000 }
    ]
  },
  'M': {
    haplogroup: 'M',
    description: 'Major Asian maternal lineage',
    origin: 'South Asia',
    age: 60000,
    migrationPath: [
      { location: 'Africa', coordinates: [35, 5], yearsAgo: 60000 },
      { location: 'Arabian Peninsula', coordinates: [50, 20], yearsAgo: 55000 },
      { location: 'South Asia', coordinates: [75, 20], yearsAgo: 50000 },
      { location: 'East Asia', coordinates: [110, 30], yearsAgo: 40000 }
    ]
  },
  'N': {
    haplogroup: 'N',
    description: 'Ancestor of many European and Asian lineages',
    origin: 'Near East',
    age: 65000,
    migrationPath: [
      { location: 'Africa', coordinates: [35, 5], yearsAgo: 65000 },
      { location: 'Near East', coordinates: [35, 35], yearsAgo: 55000 },
      { location: 'Central Asia', coordinates: [70, 45], yearsAgo: 45000 },
      { location: 'Europe/Asia', coordinates: [50, 50], yearsAgo: 35000 }
    ]
  },
  'A': {
    haplogroup: 'A',
    description: 'Native American and East Asian maternal lineage',
    origin: 'East Asia',
    age: 30000,
    migrationPath: [
      { location: 'East Asia', coordinates: [110, 35], yearsAgo: 30000 },
      { location: 'Siberia', coordinates: [100, 60], yearsAgo: 25000 },
      { location: 'Beringia', coordinates: [-150, 65], yearsAgo: 20000 },
      { location: 'Americas', coordinates: [-100, 45], yearsAgo: 15000 }
    ]
  }
};

// Ancestry to haplogroup mapping probabilities
const ancestryToYDNA: Record<string, Array<{ haplogroup: string; weight: number }>> = {
  'British & Irish': [
    { haplogroup: 'R1b', weight: 0.7 },
    { haplogroup: 'I1', weight: 0.15 },
    { haplogroup: 'R1a', weight: 0.05 },
    { haplogroup: 'G2a', weight: 0.05 },
    { haplogroup: 'J2', weight: 0.05 }
  ],
  'French & German': [
    { haplogroup: 'R1b', weight: 0.5 },
    { haplogroup: 'I1', weight: 0.2 },
    { haplogroup: 'R1a', weight: 0.15 },
    { haplogroup: 'G2a', weight: 0.1 },
    { haplogroup: 'J2', weight: 0.05 }
  ],
  'Scandinavian': [
    { haplogroup: 'I1', weight: 0.4 },
    { haplogroup: 'R1b', weight: 0.3 },
    { haplogroup: 'R1a', weight: 0.2 },
    { haplogroup: 'N1c', weight: 0.1 }
  ],
  'Eastern European': [
    { haplogroup: 'R1a', weight: 0.5 },
    { haplogroup: 'I2', weight: 0.2 },
    { haplogroup: 'R1b', weight: 0.15 },
    { haplogroup: 'N1c', weight: 0.1 },
    { haplogroup: 'J2', weight: 0.05 }
  ],
  'Southern European': [
    { haplogroup: 'J2', weight: 0.3 },
    { haplogroup: 'R1b', weight: 0.25 },
    { haplogroup: 'E1b1b', weight: 0.2 },
    { haplogroup: 'G2a', weight: 0.15 },
    { haplogroup: 'I2', weight: 0.1 }
  ],
  'Ashkenazi Jewish': [
    { haplogroup: 'J2', weight: 0.25 },
    { haplogroup: 'J1', weight: 0.2 },
    { haplogroup: 'E1b1b', weight: 0.2 },
    { haplogroup: 'R1a', weight: 0.15 },
    { haplogroup: 'R1b', weight: 0.1 },
    { haplogroup: 'G2a', weight: 0.1 }
  ],
  'Middle Eastern': [
    { haplogroup: 'J1', weight: 0.35 },
    { haplogroup: 'J2', weight: 0.3 },
    { haplogroup: 'E1b1b', weight: 0.15 },
    { haplogroup: 'R1a', weight: 0.1 },
    { haplogroup: 'G2a', weight: 0.1 }
  ],
  'North African': [
    { haplogroup: 'E1b1b', weight: 0.5 },
    { haplogroup: 'J1', weight: 0.2 },
    { haplogroup: 'R1b', weight: 0.15 },
    { haplogroup: 'J2', weight: 0.1 },
    { haplogroup: 'A', weight: 0.05 }
  ],
  'Sub-Saharan African': [
    { haplogroup: 'E1b1a', weight: 0.6 },
    { haplogroup: 'A', weight: 0.2 },
    { haplogroup: 'B', weight: 0.15 },
    { haplogroup: 'E1b1b', weight: 0.05 }
  ],
  'East Asian': [
    { haplogroup: 'O', weight: 0.7 },
    { haplogroup: 'C', weight: 0.15 },
    { haplogroup: 'D', weight: 0.1 },
    { haplogroup: 'N', weight: 0.05 }
  ],
  'South Asian': [
    { haplogroup: 'R1a', weight: 0.3 },
    { haplogroup: 'H', weight: 0.25 },
    { haplogroup: 'L', weight: 0.2 },
    { haplogroup: 'J2', weight: 0.15 },
    { haplogroup: 'R2', weight: 0.1 }
  ],
  'Native American': [
    { haplogroup: 'Q', weight: 0.9 },
    { haplogroup: 'C', weight: 0.1 }
  ]
};

const ancestryToMtDNA: Record<string, Array<{ haplogroup: string; weight: number }>> = {
  'British & Irish': [
    { haplogroup: 'H', weight: 0.45 },
    { haplogroup: 'U', weight: 0.15 },
    { haplogroup: 'K', weight: 0.1 },
    { haplogroup: 'J', weight: 0.1 },
    { haplogroup: 'T', weight: 0.1 },
    { haplogroup: 'V', weight: 0.1 }
  ],
  'French & German': [
    { haplogroup: 'H', weight: 0.45 },
    { haplogroup: 'U', weight: 0.15 },
    { haplogroup: 'K', weight: 0.12 },
    { haplogroup: 'J', weight: 0.1 },
    { haplogroup: 'T', weight: 0.1 },
    { haplogroup: 'V', weight: 0.08 }
  ],
  'Scandinavian': [
    { haplogroup: 'H', weight: 0.4 },
    { haplogroup: 'U', weight: 0.2 },
    { haplogroup: 'K', weight: 0.15 },
    { haplogroup: 'J', weight: 0.1 },
    { haplogroup: 'V', weight: 0.1 },
    { haplogroup: 'I', weight: 0.05 }
  ],
  'Eastern European': [
    { haplogroup: 'H', weight: 0.4 },
    { haplogroup: 'U', weight: 0.2 },
    { haplogroup: 'J', weight: 0.15 },
    { haplogroup: 'T', weight: 0.1 },
    { haplogroup: 'K', weight: 0.1 },
    { haplogroup: 'W', weight: 0.05 }
  ],
  'Southern European': [
    { haplogroup: 'H', weight: 0.4 },
    { haplogroup: 'K', weight: 0.15 },
    { haplogroup: 'U', weight: 0.15 },
    { haplogroup: 'J', weight: 0.12 },
    { haplogroup: 'T', weight: 0.1 },
    { haplogroup: 'X', weight: 0.08 }
  ],
  'Ashkenazi Jewish': [
    { haplogroup: 'K', weight: 0.32 },
    { haplogroup: 'H', weight: 0.2 },
    { haplogroup: 'N1b', weight: 0.15 },
    { haplogroup: 'J', weight: 0.15 },
    { haplogroup: 'U', weight: 0.1 },
    { haplogroup: 'T', weight: 0.08 }
  ],
  'Middle Eastern': [
    { haplogroup: 'J', weight: 0.25 },
    { haplogroup: 'U', weight: 0.2 },
    { haplogroup: 'H', weight: 0.15 },
    { haplogroup: 'K', weight: 0.15 },
    { haplogroup: 'T', weight: 0.15 },
    { haplogroup: 'N', weight: 0.1 }
  ],
  'North African': [
    { haplogroup: 'U6', weight: 0.25 },
    { haplogroup: 'M1', weight: 0.2 },
    { haplogroup: 'L3', weight: 0.2 },
    { haplogroup: 'H', weight: 0.15 },
    { haplogroup: 'J', weight: 0.1 },
    { haplogroup: 'T', weight: 0.1 }
  ],
  'Sub-Saharan African': [
    { haplogroup: 'L3', weight: 0.3 },
    { haplogroup: 'L2', weight: 0.25 },
    { haplogroup: 'L1', weight: 0.2 },
    { haplogroup: 'L0', weight: 0.15 },
    { haplogroup: 'L4', weight: 0.1 }
  ],
  'East Asian': [
    { haplogroup: 'M', weight: 0.3 },
    { haplogroup: 'D', weight: 0.25 },
    { haplogroup: 'B', weight: 0.15 },
    { haplogroup: 'A', weight: 0.15 },
    { haplogroup: 'F', weight: 0.15 }
  ],
  'South Asian': [
    { haplogroup: 'M', weight: 0.6 },
    { haplogroup: 'U', weight: 0.15 },
    { haplogroup: 'R', weight: 0.15 },
    { haplogroup: 'N', weight: 0.1 }
  ],
  'Native American': [
    { haplogroup: 'A', weight: 0.3 },
    { haplogroup: 'B', weight: 0.25 },
    { haplogroup: 'C', weight: 0.25 },
    { haplogroup: 'D', weight: 0.15 },
    { haplogroup: 'X', weight: 0.05 }
  ]
};

export function predictHaplogroups(
  ancestryComposition: Record<string, number>,
  gender: 'male' | 'female' | 'unknown'
): HaplogroupData {
  // Calculate Y-DNA predictions (only for males)
  const yDNAPredictions: HaplogroupPrediction[] = [];
  
  if (gender === 'male' || gender === 'unknown') {
    const yDNAScores: Record<string, number> = {};
    
    // Calculate weighted scores for each haplogroup
    for (const [ancestry, percentage] of Object.entries(ancestryComposition)) {
      const mappings = ancestryToYDNA[ancestry] || [];
      for (const { haplogroup, weight } of mappings) {
        yDNAScores[haplogroup] = (yDNAScores[haplogroup] || 0) + (percentage * weight);
      }
    }
    
    // Convert to predictions
    for (const [haplogroup, score] of Object.entries(yDNAScores)) {
      if (score > 0.01 && yDNAHaplogroups[haplogroup]) {
        yDNAPredictions.push({
          ...yDNAHaplogroups[haplogroup],
          probability: Math.min(score, 1)
        });
      }
    }
    
    // Sort by probability
    yDNAPredictions.sort((a, b) => b.probability - a.probability);
  }
  
  // Calculate mtDNA predictions (for everyone)
  const mtDNAScores: Record<string, number> = {};
  
  for (const [ancestry, percentage] of Object.entries(ancestryComposition)) {
    const mappings = ancestryToMtDNA[ancestry] || [];
    for (const { haplogroup, weight } of mappings) {
      mtDNAScores[haplogroup] = (mtDNAScores[haplogroup] || 0) + (percentage * weight);
    }
  }
  
  const mtDNAPredictions: HaplogroupPrediction[] = [];
  for (const [haplogroup, score] of Object.entries(mtDNAScores)) {
    if (score > 0.01 && mtDNAHaplogroups[haplogroup]) {
      mtDNAPredictions.push({
        ...mtDNAHaplogroups[haplogroup],
        probability: Math.min(score, 1)
      });
    }
  }
  
  // Sort by probability
  mtDNAPredictions.sort((a, b) => b.probability - a.probability);
  
  return {
    yDNA: yDNAPredictions,
    mtDNA: mtDNAPredictions
  };
}

// Timeline events for haplogroup evolution
export const haplogroupTimeline = [
  {
    year: -200000,
    event: 'Mitochondrial Eve',
    description: 'Most recent common maternal ancestor of all living humans lived in Africa',
    type: 'mtDNA'
  },
  {
    year: -140000,
    event: 'Y-chromosomal Adam',
    description: 'Most recent common paternal ancestor of all living humans',
    type: 'yDNA'
  },
  {
    year: -70000,
    event: 'Out of Africa',
    description: 'Modern humans begin migrating out of Africa',
    type: 'both'
  },
  {
    year: -50000,
    event: 'European Settlement',
    description: 'First modern humans arrive in Europe',
    type: 'both'
  },
  {
    year: -45000,
    event: 'Asian Expansion',
    description: 'Rapid expansion across Asia',
    type: 'both'
  },
  {
    year: -35000,
    event: 'Aurignacian Culture',
    description: 'Advanced tool-making and art in Europe',
    type: 'both'
  },
  {
    year: -20000,
    event: 'Last Glacial Maximum',
    description: 'Ice age peaks, affecting human migrations',
    type: 'both'
  },
  {
    year: -15000,
    event: 'Americas Settlement',
    description: 'First humans cross Beringia to the Americas',
    type: 'both'
  },
  {
    year: -10000,
    event: 'Neolithic Revolution',
    description: 'Agriculture develops, population expansions',
    type: 'both'
  },
  {
    year: -5000,
    event: 'Bronze Age',
    description: 'Major migrations and cultural changes',
    type: 'both'
  }
];