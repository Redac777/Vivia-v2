# Architecture — Vivia

> Le plan du bâtiment. Un nouveau (humain ou agent) le lit pour comprendre la structure d'ensemble
> et savoir où va chaque chose. À mettre à jour quand la structure évolue (via ADR pour les décisions).

## Vue d'ensemble
Un assistant de vie proactif alimenté par l'IA : tâches, calendrier, stocks et un check-in IA quotidien.

Type de projet : **mobile (Expo / React Native)**. Stack : Expo / React Native (expo-router) · Supabase (PostgreSQL + RLS) · Supabase Auth (email / mot de passe).

## Principe directeur : micro-modules (bounded contexts)
Chaque module métier est un **livrable autonome** : il a ses écrans, sa logique, ses données, ses
tests, son `README.md` et son `CLAUDE.md`. Règles :
1. Un module expose une **API publique** via `index.ts` ; les autres n'importent QUE ça.
2. Aucun module n'importe l'intérieur d'un autre.
3. **Un agent = un module à la fois.** Les changements inter-modules passent par une PR + revue de l'owner.
4. Le thème / design est externalisé (voir `design-language.md`).

## Arborescence
```
src/
├── modules/          # modules métier autonomes (voir carte ci-dessous)
├── shared/           # UI kit neutre + utilitaires réutilisables
└── ...               # coquilles de navigation / routes (fines, sans logique métier)
docs/                 # architecture, specs, ADR, design, erreurs
design/               # maquettes adoptées par module
security/             # scripts de test de sécurité
```

## Carte des modules
| Module | Rôle | Owner | Dépend de |
|--------|------|-------|-----------|
| onboarding | Splash, présentation et écran de bienvenue. | @sara | aucune |
| auth | Inscription et connexion via Supabase. | @reda | aucune |
| dashboard | Écran d'accueil qui agrège tâches, calendrier et stocks. | @sara | taches, calendrier, stocks |
| taches | Liste et gestion des tâches (CRUD). | @reda | auth |
| calendrier | Mois, détail RDV et nouveau RDV (CRUD). | @amine | auth |
| stocks | Catégories et articles Cuisine / Hygiène / Vêtements (CRUD). | @amine | auth |
| chat | Check-in IA quotidien, et gestion des tâches, stocks et RDV via l'IA. | @sara | taches, stocks, calendrier |
| profil | Compte, préférences de notifications, abonnement. | @sara | auth |
<!-- | Module | Rôle | Owner | Dépendances | Écrans/Interfaces | -->

## Flux de données
UI → validation Zod → couche données (repository) → Supabase (Postgres + RLS) → store maison → UI. L'auth (Supabase Auth) scope chaque requête à l'utilisateur connecté ; les modules communiquent uniquement via leur `index.ts`.
<!-- Décrire brièvement : UI → validation (Zod) → couche données → Supabase (PostgreSQL + RLS) → UI.
     Où vit l'auth (Supabase Auth (email / mot de passe)), comment les modules communiquent (index.ts). -->

## Couche données
Chaque module a une **couche données remplaçable** (`data/*.repository.ts` ou équivalent) : c'est le
seul endroit qui parle à Supabase (PostgreSQL + RLS). On peut changer le backend sans réécrire l'UI.

## Décisions
Les choix structurants sont tracés dans `docs/adr/`. Voir `docs/adr/000-adr-process.md`.

## Évolutions prévues
1. Modules CRUD (taches, calendrier, stocks) sur Supabase. 2. Dashboard agrégateur. 3. Chat IA (Claude API) pilotant les modules. 4. Notifications. 5. Déploiement (web Netlify, EAS).
