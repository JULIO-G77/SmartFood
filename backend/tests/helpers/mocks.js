// Mocks reutilizables de los modelos Sequelize y utilidades de prueba.
const jwt = require('jsonwebtoken');

const crearModeloFalso = () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOrCreate: jest.fn(),
  create: jest.fn(),
  bulkCreate: jest.fn(),
  update: jest.fn(),
  count: jest.fn()
});

const tokenDe = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

const tokenAdmin = () => tokenDe({ id: 1, nombre: 'Admin', rol: 'admin' });
const tokenEstudiante = () =>
  tokenDe({ id: 2, nombre: 'María', rol: 'estudiante', id_estudiante: 10 });

const fechaManana = () => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

module.exports = { crearModeloFalso, tokenDe, tokenAdmin, tokenEstudiante, fechaManana };
