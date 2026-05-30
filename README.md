# Iron Horse Group — EPSL AI Demo

## Deploy to Railway (10 minutes, free)

### Step 1 — Upload to GitHub
1. Go to github.com → New repository → name it `ironhorse-epsl-demo` → Create
2. Click "uploading an existing file"
3. Drag ALL files from this folder into the upload window
4. Click "Commit changes"

### Step 2 — Deploy on Railway
1. Go to railway.app → Login with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `ironhorse-epsl-demo`
4. Railway auto-detects Node.js and deploys

### Step 3 — Add your API key
1. In Railway dashboard, click your project
2. Click "Variables" tab
3. Click "New Variable"
4. Name: `ANTHROPIC_API_KEY`
5. Value: your `sk-ant-...` key
6. Click Add — Railway restarts automatically

### Step 4 — Get your URL
1. Click "Settings" tab in Railway
2. Under "Domains" click "Generate Domain"
3. You get a URL like `ironhorse-epsl-demo.up.railway.app`
4. Open on any phone, anywhere

## That's it. Total time: ~10 minutes.

## Cost
- Railway: Free tier covers demo usage
- Anthropic API: ~$0.01-0.05 per project generation
- Your $20 credit will last hundreds of demo sessions
