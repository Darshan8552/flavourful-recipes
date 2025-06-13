import { NextRequest, NextResponse } from "next/server";
import { Modality, GoogleGenAI } from "@google/genai";
import { extractAndParseRecipe } from "@/lib/generate-otp";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const textPrompt = `
        Generate a recipe for the title: "${title}".

        Return response in pure JSON format with the following keys:
        - title: same as input or if you want to change it, do so
        - description: short description of the recipe
        - image_description: short description of image like this: A professional food photo of [dish name], served in a [bowl/plate/cup], placed on a [minimal background]. The dish has [describe color, texture, garnish]. No extra items, utensils, or people in the frame.
        - type: "veg" or "non-veg"
        - ingredients: array of strings
        - instructions: array of objects with {subheading, steps}
        - cooking_time: number (in minutes)
        - serves: number of people
        - difficulty: "easy", "medium", or "hard"
        - categories (single relevant categories like "Indian", "Italian", "Breakfast", etc.)
        Only return raw JSON. Do not include explanation or markdown.
    `;

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: textPrompt,
    });

    const rawRecipeString =
      textResponse?.candidates![0].content!.parts![0].text;
    const recipe = extractAndParseRecipe(rawRecipeString!);

    const imagePrompt = recipe.image_description;

    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: imagePrompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        aspect_ratio: "4:3",
      }  as any,
    });

    const imageData =
      imageResponse?.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data ??
      null;

    if (!imageData) {
      console.error("Image data is missing in the response");
      return NextResponse.json(
        { message: "Image data is missing in the response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe, imageData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error", detail: error },
      { status: 500 }
    );
  }
}
