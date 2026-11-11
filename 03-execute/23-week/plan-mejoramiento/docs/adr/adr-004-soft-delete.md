# ADR-004 · Los artículos se dan de baja, no se borran

- **Estado:** aceptada
- **Contexto:** una línea de alquiler apunta a un artículo. Si el artículo se borra físicamente, el historial y el
  reporte quedan rotos.
- **Decisión:** `item` lleva `deleted_at`. Dar de baja lo llena; el catálogo filtra por `deleted_at IS NULL` en un único
  lugar (`DbItemRepository`). Un artículo con alquileres abiertos **no** se da de baja (409 `ITEM_HAS_OPEN_RENTALS`). La
  unicidad de la referencia es un índice **parcial** sobre activos, así una referencia dada de baja puede reutilizarse.
- **Alternativas descartadas:** borrado físico con cascada (destruye el histórico); columna `active = false` (no dice
  cuándo); `SoftDeletes` de Eloquent (el dominio no usa Eloquent, artículo I).
- **Consecuencias:** `rental_item.item_id` lleva una FK `RESTRICT` como barrera de última instancia. La foto es el único
  dato que sí se borra físicamente.
- **Cómo se verifica:** consultar un artículo dado de baja devuelve 404; un `DELETE` por `psql` sobre un artículo con
  líneas falla por la FK.
