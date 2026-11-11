# Contrato de la API — Camping Rental

Qué hace cada operación está en [`spec.md`](spec.md); qué se guarda, en [`data-model.md`](data-model.md).

## 1. Convenciones

| Tema | Regla |
|---|---|
| Base | `/api/v1` |
| Formato | JSON, UTF-8. Nombres de campo en `snake_case` |
| Identificadores | UUID v4 como texto |
| Fechas | ISO 8601 en UTC, con `Z` (`2026-11-14T14:15:00Z`) |
| Dinero | No hay. El sistema no maneja importes |
| Autenticación | `Authorization: Bearer <token>` en todo salvo `POST /auth/login` y `GET /health` |
| Paginación | `?page=1&size=20`. `size` máximo 50. Respuesta: `{ "items": [...], "page": 1, "size": 20, "total": 134 }` |
| Idioma | Mensajes de error en español; campos y códigos en inglés |

### Cuerpo de error (único para todos los errores)

```json
{
  "code": "ITEM_NOT_AVAILABLE",
  "message": "No quedan unidades disponibles de «Carpa iglú 4 personas».",
  "details": [ { "field": "items[0].item_id", "issue": "sin unidades" } ]
}
```

`details` puede ir vacío. **Nunca** incluye trazas, SQL, rutas del servidor ni la contraseña.

### Códigos de estado

| Estado | Cuándo |
|---|---|
| 200 / 201 / 204 | Éxito / creado / sin contenido |
| 401 | Sin token, token inválido o vencido, credenciales inválidas |
| 403 | Rol insuficiente |
| 404 | No existe (o está dado de baja) |
| 409 | Conflicto de estado: duplicado, sin unidades, ya devuelto, cliente con vencidos, artículo con alquileres abiertos |
| 422 | Validación: campo inválido, regla de entrada rota, rango de fechas invertido |

## 2. Códigos de error de negocio

| `code` | Estado | Origen |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | CA-01.2 |
| `UNAUTHENTICATED` | 401 | CA-01.3 |
| `FORBIDDEN_ROLE` | 403 | CA-01.3 |
| `NOT_FOUND` | 404 | Cualquier recurso |
| `USERNAME_TAKEN` | 409 | CA-02.2 |
| `REFERENCE_TAKEN` | 409 | CA-03.2 |
| `DOCUMENT_TAKEN` | 409 | CA-05.1 |
| `ITEM_HAS_OPEN_RENTALS` | 409 | CA-03.5 |
| `ITEM_NOT_AVAILABLE` | 409 | CA-06.3, RNF-2 |
| `CUSTOMER_HAS_OVERDUE` | 409 | CA-06.5 |
| `LINE_ALREADY_RETURNED` | 409 | CA-07.2 |
| `CUSTOMER_LIMIT_EXCEEDED` | 422 | CA-06.4 |
| `DUPLICATE_ITEM_IN_RENTAL` | 422 | CA-06.2 |
| `UNITS_BELOW_RENTED` | 422 | CA-03.3 |
| `VALIDATION_ERROR` | 422 | Cualquier campo inválido |
| `INVALID_DATE_RANGE` | 422 | CA-10.2 |

## 3. Endpoints

### 3.1 Autenticación y salud

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/auth/login` | público | Devuelve token |
| GET | `/health` | público | `{ "status": "ok" }` |

```json
// POST /auth/login — petición
{ "username": "laura", "password": "********" }
// 200
{ "access_token": "eyJ...", "token_type": "Bearer", "expires_in": 28800, "role": "advisor" }
```

### 3.2 Usuarios

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/users` | admin | Crea un asesor |

```json
// petición  (role solo admite "advisor")
{ "username": "Laura ", "password": "********", "role": "advisor" }
// 201  (sin password ni password_hash)
{ "id": "…", "username": "laura", "role": "advisor" }
```

### 3.3 Categorías

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/categories` | autenticado | Las cinco categorías, orden por nombre |

### 3.4 Artículos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/items` | autenticado | Búsqueda: `q`, `category_id`, `page`, `size` |
| GET | `/items/{id}` | autenticado | Detalle |
| POST | `/items` | admin | Crea |
| PUT | `/items/{id}` | admin | Reemplaza nombre, descripción, categoría y total |
| DELETE | `/items/{id}` | admin | Baja lógica → 204 |
| PUT | `/items/{id}/photo` | admin | Sube foto (`multipart/form-data`, campo `file`) |
| GET | `/items/{id}/photo` | autenticado | Devuelve el binario o 404 |
| DELETE | `/items/{id}/photo` | admin | Quita la foto → 204 |

```json
// Artículo (respuesta)
{
  "id": "…", "name": "Carpa iglú 4 personas", "description": "Doble techo, impermeable",
  "reference": "CAR-0012", "category": { "id": "…", "name": "Carpas" },
  "total_units": 3, "available_units": 2, "photo_key": null
}
```

`POST /items` (petición): `name`, `description`, `reference`, `category_id`, `total_units`. Las disponibles las calcula el
servidor. `PUT /items/{id}` no permite cambiar la referencia.

### 3.5 Clientes

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/customers` | admin, advisor | Lista y busca: `q`, `page`, `size` |
| GET | `/customers/{id}` | admin, advisor | Detalle con `active_rentals` (conteo de artículos sin devolver) |
| POST | `/customers` | admin, advisor | Crea: `full_name`, `document_number` |

### 3.6 Alquileres

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/rentals` | admin, advisor | Registra un alquiler |
| GET | `/rentals` | admin, advisor | Lista: `from`, `to`, `status`, `customer_id`, `page`, `size` |
| GET | `/rentals/{id}` | admin, advisor | Detalle con líneas y estado |
| POST | `/rentals/{rental_id}/items/{line_id}/return` | admin, advisor | Devuelve una línea |
| GET | `/rentals/overdue` | admin, advisor | Líneas vencidas |

```json
// POST /rentals — petición (1 a 4 elementos, sin artículos repetidos)
{ "customer_id": "…", "items": [ { "item_id": "…" }, { "item_id": "…" } ] }
// 201
{
  "id": "…", "customer_id": "…", "rented_at": "2026-11-14T14:15:00Z", "status": "open",
  "items": [
    { "id": "…", "item_id": "…", "item_name": "Carpa iglú 4 personas", "reference": "CAR-0012",
      "category_name": "Carpas", "due_at": "2026-11-20T14:15:00Z", "returned_at": null }
  ]
}
```

`status` es calculado: `open` (hay líneas sin devolver y ninguna vencida), `overdue` (alguna sin devolver y vencida),
`closed` (todas devueltas).

`POST /rentals/{rental_id}/items/{line_id}/return` → 200 con la línea (`returned_at` lleno).

`GET /rentals/overdue` → `items`: `{ "rental_id", "line_id", "item_name", "customer_name", "due_at", "days_late" }`.
Aquí sí aparece el nombre del cliente porque es un listado operativo; **el reporte del §3.7 no**.

### 3.7 Reporte

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/reports/most-requested` | admin | `from` y `to` obligatorios (fecha, ambos inclusive) |

```json
{
  "from": "2026-11-01", "to": "2026-11-30",
  "rows": [
    { "item_id": "…", "item_name": "Carpa iglú 4 personas", "category_name": "Carpas", "times_rented": 12 }
  ]
}
```

Una fila por `item_id + item_name + category_name` congelados. Orden: `times_rented` descendente, luego nombre.
Sin clientes ni asesores.

## 4. Seguridad

| Aspecto | Regla |
|---|---|
| Token | JWT firmado HS256, 8 horas, con `sub` y `role`. Sin datos personales dentro |
| Contraseñas | Solo se guarda el hash Argon2id; el hash nunca sale en ninguna respuesta |
| Autorización | Se evalúa en cada endpoint por rol; un 403 no revela si el recurso existe |
| CORS | Solo el origen del frontend configurado por entorno |
| Subida de foto | Solo `image/jpeg` y `image/png`, máx. 2 MB; el tipo se valida por contenido, no por extensión |
