import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';
import { languages, Locale } from '../translations';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getDifficulty = (level: number): string => {
  if (level < 3) return "very easy";
  if (level < 6) return "easy";
  if (level < 10) return "medium";
  if (level < 15) return "hard";
  return "very hard";
};

const fallbackQuestions: { [key in Locale]: QuizQuestion } = {
    bn: { question: "যদি নীল বাড়িকে লাল বলা হয়, লাল বাড়িকে হলুদ বলা হয়, হলুদ বাড়িকে সবুজ বলা হয়, তাহলে আকাশের রঙ কী?", options: ["লাল", "হলুদ", "নীল"], correctAnswer: "লাল" },
    en: { question: "If a blue house is called red, a red house is called yellow, and a yellow house is called green, what color is the sky?", options: ["Red", "Yellow", "Blue"], correctAnswer: "Red" },
    hi: { question: "यदि नीले घर को लाल कहा जाता है, लाल घर को पीला कहा जाता है, और पीले घर को हरा कहा जाता है, तो आकाश का रंग क्या है?", options: ["लाल", "पीला", "नीला"], correctAnswer: "लाल" },
    ta: { question: "நீல வீடு சிவப்பு என்றும், சிவப்பு வீடு மஞ்சள் என்றும், மஞ்சள் வீடு பச்சை என்றும் அழைக்கப்பட்டால், வானத்தின் நிறம் என்ன?", options: ["சிவப்பு", "மஞ்சள்", "நீலம்"], correctAnswer: "சிவப்பு" },
    id: { question: "Jika rumah biru disebut merah, rumah merah disebut kuning, dan rumah kuning disebut hijau, apa warna langit?", options: ["Merah", "Kuning", "Biru"], correctAnswer: "Merah" },
    ja: { question: "青い家が赤と呼ばれ、赤い家が黄色と呼ばれ、黄色い家が緑と呼ばれるなら、空の色は何ですか？", options: ["赤", "黄", "青"], correctAnswer: "赤" },
    ko: { question: "파란 집을 빨간색이라고 하고, 빨간 집을 노란색이라고 하고, 노란 집을 녹색이라고 한다면 하늘색은 무엇일까요?", options: ["빨간색", "노란색", "파란색"], correctAnswer: "빨간색" },
};


export const getQuizQuestion = async (level: number, locale: Locale, askedQuestions: string[] = []): Promise<QuizQuestion> => {
  const difficulty = getDifficulty(level);
  const languageName = languages[locale];
  
  const uniqueInstruction = askedQuestions.length > 0 
    ? `\nIMPORTANT: Do not repeat any of the following questions that have already been asked:\n${askedQuestions.map(q => `- "${q}"`).join('\n')}`
    : '';
  
  const prompt = `
    Create a unique, fun, and difficult-to-search trivia question suitable for a quiz game.
    The question's difficulty level should be: "${difficulty}".
    The question, three distinct multiple-choice options (one of which is correct), and the correct answer must all be in the ${languageName} language.
    Do not use common knowledge questions that are easily found on the internet. Focus on logic, clever wordplay, or niche topics.${uniqueInstruction}
    Provide the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (
        !parsedData.question || 
        !Array.isArray(parsedData.options) || 
        parsedData.options.length !== 3 || 
        !parsedData.correctAnswer
    ) {
        throw new Error("Invalid question format from API");
    }

    if (!parsedData.options.includes(parsedData.correctAnswer)) {
      parsedData.options[2] = parsedData.correctAnswer;
    }

    return parsedData as QuizQuestion;
  } catch (error) {
    console.error("Error fetching quiz question:", error);
    // Return a fallback question in the selected language
    return fallbackQuestions[locale] || fallbackQuestions['en'];
  }
};