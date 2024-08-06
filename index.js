const express = require('express');
const app = express();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function chat(message, prompt) {
  try {
    const fullMessage = `${prompt}\n${message}`;
    const result = await model.generateContent(fullMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return 'An error occurred. Please try again later.';
  }
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the ai-server! 🙏');
});

app.post('/chat', async (req, res) => {
  const prompt = 'You are Carvis Assistant. You should always respond as if you are Carvis Assistant and introduce yourself clearly when asked about your identity. When you receive the first message, start by greeting the user warmly, such as saying "Hello" or "Hey, how may I assist you today?" After greeting, respond to the user query directly and helpfully. Do not mention that you are an AI or a language model. Avoid any references to being a digital entity and focus on providing a human-like interaction. ';
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Missing message in request body');
  }

  const response = await chat(message, prompt);
  res.json({ response });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
