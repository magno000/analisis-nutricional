import React from 'react';
import { Utensils, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-lg">
              <Utensils size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                NutriVision
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Análisis nutricional con IA
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-emerald-600">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};