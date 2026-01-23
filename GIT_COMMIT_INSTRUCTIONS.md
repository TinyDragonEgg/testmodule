# Git Commit Instructions for Foundry Dual Backgrounds Module

## Current State
- Working directory: `C:\Users\yahya\Desktop\New folder (5)\foundry-dual-backgrounds\`
- This is NOT currently a git repository
- Version: 1.1.7
- Remote: https://github.com/TinyDragonEgg/testmodule

## What Has Been Done

### Files Modified in v1.1.7:
1. **module.json** - Updated version to 1.1.7
2. **scripts/dual-backgrounds.js** - Fixed skills and languages implementation
   - Skills now added via `preUpdateActor` hook (lines 223-229)
   - Languages handled separately after features (lines 446-503)
   - Added extensive logging for debugging

### New Files Created:
1. **CURRENT_STATUS.md** - Status summary for new conversations
2. **TESTING.md** - Testing instructions for v1.1.7
3. **GIT_COMMIT_INSTRUCTIONS.md** - This file

## Key Changes in v1.1.7

### Skills Fix (lines 223-229 in dual-backgrounds.js):
```javascript
// Add new skill proficiency
if (newCulturalOrigin && allOrigins[newCulturalOrigin]?.skill) {
  const skillPath = `system.skills.${allOrigins[newCulturalOrigin].skill}.proficient`;
  foundry.utils.setProperty(changes, skillPath, 1);
  this.log(`Adding skill proficiency in update: ${allOrigins[newCulturalOrigin].skill} at path ${skillPath}`);
  this.log(`Changes object after skill set:`, changes);
}
```

**Why this approach**: Skills must be set in the `preUpdateActor` hook's `changes` object, not via a separate `actor.update()` call, to avoid conflicts with Foundry's update system.

### Language Fix (lines 446-503 in dual-backgrounds.js):
```javascript
// Get fresh actor data
const currentActor = game.actors.get(actor.id);
const currentLanguages = currentActor.system.traits?.languages?.value;

if (currentLanguages instanceof Set) {
  // v5.2.4+ uses Set
  updatedLanguages = Array.from(currentLanguages);
  updatedLanguages.push(languageKey);
} else if (Array.isArray(currentLanguages)) {
  // Older versions use Array
  updatedLanguages = [...currentLanguages, languageKey];
}

await currentActor.update({ 'system.traits.languages.value': updatedLanguages });
```

**Why this approach**: D&D 5e v5.2.4+ stores languages as a Set but requires an Array for updates. Must get fresh actor data after feature creation.

## How to Initialize Git and Commit

### If starting fresh (recommended):
```bash
cd "C:\Users\yahya\Desktop\New folder (5)\foundry-dual-backgrounds"

# Initialize git
git init

# Add remote
git remote add origin https://github.com/TinyDragonEgg/testmodule.git

# Add all files
git add .

# Create commit
git commit -m "v1.1.7 - Fix skills and languages not applying

- Skills now applied via preUpdateActor hook changes object
- Languages reload actor data and convert Set to Array
- Added extensive logging for debugging
- Fixed compatibility with D&D 5e v5.2.4+

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to main branch
git branch -M main
git push -u origin main --force
```

### If git already exists:
```bash
cd "C:\Users\yahya\Desktop\New folder (5)\foundry-dual-backgrounds"

# Check status
git status

# Add modified files
git add module.json scripts/dual-backgrounds.js

# Add new files
git add CURRENT_STATUS.md TESTING.md GIT_COMMIT_INSTRUCTIONS.md

# Commit
git commit -m "v1.1.7 - Fix skills and languages not applying

- Skills now applied via preUpdateActor hook changes object
- Languages reload actor data and convert Set to Array
- Added extensive logging for debugging
- Fixed compatibility with D&D 5e v5.2.4+

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push
git push origin main
```

## Creating GitHub Release

After committing, create a release:

```bash
# Create and push tag
git tag v1.1.7
git push origin v1.1.7
```

Then on GitHub:
1. Go to https://github.com/TinyDragonEgg/testmodule/releases
2. Click "Draft a new release"
3. Tag: v1.1.7
4. Title: "v1.1.7 - Skills and Languages Fix"
5. Description:
   ```
   ## Fixed
   - Skills now correctly apply when selecting cultural origin
   - Languages now correctly apply when selecting cultural origin
   - Fixed compatibility with D&D 5e v5.2.4+ (Set vs Array handling)

   ## Technical Changes
   - Skills applied via preUpdateActor hook changes object
   - Languages reload actor data and handle Set to Array conversion
   - Added extensive debug logging
   ```
6. Create a ZIP of the module folder named `module.zip`
7. Attach `module.zip` to the release
8. Publish release

## Troubleshooting Git Issues

### "fatal: not a git repository"
```bash
cd "C:\Users\yahya\Desktop\New folder (5)\foundry-dual-backgrounds"
git init
git remote add origin https://github.com/TinyDragonEgg/testmodule.git
```

### "failed to push some refs"
```bash
# Force push (use with caution - overwrites remote)
git push origin main --force
```

### "Permission denied" or authentication issues
- Use GitHub Desktop app instead
- Or generate a Personal Access Token on GitHub
- Settings → Developer settings → Personal access tokens → Generate new token

## Important Notes

1. **Always use co-author credit**: Include `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>` in commit messages
2. **Version numbers**: module.json version must match git tag and release
3. **Download URL**: module.json download URL must point to correct release ZIP
4. **Test before release**: Reload Foundry and test the module before creating release

## Files Structure
```
foundry-dual-backgrounds/
├── module.json (v1.1.7)
├── scripts/
│   └── dual-backgrounds.js (modified for v1.1.7)
├── templates/
│   ├── config.html
│   └── editor.html
├── styles/
│   └── dual-backgrounds.css
├── lang/
│   └── en.json
├── CURRENT_STATUS.md (new)
├── TESTING.md (new)
└── GIT_COMMIT_INSTRUCTIONS.md (this file)
```

## Status: Not Yet Tested
⚠️ **v1.1.7 has been coded but NOT tested in Foundry VTT yet**
- Skills and languages may or may not work
- Extensive logging added to help diagnose issues
- User needs to test and share console logs if it still doesn't work
