import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Route pour authentification

router.post("/auth/login", async (req, rep) => {
  const { email, password } = req.body;
  try {
    const [utilisateurs] = await pool.execute(
      "SELECT id, mot_de_passe FROM utilisateurs WHERE email = ?",
      [email],
    );

    if (utilisateurs.length === 0) {
      return rep.status(401).json({ error: "Identifiants incorrects" });
    }

    const mot_de_passeBDD = utilisateurs[0].mot_de_passe;

    if (password !== mot_de_passeBDD) {
      return rep.status(401).json({ message: "Identifiants incorrects" });
    }

    const payload = { id: utilisateurs[0].id, email: utilisateurs[0].email };

    const CLE = process.env.CLE_SECRETE;

    const token = jwt.sign(payload, CLE, { expiresIn: "1h" });

    rep.status(200).json({ token: token, expiresIn: "3600" });
  } catch (error) {
    rep.status(500).json({ error: "Erreur serveur" });
  }
});
export default router;
