# GitHub Setup Guide for Foundry Module

Follow these steps to host your Foundry module on GitHub and enable manifest installation.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in (or create account)
2. Click the **+** icon (top right) → **New repository**
3. Name it: `foundry-dual-backgrounds`
4. Description: "Dual background system for Aspects of Verun in Foundry VTT"
5. Make it **Public** (so others can install via manifest)
6. Check "Add a README file"
7. Click **Create repository**

## Step 2: Upload Module Files

### Option A: Web Interface (Easier)

1. In your repository, click **Add file** → **Upload files**
2. Drag and drop ALL files from the `foundry-dual-backgrounds` folder:
   - `module.json`
   - `README.md`
   - `scripts/dual-backgrounds.js`
   - `styles/dual-backgrounds.css`
   - `lang/en.json`
3. Commit message: "Initial module release"
4. Click **Commit changes**

### Option B: Git Command Line

```bash
cd foundry-dual-backgrounds
git init
git add .
git commit -m "Initial module release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/foundry-dual-backgrounds.git
git push -u origin main
```

## Step 3: Update module.json with YOUR GitHub Username

1. Edit `module.json` in your repository
2. Replace `YOUR-USERNAME` with your actual GitHub username in these lines:
   ```json
   "url": "https://github.com/YOUR-USERNAME/foundry-dual-backgrounds",
   "manifest": "https://raw.githubusercontent.com/YOUR-USERNAME/foundry-dual-backgrounds/main/module.json",
   "download": "https://github.com/YOUR-USERNAME/foundry-dual-backgrounds/releases/latest/download/module.zip",
   "readme": "https://raw.githubusercontent.com/YOUR-USERNAME/foundry-dual-backgrounds/main/README.md"
   ```
3. Commit the changes

## Step 4: Create a Release

1. In your repository, click **Releases** (right sidebar)
2. Click **Create a new release**
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:
   ```
   Initial release of Aspects of Verun: Dual Backgrounds module

   Features:
   - Cultural Origin selector on character sheets
   - Automatic feature application
   - Support for 5 cultural heritages
   ```
6. **IMPORTANT:** Add the module as a zip file:
   - Create a zip of the `foundry-dual-backgrounds` folder
   - Name it: `module.zip`
   - Drag it to the "Attach binaries" section
7. Click **Publish release**

## Step 5: Install in Foundry via Manifest

Now you (and others) can install the module:

1. Open Foundry VTT
2. Go to **Add-on Modules** → **Install Module**
3. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/YOUR-USERNAME/foundry-dual-backgrounds/main/module.json
   ```
4. Click **Install**
5. Enable the module in your world!

## Your Manifest URL

Once you complete steps 1-4, your manifest URL will be:

```
https://raw.githubusercontent.com/YOUR-USERNAME/foundry-dual-backgrounds/main/module.json
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Alternative Hosting Options

If you don't want to use GitHub, you can also host the files on:

### DropBox
1. Upload `module.json` to public DropBox folder
2. Get the share link
3. Replace `www.dropbox.com` with `dl.dropboxusercontent.com` in the URL
4. Use that as your manifest URL

### Google Drive
Not recommended - doesn't serve files with correct headers for Foundry

### GitLab
Similar to GitHub, supports manifest installation

### Self-hosting
If you have a web server, upload the files and use the direct URL to `module.json`

## Example Module Structure

After setup, your repository should look like:

```
foundry-dual-backgrounds/
├── module.json              (manifest file)
├── README.md               (documentation)
├── GITHUB_SETUP.md         (this file)
├── scripts/
│   └── dual-backgrounds.js (main module code)
├── styles/
│   └── dual-backgrounds.css (styling)
└── lang/
    └── en.json             (localization)
```

## Testing Your Module

After installation:

1. Create a test world or use existing
2. Enable the module in Game Settings → Manage Modules
3. Create/open a character sheet
4. You should see the "Cultural Origin" dropdown below the Background field
5. Import the Cultural Origins backgrounds via Plutonium first
6. Select a cultural origin from the dropdown
7. Verify features are applied

## Updating Your Module

When you make changes:

1. Update version in `module.json` (e.g., `1.0.1`)
2. Commit and push changes to GitHub
3. Create a new release with the new version tag
4. Add changelog to release notes
5. Foundry will auto-detect updates when users check for module updates

## Troubleshooting

**Module won't install:**
- Check manifest URL is correct and accessible
- Verify `module.json` is valid JSON (use JSONLint.com)
- Make sure repository is Public

**Features not applying:**
- Ensure Cultural Origins backgrounds are imported via Plutonium
- Check browser console (F12) for errors
- Verify background names match exactly

**Need help?**
- Check Foundry VTT Discord #module-development channel
- Review Foundry module documentation
- Post in r/FoundryVTT subreddit
