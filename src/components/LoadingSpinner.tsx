import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Analizando tu imagen..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      {/* Animated brain icon */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className="w-16 h-16 bg-emerald-200 rounded-full opacity-20"></div>
        </div>
        <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 p-4 rounded-full">
          <Brain size={32} className="text-white animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce">
          <Sparkles size={16} />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
        <p className="text-gray-600">
          Procesando imagen con OpenAI Vision...
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};