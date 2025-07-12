export interface HealthRisk {
  condition: string;
  risk: 'Low' | 'Average' | 'Elevated' | 'High';
  percentage: number;
  description: string;
  ancestryFactors: string[];
}

export interface CarrierStatus {
  condition: string;
  likelihood: number;
  description: string;
  commonIn: string[];
}

export interface DrugMetabolism {
  drug: string;
  metabolism: 'Poor' | 'Intermediate' | 'Normal' | 'Rapid' | 'Ultra-rapid';
  description: string;
  recommendations: string;
}

export interface PhysicalTrait {
  trait: string;
  prediction: string;
  confidence: number;
  description: string;
}

export interface BeneficialVariant {
  variant: string;
  benefit: string;
  likelihood: number;
  description: string;
}

export interface MetabolicTrait {
  trait: string;
  status: string;
  percentage: number;
  description: string;
}

// Health risk calculations based on ancestry
export const calculateHealthRisks = (ancestry: Record<string, number>): HealthRisk[] => {
  const risks: HealthRisk[] = [];

  // Type 2 Diabetes
  const diabetesRisk = 
    (ancestry['Native American'] || 0) * 0.15 +
    (ancestry['South Asian'] || 0) * 0.12 +
    (ancestry['Pacific Islander'] || 0) * 0.13 +
    (ancestry['African'] || 0) * 0.08 +
    (ancestry['East Asian'] || 0) * 0.07 +
    (ancestry['European'] || 0) * 0.05 +
    (ancestry['Middle Eastern'] || 0) * 0.10;

  risks.push({
    condition: 'Type 2 Diabetes',
    risk: diabetesRisk > 10 ? 'High' : diabetesRisk > 7 ? 'Elevated' : diabetesRisk > 4 ? 'Average' : 'Low',
    percentage: Math.round(diabetesRisk),
    description: 'Risk varies significantly by ancestry, with certain populations having higher genetic predisposition.',
    ancestryFactors: ['Native American', 'South Asian', 'Pacific Islander']
  });

  // Heart Disease
  const heartRisk = 
    (ancestry['South Asian'] || 0) * 0.14 +
    (ancestry['Middle Eastern'] || 0) * 0.10 +
    (ancestry['European'] || 0) * 0.08 +
    (ancestry['African'] || 0) * 0.09 +
    (ancestry['East Asian'] || 0) * 0.05 +
    (ancestry['Native American'] || 0) * 0.07;

  risks.push({
    condition: 'Cardiovascular Disease',
    risk: heartRisk > 10 ? 'High' : heartRisk > 7 ? 'Elevated' : heartRisk > 4 ? 'Average' : 'Low',
    percentage: Math.round(heartRisk),
    description: 'Genetic factors affecting cholesterol metabolism and blood pressure vary by ancestry.',
    ancestryFactors: ['South Asian', 'Middle Eastern']
  });

  // Hypertension
  const hypertensionRisk = 
    (ancestry['African'] || 0) * 0.15 +
    (ancestry['Pacific Islander'] || 0) * 0.10 +
    (ancestry['Native American'] || 0) * 0.08 +
    (ancestry['South Asian'] || 0) * 0.07 +
    (ancestry['European'] || 0) * 0.05;

  risks.push({
    condition: 'Hypertension',
    risk: hypertensionRisk > 10 ? 'High' : hypertensionRisk > 7 ? 'Elevated' : hypertensionRisk > 4 ? 'Average' : 'Low',
    percentage: Math.round(hypertensionRisk),
    description: 'Salt sensitivity and blood pressure regulation genes vary across populations.',
    ancestryFactors: ['African', 'Pacific Islander']
  });

  // Alzheimer's Disease
  const alzheimerRisk = 
    (ancestry['European'] || 0) * 0.10 +
    (ancestry['African'] || 0) * 0.14 +
    (ancestry['East Asian'] || 0) * 0.05 +
    (ancestry['Native American'] || 0) * 0.06;

  risks.push({
    condition: "Alzheimer's Disease",
    risk: alzheimerRisk > 10 ? 'High' : alzheimerRisk > 7 ? 'Elevated' : alzheimerRisk > 4 ? 'Average' : 'Low',
    percentage: Math.round(alzheimerRisk),
    description: 'APOE gene variants that increase risk are more common in certain populations.',
    ancestryFactors: ['African', 'European']
  });

  return risks;
};

// Carrier status predictions
export const calculateCarrierStatus = (ancestry: Record<string, number>): CarrierStatus[] => {
  const carriers: CarrierStatus[] = [];

  // Sickle Cell
  const sickleCellCarrier = (ancestry['African'] || 0) * 0.08 + 
    (ancestry['Mediterranean'] || 0) * 0.02 + 
    (ancestry['Middle Eastern'] || 0) * 0.03;
  
  if (sickleCellCarrier > 1) {
    carriers.push({
      condition: 'Sickle Cell Trait',
      likelihood: Math.round(sickleCellCarrier),
      description: 'Carriers have one copy of the sickle cell gene, providing malaria resistance.',
      commonIn: ['African', 'Mediterranean', 'Middle Eastern']
    });
  }

  // Tay-Sachs
  const taysSachsCarrier = (ancestry['Ashkenazi Jewish'] || 0) * 0.04 + 
    (ancestry['French Canadian'] || 0) * 0.01 + 
    (ancestry['Irish'] || 0) * 0.005;
  
  if (taysSachsCarrier > 0.5) {
    carriers.push({
      condition: 'Tay-Sachs Disease',
      likelihood: Math.round(taysSachsCarrier * 10) / 10,
      description: 'A genetic disorder that progressively destroys nerve cells.',
      commonIn: ['Ashkenazi Jewish', 'French Canadian', 'Irish']
    });
  }

  // Cystic Fibrosis
  const cfCarrier = (ancestry['European'] || 0) * 0.04 + 
    (ancestry['Ashkenazi Jewish'] || 0) * 0.04;
  
  if (cfCarrier > 1) {
    carriers.push({
      condition: 'Cystic Fibrosis',
      likelihood: Math.round(cfCarrier),
      description: 'A genetic disorder affecting the lungs and digestive system.',
      commonIn: ['European', 'Ashkenazi Jewish']
    });
  }

  // Beta Thalassemia
  const thalassemiaCarrier = (ancestry['Mediterranean'] || 0) * 0.05 + 
    (ancestry['Middle Eastern'] || 0) * 0.04 + 
    (ancestry['South Asian'] || 0) * 0.03 +
    (ancestry['Southeast Asian'] || 0) * 0.08;
  
  if (thalassemiaCarrier > 1) {
    carriers.push({
      condition: 'Beta Thalassemia',
      likelihood: Math.round(thalassemiaCarrier),
      description: 'A blood disorder that reduces hemoglobin production.',
      commonIn: ['Mediterranean', 'Middle Eastern', 'Southeast Asian']
    });
  }

  return carriers;
};

// Drug metabolism predictions
export const calculateDrugMetabolism = (ancestry: Record<string, number>): DrugMetabolism[] => {
  const metabolism: DrugMetabolism[] = [];

  // Warfarin metabolism
  const warfarinSlow = (ancestry['East Asian'] || 0) * 0.40 + 
    (ancestry['African'] || 0) * 0.10 + 
    (ancestry['European'] || 0) * 0.30;
  
  metabolism.push({
    drug: 'Warfarin',
    metabolism: warfarinSlow > 30 ? 'Poor' : warfarinSlow > 20 ? 'Intermediate' : 'Normal',
    description: 'Blood thinner dosing varies significantly by genetic factors.',
    recommendations: warfarinSlow > 30 ? 'May require lower doses' : 'Standard dosing likely appropriate'
  });

  // Clopidogrel metabolism
  const clopidogrelPoor = (ancestry['East Asian'] || 0) * 0.15 + 
    (ancestry['Pacific Islander'] || 0) * 0.20 + 
    (ancestry['European'] || 0) * 0.02;
  
  metabolism.push({
    drug: 'Clopidogrel (Plavix)',
    metabolism: clopidogrelPoor > 15 ? 'Poor' : clopidogrelPoor > 5 ? 'Intermediate' : 'Normal',
    description: 'Anti-platelet medication effectiveness varies by CYP2C19 variants.',
    recommendations: clopidogrelPoor > 15 ? 'Alternative medications may be more effective' : 'Standard treatment likely effective'
  });

  // Codeine metabolism
  const codeineUltraRapid = (ancestry['North African'] || 0) * 0.29 + 
    (ancestry['Ethiopian'] || 0) * 0.29 + 
    (ancestry['Middle Eastern'] || 0) * 0.21 +
    (ancestry['European'] || 0) * 0.01;
  
  const codeinePoor = (ancestry['European'] || 0) * 0.10 + 
    (ancestry['African'] || 0) * 0.03;
  
  metabolism.push({
    drug: 'Codeine',
    metabolism: codeineUltraRapid > 20 ? 'Ultra-rapid' : codeinePoor > 7 ? 'Poor' : 'Normal',
    description: 'Pain medication conversion to morphine varies by CYP2D6 activity.',
    recommendations: codeineUltraRapid > 20 ? 'Higher toxicity risk - use alternatives' : 
      codeinePoor > 7 ? 'May be ineffective - use alternatives' : 'Standard dosing appropriate'
  });

  return metabolism;
};

// Physical trait predictions
export const calculatePhysicalTraits = (ancestry: Record<string, number>): PhysicalTrait[] => {
  const traits: PhysicalTrait[] = [];

  // Eye color
  const brownEyes = (ancestry['African'] || 0) * 0.99 + 
    (ancestry['East Asian'] || 0) * 0.99 + 
    (ancestry['South Asian'] || 0) * 0.95 +
    (ancestry['Native American'] || 0) * 0.90 +
    (ancestry['Middle Eastern'] || 0) * 0.85 +
    (ancestry['European'] || 0) * 0.50;
  
  const blueEyes = (ancestry['Northern European'] || ancestry['European'] || 0) * 0.30;
  const greenEyes = (ancestry['European'] || 0) * 0.15;
  
  let eyeColor = 'Brown';
  let confidence = brownEyes;
  
  if (blueEyes > brownEyes && blueEyes > greenEyes) {
    eyeColor = 'Blue';
    confidence = blueEyes;
  } else if (greenEyes > brownEyes && greenEyes > blueEyes) {
    eyeColor = 'Green';
    confidence = greenEyes;
  }
  
  traits.push({
    trait: 'Eye Color',
    prediction: eyeColor,
    confidence: Math.min(Math.round(confidence), 95),
    description: 'Eye color is primarily determined by melanin levels in the iris.'
  });

  // Height
  const tallHeight = (ancestry['Northern European'] || ancestry['European'] || 0) * 0.60 + 
    (ancestry['African'] || 0) * 0.50 + 
    (ancestry['Polynesian'] || ancestry['Pacific Islander'] || 0) * 0.70;
  
  const shortHeight = (ancestry['East Asian'] || 0) * 0.40 + 
    (ancestry['Southeast Asian'] || 0) * 0.50 + 
    (ancestry['Native American'] || 0) * 0.30;
  
  let heightPrediction = 'Average';
  if (tallHeight > 50) heightPrediction = 'Above Average';
  else if (shortHeight > 40) heightPrediction = 'Below Average';
  
  traits.push({
    trait: 'Height',
    prediction: heightPrediction,
    confidence: Math.round(Math.max(tallHeight, shortHeight, 40)),
    description: 'Height is influenced by hundreds of genetic variants and environmental factors.'
  });

  // Hair texture
  const curlyHair = (ancestry['African'] || 0) * 0.90 + 
    (ancestry['Mediterranean'] || 0) * 0.40 + 
    (ancestry['Middle Eastern'] || 0) * 0.50;
  
  const straightHair = (ancestry['East Asian'] || 0) * 0.95 + 
    (ancestry['Native American'] || 0) * 0.90;
  
  let hairTexture = 'Wavy';
  let hairConfidence = 50;
  
  if (curlyHair > 60) {
    hairTexture = 'Curly';
    hairConfidence = curlyHair;
  } else if (straightHair > 60) {
    hairTexture = 'Straight';
    hairConfidence = straightHair;
  }
  
  traits.push({
    trait: 'Hair Texture',
    prediction: hairTexture,
    confidence: Math.round(hairConfidence),
    description: 'Hair texture is determined by the shape of hair follicles.'
  });

  return traits;
};

// Beneficial variants
export const calculateBeneficialVariants = (ancestry: Record<string, number>): BeneficialVariant[] => {
  const variants: BeneficialVariant[] = [];

  // CCR5-Δ32 (HIV resistance)
  const ccr5Delta32 = (ancestry['Northern European'] || ancestry['European'] || 0) * 0.10;
  
  if (ccr5Delta32 > 2) {
    variants.push({
      variant: 'CCR5-Δ32',
      benefit: 'Partial resistance to HIV infection',
      likelihood: Math.round(ccr5Delta32),
      description: 'This variant prevents HIV from entering immune cells.'
    });
  }

  // APOC3 (lower triglycerides)
  const apoc3 = (ancestry['Amish'] || 0) * 0.05 + (ancestry['European'] || 0) * 0.001;
  
  if (apoc3 > 0.1) {
    variants.push({
      variant: 'APOC3 loss-of-function',
      benefit: 'Lower triglycerides and reduced heart disease risk',
      likelihood: Math.round(apoc3 * 10) / 10,
      description: 'Carriers have significantly lower blood fat levels.'
    });
  }

  // High altitude adaptation
  const altitudeAdaptation = (ancestry['Tibetan'] || 0) * 0.90 + 
    (ancestry['Andean'] || ancestry['Native American'] || 0) * 0.30 +
    (ancestry['Ethiopian'] || ancestry['East African'] || 0) * 0.70;
  
  if (altitudeAdaptation > 20) {
    variants.push({
      variant: 'High Altitude Adaptation',
      benefit: 'Enhanced oxygen processing at high elevations',
      likelihood: Math.round(altitudeAdaptation),
      description: 'Genetic adaptations for living at high altitudes.'
    });
  }

  // Malaria resistance (Duffy negative)
  const duffyNegative = (ancestry['West African'] || ancestry['African'] || 0) * 0.95;
  
  if (duffyNegative > 30) {
    variants.push({
      variant: 'Duffy-negative blood group',
      benefit: 'Resistance to Plasmodium vivax malaria',
      likelihood: Math.round(duffyNegative),
      description: 'Complete protection against one type of malaria parasite.'
    });
  }

  return variants;
};

// Metabolic traits
export const calculateMetabolicTraits = (ancestry: Record<string, number>): MetabolicTrait[] => {
  const traits: MetabolicTrait[] = [];

  // Lactose tolerance
  const lactoseTolerance = (ancestry['Northern European'] || ancestry['European'] || 0) * 0.90 + 
    (ancestry['East African'] || 0) * 0.50 + 
    (ancestry['Middle Eastern'] || 0) * 0.60 +
    (ancestry['South Asian'] || 0) * 0.30 +
    (ancestry['East Asian'] || 0) * 0.05 +
    (ancestry['Native American'] || 0) * 0.10;
  
  traits.push({
    trait: 'Lactose Tolerance',
    status: lactoseTolerance > 50 ? 'Likely Tolerant' : 'Likely Intolerant',
    percentage: Math.round(lactoseTolerance),
    description: 'Ability to digest lactose (milk sugar) in adulthood.'
  });

  // Alcohol metabolism
  const alcoholFlush = (ancestry['East Asian'] || 0) * 0.36 + 
    (ancestry['Chinese'] || ancestry['East Asian'] || 0) * 0.40 +
    (ancestry['Japanese'] || ancestry['East Asian'] || 0) * 0.45 +
    (ancestry['Korean'] || ancestry['East Asian'] || 0) * 0.30;
  
  traits.push({
    trait: 'Alcohol Metabolism',
    status: alcoholFlush > 30 ? 'Reduced (Flush Reaction Likely)' : 'Normal',
    percentage: 100 - Math.round(alcoholFlush),
    description: alcoholFlush > 30 ? 
      'ALDH2 variant causes alcohol flush reaction and reduced tolerance.' :
      'Normal alcohol dehydrogenase activity.'
  });

  // Caffeine metabolism
  const caffeineSlow = (ancestry['East Asian'] || 0) * 0.45 + 
    (ancestry['African'] || 0) * 0.25 + 
    (ancestry['European'] || 0) * 0.35;
  
  traits.push({
    trait: 'Caffeine Metabolism',
    status: caffeineSlow > 35 ? 'Slow Metabolizer' : 'Fast Metabolizer',
    percentage: caffeineSlow > 35 ? Math.round(caffeineSlow) : Math.round(100 - caffeineSlow),
    description: caffeineSlow > 35 ? 
      'Caffeine stays in your system longer - consider limiting intake.' :
      'Caffeine is processed quickly by your body.'
  });

  // Bitter taste perception
  const bitterTaste = (ancestry['European'] || 0) * 0.70 + 
    (ancestry['African'] || 0) * 0.80 + 
    (ancestry['Asian'] || ancestry['East Asian'] || 0) * 0.85;
  
  traits.push({
    trait: 'Bitter Taste Perception',
    status: bitterTaste > 70 ? 'Strong Taster' : 'Weak Taster',
    percentage: Math.round(bitterTaste),
    description: 'Ability to taste bitter compounds like those in brussels sprouts and coffee.'
  });

  return traits;
};