<div align="center">

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:

## Deploy to Vercel

1. **Install Vercel CLI** (optional, or deploy via web):
   `npm i -g vercel`

2. **Deploy via CLI:**
   Run `vercel` in the project root.
   - Follow the prompts.
   - For `Output Directory`, keep the default (`dist`).

3. **Environment Variables:**
   - In your Vercel Project Settings > Environment Variables, add:
     - `GEMINI_API_KEY`: Your Gemini API Key.
   *(Note: This key will be baked into the frontend build. Ensure your API key has appropriate restrictions.)*

4. **Routing:**
   - A `vercel.json` file is included to handle SPA routing (rewrites all requests to `index.html`).

## Build
To build the project locally:
`npm run build`
The output will be in the `dist` folder.
