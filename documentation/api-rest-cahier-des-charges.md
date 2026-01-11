Voici une **première liste de User Stories** pour ton *projet 2* : une **API REST ExpressJS** (backend) + une **CLI CommanderJS** (frontend console), destinée aux **personnels de direction** (proviseur, proviseur adjoint, secrétaire).
Je me base sur les entités et besoins du projet sanctions (utilisateurs, classes, élèves, professeurs, sanctions, historique, filtrage) , en ajoutant des usages “direction” : **pilotage, suivi global, préparation de réunions, reporting**.

> Contrainte demandée : l’API expose des endpoints **GET** et **POST** (pas de PUT/DELETE dans cette 1ʳᵉ version).

---

## Épic A — Accès & sécurité (direction)

### US-A1 — Connexion (token)

**En tant que** personnel de direction
**Je veux** m’authentifier via l’API
**Afin de** sécuriser l’accès aux données sensibles.

* **POST** `/api/auth/login` (email, mot de passe) → retourne un token
* (Optionnel) **GET** `/api/auth/me` → infos de l’utilisateur connecté

---

## Épic B — Consultation “Direction” (vision globale)

### US-B1 — Consulter un tableau de bord “chiffres clés”

**En tant que** proviseur/adjoint
**Je veux** consulter des indicateurs globaux
**Afin de** connaître rapidement la situation.

* **GET** `/api/dashboard`
  Exemples d’indicateurs : nb sanctions (mois), nb élèves sanctionnés, répartition par type, top classes concernées.

### US-B2 — Lister les sanctions avec filtres avancés

**En tant que** personnel de direction
**Je veux** lister les sanctions avec des filtres
**Afin de** faire des recherches rapides (réunion, conseil de discipline…).

* **GET** `/api/sanctions?classeId=&eleveId=&type=&from=&to=&profId=`

### US-B3 — Consulter l’historique complet d’un élève

**En tant que** personnel de direction
**Je veux** consulter l’historique des sanctions d’un élève
**Afin de** préparer un entretien ou un suivi.

* **GET** `/api/eleves/:id/sanctions`

### US-B4 — Rechercher un élève (par nom/prénom)

**En tant que** secrétaire de proviseur
**Je veux** rechercher un élève par nom/prénom
**Afin de** retrouver rapidement son dossier.

* **GET** `/api/eleves?search=dupont`

### US-B5 — Lister les classes + effectifs

**En tant que** personnel de direction
**Je veux** consulter la liste des classes et leur effectif
**Afin de** naviguer facilement et identifier les groupes.

* **GET** `/api/classes` (avec éventuellement `include=effectif`)

### US-B6 — Consulter une classe et ses élèves

**En tant que** personnel de direction
**Je veux** consulter les élèves d’une classe
**Afin de** repérer rapidement les élèves concernés.

* **GET** `/api/classes/:id/eleves`

---

## Épic C — Actions spécifiques “Direction” (création via POST)

> L’idée : la direction ne fait pas “tout le CRUD”, mais **déclenche des actions utiles** (signalements, demandes, annotations, convocations internes, etc.) tout en restant cohérent avec la base sanctions.

### US-C1 — Enregistrer une sanction (création direction)

**En tant que** personnel de direction
**Je veux** créer une sanction via l’API
**Afin de** enregistrer un cas urgent ou validé en réunion.

* **POST** `/api/sanctions`
  Champs typiques : date, motif, type, eleveId, profId (ou “auteur”), commentaire direction.

### US-C2 — Créer un signalement “incident à traiter”

**En tant que** proviseur adjoint
**Je veux** enregistrer un incident à traiter
**Afin de** centraliser les cas avant décision de sanction.

* **POST** `/api/incidents`
  (En pratique : soit une nouvelle table “incidents”, soit une sanction au statut “brouillon/à valider” selon ton modèle.)

### US-C3 — Ajouter une note interne de suivi sur un élève

**En tant que** personnel de direction
**Je veux** ajouter une note interne (confidentielle) liée à un élève
**Afin de** conserver une trace de décisions / échanges.

* **POST** `/api/eleves/:id/notes`

---

## Épic D — Reporting / exports (consultation + génération)

### US-D1 — Générer un “rapport” pour une période

**En tant que** proviseur
**Je veux** obtenir un rapport des sanctions sur une période
**Afin de** préparer un conseil de direction.

* **GET** `/api/reports/sanctions?from=&to=&groupBy=type|classe|prof`

### US-D2 — Préparer une liste “élèves à risque”

**En tant que** personnel de direction
**Je veux** lister les élèves dépassant un seuil de sanctions
**Afin de** prioriser les suivis.

* **GET** `/api/alerts/eleves?min=3&from=&to=`

---

## Épic E — CLI (CommanderJS) : parcours utilisateur côté console

(Ça reste des US “fonctionnelles”, mais elles cadrent bien la CLI.)

### US-E1 — Se connecter depuis la CLI

**En tant que** utilisateur CLI
**Je veux** me connecter et stocker mon token localement
**Afin de** exécuter des commandes sans ressaisir mon mot de passe.

### US-E2 — Chercher un élève et afficher son historique

**En tant que** utilisateur CLI
**Je veux** rechercher un élève puis afficher ses sanctions
**Afin de** obtenir une réponse immédiate en réunion.

### US-E3 — Lister les sanctions filtrées

**En tant que** utilisateur CLI
**Je veux** filtrer les sanctions (classe, dates, type)
**Afin de** extraire rapidement une vue ciblée.

### US-E4 — Créer une sanction depuis la CLI

**En tant que** utilisateur CLI
**Je veux** créer une sanction en ligne de commande
**Afin de** gagner du temps et standardiser la saisie.

