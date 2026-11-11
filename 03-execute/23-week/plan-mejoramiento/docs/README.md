# docs — Especificación de Camping Rental

Especificación del proyecto, adaptada de *Manager Library* al dominio **alquiler de equipo de camping**.

Se lee en este orden:

1. [`constitution.md`](constitution.md) — principios innegociables.
2. [`spec.md`](spec.md) — actores, 10 historias, criterios de aceptación, 6 reglas de negocio y 5 requisitos no funcionales.
3. [`plan.md`](plan.md) y [`architecture.md`](architecture.md) — cómo se construye.
4. [`data-model.md`](data-model.md) y [`api-contract.md`](api-contract.md) — modelo de datos y contrato de la API.
5. [`tasks.md`](tasks.md) — las 23 tareas y su evidencia.
6. [`adr/`](adr/) — decisiones de arquitectura:
   - [ADR-001](adr/adr-001-schema-ownership.md) · El esquema es de las migraciones
   - [ADR-002](adr/adr-002-optimistic-concurrency.md) · Concurrencia optimista
   - [ADR-003](adr/adr-003-frozen-report.md) · Reporte con valores congelados
   - [ADR-004](adr/adr-004-soft-delete.md) · Baja lógica
