# Lovable Clone

A full-stack web application that allows users to generate websites using AI, similar to Lovable and v0.

## Features

- **Modern Frontend**: React + TypeScript + Tailwind CSS + Vite
- **AI-Powered Generation**: Uses Google Gemini for website generation
- **Live Preview**: Real-time preview of generated websites in sandboxed environments
- **Code Editor**: Monaco editor with syntax highlighting
- **Streaming Responses**: Real-time streaming of AI responses
- **Responsive Design**: Works on desktop, tablet, and mobile

## Project Structure

```
├── backend/           # Express.js backend with AI integration
│   ├── src/
│   │   ├── index.ts   # Main server file
│   │   ├── prompt.ts  # AI system prompts
│   │   └── tools/     # AI tools for file operations
│   └── package.json
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── types/       # TypeScript type definitions
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- E2B API key (for sandboxed environments)
- Google AI API key (for Gemini)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```env
   E2B_API_KEY=your_e2b_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=3003
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will be running on `http://localhost:3003`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173`

### API Endpoints

- `POST /prompt` - Generate a website from a text prompt
- `GET /sandboxes` - List all active sandboxes
- `DELETE /sandbox/:sandboxId` - Delete a specific sandbox

## Usage

1. **Home Page**: Enter a prompt describing the website you want to build
2. **Dashboard**: 
   - Chat with AI in the left panel
   - View and edit generated code in the center panel
   - Preview the live website in the right panel
   - Switch between desktop, tablet, and mobile views

## Technology Stack

### Backend
- Express.js
- Google Gemini AI
- E2B Code Interpreter
- TypeScript
- CORS enabled

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Monaco Editor
- Lucide React Icons

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with TypeScript compilation and nodemon
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with hot reload
```

### Building for Production

Backend:
```bash
cd backend
npm run build:prod
```

Frontend:
```bash
cd frontend
npm run build
```

## Environment Variables

Create a `.env` file in the backend directory with:

```env
# E2B API key for sandboxed environments
E2B_API_KEY=your_e2b_api_key_here

# Google AI API key for Gemini
GOOGLE_API_KEY=your_google_api_key_here

# Server port (optional, defaults to 3003)
PORT=3003
```