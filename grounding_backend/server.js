import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(bodyParser.json({ limit: '25mb' }));

function base64ToGenerativePart(base64, mimeType) {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

app.post('/analyze-image', async (req, res) => {
  try {
    console.log('🧠 Received request to /analyze-image');
    const { base64, promptChars } = req.body;
    console.log('➡️ Characteristic:', promptChars);
    console.log('🖼️ Image received:', base64?.substring(0, 50), '...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `First of all, I want you to identify the main object in the image (ignore background). Is this object primarily something of the characteristic ${promptChars}? Answer yes or no with a short reason.`;

    const imagePart = base64ToGenerativePart(base64, 'image/jpeg');

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = await result.response.text();

    res.json({ result: responseText });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to analyze image.' });
  }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
  
