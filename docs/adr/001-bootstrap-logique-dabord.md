# ADR 0001 — Bootstrap : logique métier d'abord, UI et Expo ensuite

- **Statut** : Accepté
- **Date** : 2026-07-06
- **Auteur** : reda
- **Module(s) concerné(s)** : global (base projet) + auth

## Contexte
On démarre Vivia v2 par le module `auth`. Poser d'emblée toute la chaîne Expo (SDK natif, expo-router,
jest-expo, `expo export`) est lourd et lent à installer, alors que la première brique de valeur (la
**validation des identifiants**) est de la logique pure, testable sans réseau ni natif.

## Décision
Pour le tout premier incrément, on installe un socle **léger et rapide** :
- `zod` pour la validation,
- `typescript` (strict) + `jest` + `ts-jest` pour les tests unitaires de logique.

La CI de cet incrément vérifie `typecheck` + tests unitaires + scan de secrets. Les étapes Expo
(`expo lint`, `expo export`) sont réintroduites à l'incrément qui apporte l'UI et le client Supabase,
où l'on migre les tests vers **jest-expo** (le framework cible déclaré dans la constitution).

## Alternatives envisagées
- Tout scaffolder en Expo dès le départ : plus fidèle mais installation lourde, CI lente, et rien de
  testable de plus pour l'instant. Écartée pour ce premier incrément.

## Conséquences
- CI verte rapidement sur une base minimale, flux de collaboration validé de bout en bout.
- Dette explicite et tracée : ajouter Expo + jest-expo + UI + client Supabase au prochain incrément
  (mettre à jour `.github/workflows/ci.yml` et `package.json` à ce moment-là).
