# Plan de tests — Module auth

> La **Règle des 3 niveaux** appliquée au module. Toute fonctionnalité terminée coche les 3 avant
> d'être « done » et avant d'ouvrir la PR. Voir `CLAUDE.md` §Règle des 3 niveaux.

## Niveau (a) — Tests unitaires  ·  `npm test`
La logique isolée de chaque fonctionnalité.
- [x] `validateCredentials` : identifiants valides acceptés
- [x] `validateCredentials` : email nettoyé (trim)
- [x] `validateCredentials` : email invalide / mot de passe trop court / champs manquants refusés
- [ ] `signUp` / `signIn` : mapping des erreurs Supabase (à l'incrément Supabase)

## Niveau (b) — Tests généraux / intégration  ·  flux end-to-end via Expo Go (à automatiser plus tard)
Le flux complet vécu par l'utilisateur (UI → données → UI).
- [ ] Parcours inscription → connexion → session persistante (à l'incrément UI + Supabase)

## Niveau (c) — Sécurité
- [ ] `/security-review` passé sans finding bloquant (à l'incrément qui expose l'appel réseau)
- [ ] Scripts `security/` : isolation RLS, escalade de privilège, accès anonyme (à l'incrément Supabase)
- [ ] Aucune donnée sensible en clair, validation Zod côté serveur

> État : niveau (a) couvert pour la validation des identifiants (PR #1). (b) et (c) s'appliquent
> quand l'UI et l'appel Supabase arrivent (voir ADR-001).

## Definition of Done du module
Les 3 niveaux verts pour **chaque** fonctionnalité listée dans `spec.md`, docs à jour, PR ouverte.
