# Constitución — Camping Rental (Laravel + React)

Principios innegociables del proyecto. No son estilo ni preferencia: cada artículo trae **cómo se verifica**, porque un principio que
nadie puede comprobar es una intención. Un cambio que viole un artículo se rechaza sin discutir el resto.

Adaptada de la constitución de *Manager Library* al dominio de alquiler de equipo de camping y al stack PHP (Laravel) + React.

---

## Artículo I — El dominio no depende de nada

`api/app/Domain/` no usa ninguna otra capa del proyecto ni librerías de terceros: solo PHP puro (clases `final` y `readonly`,
`DateTimeImmutable`, enums nativos). Ni Eloquent, ni `Illuminate\*`, ni facades.

**Por qué:** es lo único que permite probar las invariantes sin base de datos, sin servidor y sin contenedor, y cambiar de ORM sin tocar reglas.
**Verificación:** una prueba de arquitectura de Pest en `api/tests/Architecture/` exige que `App\Domain` no use `Illuminate`,
`App\Application` ni `App\Infrastructure`.

## Artículo II — El núcleo declara sus puertos; el mundo los implementa

La capa de aplicación (`api/app/Application/`) solo conoce el dominio. Todo lo que necesita del exterior (repositorios, reloj, hash de
claves, almacenamiento de fotos, emisión de tokens) lo expresa como una **interfaz (puerto) que ella misma define**. Ningún tipo de
Laravel ni de Eloquent aparece en la firma de un puerto.

**Verificación:** una prueba de arquitectura de Pest impide que `App\Application` use `App\Infrastructure` o `Illuminate`.
Las pruebas de aplicación corren con fakes y sin tocar la base.

## Artículo III — Un único punto de composición

Un solo proveedor de servicios (`api/app/Providers/PortBindingsServiceProvider.php`) es donde un puerto se encuentra con su adaptador.
Fuera de él no se instancia infraestructura.

**Verificación:** una prueba de arquitectura comprueba que las clases de `App\Infrastructure` solo se referencian desde ese proveedor.

## Artículo IV — SOLID no es decorativo

| Principio | Aplicación concreta | Verificación |
|---|---|---|
| **SRP** | Un servicio de aplicación = un caso de uso. `RentItemsService` alquila y no hace nada más | Un servicio con dos razones para cambiar se parte |
| **OCP** | Cambiar el almacenamiento de fotos (disco → S3) no toca dominio ni aplicación | El adaptador nuevo solo añade una línea en la composición |
| **LSP** | Los fakes de prueba sustituyen al adaptador real sin cambiar expectativas | La misma prueba pasa contra el fake y el real |
| **ISP** | Puertos pequeños: `Clock`, `PasswordHasher`, `TokenIssuer`, `PhotoStorage` | Ningún implementador deja métodos sin usar |
| **DIP** | El puerto lo define quien lo consume | Las interfaces viven en `App\Application\Ports` |

## Artículo V — El esquema es propiedad de las migraciones

El repositorio `infra` levanta un motor **vacío**. Todo el DDL (tablas, índices, restricciones y la semilla de las cinco categorías)
vive en las migraciones de Laravel (`api/database/migrations/`). Ver ADR-001.

**Verificación:** `infra/` no contiene `CREATE TABLE`.

## Artículo VI — Las invariantes que la base puede imponer, la base las impone

Una regla que solo vive en código protege a la aplicación, no a los datos. Toda invariante expresable en el motor (`CHECK`, `UNIQUE`,
FK) se declara ahí. Lo que no está aplicado se marca **pendiente** en `data-model.md`; no se promete.

**Verificación:** las consultas de verificación de `data-model.md` coinciden con lo que declara el documento.

## Artículo VII — Lo derivado se calcula, no se almacena

El estado de un alquiler (`open`, `overdue`, `closed`) y los días de retraso se calculan. No hay columna para ellos.

**Verificación:** `data-model.md` no lista ninguna columna `status` ni `days_late`.

## Artículo VIII — Los valores congelados no siguen al catálogo

La línea de alquiler guarda nombre, referencia y categoría del artículo **en el instante del alquiler**. Ningún reporte los lee del
catálogo vivo.

**Verificación:** una prueba renombra un artículo después de alquilarlo y comprueba que el reporte conserva el nombre viejo (ADR-003).

## Artículo IX — Ningún secreto entra al repositorio ni a un log

Ni contraseñas, ni hashes precalculados, ni la clave del token, ni `APP_KEY`. Todo secreto viene del entorno. El `.env` real está en
`.gitignore`; solo se versiona `.env.example`. Tampoco se versiona `node_modules/` ni `vendor/`.

**Verificación:** `git ls-files | grep -E '(^|/)\.env$|node_modules|vendor'` no devuelve nada; ninguna respuesta HTTP incluye
`password` ni `password_hash`.

## Artículo X — Gana el motor

Si el documento de datos y la base discrepan, el documento está roto y se corrige el documento.

## Artículo XI — Idioma

Código, clases, métodos, variables, tablas, columnas y rutas **en inglés**. Documentación y mensajes que ve el usuario **en español**.

**Verificación:** una revisión con `grep` sobre `api/app`, `app/src` y `tool/` no encuentra identificadores en español
(`articulo`, `cliente`, `alquiler`, `asesor`, `devolucion`…); los textos en español solo aparecen en cadenas de mensajes al usuario.

## Artículo XII — Nada se da por hecho sin evidencia

Una tarea de `tasks.md` está terminada cuando su **evidencia** existe y se puede ejecutar, no cuando «ya está programada».

## Artículo XIII — Nada fuera del spec

No se construye ninguna función que no esté en `spec.md`. Una idea nueva se escribe primero en el spec o no se hace.

**Verificación:** cada ruta de la API y cada pantalla del frontend se puede rastrear a una historia (HU) de `spec.md`.
