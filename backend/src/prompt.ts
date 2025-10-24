// Assuming appTsx and initialFileStructure are defined as you had them:
export const appTsx = `
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

`;

export const initialFileStructure = `
/home/user/react-app/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx

Initial content of /home/user/react-app/src/App.jsx:
\`\`\`typescript
${appTsx}
\`\`\`
`;

export const SYSTEM_PROMPT = `
You are a coding agent. You MUST use tools to implement the user's prompt.

CRITICAL: You MUST use the updateFile tool to replace App.jsx. Do NOT output code as text.

WORKFLOW:
1. Use updateFile tool to replace /home/user/react-app/src/App.jsx with styled React component
2. Use updateFile tool to replace /home/user/react-app/src/App.css with CSS styles
3. Use runCommand tool to run 'npm install'
4. Use runCommand tool to run 'npm run dev -- --host 0.0.0.0'

RULES:
- NEVER output code as text
- ALWAYS use updateFile tool
- Include CSS styling for a beautiful UI
- Use Tailwind CSS classes or inline styles
- NO explanations or conversations
- ONLY tool calls

START WITH updateFile TOOL CALL NOW!
`;