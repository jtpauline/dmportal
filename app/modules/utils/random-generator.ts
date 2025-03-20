export class RandomGenerator {
  /**
   * Generate a unique identifier
   * @returns Unique string identifier
   */
  static generateUniqueId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Select a random item from an array
   * @param array Input array
   * @returns Randomly selected item
   */
  static randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate a random number within a range
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random number
   */
  static randomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Determine if a random chance occurs
   * @param probability Probability between 0 and 1
   * @returns Boolean indicating if chance occurs
   */
  static randomChance(probability: number): boolean {
    return Math.random() < probability;
  }

  /**
   * Shuffle an array randomly
   * @param array Input array
   * @returns Shuffled array
   */
  static shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }
}
