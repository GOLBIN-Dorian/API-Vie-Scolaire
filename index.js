import express from "express";
import dotenv from "dotenv";
import sanctionsRouter from "./routes/sanctions-db-routes.js";

// configurer les variables d'environnement
dotenv.config(); // Permet de rendre dispo les VE dans process.env

// Créer une application express
const app = express();
const PORT = process.env.PORT;

//Middleware pour parser(analyser) le contenu des requêtes contenant du JSON
app.use(express.json());

// Utiliser le router pour les films (Monter les routes)
app.use("/api", sanctionsRouter);

// Gérer les routes non trouvées (404)
// Utiliser un middleware
// Capturer toutes les requêtes qui n'ont pas été matchées  par les routes précédentes
app.use((req, rep) => {
  rep.status(404).send("Route non trouvée");
});

// Démarrer le serveur web
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
