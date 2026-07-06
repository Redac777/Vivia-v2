# Vivia

Un assistant de vie proactif alimenté par l'IA : tâches, calendrier, stocks et un check-in IA quotidien.

- **Type** : mobile (Expo / React Native)
- **Utilisateurs** : des particuliers qui veulent organiser leur quotidien sans effort
- **Stack** : Expo / React Native (expo-router) · Supabase (PostgreSQL + RLS) · Supabase Auth (email / mot de passe)

## Démarrage rapide
```bash
npm install
npx expo start
```
Configuration : copier `.env.example` en `.env` et renseigner les variables (voir plus bas).

## Structure
```
src/modules/         # modules métier autonomes (1 owner chacun)
docs/                # architecture, specs, décisions (ADR), design, erreurs
design/              # maquettes adoptées par module/interface
security/            # scripts de test de sécurité
.github/             # CI, CODEOWNERS, template de PR
scripts/             # outillage (new-task.sh…)
```

## Modules
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

## Contribuer
Lis `CONTRIBUTING.md` (workflow complet) et `CLAUDE.md` (règles pour l'agent). En résumé : une tâche
= une branche = un worktree ; tests aux 3 niveaux ; PR vers `dev_branch` ; merge sur CI verte.

## Documentation
- Architecture : `docs/ARCHITECTURE.md`
- Règles non-négociables : `constitution.md`
- Décisions : `docs/adr/`
- Design : `docs/design-language.md`
