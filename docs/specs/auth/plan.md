# Plan technique — Module auth

> **COMMENT.** L'approche technique pour réaliser la spec.

## Approche
- **Logique d'abord, réseau injecté** (ADR-003). Le service `createAuth(gateway)` porte toute la
  logique (validation Zod, orchestration, message générique anti-fuite). Il reçoit un `AuthGateway`
  injecté ; l'implémentation Supabase `supabaseAuthGateway(client)` vit dans `data/`.
- **Client Supabase runtime hors module** : fabriqué dans `src/shared/lib/supabase.ts` via
  `createSupabaseClient({ storage })`. L'environnement (`EXPO_PUBLIC_SUPABASE_URL` /
  `EXPO_PUBLIC_SUPABASE_ANON_KEY`) est validé par Zod (frontière). Le **storage de session est
  injecté** : `AsyncStorage` en app React Native, storage mémoire en test/Node (ADR-004).
- **Racine de composition** : `createSupabaseAuth(client)` = `createAuth(supabaseAuthGateway(client))`.
  L'app crée le client puis le passe ici ; le module ne connaît ni l'env ni le storage.

## Structure de fichiers
```
src/
├── shared/lib/supabase.ts            # client runtime (env Zod + storage injectable) — hors module
└── modules/auth/
    ├── index.ts                      # API publique
    ├── auth.service.ts               # logique (validation + orchestration + anti-fuite)
    ├── create-supabase-auth.ts       # racine de composition (client réel → gateway → service)
    ├── types.ts                      # schémas Zod + contrats (AuthGateway…)
    ├── data/supabase-auth.gateway.ts # implémentation Supabase (client injecté)
    └── auth.test.ts                  # tests unitaires (gateway factice) — niveau (a)
```
Le parcours d'intégration réel vit à côté du client : `src/shared/lib/supabase.integration.test.ts`.

## Couche données
- `data/supabase-auth.gateway.ts` : seul point qui parle à Supabase Auth (`signUp`,
  `signInWithPassword`, `signOut`, `getUser`). Normalise le retour en `GatewayResult`.
- Persistance de session : `persistSession: true` + storage injecté ; `detectSessionInUrl: false`
  (app mobile, pas de flux OAuth navigateur).

## Interactions avec les autres modules
- Aucune dépendance. Les autres modules consommeront l'auth via `index.ts` (jamais l'intérieur).

## Risques / points d'attention
- **Confirmation d'email** : en dev, elle est désactivée côté Supabase pour permettre le test
  inscription → connexion d'un seul tenant. En prod, prévoir le flux de confirmation.
- **Node < 22** : `@supabase/supabase-js` exige un `WebSocket` global (client realtime). L'auth
  n'utilise que `fetch` ; un stub inerte est fourni dans `jest.setup.ts` pour le runtime de test.
- **AsyncStorage** : injecté seulement à l'incrément UI (installe Expo). Ici, la mécanique de storage
  injectable est en place et testée en mémoire.
