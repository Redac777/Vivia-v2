// API publique du module auth. Les autres modules n'importent QUE d'ici.
export { createAuth, validateCredentials } from './auth.service';
export { createSupabaseAuth } from './create-supabase-auth';
export { supabaseAuthGateway } from './data/supabase-auth.gateway';
export { credentialsSchema } from './types';
export type { Credentials, ValidationResult, AuthUser, AuthOutcome, AuthGateway } from './types';
