# ADR 0003 — Auth via gateway injecté (couche données remplaçable)

- **Statut** : Accepté
- **Date** : 2026-07-06
- **Auteur** : reda
- **Module(s) concerné(s)** : auth

## Contexte
Le service d'auth doit être testable sans réseau ni projet Supabase, tout en parlant à Supabase en
production. La constitution impose déjà « une couche données remplaçable (`data/`) = seul endroit qui
parle à la base ».

## Décision
Le module définit un contrat `AuthGateway` (signUp / signIn / signOut / getUser). Le service
(`createAuth(gateway)`) contient toute la logique (validation Zod, orchestration, anti-fuite d'info)
et reçoit le gateway par **injection**. L'implémentation Supabase (`supabaseAuthGateway(client)`) vit
dans `data/` et reçoit le client Supabase, lui aussi injecté (créé plus tard avec les variables d'env).

## Alternatives envisagées
- Appeler Supabase directement dans le service : rejeté, non testable sans réseau et couplage fort.

## Conséquences
- Tests unitaires du service avec un gateway factice (aucun réseau) — niveau (a) complet.
- Reste à faire (incrément UI) : créer le client Supabase runtime (env + AsyncStorage, session
  persistante), les écrans, brancher `index` sur le client réel, puis tests (b) et (c).
