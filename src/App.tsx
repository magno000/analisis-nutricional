import React from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HomePage />
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2025 NutriVision. Análisis nutricional impulsado por inteligencia artificial.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;