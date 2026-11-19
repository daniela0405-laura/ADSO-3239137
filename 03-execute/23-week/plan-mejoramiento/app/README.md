# app — Frontend en React

Pantallas de operación de Camping Rental (tarea T-22): inicio de sesión, catálogo de artículos, registrar
alquiler, artículos vencidos y reporte de más solicitados.

- React 18 + Vite + React Router. Pruebas con Vitest y Testing Library.
- Componentes, funciones y variables en inglés; textos visibles en español (artículo XI).
- Solo habla con la API por `src/api/client.js`; muestra el `message` del cuerpo de error único del contrato.

## Cómo correrlo

```bash
cd app
cp .env.example .env
npm install
npm run dev        # http://localhost:5173
npm test
```

## Pantallas

| Ruta | Pantalla | Historia | Rol |
|---|---|---|---|
| `/login` | Inicio de sesión | HU-01 | público |
| `/items` | Catálogo de artículos | HU-04 | admin, advisor |
| `/rentals/new` | Registrar alquiler | HU-06 | admin, advisor |
| `/overdue` | Artículos vencidos | HU-09 | admin, advisor |
| `/report` | Más solicitados | HU-10 | admin |
