# Tâches — Module auth

> La liste des tâches concrètes pour livrer le module. Chaque tâche = une branche/worktree. Une tâche
> n'est cochée que quand ses **3 niveaux de test** sont verts (voir `test-plan.md`).

## À faire
- [ ] Écran(s) de connexion / inscription selon `design.md` (installe Expo + AsyncStorage injecté au client)
- [ ] Scripts de sécurité `security/` (isolation RLS, escalade, anonyme) — à l'incrément qui crée des tables protégées

## En cours
- (rien)

## Terminé
- [x] Structure du module + `index.ts` (API publique)
- [x] Validation des identifiants (Zod) `validateCredentials` (PR #1)
- [x] Service d'auth `createAuth` : signUp / signIn / signOut / getCurrentUser (validation + anti-fuite)
- [x] Adaptateur Supabase `supabaseAuthGateway` (client injecté, couche données)
- [x] Tests unitaires du service (gateway factice) — niveau (a)
- [x] Client Supabase runtime `src/shared/lib/supabase.ts` (env validé Zod + storage injectable, session persistante) — ADR-004
- [x] Racine de composition `createSupabaseAuth(client)` + branchement `index` → client réel
- [x] Test d'intégration parcours inscription → connexion → session → déconnexion (Node, réseau réel) — niveau (b)

<!-- Rappel : `./scripts/new-task.sh feat auth <persona>` pour démarrer une tâche isolée
     (persona = qui travaille, ex. l'owner @reda). -->
