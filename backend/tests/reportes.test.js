jest.mock('../models', () => require('./modelos.mock'));
jest.mock('../config/database', () => ({ query: jest.fn(), QueryTypes: { SELECT: 'SELECT' } }));

const request = require('supertest');
const sequelize = require('../config/database');
const { Menu, Estudiante, Confirmacion } = require('../models');
const { tokenAdmin, tokenEstudiante } = require('./helpers/mocks');
const crearApp = require('./helpers/app');

const app = crearApp();
const auth = (t) => ({ Authorization: `Bearer ${t}` });

describe('Módulo Reportes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /estadisticas: un estudiante recibe 403', async () => {
    const res = await request(app).get('/api/reportes/estadisticas').set(auth(tokenEstudiante()));
    expect(res.status).toBe(403);
  });

  test('GET /estadisticas: calcula porcentaje de asistencia y pendientes', async () => {
    Menu.findOne.mockResolvedValue({ id_menu: 1 });
    Estudiante.count.mockResolvedValue(20);
    Confirmacion.count.mockResolvedValueOnce(15).mockResolvedValueOnce(2);
    sequelize.query.mockResolvedValue([]);
    const res = await request(app).get('/api/reportes/estadisticas').set(auth(tokenAdmin()));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ totalEstudiantes: 20, confirmadosHoy: 15, canceladosHoy: 2, pendientesHoy: 3, porcentajeAsistencia: 75 });
  });

  test('GET /estadisticas: sin estudiantes no divide por cero', async () => {
    Menu.findOne.mockResolvedValue(null);
    Estudiante.count.mockResolvedValue(0);
    sequelize.query.mockResolvedValue([]);
    const res = await request(app).get('/api/reportes/estadisticas').set(auth(tokenAdmin()));
    expect(res.body.porcentajeAsistencia).toBe(0);
  });

  test('GET /semanal devuelve el resumen de la semana (admin)', async () => {
    sequelize.query.mockResolvedValue([{ fecha: '2026-06-23', confirmados: 10, cancelados: 1 }]);
    const res = await request(app).get('/api/reportes/semanal').set(auth(tokenAdmin()));
    expect(res.status).toBe(200);
    expect(res.body[0].confirmados).toBe(10);
  });

  test('GET /semanal: error de BD devuelve 500', async () => {
    sequelize.query.mockRejectedValue(new Error('fallo'));
    const res = await request(app).get('/api/reportes/semanal').set(auth(tokenAdmin()));
    expect(res.status).toBe(500);
  });
});
