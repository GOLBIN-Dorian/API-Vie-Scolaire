# 👤 US3 — Consulter l’historique disciplinaire d’un élève (Sprint 1)

## 🎯 Titre / Objectif

> **En tant que** personnel de direction (proviseur, proviseur adjoint, secrétaire de proviseur)
> **Je veux** consulter toutes les sanctions associées à un élève donné
> **Afin de** préparer un entretien (élève / famille), un suivi éducatif, ou un conseil de discipline, avec une vision claire et chronologique de son historique.

---

## 🔍 Description

Cette User Story met à disposition un endpoint permettant de récupérer **l’historique disciplinaire d’un élève**.

Contraintes fonctionnelles attendues :

* La réponse **ne doit pas répéter** les informations de l’élève dans chaque sanction.
* Le JSON retourné est structuré sous la forme :

```json
{
  "eleve": { ... },
  "sanctions": [ ... ]
}
```

* Un **filtrage par période** est possible via des paramètres de requête (`from`, `to`).
* Les données renvoyées doivent être **directement exploitables côté CLI** (pas de `meta`, pas de pagination, pas de liens).

---

## 🌐 Endpoint concerné

### `GET /api/eleves/:id/sanctions`

* Route **protégée** : nécessite un token

  * Header : `Authorization: Bearer <token>`

---

## 🧩 Paramètres

### 1) Paramètre de route

* `id` *(integer, obligatoire)* : identifiant de l’élève.

> Remarque d’usage (CLI) : l’identifiant est obtenu via l’US4 (recherche élève), puis réutilisé ici.

### 2) Filtres (query parameters)

#### a) `from` *(string, optionnel)*

* Date de début **incluse**
* Format : `DD/MM/YYYY`
* Signification : « depuis cette date jusqu’à maintenant » si `to` est absent.

#### b) `to` *(string, optionnel)*

* Date de fin **incluse**
* Format : `DD/MM/YYYY`

#### Règles de combinaison

* `from` seul ✅
* `from` + `to` ✅
* `to` seul ❌ *(interdit)*

---

## ✅ Critères d’acceptation

### CA1 — Consultation complète

* Sans filtre de dates, l’API renvoie **toutes** les sanctions de l’élève.

### CA2 — Filtrage depuis une date

* Avec `from` seul, l’API renvoie toutes les sanctions **du `from` inclus jusqu’à la date courante**.

### CA3 — Filtrage sur une période

* Avec `from` et `to`, l’API renvoie toutes les sanctions **entre `from` et `to` inclus**.

### CA4 — Données non redondantes

* Les informations de l’élève apparaissent **une seule fois** dans `eleve`.
* Les sanctions ne contiennent **pas** un objet `eleve` complet.

### CA5 — Sécurité

* Si le token est absent ou invalide, l’API renvoie **401**.

---

## 📤 Réponse attendue (JSON)

### ✅ Succès — 200 OK

> Exemple de structure (les valeurs sont illustratives).

```json
{
  "eleve": {
    "id": 12,
    "nom": "DUPONT",
    "prenom": "Lina",
    "dateNaissance": "2009-03-14",
    "classe": {
      "id": 3,
      "libelle": "2B"
    }
  },
  "sanctions": [
    {
      "id": 128,
      "date": "2026-01-06",
      "type": "RETENUE",
      "motif": "Bavardages répétés",
      "duree": 60,
      "commentaire": "À refaire si récidive",
      "auteur": {
        "id": 8,
        "nom": "MARTIN",
        "prenom": "Paul"
      }
    }
  ]
}
```

> Notes :
>
> * La **date** peut être renvoyée au format `YYYY-MM-DD` (cohérent avec une date SQL), même si l’entrée des filtres est au format `DD/MM/YYYY`.
> * Le champ `duree` est pertinent uniquement si le modèle de données prévoit une durée (ex. retenue) ; sinon, il peut être omis.

### ✅ Succès — Aucun résultat sur la période (200 OK)

```json
{
  "eleve": {
    "id": 12,
    "nom": "DUPONT",
    "prenom": "Lina",
    "dateNaissance": "2009-03-14",
    "classe": {
      "id": 3,
      "libelle": "2B"
    }
  },
  "sanctions": []
}
```

---

## ⚠️ Gestion des erreurs

### 400 Bad Request — `to` utilisé seul

```json
{
  "message": "Le filtre 'to' ne peut pas être utilisé seul. Utilisez 'from' ou 'from' + 'to'."
}
```

### 400 Bad Request — Format de date invalide

```json
{
  "message": "Format de date invalide. Utilisez DD/MM/YYYY pour 'from' et 'to'."
}
```

### 400 Bad Request — Période incohérente (`from` > `to`)

```json
{
  "message": "Période invalide : 'from' doit être antérieur ou égal à 'to'."
}
```

### 401 Unauthorized — Token absent / invalide

```json
{
  "message": "Non authentifié"
}
```

### 404 Not Found — Élève inexistant

```json
{
  "message": "Élève introuvable"
}
```

### 500 Internal Server Error

```json
{
  "message": "Erreur interne"
}
```

---

## 🧠 Règles métier & contraintes techniques

* Les sanctions doivent être retournées **triées** (recommandation) : du plus récent au plus ancien (`date` décroissante).
* Les champs strictement nécessaires pour la direction/CLI sont renvoyés :

  * Pour l’élève : `id`, `nom`, `prenom`, `dateNaissance` (si disponible/utile), `classe`.
  * Pour chaque sanction : `id`, `date`, `type`, `motif`, champs complémentaires si existants, et l’**auteur** (professeur / personnel) si présent dans le modèle.
* Conformément aux besoins CLI : **pas de meta**.

---

## 🧪 Exemples d’appels

* Historique complet :

  * `GET /api/eleves/12/sanctions`

* Depuis une date :

  * `GET /api/eleves/12/sanctions?from=01/01/2026`

* Sur une période :

  * `GET /api/eleves/12/sanctions?from=01/01/2026&to=31/01/2026`

---

## ✅ Definition of Done (DoD)

* Endpoint `GET /api/eleves/:id/sanctions` implémenté et protégé (JWT).
* Réponse conforme : `{ eleve, sanctions }` sans redondance.
* Filtres `from` / `to` respectant les règles (to seul interdit).
* Cas « aucune sanction » géré (liste vide).
* Erreurs principales gérées (400, 401, 404, 500).
* Tests manuels via CLI / Rest Client validés.
