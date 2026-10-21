const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');
const envVars = {};
for (const line of lines) {
  const match = line.match(/^([A-Z_]+)="?([^"\r\n]+)"?/);
  if (match) envVars[match[1]] = match[2];
}

async function testPrompt() {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: envVars.OPENAI_API_KEY });
  const comp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are Apex CRM AI Brain. Speak in Hindi." },
      { role: "user", content: "manager ka naam kya hai? (CRM data: Manager is Neha Sharma)" }
    ]
  });
  console.log("GPT Response:", comp.choices[0].message.content);
}

testPrompt().catch(console.error);
