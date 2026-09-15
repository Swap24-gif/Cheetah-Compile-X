# Cheetah Compile X

A browser-based coding practice tool — Python, C, JavaScript and SQL, with real
execution and AI code review. Built to deploy straight to Netlify.

## How it works

- **Code execution** (Run button) calls the free public [Piston API](https://github.com/engineer-man/piston)
  directly from the browser. No backend needed for this part, no API key needed.
  It's a shared public service, so under heavy traffic it can be slow or rate-limited —
  fine for a practice tool, not meant for production-scale traffic.
- **AI Review** calls a Netlify serverless function (`netlify/functions/ai-review.js`),
  which holds your Anthropic API key on the server and forwards the request. The key
  never reaches the browser.

## Project structure

```
cheetah-compile-x/
├── index.html                     ← the whole app (UI + logic)
├── netlify.toml                   ← tells Netlify where the site & functions live
├── package.json
└── netlify/
    └── functions/
        └── ai-review.js           ← secure AI review backend
```

## Deploy to Netlify

1. **Get an Anthropic API key** (only needed for AI Review):
   https://console.anthropic.com/settings/keys

2. **Push this folder to a GitHub repo** (or use Netlify's drag-and-drop deploy —
   see step 4 for that option).

3. **New site on Netlify**:
   - Netlify dashboard → *Add new site* → *Import an existing project*
   - Connect your repo
   - Build command: leave blank
   - Publish directory: `.` (already set in `netlify.toml`, Netlify should pick it up)
   - Deploy

4. **Or, drag-and-drop deploy** (no GitHub needed):
   - Zip this folder's contents (not the folder itself — the files should be at the
     zip's root)
   - Netlify dashboard → *Add new site* → *Deploy manually* → drop the zip
   - Note: manual/drag-and-drop deploys on Netlify do pick up the `netlify/functions`
     folder automatically as long as it's included in what you upload.

5. **Add your API key**:
   - Site settings → *Environment variables* → *Add a variable*
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from step 1
   - Redeploy the site (env vars only apply to new deploys)

6. Open your live Netlify URL. Run code with the ▶ button (Ctrl+Enter), get an
   AI review with the AI Review button (Ctrl+K).

## Notes

- If you skip step 5, everything still works except AI Review, which will show
  a clear error message telling you the key is missing — Run/execution is unaffected.
- If you ever want to swap the AI model, change the `model` value inside
  `netlify/functions/ai-review.js`.
- If you want execution to go through your own backend instead of the public
  Piston API (e.g. for higher reliability or rate limits), that would need a second
  serverless function or a real execution sandbox — ask if you want that built out.
