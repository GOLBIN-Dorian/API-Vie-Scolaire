// Connexion à la base de données

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Créer un objet dbConfig

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
};

// Création d'un pool (liste) de connexion à la base de données

const pool = mysql.createPool(dbConfig);

// Exportation du pool de connexion

export default pool;
