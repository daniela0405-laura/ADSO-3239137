# tool — Sembrador de datos de demostración

Carga datos de demostración **por la API** (nunca directo a la base, ver `docs/data-model.md` §9).
Tarea T-21.

## Qué crea

| Recurso | Cantidad | Endpoint |
|---|---|---|
| Asesor de demostración | 1 | `POST /users` |
| Artículos (8 por categoría) | 40 | `POST /items` |
| Clientes | 10 | `POST /customers` |
| Alquileres (1 a 3 artículos) | 15 | `POST /rentals` |
| Devoluciones | 5 líneas | `POST /rentals/{id}/items/{line}/return` |

Las 5 categorías ya existen: las siembra la migración inicial de la API.

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo, **sin dependencias**).
- La API corriendo (`docker compose up` en `infra`).

## Cómo correrlo

```bash
cd tool
cp .env.example .env      # completar ADMIN_PASSWORD
node seed.mjs
```

En Windows (cmd), sin archivo `.env`:

```bat
set ADMIN_PASSWORD=tu_clave
node seed.mjs
```

## Revisar la sintaxis sin la API

```bash
npm run check
```

## Notas

- Es **idempotente a medias**: si un artículo, cliente o asesor ya existe (409), lo informa y sigue.
- Los vencidos (HU-09) aparecen cuando pasan los 6 días del plazo; el sembrador no falsea fechas porque
  la API no permite registrar alquileres en el pasado.
