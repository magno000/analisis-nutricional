import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { LoadingSpinner } from './LoadingSpinner';
import { NutritionCard } from './NutritionCard';
import { Search, ArrowLeft, Camera, Lightbulb, Utensils } from 'lucide-react';
import { nutritionAnalyzer } from '../utils/nutritionAnalyzer';

interface NutritionData {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export const HomePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setNutritionData(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setNutritionData(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // CORREGIDO: Usar el nutritionAnalyzer real - REMOVIDO TODO EL CÓDIGO SIMULADO
      console.log('🔍 Iniciando análisis de imagen...', selectedImage.name);
      const result = await nutritionAnalyzer.analyzeImage(selectedImage);
      console.log('✅ Análisis completado:', result);
      setNutritionData(result);
    } catch (error) {
      console.error('❌ Error en análisis:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al analizar la imagen');
    } finally {
      setIsAnalyzing(false);
    }
    
    // ELIMINADO COMPLETAMENTE: Ya no hay código simulado aquí
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setNutritionData(null);
    setIsAnalyzing(false);
    setError(null);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <LoadingSpinner message="Analizando los valores nutricionales..." />
      </div>
    );
  }

  if (nutritionData && selectedImage) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handleNewAnalysis}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Analizar nueva imagen</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Imagen Analizada
            </h3>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Comida analizada"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div>
            <NutritionCard data={nutritionData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Identifica tu Comida y sus{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Valores Nutricionales
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Usa inteligencia artificial para analizar cualquier plato y obtener 
          información nutricional detallada al instante
        </p>
      </div>

      {/* NUEVO: Mostrar errores si los hay */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="text-red-600 font-medium">Error:</div>
              <div className="ml-2 text-red-700">{error}</div>
            </div>
            {/* NUEVO: Mostrar información de debug */}
            <div className="mt-2 text-xs text-red-600">
              <p>💡 Posibles causas:</p>
              <ul className="ml-4 list-disc">
                <li>Variables de entorno de Supabase no configuradas</li>
                <li>Función Edge de Supabase no desplegada</li>
                <li>API Key de OpenAI no configurada</li>
              </ul>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline self-start"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* NUEVO: Estado de configuración */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Lightbulb size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Estado de Configuración</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}</p>
              <p>• Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
            </div>
            {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
              <div className="mt-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                <p>⚠️ Necesitas configurar las variables de entorno en tu archivo .env</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Lightbulb size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Consejos para mejores resultados
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Toma la foto desde arriba para ver todos los ingredientes</li>
              <li>• Asegúrate de que la comida esté bien iluminada</li>
              <li>• Incluye el plato completo en la imagen</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-6">
        <ImageUpload
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          onRemoveImage={handleRemoveImage}
        />

        {selectedImage && (
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <Search size={20} />
              <span>Identificar y Analizar</span>
            </button>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 pt-12">
        {[
          {
            icon: Camera,
            title: 'Análisis Visual',
            description: 'Sube una foto y nuestra IA identificará automáticamente los alimentos',
          },
          {
            icon: Search,
            title: 'Identificación Precisa',
            description: 'Reconocimiento avanzado de platos y ingredientes con alta precisión',
          },
          {
            icon: Utensils,
            title: 'Datos Nutricionales',
            description: 'Información completa de calorías, proteínas, grasas y carbohidratos',
          },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-gradient-to-r from-emerald-100 to-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Icon size={24} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
