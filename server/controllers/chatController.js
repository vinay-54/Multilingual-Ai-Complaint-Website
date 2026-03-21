const { GoogleGenAI } = require('@google/genai');

// Ensure GEMINI_API_KEY is defined in .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an AI assistant for a local police Complaint Portal. Your goal is to collect 5 key pieces of information from the user naturally in a conversation:
1. Incident Type (e.g., Theft, Assault, Fraud, Traffic, Other)
2. Date of Incident
3. Location of Incident
4. Description of Incident
5. Suspect Details (if any, or state None)

RULES:
- Ask polite, conversational questions one by one. Do not overwhelm the user with a massive form.
- Always reply in the SAME language the user is speaking (e.g., Telugu, Hindi, English).
- Once you have successfully collected all 5 pieces of information, you MUST stop conversing and output strictly a valid JSON string (no markdown ticks) structured exactly like this:
{"status": "complete", "details": {"type": "...", "date": "...", "location": "...", "description": "...", "suspect": "..."}}

Until all info is gathered, just reply with standard conversational text guiding them forward.`;

const processChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    // Format the history mapping UI sender to the required GenAI SDK roles
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    let aiText = response.text;
    let isComplete = false;
    let extractedDetails = null;

    // Detect if the AI triggered the JSON form completion
    try {
      // In case AI outputs markdown explicitly, strip it:
      const cleanedJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      
      if (parsed.status === 'complete' && parsed.details) {
        isComplete = true;
        extractedDetails = parsed.details;
        aiText = "All details collected! Preparing your FIR draft...";
      }
    } catch (e) {
      // Standard conversation progressing
    }

    res.json({
      reply: aiText,
      isComplete,
      extractedDetails
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: `Gemini API Error: ${error.message}` });
  }
};

module.exports = { processChat };
