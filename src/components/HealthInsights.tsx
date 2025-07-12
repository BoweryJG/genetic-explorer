import React, { useState } from 'react';
import { 
  Heart, 
  AlertTriangle, 
  Pill, 
  Eye, 
  Dna, 
  Coffee, 
  Milk,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';
import {
  calculateHealthRisks,
  calculateCarrierStatus,
  calculateDrugMetabolism,
  calculatePhysicalTraits,
  calculateBeneficialVariants,
  calculateMetabolicTraits,
  HealthRisk,
  CarrierStatus,
  DrugMetabolism,
  PhysicalTrait,
  BeneficialVariant,
  MetabolicTrait
} from '../utils/healthCalculator';

interface HealthInsightsProps {
  ancestryData: Record<string, number>;
}

export default function HealthInsights({ ancestryData }: HealthInsightsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    disclaimer: true,
    healthRisks: true,
    carrier: false,
    drugMetabolism: false,
    physicalTraits: false,
    beneficial: false,
    metabolic: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate all health insights
  const healthRisks = calculateHealthRisks(ancestryData);
  const carrierStatus = calculateCarrierStatus(ancestryData);
  const drugMetabolism = calculateDrugMetabolism(ancestryData);
  const physicalTraits = calculatePhysicalTraits(ancestryData);
  const beneficialVariants = calculateBeneficialVariants(ancestryData);
  const metabolicTraits = calculateMetabolicTraits(ancestryData);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Average': return 'text-blue-600 bg-blue-50';
      case 'Elevated': return 'text-orange-600 bg-orange-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMetabolismColor = (metabolism: string) => {
    switch (metabolism) {
      case 'Poor': return 'text-red-600 bg-red-50';
      case 'Intermediate': return 'text-orange-600 bg-orange-50';
      case 'Normal': return 'text-green-600 bg-green-50';
      case 'Rapid': return 'text-blue-600 bg-blue-50';
      case 'Ultra-rapid': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Medical Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <button
          onClick={() => toggleSection('disclaimer')}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            <h3 className="font-semibold text-yellow-800">Important Medical Disclaimer</h3>
          </div>
          {expandedSections.disclaimer ? 
            <ChevronUp className="text-yellow-600" size={20} /> : 
            <ChevronDown className="text-yellow-600" size={20} />
          }
        </button>
        {expandedSections.disclaimer && (
          <div className="mt-3 text-sm text-yellow-700">
            <p>
              These predictions are based on population-level genetic studies and ancestry composition. 
              They are <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with a qualified healthcare provider for medical concerns.
            </p>
            <p className="mt-2">
              Genetic health risks are influenced by many factors including lifestyle, environment, 
              and specific genetic variants not captured by ancestry analysis alone.
            </p>
          </div>
        )}
      </div>

      {/* Health Risk Assessment */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('healthRisks')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Health Risk Assessment</h2>
          </div>
          {expandedSections.healthRisks ? 
            <ChevronUp className="text-gray-600" size={20} /> : 
            <ChevronDown className="text-gray-600" size={20} />
          }
        </button>
        
        {expandedSections.healthRisks && (
          <div className="p-6 space-y-4">
            {healthRisks.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{risk.condition}</h3>
                    <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                    {risk.ancestryFactors.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <Info className="text-gray-400" size={14} />
                        <span className="text-xs text-gray-500">
                          Higher in: {risk.ancestryFactors.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk.risk)}`}>
                      {risk.risk}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{risk.percentage}% risk</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carrier Status */}
      {carrierStatus.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('carrier')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Dna className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Carrier Status Predictions</h2>
            </div>
            {expandedSections.carrier ? 
              <ChevronUp className="text-gray-600" size={20} /> : 
              <ChevronDown className="text-gray-600" size={20} />
            }
          </button>
          
          {expandedSections.carrier && (
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Based on your ancestry, you may have an increased likelihood of being a carrier for certain genetic conditions.
              </p>
              {carrierStatus.map((status, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{status.condition}</h3>
                      <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Common in: {status.commonIn.join(', ')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {status.likelihood}%
                      </div>
                      <p className="text-xs text-gray-500">likelihood</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drug Metabolism */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('drugMetabolism')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Pill className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Pharmacogenetics</h2>
          </div>
          {expandedSections.drugMetabolism ? 
            <ChevronUp className="text-gray-600" size={20} /> : 
            <ChevronDown className="text-gray-600" size={20} />
          }
        </button>
        
        {expandedSections.drugMetabolism && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Your ancestry may influence how your body processes certain medications.
            </p>
            {drugMetabolism.map((drug, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{drug.drug}</h3>
                    <p className="text-sm text-gray-600 mt-1">{drug.description}</p>
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      {drug.recommendations}
                    </p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMetabolismColor(drug.metabolism)}`}>
                    {drug.metabolism}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Physical Traits */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('physicalTraits')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Eye className="text-green-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Physical Trait Predictions</h2>
          </div>
          {expandedSections.physicalTraits ? 
            <ChevronUp className="text-gray-600" size={20} /> : 
            <ChevronDown className="text-gray-600" size={20} />
          }
        </button>
        
        {expandedSections.physicalTraits && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {physicalTraits.map((trait, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{trait.trait}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-medium text-green-600">{trait.prediction}</span>
                  <span className="text-sm text-gray-500">{trait.confidence}% confidence</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{trait.description}</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${trait.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Beneficial Variants */}
      {beneficialVariants.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('beneficial')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="text-teal-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Beneficial Genetic Variants</h2>
            </div>
            {expandedSections.beneficial ? 
              <ChevronUp className="text-gray-600" size={20} /> : 
              <ChevronDown className="text-gray-600" size={20} />
            }
          </button>
          
          {expandedSections.beneficial && (
            <div className="p-6 space-y-4">
              {beneficialVariants.map((variant, index) => (
                <div key={index} className="border border-teal-200 bg-teal-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{variant.variant}</h3>
                      <p className="text-sm font-medium text-teal-700 mt-1">{variant.benefit}</p>
                      <p className="text-sm text-gray-600 mt-2">{variant.description}</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="text-teal-600 mb-1" size={20} />
                      <p className="text-sm font-medium text-teal-600">{variant.likelihood}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Metabolic Traits */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleSection('metabolic')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Activity className="text-orange-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Metabolic Traits</h2>
          </div>
          {expandedSections.metabolic ? 
            <ChevronUp className="text-gray-600" size={20} /> : 
            <ChevronDown className="text-gray-600" size={20} />
          }
        </button>
        
        {expandedSections.metabolic && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {metabolicTraits.map((trait, index) => {
              const icon = trait.trait.includes('Lactose') ? Milk : 
                          trait.trait.includes('Caffeine') ? Coffee : 
                          Activity;
              const IconComponent = icon;
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className="text-orange-600 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{trait.trait}</h3>
                      <p className="text-lg font-medium text-orange-600 mt-1">{trait.status}</p>
                      <p className="text-sm text-gray-600 mt-2">{trait.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${trait.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{trait.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="text-blue-600 mt-0.5" size={16} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About These Predictions</p>
            <p>
              These health insights are calculated based on population-level genetic studies and your ancestry composition. 
              Individual results may vary significantly based on specific genetic variants, lifestyle factors, and environmental influences.
            </p>
            <p className="mt-2">
              For personalized genetic health information, consider clinical genetic testing and consultation with a genetic counselor or healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}