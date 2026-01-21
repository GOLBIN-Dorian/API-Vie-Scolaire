import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Route pour la recherche d'un élève depuis son nom ou prénom ou nom et prénom

router.get("/eleves", async (req, rep) => {
  try {
    if (!req.query.nom && !req.query.prenom) {
      return rep.status(400).json({
        message: "Au moins un filtre est requis : nom et/ou prenom",
      });
    }

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
    rep.status(500).json({ message: "Erreur interne" });
  }
});

// Route permettant de récupérer l’historique disciplinaire d’un élève par son id.

router.get("/eleves/:id/sanctions", async (req, rep) => {
  try {
    const eleveId = parseInt(req.params.id);
    const { from, to } = req.query;

    let query = `SELECT e.id AS idEleve, e.nom AS nomEleve, e.prenom AS prenomEleve, e.date_naissance AS dateNaissance,c.id as idClasse,c.nom AS nomClasse, s.id AS idSanction,s.type AS typeSanction,s.date_incident AS dateSanction, s.motif AS motifSanction FROM eleves e INNER JOIN classes c ON e.classe_id = c.id INNER JOIN sanctions s ON e.id = s.eleve_id WHERE e.id = ?`;

    const params = [eleveId];
    const conditions = [];

    if (from) {
      query += " AND s.date_incident >= ?";
      params.push(from);
    }

    if (to) {
      query += " AND s.date_incident <= ?";
      params.push(to);
    }

    const [rows] = await pool.execute(query, params);

    if (rows.length === 0) {
      return rep.status(404).json({
        message:
          "Élève non trouvé ou aucune sanction pour cet élève sur cette période",
      });
    }

    const eleve = {
      id: rows[0].idEleve,
      nom: rows[0].nomEleve,
      prenom: rows[0].prenomEleve,
      dateNaissance: rows[0].dateNaissance,
      classe: {
        id: rows[0].idClasse,
        libelle: rows[0].nomClasse,
      },
    };

    const sanctions = rows.map((row) => {
      return {
        id: row.idSanction,
        date: row.dateSanction,
        type: row.typeSanction,
        motif: row.motifSanction,
        auteur: {
          id: row.idEleve,
          nom: row.nomEleve,
          prenom: row.prenomEleve,
        },
      };
    });

    rep.json({
      eleve: eleve,
      sanctions: sanctions,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'élève:", error);
    rep.status(500).json({
      error: "Erreur serveur lors de la récupération de l'élève",
      message: error.message,
    });
  }
});

export default router;
