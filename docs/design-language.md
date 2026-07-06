# Design Language — Vivia

> La source de vérité visuelle du projet. Tous les modules s'y réfèrent. Changer une couleur ici doit
> se répercuter partout (thème externalisé). Les maquettes concrètes par interface vivent dans
> `design/<module>/`.

## Ambiance
bleu indigo premium, épuré façon Notion / Linear, fond clair
<!-- ex. « bleu indigo premium, épuré façon Notion/Linear » -->

## Couleurs
- Primaire : `#3B5BDB`
- Fond : `#F9FAFB`
- Texte : `#1A1A2E`
- Accent / succès / erreur : `#2E49B0` / `#27AE60` / `#E74C3C`

## Typographie
- Police : `Inter`
- Échelle : titres / corps / légendes (définir les tailles).

## Espacements & rayons
- Grille d'espacement : 4 / 8 / 16 / 24 / 32 (ex. 4 / 8 / 16 / 24 / 32)
- Rayons de coin : 8 / 12 / 16

## Composants partagés
Les composants réutilisables (Button, Card, Field, etc.) vivent dans `src/shared/` et consomment ces
tokens. On ne redéfinit pas de style local qui contourne le design language.

## Maquettes
- Outil : **Claude Design**.
- Chaque interface a sa maquette adoptée, **datée et versionnée**, dans `design/<module>/`. On ne
  réécrit jamais une maquette par-dessus : on crée une nouvelle version datée (voir `design/<module>/README.md`).
