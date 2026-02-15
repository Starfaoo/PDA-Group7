import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";

// Enable demo mode automatically when no Gemini API key is configured
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

// Initialize the Gemini API client
let genAI: any = null;
try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log("✅ Gemini client initialized");
} catch (e) {
  console.error("❌ Failed to initialize Gemini client:", e);
  genAI = null;
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
  try {
    console.log("🔍 Gemini API Key present:", !!GEMINI_API_KEY);
    console.log("🔍 GenAI client initialized:", !!genAI);

    if (!genAI || !GEMINI_API_KEY) {
      throw new Error(
        "Gemini API client not initialized. Please set EXPO_PUBLIC_GEMINI_API_KEY.",
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("📱 Model loaded: gemini-1.5-flash");

    // Convert image to base64
    console.log("🖼️ Converting image to base64:", imageUri);
    const base64Image = await convertImageToBase64(imageUri);
    console.log("✅ Image converted, size:", base64Image.length, "bytes");

    const prompt = `Analyze this plant leaf image and determine if it's healthy or has any diseases. 
Provide a detailed analysis including:
1. Disease name or "Healthy Plant" if no issues
2. Confidence percentage (as a number without %)
3. Description of findings
4. Treatment recommendations
5. Severity level (1-5, where 1 is mild and 5 is severe)
6. Contributing factors assessment (High/Medium/Low for humidity, sunlight, airflow)

Format the response ONLY as valid JSON with these exact keys:
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
}`;

    console.log("🚀 Sending request to Gemini API...");
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ]);

    console.log("✅ Received response from Gemini");
    const response = await result.response;
    const text = await response.text();
    console.log("📄 Raw response:", text.substring(0, 200));

    // Clean the response text (remove markdown formatting if present)
    const cleanText = text
      .replace(/```json\n?|\n?```/g, "")
      .replace(/```\n?/g, "")
      .trim();
    console.log("🧹 Cleaned response:", cleanText.substring(0, 200));

    // Parse the JSON response
    const analysis = JSON.parse(cleanText);
    console.log("✅ Parsed analysis:", analysis);

    // Add color based on result
    const color = analysis.disease.toLowerCase().includes("healthy")
      ? "#4CAF50"
      : "#FF5252";

    const finalResult = {
      ...analysis,
      color,
      confidence: analysis.confidence + "%",
    };

    console.log("🎉 Final result:", finalResult);
    return finalResult;
  } catch (error) {
    console.error("❌ Error analyzing plant image:", error);
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
