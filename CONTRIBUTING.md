# CONTRIBUTING — Vivia

Tout le workflow de collaboration en une page. À lire avant de contribuer. Valable pour les humains
comme pour les agents IA.

## Principe : 2 natures de fichiers
- **Loi partagée** (versionnée, modifiée uniquement par PR) : `CLAUDE.md`, `constitution.md`, specs,
  `docs/`, `.github/`, design-language. Comme du code : on ne la change qu'en PR.
- **Mémoire perso / session** (gitignorée, jamais poussée) : `journal/`, `.env`, `CLAUDE.local.md`,
  `.claude/settings.local.json`.

## Une tâche = une branche = un worktree = une session d'agent
On ne lance jamais deux agents sur le même dossier. Chacun son bureau isolé (git worktree).

```bash
./scripts/new-task.sh feat clients     # crée un worktree isolé + la branche feat/<toi>/clients
```

- **Nommage des branches** : `type/owner/scope` — ex. `feat/reda/clients`, `fix/amine/filtres`.
- Types : `feat | fix | refactor | chore | docs | test | ci`.
- Commits fréquents et petits ; le bruit sera absorbé par le **squash merge**.

## Le cycle complet
1. `new-task.sh` → worktree + branche.
2. Coder **un seul module**, en suivant sa spec (`docs/specs/<module>/`).
3. **Tester aux 3 niveaux** (unitaire + général + sécurité) — non-négociable.
4. `/security-review` + scripts sécurité si surface exposée.
5. Commit (Conventional Commits) + push.
6. Mettre à jour la mémoire durable (spec, CHANGELOG, ADR/mistakes-log si besoin).
7. Ouvrir la **PR** vers `dev_branch` (ou `main`) avec le template rempli.
8. CI verte + revue de l'owner (CODEOWNERS) → merge (squash) → branche supprimée.

## Protection de `main`
- Pas de push direct : **PR obligatoire**.
- **CI verte obligatoire** avant merge. Branche à jour avant merge (rebase).
- Revue **CODEOWNERS** obligatoire. Squash merge + suppression auto de la branche.
- Conversations résolues avant merge.

## Simuler une équipe à plusieurs avec un seul compte GitHub (personas)
Quand une seule personne joue plusieurs devs :
- On garde des **personas** par convention : `feat/devA/...`, `feat/devB/...`, et CODEOWNERS attribue
  chaque module à un persona.
- GitHub interdit d'**approuver sa propre PR** : on met donc les **approbations requises à 0** (au lieu
  de 1). On **conserve** la CI verte + la revue CODEOWNERS + les autres protections.
- Résultat : on vit le vrai flux worktrees → PR → merge sans se bloquer soi-même.
- Pour une vraie équipe : passer les approbations à 1 (ou 2) et retirer l'assouplissement.

## Décisions et erreurs
- Décision structurante → un **ADR** : `docs/adr/NNNN-titre.md` (voir `docs/adr/000-adr-process.md`).
- Erreur non-évidente → une entrée dans `docs/mistakes-log.md`.
- Ces deux mécanismes remplacent un gros journal monolithique (qui créerait des conflits en équipe).

## Check-list PR (rappel)
- [ ] CI verte
- [ ] 3 niveaux de test verts (unitaire + général + sécurité)
- [ ] `/security-review` passé
- [ ] un seul module touché (sinon justifier)
- [ ] specs / ADR à jour, CHANGELOG mis à jour
- [ ] aucun secret / `.env`
- [ ] owner du module tagué comme reviewer
