import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, string> = {};

  private constructor() {
    this.loadEnvironmentConfig();
  }

  public static getInstance(): ConfigManager {
    if (!this.instance) {
      this.instance = new ConfigManager();
    }
    return this.instance;
  }

  private loadEnvironmentConfig() {
    const envFile = this.getEnvFile();
    if (fs.existsSync(envFile)) {
      const result = dotenv.config({ path: envFile });
      if (result.error) {
        console.warn('Error loading .env file:', result.error);
      }
    }

    // Load configuration from environment variables
    this.config = {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '3000',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      jwtSecret: this.validateSecret(process.env.JWT_SECRET),
      errorTrackingEnabled: process.env.ERROR_TRACKING_ENABLED === 'true'
    };
  }

  private getEnvFile(): string {
    const envFiles = [
      `.env.${process.env.NODE_ENV}.local`,
      `.env.local`,
      `.env.${process.env.NODE_ENV}`,
      '.env'
    ];

    for (const file of envFiles) {
      const envPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(envPath)) {
        return envPath;
      }
    }

    return path.resolve(process.cwd(), '.env');
  }

  private validateSecret(secret?: string): string {
    if (!secret || secret.length < 32) {
      throw new Error('Invalid or missing secret. Provide a secure secret of at least 32 characters.');
    }
    return secret;
  }

  public get(key: string): string {
    return this.config[key] || '';
  }

  public getSecurityConfig() {
    return {
      corsOrigin: this.get('corsOrigin'),
      cspConfig: {
        connectSrc: process.env.CSP_CONNECT_SRC?.split(',') || ['self'],
        scriptSrc: process.env.CSP_SCRIPT_SRC?.split(',') || ['self'],
        styleSrc: process.env.CSP_STYLE_SRC?.split(',') || ['self']
      }
    };
  }
}

export const configManager = ConfigManager.getInstance();
