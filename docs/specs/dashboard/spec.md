# Spec — Module dashboard

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @sara
- **Dépendances** : taches, calendrier, stocks
- **Statut** : Validé

## Rôle
Écran d'accueil qui donne, en un coup d'œil, un résumé de la journée en agrégeant (en lecture seule)
les tâches, les rendez-vous et les alertes de stock.

## User stories
- En tant qu'utilisateur, à l'ouverture je veux voir mes tâches du jour afin de savoir quoi faire.
- En tant qu'utilisateur, je veux voir mes prochains RDV afin d'anticiper.
- En tant qu'utilisateur, je veux voir les alertes de stock bas afin de penser à réapprovisionner.

## Fonctionnalités
- [ ] Bloc « tâches d'aujourd'hui » (lecture depuis `taches`)
- [ ] Bloc « prochains RDV » (lecture depuis `calendrier`)
- [ ] Bloc « alertes stock » (lecture depuis `stocks`)
- [ ] Raccourcis vers les modules concernés

## Règles métier
- **Lecture seule** : le dashboard n'écrit jamais dans les autres modules ; toute modification se fait
  dans le module concerné.
- Agrégation via les API publiques (`index.ts`) uniquement.
- N'affiche que les données de l'utilisateur connecté (RLS au niveau des modules sources).

## API publique du module (`index.ts`)
- `useDashboard()` / `getSummary()` (composition en lecture seule)

## Données
- Aucune table propre. Lit via `taches` / `calendrier` / `stocks`.

## Hors périmètre
- Toute création / modification de données (se fait dans chaque module).
