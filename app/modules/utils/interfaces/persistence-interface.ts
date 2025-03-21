import { z } from 'zod';

// Base validation schema for all persistable entities
export const BasePersistableSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().min(1).default(1)
});

// Generic persistence interface
export interface PersistenceAdapter<T extends z.ZodType> {
  // Core CRUD Operations
  create(data: z.infer<T>): Promise<z.infer<T>>;
  read(id: string): Promise<z.infer<T> | null>;
  update(id: string, data: Partial<z.infer<T>>): Promise<z.infer<T>>;
  delete(id: string): Promise<boolean>;

  // Advanced Query Methods
  findMany(filters?: Partial<z.infer<T>>): Promise<z.infer<T>[]>;
  count(filters?: Partial<z.infer<T>>): Promise<number>;

  // Transactional Methods
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}

// Specialized storage strategies
export interface StorageStrategy {
  // Local browser storage
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;

  // Indexed DB specific methods
  openDatabase(name: string, version: number): Promise<IDBDatabase>;
  createObjectStore(db: IDBDatabase, storeName: string, keyPath: string): void;
}

// Comprehensive storage manager
export class StorageManager implements StorageStrategy {
  private static instance: StorageManager;
  private databases: Map<string, IDBDatabase> = new Map();

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Local Storage Methods
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Local storage write error:', error);
      // Fallback to alternative storage mechanism
      this.handleStorageOverflow(key, value);
    }
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Indexed DB Methods
  async openDatabase(name: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.databases.has(name)) {
        return resolve(this.databases.get(name)!);
      }

      const request = indexedDB.open(name, version);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        // Example store creation - customize per module
        if (!db.objectStoreNames.contains('campaigns')) {
          db.createObjectStore('campaigns', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        this.databases.set(name, db);
        resolve(db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  createObjectStore(db: IDBDatabase, storeName: string, keyPath: string): void {
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath });
    }
  }

  // Overflow and Error Handling
  private handleStorageOverflow(key: string, value: string) {
    // Implement intelligent storage management
    const storageLimit = this.calculateAvailableStorage();
    
    if (storageLimit < value.length) {
      // Implement cleanup strategies
      this.cleanupOldestEntries();
    }
  }

  private calculateAvailableStorage(): number {
    // Estimate available storage
    return 5 * 1024 * 1024; // 5MB default
  }

  private cleanupOldestEntries() {
    // Remove oldest/least accessed items
    const entries = Object.keys(localStorage)
      .map(key => ({
        key,
        timestamp: parseInt(localStorage.getItem(`${key}_timestamp`) || '0')
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 5); // Remove 5 oldest entries

    entries.forEach(entry => localStorage.removeItem(entry.key));
  }
}

// Centralized persistence service
export class PersistenceService {
  private storageManager: StorageManager;

  constructor() {
    this.storageManager = StorageManager.getInstance();
  }

  // Advanced caching mechanism
  async cachePersistentData<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl: number = 3600000 // 1 hour default
  ): Promise<T> {
    const cachedData = this.storageManager.getItem(key);
    
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      
      if (Date.now() - timestamp < ttl) {
        return data;
      }
    }

    const freshData = await fetchFn();
    
    this.storageManager.setItem(key, JSON.stringify({
      data: freshData,
      timestamp: Date.now()
    }));

    return freshData;
  }

  // Sync mechanism for offline-first approach
  async syncData<T>(
    key: string, 
    localData: T, 
    remoteSyncFn?: (data: T) => Promise<T>
  ): Promise<T> {
    // Store local changes
    this.storageManager.setItem(key, JSON.stringify(localData));

    if (navigator.onLine && remoteSyncFn) {
      try {
        return await remoteSyncFn(localData);
      } catch (error) {
        console.warn('Sync failed, using local data', error);
      }
    }

    return localData;
  }
}

// Export a singleton instance for easy access
export const persistenceService = new PersistenceService();
