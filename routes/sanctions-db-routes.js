import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Route pour authentification

router.post("/auth/login", async (req, rep) => {
  const { email, password } = req.body;
  try {
    const [utilisateurs] = await pool.execute(
      "SELECT id, mot_de_passe FROM utilisateurs WHERE email = ?",
      [email]
    );

    if (utilisateurs.length === 0) {
      return rep.status(401).json({ error: "Identifiants incorrects" });
    }

    const mot_de_passeBDD = utilisateurs[0].mot_de_passe;

    if (password !== mot_de_passeBDD) {
      return rep.status(401).json({ message: "Identifiants incorrects" });
    }

    rep.status(200).json({ message: "Connexion réussie" });
  } catch (error) {
    rep.status(500).json({ error: "Erreur serveur" });
  }
});
export default router;

// Route pour la recherche d'un élève depuis son nom ou prénom ou nom et prénom

router.get("/eleves", async (req, rep) => {
  try {
    let query =
      "SELECT e.id AS idEleve ,e.nom AS nomEleve, e.prenom AS prenomEleve, e.date_naissance AS dateNaissance ,c.id as idClasse, c.nom AS nomClasse FROM eleves e INNER JOIN classes c ON e.classe_id = c.id";
    const conditions = [];
    const params = [];

    if (req.query.nom) {
      conditions.push("LOWER(e.nom) LIKE ?");
      params.push(`${req.query.nom.toLowerCase()}%`);
    }

    if (req.query.prenom) {
      conditions.push("LOWER(e.prenom) LIKE ?");
      params.push(`${req.query.prenom.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Exécution de la requête SQL
    const [eleves] = await pool.execute(query, params);
    const elevesObjet = eleves.map((row) => {
      return {
        id: row.idEleve,
        nom: row.nomEleve,
        prenom: row.prenomEleve,
        dateNaissance: row.dateNaissance,
        classe: {
          id: row.idClasse,
          libelle: row.nomClasse,
        },
      };
    });

    rep.json(elevesObjet);
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves:", error);
    rep.status(500).json({
      error: "Erreur serveur lors de la récupération des élèves",
      message: error.message,
    });
  }
});

// Route permettant de récupérer l’historique disciplinaire d’un élève.
