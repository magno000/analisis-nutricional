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

export class NutritionAnalyzer {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }
  }

  /**
   * Convierte un archivo de imagen a base64 data URL
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Analiza una imagen de comida y retorna información nutricional
   */
  async analyzeImage(imageFile: File): Promise<NutritionData> {
    try {
      // Validar el archivo
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validar el tamaño del archivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        throw new Error('La imagen es demasiado grande. Máximo 10MB permitido.');
      }

      // Convertir imagen a base64
      const base64Image = await this.fileToBase64(imageFile);

      // Llamar a la función edge de Supabase
      const apiUrl = `${this.supabaseUrl}/functions/v1/analyze-nutrition`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Manejar errores específicos de OpenAI
        if (errorData.errorType === 'quota_exceeded') {
          throw new Error(
            'Sin créditos en OpenAI: Necesitas recargar tu cuenta en platform.openai.com para continuar usando el servicio.'
          );
        }
        
        if (errorData.errorType === 'non_json_response') {
          throw new Error(
            errorData.userMessage || 'El servicio de análisis no pudo procesar la imagen correctamente.'
          );
        }
        
        if (errorData.errorType === 'invalid_response') {
          throw new Error(
            errorData.userMessage || 'Error en el formato de respuesta del servicio.'
          );
        }
        
        if (errorData.errorType === 'openai_error') {
          throw new Error(
            errorData.userMessage || 'Error del servicio de análisis. Inténtalo de nuevo más tarde.'
          );
        }
        
        // Error genérico del servidor
        throw new Error(
          errorData.userMessage || 
          errorData.error || 
          `Error del servidor: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error procesando la respuesta del servidor');
      }

      // Validar los datos recibidos
      const data = result.data;
      if (!data.name || typeof data.calories !== 'number') {
        throw new Error('Datos nutricionales incompletos recibidos del servidor');
      }

      return {
        name: data.name,
        weight: Math.round(data.weight || 0),
        calories: Math.round(data.calories || 0),
        protein: Math.round((data.protein || 0) * 10) / 10, // Redondear a 1 decimal
        fat: Math.round((data.fat || 0) * 10) / 10,
        carbs: Math.round((data.carbs || 0) * 10) / 10,
        confidence: data.confidence || 0,
        glycemicIndex: data.glycemicIndex,
        glycemicLoad: data.glycemicLoad,
        fiber: data.fiber,
        sugar: data.sugar,
        sodium: data.sodium,
        healthScore: data.healthScore,
        diabeticFriendly: data.diabeticFriendly,
        recommendations: data.recommendations || []
      };

    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Proporcionar mensajes de error más específicos
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new Error('Error de conexión. Verifica tu conexión a internet.');
        }
        throw error;
      }
      
      throw new Error('Error desconocido al analizar la imagen');
    }
  }

  /**
   * Verifica si el servicio está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const apiUrl = `${this.supabaseUrl}/functions/v1/analyze-nutrition`;
      const response = await fetch(apiUrl, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instancia singleton para usar en toda la aplicación
export const nutritionAnalyzer = new NutritionAnalyzer();