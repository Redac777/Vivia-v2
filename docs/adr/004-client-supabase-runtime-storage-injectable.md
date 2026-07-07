# ADR 0004 — Client Supabase runtime : env validé + storage de session injectable

- **Statut** : Accepté
- **Date** : 2026-07-07
- **Auteur** : reda
- **Module(s) concerné(s)** : auth, shared

## Contexte
Le service d'auth (ADR-003) reçoit un client Supabase injecté, mais rien ne le fabrique encore. Il
faut un client runtime réel, construit depuis les variables d'environnement, avec persistance de
session. Contrainte : garder tout ça **testable sans dépendance native** (AsyncStorage n'existe pas en
Node/CI), et livrer la valeur (client + test d'intégration réel) **avant** d'installer toute la
toolchain Expo (l'UI reste un incrément séparé, ADR-001 tient).

## Décision
- Le client vit dans `src/shared/lib/supabase.ts` (`createSupabaseClient`), **hors des modules** :
  centralisé, pas dupliqué.
- L'**environnement est validé par Zod** (`readSupabaseCredentials`) : démarrage impossible avec une
  config Supabase incomplète, message d'erreur nommant la variable manquante.
- Le **storage de session est injecté** (`SessionStorage`) : `AsyncStorage` en app React Native,
  `createMemoryStorage()` en test/Node. Le client n'importe donc aucune dépendance native.
- Racine de composition `createSupabaseAuth(client)` exposée par le module auth.
- **Dépendance `@types/node`** (env de test Node) : l'allowlist de la constitution est alignée sur la
  prose existante (« `@types/*` accepté ») en ajoutant la ligne `@types/*` dans le bloc `deps-allowlist`
  (le gate `check-deps` ne l'appliquait pas faute de la ligne littérale).

## Alternatives envisagées
- Importer `AsyncStorage` directement dans le client : rejeté, casse les tests Node/CI et couple le
  client à React Native.
- Tout faire d'un bloc (Expo + écrans + client) : rejeté, incrément trop gros ; on découpe pour livrer
  et tester le client réel tout de suite.
- Lister chaque `@types/*` en dur dans l'allowlist : rejeté, redondant et source d'oublis ; le wildcard
  correspond à l'intention déjà écrite dans la constitution.

## Conséquences
- Test d'intégration réseau réel (niveau b) possible en Node, **skippé en CI** faute de `.env`.
- Persistance de session réelle disponible ; l'instance `AsyncStorage` sera injectée à l'incrément UI.
- Node < 22 n'a pas de `WebSocket` global exigé par le client realtime de `@supabase/supabase-js` :
  un stub inerte est fourni dans `jest.setup.ts` (l'auth n'utilise que `fetch`).
- Aucune table applicative n'est exposée : les scripts de sécurité RLS restent pour l'incrément qui
  crée des tables protégées.
