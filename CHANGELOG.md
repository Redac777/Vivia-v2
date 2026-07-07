# Changelog — Vivia

> Historique des changements, dérivé des titres de Pull Requests (squash merge). Le plus récent en
> haut. On n'écrit pas ce fichier à la main ligne par ligne : chaque PR mergée y ajoute son titre.
> Format inspiré de [Keep a Changelog](https://keepachangelog.com/), versions en [SemVer](https://semver.org/).

## [Non publié]
### Ajouté
- feat(auth): validation des identifiants (Zod) + socle de tests (base projet, ADR-001)
- ci: gate de conformité des dépendances (`check-deps`) — la constitution devient mécaniquement appliquée (ADR-002)
- feat(auth): service d'auth (signUp / signIn / signOut / session) + adaptateur Supabase injecté (ADR-003)
- feat(auth): client Supabase runtime (env validé Zod + storage injectable) + `createSupabaseAuth` + test d'intégration réseau réel (ADR-004)

### Modifié
- docs: règle « Accès et secrets » (lire les identifiants depuis `.env`) ajoutée au CLAUDE.md
- chore(deps): `@types/node` (Node test env) ; allowlist alignée sur `@types/*` (ADR-004)

### Corrigé
-

---

<!--
Convention : à chaque release, on déplace les entrées de "Non publié" sous une version datée, ex.

## [0.1.0] - 2026-07-06
### Ajouté
- feat(clients): CRUD clients (#12)
-->
