# Erreurs dont on a appris — Vivia

> Journal des bugs, erreurs de conception et pièges qu'on ne veut pas répéter. C'est une **mémoire
> durable d'équipe** : elle survit aux tâches et se partage.
>
> **Quand ajouter une entrée ?** Dès qu'une erreur a une cause racine non-évidente, au point que
> quelqu'un pourrait la refaire sans cette note. Commence par le symptôme, puis la cause, puis la
> règle / l'invariant qui empêche la récidive.

---

<!-- Modèle d'entrée (copie-le) :

- **<Symptôme court>.** <Ce qui s'est passé et la cause racine.> **Fix / invariant :** <la règle qui
  évite que ça revienne.> (réf : PR #.., module <nom>)

-->

- **Dépendances ajoutées hors de la liste approuvée, sans ASK FIRST.** En bootstrap du module `auth`,
  `jest` / `ts-jest` / `@types/jest` ont été ajoutés au `package.json` alors que la constitution
  n'approuvait que `jest-expo`. Un ADR a été écrit, mais (a) sans demander d'abord (ASK FIRST), et
  (b) sans mettre à jour la liste de la constitution dans le même changement → violation de la
  constitution pendant plusieurs commits. **Cause racine :** la règle n'était appliquée que par la
  discipline de l'agent (du texte), rien ne la bloquait. **Fix / invariant :** gate CI
  `scripts/check-deps.mjs` qui échoue si le `package.json` s'écarte de la liste approuvée (ADR-002).
  Et pour tout changement « ASK FIRST » : demander avant, pas décider seul. (réf : PR #1, ADR-001/002)

- **Le gate `check-deps` n'appliquait pas la règle `@types/*` que la constitution disait accepter.**
  La prose de la constitution affirmait « `@types/*` accepté », mais le bloc `deps-allowlist` listait
  les types en dur (`@types/jest`, `@types/react`) sans la ligne `@types/*`. Résultat : `check-deps`
  aurait bloqué l'ajout de `@types/node`, pourtant censé être autorisé. **Cause racine :** une règle
  écrite en prose mais pas encodée dans la partie que la machine lit. **Fix / invariant :** la ligne
  `@types/*` figure désormais dans le bloc `deps-allowlist` ; la prose et le gate disent la même chose.
  Leçon : toute règle « mécanique » doit vivre dans la zone que le gate parse, pas seulement en texte.
  (réf : ADR-004)

- **Tests d'intégration Supabase : « Node.js detected but native WebSocket not found ».**
  `createClient` de `@supabase/supabase-js` instancie un client realtime qui exige un `WebSocket`
  global, absent en Node < 22. Le test d'auth plantait au `createClient`, alors que l'auth n'utilise
  que `fetch`. **Fix / invariant :** stub `WebSocket` inerte dans `jest.setup.ts` (jamais utilisé car
  on ne se connecte pas au realtime). En prod React Native, `WebSocket` existe déjà. (réf : ADR-004)
