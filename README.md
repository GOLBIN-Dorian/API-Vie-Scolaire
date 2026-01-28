# 🛡️ API Vie Scolaire - Gestion des Sanctions

Cette API REST, développée avec **ExpressJS**, permet aux personnels de direction de consulter et de gérer les données liées aux sanctions des élèves. 

> 🖥️ **Note :** Cette API est destinée à être consommée via l'application console officielle : **[CLI-Vie-Scolaire](https://github.com/GOLBIN-Dorian/CLI-Vie-Scolaire)**.

## 🚀 Installation

1. **Clonage du projet** :
   Récupérez le projet sur votre machine locale :

   ```
   git clone https://github.com/golbin-dorian/api-vie-scolaire.git
   cd api-vie-scolaire
   ```
2. **Installation des dépendances** :
   Exécutez la commande suivante pour installer les modules nécessaires (Express, MySQL2, JWT, Argon2, Dotenv) :

   ```
   npm install
   ```
3. **Configuration de l'environnement** :
   Créez un fichier `.env` à la racine du projet et configurez les variables suivantes en vous basant sur les données fournies ci dessous :

   * `PORT` : Port du serveur (ex: 3000).
   * `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` : Vos identifiants de base de données MySQL.
   * `JWT_SECRET` : Une clé secrète pour la signature des tokens.
4. **Initialisation de la base de données** :

   * **Docker** : Utilisez le fichier `docker-compose.yml` pour lancer un conteneur MySQL. Le script `init.sql` sera exécuté automatiquement pour créer les tables et insérer les données de test.
   * **Manuel** : Exécutez le script `init.sql` dans votre client MySQL pour préparer les tables `utilisateurs`, `classes`, `eleves`, `professeurs` et `sanctions`.
5. **Lancement du serveur** :
   Démarrez l'API en mode développement avec Nodemon :

   ```
   npm run dev
   ```

---

## 🔐 Authentification

L'API utilise des **JSON Web Tokens (JWT)** pour sécuriser les accès.

* **Endpoint** : `POST /api/auth/login`.
* **Utilisation** : Envoyez un objet JSON contenant l'email et le mot de passe dans le corps de la requête.
* **Réponse** : En cas de succès, l'API retourne un `token` et sa durée de validité (`expiresIn`).
* **Usage ultérieur** : Pour toutes les autres requêtes, vous devez inclure ce jeton dans l'en-tête `Authorization` sous la forme : `Bearer <votre_token>`.

---

## 📁 Utilisation des Endpoints

### 1. Recherche d'élèves

* **Endpoint** : `GET /api/eleves`.
* **Description** : Permet de rechercher un élève par son nom et/ou son prénom.
* **Paramètres (Query)** : `nom` (recherche partielle) et/ou `prenom` (recherche partielle).
* **Note** : Au moins un des deux filtres est obligatoire, sinon une erreur 400 est renvoyée.

### 2. Historique disciplinaire d'un élève

* **Endpoint** : `GET /api/eleves/:id/sanctions`.
* **Description** : Récupère la liste complète des sanctions d'un élève spécifique par son identifiant.
* **Filtres optionnels (Query)** :
  * `from` : Date de début (format `DD/MM/YYYY`).
  * `to` : Date de fin (format `DD/MM/YYYY`). Ne peut être utilisé que si `from` est présent.

---

## 👤 Utilisateur de test

Pour tester l'authentification et les fonctionnalités de l'API, vous pouvez utiliser les identifiants suivants pré-configurés dans la base de données :

* **Email** : `test@test.com`
* **Mot de passe** : `test`
