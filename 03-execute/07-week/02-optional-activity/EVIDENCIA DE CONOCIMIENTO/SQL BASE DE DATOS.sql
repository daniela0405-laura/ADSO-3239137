DROP DATABASE IF EXISTS sistema_ventas;
CREATE DATABASE sistema_ventas;
USE sistema_ventas;

-- =====================
-- TABLAS PRINCIPALES
-- =====================

CREATE TABLE continente (
    id_continente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE pais (
    id_pais INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    id_continente INT,
    FOREIGN KEY (id_continente) REFERENCES continente(id_continente)
);

CREATE TABLE departamento (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    id_pais INT,
    FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
);

CREATE TABLE ciudad (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);

CREATE TABLE barrio (
    id_barrio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    id_ciudad INT,
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad)
);

CREATE TABLE persona (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    id_barrio INT,
    FOREIGN KEY (id_barrio) REFERENCES barrio(id_barrio)
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    contrasena VARCHAR(100),
    rol VARCHAR(50),
    id_persona INT,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona)
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE factura (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    id_persona INT,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona)
);

CREATE TABLE detalle_factura (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT,
    id_factura INT,
    id_producto INT,
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- CONTINENTE
INSERT INTO continente (nombre) VALUES 
('América'), ('Europa'), ('Asia'), ('África'), ('Oceanía');

-- PAIS
INSERT INTO pais (nombre, id_continente) VALUES 
('Colombia',1), ('España',2), ('Japón',3), ('Egipto',4), ('Australia',5);

-- DEPARTAMENTO
INSERT INTO departamento (nombre, id_pais) VALUES 
('Huila',1), ('Madrid',2), ('Tokio',3), ('Cairo',4), ('Sydney',5);

-- CIUDAD
INSERT INTO ciudad (nombre, id_departamento) VALUES 
('Neiva',1), ('Madrid',2), ('Shinjuku',3), ('Giza',4), ('Sydney',5);

-- BARRIO
INSERT INTO barrio (nombre, id_ciudad) VALUES 
('Centro',1), ('Norte',2), ('Sur',3), ('Este',4), ('Oeste',5);

-- PERSONA
INSERT INTO persona (nombre, correo, id_barrio) VALUES 
('Juan','juan@gmail.com',1),
('Ana','ana@gmail.com',2),
('Luis','luis@gmail.com',3),
('Maria','maria@gmail.com',4),
('Carlos','carlos@gmail.com',5);

-- USUARIO
INSERT INTO usuario (username, contrasena, rol, id_persona) VALUES 
('juan123','123','admin',1),
('ana123','123','user',2),
('luis123','123','user',3),
('maria123','123','user',4),
('carlos123','123','user',5);

-- CATEGORIA
INSERT INTO categoria (nombre) VALUES 
('Tecnología'),('Ropa'),('Comida'),('Hogar'),('Deportes');

-- PRODUCTO
INSERT INTO producto (nombre, id_categoria) VALUES 
('Laptop',1),('Camisa',2),('Pizza',3),('Silla',4),('Balón',5);

-- FACTURA
INSERT INTO factura (fecha, id_persona) VALUES 
('2026-01-01',1),
('2026-01-02',2),
('2026-01-03',3),
('2026-01-04',4),
('2026-01-05',5);

-- DETALLE FACTURA
INSERT INTO detalle_factura (cantidad, id_factura, id_producto) VALUES 
(1,1,1),
(2,2,2),
(3,3,3),
(1,4,4),
(5,5,5);


UPDATE persona SET nombre='Juan Perez' WHERE id_persona=1;
UPDATE producto SET nombre='Laptop Gamer' WHERE id_producto=1;

DELETE FROM detalle_factura WHERE id_detalle=5;
DELETE FROM producto WHERE id_producto=5;

SELECT * FROM persona;
SELECT * FROM persona WHERE nombre='Ana';

-- JOIN 1
SELECT p.nombre, f.fecha
FROM persona p
INNER JOIN factura f ON p.id_persona = f.id_persona;

-- JOIN 2
SELECT pr.nombre, df.cantidad
FROM producto pr
INNER JOIN detalle_factura df ON pr.id_producto = df.id_producto;