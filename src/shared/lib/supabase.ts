import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

/**
 * Client Supabase runtime : fabrique le vrai client à partir des variables d'environnement.
 *
 * Deux principes :
 * - **L'environnement est une frontière** → on le valide avec Zod (constitution). Une variable
 *   manquante fait échouer le démarrage avec un message clair, plutôt qu'une erreur obscure en plein
 *   usage.
 * - **Le storage de session est injecté** → l'app React Native passe `AsyncStorage` (persistance réelle
 *   sur l'appareil) ; les tests / Node passent un storage mémoire. Le client reste ainsi testable sans
 *   dépendance native (voir ADR-004).
 */

// Frontière d'environnement validée par Zod. Les clés `EXPO_PUBLIC_*` sont exposées au client mobile
// (jamais la clé `service_role`, qui resterait côté serveur).
const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z
    .string({ required_error: 'EXPO_PUBLIC_SUPABASE_URL est manquante.' })
    .url('EXPO_PUBLIC_SUPABASE_URL doit être une URL valide.'),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z
    .string({ required_error: 'EXPO_PUBLIC_SUPABASE_ANON_KEY est manquante.' })
    .min(1, 'EXPO_PUBLIC_SUPABASE_ANON_KEY est manquante.'),
});

export type SupabaseCredentials = { url: string; anonKey: string };

/**
 * Lit et valide les identifiants Supabase depuis un objet d'environnement (par défaut `process.env`).
 * Lève une erreur explicite (jamais silencieuse) si une variable est absente ou invalide.
 */
export function readSupabaseCredentials(
  env: Record<string, string | undefined> = process.env,
): SupabaseCredentials {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join(' ');
    throw new Error(
      `Configuration Supabase invalide : ${details} Renseigne les variables dans .env (voir .env.example).`,
    );
  }
  return {
    url: parsed.data.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: parsed.data.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Contrat minimal de stockage de session, compatible avec l'API d'`AsyncStorage` (React Native) et
 * avec un simple objet mémoire en test. C'est ce qui rend le storage injectable.
 */
export interface SessionStorage {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

/** Storage mémoire (non persistant) pour les tests et l'exécution en Node. */
export function createMemoryStorage(): SessionStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

export interface CreateSupabaseClientOptions {
  /** Storage de session injecté (AsyncStorage en app, mémoire en test). */
  storage?: SessionStorage;
  /** Persistance de session (par défaut activée). */
  persistSession?: boolean;
  /** Identifiants explicites (sinon lus et validés depuis `process.env`). */
  url?: string;
  anonKey?: string;
}

/**
 * Fabrique le client Supabase de l'application.
 *
 * En production (React Native), l'app appellera :
 *   `createSupabaseClient({ storage: AsyncStorage })`
 * après avoir importé `react-native-url-polyfill/auto`. En test/Node :
 *   `createSupabaseClient({ storage: createMemoryStorage() })`.
 */
export function createSupabaseClient(options: CreateSupabaseClientOptions = {}): SupabaseClient {
  const creds =
    options.url && options.anonKey
      ? { url: options.url, anonKey: options.anonKey }
      : readSupabaseCredentials();

  return createClient(creds.url, creds.anonKey, {
    auth: {
      storage: options.storage,
      persistSession: options.persistSession ?? true,
      autoRefreshToken: true,
      // App mobile : pas de session dans l'URL (flux OAuth navigateur non utilisé ici).
      detectSessionInUrl: false,
    },
  });
}
