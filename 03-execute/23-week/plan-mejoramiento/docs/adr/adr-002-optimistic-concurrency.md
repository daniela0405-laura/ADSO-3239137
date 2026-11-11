# ADR-002 · Concurrencia optimista sobre las unidades

- **Estado:** aceptada
- **Contexto:** dos operadores pueden entregar la **última unidad** del mismo artículo al mismo tiempo (RNF-2). Si ambos
  leen `available_units = 1` y ambos escriben, el sistema alquila una unidad que no existe.
- **Decisión:** control **optimista**. `item` lleva la columna `version`. El repositorio guarda con
  `UPDATE item SET available_units = ?, version = version + 1 WHERE id = ? AND version = ?` dentro de la transacción del
  alquiler; si afecta 0 filas, revierte todo y el servidor responde **409 `ITEM_NOT_AVAILABLE`**. La **última barrera**
  es el `CHECK` `ck_item_available_range` (`0 <= available_units <= total_units`).
- **Alternativas descartadas:** bloqueo pesimista (`SELECT … FOR UPDATE`) en cada alquiler: serializa todo el negocio
  por un caso raro; contador en memoria o en caché: no sobrevive a más de un proceso PHP.
- **Consecuencias:** si el `CHECK` salta, algo escribió fuera del repositorio: es un defecto, no un caso de negocio.
  Devolver dos veces la misma línea no suma dos veces porque `returned_at` ya está lleno (CA-07.2).
- **Cómo se verifica:** `LastUnitConcurrencyTest` lanza dos alquileres sobre un artículo con una unidad: exactamente uno
  recibe 201 y el otro 409.
