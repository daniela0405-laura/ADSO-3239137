# Plan técnico — Camping Rental (Laravel + React)

Cómo se construye lo que dicen [`spec.md`](spec.md) y [`constitution.md`](constitution.md). El esquema **no** se describe
aquí: vive en [`data-model.md`](data-model.md). La forma del sistema, en [`architecture.md`](architecture.md).

## 1. Decisiones técnicas

| # | Decisión | Elección | Por qué |
|---|---|---|---|
| D-01 | Lenguaje y runtime del backend | PHP 8.3 | Stack exigido por el plan |
| D-02 | Framework HTTP | Laravel 11 | Contrato en [`api-contract.md`](api-contract.md) |
| D-03 | Persistencia | Migraciones de Laravel + consultas con el *query builder* sobre PostgreSQL 16 | El esquema es de las migraciones ([ADR-001](adr/adr-001-schema-ownership.md)) |
| D-04 | Concurrencia | Columna `version` en `item` + `CHECK` de rango ([ADR-002](adr/adr-002-optimistic-concurrency.md)) | Última unidad (RNF-2) |
| D-05 | Fechas | Instantes UTC (`timestamptz`); el reloj es un puerto (`Clock`) | Probar vencimientos sin esperar 6 días |
| D-06 | Reporte | Una consulta agregada por un puerto de lectura ([ADR-003](adr/adr-003-frozen-report.md)) | Estable y barato |
| D-07 | Objetos de valor | `ItemReference`, `Quantity`, `DocumentNumber`, `DateRange`: sin tabla propia | No tienen identidad |
| D-08 | Fotos | Binario en disco (`storage/app/photos`); la base guarda solo `photo_key` | Clave opaca, nunca ruta |
| D-09 | Contraseñas | Argon2id (`password_hash`) detrás del puerto `PasswordHasher` | Artículo IX |
| D-10 | Arranque | Comando `php artisan app:create-admin` crea el admin desde `ADMIN_USERNAME` / `ADMIN_PASSWORD` | La base no puede producir el hash |
| D-11 | Autenticación | JWT HS256 (`firebase/php-jwt`), 8 horas, clave en `JWT_SECRET` | Simple y sin estado |
| D-12 | Pruebas backend | Pest (sobre PHPUnit): unitarias con *fakes* y de integración contra PostgreSQL | Pirámide de pruebas |
| D-13 | Frontend | React 18 + Vite + React Router; pruebas con Vitest | Stack exigido por el plan |
| D-14 | Sitio público | HTML + CSS estáticos, sin llamadas a la API | Presenta el producto, no la prueba |
| D-15 | Sembrador | Script Node.js (`tool/seed.mjs`) que usa **solo la API** | Data-model §9 |

## 2. Configuración por entorno

| Variable | Obligatoria | Ejemplo |
|---|---|---|
| `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | sí | `db` / `5432` / `camping` / `camping` / *(en `.env`)* |
| `APP_KEY` | sí | generado con `php artisan key:generate` |
| `JWT_SECRET` | sí | cadena larga aleatoria |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | sí | definidos en `.env`, nunca en el repo |
| `CORS_ORIGIN` | sí | `http://localhost:5173` |
| `VITE_API_URL` (app) | sí | `http://localhost:8000/api/v1` |

## 3. Estrategia de pruebas (meta: 15 o más archivos de prueba)

| Nivel | Qué prueba | Contra qué | Archivos previstos |
|---|---|---|---|
| Dominio | Invariantes: máximo 4, vencimiento a 6 días, disponibles en rango, referencia válida | Nada: objetos puros | `ItemReferenceTest`, `QuantityTest`, `DateRangeTest`, `ItemTest`, `RentalTest`, `UserTest` |
| Aplicación | Casos de uso: login, alta de asesor, artículos, alquilar, devolver, vencidos, reporte | *Fakes* de los puertos | `LoginServiceTest`, `CreateAdvisorServiceTest`, `ItemServicesTest`, `RentItemsServiceTest`, `ReturnItemServiceTest`, `MostRequestedReportTest` |
| Integración / contrato | Rutas, códigos de estado, cuerpo de error único, roles, fotos | API con PostgreSQL | `AuthApiTest`, `ItemApiTest`, `CustomerApiTest`, `RentalApiTest`, `ReportApiTest`, `PhotoApiTest` |
| Concurrencia | Dos alquileres de la última unidad | PostgreSQL real | `LastUnitConcurrencyTest` |
| Arquitectura | Artículos I, II y III | `arch()` de Pest | `LayerDependencyTest` |
| Frontend | Formularios y mensajes en español | Vitest + Testing Library | `LoginPage.test.jsx`, `RentalForm.test.jsx` |

## 4. Orden de construcción

Esqueleto y salud → migración inicial con semilla → dominio → casos de uso con *fakes* → adaptadores → API → pruebas de
contrato y concurrencia → infra → tool → app → page. El detalle, con evidencia, está en [`tasks.md`](tasks.md).
