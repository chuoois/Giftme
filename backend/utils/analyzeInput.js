const askGemini = require("./gemini");

async function analyzeGiftRequest(userInput) {
  const prompt = `
  Người dùng viết: "${userInput}".

  Hãy phân tích và trả về JSON với cấu trúc:
  {
    "occasion": "dịp tặng quà (ví dụ: sinh nhật, noel, valentine...), null nếu không có",
    "budgetMin": số tiền tối thiểu (nghìn VND, null nếu không có),
    "budgetMax": số tiền tối đa (nghìn VND, null nếu không có),
    "features": ["công nghệ", "thời trang", "làm đẹp", ...] hoặc []
  }

  Trả về **chỉ JSON hợp lệ**, không thêm chữ nào khác.
  `;

  try {
    const result = await askGemini(prompt);

    // Lấy JSON trong chuỗi Gemini trả về
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    let analysis = {
      occasion: null,
      budgetMin: null,
      budgetMax: null,
      features: []
    };

    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
    }

    // --- Fallback keyword detection ---
    const text = userInput.toLowerCase();
    if (!analysis.occasion) {
      if (text.includes("sinh nhật")) analysis.occasion = "sinh nhật";
      if (text.includes("valentine")) analysis.occasion = "valentine";
      if (text.includes("noel") || text.includes("giáng sinh")) analysis.occasion = "noel";
      if (text.includes("tết")) analysis.occasion = "tết nguyên đán";
      if (text.includes("8/3")) analysis.occasion = "8/3";
      if (text.includes("20/10")) analysis.occasion = "20/10";
    }

    return analysis;
  } catch (err) {
    console.error("Lỗi phân tích Gemini:", err);
    return {
      occasion: null,
      budgetMin: null,
      budgetMax: null,
      features: []
    };
  }
}

module.exports = analyzeGiftRequest;
