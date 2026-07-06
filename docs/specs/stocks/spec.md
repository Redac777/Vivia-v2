# Spec — Module stocks

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @amine
- **Dépendances** : auth
- **Statut** : Validé

## Rôle
Gérer les stocks du foyer par catégorie (Cuisine / Hygiène / Vêtements) : consultation, ajout, édition, suppression, suivi des quantités.

## User stories
- En tant qu'utilisateur, je veux voir mes articles regroupés par catégorie afin de m'y retrouver.
- En tant qu'utilisateur, je veux filtrer par catégorie afin de me concentrer sur un rayon.
- En tant qu'utilisateur, je veux ajouter un article (nom, catégorie, quantité) afin de suivre mes stocks.
- En tant qu'utilisateur, je veux éditer / supprimer un article afin de tenir mes stocks à jour.

## Fonctionnalités
- [ ] Lister les articles, groupés / filtrables par catégorie (Cuisine / Hygiène / Vêtements)
- [ ] Créer un article (nom, catégorie, quantité, unité, seuil d'alerte) — catégorie par défaut = filtre actif
- [ ] Éditer un article
- [ ] Supprimer un article
- [ ] Indicateur d'alerte quand la quantité passe sous le seuil

## Règles métier
- Nom non vide ; quantité >= 0 ; catégorie dans l'ensemble défini (Cuisine / Hygiène / Vêtements).
- Chaque utilisateur ne voit et ne modifie que ses propres articles (RLS).

## API publique du module (`index.ts`)
- `useArticles(categorie?)` / `listArticles(categorie?)`
- `addArticle(input)` / `updateArticle(id, patch)` / `removeArticle(id)`

## Données
- Table `articles` : `id`, `user_id`, `nom`, `categorie`, `quantite`, `unite`, `seuil`. RLS par `user_id`.

## Hors périmètre
- La liste de courses automatique (à définir, ultérieur).
- Les notifications de seuil bas (module notifications, ultérieur).
