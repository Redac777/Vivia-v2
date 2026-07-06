# Tâches — Module auth

> La liste des tâches concrètes pour livrer le module. Chaque tâche = une branche/worktree. Une tâche
> n'est cochée que quand ses **3 niveaux de test** sont verts (voir `test-plan.md`).

## À faire
- [ ] Client Supabase runtime : `src/shared/lib/supabase.ts` (env `EXPO_PUBLIC_*` + AsyncStorage, session persistante)
- [ ] Écran(s) de connexion / inscription selon `design.md` + branchement `index` → client réel
- [ ] Test d'intégration du parcours inscription → connexion → session (niveau b)
- [ ] Scripts de sécurité `security/` (isolation RLS, escalade, anonyme) + `/security-review` (niveau c)

## En cours
- (rien)

## Terminé
- [x] Structure du module + `index.ts` (API publique)
- [x] Validation des identifiants (Zod) `validateCredentials` (PR #1)
- [x] Service d'auth `createAuth` : signUp / signIn / signOut / getCurrentUser (validation + anti-fuite)
- [x] Adaptateur Supabase `supabaseAuthGateway` (client injecté, couche données)
- [x] Tests unitaires du service (gateway factice) — niveau (a)

<!-- Rappel : `./scripts/new-task.sh feat auth <persona>` pour démarrer une tâche isolée
     (persona = qui travaille, ex. l'owner @reda). -->
