-- CREAR BASE DE DATOS
CREATE DATABASE sistema_ventas;
GO

USE sistema_ventas;
GO

-- =========================
-- CREAR TABLAS
-- =========================

CREATE TABLE categoria (
  id_categoria INT PRIMARY KEY IDENTITY(1,1),
  nombre VARCHAR(100)
);

CREATE TABLE producto (
  id_producto INT PRIMARY KEY IDENTITY(1,1),
  nombre VARCHAR(100),
  id_categoria INT,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE persona (
  id_persona INT PRIMARY KEY IDENTITY(1,1),
  nombre VARCHAR(100),
  correo VARCHAR(100)
);

CREATE TABLE factura (
  id_factura INT PRIMARY KEY IDENTITY(1,1),
  fecha DATE,
  total DECIMAL(10,2),
  id_persona INT,
  FOREIGN KEY (id_persona) REFERENCES persona(id_persona)
);

CREATE TABLE detalle_factura (
  id_detalle INT PRIMARY KEY IDENTITY(1,1),
  cantidad INT,
  id_factura INT,
  id_producto INT,
  FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- =========================
-- INSERTS (5 POR TABLA)
-- =========================

INSERT INTO categoria (nombre) VALUES 
('Tecnologia'),
('Ropa'),
('Hogar'),
('Deportes'),
('Libros');

INSERT INTO producto (nombre, id_categoria) VALUES
('Laptop',1),
('Camisa',2),
('Sofa',3),
('Balon',4),
('Libro SQL',5);

INSERT INTO persona (nombre, correo) VALUES
('Juan','juan@gmail.com'),
('Ana','ana@gmail.com'),
('Luis','luis@gmail.com'),
('Maria','maria@gmail.com'),
('Carlos','carlos@gmail.com');

INSERT INTO factura (fecha, total, id_persona) VALUES
('2024-01-01',100,1),
('2024-01-02',200,2),
('2024-01-03',300,3),
('2024-01-04',150,1),
('2024-01-05',250,2);

INSERT INTO detalle_factura (cantidad, id_factura, id_producto) VALUES
(1,1,1),
(2,2,2),
(1,3,3),
(3,4,4),
(2,5,5);

-- =========================
-- UPDATE (2)
-- =========================

UPDATE persona SET nombre='Juan Perez' WHERE id_persona=1;
UPDATE producto SET nombre='Laptop Gamer' WHERE id_producto=1;

-- =========================
-- DELETE (2)
-- =========================

DELETE FROM detalle_factura WHERE id_detalle=5;
DELETE FROM producto WHERE id_producto=5;

-- =========================
-- SELECT (2)
-- =========================

SELECT * FROM persona;
SELECT * FROM persona WHERE nombre='Ana';

-- =========================
-- INNER JOIN (2)
-- =========================

SELECT p.nombre, f.total
FROM persona p
INNER JOIN factura f ON p.id_persona = f.id_persona;

SELECT f.id_factura, pr.nombre, df.cantidad
FROM factura f
INNER JOIN detalle_factura df ON f.id_factura = df.id_factura
INNER JOIN producto pr ON df.id_producto = pr.id_producto;