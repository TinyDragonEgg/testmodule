# Testing v1.1.7 - Skills and Languages Fix

## What Changed

This version fixes both skills and languages not being applied when selecting a cultural origin.

### Skills Fix
- Skills are now added directly to the actor update in the `preUpdateActor` hook
- This prevents conflicts with Foundry's update system
- Skills should now apply immediately when selecting a cultural origin

### Languages Fix
- Languages are now loaded fresh from the actor after other updates complete
- Added better handling for both Set (v5.2.4+) and Array (older versions)
- Added extensive logging to help debug any remaining issues

## How to Test

1. **Reload Foundry** completely (F5 or Ctrl+R)
2. Open the F12 console to see logs
3. Open a character sheet
4. Click Edit on the character
5. Select a Cultural Origin from the dropdown
6. Watch the console for logs starting with `aspects-dual-backgrounds |`

### Expected Results

When you select a cultural origin (e.g., "Ashland Heritage"):

1. **Console should show:**
   ```
   aspects-dual-backgrounds | Adding skill proficiency in update: sur at path system.skills.sur.proficient
   aspects-dual-backgrounds | Changes object after skill set: {...}
   aspects-dual-backgrounds | Created X items for Ashland Heritage
   ```

2. **Language dialog should appear** - select a language

3. **Console should show language logs:**
   ```
   aspects-dual-backgrounds | Current languages: Set(1) {...}
   aspects-dual-backgrounds | Language type: Set
   aspects-dual-backgrounds | Language storage is Set
   aspects-dual-backgrounds | Updated languages array: [...]
   aspects-dual-backgrounds | Updating actor with languages: [...]
   aspects-dual-backgrounds | Successfully added language: Draconic
   ```

4. **Check character sheet:**
   - Skills tab: Survival should have proficiency (for Ashland Heritage)
   - Languages: Should show the selected language
   - Features: Should have 3 cultural origin features
   - Inventory: Should have cultural origin equipment

## If Skills Still Don't Apply

Run this in the console AFTER selecting a cultural origin:

```javascript
const actor = game.actors.getName("YOUR_CHARACTER_NAME");
console.log("Skills:", actor.system.skills.sur);
```

Replace `sur` with the appropriate skill code:
- `ath` - Athletics (Tharon Heritage)
- `arc` - Arcana (Kael Heritage)
- `rel` - Religion (Calthran Heritage)
- `sur` - Survival (Ashland Heritage)
- `his` - History (Lyra's Descendants)

## If Languages Still Don't Apply

Run this in the console:

```javascript
const actor = game.actors.getName("YOUR_CHARACTER_NAME");
console.log("Languages:", actor.system.traits.languages);
```

This will show the current language structure.
