jest.mock('../models', () => require('./modelos.mock'));
jest.mock('../config/database', () => ({ query: jest.fn(), QueryTypes: { SELECT: 'SELECT' } }));

const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const spec = yaml.load(fs.readFileSync(path.join(__dirname, '../docs/openapi.yaml'), 'utf8'));

// Rutas reales registradas en los routers de Express
const montajes = {
  '/api/auth': require('../routes/auth'),
  '/api/menu': require('../routes/menu'),
  '/api/confirmacion': require('../routes/confirmacion'),
  '/api/usuarios': require('../routes/usuarios'),
  '/api/notificaciones': require('../routes/notificaciones'),
  '/api/reportes': require('../routes/reportes')
};
const rutasReales = new Set();
for (const [prefijo, router] of Object.entries(montajes)) {
  router.stack.filter(l => l.route).forEach(l => {
    Object.keys(l.route.methods).forEach(m => {
      const ruta = (prefijo + (l.route.path === '/' ? '' : l.route.path)).replace(/:([a-z_]+)/g, '{$1}');
      rutasReales.add(`${m.toUpperCase()} ${ruta}`);
    });
  });
}
const rutasDocumentadas = new Set();
Object.entries(spec.paths).forEach(([ruta, ops]) =>
  Object.keys(ops).forEach(m => { if (ruta !== '/api/salud') rutasDocumentadas.add(`${m.toUpperCase()} ${ruta}`); }));

describe('Documentación de la API (OpenAPI)', () => {
  test('la especificación es OpenAPI 3 y tiene título y versión', () => {
    expect(spec.openapi).toMatch(/^3\./);
    expect(spec.info.title).toBe('SmartFood API');
    expect(spec.info.version).toBeTruthy();
  });

  test('todo servicio implementado en el código está documentado', () => {
    const faltantes = [...rutasReales].filter(r => !rutasDocumentadas.has(r));
    expect(faltantes).toEqual([]);
  });

  test('todo servicio documentado existe realmente en el código', () => {
    const sobrantes = [...rutasDocumentadas].filter(r => !rutasReales.has(r));
    expect(sobrantes).toEqual([]);
  });

  test('cada servicio documenta resumen, rol y al menos una respuesta de éxito', () => {
    Object.values(spec.paths).forEach(ops => Object.values(ops).forEach(o => {
      expect(o.summary).toBeTruthy();
      expect(o['x-rol']).toBeTruthy();
      expect(Object.keys(o.responses).some(c => c.startsWith('2'))).toBe(true);
    }));
  });

  test('los servicios protegidos declaran seguridad bearerAuth', () => {
    Object.entries(spec.paths).forEach(([ruta, ops]) => Object.values(ops).forEach(o => {
      if (ruta !== '/api/salud' && ruta !== '/api/auth/login') expect(o.security).toEqual([{ bearerAuth: [] }]);
    }));
  });
});

describe('Servicio de documentación — GET /api/docs', () => {
  const app = express();
  app.use('/api/docs', require('../routes/docs'));

  test('sirve la interfaz Swagger UI (HTML)', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('SmartFood API');
  });

  test('sirve la especificación en JSON', async () => {
    const res = await request(app).get('/api/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.info.title).toBe('SmartFood API');
    expect(Object.keys(res.body.paths).length).toBeGreaterThanOrEqual(20);
  });
});
