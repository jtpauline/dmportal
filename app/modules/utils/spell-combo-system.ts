import { Character } from '../characters';
import { Spell, SpellEffect, SpellSystem } from './spell-system';
import { SpellCastingSystem } from './spell-casting-system';

export interface SpellCombo {
  id: string;
  name: string;
  description: string;
  spells: string[];
  requiredLevel: number;
  effects: SpellEffect[];
  compatibleClasses: string[];
}

export interface SpellComboResult {
  success: boolean;
  combinedEffects: SpellEffect[];
  resourceCost: {
    spellSlots: Record<number, number>;
    materialComponents: string[];
  };
  potentialRisks?: string[];
}

export class SpellComboSystem {
  /**
   * Predefined spell combos for advanced magical interactions
   */
  private static predefinedCombos: SpellCombo[] = [
    {
      id: 'elemental-surge',
      name: 'Elemental Surge',
      description: 'Combine elemental spells for amplified effects',
      spells: ['fire-bolt', 'ray-of-frost', 'lightning-bolt'],
      requiredLevel: 5,
      effects: [
        {
          type: 'damage',
          value: '2d10 + spellcasting modifier elemental damage',
          savingThrow: {
            ability: 'dexterity',
            difficulty: 15,
            partialOnSuccess: true
          }
        }
      ],
      compatibleClasses: ['Wizard', 'Sorcerer']
    },
    {
      id: 'protective-ward',
      name: 'Protective Ward',
      description: 'Combine defensive spells for enhanced protection',
      spells: ['shield', 'mage-armor', 'absorb-elements'],
      requiredLevel: 3,
      effects: [
        {
          type: 'buff',
          value: '+2 AC and resistance to elemental damage',
          duration: '1 minute'
        }
      ],
      compatibleClasses: ['Wizard', 'Paladin', 'Cleric']
    }
  ];

  /**
   * Analyze potential spell combos for a character
   * @param character Character analyzing spell combos
   * @returns Available spell combos
   */
  static analyzeAvailableCombos(character: Character): SpellCombo[] {
    const characterSpells = character.spells || [];
    
    return this.predefinedCombos.filter(combo => 
      // Check character level requirement
      character.level >= combo.requiredLevel &&
      
      // Check class compatibility
      combo.compatibleClasses.includes(character.class) &&
      
      // Check if character knows all required spells
      combo.spells.every(spellId => 
        characterSpells.some(spell => spell.id === spellId)
      )
    );
  }

  /**
   * Execute a spell combo
   * @param character Character executing the combo
   * @param comboId Identifier of the spell combo
   * @returns Comprehensive spell combo result
   */
  static executeSpellCombo(
    character: Character, 
    comboId: string
  ): SpellComboResult {
    // Find the specific combo
    const combo = this.predefinedCombos.find(c => c.id === comboId);
    
    if (!combo) {
      return {
        success: false,
        combinedEffects: [],
        resourceCost: {
          spellSlots: {},
          materialComponents: []
        },
        potentialRisks: ['Combo not found']
      };
    }

    // Validate combo prerequisites
    const validationResult = this.validateSpellCombo(character, combo);
    
    if (!validationResult.success) {
      return validationResult;
    }

    // Retrieve specific spells for the combo
    const comboSpells = character.spells?.filter(
      spell => combo.spells.includes(spell.id)
    ) || [];

    // Calculate combined effects
    const combinedEffects = this.calculateCombinedEffects(
      character, 
      comboSpells, 
      combo
    );

    // Calculate resource cost
    const resourceCost = this.calculateResourceCost(
      character, 
      comboSpells
    );

    return {
      success: true,
      combinedEffects,
      resourceCost,
      potentialRisks: this.assessComboRisks(character, combo)
    };
  }

  /**
   * Validate spell combo prerequisites
   * @param character Character attempting the combo
   * @param combo Spell combo to validate
   * @returns Validation result
   */
  private static validateSpellCombo(
    character: Character, 
    combo: SpellCombo
  ): SpellComboResult {
    const errors: string[] = [];

    // Check character level
    if (character.level < combo.requiredLevel) {
      errors.push(`Requires level ${combo.requiredLevel}`);
    }

    // Check class compatibility
    if (!combo.compatibleClasses.includes(character.class)) {
      errors.push('Incompatible character class');
    }

    // Check spell availability
    const missingSpells = combo.spells.filter(
      spellId => !character.spells?.some(spell => spell.id === spellId)
    );

    if (missingSpells.length > 0) {
      errors.push(`Missing spells: ${missingSpells.join(', ')}`);
    }

    return {
      success: errors.length === 0,
      combinedEffects: [],
      resourceCost: {
        spellSlots: {},
        materialComponents: []
      },
      potentialRisks: errors
    };
  }

  /**
   * Calculate combined effects for a spell combo
   * @param character Character executing the combo
   * @param comboSpells Spells involved in the combo
   * @param combo Spell combo definition
   * @returns Combined spell effects
   */
  private static calculateCombinedEffects(
    character: Character, 
    comboSpells: Spell[], 
    combo: SpellCombo
  ): SpellEffect[] {
    // Calculate base combo effects
    const baseEffects = combo.effects.map(effect => {
      // Modify effect based on character's spellcasting ability
      return {
        ...effect,
        value: effect.value.replace(
          'spellcasting modifier', 
          SpellSystem.calculateSpellEffect(
            { ...comboSpells[0], effects: [effect] }, 
            character, 
            comboSpells[0].level
          )
        )
      };
    });

    // Combine individual spell effects
    const individualSpellEffects = comboSpells.flatMap(spell => 
      spell.effects.map(effect => ({
        ...effect,
        source: spell.name
      }))
    );

    return [
      ...baseEffects,
      ...individualSpellEffects
    ];
  }

  /**
   * Calculate resource cost for a spell combo
   * @param character Character executing the combo
   * @param comboSpells Spells involved in the combo
   * @returns Resource cost breakdown
   */
  private static calculateResourceCost(
    character: Character, 
    comboSpells: Spell[]
  ): SpellComboResult['resourceCost'] {
    const spellSlots: Record<number, number> = {};
    const materialComponents: string[] = [];

    comboSpells.forEach(spell => {
      // Track spell slot usage
      const spellLevel = spell.level;
      spellSlots[spellLevel] = (spellSlots[spellLevel] || 0) + 1;

      // Track material components
      const materialCheck = SpellCastingSystem.manageMaterialComponents(
        character, 
        spell
      );

      materialComponents.push(
        ...materialCheck.consumedComponents,
        ...materialCheck.missingComponents
      );
    });

    return {
      spellSlots,
      materialComponents
    };
  }

  /**
   * Assess potential risks of a spell combo
   * @param character Character executing the combo
   * @param combo Spell combo definition
   * @returns Array of potential risks
   */
  private static assessComboRisks(
    character: Character, 
    combo: SpellCombo
  ): string[] {
    const risks: string[] = [];

    // Check concentration requirements
    const concentrationSpells = combo.spells.filter(
      spellId => character.spells?.find(
        spell => spell.id === spellId && spell.concentration
      )
    );

    if (concentrationSpells.length > 1) {
      risks.push('Multiple concentration spells may interfere');
    }

    // Check resource limitations
    const availableSpellSlots = SpellCastingSystem.calculateSpellSlots(character);
    const comboSpellLevels = combo.spells.map(
      spellId => character.spells?.find(spell => spell.id === spellId)?.level || 0
    );

    const insufficientSlots = comboSpellLevels.some(
      level => (availableSpellSlots[level] || 0) === 0
    );

    if (insufficientSlots) {
      risks.push('Insufficient spell slots for combo');
    }

    return risks;
  }

  /**
   * Generate spell combo suggestions
   * @param character Character receiving suggestions
   * @returns Suggested spell combos
   */
  static generateComboSuggestions(character: Character): SpellCombo[] {
    // Advanced combo suggestion logic
    return this.predefinedCombos.filter(combo => 
      // Suggest combos that are close to being available
      character.level >= combo.requiredLevel - 2 &&
      combo.compatibleClasses.includes(character.class) &&
      combo.spells.filter(
        spellId => character.spells?.some(spell => spell.id === spellId)
      ).length >= combo.spells.length / 2
    );
  }
}
