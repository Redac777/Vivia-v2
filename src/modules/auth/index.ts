// API publique du module auth. Les autres modules n'importent QUE d'ici.
export { validateCredentials } from './auth.service';
export { credentialsSchema } from './types';
export type { Credentials, ValidationResult } from './types';
