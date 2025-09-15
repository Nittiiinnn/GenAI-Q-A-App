import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [docId, setDocId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDocId('');
    setAnswer('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData);
      setDocId(res.data.docId);
    } catch (err) {
      setError('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question) {
      setError('Please enter a question.');
      return;
    }
    if (!docId) {
      setError('Please upload a document first.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/ask`, { question, docId });
      setAnswer(res.data.answer);
    } catch (err) {
      setError('Error getting an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">AI Document Q&A</h1>
        <p className="text-gray-500 mt-2">Upload a PDF or TXT file, then ask a question about its content.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Upload Document</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <button
              onClick={handleUpload}
              disabled={isLoading || !file}
              className="w-full sm:w-auto px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {docId ? '✅ Uploaded' : 'Upload'}
            </button>
          </div>
        </div>

        {docId && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Ask a Question</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is the main conclusion of the document?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
              <button
                onClick={handleAsk}
                disabled={isLoading || !question}
                className="w-full px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Ask AI
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <svg className="animate-spin h-5 w-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Thinking...</span>
          </div>
        )}
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}

        {answer && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Answer</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;