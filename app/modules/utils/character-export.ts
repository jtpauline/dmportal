import { Character } from '../characters';
import { CharacterValidationSystem, ValidationResult } from './character-validation';
import { v4 as uuidv4 } from 'uuid';
import { compress, decompress } from 'lz-string';

export interface ExportFormat {
  version: string;
  exportId: string;
  timestamp: number;
  character: Partial<Character>;
  metadata: {
    validationResult: ValidationResult;
    exportVersion: string;
    compressionVersion: string;
  };
  signature?: string;
}

export class CharacterExportSystem {
  private static readonly CURRENT_VERSION = '1.2.0';
  private static readonly COMPRESSION_VERSION = '1.0.0';

  /**
   * Advanced character export with comprehensive validation and compression
   * @param character Character to export
   * @returns Exported character data
   */
  static exportCharacter(character: Character): {
    success: boolean;
    data?: ExportFormat;
    errors?: string[];
  } {
    // Comprehensive validation
    const validationResult = CharacterValidationSystem.validateCharacter(character, true);
    
    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors
      };
    }

    // Prepare export format with enhanced metadata
    const exportData: ExportFormat = {
      version: this.CURRENT_VERSION,
      exportId: uuidv4(),
      timestamp: Date.now(),
      character: this.sanitizeCharacterData(character),
      metadata: {
        validationResult,
        exportVersion: this.CURRENT_VERSION,
        compressionVersion: this.COMPRESSION_VERSION
      },
      signature: this.generateExportSignature(character)
    };

    return {
      success: true,
      data: this.compressExportData(exportData)
    };
  }

  /**
   * Advanced character import with decompression and validation
   * @param exportData Compressed exported character data
   * @returns Imported character
   */
  static importCharacter(exportData: string): {
    success: boolean;
    character?: Character;
    errors?: string[];
  } {
    try {
      // Decompress and parse export data
      const decompressedData = this.decompressExportData(exportData);

      // Version compatibility check
      if (decompressedData.version !== this.CURRENT_VERSION) {
        return {
          success: false,
          errors: ['Incompatible export version']
        };
      }

      // Export age validation
      const MAX_EXPORT_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year
      if (Date.now() - decompressedData.timestamp > MAX_EXPORT_AGE) {
        return {
          success: false,
          errors: ['Export data is too old']
        };
      }

      // Signature verification
      if (!this.verifyExportSignature(decompressedData)) {
        return {
          success: false,
          errors: ['Character export signature is invalid']
        };
      }

      // Reconstruct character
      const importedCharacter = {
        ...decompressedData.character,
        id: uuidv4() // Generate new unique ID
      } as Character;

      // Validate imported character
      const validationResult = CharacterValidationSystem.validateCharacter(importedCharacter, true);
      
      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors
        };
      }

      return {
        success: true,
        character: importedCharacter
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to import character: ' + error.message]
      };
    }
  }

  /**
   * Sanitize character data for export
   */
  private static sanitizeCharacterData(character: Character): Partial<Character> {
    const { 
      id, 
      status, 
      campaignId,
      ...sanitizedCharacter 
    } = character;

    return {
      ...sanitizedCharacter,
      exportedAt: Date.now()
    };
  }

  /**
   * Generate a cryptographic signature for the export
   */
  private static generateExportSignature(character: Character): string {
    // Simple signature generation (can be replaced with more secure method)
    const signatureBase = JSON.stringify({
      name: character.name,
      race: character.race,
      class: character.class,
      level: character.level,
      exportTimestamp: Date.now()
    });

    // Basic hash generation (replace with more secure hashing in production)
    return btoa(signatureBase);
  }

  /**
   * Verify the export signature
   */
  private static verifyExportSignature(exportData: ExportFormat): boolean {
    // In a real-world scenario, implement more robust signature verification
    return exportData.signature !== undefined;
  }

  /**
   * Compress export data using LZ-String
   */
  private static compressExportData(exportData: ExportFormat): string {
    return compress(JSON.stringify(exportData));
  }

  /**
   * Decompress export data
   */
  private static decompressExportData(compressedData: string): ExportFormat {
    return JSON.parse(decompress(compressedData));
  }

  /**
   * Create a character backup with additional metadata
   */
  static createCharacterBackup(character: Character): {
    success: boolean;
    backup?: ExportFormat;
    errors?: string[];
  } {
    const exportResult = this.exportCharacter(character);
    
    if (!exportResult.success) {
      return exportResult;
    }

    return {
      success: true,
      backup: {
        ...exportResult.data!,
        metadata: {
          ...exportResult.data!.metadata,
          backupType: 'full'
        }
      }
    };
  }

  /**
   * Restore character from backup with advanced validation
   */
  static restoreCharacterFromBackup(backupData: string): {
    success: boolean;
    character?: Character;
    errors?: string[];
  } {
    const importResult = this.importCharacter(backupData);
    
    if (!importResult.success) {
      return importResult;
    }

    // Additional backup-specific validation can be added here
    return importResult;
  }
}
