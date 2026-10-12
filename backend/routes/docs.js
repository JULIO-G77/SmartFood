// Documentación interactiva de la API (Swagger UI) — GET /api/docs
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

let spec = null;
try {
  spec = yaml.load(fs.readFileSync(path.join(__dirname, '../docs/openapi.yaml'), 'utf8'));
} catch (e) {
  console.error('⚠️  No se pudo cargar docs/openapi.yaml:', e.message);
}

if (spec) {
  // Especificación en crudo (útil para Postman, Insomnia, etc.)
  router.get('/openapi.json', (req, res) => res.json(spec));
  router.use('/', swaggerUi.serve, swaggerUi.setup(spec, { customSiteTitle: 'SmartFood API - Documentación' }));
} else {
  router.use('/', (req, res) => res.status(503).json({ error: 'Documentación no disponible' }));
}

module.exports = router;
