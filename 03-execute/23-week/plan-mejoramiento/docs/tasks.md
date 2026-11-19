# Tareas — Camping Rental (Laravel + React)

Cada tarea termina cuando su **evidencia** existe y se puede ejecutar (artículo XII). La columna *Carpeta* indica dónde
queda el trabajo.

| # | Tarea | Carpeta | Depende de | Evidencia |
|---|---|---|---|---|
| T-01 | Esqueleto Laravel y `GET /api/v1/health` | api | — | `GET /health` responde `{"status":"ok"}` |
| T-02 | Migración inicial: seis tablas, FK, índices únicos, `ck_item_available_range` y las cinco categorías sembradas | api | T-01 | Las consultas de `data-model.md` §10 devuelven lo documentado; ninguna columna de negocio con `DEFAULT` |
| T-03 | Dominio: `ItemReference`, `Quantity`, `DocumentNumber`, `DateRange` | api | T-01 | Pruebas unitarias: referencia `AAA-0000`, cantidad > 0, fin ≥ inicio |
| T-04 | Dominio: `Item` (`withdraw`, `restock`, `changeTotal`, baja lógica) | api | T-03 | Pruebas: nunca < 0, nunca > total |
| T-05 | Dominio: `Rental` (`addLine`, `returnLine`, estado calculado, 6 días, 1 a 4 líneas) | api | T-04 | Pruebas con un `Clock` falso: `open`, `overdue`, `closed` |
| T-06 | Dominio: `Customer` y `User` (normalización de nombre, rol válido) | api | T-03 | `"Laura "` queda `laura`; rol `admin` por API rechazado |
| T-07 | Puertos y casos de uso de **autenticación** (`LoginService`, `CreateAdvisorService`) con *fakes* | api | T-06 | HU-01 y HU-02 pasan contra *fakes* |
| T-08 | Puertos y casos de uso de **artículos** (crear, buscar, editar, baja, foto) con *fakes* | api | T-04 | HU-03 y HU-04 pasan contra *fakes* |
| T-09 | Caso de uso **alquilar** (`RentItemsService`) con *fakes* | api | T-05, T-08 | HU-06 completa: límite de 4, vencidos, sin unidades |
| T-10 | Casos de uso **devolver** y **vencidos** | api | T-09 | HU-07 y HU-09; devolver dos veces → `LINE_ALREADY_RETURNED` |
| T-11 | Caso de uso **reporte de más solicitados** y su puerto de lectura | api | T-09 | HU-10; el nombre viejo se conserva tras renombrar (ADR-003) |
| T-12 | Adaptador de persistencia: repositorios de artículo, cliente, usuario | api | T-02, T-08 | Pruebas de integración contra PostgreSQL |
| T-13 | Adaptador de persistencia: repositorio de alquileres + columna `version` | api | T-12, T-09 | Dos alquileres de la última unidad: uno 201, otro 409 (RNF-2) |
| T-14 | Adaptador de seguridad: hash Argon2id y token JWT | api | T-07 | La clave nunca aparece en logs ni respuestas (RNF-3) |
| T-15 | Adaptador de fotos (disco) | api | T-08 | PNG de 2 MB ok; 3 MB → 422; sin foto → `photo_key` nulo |
| T-16 | Adaptador HTTP: rutas de `api-contract.md`, cuerpo de error único, autorización por rol | api | T-10, T-11, T-14, T-15 | Pruebas de contrato recorren todas las rutas y los códigos de §2 |
| T-17 | Composición (`PortBindingsServiceProvider`) y arranque: `app:create-admin` desde entorno | api | T-16 | Con la base vacía se migra, se crea el admin y se puede iniciar sesión |
| T-18 | Bajar a la base las invariantes **solo dominio**: `ck_item_total_positive`, `ck_app_user_role` | api | T-12 | Un `INSERT` por `psql` que las viole falla; `data-model.md` §4 se actualiza |
| T-19 | Pruebas de arquitectura (artículos I, II y III) | api | T-17 | `LayerDependencyTest` pasa, y falla si se introduce una importación prohibida |
| T-20 | `infra`: `docker compose up` levanta PostgreSQL vacío, API y frontend | infra | T-17 | Un comando; la base arranca sin tablas hasta correr las migraciones |
| T-21 | `tool`: sembrador por la API (≥ 40 artículos, 10 clientes, 15 alquileres, 3 vencidos) | tool | T-17 | Tras correrlo, `/rentals/overdue` devuelve 3 líneas y el reporte tiene filas |
| T-22 | `app`: login, catálogo, clientes, alquilar, devolver, vencidos, reporte, alta de asesor | app | T-16 | Recorrido de punta a punta en la sustentación + pruebas Vitest |
| T-23 | `page`: sitio público estático que presenta el producto | page | — | Se abre sin la API; correcto en móvil y escritorio |

## Definición de terminado del plan de mejoramiento

El acta exige el proyecto **totalmente terminado**: las 23 tareas con evidencia, las 10 historias, las 6 reglas, los 5
requisitos no funcionales, todos los endpoints del contrato y **15 o más archivos de pruebas automatizadas**.

## Seguimiento

| Tarea | Estado | Evidencia en el repositorio |
|---|---|---|
| T-01 Esqueleto y `/health` | hecha | `api/routes/api.php`, `api/tests/Feature/HealthTest.php` |
| T-02 Migración inicial | hecha | `api/database/migrations/2026_11_12_000001_create_initial_schema.php` |
| T-03 Objetos de valor | hecha | `api/app/Domain/ValueObjects`, `api/tests/Unit/Domain/*Test.php` |
| T-04 … T-18 | pendiente | — |
| T-19 Pruebas de arquitectura | parcial | `api/tests/Architecture/LayerDependencyTest.php` (artículos I y II) |
| T-20 `infra` | hecha | `infra/docker-compose.yml` con `db`, `api` y `app` |
| T-21 `tool` | parcial | `tool/seed.mjs`; los vencidos dependen del paso del tiempo |
| T-22 `app` | parcial | Login, catálogo, alquilar, vencidos y reporte; `app/tests/*.test.jsx` |
| T-23 `page` | hecha | `page/index.html`, `page/styles.css` |

### Archivos de pruebas automatizadas

| # | Archivo | Qué prueba |
|---|---|---|
| 1 | `api/tests/Feature/HealthTest.php` | `/health` público |
| 2 | `api/tests/Unit/Domain/ItemReferenceTest.php` | Formato `AAA-0000` |
| 3 | `api/tests/Unit/Domain/QuantityTest.php` | Unidades ≥ 1 |
| 4 | `api/tests/Unit/Domain/DocumentNumberTest.php` | Documento solo numérico |
| 5 | `api/tests/Unit/Domain/DateRangeTest.php` | Rango de fechas del reporte |
| 6 | `api/tests/Architecture/LayerDependencyTest.php` | Dominio y aplicación sin dependencias prohibidas |
| 7 | `app/tests/LoginPage.test.jsx` | Validación y mensaje de error del login |
| 8 | `app/tests/RentalFormPage.test.jsx` | Máximo 4 artículos y sin repetidos |

Meta del acta: 15 o más archivos. **Faltan 7.**
