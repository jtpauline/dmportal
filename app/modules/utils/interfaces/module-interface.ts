import { z } from 'zod';
import { PersistenceAdapter } from './persistence-interface';

// Base interface for all game modules
export interface GameModule<T extends z.ZodType> {
  // Core module operations
  initialize(): Promise<void>;
  validate(data: unknown): boolean;
  
  // Persistence integration
  getPersistenceAdapter(): PersistenceAdapter<T>;
  
  // Advanced module capabilities
  generateRandomInstance(): z.infer<T>;
  calculateComplexity(instance: z.infer<T>): number;
}

// Example implementation for a specific module (Campaign)
export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  characters: z.array(z.string()).default([]), // Character IDs
  encounters: z.array(z.string()).default([]), // Encounter IDs
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Epic']).default('Medium'),
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export class CampaignModule implements GameModule<typeof CampaignSchema> {
  private persistenceAdapter: PersistenceAdapter<typeof CampaignSchema>;

  constructor(adapter: PersistenceAdapter<typeof CampaignSchema>) {
    this.persistenceAdapter = adapter;
  }

  async initialize(): Promise<void> {
    // Perform any necessary initialization
    console.log('Campaign module initialized');
  }

  validate(data: unknown): boolean {
    try {
      CampaignSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  getPersistenceAdapter(): PersistenceAdapter<typeof CampaignSchema> {
    return this.persistenceAdapter;
  }

  generateRandomInstance(): z.infer<typeof CampaignSchema> {
    return {
      id: crypto.randomUUID(),
      name: `Campaign ${Math.floor(Math.random() * 1000)}`,
      description: 'A randomly generated campaign',
      characters: [],
      encounters: [],
      difficulty: ['Easy', 'Medium', 'Hard', 'Epic'][Math.floor(Math.random() * 4)],
      progress: Math.floor(Math.random() * 100),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  calculateComplexity(campaign: z.infer<typeof CampaignSchema>): number {
    // Complex campaign complexity calculation
    return (
      (campaign.characters.length * 2) + 
      (campaign.encounters.length * 3) + 
      (campaign.difficulty === 'Epic' ? 10 : 
       campaign.difficulty === 'Hard' ? 5 : 
       campaign.difficulty === 'Medium' ? 2 : 1)
    );
  }
}

// Utility for creating module-specific persistence adapters
export function createModulePersistenceAdapter<T extends z.ZodType>(
  moduleName: string, 
  schema: T
): PersistenceAdapter<T> {
  // Implement a generic persistence adapter using IndexedDB
  return {
    async create(data: z.infer<T>) {
      const db = await StorageManager.getInstance().openDatabase('GameModules', 1);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([moduleName], 'readwrite');
        const store = transaction.objectStore(moduleName);
        const request = store.add(data);
        
        request.onsuccess = () => resolve(data);
        request.onerror = () => reject(request.error);
      });
    },
    // Implement other CRUD methods similarly...
    async read(id: string) {
      const db = await StorageManager.getInstance().openDatabase('GameModules', 1);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([moduleName], 'readonly');
        const store = transaction.objectStore(moduleName);
        const request = store.get(id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    // Additional methods: update, delete, findMany, etc.
  } as PersistenceAdapter<T>;
}
