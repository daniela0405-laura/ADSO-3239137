CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100)
);

CREATE TABLE libros (
    id_libro SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    autor VARCHAR(100),
    precio DECIMAL(10,2)
);

CREATE TABLE prestamos (
    id_prestamo SERIAL PRIMARY KEY,
    id_cliente INT,
    fecha DATE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_prestamo (
    id_detalle SERIAL PRIMARY KEY,
    id_prestamo INT,
    id_libro INT,
    cantidad INT,
    FOREIGN KEY (id_prestamo) REFERENCES prestamos(id_prestamo),
    FOREIGN KEY (id_libro) REFERENCES libros(id_libro)
);

CREATE TABLE empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    cargo VARCHAR(50)
);

INSERT INTO clientes (nombre, correo) VALUES
('Juan Perez', 'juan@gmail.com'),
('Maria Lopez', 'maria@gmail.com'),
('Carlos Ruiz', 'carlos@gmail.com'),
('Ana Torres', 'ana@gmail.com'),
('Luis Gomez', 'luis@gmail.com');

INSERT INTO libros (titulo, autor, precio) VALUES
('Cien Años de Soledad', 'Gabriel Garcia Marquez', 50000),
('Don Quijote', 'Miguel de Cervantes', 60000),
('La Odisea', 'Homero', 40000),
('El Principito', 'Antoine de Saint', 30000),
('1984', 'George Orwell', 45000);

INSERT INTO prestamos (id_cliente, fecha) VALUES
(1, '2026-01-01'),
(2, '2026-02-01'),
(3, '2026-03-01'),
(4, '2026-04-01'),
(5, '2026-05-01');

INSERT INTO detalle_prestamo (id_prestamo, id_libro, cantidad) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 1),
(4, 4, 3),
(5, 5, 2);

INSERT INTO empleados (nombre, cargo) VALUES
('Pedro Ramirez', 'Administrador'),
('Laura Diaz', 'Bibliotecaria'),
('Andres Castro', 'Auxiliar'),
('Sofia Morales', 'Recepcionista'),
('Diego Herrera', 'Supervisor');

SELECT 
    c.nombre,
    l.titulo,
    p.fecha,
    dp.cantidad
FROM detalle_prestamo dp
JOIN prestamos p ON dp.id_prestamo = p.id_prestamo
JOIN clientes c ON p.id_cliente = c.id_cliente
JOIN libros l ON dp.id_libro = l.id_libro;