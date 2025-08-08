import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { LoadingSpinner } from './LoadingSpinner';
import { NutritionCard } from './NutritionCard';
import { nutritionAnalyzer } from '../utils/nutritionAnalyzer';
import { Search, ArrowLeft, Camera, Lightbulb, Utensils } from 'lucide-react';

interface NutritionData {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  confidence?: number;
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
      const result = await nutritionAnalyzer.analyzeImage(selectedImage);
      setNutritionData(result);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al analizar la imagen');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setNutritionData(null);
    setError(null);
    setIsAnalyzing(false);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <LoadingSpinner message="Analizando la imagen con inteligencia artificial..." />
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Search size={16} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Error en el análisis
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium mt-2 underline"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        )}

        <ImageUpload
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          onRemoveImage={handleRemoveImage}
        />

        {selectedImage && (
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <Search size={20} />
              <span>Analizar con IA</span>
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