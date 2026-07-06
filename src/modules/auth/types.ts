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

/** L'utilisateur tel que le module l'expose au reste de l'app. */
export type AuthUser = { id: string; email: string };

/** Résultat d'une opération d'auth exposée par le service. */
export type AuthOutcome =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

/** Résultat normalisé renvoyé par un gateway (couche données). */
export type GatewayResult = { user: AuthUser | null; error: string | null };

/**
 * Contrat que doit remplir toute implémentation d'auth (Supabase en prod, fake en test).
 * C'est ce qui rend la couche données remplaçable et le service testable sans réseau.
 */
export interface AuthGateway {
  signUp(email: string, password: string): Promise<GatewayResult>;
  signIn(email: string, password: string): Promise<GatewayResult>;
  signOut(): Promise<void>;
  getUser(): Promise<AuthUser | null>;
}
