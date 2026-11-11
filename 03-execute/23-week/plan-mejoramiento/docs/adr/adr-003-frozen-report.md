# ADR-003 · El reporte se calcula en el motor y agrupa por valores congelados

- **Estado:** aceptada
- **Contexto:** el reporte de más solicitados (HU-10) cruza `rental` y `rental_item` sobre un rango. Si leyera el nombre
  o la categoría del catálogo vivo, renombrar un artículo cambiaría un reporte de un periodo ya cerrado.
- **Decisión:** (1) el reporte **no se persiste**: se calcula con una sola consulta agregada en `DbReportReader`.
  (2) Agrupa por `item_id, item_name, category_name` **tal como quedaron congelados en la línea**.
  (3) `rental_item.category_name` **no tiene FK** a propósito. (4) Si un artículo cambió de nombre dentro del rango, el
  reporte muestra **dos filas**: no elige un ganador.
- **Alternativas descartadas:** unir con el catálogo vivo (el reporte deja de ser estable); materializar una tabla de
  reporte (segunda fuente de verdad).
- **Consecuencias:** el reporte no incluye clientes ni asesores (privacidad).
- **Cómo se verifica:** alquilar un artículo, renombrarlo, pedir el reporte del mismo rango: aparece el nombre viejo.
