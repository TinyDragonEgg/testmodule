/**
 * Aspects of Verun: Dual Backgrounds Module
 * Enables characters to have both a Profession background and a Cultural Origin feature
 *
 * Based on research from:
 * - https://foundryvtt.wiki/en/development/guides/adding-inputs
 * - https://foundryvtt.com/api/modules/hookEvents.html
 */

class DualBackgroundsManager {
  static ID = 'aspects-dual-backgrounds';

  static FLAGS = {
    CULTURAL_ORIGIN: 'culturalOrigin'
  };

  static CULTURAL_ORIGINS = {
    'Tharon Heritage': {
      skill: 'ath',
      description: `You were raised in the Stratocracy of Tharon, where military service is the highest calling and honor guides all decisions.

      <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

      <strong>Equipment:</strong> Military dress uniform, regimental insignia, personal scales display (empty or with family's scales), and family military history document.

      <strong>Feature: Military Connections</strong>
      You understand Tharon's military hierarchy and protocols. You have contacts within the Stratocracy's military structure and can navigate military bureaucracy.

      <strong>Cultural Trait: Honor Bound</strong>
      You gain advantage on saving throws against being frightened when fighting alongside allies who share Tharon's military values.`
    },
    'Kael Heritage': {
      skill: 'arc',
      description: `You were raised in the Ascendancy of Kael, where scientific progress and technological superiority define worth.

      <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

      <strong>Equipment:</strong> Scientific notebook, alchemical components, Kael citizenship papers, technical diagrams, and research notes.

      <strong>Feature: Technical Knowledge</strong>
      You understand Kael's advanced technology and magical sciences. You have contacts among Kael's research institutions and can identify Kael military equipment.

      <strong>Cultural Trait: Analytical Mind</strong>
      You can use Investigation instead of Insight when trying to determine if someone is lying or hiding something.`
    },
    'Calthran Heritage': {
      skill: 'rel',
      description: `You were raised in the Covenant of Calthran, where death is temporary and the eternal war justifies all sacrifices.

      <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

      <strong>Equipment:</strong> Death cult religious symbol, resurrection tally marks, ceremonial blade, bone jewelry, and prayer beads.

      <strong>Feature: Death Familiarity</strong>
      You understand Calthran's necromantic resurrection systems and death-cult philosophy. You can navigate Calthran's religious hierarchy and identify resurrection facilities.

      <strong>Cultural Trait: Death's Embrace</strong>
      You have advantage on death saving throws and treat death as a temporary inconvenience rather than something to fear.`
    },
    'Ashland Heritage': {
      skill: 'sur',
      description: `You were raised among the nomadic tribes of the Ashlands, surviving in the lawless volcanic wastes between the three major powers.

      <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

      <strong>Equipment:</strong> Nomadic traveling gear, tribal identification tokens, desert survival supplies, animal partnership tokens, and navigation tools.

      <strong>Feature: Wasteland Navigation</strong>
      You know how to survive in volcanic badlands and can find water, shelter, and resources in seemingly barren terrain. Nomad groups recognize and trust you.

      <strong>Cultural Trait: Nomadic Resilience</strong>
      You have advantage on saving throws against extreme temperatures and environmental hazards. You need only half the normal amount of water to avoid exhaustion.`
    },
    "Lyra's Descendants": {
      skill: 'his',
      description: `You are descended from Ly'ra of Kael, the immortal Artillery Witch whose power sustains Kaeltharyn's barrier. Many descendants don't know their lineage - the bloodline has spread across all factions over generations through both legitimate and illegitimate lines.

      <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

      <strong>Equipment:</strong> Simple family heirloom (you may not know its significance), old letters or documents, worn traveling clothes, and a pouch containing 10 gp.

      <strong>Feature: Hidden Bloodline</strong>
      You may or may not know you're Lyra's descendant. If you discover or reveal your heritage, you gain recognition and reverence across Kaeltharyn factions. Artillery witches may sense something familiar about you. However, some may seek to use or control you because of your bloodline. Work with your DM to decide when/if you discover your heritage.

      <strong>Cultural Trait: Latent Artillery Affinity</strong>
      Whether you know your heritage or not, you have an innate understanding of destructive magic. When you cast a spell that deals damage, you can choose to have it deal force damage instead of its normal damage type (once per long rest). Additionally, you have advantage on Intelligence (Arcana) checks related to siege weapons or magical artillery.`
    }
  };

  static log(...args) {
    console.log(`${this.ID} |`, ...args);
  }

  static initialize() {
    this.log('Initializing Dual Backgrounds system');

    // D&D 5e v5.2.4+ (Foundry v13) uses CharacterActorSheet
    Hooks.on('renderCharacterActorSheet', this.onRenderActorSheet.bind(this));

    // Fallback for older versions
    Hooks.on('renderActorSheet5eCharacter', this.onRenderActorSheet.bind(this));
    Hooks.on('renderActorSheet5eCharacter2', this.onRenderActorSheet.bind(this));
    Hooks.on('renderActorSheet', this.onRenderActorSheet.bind(this));

    // Hook for actor updates
    Hooks.on('preUpdateActor', this.onPreUpdateActor.bind(this));

    this.log('Dual Backgrounds system initialized');
    this.log('Hooks registered: renderCharacterActorSheet, renderActorSheet5eCharacter, renderActorSheet');
  }

  /**
   * Add Cultural Origin selector to character sheet
   */
  static async onRenderActorSheet(app, html, data) {
    const actor = app.actor;

    // Only apply to player characters
    if (actor.type !== 'character') return;

    this.log('Rendering on character sheet for', actor.name);
    this.log('HTML element type:', html instanceof jQuery ? 'jQuery' : 'HTMLElement');

    // Check if already added to prevent duplicates
    const existing = html instanceof jQuery
      ? html.find('.cultural-origin-group').length > 0
      : html.querySelector('.cultural-origin-group');

    if (existing) {
      this.log('Cultural origin selector already present');
      return;
    }

    // Get current cultural origin
    const culturalOrigin = actor.getFlag(this.ID, this.FLAGS.CULTURAL_ORIGIN) || '';

    // Create cultural origin selector HTML
    const culturalOriginHTML = `
      <div class="form-group cultural-origin-group" style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 4px;">
        <label style="font-weight: bold; display: block; margin-bottom: 5px;">Cultural Origin</label>
        <select name="flags.${this.ID}.${this.FLAGS.CULTURAL_ORIGIN}" data-dtype="String" style="width: 100%;">
          <option value="">None</option>
          ${Object.keys(this.CULTURAL_ORIGINS).map(origin => `
            <option value="${origin}" ${culturalOrigin === origin ? 'selected' : ''}>${origin}</option>
          `).join('')}
        </select>
        <p class="hint" style="font-size: 0.85em; font-style: italic; margin-top: 4px;">Choose your cultural heritage in addition to your profession background</p>
      </div>
    `;

    // Try multiple insertion points
    let inserted = false;

    if (html instanceof jQuery) {
      // jQuery version (V1 sheets)
      const selectors = [
        '.tab.biography',
        '.tab[data-tab="biography"]',
        '.sheet-body .tab.biography',
        '.biography',
        '.tab.description'
      ];

      for (const selector of selectors) {
        const target = html.find(selector).first();
        if (target.length) {
          target.prepend(culturalOriginHTML);
          this.log(`Inserted via jQuery selector: ${selector}`);
          inserted = true;
          break;
        }
      }
    } else {
      // Vanilla JS version (V2 sheets)
      const selectors = [
        '.tab.biography',
        '.tab[data-tab="biography"]',
        '.sheet-body .tab.biography',
        '.biography',
        '.tab.description',
        '[data-tab="biography"]'
      ];

      for (const selector of selectors) {
        const target = html.querySelector(selector);
        if (target) {
          target.insertAdjacentHTML('afterbegin', culturalOriginHTML);
          this.log(`Inserted via selector: ${selector}`);
          inserted = true;
          break;
        }
      }
    }

    if (!inserted) {
      this.log('WARNING: Could not find suitable location to insert cultural origin selector');
      this.log('Available selectors:', html instanceof jQuery
        ? Array.from(html.find('*')).slice(0, 20).map(el => el.className)
        : Array.from(html.querySelectorAll('*')).slice(0, 20).map(el => el.className)
      );
    } else {
      this.log('Cultural origin selector added successfully');
    }
  }

  /**
   * Handle cultural origin changes
   */
  static async onPreUpdateActor(actor, changes, options, userId) {
    // Check if cultural origin is being changed
    const culturalOriginFlag = `flags.${this.ID}.${this.FLAGS.CULTURAL_ORIGIN}`;
    const newCulturalOrigin = foundry.utils.getProperty(changes, culturalOriginFlag);

    if (newCulturalOrigin === undefined) return;

    const oldCulturalOrigin = actor.getFlag(this.ID, this.FLAGS.CULTURAL_ORIGIN);

    // If cultural origin is changing, update the actor
    if (newCulturalOrigin !== oldCulturalOrigin) {
      await this.applyCulturalOrigin(actor, newCulturalOrigin, oldCulturalOrigin);
    }
  }

  /**
   * Apply cultural origin as a feature
   */
  static async applyCulturalOrigin(actor, newOrigin, oldOrigin) {
    this.log(`Applying cultural origin: ${newOrigin} (was: ${oldOrigin})`);

    // Remove old cultural origin feature
    if (oldOrigin) {
      const oldItems = actor.items.filter(item =>
        item.type === 'feat' &&
        item.name === oldOrigin &&
        item.flags?.[this.ID]?.isCulturalOrigin
      );

      if (oldItems.length > 0) {
        await actor.deleteEmbeddedDocuments('Item', oldItems.map(i => i.id));
        this.log(`Removed old cultural origin feature`);
      }

      // Remove skill proficiency from old origin
      const oldSkill = this.CULTURAL_ORIGINS[oldOrigin]?.skill;
      if (oldSkill) {
        const skillPath = `system.skills.${oldSkill}.proficient`;
        await actor.update({ [skillPath]: 0 });
      }
    }

    // Add new cultural origin
    if (newOrigin && newOrigin !== '' && this.CULTURAL_ORIGINS[newOrigin]) {
      const originData = this.CULTURAL_ORIGINS[newOrigin];

      // Create the feature item
      const featureData = {
        name: newOrigin,
        type: 'feat',
        img: 'icons/environment/people/group.webp',
        system: {
          description: {
            value: originData.description,
            chat: '',
            unidentified: ''
          },
          source: 'Aspects of Verun',
          activation: {
            type: 'special',
            cost: null,
            condition: ''
          },
          duration: {
            value: null,
            units: ''
          },
          target: {
            value: null,
            width: null,
            units: '',
            type: ''
          },
          range: {
            value: null,
            long: null,
            units: ''
          },
          uses: {
            value: null,
            max: '',
            per: null,
            recovery: ''
          },
          consume: {
            type: '',
            target: null,
            amount: null
          },
          ability: null,
          actionType: '',
          attackBonus: '',
          chatFlavor: '',
          critical: {
            threshold: null,
            damage: ''
          },
          damage: {
            parts: [],
            versatile: ''
          },
          formula: '',
          save: {
            ability: '',
            dc: null,
            scaling: 'spell'
          },
          requirements: 'Cultural Origin',
          recharge: {
            value: null,
            charged: false
          }
        },
        flags: {
          [this.ID]: {
            isCulturalOrigin: true,
            skill: originData.skill
          }
        }
      };

      await actor.createEmbeddedDocuments('Item', [featureData]);

      // Add skill proficiency
      if (originData.skill) {
        const skillPath = `system.skills.${originData.skill}.proficient`;
        await actor.update({ [skillPath]: 1 });
        this.log(`Added ${originData.skill} proficiency`);
      }

      ui.notifications.info(`Applied ${newOrigin}. Remember to add your language manually!`);
      this.log('Cultural origin applied successfully');
    }
  }
}

// Initialize when ready
Hooks.once('ready', () => {
  DualBackgroundsManager.initialize();
});
