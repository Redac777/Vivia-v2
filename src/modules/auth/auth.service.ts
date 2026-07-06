import { credentialsSchema, type ValidationResult } from './types';

/**
 * Valide des identifiants AVANT tout appel réseau (Supabase).
 * Logique pure et testable, sans dépendance native ni réseau : c'est le premier morceau
 * du module auth, celui qui protège la frontière d'entrée (cf. constitution : Zod).
 */
export function validateCredentials(input: unknown): ValidationResult {
  const parsed = credentialsSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, value: parsed.data };
  }
  return { ok: false, errors: parsed.error.issues.map((issue) => issue.message) };
}
