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
      mainFeature: {
        name: 'Tharon Heritage',
        description: `You were raised in the Stratocracy of Tharon, where military service is the highest calling and honor guides all decisions.

        <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

        <strong>Equipment:</strong> Military dress uniform, regimental insignia, personal scales display (empty or with family's scales), and family military history document.`
      },
      specialFeature: {
        name: 'Military Connections',
        description: `You understand Tharon's military hierarchy and protocols. You have contacts within the Stratocracy's military structure and can navigate military bureaucracy.`
      },
      culturalTrait: {
        name: 'Honor Bound',
        description: `You gain advantage on saving throws against being frightened when fighting alongside allies who share Tharon's military values.`
      },
      equipment: [
        { name: 'Military Dress Uniform', type: 'equipment' },
        { name: 'Regimental Insignia', type: 'equipment' },
        { name: 'Personal Scales Display', type: 'equipment' },
        { name: 'Family Military History Document', type: 'loot' }
      ]
    },
    'Kael Heritage': {
      skill: 'arc',
      mainFeature: {
        name: 'Kael Heritage',
        description: `You were raised in the Ascendancy of Kael, where scientific progress and technological superiority define worth.

        <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

        <strong>Equipment:</strong> Scientific notebook, alchemical components, Kael citizenship papers, technical diagrams, and research notes.`
      },
      specialFeature: {
        name: 'Technical Knowledge',
        description: `You understand Kael's advanced technology and magical sciences. You have contacts among Kael's research institutions and can identify Kael military equipment.`
      },
      culturalTrait: {
        name: 'Analytical Mind',
        description: `You can use Investigation instead of Insight when trying to determine if someone is lying or hiding something.`
      },
      equipment: [
        { name: 'Scientific Notebook', type: 'loot' },
        { name: 'Alchemical Components', type: 'consumable' },
        { name: 'Kael Citizenship Papers', type: 'loot' },
        { name: 'Technical Diagrams', type: 'loot' },
        { name: 'Research Notes', type: 'loot' }
      ]
    },
    'Calthran Heritage': {
      skill: 'rel',
      mainFeature: {
        name: 'Calthran Heritage',
        description: `You were raised in the Covenant of Calthran, where death is temporary and the eternal war justifies all sacrifices.

        <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

        <strong>Equipment:</strong> Death cult religious symbol, resurrection tally marks, ceremonial blade, bone jewelry, and prayer beads.`
      },
      specialFeature: {
        name: 'Death Familiarity',
        description: `You understand Calthran's necromantic resurrection systems and death-cult philosophy. You can navigate Calthran's religious hierarchy and identify resurrection facilities.`
      },
      culturalTrait: {
        name: "Death's Embrace",
        description: `You have advantage on death saving throws and treat death as a temporary inconvenience rather than something to fear.`
      },
      equipment: [
        { name: 'Death Cult Religious Symbol', type: 'equipment' },
        { name: 'Resurrection Tally Marks', type: 'loot' },
        { name: 'Ceremonial Blade', type: 'weapon', weaponType: 'simpleM' },
        { name: 'Bone Jewelry', type: 'equipment' },
        { name: 'Prayer Beads', type: 'equipment' }
      ]
    },
    'Ashland Heritage': {
      skill: 'sur',
      mainFeature: {
        name: 'Ashland Heritage',
        description: `You were raised among the nomadic tribes of the Ashlands, surviving in the lawless volcanic wastes between the three major powers.

        <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

        <strong>Equipment:</strong> Nomadic traveling gear, tribal identification tokens, desert survival supplies, animal partnership tokens, and navigation tools.`
      },
      specialFeature: {
        name: 'Wasteland Navigation',
        description: `You know how to survive in volcanic badlands and can find water, shelter, and resources in seemingly barren terrain. Nomad groups recognize and trust you.`
      },
      culturalTrait: {
        name: 'Nomadic Resilience',
        description: `You have advantage on saving throws against extreme temperatures and environmental hazards. You need only half the normal amount of water to avoid exhaustion.`
      },
      equipment: [
        { name: 'Nomadic Traveling Gear', type: 'equipment' },
        { name: 'Tribal Identification Tokens', type: 'loot' },
        { name: 'Desert Survival Supplies', type: 'consumable' },
        { name: 'Animal Partnership Tokens', type: 'loot' },
        { name: 'Navigation Tools', type: 'tool' }
      ]
    },
    "Lyra's Descendants": {
      skill: 'his',
      mainFeature: {
        name: "Lyra's Descendants",
        description: `You are descended from Ly'ra of Kael, the immortal Artillery Witch whose power sustains Kaeltharyn's barrier. Many descendants don't know their lineage - the bloodline has spread across all factions over generations through both legitimate and illegitimate lines.

        <strong>Language:</strong> You can speak, read, and write one additional language of your choice.

        <strong>Equipment:</strong> Simple family heirloom (you may not know its significance), old letters or documents, worn traveling clothes, and a pouch containing 10 gp.`
      },
      specialFeature: {
        name: 'Hidden Bloodline',
        description: `You may or may not know you're Lyra's descendant. If you discover or reveal your heritage, you gain recognition and reverence across Kaeltharyn factions. Artillery witches may sense something familiar about you. However, some may seek to use or control you because of your bloodline. Work with your DM to decide when/if you discover your heritage.`
      },
      culturalTrait: {
        name: 'Latent Artillery Affinity',
        description: `Whether you know your heritage or not, you have an innate understanding of destructive magic. When you cast a spell that deals damage, you can choose to have it deal force damage instead of its normal damage type (once per long rest). Additionally, you have advantage on Intelligence (Arcana) checks related to siege weapons or magical artillery.`
      },
      equipment: [
        { name: 'Simple Family Heirloom', type: 'loot' },
        { name: 'Old Letters or Documents', type: 'loot' },
        { name: 'Worn Traveling Clothes', type: 'equipment' },
        { name: 'Pouch (10 gp)', type: 'loot' }
      ]
    }
  };

  static log(...args) {
    console.log(`${this.ID} |`, ...args);
  }

  static initialize() {
    this.log('Initializing Dual Backgrounds system');

    // Register game settings
    game.settings.register(this.ID, 'customCulturalOrigins', {
      name: 'Custom Cultural Origins',
      hint: 'Custom cultural origins added by the GM',
      scope: 'world',
      config: false,
      type: Object,
      default: {}
    });

    // Register settings menu
    game.settings.registerMenu(this.ID, 'culturalOriginsConfig', {
      name: 'Configure Cultural Origins',
      label: 'Manage Cultural Origins',
      hint: 'Add, edit, or remove cultural origins',
      icon: 'fas fa-cogs',
      type: CulturalOriginsConfig,
      restricted: true
    });

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
   * Get all cultural origins (built-in + custom)
   */
  static getAllCulturalOrigins() {
    const customOrigins = game.settings.get(this.ID, 'customCulturalOrigins') || {};
    return { ...this.CULTURAL_ORIGINS, ...customOrigins };
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

    // Get all cultural origins (built-in + custom)
    const allOrigins = this.getAllCulturalOrigins();

    // Check if sheet is in edit mode (editable property exists in data object)
    const isEditable = data.editable !== false;

    // Get the display name for the current origin
    const displayName = culturalOrigin || 'None';

    // Create cultural origin selector HTML (edit mode) or display HTML (view mode)
    const culturalOriginHTML = isEditable ? `
      <div class="form-group cultural-origin-group" style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 4px;">
        <label style="font-weight: bold; display: block; margin-bottom: 5px;">Cultural Origin</label>
        <select name="flags.${this.ID}.${this.FLAGS.CULTURAL_ORIGIN}" data-dtype="String" style="width: 100%;">
          <option value="">None</option>
          ${Object.keys(allOrigins).map(origin => `
            <option value="${origin}" ${culturalOrigin === origin ? 'selected' : ''}>${origin}</option>
          `).join('')}
        </select>
        <p class="hint" style="font-size: 0.85em; font-style: italic; margin-top: 4px;">Choose your cultural heritage in addition to your profession background</p>
      </div>
    ` : `
      <div class="form-group cultural-origin-group" style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 4px;">
        <label style="font-weight: bold; display: block; margin-bottom: 5px;">Cultural Origin</label>
        <div style="padding: 6px 0; font-size: 1em;">${displayName}</div>
        <p class="hint" style="font-size: 0.85em; font-style: italic; margin-top: 4px; color: #666;">Your cultural heritage (click Edit to change)</p>
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
   * Apply cultural origin as 3 separate features + equipment
   */
  static async applyCulturalOrigin(actor, newOrigin, oldOrigin) {
    this.log(`Applying cultural origin: ${newOrigin} (was: ${oldOrigin})`);

    // Remove old cultural origin features and equipment
    if (oldOrigin) {
      const oldItems = actor.items.filter(item =>
        item.flags?.[this.ID]?.isCulturalOrigin
      );

      if (oldItems.length > 0) {
        await actor.deleteEmbeddedDocuments('Item', oldItems.map(i => i.id));
        this.log(`Removed ${oldItems.length} old cultural origin items`);
      }

      // Remove skill proficiency from old origin
      const allOrigins = this.getAllCulturalOrigins();
      const oldSkill = allOrigins[oldOrigin]?.skill;
      if (oldSkill) {
        const skillPath = `system.skills.${oldSkill}.proficient`;
        await actor.update({ [skillPath]: 0 });
      }
    }

    // Add new cultural origin
    const allOrigins = this.getAllCulturalOrigins();
    if (newOrigin && newOrigin !== '' && allOrigins[newOrigin]) {
      const originData = allOrigins[newOrigin];
      const itemsToCreate = [];

      // Feature 1: Main cultural heritage feature
      itemsToCreate.push({
        name: originData.mainFeature.name,
        type: 'feat',
        img: 'icons/environment/people/group.webp',
        system: {
          description: {
            value: originData.mainFeature.description,
            chat: ''
          },
          source: {
            custom: 'Aspects of Verun',
            book: '',
            page: '',
            license: '',
            rules: '2014',
            revision: 1
          },
          type: {
            value: 'background',
            subtype: ''
          },
          properties: [],
          uses: {
            max: '',
            recovery: [],
            spent: 0
          },
          advancement: [],
          activities: {},
          identifier: originData.mainFeature.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
          crewed: false,
          enchant: {},
          prerequisites: {
            items: [],
            repeatable: false,
            level: null
          },
          requirements: 'Cultural Origin'
        },
        flags: {
          [this.ID]: {
            isCulturalOrigin: true,
            featureType: 'main'
          }
        }
      });

      // Feature 2: Special feature
      itemsToCreate.push({
        name: originData.specialFeature.name,
        type: 'feat',
        img: 'icons/sundries/books/book-symbol-eye.webp',
        system: {
          description: {
            value: originData.specialFeature.description,
            chat: ''
          },
          source: {
            custom: 'Aspects of Verun',
            book: '',
            page: '',
            license: '',
            rules: '2014',
            revision: 1
          },
          type: {
            value: 'background',
            subtype: ''
          },
          properties: [],
          uses: {
            max: '',
            recovery: [],
            spent: 0
          },
          advancement: [],
          activities: {},
          identifier: originData.specialFeature.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
          crewed: false,
          enchant: {},
          prerequisites: {
            items: [],
            repeatable: false,
            level: null
          },
          requirements: 'Cultural Origin'
        },
        flags: {
          [this.ID]: {
            isCulturalOrigin: true,
            featureType: 'special'
          }
        }
      });

      // Feature 3: Cultural trait
      itemsToCreate.push({
        name: originData.culturalTrait.name,
        type: 'feat',
        img: 'icons/magic/symbols/runes-star-pentagon-blue.webp',
        system: {
          description: {
            value: originData.culturalTrait.description,
            chat: ''
          },
          source: {
            custom: 'Aspects of Verun',
            book: '',
            page: '',
            license: '',
            rules: '2014',
            revision: 1
          },
          type: {
            value: 'background',
            subtype: ''
          },
          properties: [],
          uses: {
            max: '',
            recovery: [],
            spent: 0
          },
          advancement: [],
          activities: {},
          identifier: originData.culturalTrait.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
          crewed: false,
          enchant: {},
          prerequisites: {
            items: [],
            repeatable: false,
            level: null
          },
          requirements: 'Cultural Origin'
        },
        flags: {
          [this.ID]: {
            isCulturalOrigin: true,
            featureType: 'trait'
          }
        }
      });

      // Add equipment items
      if (originData.equipment) {
        for (const equipItem of originData.equipment) {
          const itemData = {
            name: equipItem.name,
            type: equipItem.type,
            img: this.getEquipmentIcon(equipItem.type),
            system: {
              description: { value: '', chat: '', unidentified: '' },
              source: 'Aspects of Verun',
              quantity: 1,
              weight: 0,
              price: { value: 0, denomination: 'gp' },
              attunement: 0,
              equipped: false,
              rarity: '',
              identified: true
            },
            flags: {
              [this.ID]: {
                isCulturalOrigin: true,
                featureType: 'equipment'
              }
            }
          };

          // Special handling for weapons
          if (equipItem.type === 'weapon' && equipItem.weaponType) {
            itemData.system.weaponType = equipItem.weaponType;
            itemData.system.properties = {};
          }

          itemsToCreate.push(itemData);
        }
      }

      // Create all items at once
      await actor.createEmbeddedDocuments('Item', itemsToCreate);
      this.log(`Created ${itemsToCreate.length} items for ${newOrigin}`);

      // Add skill proficiency
      if (originData.skill) {
        try {
          const skillPath = `system.skills.${originData.skill}.proficient`;
          const currentValue = foundry.utils.getProperty(actor, skillPath);
          this.log(`Current skill value for ${originData.skill}:`, currentValue);

          await actor.update({ [skillPath]: 1 });
          this.log(`Added ${originData.skill} proficiency (set to 1)`);

          // Verify it was set
          const newValue = foundry.utils.getProperty(actor, skillPath);
          this.log(`New skill value for ${originData.skill}:`, newValue);
        } catch (err) {
          this.log('Error adding skill proficiency:', err);
          ui.notifications.warn(`Failed to add ${originData.skill} proficiency. Please add manually.`);
        }
      }

      // Show language selection dialog
      const selectedLanguage = await this.showLanguageDialog();
      if (selectedLanguage) {
        // Add language to actor's traits
        const languageKey = selectedLanguage.toLowerCase().replace(/\s+/g, '');

        try {
          // D&D 5e v5.2.4+ uses Set for languages
          const currentLanguages = actor.system.traits?.languages?.value;

          this.log(`Current languages:`, currentLanguages);
          this.log(`Attempting to add language: ${selectedLanguage} (key: ${languageKey})`);

          if (currentLanguages instanceof Set) {
            // v5.2.4+ uses Set
            if (!currentLanguages.has(languageKey) && !currentLanguages.has(selectedLanguage.toLowerCase())) {
              const updatedLanguages = new Set(currentLanguages);
              updatedLanguages.add(languageKey);
              await actor.update({ 'system.traits.languages.value': Array.from(updatedLanguages) });
              this.log(`Added language: ${selectedLanguage}`);
              ui.notifications.info(`Applied ${newOrigin} with ${selectedLanguage} language!`);
            } else {
              ui.notifications.info(`Applied ${newOrigin}. ${selectedLanguage} was already known!`);
            }
          } else if (Array.isArray(currentLanguages)) {
            // Older versions use Array
            if (!currentLanguages.includes(languageKey) && !currentLanguages.includes(selectedLanguage.toLowerCase())) {
              const updatedLanguages = [...currentLanguages, languageKey];
              await actor.update({ 'system.traits.languages.value': updatedLanguages });
              this.log(`Added language: ${selectedLanguage}`);
              ui.notifications.info(`Applied ${newOrigin} with ${selectedLanguage} language!`);
            } else {
              ui.notifications.info(`Applied ${newOrigin}. ${selectedLanguage} was already known!`);
            }
          } else {
            // Fallback if structure is unknown
            await actor.update({ 'system.traits.languages.value': [languageKey] });
            this.log(`Added language: ${selectedLanguage}`);
            ui.notifications.info(`Applied ${newOrigin} with ${selectedLanguage} language!`);
          }
        } catch (err) {
          this.log('Error adding language:', err);
          ui.notifications.warn(`Applied ${newOrigin}. Please add ${selectedLanguage} manually from the character sheet.`);
        }
      } else {
        ui.notifications.info(`Applied ${newOrigin}. Add your language manually from the character sheet.`);
      }

      this.log('Cultural origin applied successfully');
    }
  }

  /**
   * Show language selection dialog
   */
  static async showLanguageDialog() {
    return new Promise((resolve) => {
      const languages = [
        'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
        'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
      ];

      const content = `
        <form>
          <div class="form-group">
            <label>Choose your bonus language:</label>
            <select id="language-select" style="width: 100%; margin-top: 8px;">
              ${languages.map(lang => `<option value="${lang}">${lang}</option>`).join('')}
            </select>
          </div>
        </form>
      `;

      new Dialog({
        title: 'Choose Language',
        content: content,
        buttons: {
          confirm: {
            icon: '<i class="fas fa-check"></i>',
            label: 'Confirm',
            callback: (html) => {
              const selected = html.find('#language-select').val();
              resolve(selected);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Skip',
            callback: () => resolve(null)
          }
        },
        default: 'confirm'
      }).render(true);
    });
  }

  /**
   * Get appropriate icon for equipment type
   */
  static getEquipmentIcon(type) {
    const icons = {
      'weapon': 'icons/weapons/swords/sword-broad-steel.webp',
      'equipment': 'icons/containers/bags/pack-leather-white-tan.webp',
      'loot': 'icons/sundries/documents/document-sealed-brown-red.webp',
      'consumable': 'icons/consumables/potions/bottle-round-corked-purple.webp',
      'tool': 'icons/tools/hand/hammer-simple-metal-brown.webp'
    };
    return icons[type] || 'icons/sundries/misc/box-wooden.webp';
  }
}

/**
 * Configuration form for managing cultural origins
 */
class CulturalOriginsConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'cultural-origins-config',
      title: 'Cultural Origins Configuration',
      template: 'modules/aspects-dual-backgrounds/templates/config.html',
      width: 720,
      height: 'auto',
      closeOnSubmit: true,
      tabs: [{ navSelector: '.tabs', contentSelector: '.content', initial: 'origins' }]
    });
  }

  async getData() {
    const customOrigins = game.settings.get(DualBackgroundsManager.ID, 'customCulturalOrigins') || {};
    const builtInOrigins = DualBackgroundsManager.CULTURAL_ORIGINS;

    return {
      builtInOrigins: Object.keys(builtInOrigins),
      customOrigins: Object.entries(customOrigins).map(([name, data]) => ({
        name,
        ...data
      }))
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.add-origin').click(this._onAddOrigin.bind(this));
    html.find('.edit-origin').click(this._onEditOrigin.bind(this));
    html.find('.delete-origin').click(this._onDeleteOrigin.bind(this));
    html.find('.export-origins').click(this._onExportOrigins.bind(this));
    html.find('.import-origins').click(this._onImportOrigins.bind(this));
  }

  async _onAddOrigin(event) {
    event.preventDefault();
    const editor = new CulturalOriginEditor(null);
    editor.render(true);
  }

  async _onEditOrigin(event) {
    event.preventDefault();
    const originName = $(event.currentTarget).data('origin');
    const customOrigins = game.settings.get(DualBackgroundsManager.ID, 'customCulturalOrigins') || {};
    const originData = customOrigins[originName];

    if (originData) {
      const editor = new CulturalOriginEditor({ name: originName, ...originData });
      editor.render(true);
    }
  }

  async _onDeleteOrigin(event) {
    event.preventDefault();
    const originName = $(event.currentTarget).data('origin');

    const confirmed = await Dialog.confirm({
      title: 'Delete Cultural Origin',
      content: `<p>Are you sure you want to delete <strong>${originName}</strong>?</p>`,
      yes: () => true,
      no: () => false
    });

    if (confirmed) {
      const customOrigins = game.settings.get(DualBackgroundsManager.ID, 'customCulturalOrigins') || {};
      delete customOrigins[originName];
      await game.settings.set(DualBackgroundsManager.ID, 'customCulturalOrigins', customOrigins);
      this.render();
      ui.notifications.info(`Deleted ${originName}`);
    }
  }

  async _onExportOrigins(event) {
    event.preventDefault();
    const customOrigins = game.settings.get(DualBackgroundsManager.ID, 'customCulturalOrigins') || {};
    const dataStr = JSON.stringify(customOrigins, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cultural-origins.json';
    link.click();
  }

  async _onImportOrigins(event) {
    event.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const importedOrigins = JSON.parse(event.target.result);
          const customOrigins = game.settings.get(DualBackgroundsManager.ID, 'customCulturalOrigins') || {};
          const merged = { ...customOrigins, ...importedOrigins };
          await game.settings.set(DualBackgroundsManager.ID, 'customCulturalOrigins', merged);
          this.render();
          ui.notifications.info('Cultural origins imported successfully!');
        } catch (err) {
          ui.notifications.error('Failed to import cultural origins. Invalid JSON file.');
          console.error(err);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }

  async _updateObject(event, formData) {
    // Form submission handled by individual editors
  }
}

/**
 * Editor form for a single cultural origin
 */
class CulturalOriginEditor extends FormApplication {
  constructor(originData) {
    super();
    this.originData = originData || {
      name: '',
      skill: 'his',
      mainFeature: { name: '', description: '' },
      specialFeature: { name: '', description: '' },
      culturalTrait: { name: '', description: '' },
      equipment: []
    };
    this.isNew = !originData;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'cultural-origin-editor',
      title: 'Edit Cultural Origin',
      template: 'modules/aspects-dual-backgrounds/templates/editor.html',
      width: 600,
      height: 'auto',
      closeOnSubmit: true
    });
  }

  getData() {
    const skills = {
      'acr': 'Acrobatics', 'ani': 'Animal Handling', 'arc': 'Arcana', 'ath': 'Athletics',
      'dec': 'Deception', 'his': 'History', 'ins': 'Insight', 'itm': 'Intimidation',
      'inv': 'Investigation', 'med': 'Medicine', 'nat': 'Nature', 'prc': 'Perception',
      'prf': 'Performance', 'per': 'Persuasion', 'rel': 'Religion', 'slt': 'Sleight of Hand',
      'ste': 'Stealth', 'sur': 'Survival'
    };

    return {
      origin: this.originData,
      skills: skills,
      isNew: this.isNew
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.add-equipment').click(this._onAddEquipment.bind(this));
    html.find('.remove-equipment').click(this._onRemoveEquipment.bind(this));
  }

  _onAddEquipment(event) {
    event.preventDefault();
    if (!this.originData.equipment) this.originData.equipment = [];
    this.originData.equipment.push({ name: 'New Item', type: 'equipment' });
    this.render();
  }

  _onRemoveEquipment(event) {
    event.preventDefault();
    const index = $(event.currentTarget).data('index');
    this.originData.equipment.splice(index, 1);
    this.render();
  }

  async _updateObject(event, formData) {
    const customOrigins = game.settings.get(DualBackgroundsManager.ID, 'customCulturalOrigins') || {};

    // Build origin object from form data
    const originName = formData['name'];
    const originObj = {
      skill: formData['skill'],
      mainFeature: {
        name: formData['mainFeature.name'],
        description: formData['mainFeature.description']
      },
      specialFeature: {
        name: formData['specialFeature.name'],
        description: formData['specialFeature.description']
      },
      culturalTrait: {
        name: formData['culturalTrait.name'],
        description: formData['culturalTrait.description']
      },
      equipment: []
    };

    // Parse equipment items
    const equipmentNames = formData['equipment.name'];
    const equipmentTypes = formData['equipment.type'];

    if (Array.isArray(equipmentNames)) {
      for (let i = 0; i < equipmentNames.length; i++) {
        originObj.equipment.push({
          name: equipmentNames[i],
          type: equipmentTypes[i]
        });
      }
    } else if (equipmentNames) {
      originObj.equipment.push({
        name: equipmentNames,
        type: equipmentTypes
      });
    }

    // Delete old name if renamed
    if (!this.isNew && originName !== this.originData.name) {
      delete customOrigins[this.originData.name];
    }

    customOrigins[originName] = originObj;
    await game.settings.set(DualBackgroundsManager.ID, 'customCulturalOrigins', customOrigins);

    ui.notifications.info(`${this.isNew ? 'Created' : 'Updated'} ${originName}`);

    // Re-render the config window if it's open
    Object.values(ui.windows).forEach(app => {
      if (app instanceof CulturalOriginsConfig) {
        app.render();
      }
    });
  }
}

// Initialize when ready
Hooks.once('ready', () => {
  DualBackgroundsManager.initialize();
});
