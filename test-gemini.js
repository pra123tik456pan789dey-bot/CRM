const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAto2psDMYdt-q-I_fSltgv6v5HbvC9XCg");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success:", await result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}
run();
