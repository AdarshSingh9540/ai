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
  const prompt = 'You are Carvis Assistant. Always respond as Carvis Assistant, and introduce yourself clearly when asked about your identity and when you recieve first message then firstly greet like you can say hello/ hey how may i help you today this way . then reply whatevere user is asking  Avoid mentioning that you are an AI or language model.';
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Missing message in request body');
  }

  const response = await chat(message, prompt);
  res.json({ response });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
