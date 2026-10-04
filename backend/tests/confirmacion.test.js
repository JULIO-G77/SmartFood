jest.mock('../models', () => require('./modelos.mock'));
jest.mock('../config/database', () => ({ query: jest.fn(), QueryTypes: { SELECT: 'SELECT' } }));

const request = require('supertest');
const { Confirmacion, Menu, Estudiante, Notificacion } = require('../models');
const { tokenAdmin, tokenEstudiante, fechaManana } = require('./helpers/mocks');
const crearApp = require('./helpers/app');

const app = crearApp();
const auth = (t) => ({ Authorization: `Bearer ${t}` });

describe('Módulo Confirmación de asistencia', () => {
  beforeEach(() => jest.clearAllMocks());

  test('POST /api/confirmacion: un admin no puede confirmar (400)', async () => {
    const res = await request(app).post('/api/confirmacion').set(auth(tokenAdmin())).send({ id_menu: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Solo estudiantes pueden confirmar');
  });

  test('POST /api/confirmacion: menú inexistente devuelve 404', async () => {
    Menu.findByPk.mockResolvedValue(null);
    const res = await request(app).post('/api/confirmacion').set(auth(tokenEstudiante())).send({ id_menu: 99 });
    expect(res.status).toBe(404);
  });

  test('POST /api/confirmacion: crea la confirmación y notifica', async () => {
    Menu.findByPk.mockResolvedValue({ id_menu: 1, fecha: fechaManana() });
    Confirmacion.findOrCreate.mockResolvedValue([{ estado: 'confirmado' }, true]);
    const res = await request(app).post('/api/confirmacion').set(auth(tokenEstudiante())).send({ id_menu: 1 });
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe('Asistencia confirmada');
    expect(Notificacion.create).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'confirmacion', id_usuario: 2 }));
  });

  test('POST /api/confirmacion: si ya existía cancelada, la reactiva', async () => {
    const update = jest.fn();
    Menu.findByPk.mockResolvedValue({ id_menu: 1, fecha: fechaManana() });
    Confirmacion.findOrCreate.mockResolvedValue([{ estado: 'cancelado', update }, false]);
    await request(app).post('/api/confirmacion').set(auth(tokenEstudiante())).send({ id_menu: 1 });
    expect(update).toHaveBeenCalledWith({ estado: 'confirmado' });
  });

  test('DELETE /api/confirmacion/:id_menu cancela la asistencia', async () => {
    const update = jest.fn();
    Confirmacion.findOne.mockResolvedValue({ update });
    const res = await request(app).delete('/api/confirmacion/1').set(auth(tokenEstudiante()));
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ estado: 'cancelado' });
  });

  test('DELETE /api/confirmacion/:id_menu devuelve 404 si no hay confirmación', async () => {
    Confirmacion.findOne.mockResolvedValue(null);
    const res = await request(app).delete('/api/confirmacion/1').set(auth(tokenEstudiante()));
    expect(res.status).toBe(404);
  });

  test('GET /mi-estado devuelve "pendiente" cuando no hay registro', async () => {
    Confirmacion.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/confirmacion/mi-estado/1').set(auth(tokenEstudiante()));
    expect(res.body.estado).toBe('pendiente');
  });

  test('GET /conteo calcula pendientes = total - confirmados - cancelados', async () => {
    Confirmacion.count.mockResolvedValueOnce(6).mockResolvedValueOnce(2);
    Estudiante.count.mockResolvedValue(10);
    const res = await request(app).get('/api/confirmacion/conteo/1').set(auth(tokenEstudiante()));
    expect(res.body).toEqual({ confirmados: 6, cancelados: 2, pendientes: 2, total: 10 });
  });

  test('GET /todas: un estudiante recibe 403', async () => {
    const res = await request(app).get('/api/confirmacion/todas').set(auth(tokenEstudiante()));
    expect(res.status).toBe(403);
  });

  test('GET /todas: el admin recibe lista vacía si no hay menú de mañana', async () => {
    Menu.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/confirmacion/todas').set(auth(tokenAdmin()));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /todas: usa la fecha de mañana por defecto', async () => {
    Menu.findOne.mockResolvedValue({ id_menu: 4 });
    Confirmacion.findAll.mockResolvedValue([{ id_confirmacion: 1 }]);
    await request(app).get('/api/confirmacion/todas').set(auth(tokenAdmin()));
    expect(Menu.findOne.mock.calls[0][0].where.fecha).toBe(fechaManana());
  });
});
