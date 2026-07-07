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

> **État bootstrap (ADR-001)** : Expo n'est pas encore installé. Aujourd'hui, seuls **`npm run
> typecheck`** et **`npm test`** tournent. Les commandes `expo start` / `expo lint` / `expo export`
> deviennent actives à l'incrément UI (elles sont réintroduites dans `package.json` + `ci.yml` à ce
> moment-là).

## Accès et secrets (identifiants, tokens) — NON-NÉGOCIABLE
Toute donnée d'accès (URL et clés Supabase, token GitHub, clés d'API, secrets divers) se lit
**uniquement** depuis le fichier d'environnement `.env` (gitignoré), jamais en dur dans le code.
- **Avant de demander un identifiant à Reda, cherche-le d'abord dans `.env`** (référence des clés
  attendues : `.env.example`).
- **Si la clé existe et est renseignée dans `.env`** : utilise-la, sans redemander.
- **Si la clé est absente ou vide** : demande à Reda de la fournir, indique-lui la variable exacte
  à renseigner dans `.env` (ex. `EXPO_PUBLIC_SUPABASE_URL`), et ajoute-la à `.env.example` si elle
  n'y figure pas encore.
- Ne colle jamais un secret dans un message, un commit, la doc ou un log. Ne commite jamais `.env`.

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
5. **Vérifier** : typecheck + lint + tests verts. Au bootstrap (ADR-001) : `npm run typecheck` +
   `npm test` ; `expo lint` s'ajoute avec l'UI.
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

## Discipline de documentation — quand tu changes X, mets à jour Y (dans le MÊME diff)
La doc fait partie du code livré. **Une PR qui change un module sans mettre à jour sa doc est
incomplète.** Sers-toi de ce tableau : dès que tu fais l'action de gauche, mets à jour le(s) fichier(s)
de droite. Comme ça tu n'oublies rien.

| Ce que tu fais | Ce que tu mets à jour |
|---|---|
| Ajouter / modifier une fonctionnalité | `docs/specs/<module>/spec.md` (fonctionnalités, règles) · `docs/specs/<module>/tasks.md` (coche / déplace) · `CHANGELOG.md` |
| Écrire / modifier des tests | `docs/specs/<module>/test-plan.md` (les 3 niveaux) |
| Changer l'API publique (`index.ts`) | section API de `spec.md` · `src/modules/<module>/README.md` |
| Ajouter / modifier un écran (UI) | `docs/specs/<module>/design.md` + déposer la maquette dans `design/<module>/` |
| Changer l'approche technique | `docs/specs/<module>/plan.md` |
| Changer la structure ou une dépendance inter-module | `docs/ARCHITECTURE.md` (arbo / carte / flux) |
| Prendre une décision structurante | un ADR `docs/adr/NNNN-titre.md` |
| Rencontrer une erreur non-évidente | `docs/mistakes-log.md` |
| Changer une règle ou une dépendance approuvée | `constitution.md` (via ADR) |
| Changer le workflow / le comportement de l'agent | ce `CLAUDE.md` (+ `src/modules/<module>/CLAUDE.md` si c'est propre au module) |

Règle simple : **le code et sa doc avancent ensemble**. Rappel : aucun placeholder `...` dans un
`spec.md` (écrire « à définir » si inconnu). C'est vérifié à la revue (check-list PR).

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
- Commiter un secret / `.env`. · Mettre un identifiant en dur au lieu de le lire depuis `.env`. ·
  Pousser directement sur `main`. · Utiliser `any` en TypeScript.
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
