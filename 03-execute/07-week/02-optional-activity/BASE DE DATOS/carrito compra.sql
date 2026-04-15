CREATE DATABASE carrito_compras;
USE carrito_compras;
CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100)
);
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2)
);
CREATE TABLE pedidos (
id_pedido INT AUTO_INCREMENT PRIMARY KEY,
fecha DATE,
id_cliente INT,
FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);
CREATE TABLE Detalle_Pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
    CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    metodo VARCHAR(50),
    monto DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);
INSERT INTO Clientes (nombre, correo) VALUES ('Juan Perez', 'juan@gmail.com');
INSERT INTO Clientes (nombre, correo) VALUES ('Maria Lopez', 'maria@gmail.com');
INSERT INTO Clientes (nombre, correo) VALUES ('Carlos Ruiz', 'carlos@gmail.com');
INSERT INTO Clientes (nombre, correo) VALUES ('Ana Torres', 'ana@gmail.com');
INSERT INTO Clientes (nombre, correo) VALUES ('Luis Gomez', 'luis@gmail.com');

INSERT INTO Productos (nombre, precio) VALUES ('Laptop', 2500000);
INSERT INTO Productos (nombre, precio) VALUES ('Mouse', 50000);
INSERT INTO Productos (nombre, precio) VALUES ('Teclado', 120000);
INSERT INTO Productos (nombre, precio) VALUES ('Monitor', 800000);
INSERT INTO Productos (nombre, precio) VALUES ('Audifonos', 90000);

INSERT INTO pedidos (fecha, id_cliente) VALUES ('2026-04-13', 1);
INSERT INTO pedidos (fecha, id_cliente) VALUES ('2026-04-13', 2);
INSERT INTO pedidos (fecha, id_cliente) VALUES ('2026-04-13', 3);
INSERT INTO pedidos (fecha, id_cliente) VALUES ('2026-04-13', 4);
INSERT INTO pedidos (fecha, id_cliente) VALUES ('2026-04-13', 5);

INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES (1, 1, 2);
INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES (2, 2, 1);
INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES (3, 3, 5);
INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES (4, 4, 1);
INSERT INTO Detalle_Pedido (id_pedido, id_producto, cantidad) VALUES (5, 5, 3);

INSERT INTO Pagos (id_pedido, metodo, monto) VALUES (1, 'Efectivo', 2500000);
INSERT INTO Pagos (id_pedido, metodo, monto) VALUES (2, 'Tarjeta', 50000);
INSERT INTO Pagos (id_pedido, metodo, monto) VALUES (3, 'Transferencia', 120000);
INSERT INTO Pagos (id_pedido, metodo, monto) VALUES (4, 'Efectivo', 800000);
INSERT INTO Pagos (id_pedido, metodo, monto) VALUES (5, 'Tarjeta', 90000);

UPDATE Clientes SET nombre = 'Juan Actualizado' WHERE id_cliente = 1;
UPDATE Productos SET precio = 3000000 WHERE id_producto = 1;
UPDATE pedidos SET fecha = '2026-05-01' WHERE id_pedido = 1;
UPDATE Pagos SET metodo = 'Nequi' WHERE id_pago = 1;
UPDATE Detalle_Pedido SET cantidad = 10 WHERE id_detalle = 1;

SELECT * FROM Clientes;
SELECT * FROM Productos;
SELECT * FROM pedidos;
SELECT * FROM Detalle_Pedido;
SELECT * FROM Pagos;

-- BORRAR DETALLE PRIMERO (IMPORTANTE)
DELETE FROM Detalle_Pedido WHERE id_detalle = 5;
DELETE FROM Detalle_Pedido WHERE id_detalle = 4;

-- LUEGO PAGOS
DELETE FROM Pagos WHERE id_pago = 5;
DELETE FROM Pagos WHERE id_pago = 4;

-- LUEGO PEDIDOS
DELETE FROM pedidos WHERE id_pedido = 5;
DELETE FROM pedidos WHERE id_pedido = 4;

-- LUEGO PRODUCTOS
DELETE FROM Productos WHERE id_producto = 5;
DELETE FROM Productos WHERE id_producto = 4;

-- LUEGO CLIENTES
DELETE FROM Clientes WHERE id_cliente = 5;
DELETE FROM Clientes WHERE id_cliente = 4;


SELECT p.id_pedido, c.nombre, p.fecha
FROM pedidos p
INNER JOIN Clientes c ON p.id_cliente = c.id_cliente;

SELECT d.id_pedido, pr.nombre, d.cantidad
FROM Detalle_Pedido d
INNER JOIN Productos pr ON d.id_producto = pr.id_producto;


