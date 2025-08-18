import React from 'react';
import { Activity, Target, Zap, TrendingUp, Heart, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface NutritionData {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  confidence?: number;
  glycemicIndex?: number;
  glycemicLoad?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  healthScore?: number;
  diabeticFriendly?: boolean;
  recommendations?: string[];
}

interface NutritionCardProps {
  data: NutritionData;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  // Función para determinar el color del índice glucémico
  const getGlycemicColor = (gi?: number) => {
    if (!gi) return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'N/A' };
    if (gi <= 55) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Bajo' };
    if (gi <= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medio' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Alto' };
  };

  // Función para determinar el color de la carga glucémica
  const getGlycemicLoadColor = (gl?: number) => {
    if (!gl) return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'N/A' };
    if (gl <= 10) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Baja' };
    if (gl <= 20) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Media' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Alta' };
  };

  // Función para determinar el color del score de salud
  const getHealthScoreColor = (score?: number) => {
    if (!score) return { bg: 'bg-gray-100', text: 'text-gray-600' };
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700' };
    if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };

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
  const glycemicColor = getGlycemicColor(data.glycemicIndex);
  const glycemicLoadColor = getGlycemicLoadColor(data.glycemicLoad);
  const healthScoreColor = getHealthScoreColor(data.healthScore);

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de nutrición */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-8 text-white relative">
        <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
          {data.diabeticFriendly !== undefined && (
            <div className="absolute top-4 right-4">
              {data.diabeticFriendly ? (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <CheckCircle size={14} />
                  <span>Apto para diabéticos</span>
                </div>
              ) : (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <AlertTriangle size={14} />
                  <span>Precaución diabéticos</span>
                </div>
              )}
            </div>
          )}
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

      {/* Información para diabéticos */}
      {(data.glycemicIndex !== undefined || data.fiber !== undefined) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 text-white">
            <div className="flex items-center space-x-2">
              <Heart size={20} />
              <h3 className="text-lg font-semibold">Información para Diabéticos</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Índice y Carga Glucémica */}
            <div className="grid md:grid-cols-2 gap-4">
              {data.glycemicIndex !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={16} className="text-blue-600" />
                      <span className="font-medium text-gray-900">Índice Glucémico</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{data.glycemicIndex}</span>
                      <div className={`text-xs px-2 py-1 rounded-full ${glycemicColor.bg} ${glycemicColor.text} inline-block ml-2`}>
                        {glycemicColor.label}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ease-out ${
                        data.glycemicIndex <= 55 ? 'bg-green-500' : 
                        data.glycemicIndex <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(data.glycemicIndex, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {data.glycemicLoad !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target size={16} className="text-purple-600" />
                      <span className="font-medium text-gray-900">Carga Glucémica</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{data.glycemicLoad.toFixed(1)}</span>
                      <div className={`text-xs px-2 py-1 rounded-full ${glycemicLoadColor.bg} ${glycemicLoadColor.text} inline-block ml-2`}>
                        {glycemicLoadColor.label}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ease-out ${
                        data.glycemicLoad <= 10 ? 'bg-green-500' : 
                        data.glycemicLoad <= 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((data.glycemicLoad / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="grid md:grid-cols-3 gap-4">
              {data.fiber !== undefined && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{data.fiber}g</div>
                  <div className="text-sm text-green-600">Fibra</div>
                </div>
              )}
              
              {data.sugar !== undefined && (
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">{data.sugar}g</div>
                  <div className="text-sm text-orange-600">Azúcares</div>
                </div>
              )}
              
              {data.sodium !== undefined && (
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{data.sodium}mg</div>
                  <div className="text-sm text-red-600">Sodio</div>
                </div>
              )}
            </div>

            {/* Score de salud */}
            {data.healthScore !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart size={16} className="text-pink-600" />
                    <span className="font-medium text-gray-900">Puntuación de Salud</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{data.healthScore}/100</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ease-out ${
                      data.healthScore >= 80 ? 'bg-green-500' : 
                      data.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.healthScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
            <div className="flex items-center space-x-2">
              <Info size={20} />
              <h3 className="text-lg font-semibold">Recomendaciones para Diabéticos</h3>
            </div>
          </div>
          
          <div className="p-6">
            <ul className="space-y-3">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="bg-purple-100 text-purple-600 rounded-full p-1 mt-0.5">
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};