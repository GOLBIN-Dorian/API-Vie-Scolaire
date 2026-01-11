# 🔐 US1 — Authentification (API REST)

## 🎯 Titre / Objectif

> **En tant que** personnel de direction (proviseur, proviseur adjoint, secrétaire de proviseur)
> **Je veux** m’authentifier auprès de l’API REST
> **Afin de** sécuriser l’accès aux données sensibles liées aux sanctions des élèves.

---

## 🔍 Description

Cette User Story permet à un membre du **personnel de direction** de s’authentifier auprès de l’API REST du projet *Sanctions*.

L’authentification repose sur un mécanisme de **token (JWT)** retourné par l’API après vérification des identifiants.
Ce token sera ensuite utilisé pour **autoriser l’accès aux endpoints protégés** (consultation des sanctions, recherche d’élèves, etc.).

Cette US constitue une **brique technique fondamentale** du projet : aucune autre fonctionnalité du Sprint 1 ne pourra être utilisée sans authentification préalable.

---

## 🌐 Endpoint concerné

### `POST /api/auth/login`

**Corps de la requête (JSON)**

```json
{
  "email": "direction@etablissement.fr",
  "password": "motDePasse"
}
```

**Réponse en cas de succès (200 OK)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Réponse en cas d’échec (401 Unauthorized)**

```json
{
  "message": "Identifiants incorrects"
}
```

---

## ✅ Critères d’acceptation

### CA1 — Authentification valide

* L’utilisateur fournit un **email** et un **mot de passe** valides.
* L’API vérifie l’existence de l’utilisateur et la correspondance du mot de passe (haché).
* Un **token JWT** est généré et retourné.

---

### CA2 — Authentification invalide

* Si l’email n’existe pas ou si le mot de passe est incorrect :

  * aucun détail sensible n’est divulgué,
  * un message générique est retourné,
  * le statut HTTP est **401 Unauthorized**.

---

### CA3 — Sécurité

* Les mots de passe sont **hachés** en base de données.
* Le token contient :

  * l’identifiant de l’utilisateur,
  * son rôle (direction),
  * une date d’expiration.
* Les endpoints du Sprint 1 sont **inaccessibles sans token valide**.

---

### CA4 — Utilisation côté client (CLI)

* Le token est :

  * stocké localement par la CLI (ex. fichier de configuration),
  * automatiquement ajouté dans l’en-tête `Authorization` lors des appels API suivants.

---

## 📊 Règles métier

| Élément      | Règle                                         |
| ------------ | --------------------------------------------- |
| Email        | Obligatoire, unique, format valide            |
| Mot de passe | Comparé via hash uniquement                   |
| Accès        | Réservé aux personnels de direction           |
| Token        | Obligatoire pour accéder aux routes protégées |

---

## 📌 Dépendances

* Base de données utilisateurs existante (projet Sanctions)
* Aucun autre endpoint requis en amont

---

## 👥 Parties prenantes

| Rôle                    | Responsabilité                                     |
| ----------------------- | -------------------------------------------------- |
| Product Owner           | Valide le niveau de sécurité et les règles d’accès |
| Équipe de développement | Implémente l’authentification JWT                  |
| Utilisateur final       | Vérifie la simplicité de connexion via la CLI      |

---

## ✅ Definition of Done (DoD)

* Endpoint `/api/auth/login` fonctionnel.
* Authentification sécurisée et testée (succès / échec).
* Token JWT généré et vérifiable.
* Accès aux autres endpoints bloqué sans token.
* Utilisable depuis la CLI.
* US validée en revue de sprint.
