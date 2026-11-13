# api — Backend en PHP con Laravel

Implementa el contrato de [`../docs/api-contract.md`](../docs/api-contract.md) siguiendo
[`../docs/constitution.md`](../docs/constitution.md).

## Estructura (arquitectura hexagonal)

| Carpeta | Contenido |
|---|---|
| `app/Domain` | Entidades y objetos de valor en PHP puro (sin Laravel) |
| `app/Application` | Puertos (`Ports`) y casos de uso (`Services`) |
| `app/Infrastructure` | Adaptadores: HTTP, persistencia, fotos y seguridad |
| `app/Providers/PortBindingsServiceProvider.php` | Único punto de composición (pendiente, T-17) |
| `database/migrations` | Todo el esquema y la semilla de categorías (ADR-001) |
| `tests` | Pruebas con Pest |

## Correr en local sin Docker

```bash
cp .env.example .env        # completar DB_PASSWORD, JWT_SECRET, ADMIN_*
composer install
php artisan key:generate
php artisan migrate
php artisan serve           # http://localhost:8000/api/v1/health
```

## Pruebas

```bash
php artisan test            # o: ./vendor/bin/pest
```

## Avance

| Tarea | Estado | Evidencia |
|---|---|---|
| T-01 Esqueleto y `GET /api/v1/health` | hecha | `tests/Feature/HealthTest.php` |
| T-02 Migración inicial con 5 categorías | hecha | `database/migrations/2026_11_12_000001_create_initial_schema.php` |
| T-03 … T-19 | pendiente | — |
