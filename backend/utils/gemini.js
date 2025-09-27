const { GoogleGenerativeAI } = require("@google/generative-ai");
const { env } = require('../configs/environment');

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

async function askGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

module.exports = askGemini;