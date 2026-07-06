# CLAUDE.md — Vivia

> Fichier chargé automatiquement au début de chaque session Claude Code. C'est le **manuel
> d'opération de l'agent** : tout ce qu'il faut pour travailler seul, sans redemander à chaque étape,
> et sans refaire d'erreurs. Garde-le à jour.

## Le projet en une phrase
Un assistant de vie proactif alimenté par l'IA : tâches, calendrier, stocks et un check-in IA quotidien.

- **Type** : mobile (Expo / React Native) · **Utilisateurs** : des particuliers qui veulent organiser leur quotidien sans effort · **Langue de travail** : français

## Stack
- Langage : TypeScript (mode strict)
- Framework : Expo / React Native (expo-router)
- Base de données : Supabase (PostgreSQL + RLS) · Auth : Supabase Auth (email / mot de passe)
- Styling : thème maison centralisé (src/theme) · État : store maison léger · Validation : Zod
- Déploiement : Expo Go (dev) + export web Netlify + EAS Build (posé, publication stores repoussée)

## Commandes (à utiliser, pas à réinventer)
- Installer : `npm install`
- Lancer en dev : `npx expo start`
- Typecheck : `npx tsc --noEmit`
- Lint : `npx expo lint`
- Tests unitaires : `npm test`
- Tests généraux / intégration : flux end-to-end via Expo Go (à automatiser plus tard)
- Build : `npx expo export`

## Carte des modules (bounded contexts)
Un agent travaille **dans un seul module à la fois**. Les échanges entre modules passent **uniquement**
par l'API publique du module (`index.ts`). Toucher un autre module = ouvrir une PR revue par son owner.

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
<!-- ex. | Module | Rôle | Owner | Dépendances | -->

## Avant de coder
1. Lis la spec du module concerné : `docs/specs/<module>/spec.md` (+ `plan.md`, `design.md`, `test-plan.md`).
2. Lis le `CLAUDE.md` du module (`src/modules/<module>/CLAUDE.md`).
3. Lis `constitution.md` (règles non-négociables).
4. Regarde `docs/adr/` pour toute décision qui concerne ta zone.
5. Note-toi dans `journal/<branche>.md` (mémoire de session, gitignorée).

---

## Boucle de travail d'une tâche (fais-le dans cet ordre, sans demander)
1. **Créer le bureau isolé** : `./scripts/new-task.sh <type> <scope> <persona>` → crée un worktree +
   une branche `<type>/<persona>/<scope>` (ex. `feat/reda/auth`) et signe les commits au nom de la
   persona. Jamais deux tâches dans le même worktree.
2. **Lire la spec** du module et se limiter à **un seul module**.
3. **Coder** la fonctionnalité.
4. **Tester aux 3 niveaux** (voir Règle des 3 niveaux ci-dessous).
5. **Vérifier** : `npx tsc --noEmit` + `npx expo lint` + `npm test` doivent être verts.
6. **Sécurité** : lancer `/security-review` ; si la fonctionnalité expose une surface (API, auth,
   données), écrire/mettre à jour les scripts de test sécurité dans `security/`.
7. **Commit atomique** (Conventional Commits, voir plus bas). Push.
8. **Mettre à jour la doc du module** (partie du Done, voir Discipline de documentation) : `spec.md`
   (contrat réel), `tasks.md` (avancement), `test-plan.md` (tests), `design.md` (si UI), + CHANGELOG,
   + ADR si décision, + mistakes-log si erreur non-évidente rencontrée.
9. **Ouvrir la PR** avec le template rempli. Ne merge que si la CI est verte et la revue faite.

## Règle des 3 niveaux de test (NON-NÉGOCIABLE)
**Toute fonctionnalité validée et terminée est testée aux 3 niveaux avant d'être déclarée « done ».**
- **(a) Test unitaire** : au moins 1 test sur la logique isolée de la fonctionnalité (`npm test`).
- **(b) Test général / intégration** : le flux complet est couvert (`flux end-to-end via Expo Go (à automatiser plus tard)`).
- **(c) Test de sécurité** : `/security-review` passé, + suite de scripts sécurité si surface exposée.
Tant que les 3 ne sont pas verts, la fonctionnalité n'est **pas** terminée : n'ouvre pas la PR.

## Definition of Done (par fonctionnalité)
typecheck + lint verts · **3 niveaux de test verts** · `/security-review` passé · un seul module
touché · **doc du module à jour** (`spec.md` / `tasks.md` / `test-plan.md` / `design.md`) + CHANGELOG
(+ ADR / mistakes-log si besoin) · PR ouverte avec le template rempli. Tant que ce n'est pas coché,
**continue** au lieu de rendre la main.

## Discipline de documentation (les fichiers sont TOUJOURS à jour)
La doc fait partie du code livré, pas un extra. **Une PR qui change le comportement d'un module sans
mettre à jour sa doc est incomplète.** À chaque tâche, l'agent synchronise, dans le même diff :
- **`docs/specs/<module>/spec.md`** : le contrat réel (fonctionnalités, règles, API publique). Jamais
  de placeholder `...` : si une case n'est pas encore connue, l'écrire « à définir » explicitement.
- **`docs/specs/<module>/tasks.md`** : coche ce qui est fait, déplace en « En cours » / « Terminé ».
- **`docs/specs/<module>/test-plan.md`** : reflète les tests réellement écrits (les 3 niveaux).
- **`docs/specs/<module>/design.md`** + `design/<module>/` : la maquette adoptée si l'UI change.
- **`docs/ARCHITECTURE.md`** : si la structure ou une API publique change.
- **`CHANGELOG.md`**, **`docs/adr/`** (décision), **`docs/mistakes-log.md`** (erreur non-évidente).
Règle simple : **le code et sa doc avancent ensemble**. C'est vérifié à la revue (check-list PR).

---

## Commits (Conventional Commits)
Format : `type(scope): résumé court` — types : `feat|fix|refactor|chore|docs|test|style|ci`.
Un commit = **un seul** changement logique. Jamais de secret ni de `.env`. Jamais de `console.log`.

## Quand agir seul vs demander

### ALWAYS DO (agis directement, ne demande pas)
- Corriger un bug, choisir la mise en œuvre **dans le périmètre de la spec**, écrire les tests, commiter.
- Suivre la boucle de travail et la Definition of Done jusqu'au bout.

### ASK FIRST (demande avant)
- Ajouter une dépendance hors de la liste approuvée (`constitution.md`).
- Changer le schéma de la base de données.
- Modifier une décision d'architecture ou la signature d'une API publique.
- Toute action irréversible (suppression, force-push, envoi externe).

### NEVER DO
- Commiter un secret / `.env`. · Pousser directement sur `main`. · Utiliser `any` en TypeScript.
- Modifier le module d'un autre owner sans PR + revue. · Laisser une fonctionnalité sans ses 3 tests.

---

## Modèle de mémoire (où va quoi)
- **Décision importante** → un ADR : `docs/adr/NNNN-titre.md`.
- **Erreur non-évidente** → une entrée dans `docs/mistakes-log.md` (la faute + la règle qui l'évite).
- **État d'un module** → sa spec `docs/specs/<module>/`, tenue à jour.
- **Historique** → `CHANGELOG.md` (dérivé des titres de PR).
- **Notes de session** → `journal/<branche>.md` (gitignoré, éphémère, jamais poussé).
Règle d'or : rien d'important ne reste seulement dans `journal/`. Promeus-le avant d'ouvrir la PR.

## Pointeurs
- Règles non-négociables : `constitution.md`
- Workflow détaillé (branches, worktrees, PR) : `CONTRIBUTING.md`
- Architecture : `docs/ARCHITECTURE.md` · Design : `docs/design-language.md`
- Erreurs à ne pas refaire : `docs/mistakes-log.md`
