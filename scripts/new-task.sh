#!/usr/bin/env bash
# new-task.sh — crée un "bureau isolé" (git worktree) pour une tâche.
# Une tâche = une branche = un worktree = une session d'agent. Personne ne se marche dessus.
#
# Usage : ./scripts/new-task.sh <type> <scope> [owner]
#   type  : feat | fix | refactor | chore | docs | test | ci
#   scope : le module/sujet, ex. clients
#   owner : persona/pseudo (défaut : nom git local, ou "dev")
#
# Exemple : ./scripts/new-task.sh feat clients reda
#   -> branche feat/reda/clients + worktree dans ../<repo>-clients

set -euo pipefail

TYPE="${1:-}"
SCOPE="${2:-}"
OWNER="${3:-$(git config user.name 2>/dev/null || echo dev)}"

if [ -z "$TYPE" ] || [ -z "$SCOPE" ]; then
  echo "Usage : ./scripts/new-task.sh <type> <scope> [owner]"
  echo "  ex.  ./scripts/new-task.sh feat clients"
  exit 1
fi

# Nettoie l'owner (minuscules, pas d'espaces)
OWNER="$(echo "$OWNER" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-')"
BRANCH="${TYPE}/${OWNER}/${SCOPE}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"
WORKTREE_DIR="${REPO_ROOT}/../${REPO_NAME}-${SCOPE}"

# Base à jour
git fetch origin --quiet || true
BASE="$(git rev-parse --abbrev-ref origin/dev_branch >/dev/null 2>&1 && echo origin/dev_branch || echo origin/main)"

echo "Création de la branche $BRANCH (basée sur $BASE)"
git worktree add -b "$BRANCH" "$WORKTREE_DIR" "$BASE"

# Copie le .env local (jamais commité) dans le nouveau worktree, s'il existe
if [ -f "${REPO_ROOT}/.env" ]; then
  cp "${REPO_ROOT}/.env" "${WORKTREE_DIR}/.env"
  echo "  .env copié dans le worktree"
fi

echo ""
echo "Bureau isolé prêt :"
echo "  cd ${WORKTREE_DIR}"
echo "  # puis lance ta session Claude Code DANS ce dossier"
echo ""
echo "Quand la tâche est finie : commit -> push -> PR. Puis :"
echo "  git worktree remove ${WORKTREE_DIR}"
