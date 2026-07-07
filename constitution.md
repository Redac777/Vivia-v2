# Constitution — Vivia
# Standards non-négociables. Toute PR qui viole ces règles est refusée.

> La différence avec `CLAUDE.md` : le CLAUDE.md **guide** (comment travailler), la constitution
> **interdit** (ce qu'on ne fait jamais). Court, stable, rarement modifié (et seulement par ADR).

## Langage & framework
- TypeScript (mode strict). Pas de `any`, pas de `@ts-ignore`.
- Framework imposé : Expo / React Native (expo-router). On ne mélange pas les paradigmes.
- Styling : thème maison centralisé (src/theme) uniquement. Pas d'autre librairie de style.
- Base de données via Supabase (PostgreSQL + RLS). Pas de requête brute hors migrations.

## Standards de code
- Composants fonctionnels / hooks. Pas de logique dupliquée entre modules.
- **Exports nommés uniquement** (sauf pages/layouts imposés par le framework).
- **Validation Zod à toutes les frontières** (entrées API, formulaires).
- Gestion d'erreur explicite. On n'avale jamais une erreur en silence.
- Pas de `console.log` dans le code livré (logger dédié).

## Règles d'architecture
- **Un module ne touche pas l'intérieur d'un autre.** Communication via l'API publique (`index.ts`).
- **Un agent = un module à la fois.** Les changements inter-modules passent par une PR + revue de l'owner.
- Les secrets ne sont jamais dans le code. Uniquement dans `.env` (gitignoré).

## Dépendances approuvées
Liste faisant foi : le gate CI `scripts/check-deps.mjs` fait **échouer la PR** si le `package.json`
s'en écarte. Une dépendance par ligne ; `# ...` = commentaire ; `@types/*` accepté.

<!-- deps-allowlist:start -->
```
# Runtime
expo
react
react-native
expo-router
@supabase/supabase-js
zod
@react-native-async-storage/async-storage
react-native-url-polyfill
# Dev
typescript
jest
ts-jest
jest-expo
# Types (@types/* est accepté globalement, voir ADR-004)
@types/*
```
<!-- deps-allowlist:end -->

- Toute dépendance hors de cette liste exige l'accord de l'équipe (ASK FIRST + ADR), **puis on
  l'ajoute ici dans le même changement** (sinon le gate CI `check-deps` bloque).
- Note bootstrap (ADR-001) : les tests unitaires tournent d'abord en `jest` + `ts-jest` (léger,
  CI-friendly). On migre vers `jest-expo` à l'incrément UI. Les deux figurent dans la liste.

## Tests (voir la Règle des 3 niveaux dans CLAUDE.md)
- **Toute fonctionnalité terminée** est couverte par : un test unitaire + un test général/intégration
  + une vérification de sécurité. Pas d'exception silencieuse.
- Framework unitaire : jest-expo. Général : flux end-to-end (Expo Go).

## Sécurité
- Aucun secret dans le code. `.env` pour le local, secrets CI dans les réglages GitHub.
- Auth exigée sur toutes les routes/données sensibles. Ne jamais faire confiance aux données client :
  valider avec Zod côté serveur.
- `/security-review` avant chaque merge. Scripts de test sécurité pour toute surface exposée.

## Simplicity gate
- Justifie tout nouveau module, couche ou abstraction. Pas d'optimisation prématurée.
- **Si la spec ne le demande pas, on ne le construit pas.**
