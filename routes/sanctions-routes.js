import express from "express";
import pool from "../config/db.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

// Route pour la recherche d'un élève depuis son nom ou prénom ou nom et prénom

router.get("/eleves", authenticateToken, async (req, rep) => {
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

router.get("/eleves/:id/sanctions", authenticateToken, async (req, rep) => {
  try {
    const eleveId = parseInt(req.params.id);
    const { from, to } = req.query;

    if (to && !from) {
      return rep.status(400).json({
        message:
          "Le filtre 'to' ne peut pas être utilisé seul. Utilisez 'from' ou 'from' + 'to'.",
      });
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    let sqlFrom = null;
    let sqlTo = null;

    if (from) {
      if (!dateRegex.test(from)) {
        return rep.status(400).json({
          message:
            "Format de date invalide. Utilisez DD/MM/YYYY pour 'from' et 'to'.",
        });
      }
      sqlFrom = from.split("/").reverse().join("-");
    }

    if (to) {
      if (!dateRegex.test(to)) {
        return rep.status(400).json({
          message:
            "Format de date invalide. Utilisez DD/MM/YYYY pour 'from' et 'to'.",
        });
      }
      sqlTo = to.split("/").reverse().join("-");
    }

    if (sqlFrom && sqlTo && sqlFrom > sqlTo) {
      return rep.status(400).json({
        message:
          "Période invalide : 'from' doit être antérieur ou égal à 'to'.",
      });
    }

    const queryEleve = `
      SELECT e.id, e.nom, e.prenom, e.date_naissance, c.id as idClasse, c.nom as nomClasse
      FROM eleves e
      JOIN classes c ON e.classe_id = c.id
      WHERE e.id = ?
    `;
    const [eleves] = await pool.execute(queryEleve, [eleveId]);

    if (eleves.length === 0) {
      return rep.status(404).json({ message: "Élève introuvable" });
    }

    const eleve = eleves[0];

    let querySanctions = `
      SELECT s.id, s.date_incident, s.type, s.motif, p.id as profId, p.nom as profNom, p.prenom as profPrenom
      FROM sanctions s
      LEFT JOIN professeurs p ON s.professeur_id = p.id
      WHERE s.eleve_id = ?
    `;
    const paramsSanctions = [eleveId];

    if (sqlFrom) {
      querySanctions += " AND s.date_incident >= ?";
      paramsSanctions.push(sqlFrom);
    }

    if (sqlTo) {
      querySanctions += " AND s.date_incident <= ?";
      paramsSanctions.push(sqlTo);
    }

    querySanctions += " ORDER BY s.date_incident DESC";

    const [sanctionsRows] = await pool.execute(querySanctions, paramsSanctions);

    if ((sqlFrom || sqlTo) && sanctionsRows.length === 0) {
      return rep.status(404).json({
        message: "Aucune sanction trouvée pour cette période",
      });
    }

    const response = {
      eleve: {
        id: eleve.id,
        nom: eleve.nom,
        prenom: eleve.prenom,
        dateNaissance: eleve.date_naissance,
        classe: {
          id: eleve.idClasse,
          libelle: eleve.nomClasse,
        },
      },
      sanctions: sanctionsRows.map((row) => ({
        id: row.id,
        date: row.date_incident,
        type: row.type,
        motif: row.motif,
        auteur: row.profId
          ? {
              id: row.profId,
              nom: row.profNom,
              prenom: row.profPrenom,
            }
          : null,
      })),
    };

    rep.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    rep.status(500).json({ message: "Erreur interne" });
  }
});

export default router;
