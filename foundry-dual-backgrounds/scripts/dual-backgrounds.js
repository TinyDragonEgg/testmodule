/**
 * Aspects of Verun: Dual Backgrounds Module
 * Enables characters to have both a Profession background and a Cultural Origin background
 */

class DualBackgroundsManager {
  static ID = 'aspects-dual-backgrounds';

  static FLAGS = {
    CULTURAL_ORIGIN: 'culturalOrigin'
  };

  static CULTURAL_ORIGINS = [
    'Tharon Heritage',
    'Kael Heritage',
    'Calthran Heritage',
    'Ashland Heritage',
    "Lyra's Descendants"
  ];

  static log(...args) {
    console.log(`${this.ID} |`, ...args);
  }

  static initialize() {
    this.log('Initializing Dual Backgrounds system');

    Hooks.on('renderActorSheet5eCharacter', this.onRenderActorSheet.bind(this));
    Hooks.on('preUpdateActor', this.onPreUpdateActor.bind(this));

    this.log('Dual Backgrounds system initialized');
  }

  /**
   * Add Cultural Origin selector to character sheet
   */
  static async onRenderActorSheet(app, html, data) {
    const actor = app.actor;

    // Only apply to player characters
    if (actor.type !== 'character') return;

    // Find the background section
    const backgroundSection = html.find('.background');
    if (!backgroundSection.length) return;

    // Get current cultural origin
    const culturalOrigin = actor.getFlag(this.ID, this.FLAGS.CULTURAL_ORIGIN) || '';

    // Create cultural origin selector
    const culturalOriginHTML = `
      <div class="form-group cultural-origin-group">
        <label>Cultural Origin</label>
        <select name="flags.${this.ID}.${this.FLAGS.CULTURAL_ORIGIN}" data-dtype="String">
          <option value="">None</option>
          ${this.CULTURAL_ORIGINS.map(origin => `
            <option value="${origin}" ${culturalOrigin === origin ? 'selected' : ''}>${origin}</option>
          `).join('')}
        </select>
        <p class="hint">Choose your cultural heritage in addition to your profession background</p>
      </div>
    `;

    // Insert after the regular background field
    backgroundSection.after(culturalOriginHTML);
  }

  /**
   * Handle cultural origin changes
   */
  static async onPreUpdateActor(actor, changes, options, userId) {
    // Check if cultural origin is being changed
    const culturalOriginFlag = `flags.${this.ID}.${this.FLAGS.CULTURAL_ORIGIN}`;
    const newCulturalOrigin = getProperty(changes, culturalOriginFlag);

    if (newCulturalOrigin === undefined) return;

    const oldCulturalOrigin = actor.getFlag(this.ID, this.FLAGS.CULTURAL_ORIGIN);

    // If cultural origin is changing, update the actor
    if (newCulturalOrigin !== oldCulturalOrigin) {
      await this.applyCulturalOrigin(actor, newCulturalOrigin, oldCulturalOrigin);
    }
  }

  /**
   * Apply cultural origin background to character
   */
  static async applyCulturalOrigin(actor, newOrigin, oldOrigin) {
    this.log(`Applying cultural origin: ${newOrigin} (was: ${oldOrigin})`);

    // Remove old cultural origin items
    if (oldOrigin) {
      const oldItems = actor.items.filter(item =>
        item.type === 'feat' &&
        item.name.includes(oldOrigin)
      );

      if (oldItems.length > 0) {
        await actor.deleteEmbeddedDocuments('Item', oldItems.map(i => i.id));
      }
    }

    // Add new cultural origin
    if (newOrigin && newOrigin !== '') {
      // Search for the cultural origin background in compendiums
      const background = await this.findBackgroundInCompendiums(newOrigin);

      if (background) {
        // Get the background's features
        const features = await this.extractBackgroundFeatures(background);

        // Add features to character
        if (features.length > 0) {
          await actor.createEmbeddedDocuments('Item', features);
          ui.notifications.info(`Applied ${newOrigin} to character`);
        }
      } else {
        ui.notifications.warn(`Could not find background: ${newOrigin}. Make sure it's imported via Plutonium.`);
      }
    }
  }

  /**
   * Find background in compendiums
   */
  static async findBackgroundInCompendiums(backgroundName) {
    // Search in all compendiums
    for (let pack of game.packs) {
      if (pack.documentName === 'Item') {
        const index = await pack.getIndex();
        const entry = index.find(i => i.name === backgroundName);

        if (entry) {
          return await pack.getDocument(entry._id);
        }
      }
    }

    return null;
  }

  /**
   * Extract features from background
   */
  static async extractBackgroundFeatures(background) {
    const features = [];

    // Get background description and features
    if (background.system?.description?.value) {
      const description = background.system.description.value;

      // Create feature items from background
      // Feature: Cultural Feature
      const featureMatch = description.match(/Feature: ([^<]+)/i);
      if (featureMatch) {
        features.push({
          name: `${background.name} - Feature`,
          type: 'feat',
          img: background.img,
          system: {
            description: {
              value: description
            },
            source: background.system.source,
            activation: { type: 'special' },
            requirements: background.name
          }
        });
      }

      // Cultural Trait
      const traitMatch = description.match(/Cultural Trait: ([^<]+)/i);
      if (traitMatch) {
        features.push({
          name: `${background.name} - Cultural Trait`,
          type: 'feat',
          img: background.img,
          system: {
            description: {
              value: description
            },
            source: background.system.source,
            activation: { type: 'special' },
            requirements: background.name
          }
        });
      }
    }

    return features;
  }
}

// Initialize when ready
Hooks.once('ready', () => {
  DualBackgroundsManager.initialize();
});
