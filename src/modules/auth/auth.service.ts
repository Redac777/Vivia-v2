import {
  credentialsSchema,
  type AuthGateway,
  type AuthOutcome,
  type AuthUser,
  type ValidationResult,
} from './types';

/**
 * Valide des identifiants AVANT tout appel réseau (frontière Zod). Logique pure et testable.
 */
export function validateCredentials(input: unknown): ValidationResult {
  const parsed = credentialsSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, value: parsed.data };
  }
  return { ok: false, errors: parsed.error.issues.map((issue) => issue.message) };
}

// Message générique volontaire : on ne révèle pas si c'est l'email ou le mot de passe (anti-fuite).
const GENERIC_SIGNIN_ERROR = 'Email ou mot de passe incorrect.';

/**
 * Construit l'API d'auth du module en la branchant sur un gateway.
 * En prod on passe le gateway Supabase ; en test un gateway factice (aucun réseau).
 */
export function createAuth(gateway: AuthGateway) {
  async function signUp(input: unknown): Promise<AuthOutcome> {
    const v = validateCredentials(input);
    if (!v.ok) return { ok: false, error: v.errors[0] ?? 'Identifiants invalides.' };
    const res = await gateway.signUp(v.value.email, v.value.password);
    if (res.error || !res.user) return { ok: false, error: res.error ?? "L'inscription a échoué." };
    return { ok: true, user: res.user };
  }

  async function signIn(input: unknown): Promise<AuthOutcome> {
    const v = validateCredentials(input);
    if (!v.ok) return { ok: false, error: v.errors[0] ?? 'Identifiants invalides.' };
    const res = await gateway.signIn(v.value.email, v.value.password);
    if (res.error || !res.user) return { ok: false, error: GENERIC_SIGNIN_ERROR };
    return { ok: true, user: res.user };
  }

  async function signOut(): Promise<void> {
    await gateway.signOut();
  }

  async function getCurrentUser(): Promise<AuthUser | null> {
    return gateway.getUser();
  }

  return { signUp, signIn, signOut, getCurrentUser };
}
