import { Matrix } from 'ml-matrix';
import { KMeans } from 'ml-kmeans';

// Define types for spell interactions
export interface SpellInteraction {
  spellId: string;
  name: string;
  complexity: number;
  synergy: number;
}

class SpellInteractionAnalyzer {
  private interactions: SpellInteraction[];

  constructor(interactions: SpellInteraction[]) {
    this.interactions = interactions;
  }

  // Convert interactions to matrix for ML analysis
  private toMatrix(): Matrix {
    return new Matrix(
      this.interactions.map(interaction => [
        interaction.complexity,
        interaction.synergy
      ])
    );
  }

  // Cluster spell interactions using K-Means
  clusterInteractions(k: number = 3): number[] {
    const matrix = this.toMatrix();
    const kmeans = new KMeans(k);
    
    const { labels } = kmeans.fit(matrix);
    
    return labels;
  }

  // Find most synergistic spell combinations
  findTopSynergies(limit: number = 5): SpellInteraction[] {
    return this.interactions
      .sort((a, b) => b.synergy - a.synergy)
      .slice(0, limit);
  }

  // Analyze interaction complexity
  getComplexityScore(): number {
    const complexities = this.interactions.map(i => i.complexity);
    const sum = complexities.reduce((a, b) => a + b, 0);
    return sum / complexities.length;
  }
}

export default SpellInteractionAnalyzer;
