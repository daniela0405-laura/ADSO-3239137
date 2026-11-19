# infra — Contenedores

`docker compose up` levanta el motor de base de datos **vacío**, la API y el frontend con un solo comando. Aquí no se crean tablas: el esquema es de las migraciones
de la API ([ADR-001](../docs/adr/adr-001-schema-ownership.md)).

## Servicios

| Servicio | Imagen | Puerto | Papel |
|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | Motor vacío, con volumen `db-data` |
| `api` | `api.Dockerfile` (PHP 8.3) | 8000 | Corre las migraciones y sirve la API |
| `app` | `app.Dockerfile` (Node 20) | 5173 | Frontend en React (servidor de desarrollo de Vite) |

## Cómo levantarlo

```bash
cd infra
cp .env.example .env        # completar DB_PASSWORD, APP_KEY, JWT_SECRET y ADMIN_PASSWORD
docker compose up --build
```

Comprobar:

- API: `http://localhost:8000/api/v1/health` responde `{"status":"ok"}`.
- Frontend: `http://localhost:5173` muestra la pantalla de inicio de sesión.

## Cargar datos de demostración

Con todo arriba, desde otra terminal:

```bash
cd ../tool
node seed.mjs
```

## Empezar con la base vacía otra vez

```bash
docker compose down -v
```

## Verificación del artículo V

```bash
grep -riE "create[[:space:]]+table" .    # no debe devolver nada
```
