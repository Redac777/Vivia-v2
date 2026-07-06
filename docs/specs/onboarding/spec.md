# Spec — Module onboarding

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @sara
- **Dépendances** : aucune
- **Statut** : Validé

## Rôle
Accueillir le nouvel utilisateur à la première ouverture : présenter Vivia en quelques écrans et l'amener vers l'inscription.

## User stories
- En tant que nouvel utilisateur, je veux comprendre à quoi sert Vivia afin de décider de m'inscrire.
- En tant que nouvel utilisateur, je veux passer rapidement à l'inscription afin de commencer.
- En tant qu'utilisateur déjà venu, je ne veux plus revoir l'onboarding afin d'aller droit au but.

## Fonctionnalités
- [ ] Écran splash (logo)
- [ ] Écrans de présentation (slides : tâches, calendrier, stocks, IA)
- [ ] Bouton vers l'inscription / connexion (module `auth`)
- [ ] Mémoriser que l'onboarding a été vu (ne plus l'afficher ensuite)

## Règles métier
- L'onboarding ne s'affiche qu'à la première utilisation (flag persistant local).

## API publique du module (`index.ts`)
- `hasSeenOnboarding()` / `markOnboardingSeen()`

## Données
- Flag local (AsyncStorage), pas de table en base.

## Hors périmètre
- L'inscription / la connexion elles-mêmes (module `auth`).
