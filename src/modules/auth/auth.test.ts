import { validateCredentials, createAuth } from './auth.service';
import type { AuthGateway } from './types';

// Gateway factice : teste la logique du service sans réseau ni Supabase.
function fakeGateway(overrides: Partial<AuthGateway> = {}): AuthGateway {
  return {
    async signUp() {
      return { user: { id: 'u1', email: 'reda@example.com' }, error: null };
    },
    async signIn() {
      return { user: { id: 'u1', email: 'reda@example.com' }, error: null };
    },
    async signOut() {},
    async getUser() {
      return null;
    },
    ...overrides,
  };
}

// Niveau (a) — validation pure
describe('auth / validateCredentials', () => {
  it('accepte des identifiants valides', () => {
    expect(validateCredentials({ email: 'reda@example.com', password: 'motdepasse1' }).ok).toBe(true);
  });
  it('refuse un email invalide', () => {
    expect(validateCredentials({ email: 'x', password: 'motdepasse1' }).ok).toBe(false);
  });
  it('refuse un mot de passe trop court', () => {
    expect(validateCredentials({ email: 'reda@example.com', password: '123' }).ok).toBe(false);
  });
});

// Niveau (a) — logique du service (avec gateway factice)
describe('auth / createAuth', () => {
  it('signIn réussit avec des identifiants valides', async () => {
    const auth = createAuth(fakeGateway());
    const r = await auth.signIn({ email: 'reda@example.com', password: 'motdepasse1' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.user.id).toBe('u1');
  });

  it('signIn bloque AVANT le gateway si les identifiants sont invalides', async () => {
    let called = false;
    const auth = createAuth(
      fakeGateway({
        async signIn() {
          called = true;
          return { user: null, error: null };
        },
      }),
    );
    const r = await auth.signIn({ email: 'pas-un-email', password: '123' });
    expect(r.ok).toBe(false);
    expect(called).toBe(false); // la validation Zod court-circuite l'appel réseau
  });

  it("ne fuite pas l'info : message générique quand le gateway échoue", async () => {
    const auth = createAuth(
      fakeGateway({
        async signIn() {
          return { user: null, error: 'User not found' };
        },
      }),
    );
    const r = await auth.signIn({ email: 'reda@example.com', password: 'motdepasse1' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).not.toMatch(/not found/i);
      expect(r.error).toBe('Email ou mot de passe incorrect.');
    }
  });

  it('signUp réussit et renvoie l’utilisateur', async () => {
    const auth = createAuth(fakeGateway());
    expect((await auth.signUp({ email: 'reda@example.com', password: 'motdepasse1' })).ok).toBe(true);
  });

  it('signUp remonte l’erreur du gateway', async () => {
    const auth = createAuth(
      fakeGateway({
        async signUp() {
          return { user: null, error: 'Email déjà utilisé' };
        },
      }),
    );
    expect((await auth.signUp({ email: 'reda@example.com', password: 'motdepasse1' })).ok).toBe(false);
  });

  it('getCurrentUser délègue au gateway', async () => {
    const auth = createAuth(
      fakeGateway({
        async getUser() {
          return { id: 'u9', email: 'a@b.co' };
        },
      }),
    );
    expect(await auth.getCurrentUser()).toEqual({ id: 'u9', email: 'a@b.co' });
  });
});
