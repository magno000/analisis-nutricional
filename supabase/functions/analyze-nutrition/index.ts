const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface NutritionAnalysis {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  confidence: number;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obtener la clave de API de OpenAI desde las variables de entorno
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured in environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Preparar el prompt para OpenAI
    const prompt = `Analiza esta imagen de comida y proporciona la siguiente información nutricional en formato JSON exacto:

{
  "name": "Nombre específico del plato o alimentos identificados",
  "weight": número_en_gramos_peso_total_estimado,
  "calories": número_calorías_totales,
  "protein": número_gramos_proteína,
  "fat": número_gramos_grasas,
  "carbs": número_gramos_carbohidratos,
  "confidence": número_entre_0_y_1_nivel_confianza
}

Instrucciones específicas:
- Identifica todos los alimentos visibles en la imagen
- Estima el peso total de la porción mostrada
- Calcula los valores nutricionales basándote en las porciones visibles
- Sé preciso con los nombres de los platos (ej: "Ensalada César con Pollo" en lugar de solo "ensalada")
- Si hay múltiples alimentos, incluye todos en el nombre y suma los valores nutricionales
- El nivel de confianza debe reflejar qué tan seguro estás de la identificación
- Responde ÚNICAMENTE con el JSON, sin texto adicional`;

    // Llamar a la API de OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Modelo con capacidades de visión
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: image, // Base64 data URL
                  detail: "high"
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1, // Baja temperatura para respuestas más consistentes
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API Error:", errorData);
      
      // Parsear el error para obtener información específica
      try {
        const parsedError = JSON.parse(errorData);
        if (parsedError.error?.code === 'insufficient_quota') {
          return new Response(
            JSON.stringify({ 
              error: "Sin créditos en OpenAI",
              userMessage: "La cuenta de OpenAI no tiene créditos suficientes. Por favor, recarga tu cuenta en platform.openai.com",
              errorType: "quota_exceeded"
            }),
            {
              status: 402,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } catch (parseErr) {
        // Si no se puede parsear, continuar con el error genérico
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Error del servicio de OpenAI",
          userMessage: "Hubo un problema con el servicio de análisis. Inténtalo de nuevo más tarde.",
          details: errorData,
          errorType: "openai_error"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    
    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      return new Response(
        JSON.stringify({ error: "Invalid response from OpenAI" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const content = openaiData.choices[0].message.content;
    
    try {
      // Limpiar la respuesta de OpenAI removiendo markdown code blocks
      let cleanContent = content.trim();
      
      // Remover ```json al inicio
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.substring(7);
      }
      
      // Remover ``` al final
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.substring(0, cleanContent.length - 3);
      }
      
      // Limpiar espacios en blanco adicionales
      cleanContent = cleanContent.trim();
      
      // Parsear la respuesta JSON de OpenAI
      const nutritionData: NutritionAnalysis = JSON.parse(cleanContent);
      
      // Validar que todos los campos requeridos estén presentes
      const requiredFields = ['name', 'weight', 'calories', 'protein', 'fat', 'carbs', 'confidence'];
      const missingFields = requiredFields.filter(field => !(field in nutritionData));
      
      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: "Incomplete nutrition data", 
            missing: missingFields,
            received: content 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validar que los valores numéricos sean válidos
      const numericFields = ['weight', 'calories', 'protein', 'fat', 'carbs', 'confidence'];
      for (const field of numericFields) {
        if (typeof nutritionData[field as keyof NutritionAnalysis] !== 'number' || 
            isNaN(nutritionData[field as keyof NutritionAnalysis] as number)) {
          return new Response(
            JSON.stringify({ 
              error: `Invalid numeric value for ${field}`,
              received: content 
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: nutritionData
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );

    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Error parsing nutrition analysis",
          details: content,
          parseError: parseError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("General error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});