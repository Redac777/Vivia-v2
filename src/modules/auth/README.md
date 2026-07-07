# Module auth

Inscription et connexion via Supabase.

## User story
En tant qu'utilisateur, je veux créer un compte et me connecter afin d'accéder à Vivia et retrouver mes données.

## API publique (`index.ts`)
- `validateCredentials(input)` : valide email + mot de passe (Zod) avant tout appel réseau.
- `createAuth(gateway)` : construit l'API d'auth (`signUp` / `signIn` / `signOut` / `getCurrentUser`) sur un gateway.
- `createSupabaseAuth(client)` : racine de composition, branche le vrai client Supabase (`createAuth(supabaseAuthGateway(client))`).
- `supabaseAuthGateway(client)` : implémentation Supabase du gateway (couche données `data/`).
- Types : `Credentials`, `AuthUser`, `AuthOutcome`, `AuthGateway`, `ValidationResult`.

Exemple (app) : `const auth = createSupabaseAuth(createSupabaseClient({ storage: AsyncStorage }));`
Le client est fabriqué dans `src/shared/lib/supabase.ts` puis injecté ici.

## Structure
```
auth/
├── index.ts                      # API publique
├── auth.service.ts               # logique (validation + orchestration + anti-fuite d'info)
├── create-supabase-auth.ts       # racine de composition (client réel → gateway → service)
├── types.ts                      # schémas Zod + contrats (AuthGateway…)
├── data/supabase-auth.gateway.ts # implémentation Supabase (client injecté)
└── auth.test.ts                  # tests unitaires (gateway factice)
```

## Owner
@reda — toute PR touchant ce module réclame sa revue (CODEOWNERS).
