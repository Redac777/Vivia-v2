# Spec — Module calendrier

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @amine
- **Dépendances** : auth
- **Statut** : Validé

## Rôle
Gérer les rendez-vous de l'utilisateur : vue mensuelle, détail d'un jour, création / édition / suppression d'un RDV.

## User stories
- En tant qu'utilisateur, je veux voir mes RDV dans une vue mois afin d'avoir une vision d'ensemble.
- En tant qu'utilisateur, je veux voir les RDV d'un jour sélectionné afin de préparer ma journée.
- En tant qu'utilisateur, je veux créer un RDV (titre, date, heures, lieu) afin de le planifier.
- En tant qu'utilisateur, je veux éditer ou supprimer un RDV afin de le tenir à jour.

## Fonctionnalités
- [ ] Vue mois avec indicateurs de jours contenant des RDV
- [ ] Détail d'un jour (liste des RDV)
- [ ] Créer un RDV (titre, date, heure début / fin, lieu, notes) — la date par défaut = jour sélectionné
- [ ] Éditer un RDV
- [ ] Supprimer un RDV

## Règles métier
- Titre non vide ; heure de fin postérieure à l'heure de début ; date valide.
- Chaque utilisateur ne voit et ne modifie que ses propres RDV (RLS).

## API publique du module (`index.ts`)
- `useRdv(periode)` / `listRdv(periode)`
- `addRdv(input)` / `updateRdv(id, patch)` / `removeRdv(id)`

## Données
- Table `rdv` : `id`, `user_id`, `titre`, `date`, `heure_debut`, `heure_fin`, `lieu`, `notes`. RLS par `user_id`.

## Hors périmètre
- Les invitations / partage de RDV et la récurrence (à définir, ultérieur).
- Les notifications de rappel (module notifications, ultérieur).
