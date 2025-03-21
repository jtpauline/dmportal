export class IdGenerator {
  /**
   * Generate a unique identifier compatible across different environments
   * @returns Unique string identifier
   */
  static generateUniqueId(): string {
    // Fallback method for generating unique IDs
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    const uniqueSegment = Math.random().toString(36).substr(2, 5);
    
    return `${timestamp}-${randomPart}-${uniqueSegment}`;
  }

  /**
   * Generate a predictable but unique identifier
   * @param prefix Optional prefix for the ID
   * @returns Unique string identifier
   */
  static generatePrefixedId(prefix: string = 'id'): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}-${randomPart}`;
  }
}
