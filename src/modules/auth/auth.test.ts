import { validateCredentials } from './auth.service';

// Niveau (a) de la Règle des 3 niveaux : test unitaire de la logique isolée.
describe('auth / validateCredentials', () => {
  it('accepte des identifiants valides', () => {
    const r = validateCredentials({ email: 'reda@example.com', password: 'motdepasse1' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.email).toBe('reda@example.com');
    }
  });

  it('nettoie les espaces autour de l email', () => {
    const r = validateCredentials({ email: '  reda@example.com  ', password: 'motdepasse1' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.email).toBe('reda@example.com');
    }
  });

  it('refuse un email invalide', () => {
    const r = validateCredentials({ email: 'pas-un-email', password: 'motdepasse1' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.length).toBeGreaterThan(0);
    }
  });

  it('refuse un mot de passe trop court', () => {
    const r = validateCredentials({ email: 'reda@example.com', password: '123' });
    expect(r.ok).toBe(false);
  });

  it('refuse des champs manquants', () => {
    const r = validateCredentials({});
    expect(r.ok).toBe(false);
  });
});
