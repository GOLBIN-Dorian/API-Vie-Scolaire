# 🔎 US4 — Rechercher un élève (Sprint 1)

## 🎯 Titre / Objectif

> **En tant que** personnel de direction (proviseur, proviseur adjoint, secrétaire de proviseur)
> **Je veux** rechercher un élève via l’API à partir de son **nom** et/ou **prénom**
> **Afin de** retrouver rapidement son dossier et, ensuite, accéder à ses informations utiles (ex. historique des sanctions, classe, etc.).

---

## 🔍 Description

Cette User Story fournit un endpoint de **recherche d’élèves** destiné à la CLI.

L’objectif est de permettre une **recherche rapide et ciblée** :

* par **nom** (recherche plus stricte),
* par **prénom**,
* ou par **combinaison nom + prénom**.

Le résultat doit être **directement exploitable** côté CLI : l’API renvoie **uniquement les données** (pas de “meta”, pagination, liens, etc.).

---

## 🌐 Endpoint concerné

### `GET /api/eleves`

> Route **protégée** : nécessite un token (header `Authorization: Bearer <token>`).

---

## 🔎 Filtres d’affinage (query parameters)

### 1) `nom` (string)

* Recherche ciblée sur le **nom**.
* Utile si l’utilisateur veut être **plus strict**.
* Exemple : `?nom=dupont`

### 2) `prenom` (string)

* Recherche ciblée sur le **prénom**.
* Exemple : `?prenom=lina`

### 3) Combinaison des filtres

* Les deux filtres sont **combinables** :

  * `?nom=dupont&prenom=lina`

### Règles de recherche (attendu fonctionnel)

* Recherche **insensible à la casse** (ex. `DUPONT` = `dupont`).
* Recherche **partielle** (contient) recommandée pour la CLI (ex. `dup` match `DUPONT`).
* Les filtres sont optionnels :

  * si **aucun filtre** n’est fourni, l’API peut :

    * soit retourner **400 Bad Request** (recommandé pour éviter un listing massif),
    * soit retourner une liste limitée (moins recommandé si aucune pagination n’est prévue).

> Recommandation Sprint 1 : **400** si `nom` et `prenom` sont absents.

---

## ✅ Critères d’acceptation

### CA1 — Recherche par nom

* Si `nom` est fourni, l’API retourne la liste des élèves dont le nom correspond.
* Exemple : `GET /api/eleves?nom=dupont`

### CA2 — Recherche par prénom

* Si `prenom` est fourni, l’API retourne la liste des élèves dont le prénom correspond.
* Exemple : `GET /api/eleves?prenom=lina`

### CA3 — Recherche combinée

* Si `nom` **et** `prenom` sont fournis, l’API applique **les deux filtres**.
* Exemple : `GET /api/eleves?nom=dupont&prenom=lina`

### CA4 — Résultat exploitable (sans meta)

* La réponse JSON contient **uniquement** une liste d’élèves.
* Aucun champ de type `meta`, `count`, `page`, `links` n’est renvoyé.

### CA5 — Sécurité

* L’endpoint est inaccessible sans token valide (401).

---

## 📥 Exemples de requêtes

### Exemple 1 — Recherche par nom

`GET /api/eleves?nom=dupont`

### Exemple 2 — Recherche par prénom

`GET /api/eleves?prenom=lina`

### Exemple 3 — Recherche combinée

`GET /api/eleves?nom=dupont&prenom=lina`

---

## 📤 Réponse attendue (JSON)

### ✅ Succès — 200 OK

> **Uniquement les données** : tableau d’élèves.

```json
[
  {
    "id": 12,
    "nom": "DUPONT",
    "prenom": "Lina",
    "dateNaissance": "2009-03-14",
    "classe": {
      "id": 3,
      "libelle": "2B"
    }
  },
  {
    "id": 27,
    "nom": "DUPONT",
    "prenom": "Lucas",
    "dateNaissance": "2008-11-02",
    "classe": {
      "id": 4,
      "libelle": "2C"
    }
  }
]
```

> Remarque : la présence de `dateNaissance` dépend du cahier des charges (à conserver uniquement si utile à la direction/CLI).

---

### ✅ Succès — Aucun résultat (200 OK)

```json
[]
```

---

## ⚠️ Gestion des erreurs

### 400 Bad Request — Aucun filtre fourni (recommandé)

```json
{
  "message": "Au moins un filtre est requis : nom et/ou prenom"
}
```

### 401 Unauthorized — Token absent / invalide

```json
{
  "message": "Non authentifié"
}
```

### 500 Internal Server Error — Erreur serveur

```json
{
  "message": "Erreur interne"
}
```

---

## 📌 Règles métier & contraintes

* L’endpoint sert à **identifier rapidement un élève** afin d’enchaîner sur d’autres consultations (ex. historique des sanctions).
* Les résultats doivent inclure **au minimum** : `id`, `nom`, `prenom`.
* La **classe** est fortement recommandée dans la réponse pour aider à désambiguïser (homonymes).

---

## ✅ Definition of Done (DoD)

* Endpoint `GET /api/eleves` implémenté et protégé par authentification.
* Filtres `nom` et `prenom` fonctionnels et combinables.
* Réponses conformes (liste JSON **sans meta**).
* Cas « aucun résultat » géré (`[]`).
* Erreurs principales gérées (400, 401, 500).
* Tests manuels via CLI (ou Rest Client) validés.
