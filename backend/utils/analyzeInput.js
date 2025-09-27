const askGemini = require("./gemini");

async function analyzeUserInput(userInput) {
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

    // Trường hợp Gemini trả về có thừa ký tự ngoài JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      occasion: null,
      budgetMin: null,
      budgetMax: null,
      features: []
    };
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

module.exports = analyzeUserInput;
