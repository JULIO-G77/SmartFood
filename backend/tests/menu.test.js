jest.mock('../models', () => require('./modelos.mock'));
jest.mock('../config/database', () => ({ query: jest.fn(), QueryTypes: { SELECT: 'SELECT' } }));

const request = require('supertest');
const { Menu } = require('../models');
const { tokenAdmin, tokenEstudiante, fechaManana } = require('./helpers/mocks');
const crearApp = require('./helpers/app');

const app = crearApp();
const auth = (t) => ({ Authorization: `Bearer ${t}` });
const menuValido = (fecha) => ({ fecha, entrada: 'Sopa', plato_principal: 'Arroz', bebida: 'Jugo', postre: 'Fruta' });

describe('Módulo Menú', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /api/menu exige autenticación (401)', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(401);
  });

  test('GET /api/menu devuelve el menú de mañana', async () => {
    Menu.findOne.mockResolvedValue({ id_menu: 1, fecha: fechaManana() });
    const res = await request(app).get('/api/menu').set(auth(tokenEstudiante()));
    expect(res.status).toBe(200);
    expect(Menu.findOne.mock.calls[0][0].where.fecha).toBe(fechaManana());
  });

  test('GET /api/menu responde 404 si no hay menú', async () => {
    Menu.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/menu').set(auth(tokenEstudiante()));
    expect(res.status).toBe(404);
  });

  test('GET /api/menu/hoy responde 404 si no hay menú de hoy', async () => {
    Menu.findOne.mockResolvedValue(null);
    const res = await request(app).get('/api/menu/hoy').set(auth(tokenEstudiante()));
    expect(res.status).toBe(404);
  });

  test('GET /api/menu/semana devuelve la lista de menús', async () => {
    Menu.findAll.mockResolvedValue([{ id_menu: 1 }, { id_menu: 2 }]);
    const res = await request(app).get('/api/menu/semana').set(auth(tokenEstudiante()));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('POST /api/menu: un estudiante no puede crear menús (403)', async () => {
    const res = await request(app).post('/api/menu').set(auth(tokenEstudiante())).send(menuValido(fechaManana()));
    expect(res.status).toBe(403);
  });

  test('POST /api/menu: campos incompletos devuelven 400', async () => {
    const res = await request(app).post('/api/menu').set(auth(tokenAdmin())).send({ fecha: fechaManana() });
    expect(res.status).toBe(400);
  });

  test('POST /api/menu: rechaza fechas de hoy o pasadas', async () => {
    const res = await request(app).post('/api/menu').set(auth(tokenAdmin())).send(menuValido('2020-01-01'));
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/fecha mínima/);
  });

  test('POST /api/menu: rechaza fecha duplicada', async () => {
    Menu.findOne.mockResolvedValue({ id_menu: 5 });
    const res = await request(app).post('/api/menu').set(auth(tokenAdmin())).send(menuValido(fechaManana()));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Ya existe un menú para esa fecha');
  });

  test('POST /api/menu: el admin crea un menú válido (201)', async () => {
    Menu.findOne.mockResolvedValue(null);
    Menu.create.mockResolvedValue({ id_menu: 9, ...menuValido(fechaManana()) });
    const res = await request(app).post('/api/menu').set(auth(tokenAdmin())).send(menuValido(fechaManana()));
    expect(res.status).toBe(201);
    expect(Menu.create).toHaveBeenCalledWith(expect.objectContaining({ creado_por: 1 }));
  });

  test('PUT /api/menu/:id responde 404 si el menú no existe', async () => {
    Menu.findByPk.mockResolvedValue(null);
    const res = await request(app).put('/api/menu/99').set(auth(tokenAdmin())).send({ entrada: 'X' });
    expect(res.status).toBe(404);
  });

  test('DELETE /api/menu/:id elimina el menú (admin)', async () => {
    const destroy = jest.fn();
    Menu.findByPk.mockResolvedValue({ destroy });
    const res = await request(app).delete('/api/menu/3').set(auth(tokenAdmin()));
    expect(res.status).toBe(200);
    expect(destroy).toHaveBeenCalled();
  });
});
