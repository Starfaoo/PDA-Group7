import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";

// Enable demo mode automatically when no Gemini API key is configured
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const DEMO_MODE = !GEMINI_API_KEY;

if (DEMO_MODE) {
  console.warn(
    "⚠️ Gemini API key not found — running in DEMO mode. Set EXPO_PUBLIC_GEMINI_API_KEY to enable real analysis.",
  );
}

// Initialize the Gemini API client when API key is present
let genAI: any = null;
if (!DEMO_MODE) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log("✅ Gemini client initialized");
  } catch (e) {
    console.error("❌ Failed to initialize Gemini client:", e);
    // Fallback to demo mode if initialization fails
    genAI = null;
  }
}

export interface PlantAnalysisResult {
  disease: string;
  confidence: string;
  description: string;
  treatment: string;
  color: string;
  severity: number;
  factors: {
    humidity: string;
    sunlight: string;
    airflow: string;
  };
}

export async function analyzePlantImage(
  imageUri: string,
): Promise<PlantAnalysisResult> {
  // Demo mode - return mock results if no valid Gemini client
  if (DEMO_MODE || !genAI) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

    const mockResults = [
      {
        disease: "Healthy Plant",
        confidence: "92%",
        description:
          "Your plant appears to be in excellent health! The leaves show no signs of disease, discoloration, or damage. Continue with your current care routine.",
        treatment:
          "Keep up the great work! Maintain regular watering, ensure adequate sunlight, and continue monitoring for any changes.",
        color: "#4CAF50",
        severity: 0,
        factors: {
          humidity: "Optimal",
          sunlight: "Adequate",
          airflow: "Good",
        },
      },
      {
        disease: "Early Blight",
        confidence: "87%",
        description:
          "Detected early signs of fungal infection on the leaves. Small dark spots with concentric rings are visible, which is characteristic of early blight.",
        treatment:
          "Remove affected leaves immediately. Apply copper-based fungicide. Improve air circulation and avoid overhead watering. Space plants properly for better airflow.",
        color: "#FF5252",
        severity: 2,
        factors: {
          humidity: "High",
          sunlight: "Low",
          airflow: "Poor",
        },
      },
      {
        disease: "Powdery Mildew",
        confidence: "91%",
        description:
          "White powdery coating visible on leaf surfaces, indicating fungal growth. This is a common issue in humid conditions with poor air circulation.",
        treatment:
          "Spray with baking soda solution (1 tsp baking soda + 1 quart water). Improve air circulation by spacing plants. Reduce humidity if possible. Apply sulfur-based fungicide as needed.",
        color: "#FF9800",
        severity: 3,
        factors: {
          humidity: "Very High",
          sunlight: "Adequate",
          airflow: "Poor",
        },
      },
    ];

    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);

    const prompt = `
Analyze this plant leaf image and determine if it's healthy or has any diseases. 
Provide a detailed analysis including:
1. Disease name or "Healthy Plant" if no issues
2. Confidence percentage (as a number without %)
3. Description of findings
4. Treatment recommendations
5. Severity level (1-5, where 1 is mild and 5 is severe)
6. Contributing factors assessment (High/Medium/Low for humidity, sunlight, airflow)

Format the response as JSON with these exact keys:
{
  "disease": "string",
  "confidence": number,
  "description": "string", 
  "treatment": "string",
  "severity": number,
  "factors": {
    "humidity": "string",
    "sunlight": "string", 
    "airflow": "string"
  }
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = await response.text();

    // Clean the response text (remove markdown formatting if present)
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

    // Parse the JSON response
    const analysis = JSON.parse(cleanText);

    // Add color based on result
    const color = analysis.disease.toLowerCase().includes("healthy")
      ? "#4CAF50"
      : "#FF5252";

    return {
      ...analysis,
      color,
      confidence: analysis.confidence + "%",
    };
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    // Fallback to mock data if API fails
    return {
      disease: "Analysis Failed",
      confidence: "0%",
      description:
        "Unable to analyze the image. Please ensure you have a valid API key and try again.",
      treatment: "Please check your internet connection and try again.",
      color: "#FF9800",
      severity: 1,
      factors: {
        humidity: "Unknown",
        sunlight: "Unknown",
        airflow: "Unknown",
      },
    };
  }
}

// Utility function to convert image to base64
async function convertImageToBase64(imageUri: string): Promise<string> {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    } as any);
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}
