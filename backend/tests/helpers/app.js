// Construye una app Express solo con las rutas, sin conectarse a MySQL.
const express = require('express');

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth',           require('../../routes/auth'));
  app.use('/api/menu',           require('../../routes/menu'));
  app.use('/api/confirmacion',   require('../../routes/confirmacion'));
  app.use('/api/usuarios',       require('../../routes/usuarios'));
  app.use('/api/notificaciones', require('../../routes/notificaciones'));
  app.use('/api/reportes',       require('../../routes/reportes'));
  return app;
};
