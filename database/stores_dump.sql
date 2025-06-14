-- SQL Dump for MySQL
-- Database: hack4her
-- Total store records: 63

CREATE DATABASE IF NOT EXISTS hack4her;
USE hack4her;

DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS citas_to_users;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stores;

-- Create stores table first (referenced by other tables)
CREATE TABLE stores (
    id INT PRIMARY KEY,
    longitude DECIMAL(10,7),
    latitude DECIMAL(10,7),
    nombre VARCHAR(255),
    nps DECIMAL(5,1),
    fillfoundrate DECIMAL(5,1),
    damage_rate DECIMAL(5,2),
    out_of_stock DECIMAL(5,2),
    complaint_resolution_time_hrs DECIMAL(5,1)
);

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL
);

-- Create citas table
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    confirmada BOOLEAN NOT NULL DEFAULT FALSE,
    cancelada BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Create junction table for many-to-many relationship
CREATE TABLE citas_to_users (
    cita_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (cita_id, user_id),
    FOREIGN KEY (cita_id) REFERENCES citas(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create feedback table
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Insert sample users
INSERT INTO users (username, first_name, last_name, password, email, role) VALUES
  ('OmarSanchez3', 'Omar', 'Sanchez', 'password123', 'sofialopezcontact@gmail.com', 'admin'),
  ('JimenaCarmona2', 'Jimena', 'Carmona', 'password123', 'a01028251@tec.com', 'user');

-- Insert store data
INSERT INTO stores (id, longitude, latitude, nombre, nps, fillfoundrate, damage_rate, out_of_stock, complaint_resolution_time_hrs) VALUES
  (0, -100.2998256, 25.6244792, 'OXXO Paseo del Acueducto', 39.9, 97.7, 0.55, 3.57, 24.7),
  (1, -100.2896037, 25.6538224, 'Oxxo Junco de la Vega', 27.2, 100.1, 0.76, 4.14, 28.0),
  (2, -100.2756426, 25.6535732, 'Plaza Nuevo Sur', 43.0, 96.9, 0.18, 3.95, 33.5),
  (3, -100.3031637, 25.6734108, 'OXXO Platón Sánchez', 60.5, 100.1, 0.54, 3.65, 16.6),
  (4, -100.3216174, 25.6597296, 'Oxxo COLIMA II', 25.3, 91.8, 0.55, 2.68, 36.8),
  (5, -100.2942107, 25.6553848, 'Oxxo Av. Eugenio', 25.3, 98.6, 0.66, 3.76, 12.3),
  (6, -100.2543342, 25.6927878, 'El Primer OXXO linda vista', 61.6, 97.2, 7.0, 2.23, 23.1),
  (7, -100.3058143, 25.654084, 'Oxxo Nueva Independencia', 45.3, 96.4, 0.24, 2.76, 27.5),
  (8, -100.3168933, 25.6662796, 'OXXO PABELLON M ( Oxxo temática M&M )', 20.6, 97.2, 0.6, 2.51, 100.0),
  (9, -100.3048224, 25.641375, 'Oxxo Nazas', 40.9, 93.0, 0.56, 3.08, 20.3),
  (10, -100.3021251, 25.6561946, 'OXXO Libertad', 20.7, 96.6, 0.55, 5.31, 22.8),
  (11, -100.2841294, 25.6345686, 'Oxxo Más palomas', 20.7, 97.7, 0.57, 1.13, 21.0),
  (12, -100.2970849, 25.6444172, 'Oxxo Elizondo', 34.8, 100.0, 0.36, 3.69, 20.5),
  (13, -100.29252, 25.651034, '7-Eleven Av. Del Estado', -8.3, 96.0, 0.55, 1.39, 29.1),
  (14, -100.3230559, 25.6766454, '7-Eleven Alameda', -4.5, 95.4, 0.56, 2.53, 26.1),
  (15, -100.296155, 25.6480586, '7-Eleven Río Salado', 18.8, 96.0, 0.36, 4.09, 19.8),
  (16, -100.2974763, 25.6632932, '7-Eleven Nuevo Repueblo', 9.7, 98.8, 0.87, 3.06, 29.4),
  (17, -100.3018061, 25.6694369, '7-Eleven Florencio Antillón', 36.3, 97.7, 0.59, 1.92, 25.8),
  (18, -100.3039312, 25.6661872, '7-Eleven Constitución', 11.8, 95.9, 0.26, 2.28, 28.9),
  (19, -100.3138665, 25.681222, '7-Eleven Benito Juarez', 1.8, 98.0, 0.63, 3.68, 27.8),
  (20, -100.2930932, 25.6484332, '7-Eleven Parque Tecnológico', 59.3, 97.2, 0.31, 2.27, 19.0),
  (21, -100.3203859, 25.639296, '7-Eleven Av. Fundadores', 25.5, 98.9, 0.66, 3.22, 20.6),
  (22, -100.3132943, 25.6715179, '7-Eleven Galeana', 31.4, 95.6, 0.73, 3.05, 28.5),
  (23, -100.3045456, 25.6415481, 'Modelorama Río Nazas', 1.5, 96.3, 0.34, 2.35, 27.7),
  (24, -100.2981379, 25.6894471, 'Modelorama Np-Mod. Heroes Del 47', 19.1, 96.2, 0.69, 5.14, 23.9),
  (25, -100.2729309, 25.6678005, 'Modelorama Texcoco', 100.0, 94.1, 0.58, 3.63, 24.7),
  (26, -100.2716526, 25.6763548, 'Modelorama Priv San Miguel 105', 7.0, 97.6, 0.66, 0.97, 31.7),
  (27, -100.2391702, 25.6693177, 'Modelorama Np-Mod Estadio', 37.5, 97.5, 0.88, 3.19, 20.5),
  (28, -100.236682, 25.6730685, 'Modelorama Np Villa', 18.0, 97.0, 0.45, 2.34, 27.3),
  (29, -100.2941104, 25.6295979, 'Modelorama NP Los Rosales', 24.2, 82.0, 0.35, 3.85, 22.8),
  (30, -100.2598368, 25.6987336, 'Modelorama Np-Mod Abrazo De Acatempan', 18.0, 94.2, 0.32, 2.21, 22.7),
  (31, -100.2839832, 25.6575154, 'Modelorama Np-Mod. Buenos Aires', 67.0, 96.2, 0.34, 2.89, 30.6),
  (32, -100.325968, 25.705621, 'Modelorama NP-Mod Bernardo Reyes', 29.7, 96.3, 0.48, 3.5, 29.0),
  (33, -100.3166773, 25.6925185, 'Tiendas Six Alfonso Reyes', -95.0, 95.4, 0.57, 3.87, 28.9),
  (34, -100.2655724, 25.6781307, 'Tiendas Six Cuauhtémoc Nte', 46.5, 96.7, 0.56, 1.8, 31.8),
  (35, -100.2831406, 25.6880745, 'Tiendas Six Leandro Mtz', 5.6, 97.8, 0.67, 2.67, 24.1),
  (36, -100.2716465, 25.6596646, 'Tiendas Six Huajuco', 34.2, 100.8, 0.5, 2.53, 28.1),
  (37, -100.3321607, 25.6956167, 'Tiendas Six Thomas A. Edison', -9.2, 97.3, 0.79, 2.35, 22.1),
  (38, -100.321653, 25.6940244, 'Tiendas Six Julián Villagrán', 3.4, 97.5, 0.45, 4.77, 25.9),
  (39, -100.30295, 25.6520937, 'Tienda Six Chiapas', 33.9, 96.9, 1.04, 3.4, 23.2),
  (40, -100.3161846, 25.6839103, 'Tiendas Six José M. Jiménez', 44.8, 93.2, 0.63, 1.74, 24.6),
  (41, -100.3315497, 25.698789, 'Tiendas Six Manuel M. Lombardini', 33.4, 96.9, 0.33, 3.92, 27.6),
  (42, -100.3031809, 25.7004591, 'Tiendas Six Manuel Doblado', 27.7, 97.1, 0.29, 5.12, 19.1),
  (43, -100.274981, 25.626203, 'H-E-B Contry', 24.0, 101.9, 0.6, 4.03, 36.6),
  (44, -100.2853865, 25.642921, 'H-E-B Tec', 0.4, 96.6, 0.46, 1.48, 18.0),
  (45, -100.267984, 25.666667, 'H-E-B Chapultepec', 15.6, 97.6, 0.64, 2.52, 16.7),
  (46, -100.332814, 25.641632, 'H-E-B Valle Oriente', 20.8, 96.9, 0.59, 4.27, 30.9),
  (47, -100.2517633, 25.6803644, 'Soriana Híper Guadalupe', 51.1, 94.7, 0.49, 2.29, 28.7),
  (48, -100.3437146, 25.6971592, 'Soriana Super Simon Bolivar', 36.9, 99.3, 0.33, 3.44, 27.7),
  (49, -100.319398, 25.6862359, 'Soriana Express Colon Mty', -5.3, 98.5, 0.2, 3.77, 27.8),
  (50, -100.2555766, 25.6884011, 'Soriana Hiper Miguel Alemán', 36.5, 88.0, 0.41, 2.07, 23.9),
  (51, -100.3388509, 25.6501936, 'Soriana Súper San Agustin', 22.3, 95.2, 0.67, 2.94, 18.6),
  (52, -100.2995386, 25.6828727, 'Soriana Súper Fundidora', 16.5, 99.8, 0.54, 0.24, 24.5),
  (53, -100.3552923, 25.6920617, 'Soriana Super Vista Hermosa', 42.2, 94.2, 0.25, 1.98, 19.9),
  (54, -100.2962106, 25.6612384, 'Soriana Híper Garza Sada', 50.6, 98.2, 0.53, 2.75, 29.9),
  (55, -100.2826, 25.6393, 'Soriana Híper Contry', 48.6, 101.4, 0.58, 1.75, 23.1),
  (56, -100.2956111, 25.6291435, 'Soriana Híper Las Torres', 13.2, 95.0, 0.32, 4.63, 19.0),
  (57, -100.3617043, 25.6438187, 'Walmart Gómez Morin', 23.8, 95.9, 0.53, 1.57, 22.1),
  (58, -100.2025358, 25.6732229, 'Walmart Guadalupe', 36.6, 97.2, 0.51, 2.56, 26.5),
  (59, -100.2095845, 25.6524264, 'Walmart Eloy Cavazos', 49.5, 96.0, 0.27, 3.13, 20.6),
  (60, -100.2737235, 25.615776, 'Walmart Las Torres', 20.4, 93.9, 0.57, 4.44, 19.1),
  (61, -100.3081995, 25.7013601, 'Walmart Plaza Centrika', 26.3, 97.1, 0.61, 1.56, 25.5),
  (62, -100.3159872, 25.6389107, 'Walmart Valle Oriente', 7.9, 94.9, 0.72, 4.16, 25.5);