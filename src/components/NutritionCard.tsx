import React from 'react';
import { Activity, Target, Zap } from 'lucide-react';

interface NutritionData {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  confidence?: number;
}

interface NutritionCardProps {
  data: NutritionData;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  const macronutrients = [
    {
      name: 'Proteínas',
      value: data.protein,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Activity,
    },
    {
      name: 'Grasas',
      value: data.fat,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: Target,
    },
    {
      name: 'Carbohidratos',
      value: data.carbs,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      icon: Zap,
    },
  ];

  const totalMacros = data.protein + data.fat + data.carbs;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-8 text-white">
        <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
        <div className="flex items-baseline space-x-4">
          <div>
            <span className="text-3xl font-bold">{data.calories}</span>
            <span className="text-emerald-100 ml-1">kcal</span>
          </div>
          <div className="text-emerald-100">
            <span className="font-medium">{data.weight}g</span> total
          </div>
        </div>
      </div>

      {/* Macronutrients */}
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Nutricional
        </h3>
        
        {macronutrients.map((macro) => {
          const percentage = totalMacros > 0 ? (macro.value / totalMacros) * 100 : 0;
          const Icon = macro.icon;
          
          return (
            <div key={macro.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${macro.lightColor}`}>
                    <Icon size={16} className={macro.textColor} />
                  </div>
                  <span className="font-medium text-gray-900">{macro.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {macro.value}g
                  </span>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${macro.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-1">
            <span className="font-medium">Total de macronutrientes:</span> {totalMacros.toFixed(1)}g
          </p>
          <p>
            <span className="font-medium">Densidad calórica:</span>{' '}
            {data.weight > 0 ? (data.calories / data.weight * 100).toFixed(1) : 0} kcal/100g
          </p>
          {data.confidence && (
            <p className="mt-2 text-xs">
              <span className="font-medium">Nivel de confianza:</span>{' '}
              <span className={`
                ${data.confidence >= 0.8 ? 'text-green-600' : 
                  data.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'}
              `}>
                {(data.confidence * 100).toFixed(0)}%
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};