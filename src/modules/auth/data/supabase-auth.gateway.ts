import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthGateway, AuthUser, GatewayResult } from '../types';

function toUser(u: { id: string; email?: string | null } | null | undefined): AuthUser | null {
  if (!u) return null;
  return { id: u.id, email: u.email ?? '' };
}

/**
 * Implémentation Supabase du contrat `AuthGateway` (couche données du module auth).
 * Le client Supabase est **injecté** (créé ailleurs avec les variables d'environnement) afin de
 * garder le service testable et de respecter la règle « data/ est le seul endroit qui parle à la base ».
 */
export function supabaseAuthGateway(client: SupabaseClient): AuthGateway {
  return {
    async signUp(email, password): Promise<GatewayResult> {
      const { data, error } = await client.auth.signUp({ email, password });
      return { user: toUser(data.user), error: error ? error.message : null };
    },
    async signIn(email, password): Promise<GatewayResult> {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      return { user: toUser(data.user), error: error ? error.message : null };
    },
    async signOut(): Promise<void> {
      await client.auth.signOut();
    },
    async getUser(): Promise<AuthUser | null> {
      const { data } = await client.auth.getUser();
      return toUser(data.user);
    },
  };
}
