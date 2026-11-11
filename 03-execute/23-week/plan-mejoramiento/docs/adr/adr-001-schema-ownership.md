# ADR-001 · El esquema es propiedad de las migraciones de Laravel

- **Estado:** aceptada
- **Contexto:** `infra` levanta un PostgreSQL. Alguien podría poner el DDL en un script de arranque del contenedor y otro
  en las migraciones de Laravel; con dos dueños, nadie sabe qué esquema corre de verdad.
- **Decisión:** **todo el DDL vive en `api/database/migrations`** (tablas, índices, `CHECK`, índices parciales y la semilla
  de las cinco categorías). Lo que el *Schema Builder* de Laravel no expresa (índice parcial, `CHECK`) se escribe con
  `DB::statement()` **dentro de la misma migración**. `infra` solo crea el motor vacío, el usuario y el volumen.
- **Alternativas descartadas:** scripts SQL en `infra/db/init/` (segunda fuente de verdad); `php artisan db:seed` para
  las categorías (la semilla quedaría separada del esquema que la necesita).
- **Consecuencias:** un índice nuevo se crea en una migración nueva; un esquema cambiado a mano es un defecto.
- **Cómo se verifica:** `grep -ri "create table" infra/` no devuelve nada; las consultas de `data-model.md` §10
  coinciden con las migraciones.
