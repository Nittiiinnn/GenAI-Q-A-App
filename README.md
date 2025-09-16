# AI Document Q&A

A full-stack application built with React and Node.js that allows users to upload documents and ask questions about their content using a generative AI. This project fulfills all requirements of the assignment, including API creation, in-memory storage, and deployment.

**Live Application URL:** [(https://gen-ai-q-a-app.vercel.app/)]

---

## Screenshot




---

## Core Technologies

* **Frontend:** React (with Vite), Axios, Tailwind CSS
* **Backend:** Node.js, Express.js
* **AI Integration:** Google Gemini API (`@google/generative-ai`)
* **File Handling:** Multer (for uploads), pdf.js (for text extraction)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## Features & Requirements Checklist

### Frontend (React)
-  Simple UI for file uploading (`.pdf`, `.txt`) and asking questions.
-  Input box for user questions.
-  Results area to display the AI's answer.
-  Loading state is shown while waiting for a response.
-  Clean, functional styling.

### Backend (Node.js + Express)
-  Exposes two primary API endpoints.
-  **`POST /upload`**: Accepts a document, extracts the text, and stores it.
-  **`POST /ask`**: Takes a user's question, queries the LLM with the document's context, and returns the answer.
-  Uploaded documents are stored in-memory for the server's session.

---

## AI Integration Method

This project uses a **direct LLM call** approach for AI integration.

When a user asks a question, the backend retrieves the full text of the previously uploaded document from memory. It then constructs a single, comprehensive prompt containing both the document's text and the user's question. This entire package is sent directly to the Google Gemini model in one API call.

This method is straightforward and effective for documents that fit within the model's context window. The alternative, Retrieval-Augmented Generation (RAG), was considered as a bonus but not implemented in this version.

---

## Local Development Setup

To run this project on your local machine, follow these steps.

### Prerequisites

* Node.js (v18.x or later)
* npm (or yarn)
* A Google Gemini API Key

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

 ### 2. Backend Setup

 # Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add your API key
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# Start the backend server
npm start

### 3. Frontend Setup

# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file for the API URL
echo "VITE_API_URL=http://localhost:8000" > .env

# Start the frontend development server
npm run dev

## Deployment Instructions

This application is deployed with a decoupled architecture, meaning the frontend and backend are hosted on separate services and communicate via API calls.

### Backend Deployment (Render)

The Node.js/Express server is deployed as a Web Service on Render.

1.  **Sign in to [Render](https://render.com/)** and click **New +** > **Web Service**.
2.  **Connect** your GitHub repository where the code is hosted.
3.  **Configure the service with the following settings:**
    * **Name:** Choose a unique name (e.g., `ai-doc-backend`).
    * **Root Directory:** `./backend` (This is crucial, as it tells Render where to find the backend code).
    * **Environment:** `Node`
    * **Build Command:** `npm install`
    * **Start Command:** `npm start`
4.  **Add the Environment Variable:**
    * Navigate to the **Environment** tab.
    * Click **Add Environment Variable**.
    * **Key:** `GEMINI_API_KEY`
    * **Value:** Paste your secret Google Gemini API key.
5.  **Create Web Service**. Wait for the deployment to finish.
6.  Once live, **copy the URL** provided by Render (e.g., `https://ai-doc-backend.onrender.com`). You will need this for the frontend deployment.

### Frontend Deployment (Vercel)

The React application is deployed on Vercel, which is highly optimized for modern frontends.

1.  **Sign in to [Vercel](https://vercel.com/)** and click **Add New...** > **Project**.
2.  **Import** the same GitHub repository.
3.  **Configure the project settings:**
    * **Framework Preset:** Vercel should automatically detect `Vite`.
    * **Root Directory:** Set this to `./frontend`.
4.  **Add the Environment Variable:**
    * Expand the **Environment Variables** section.
    * **Name:** `VITE_API_URL`
    * **Value:** Paste the backend URL you copied from Render in the previous step.
5.  **Deploy**. Vercel will build and deploy your application.

Once the deployment is complete, Vercel will provide the final public URL for your live application.