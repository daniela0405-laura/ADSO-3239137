Este proyecto es la solución del plan de mejoramiento del aprendiz A01, ficha 3239137, dominio camping.

# Camping Rental — Alquiler de equipo de camping

Sistema para que un negocio pequeño de alquiler de equipo de camping lleve su catálogo de artículos, sus
clientes y sus alquileres, y vea qué artículos se solicitan más.

Se construye con SDD (*Spec-Driven Development*): primero la especificación en [`docs/`](docs/) y después el
código que la cumple.

## Estructura

| Carpeta | Contenido |
|---|---|
| [`docs/`](docs/) | Especificación: constitución, spec, plan, arquitectura, modelo de datos, contrato de la API, tareas y ADR |
| [`api/`](api/) | Backend en PHP con Laravel |
| [`app/`](app/) | Frontend en React |
| [`page/`](page/) | Sitio público estático que presenta el producto |
| [`infra/`](infra/) | Contenedores, red, volúmenes y motor de base de datos vacío |
| [`tool/`](tool/) | Sembrador de datos de demostración por la API |

## Cómo se lee la especificación

1. [`docs/constitution.md`](docs/constitution.md) — principios innegociables.
2. `docs/spec.md` — actores, historias, criterios de aceptación y reglas de negocio.
3. `docs/plan.md` y `docs/architecture.md` — cómo se construye.
4. `docs/data-model.md` y `docs/api-contract.md` — modelo de datos y contrato HTTP.
5. `docs/tasks.md` — tareas y su evidencia.
6. `docs/adr/` — decisiones de arquitectura.

## Cómo se levanta

Se documenta en [`infra/README.md`](infra/README.md) cuando la tarea T-20 esté terminada.
