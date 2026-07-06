# Spec — Module chat

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @sara
- **Dépendances** : taches, stocks, calendrier
- **Statut** : Validé

## Rôle
Assistant IA conversationnel : check-in quotidien, et gestion des tâches, stocks et rendez-vous à la
demande de l'utilisateur, en pilotant les autres modules via leur API publique.

## User stories
- En tant qu'utilisateur, je veux un check-in IA quotidien afin de faire le point sur ma journée.
- En tant qu'utilisateur, je veux demander à l'IA de créer / modifier une tâche, un RDV ou un article
  afin de tout gérer par la conversation.
- En tant qu'utilisateur, je veux que l'IA me réponde dans le fil afin de garder l'historique.

## Fonctionnalités
- [ ] Fil de conversation (envoi / affichage des messages)
- [ ] Check-in quotidien (message d'accueil contextualisé)
- [ ] Actions IA (function-calling) vers `taches`, `stocks`, `calendrier` via leur API publique
- [ ] Confirmation avant toute action destructive (suppression)

## Règles métier
- L'IA agit **uniquement** via l'API publique (`index.ts`) des autres modules, jamais en accédant à
  leur intérieur ni à la base directement.
- Confirmation explicite avant une action irréversible.
- Chaque utilisateur ne voit que sa propre conversation et n'agit que sur ses propres données (RLS).

## API publique du module (`index.ts`)
- `useChat()` / `sendMessage(texte)` / `history()`

## Données
- Table `messages` : `id`, `user_id`, `role` (user / assistant), `contenu`, `date`. RLS par `user_id`.
- Consomme `taches` / `stocks` / `calendrier` via leur `index.ts` (pas de table partagée).

## Hors périmètre
- La logique métier des autres modules (déléguée à ceux-ci).
- Le branchement du vrai LLM (Claude API) : à définir à l'incrément IA (réponses factices d'abord).
