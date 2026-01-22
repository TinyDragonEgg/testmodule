# Aspects of Verun: Dual Backgrounds

A Foundry VTT module that enables the dual background system for the Aspects of Verun campaign setting.

## Features

- Adds a "Cultural Origin" selector to character sheets
- Allows characters to have both a Profession background and a Cultural Origin background
- Automatically applies cultural origin features and traits
- Integrates seamlessly with the D&D 5e system and Plutonium module

## Installation

### Method 1: Manual Installation

1. Download or copy the `foundry-dual-backgrounds` folder
2. Place it in your Foundry VTT `Data/modules/` directory
3. Restart Foundry VTT
4. Enable the module in your world settings

### Method 2: Manifest URL

*(To be added when hosted)*

## Prerequisites

- **Foundry VTT** v11 or higher
- **D&D 5e System** v3.0.0 or higher
- **Plutonium Module** for importing 5etools homebrew

## Setup

1. **Import Backgrounds via Plutonium:**
   - Import `Universal Profession Backgrounds.json` (50 profession backgrounds)
   - Import `Cultural Origins (Backgrounds).json` (5 cultural heritage backgrounds)

2. **Enable the Module:**
   - Go to Game Settings → Manage Modules
   - Check "Aspects of Verun: Dual Backgrounds"
   - Save and reload

3. **Use on Characters:**
   - Open any character sheet
   - Select a Profession background in the normal Background field
   - Select a Cultural Origin in the new "Cultural Origin" dropdown
   - The module will automatically apply both backgrounds

## Cultural Origins

The module supports these five cultural origins:

- **Tharon Heritage** - Military stratocracy culture (Athletics)
- **Kael Heritage** - Scientific/technological ascendancy (Arcana)
- **Calthran Heritage** - Death cult/necromantic resurrection society (Religion)
- **Ashland Heritage** - Nomadic wasteland survivors (Survival)
- **Lyra's Descendants** - Bloodline of the immortal Artillery Witch (History)

## How It Works

### Character Creation

1. Choose one **Profession Background** (Soldier, Merchant, Criminal, etc.)
2. Choose one **Cultural Origin** background
3. Gain benefits from both:
   - 2 skill proficiencies (1 from profession + 1 from cultural origin)
   - 1 tool proficiency (from profession)
   - 1 language (from cultural origin)
   - Equipment from both backgrounds
   - 2 features (1 from each)
   - 1 cultural trait (from cultural origin)

### Skill Overlap

If both backgrounds grant the same skill proficiency, the player should manually choose a different skill from their class skill list.

## Technical Details

The module:
- Hooks into `renderActorSheet5eCharacter` to add the Cultural Origin selector
- Stores the cultural origin selection in actor flags
- Automatically searches compendiums for the selected cultural origin
- Extracts and applies features/traits from the cultural origin background
- Removes old cultural origin features when changing to a new one

## Troubleshooting

### Cultural Origin Not Applying

- Make sure the cultural origin backgrounds are imported via Plutonium
- Check that the background names match exactly:
  - "Tharon Heritage"
  - "Kael Heritage"
  - "Calthran Heritage"
  - "Ashland Heritage"
  - "Lyra's Descendants"

### Dropdown Not Showing

- Ensure you're using D&D 5e system v3.0.0+
- Check browser console for errors (F12)
- Verify the module is enabled in Game Settings

### Features Not Automatically Added

The module creates feature items based on the background description. You may need to manually add:
- Skill proficiencies
- Language proficiencies
- Equipment

These should be added automatically by Plutonium when dragging the background to the character sheet, but the cultural origin must be selected via the dropdown for its features to apply.

## Compatibility

- **Foundry VTT**: v11+
- **D&D 5e System**: v3.0.0+
- **Plutonium**: Required for importing homebrew

## License

MIT License - Free to use and modify

## Support

For issues or questions, please check:
1. Make sure all backgrounds are imported correctly
2. Verify module is enabled
3. Check browser console for errors

## Changelog

### v1.0.0 (2026-01-22)
- Initial release
- Cultural Origin selector on character sheets
- Automatic feature application
- Integration with Plutonium imports
