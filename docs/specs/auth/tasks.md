# Tâches — Module auth

> La liste des tâches concrètes pour livrer le module. Chaque tâche = une branche/worktree. Une tâche
> n'est cochée que quand ses **3 niveaux de test** sont verts (voir `test-plan.md`).

## À faire
- [ ] Inscription `signUp` via Supabase + création du profil (+ test unitaire + général + sécurité)
- [ ] Connexion `signIn` (+ test unitaire + général + sécurité)
- [ ] Session persistante + `getCurrentUser` (+ test général)
- [ ] Déconnexion `signOut`
- [ ] Écran(s) de connexion / inscription selon `design.md`

## En cours
- (rien)

## Terminé
- [x] Structure du module + `index.ts` (API publique)
- [x] Validation des identifiants (Zod) `validateCredentials` + 5 tests unitaires (PR #1)

<!-- Rappel : `./scripts/new-task.sh feat auth <persona>` pour démarrer une tâche isolée
     (persona = qui travaille, ex. l'owner @reda). -->
