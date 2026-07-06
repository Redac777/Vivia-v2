# Spec — Module taches

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @reda
- **Dépendances** : auth
- **Statut** : Validé

## Rôle
Gérer les tâches quotidiennes de l'utilisateur (création, consultation filtrée, complétion, édition, suppression).

## User stories
- En tant qu'utilisateur, je veux ajouter une tâche (titre, date, priorité) afin de ne rien oublier.
- En tant qu'utilisateur, je veux filtrer mes tâches (aujourd'hui / cette semaine / toutes) afin de me concentrer.
- En tant qu'utilisateur, je veux cocher une tâche terminée afin de suivre mon avancement.
- En tant qu'utilisateur, je veux éditer ou supprimer une tâche afin de corriger une erreur.

## Fonctionnalités
- [ ] Créer une tâche (titre, date, priorité)
- [ ] Lister les tâches avec filtres : Aujourd'hui / Semaine / Toutes
- [ ] Marquer une tâche comme faite / non faite
- [ ] Éditer une tâche
- [ ] Supprimer une tâche

## Règles métier
- Titre non vide ; date valide (ISO) ; priorité dans un ensemble défini (ex. basse / normale / haute).
- Chaque utilisateur ne voit et ne modifie que ses propres tâches (RLS).
- Les filtres se calculent sur la date de la tâche (jour courant / semaine ISO courante).

## API publique du module (`index.ts`)
- `useTaches(filtre)` / `listTaches(filtre)`
- `addTache(input)` / `updateTache(id, patch)` / `removeTache(id)` / `toggleDone(id)`

## Données
- Table `taches` : `id`, `user_id`, `titre`, `date` (ISO), `priorite`, `done`, timestamps. RLS par `user_id`.

## Hors périmètre
- Les rappels / notifications (module notifications, ultérieur).
- L'agrégation dans l'accueil (module `dashboard`, en lecture seule).
