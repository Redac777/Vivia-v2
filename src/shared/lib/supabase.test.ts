import { readSupabaseCredentials, createMemoryStorage } from './supabase';

// Niveau (a) — logique pure du client runtime (aucun réseau).
describe('shared/lib/supabase / readSupabaseCredentials', () => {
  it('renvoie les identifiants quand les variables sont valides', () => {
    const creds = readSupabaseCredentials({
      EXPO_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    });
    expect(creds).toEqual({ url: 'https://abc.supabase.co', anonKey: 'anon-key' });
  });

  it("lève une erreur claire quand l'URL est absente", () => {
    expect(() =>
      readSupabaseCredentials({ EXPO_PUBLIC_SUPABASE_ANON_KEY: 'anon-key' }),
    ).toThrow(/Supabase/);
  });

  it("lève une erreur quand l'URL n'est pas une URL valide", () => {
    expect(() =>
      readSupabaseCredentials({
        EXPO_PUBLIC_SUPABASE_URL: 'pas-une-url',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      }),
    ).toThrow(/URL valide/);
  });

  it('lève une erreur quand la clé anon est absente', () => {
    expect(() =>
      readSupabaseCredentials({ EXPO_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co' }),
    ).toThrow(/ANON_KEY/);
  });
});

describe('shared/lib/supabase / createMemoryStorage', () => {
  it('stocke, relit et supprime une valeur', async () => {
    const storage = createMemoryStorage();
    expect(await storage.getItem('k')).toBeNull();
    await storage.setItem('k', 'v');
    expect(await storage.getItem('k')).toBe('v');
    await storage.removeItem('k');
    expect(await storage.getItem('k')).toBeNull();
  });
});
