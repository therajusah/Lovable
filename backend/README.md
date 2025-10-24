# E2B Template for Lovable Project

This directory contains an E2B template configuration for creating custom sandboxes.

## Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up your E2B API key**:
   Create a `.env` file in this directory with your E2B API key:
   ```
   E2B_API_KEY=e2b_your_api_key_here
   ```

## Building Templates

### Development Template
Build the development template:
```bash
npm run build:dev
```
This creates a template with alias `lovable-dev`.

### Production Template
Build the production template:
```bash
npm run build:prod
```
This creates a template with alias `lovable`.

## Using the Template

Once built, you can create sandboxes from your template:

```typescript
import "dotenv/config";
import { Sandbox } from "e2b";

// Create a Sandbox from V1 template (React/Vite environment)
const sandbox = await Sandbox.create("73bu50moaayy3jt8ftpv");

// Create a Sandbox from V2 development template
const sandbox = await Sandbox.create("lovable");
```

## Template Configuration

The template is defined in `template.ts` and currently includes:
- Base image configuration
- Environment variables (HELLO: "Hello, World!")
- Start command that echoes the HELLO environment variable

You can modify `template.ts` to customize your sandbox environment, add more environment variables, install packages, or configure startup commands.

## Files

- `template.ts` - Template definition
- `build.dev.ts` - Development build script
- `build.prod.ts` - Production build script
- `.env` - Environment variables (create this file with your E2B API key)
