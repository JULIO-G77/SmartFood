jest.mock('../models', () => require('./modelos.mock'));
jest.mock('../config/database', () => ({ query: jest.fn(), QueryTypes: { SELECT: 'SELECT' } }));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const crearApp = require('./helpers/app');

const app = crearApp();

describe('Módulo Autenticación — POST /api/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rechaza correo con formato inválido (400)', async () => {
    const res = await request(app).post('/api/auth/login').send({ correo: 'no-es-correo', password: '123456' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe('Correo inválido');
  });

  test('rechaza contraseña vacía (400)', async () => {
    const res = await request(app).post('/api/auth/login').send({ correo: 'a@b.co', password: '' });
    expect(res.status).toBe(400);
  });

  test('usuario inexistente devuelve 401', async () => {
    Usuario.findOne.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ correo: 'x@b.co', password: 'abc123' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales incorrectas');
  });

  test('contraseña incorrecta devuelve 401', async () => {
    Usuario.findOne.mockResolvedValue({ id_usuario: 1, password: await bcrypt.hash('correcta', 10), rol: 'admin' });
    const res = await request(app).post('/api/auth/login').send({ correo: 'a@b.co', password: 'otra' });
    expect(res.status).toBe(401);
  });

  test('credenciales válidas devuelven JWT con rol e id', async () => {
    Usuario.findOne.mockResolvedValue({
      id_usuario: 7, nombre: 'María', correo: 'maria@smartfood.co', rol: 'estudiante',
      password: await bcrypt.hash('est123', 10), perfil: { id_estudiante: 3 }
    });
    const res = await request(app).post('/api/auth/login').send({ correo: 'maria@smartfood.co', password: 'est123' });
    expect(res.status).toBe(200);
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload).toMatchObject({ id: 7, rol: 'estudiante', id_estudiante: 3 });
    expect(res.body.usuario).not.toHaveProperty('password');
  });

  test('error interno de BD devuelve 500', async () => {
    Usuario.findOne.mockRejectedValue(new Error('BD caída'));
    const res = await request(app).post('/api/auth/login').send({ correo: 'a@b.co', password: 'x' });
    expect(res.status).toBe(500);
  });
});
