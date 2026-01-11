# Sprint 1 — Consultation des sanctions (API REST + CLI)

## Contexte
Dans ce second projet, vous devez développer une **API REST** permettant à des **personnels de direction** (proviseur, proviseur adjoint, secrétaire de proviseur) de consulter les données issues de la base de données du projet *Sanctions*.

Cette API sera consommée par une **application console (CLI)** développée avec **CommanderJS**.

Le Sprint 1 correspond à la **première version utilisable** du produit.

---

## Objectif du sprint
À la fin de ce sprint, un personnel de direction doit pouvoir :

- s’authentifier auprès de l’API,
- consulter la liste des sanctions,
- rechercher des sanctions à l’aide de filtres,
- consulter l’historique disciplinaire d’un élève,
- rechercher un élève par nom ou prénom,
- utiliser ces fonctionnalités via une **CLI**.

---

## Durée du sprint
⏱️ **2 semaines**

---

## User Stories du sprint

### US-1 — Authentification
**En tant que** personnel de direction  
**Je veux** m’authentifier auprès de l’API  
**Afin de** sécuriser l’accès aux données sensibles.

- Endpoint :
  - `POST /api/auth/login`
- Résultat attendu :
  - Retour d’un token d’authentification

---

### US-2 — Lister les sanctions avec filtres
**En tant que** personnel de direction  
**Je veux** consulter la liste des sanctions avec des filtres  
**Afin de** rechercher rapidement des informations utiles.

- Endpoint :
  - `GET /api/sanctions`
- Filtres possibles (query parameters) :
  - `eleveId`
  - `classeId`
  - `type`
  - `from` / `to`

---

### US-3 — Consulter l’historique disciplinaire d’un élève
**En tant que** personnel de direction  
**Je veux** consulter toutes les sanctions d’un élève  
**Afin de** préparer un entretien ou un conseil de discipline.

- Endpoint :
  - `GET /api/eleves/:id/sanctions`

---

### US-4 — Rechercher un élève
**En tant que** secrétaire de proviseur  
**Je veux** rechercher un élève par son nom ou son prénom  
**Afin de** accéder rapidement à son dossier.

- Endpoint :
  - `GET /api/eleves?nom=`

---

### US-5 — Lister les classes
**En tant que** personnel de direction  
**Je veux** consulter la liste des classes  
**Afin de** naviguer plus facilement dans les données.

- Endpoint :
  - `GET /api/classes`


