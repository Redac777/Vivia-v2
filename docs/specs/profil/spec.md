# Spec — Module profil

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @sara
- **Dépendances** : auth
- **Statut** : Validé

## Rôle
Gérer le compte de l'utilisateur : informations de profil, préférences de notifications, abonnement, déconnexion.

## User stories
- En tant qu'utilisateur, je veux voir et modifier mon nom afin de personnaliser mon compte.
- En tant qu'utilisateur, je veux régler mes préférences de notifications afin de contrôler ce que je reçois.
- En tant qu'utilisateur, je veux voir mon abonnement afin de savoir où j'en suis.
- En tant qu'utilisateur, je veux me déconnecter depuis mon profil.

## Fonctionnalités
- [ ] Afficher le profil (nom, email)
- [ ] Éditer le nom (first_name / full_name)
- [ ] Préférences de notifications (persistées)
- [ ] Afficher l'abonnement (plan)
- [ ] Déconnexion (via le module `auth`)

## Règles métier
- Un utilisateur ne modifie que **son** profil (RLS).
- **Il ne peut PAS changer son `plan` via l'API** (verrou par grants de colonne : seuls `first_name`
  et `full_name` sont modifiables côté client). Leçon de sécurité issue de Vivia v1.
- Validation Zod des champs éditables.

## API publique du module (`index.ts`)
- `useProfile()` / `getProfile()`
- `updateProfile({ firstName?, fullName? })` (jamais `plan`)
- `getNotificationPrefs()` / `setNotificationPrefs(prefs)`

## Données
- Table `profiles` : `user_id`, `first_name`, `full_name`, `plan`. RLS + grants de colonne (anti-escalade sur `plan`).
- Préférences de notifications : persistées localement (AsyncStorage).

## Hors périmètre
- La connexion / inscription (module `auth`).
- Le paiement réel de l'abonnement (à définir, RevenueCat ultérieur).
