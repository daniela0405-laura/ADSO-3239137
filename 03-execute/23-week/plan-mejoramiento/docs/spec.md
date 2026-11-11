# Especificación — Camping Rental

**Qué se construye y por qué.** Un sistema para que un negocio pequeño de alquiler de equipo de camping lleve su catálogo
de artículos, sus clientes y sus alquileres, y vea qué artículos se solicitan más.

Rige bajo [`constitution.md`](constitution.md). El modelo de datos vive solo en [`data-model.md`](data-model.md) y el
contrato HTTP solo en [`api-contract.md`](api-contract.md).

## Equivalencias con Manager Library

| Manager Library | Camping Rental | Identificador en código |
|---|---|---|
| Libro (ISBN) | Artículo (referencia) | `item`, `reference` |
| Ejemplares | Unidades | `total_units`, `available_units` |
| Socio | Cliente | `customer` |
| Bibliotecario | Asesor | `advisor` |
| Préstamo | Alquiler | `rental`, `rental_item` |
| Categoría (5) | Categoría (5): Carpas, Dormir, Cocina, Iluminación, Mochilas | `category` |
| Portada | Foto del artículo | `photo_key` |
| Reporte de más prestados | Reporte de artículos más solicitados | `most-requested` |

---

## 1. Actores

| Actor | Qué hace | Cómo se autentica |
|---|---|---|
| **Administrador** (`admin`) | Mantiene el catálogo de artículos y los clientes; da de alta asesores; ve el reporte | Usuario y contraseña → token |
| **Asesor** (`advisor`) | Registra alquileres y devoluciones; consulta catálogo, clientes y vencidos | Usuario y contraseña → token |
| **Cliente** | Persona que alquila equipo. **No entra al sistema**: es un dato, no un usuario | — |

El rol `admin` lo crea el arranque desde variables de entorno. **Nadie lo otorga en ejecución.**

## 2. Alcance

**Dentro:** catálogo de artículos con foto opcional, cinco categorías fijas, clientes, alquileres con varias líneas,
devolución por línea, artículos vencidos, reporte de más solicitados, inicio de sesión con roles.

**Fuera, y no se reabre:** cobros, tarifas, depósitos y pagos; reservas a futuro; renovaciones; daños o pérdidas;
correo o SMS; importación masiva; varias sedes; atributos del artículo más allá de los de §3 (sin marca, sin talla,
sin color).

## 3. Historias de usuario y criterios de aceptación

### HU-01 · Iniciar sesión
Como usuario quiero autenticarme para operar según mi rol.
- **CA-01.1** Con credenciales válidas se recibe un token con vigencia de 8 horas.
- **CA-01.2** Con credenciales inválidas responde 401 con un mensaje que **no** dice si falló el usuario o la clave.
- **CA-01.3** Todo endpoint salvo el inicio de sesión y `/health` exige token. Sin token: 401. Rol insuficiente: 403.

### HU-02 · Dar de alta asesores (admin)
- **CA-02.1** El admin crea un usuario con nombre, clave y rol `advisor`.
- **CA-02.2** El nombre de usuario se guarda en minúsculas y recortado; es único. Repetido: 409.
- **CA-02.3** Pedir el rol `admin` por la API responde 422. La clave nunca se devuelve ni se registra en logs.

### HU-03 · Gestionar artículos (admin)
- **CA-03.1** Crear artículo con nombre, descripción corta, referencia, categoría y total de unidades. Las unidades
  disponibles arrancan iguales al total.
- **CA-03.2** La referencia tiene el formato `AAA-0000` (tres letras mayúsculas, guion, cuatro dígitos; p. ej.
  `CAR-0012`) y es única entre artículos activos. Repetida: 409.
- **CA-03.3** Total de unidades ≥ 1. Cambiar el total ajusta las disponibles en la misma diferencia y **nunca** deja
  disponibles < 0 (422).
- **CA-03.4** Subir foto (JPG/PNG, máx. 2 MB) guarda una **clave opaca**; sin foto el campo es `null`, nunca cadena vacía.
- **CA-03.5** Eliminar un artículo es **baja lógica**: deja de aparecer en el catálogo pero sigue en los alquileres
  pasados. Un artículo con alquileres abiertos no se da de baja (409).

### HU-04 · Buscar artículos
- **CA-04.1** Búsqueda por texto parcial en nombre o referencia, filtro por categoría, solo artículos activos, orden por
  nombre, paginada (`page`, `size`, máx. 50).
- **CA-04.2** La respuesta incluye el total de resultados.
- **CA-04.3** Consultar un artículo por id inexistente o dado de baja: 404.

### HU-05 · Gestionar clientes
- **CA-05.1** El admin y el asesor crean clientes con nombre completo y documento. El documento es único: repetido 409.
- **CA-05.2** Se lista y se busca por nombre o documento, paginado.
- **CA-05.3** Los clientes no se eliminan.

### HU-06 · Registrar un alquiler
- **CA-06.1** Un alquiler es de **un** cliente, lo registra el usuario autenticado y trae de 1 a 4 líneas.
- **CA-06.2** No se repite el mismo artículo en un alquiler (422).
- **CA-06.3** Cada línea descuenta **1** unidad disponible en la misma operación. Sin unidades: 409 y **no se registra nada**.
- **CA-06.4** Un cliente no puede tener más de **4 artículos sin devolver** en total (422 con el conteo actual).
- **CA-06.5** Un cliente con algún artículo **vencido** no puede alquilar otro (409).
- **CA-06.6** La fecha de vencimiento es `rented_at + 6 días`. La línea congela nombre, referencia y nombre de
  categoría **en ese instante**.
- **CA-06.7** El alquiler registrado no se edita ni se borra.

### HU-07 · Registrar una devolución
- **CA-07.1** Se devuelve **una línea** a la vez. Pone `returned_at` y suma 1 a las disponibles.
- **CA-07.2** Devolver una línea ya devuelta: 409. **Nunca** suma dos veces.
- **CA-07.3** Las disponibles jamás superan el total (la base lo garantiza).
- **CA-07.4** Cuando todas las líneas están devueltas, el alquiler figura como **cerrado**.

### HU-08 · Ver un alquiler y listar alquileres
- **CA-08.1** Consultar un alquiler trae sus líneas y su estado calculado (`open`, `overdue`, `closed`).
- **CA-08.2** Listar por rango de fechas, estado y cliente, orden por fecha descendente, paginado.
- **CA-08.3** El estado **se calcula**, no se almacena.

### HU-09 · Artículos vencidos
- **CA-09.1** Lista las líneas sin devolver con `due_at` anterior a ahora: artículo, cliente, días de retraso.
- **CA-09.2** Ordenadas por más días de retraso primero. Solo `admin` y `advisor`.

### HU-10 · Reporte de artículos más solicitados
- **CA-10.1** Dado un rango de fechas, una fila por **artículo y nombre de categoría congelado**, con la cantidad de veces
  alquilado, ordenado de mayor a menor.
- **CA-10.2** Fin anterior al inicio: 422. Rango sin alquileres: lista vacía, no error.
- **CA-10.3** El reporte **no** se desglosa por asesor ni por cliente.
- **CA-10.4** Un reporte de un periodo cerrado **no cambia** aunque luego se renombre el artículo o su categoría.
- **CA-10.5** Solo `admin`.

## 4. Reglas de negocio

| # | Regla |
|---|---|
| RN-1 | Unidades disponibles entre 0 y total, siempre. |
| RN-2 | Plazo de alquiler: 6 días. Máximo 4 artículos sin devolver por cliente. |
| RN-3 | Un cliente con vencidos no recibe más hasta devolverlos. |
| RN-4 | Lo congelado en la línea (nombre, referencia, categoría) no sigue al catálogo. |
| RN-5 | Alquileres y devoluciones no se borran. El catálogo solo tiene baja lógica. |
| RN-6 | Las fechas son instantes UTC. Mensajes al usuario en español; código y columnas en inglés. |

## 5. Requisitos no funcionales

| # | Requisito | Cómo se mide |
|---|---|---|
| RNF-1 | La búsqueda de artículos responde en menos de 300 ms con 5 000 artículos | Prueba de carga con el sembrador de `tool` |
| RNF-2 | Dos operadores entregando la **última unidad** a la vez: uno gana, el otro recibe 409 | Prueba concurrente |
| RNF-3 | La contraseña nunca viaja ni se guarda en claro; nunca aparece en logs | Revisión de logs y de respuestas |
| RNF-4 | Todo error HTTP usa el mismo cuerpo (ver contrato) | Prueba de contrato |
| RNF-5 | El sistema levanta con un solo comando y la base arranca vacía | `README` de `infra` |
