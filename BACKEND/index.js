const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8000;
const documents = {};


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = new Uint8Array(req.file.buffer);
      const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      text = fullText;
    } else {
      text = req.file.buffer.toString('utf8');
    }

    const docId = `doc_${Date.now()}`;
    documents[docId] = text;
    console.log(`File processed successfully. Doc ID: ${docId}`);
    res.json({ docId, message: 'File uploaded and processed.' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file.' });
  }
});


app.post('/ask', async (req, res) => {
  const { docId, question } = req.body;
  if (!docId || !question) {
    return res.status(400).json({ error: 'docId and question are required.' });
  }
  const docText = documents[docId];
  if (!docText) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  try {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `Based only on the document text provided, answer the following question. If the answer is not in the text, say so. DOCUMENT TEXT: "${docText}" QUESTION: "${question}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();
    
    res.json({ answer });

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to get answer from AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});