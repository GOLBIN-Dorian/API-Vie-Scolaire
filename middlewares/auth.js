import jwt from "jsonwebtoken";

const authenticateToken = (req, rep, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return rep.status(401).json({ message: "Accès refusé : Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return rep.status(403).json({ message: "Token invalide ou expiré" });
    }

    req.user = user;

    next();
  });
};

export default authenticateToken;
