# ADR 0002 — Enforcement mécanique de la liste de dépendances

- **Statut** : Accepté
- **Date** : 2026-07-06
- **Auteur** : reda
- **Module(s) concerné(s)** : global (constitution + CI)

## Contexte
La constitution déclare une liste de dépendances approuvées, mais rien ne l'appliquait : elle
reposait uniquement sur la discipline de l'agent. Résultat : `jest` / `ts-jest` ont été ajoutés au
`package.json` sans être dans la liste (voir `mistakes-log.md`). Principe retenu depuis le début
(inspiré d'Anjana) : **une règle non appliquée mécaniquement n'est pas un contrat, c'est un vœu.**

## Décision
On ajoute un garde-fou : `scripts/check-deps.mjs` compare les dépendances du `package.json` à la
liste approuvée de `constitution.md` (entre les marqueurs `deps-allowlist`) et **échoue** si une
dépendance n'est pas approuvée. Ce script tourne dans la CI (job `build`), donc toute PR qui dérive
est **bloquée** automatiquement.

## Alternatives envisagées
- Rester sur la discipline seule (statu quo) : rejeté, l'incident a prouvé que ça ne tient pas.
- Un hook git local : utile mais contournable et non partagé ; la CI est la barrière fiable.

## Conséquences
- La liste de dépendances de la constitution devient un vrai contrat, vérifié à chaque PR.
- Pour ajouter une dépendance : ASK FIRST + ADR, puis l'ajouter à la liste dans le même changement,
  sinon le gate bloque. Le processus est désormais infalsifiable.
