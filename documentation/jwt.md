# 🔐 JSON Web Tokens (JWT) — Cours d'authentification API REST

## 📚 Introduction

### Qu'est-ce qu'un JWT ?

Un **JSON Web Token (JWT)** est un standard ouvert (RFC 7519) qui permet de transmettre de manière sécurisée des informations entre deux parties sous la forme d'un objet JSON compact et auto-contenu.

**Analogie simple** : Imaginez un JWT comme un **badge d'accès** que vous recevez après avoir montré votre pièce d'identité. Ce badge contient des informations sur vous (votre identifiant, votre email) et vous permet d'accéder à différents services sans avoir à vous ré-identifier à chaque fois.

### Pourquoi utiliser les JWT ?

Dans le contexte d'une **API REST**, les JWT offrent plusieurs avantages :

1. **Stateless (sans état)** : Le serveur n'a pas besoin de stocker les sessions en mémoire ou en base de données
2. **Scalable** : Facile à déployer sur plusieurs serveurs (pas de partage de session)
3. **Portable** : Le token contient toutes les informations nécessaires
4. **Sécurisé** : Signé numériquement pour éviter la falsification

---

## 🏗️ Structure d'un JWT

Un JWT est composé de **trois parties** séparées par des points (`.`), encodées en Base64URL :

```
header.payload.signature
```

### 1. Header (En-tête)

Le header contient deux informations principales :
- **`alg`** : L'algorithme de signature utilisé (ex: `HS256`, `RS256`)
- **`typ`** : Le type de token (généralement `JWT`)

**Exemple de header :**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Après encodage Base64URL, cela donne : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### 2. Payload (Charge utile)

Le payload contient les **claims** (revendications), c'est-à-dire les informations sur l'utilisateur et des métadonnées.

Il existe trois types de claims :

#### Claims standards (réservés) :
- **`iss`** (issuer) : Émetteur du token
- **`sub`** (subject) : Sujet du token (généralement l'ID utilisateur)
- **`exp`** (expiration) : Date d'expiration (timestamp Unix)
- **`iat`** (issued at) : Date d'émission
- **`aud`** (audience) : Public cible

#### Claims publics et privés :
- **`userId`** : Identifiant de l'utilisateur
- **`email`** : Email de l'utilisateur

**Exemple de payload :**
```json
{
  "sub": "123",
  "userId": 123,
  "email": "vie-scolaire1@test.com",
  "iat": 1609459200,
  "exp": 1609462800
}
```

Après encodage Base64URL, cela donne une longue chaîne de caractères.

### 3. Signature

La signature permet de **vérifier l'intégrité** du token et de s'assurer qu'il n'a pas été modifié.

**Formule de calcul :**
```
signature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

Le secret est une clé secrète connue uniquement du serveur.

### Exemple complet de JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJ1c2VySWQiOjEyMywicm9sZSI6ImRpcmVjdGlvbiIsImVtYWlsIjoiZGlyZWN0aW9uQGV0YWJsaXNzZW1lbnQuZnIiLCJpYXQiOjE2MDk0NTkyMDAsImV4cCI6MTYwOTQ2MjgwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Décomposition :**
- **Header** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
- **Payload** : `eyJzdWIiOiIxMjMiLCJ1c2VySWQiOjEyMywiZW1haWwiOiJ2aWUtc2NvbGFpcmUxQHRlc3QuY29tIiwiaWF0IjoxNjA5NDU5MjAwLCJleHAiOjE2MDk0NjI4MDB9`
- **Signature** : `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

---

## 🔄 Flux d'authentification avec JWT

### Étape 1 : Connexion (Login)

```
┌─────────┐                    ┌─────────┐
│ Client  │                    │ Serveur │
│  (CLI)  │                    │  (API)  │
└────┬────┘                    └────┬────┘
     │                              │
     │  1. POST /api/auth/login    │
     │  { email, password }         │
     ├─────────────────────────────>│
     │                              │
     │                              │ 2. Vérification
     │                              │    - Email existe ?
     │                              │    - Mot de passe correct ?
     │                              │
     │                              │ 3. Génération JWT
     │                              │    - Création du payload
     │                              │    - Signature avec secret
     │                              │
     │  4. Réponse 200 OK           │
     │  { token, expiresIn }        │
     │<─────────────────────────────┤
     │                              │
     │ 5. Stockage du token         │
     │    (fichier config local)    │
     │                              │
```

**Exemple de requête :**
```http
POST /api/auth/login HTTP/1.1
Host: api.etablissement.fr
Content-Type: application/json

{
  "email": "vie-scolaire1@test.com",
  "password": "motDePasse"
}
```

**Exemple de réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Étape 2 : Utilisation du token

Pour chaque requête suivante, le client doit inclure le token dans l'en-tête `Authorization` :

```http
GET /api/eleves/search?nom=Dupont HTTP/1.1
Host: api.etablissement.fr
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Format de l'en-tête :**
```
Authorization: Bearer <token>
```

### Étape 3 : Vérification côté serveur

Le serveur doit :
1. **Extraire le token** de l'en-tête `Authorization`
2. **Vérifier la signature** avec la clé secrète
3. **Vérifier l'expiration** (`exp`)
4. **Extraire les informations** du payload (userId, email, etc.)
5. **Autoriser ou refuser** l'accès à la ressource

---

## 🔒 Sécurité des JWT

### Points importants

#### ✅ Bonnes pratiques

1. **Utiliser HTTPS** : Toujours transmettre les JWT via HTTPS pour éviter l'interception
2. **Secret fort** : Utiliser une clé secrète complexe et aléatoire
3. **Expiration courte** : Limiter la durée de vie du token (ex: 1 heure)
4. **Stockage sécurisé** : Côté client, stocker le token de manière sécurisée (pas en localStorage pour les apps web sensibles)

#### ⚠️ Limitations et précautions

1. **Token non révocable** : Un JWT reste valide jusqu'à son expiration, même si l'utilisateur est désactivé
   - **Solution** : Vérifier en base de données si l'utilisateur est toujours actif
   
2. **Taille du token** : Ne pas mettre trop d'informations dans le payload (limite de taille des en-têtes HTTP)

3. **Secret compromis** : Si le secret est volé, tous les tokens peuvent être falsifiés
   - **Solution** : Utiliser des secrets différents par environnement (dev, prod)

4. **XSS (Cross-Site Scripting)** : En JavaScript, éviter localStorage si possible
   - **Solution** : Utiliser httpOnly cookies ou mémoire JavaScript

---

## 💻 Implémentation pratique

### Côté serveur (API REST)

#### Génération d'un JWT (exemple Node.js avec jsonwebtoken)

```javascript
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

// Après vérification des identifiants
export function generateToken(user) {
  const payload = {
    sub: user.id.toString(),
    userId: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 heure
  };
  
  return jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
}
```

#### Vérification d'un JWT (middleware)

```javascript
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
  // 1. Extraire le token de l'en-tête
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  
  const token = authHeader.substring(7); // Enlever "Bearer "
  
  try {
    // 2. Vérifier et décoder le token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 3. Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    
    // 4. Continuer vers la route suivante
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}
```

#### Utilisation dans les routes

```javascript
import { verifyToken } from './middleware/auth.js';

// Route protégée
app.get('/api/eleves/search', verifyToken, (req, res) => {
  // req.user contient les infos de l'utilisateur authentifié
  // Tous les utilisateurs authentifiés ont accès aux endpoints
  
  // Logique de recherche...
});
```

### Côté client (CLI)

#### Stockage du token

```javascript
import fs from 'fs';

// Après connexion réussie
const response = await fetch('http://api.etablissement.fr/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, expiresIn } = await response.json();

// Stocker dans un fichier de configuration
fs.writeFileSync('.token', token);
```

#### Utilisation du token

```javascript
import fs from 'fs';

// Pour chaque requête suivante
const token = fs.readFileSync('.token', 'utf8');

const response = await fetch('http://api.etablissement.fr/api/eleves/search', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎯 Cas d'usage : Projet Sanctions

Dans le contexte du projet **Sanctions API REST**, les JWT sont utilisés pour :

1. **Authentifier les utilisateurs** de la table `utilisateurs` via l'endpoint `/api/auth/login`
2. **Sécuriser l'accès** aux endpoints protégés :
   - Consultation des sanctions
   - Recherche d'élèves
   - Historique des sanctions
3. **Transmettre les informations** nécessaires (userId, email) sans requête supplémentaire en base

**Exemple de payload pour le projet :**
```json
{
  "sub": "1",
  "userId": 1,
  "email": "vie-scolaire1@test.com",
  "iat": 1609459200,
  "exp": 1609462800
}
```

---

## 📝 Résumé

### Points clés à retenir

1. **JWT = 3 parties** : Header.Payload.Signature
2. **Stateless** : Pas de stockage de session côté serveur
3. **Auto-contenu** : Toutes les infos nécessaires sont dans le token
4. **Signé** : La signature garantit l'intégrité
5. **Expiration** : Les tokens ont une durée de vie limitée

### Vocabulaire

- **Token** : Jeton d'authentification
- **Payload** : Charge utile (données du token)
- **Claim** : Revendication (information dans le payload)
- **Signature** : Preuve cryptographique d'intégrité
- **Bearer** : Porteur (format d'en-tête HTTP)
- **Stateless** : Sans état (pas de session serveur)

---


