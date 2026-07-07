import type { SupabaseClient } from '@supabase/supabase-js';
import { createAuth } from './auth.service';
import { supabaseAuthGateway } from './data/supabase-auth.gateway';

/**
 * Racine de composition du module auth : branche le vrai client Supabase sur le service.
 *
 * L'app (incrément UI) crée le client via `src/shared/lib/supabase` (avec AsyncStorage) puis le passe
 * ici. Garder la création du client à l'extérieur du module respecte « le service reçoit le gateway
 * injecté » (ADR-003) : le module auth ne connaît ni les variables d'environnement ni le storage.
 */
export function createSupabaseAuth(client: SupabaseClient) {
  return createAuth(supabaseAuthGateway(client));
}
