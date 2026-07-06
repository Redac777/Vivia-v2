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

## Niveau (b) — Tests généraux / intégration  ·  flux end-to-end via Expo Go (à automatiser plus tard)
Le flux complet vécu par l'utilisateur (UI → données → UI).
- [ ] Parcours inscription → connexion → session persistante (à l'incrément UI + client Supabase)

## Niveau (c) — Sécurité
- [ ] `/security-review` passé sans finding bloquant (à l'incrément qui expose l'appel réseau réel)
- [ ] Scripts `security/` : isolation RLS, escalade de privilège, accès anonyme (à l'incrément Supabase)
- [x] Anti-fuite d'information à la connexion (message générique) couvert par un test unitaire

> État : niveau (a) complet pour la logique d'auth. (b) et (c) s'appliquent quand l'UI et le client
> Supabase réel arrivent (voir ADR-001 / ADR-003).
