# Module auth

Inscription et connexion via Supabase.

## User story
En tant qu'utilisateur, je veux créer un compte et me connecter afin d'accéder à Vivia et retrouver mes données.

## API publique (`index.ts`)
- `validateCredentials(input)` : valide email + mot de passe (Zod) avant tout appel réseau.
- `createAuth(gateway)` : construit l'API d'auth (`signUp` / `signIn` / `signOut` / `getCurrentUser`) sur un gateway.
- `supabaseAuthGateway(client)` : implémentation Supabase du gateway (couche données `data/`).
- Types : `Credentials`, `AuthUser`, `AuthOutcome`, `AuthGateway`, `ValidationResult`.

Exemple : `const auth = createAuth(supabaseAuthGateway(client)); const r = await auth.signIn({ email, password });`

## Structure
```
auth/
├── index.ts                      # API publique
├── auth.service.ts               # logique (validation + orchestration + anti-fuite d'info)
├── types.ts                      # schémas Zod + contrats (AuthGateway…)
├── data/supabase-auth.gateway.ts # implémentation Supabase (client injecté)
└── auth.test.ts                  # tests unitaires (gateway factice)
```

## Owner
@reda — toute PR touchant ce module réclame sa revue (CODEOWNERS).
