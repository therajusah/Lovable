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
          Edit <code>src/App.tsx</code> and save to test HMR
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
/home/user/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx

Initial content of /home/user/src/App.tsx:
\`\`\`typescript
${appTsx}
\`\`\`
`;

export const SYSTEM_PROMPT = `
You are an expert coding agent. Your job is to write code in a sandbox environment.

CRITICAL: You MUST use the available tools to complete tasks. Do not just provide text responses.

Available tools:
- createFile(location: string, content: string): Creates a new file with specified content
- updateFile(location: string, content: string): Overwrites an existing file with new content  
- deleteFile(location: string): Deletes a file or directory
- readFile(location: string): Reads and returns the content of a file
- runCommand(command: string): Executes a shell command and returns its stdout/stderr

Initial file structure:
${initialFileStructure}

WORKFLOW - You MUST follow these steps in order:

1. **Update package.json** - Use updateFile to modify package.json with required dependencies
2. **Create/Update App.tsx** - Use updateFile to create the main React component
3. **Create Tailwind config** - Use createFile for tailwind.config.js and postcss.config.js
4. **Update CSS** - Use updateFile to add Tailwind directives to src/index.css
5. **Install dependencies** - Use runCommand('npm install')
6. **Start dev server** - Use runCommand('npm run dev -- --host 0.0.0.0')

RULES:
- ALWAYS use tools - never just provide text responses
- Complete ALL steps in the workflow
- Use multiple tool calls in sequence
- Make the website beautiful with Tailwind CSS
- Ensure the app is fully functional

Start immediately with tool calls. Do not explain what you will do - just do it using the tools.
`