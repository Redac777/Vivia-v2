# Plan de tests — Module auth

> La **Règle des 3 niveaux** appliquée au module. Toute fonctionnalité terminée coche les 3 avant
> d'être « done » et avant d'ouvrir la PR. Voir `CLAUDE.md` §Règle des 3 niveaux.

## Niveau (a) — Tests unitaires  ·  `npm test`
La logique isolée de chaque fonctionnalité.
- [x] `validateCredentials` : valides / email invalide / mot de passe trop court
- [x] `signIn` : succès avec gateway ; court-circuite le gateway si identifiants invalides
- [x] `signIn` : message générique anti-fuite quand le gateway renvoie une erreur
- [x] `signUp` : succès ; remonte l'erreur du gateway
- [x] `getCurrentUser` : délègue au gateway
- [x] `readSupabaseCredentials` : identifiants valides ; erreur claire si URL/clé absente ou invalide
- [x] `createMemoryStorage` : stocke / relit / supprime

## Niveau (b) — Tests généraux / intégration  ·  `npm test` (réseau réel, skippé sans `.env`)
Le flux complet contre le vrai Supabase (`src/shared/lib/supabase.integration.test.ts`).
- [x] Parcours inscription → connexion → session → déconnexion (client runtime + gateway réels)
- [x] Connexion refusée avec mauvais mot de passe → message générique anti-fuite (réseau réel)

> Le test se **skippe proprement en CI** (pas de `.env`, donc pas de secrets) et tourne en local
> quand `.env` est renseigné. Pré-requis dev : confirmation d'email désactivée côté Supabase.

## Niveau (c) — Sécurité
- [x] `/security-review` passé sans finding bloquant sur le client runtime réel
- [x] Anti-fuite d'information à la connexion : couvert en unitaire **et** en intégration réseau réel
- [x] Env validé par Zod (démarrage impossible avec une config Supabase incomplète)
- [ ] Scripts `security/` : isolation RLS, escalade de privilège, accès anonyme — à l'incrément qui
      crée des **tables protégées** (aucune table applicative n'est exposée par cet incrément)

> État : niveaux (a) et (b) complets pour l'auth réelle. Les scripts RLS (c) arrivent avec les
> premières tables protégées (voir ADR-001 / ADR-003 / ADR-004).
