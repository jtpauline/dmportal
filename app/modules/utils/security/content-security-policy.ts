import helmet from 'helmet';
import { configManager } from '../config/config-manager';

export function createContentSecurityPolicy() {
  const { cspConfig } = configManager.getSecurityConfig();

  return helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        ...cspConfig.scriptSrc,
        "'unsafe-inline'"
      ],
      styleSrc: [
        "'self'",
        ...cspConfig.styleSrc,
        "'unsafe-inline'"
      ],
      connectSrc: [
        "'self'",
        ...cspConfig.connectSrc
      ],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  });
}
