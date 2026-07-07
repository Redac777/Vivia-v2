import { createSupabaseClient, createMemoryStorage } from './supabase';
import { createSupabaseAuth } from '../../modules/auth';

/**
 * Niveau (b) — Test d'intégration contre le VRAI Supabase (réseau réel).
 *
 * Il ne tourne que si les variables d'environnement sont présentes (chargées depuis `.env` par
 * `jest.setup.ts`). En CI, il n'y a pas de secrets → le test se skippe proprement (CI verte).
 *
 * Pré-requis dans le projet Supabase (dev) : confirmation d'email désactivée, sinon la connexion
 * échoue tant que l'utilisateur n'a pas cliqué le lien de confirmation.
 */
const hasEnv =
  !!process.env.EXPO_PUBLIC_SUPABASE_URL && !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const describeIf = hasEnv ? describe : describe.skip;

describeIf('auth / intégration Supabase (réseau réel)', () => {
  jest.setTimeout(30000);

  // Email unique par exécution : la clé anon ne permet pas de supprimer les comptes de test.
  const email = `vivia-test+${Date.now()}@example.com`;
  const password = 'motdepasse-test-123';

  it('parcours inscription → connexion → session → déconnexion', async () => {
    const client = createSupabaseClient({ storage: createMemoryStorage() });
    const auth = createSupabaseAuth(client);

    // Inscription
    const signup = await auth.signUp({ email, password });
    expect(signup.ok).toBe(true);
    if (signup.ok) expect(signup.user.email).toBe(email);

    // On repart d'une session vide pour tester la connexion explicitement.
    await auth.signOut();

    // Connexion
    const signin = await auth.signIn({ email, password });
    expect(signin.ok).toBe(true);
    if (signin.ok) expect(signin.user.email).toBe(email);

    // Session active
    const current = await auth.getCurrentUser();
    expect(current?.email).toBe(email);

    // Déconnexion → plus de session
    await auth.signOut();
    expect(await auth.getCurrentUser()).toBeNull();
  });

  it('connexion refusée avec un mauvais mot de passe (message générique anti-fuite)', async () => {
    const client = createSupabaseClient({ storage: createMemoryStorage() });
    const auth = createSupabaseAuth(client);

    const result = await auth.signIn({ email, password: 'mauvais-mot-de-passe' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('Email ou mot de passe incorrect.');
  });
});
