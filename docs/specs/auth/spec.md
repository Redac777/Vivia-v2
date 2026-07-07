# Spec — Module auth

> **QUOI et POURQUOI.** Le contrat du module. Tenu à jour à chaque tâche (Discipline de documentation).

- **Owner** : @reda
- **Dépendances** : aucune
- **Statut** : Validé

## Rôle
Permettre à l'utilisateur de créer un compte, se connecter et rester connecté, via Supabase Auth.

## User stories
- En tant que nouvel utilisateur, je veux créer un compte avec email + mot de passe afin d'accéder à Vivia.
- En tant qu'utilisateur, je veux me connecter afin de retrouver mes données.
- En tant qu'utilisateur, je veux rester connecté entre deux ouvertures afin de ne pas ressaisir mes identifiants.
- En tant qu'utilisateur, je veux me déconnecter afin de protéger mon compte sur un appareil partagé.

## Fonctionnalités
- [x] Validation des identifiants côté client (email valide, mot de passe >= 8) via Zod
- [x] Logique d'inscription (`signUp`) : validation + appel gateway + mapping d'erreur
- [x] Logique de connexion (`signIn`) : validation + message générique anti-fuite d'info
- [x] Logique de déconnexion (`signOut`) et récupération de l'utilisateur (`getCurrentUser`)
- [x] Adaptateur Supabase (`supabaseAuthGateway`, client injecté)
- [x] Client Supabase runtime (`src/shared/lib/supabase.ts`) : env validé par Zod, storage injectable, session persistante (ADR-004)
- [x] Racine de composition `createSupabaseAuth(client)` : branche le vrai client sur le service
- [x] Test d'intégration du parcours inscription → connexion → session → déconnexion (Node, réseau réel) — niveau (b)
- [ ] Écran(s) de connexion / inscription (UI) — incrément suivant (installe Expo + AsyncStorage injecté au client)
- [ ] Scripts de sécurité RLS (isolation, escalade, anonyme) — à l'incrément qui crée des tables protégées

## Règles métier
- Email valide et normalisé (trim) ; mot de passe d'au moins 8 caractères.
- Messages d'erreur clairs mais **sans fuite d'information** : à la connexion, message générique
  (« Email ou mot de passe incorrect. »), on ne révèle pas si l'email existe.
- Chaque utilisateur n'accède qu'à ses propres données (isolation par RLS au niveau base).

## API publique du module (`index.ts`)
- `validateCredentials(input): ValidationResult`
- `createAuth(gateway): { signUp, signIn, signOut, getCurrentUser }`
- `createSupabaseAuth(client): { signUp, signIn, signOut, getCurrentUser }` (racine de composition : `createAuth(supabaseAuthGateway(client))`)
- `supabaseAuthGateway(client): AuthGateway` (couche données)
- Types : `Credentials`, `AuthUser`, `AuthOutcome`, `AuthGateway`, `ValidationResult`

Le **client Supabase** lui-même est fabriqué hors du module, dans `src/shared/lib/supabase.ts`
(`createSupabaseClient({ storage })`), puis injecté à `createSupabaseAuth`. Le module ne connaît ni
les variables d'environnement ni le storage (ADR-003 / ADR-004).

## Données
- Supabase Auth (table des utilisateurs). Un profil est créé à l'inscription (voir module `profil`,
  table `profiles`, via trigger). Isolation par utilisateur (RLS).

## Hors périmètre
- La gestion détaillée du profil (module `profil`).
- La réinitialisation de mot de passe (à définir, version ultérieure).
