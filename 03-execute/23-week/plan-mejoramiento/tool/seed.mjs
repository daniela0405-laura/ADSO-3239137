// T-21 — Demo data seeder for Camping Rental.
// Uses ONLY the public API (docs/api-contract.md). Never touches the database directly.
// Run: node seed.mjs   (Node 18+, no dependencies)

import { readFileSync, existsSync } from 'node:fs';

loadDotEnv('.env');

const API_URL = process.env.API_URL ?? 'http://localhost:8000/api/v1';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const CATEGORY_IDS = {
  tents: '11111111-1111-4111-8111-111111111111',
  sleeping: '22222222-2222-4222-8222-222222222222',
  cooking: '33333333-3333-4333-8333-333333333333',
  lighting: '44444444-4444-4444-8444-444444444444',
  backpacks: '55555555-5555-4555-8555-555555555555',
};

const ITEM_TEMPLATES = {
  tents: { prefix: 'CAR', names: ['Carpa iglú 2 personas', 'Carpa iglú 4 personas', 'Carpa familiar 6 personas', 'Carpa ultraligera', 'Carpa de playa', 'Carpa túnel 3 personas', 'Toldo impermeable', 'Carpa de expedición'] },
  sleeping: { prefix: 'DOR', names: ['Saco de dormir 0 °C', 'Saco de dormir 10 °C', 'Saco de dormir infantil', 'Colchoneta inflable', 'Aislante de espuma', 'Almohada inflable', 'Hamaca con mosquitero', 'Sábana térmica'] },
  cooking: { prefix: 'COC', names: ['Estufa de un fogón', 'Estufa de dos fogones', 'Olla de aluminio', 'Kit de cubiertos', 'Termo de 1 litro', 'Nevera portátil', 'Parrilla plegable', 'Filtro de agua'] },
  lighting: { prefix: 'ILU', names: ['Linterna frontal', 'Linterna de mano', 'Lámpara de campaña LED', 'Farol solar', 'Guirnalda de luces', 'Linterna recargable', 'Bengala de señales', 'Lámpara de gas'] },
  backpacks: { prefix: 'MOC', names: ['Mochila 30 litros', 'Mochila 50 litros', 'Mochila 70 litros', 'Mochila de hidratación', 'Mochila infantil', 'Bolsa estanca 20 litros', 'Cubre mochila', 'Riñonera de trekking'] },
};

const CUSTOMERS = [
  ['Ana María Gómez', '1001001001'], ['Carlos Pérez', '1001001002'], ['Luisa Fernanda Ruiz', '1001001003'],
  ['Jorge Castillo', '1001001004'], ['Sofía Herrera', '1001001005'], ['Andrés Morales', '1001001006'],
  ['Valentina Rojas', '1001001007'], ['Felipe Vargas', '1001001008'], ['Camila Torres', '1001001009'],
  ['Mateo Jiménez', '1001001010'],
];

let token = null;

async function main() {
  if (!ADMIN_PASSWORD) {
    fail('Falta ADMIN_PASSWORD. Defínela en tool/.env o en la terminal.');
  }

  await checkHealth();
  await login();
  await createAdvisor();
  const itemIds = await createItems();
  const customerIds = await createCustomers();
  const rentals = await createRentals(customerIds, itemIds);
  await returnSomeLines(rentals);

  console.log('\nListo: datos de demostración cargados.');
}

async function checkHealth() {
  const res = await fetch(`${API_URL}/health`).catch(() => null);
  if (!res || !res.ok) fail(`La API no responde en ${API_URL}. ¿Está corriendo docker compose?`);
  console.log('✔ API disponible');
}

async function login() {
  const data = await request('POST', '/auth/login', { username: ADMIN_USERNAME, password: ADMIN_PASSWORD }, { auth: false });
  token = data.access_token;
  console.log(`✔ Sesión iniciada como ${ADMIN_USERNAME}`);
}

async function createAdvisor() {
  const result = await request('POST', '/users', { username: 'asesor.demo', password: 'Demo-Camping-2026', role: 'advisor' }, { allowConflict: true });
  console.log(result ? '✔ Asesor de demostración creado (asesor.demo)' : '• El asesor de demostración ya existía');
}

async function createItems() {
  const ids = [];
  for (const [key, template] of Object.entries(ITEM_TEMPLATES)) {
    for (const [index, name] of template.names.entries()) {
      const reference = `${template.prefix}-${String(index + 1).padStart(4, '0')}`;
      const item = await request('POST', '/items', {
        name,
        description: `${name} para alquiler`,
        reference,
        category_id: CATEGORY_IDS[key],
        total_units: 1 + (index % 4),
      }, { allowConflict: true });
      if (item) ids.push(item.id);
    }
  }
  if (ids.length === 0) ids.push(...(await listAllItemIds()));
  console.log(`✔ Artículos disponibles para alquilar: ${ids.length}`);
  return ids;
}

async function createCustomers() {
  const ids = [];
  for (const [fullName, documentNumber] of CUSTOMERS) {
    const customer = await request('POST', '/customers', { full_name: fullName, document_number: documentNumber }, { allowConflict: true });
    if (customer) ids.push(customer.id);
  }
  if (ids.length === 0) {
    const page = await request('GET', '/customers?page=1&size=50');
    ids.push(...page.items.map((c) => c.id));
  }
  console.log(`✔ Clientes: ${ids.length}`);
  return ids;
}

async function createRentals(customerIds, itemIds) {
  const rentals = [];
  let cursor = 0;
  for (let i = 0; i < 15; i++) {
    const customerId = customerIds[i % customerIds.length];
    const lineCount = 1 + (i % 3);
    const items = [];
    for (let j = 0; j < lineCount; j++) {
      items.push({ item_id: itemIds[cursor % itemIds.length] });
      cursor++;
    }
    const rental = await request('POST', '/rentals', { customer_id: customerId, items }, { allowConflict: true, allowValidation: true });
    if (rental) rentals.push(rental);
  }
  console.log(`✔ Alquileres registrados: ${rentals.length}`);
  return rentals;
}

async function returnSomeLines(rentals) {
  let returned = 0;
  for (const rental of rentals.slice(0, 5)) {
    const line = rental.items[0];
    const ok = await request('POST', `/rentals/${rental.id}/items/${line.id}/return`, null, { allowConflict: true });
    if (ok) returned++;
  }
  console.log(`✔ Líneas devueltas: ${returned}`);
}

async function listAllItemIds() {
  const page = await request('GET', '/items?page=1&size=50');
  return page.items.map((item) => item.id);
}

async function request(method, path, body, options = {}) {
  const { auth = true, allowConflict = false, allowValidation = false } = options;
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (res.ok) return res.status === 204 ? true : res.json();

  const error = await res.json().catch(() => ({}));
  if ((res.status === 409 && allowConflict) || (res.status === 422 && allowValidation)) {
    console.log(`  • ${method} ${path}: ${error.message ?? res.status} (se omite)`);
    return null;
  }
  fail(`${method} ${path} respondió ${res.status}: ${error.message ?? 'sin mensaje'}`);
}

function loadDotEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

main().catch((error) => fail(error.message));
