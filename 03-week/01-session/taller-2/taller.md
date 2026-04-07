
# 🧭 Ejercicio Integrador: Trazabilidad Internacional de un Pedido

## 🎯 Propósito del ejercicio

El objetivo de esta actividad es diseñar un modelo de datos que permita identificar claramente **de dónde sale un producto y hacia dónde va un pedido**, considerando un contexto internacional.

Al finalizar el ejercicio, el aprendiz deberá ser capaz de explicar y demostrar:

- El origen geográfico de un pedido.
- El destino final exacto (hasta nivel de barrio).
- La relación entre producto, pedido y ubicación.
- La trazabilidad completa del envío.

---

## 📦 Contexto del problema

Una empresa de comercio internacional realiza envíos a diferentes países.  
Para mejorar el control logístico, se requiere estructurar la información de manera que sea posible responder preguntas como:

- ¿Desde qué ciudad se envió el pedido?
- ¿En qué continente se encuentra el destino?
- ¿Qué producto fue enviado?
- ¿Cuál es la ruta geográfica completa del pedido?

Para ello, se propone modelar las siguientes entidades.

---

## 🗂 Entidades del sistema

### 1️⃣ Producto
Representa el artículo que será enviado.

- `codigo`
- `nombre`
- `precio`

---

### 2️⃣ Pedido
Representa la solicitud de envío del producto.

- `codigo`
- `barrio_destino`
- `direccion`
- `ciudad_origen`

---

## 🌍 Modelo geográfico jerárquico

Para poder identificar correctamente la ubicación del pedido, se debe estructurar la información geográfica de manera jerárquica:


----------------------

### Continente
- `codigo`
- `nombre`
- `descripcion`

### País
- `codigo`
- `nombre`
- `descripcion`
- `continente_id`

### Departamento
- `codigo`
- `nombre`
- `descripcion`
- `pais_id`

### Municipio
- `codigo`
- `nombre`
- `descripcion`
- `departamento_id`

### Barrio
- `codigo`
- `nombre`
- `descripcion`
- `municipio_id`

---

## 🧠 Actividades a desarrollar

El aprendiz deberá:

1. Diseñar el modelo relacional con sus respectivas claves primarias y foráneas.
2. Garantizar integridad referencial entre todas las tablas.
3. Establecer la relación entre:
   - Pedido y Producto.
   - Pedido y Barrio (destino).
4. Construir consultas que permitan:
   - Identificar el continente del destino.
   - Identificar el país y departamento del pedido.
   - Determinar la ciudad de origen.
   - Mostrar la trazabilidad completa del pedido.

---

## 📌 Resultado esperado

Debe ser posible generar una salida como la siguiente:

> El producto "Laptop X" fue enviado desde Bogotá (Colombia, América) hacia el barrio Centro, en Medellín (Colombia, América).

---

## 🎓 Competencias que se fortalecen

- Modelado de bases de datos relacionales.
- Diseño jerárquico de información geográfica.
- Implementación de claves primarias y foráneas.
- Construcción de consultas con múltiples `JOIN`.
- Análisis de trazabilidad de datos.

---

## 🏁 Entregable

- Modelo entidad–relación o modelo relacional.
- Script de creación de tablas.
- Consultas que demuestren la trazabilidad completa del pedido.

---

Este ejercicio permitirá comprender cómo estructurar datos logísticos internacionales y cómo relacionarlos correctamente para garantizar trazabilidad y consistencia en la información.