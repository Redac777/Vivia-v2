import { z } from 'zod';

/**
 * Schéma des identifiants (frontière d'entrée du module auth).
 * Validation Zod imposée par la constitution : on ne fait jamais confiance à la donnée brute.
 */
export const credentialsSchema = z.object({
  email: z.string().trim().email("L'email n'est pas valide."),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
});

export type Credentials = z.infer<typeof credentialsSchema>;

export type ValidationResult =
  | { ok: true; value: Credentials }
  | { ok: false; errors: string[] };
