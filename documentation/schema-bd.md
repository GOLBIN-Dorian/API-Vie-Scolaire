# 📄 Script d’initialisation de la base de données `db_sanctions`

Ce document contient le **script SQL d’initialisation** de la base de données **`db_sanctions`** utilisée dans le projet de **gestion des sanctions**.

Il permet de :

* créer les tables nécessaires à l’application,
* définir les relations entre les entités,
* insérer des **données de test** pour le développement et les TPs.

---

## 🗄️ Sélection de la base de données

```sql
USE db_sanctions;
```

---

## 👤 Table `utilisateurs`

Personnel de la vie scolaire (authentification API).

```sql
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Données de test

```sql
INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom) VALUES
('vie-scolaire1@test.com', '$2y$12$TJy1uk4VqF5.I3LLtaELNObOGjjB/UE1FsZvYGEqQ1yZucDrtugYO', 'Martin', 'Sophie'),
('vie-scolaire2@test.com', '$2y$12$TJy1uk4VqF5.I3LLtaELNObOGjjB/UE1FsZvYGEqQ1yZucDrtugYO', 'Dubois', 'Pierre')
ON DUPLICATE KEY UPDATE email=email;
```

---

## 🏫 Table `classes`

Représente les classes de l’établissement.

```sql
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    niveau VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Données de test

```sql
INSERT INTO classes (nom, niveau) VALUES
('Terminale S1', 'Terminale'),
('Première ES1', 'Première'),
('Seconde A', 'Seconde'),
('BTS SIO1', 'BTS')
ON DUPLICATE KEY UPDATE nom=nom;
```

---

## 🎓 Table `eleves`

Contient les informations sur les élèves.

```sql
CREATE TABLE IF NOT EXISTS eleves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    classe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Données de test

```sql
INSERT INTO eleves (nom, prenom, date_naissance, classe_id) VALUES
('Martin', 'Jean', '2005-03-15', 1),
('Dubois', 'Marie', '2005-07-22', 1),
('Bernard', 'Pierre', '2006-01-10', 2),
('Moreau', 'Sophie', '2006-05-18', 2),
('Petit', 'Lucas', '2007-09-03', 3),
('Robert', 'Emma', '2007-12-14', 3),
('Richard', 'Thomas', '2004-11-25', 4),
('Simon', 'Léa', '2004-08-07', 4)
ON DUPLICATE KEY UPDATE nom=nom;
```

---

## 👨‍🏫 Table `professeurs` 

```sql
CREATE TABLE IF NOT EXISTS professeurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Données de test

```sql
INSERT INTO professeurs (nom, prenom, matiere) VALUES
('Dupont', 'Jean', 'Mathématiques'),
('Lefebvre', 'Marie', 'Français'),
('Garcia', 'Pierre', 'Histoire-Géographie'),
('Moreau', 'Sophie', 'Sciences de la Vie et de la Terre'),
('Bernard', 'Lucas', 'Physique-Chimie'),
('Petit', 'Emma', 'Anglais'),
('Robert', 'Thomas', 'Éducation Physique et Sportive'),
('Richard', 'Léa', 'Espagnol')
ON DUPLICATE KEY UPDATE nom=nom;
```

---

## ⚠️ Table `sanctions` 

```sql
CREATE TABLE IF NOT EXISTS sanctions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_incident DATE NOT NULL,
    motif TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    professeur_id INT NOT NULL,
    eleve_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professeur_id) REFERENCES professeurs(id) ON DELETE RESTRICT,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Données de test

```sql
INSERT INTO sanctions (date_incident, motif, type, professeur_id, eleve_id) VALUES
('2025-01-15', 'Bavardage répété et manque de respect en cours', 'Avertissement', 1, 1),
('2025-01-20', 'Retard non justifié de plus de 15 minutes', 'Retenue', 2, 2),
('2025-01-22', 'Absence de matériel scolaire à plusieurs reprises', 'Avertissement', 3, 3),
('2025-01-25', 'Comportement perturbateur en classe', 'Exclusion temporaire', 4, 4),
('2025-02-01', 'Travail non rendu malgré les rappels', 'Retenue', 5, 5)
ON DUPLICATE KEY UPDATE motif=motif;
```

---

