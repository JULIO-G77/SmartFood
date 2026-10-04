jest.mock('../models', () => require('./modelos.mock'));
jest.mock('../config/database', () => ({ query: jest.fn(), QueryTypes: { SELECT: 'SELECT' } }));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const { Usuario, Estudiante, Notificacion } = require('../models');
const { tokenAdmin, tokenEstudiante } = require('./helpers/mocks');
const crearApp = require('./helpers/app');

const app = crearApp();
const auth = (t) => ({ Authorization: `Bearer ${t}` });

describe('Módulo Usuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /api/usuarios: un estudiante no puede listar (403)', async () => {
    const res = await request(app).get('/api/usuarios').set(auth(tokenEstudiante()));
    expect(res.status).toBe(403);
  });

  test('GET /api/usuarios: el listado excluye el campo password', async () => {
    Usuario.findAll.mockResolvedValue([]);
    await request(app).get('/api/usuarios').set(auth(tokenAdmin()));
    expect(Usuario.findAll.mock.calls[0][0].attributes).toEqual({ exclude: ['password'] });
  });

  test('POST /api/usuarios: exige nombre, correo y contraseña', async () => {
    const res = await request(app).post('/api/usuarios').set(auth(tokenAdmin())).send({ nombre: 'X' });
    expect(res.status).toBe(400);
  });

  test('POST /api/usuarios: rechaza correo repetido', async () => {
    Usuario.findOne.mockResolvedValue({ id_usuario: 1 });
    const res = await request(app).post('/api/usuarios').set(auth(tokenAdmin()))
      .send({ nombre: 'X', correo: 'x@b.co', password: '123456' });
    expect(res.body.error).toBe('El correo ya existe');
  });

  test('POST /api/usuarios: guarda la contraseña como hash bcrypt, nunca en claro', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockResolvedValue({ id_usuario: 20 });
    const res = await request(app).post('/api/usuarios').set(auth(tokenAdmin()))
      .send({ nombre: 'Pedro', correo: 'p@b.co', password: 'secreta1', rol: 'estudiante' });
    expect(res.status).toBe(201);
    const guardado = Usuario.create.mock.calls[0][0].password;
    expect(guardado).not.toBe('secreta1');
    expect(await bcrypt.compare('secreta1', guardado)).toBe(true);
    expect(Estudiante.create).toHaveBeenCalled();
  });

  test('POST /api/usuarios: un admin nuevo no genera perfil de estudiante', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockResolvedValue({ id_usuario: 21 });
    await request(app).post('/api/usuarios').set(auth(tokenAdmin()))
      .send({ nombre: 'Ana', correo: 'a@b.co', password: 'secreta1', rol: 'admin' });
    expect(Estudiante.create).not.toHaveBeenCalled();
  });

  test('PUT /cambiar-password: rechaza contraseñas de menos de 6 caracteres', async () => {
    const res = await request(app).put('/api/usuarios/cambiar-password').set(auth(tokenEstudiante()))
      .send({ password_actual: 'x', password_nuevo: '123' });
    expect(res.status).toBe(400);
  });

  test('PUT /cambiar-password: rechaza contraseña actual incorrecta', async () => {
    Usuario.findByPk.mockResolvedValue({ password: await bcrypt.hash('buena', 10) });
    const res = await request(app).put('/api/usuarios/cambiar-password').set(auth(tokenEstudiante()))
      .send({ password_actual: 'mala', password_nuevo: 'nueva123' });
    expect(res.body.error).toBe('Contraseña actual incorrecta');
  });

  test('PUT /cambiar-password: actualiza con un hash nuevo', async () => {
    const update = jest.fn();
    Usuario.findByPk.mockResolvedValue({ password: await bcrypt.hash('buena', 10), update });
    const res = await request(app).put('/api/usuarios/cambiar-password').set(auth(tokenEstudiante()))
      .send({ password_actual: 'buena', password_nuevo: 'nueva123' });
    expect(res.status).toBe(200);
    expect(await bcrypt.compare('nueva123', update.mock.calls[0][0].password)).toBe(true);
  });

  test('DELETE /api/usuarios/:id: el admin no puede eliminarse a sí mismo', async () => {
    const res = await request(app).delete('/api/usuarios/1').set(auth(tokenAdmin()));
    expect(res.status).toBe(400);
  });

  test('DELETE /api/usuarios/:id: 404 si el usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);
    const res = await request(app).delete('/api/usuarios/55').set(auth(tokenAdmin()));
    expect(res.status).toBe(404);
  });
});

describe('Módulo Notificaciones', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /no-leidas devuelve el conteo del usuario autenticado', async () => {
    Notificacion.count.mockResolvedValue(3);
    const res = await request(app).get('/api/notificaciones/no-leidas').set(auth(tokenEstudiante()));
    expect(res.body).toEqual({ count: 3 });
    expect(Notificacion.count.mock.calls[0][0].where.id_usuario).toBe(2);
  });

  test('PUT /marcar-leidas actualiza solo las del usuario', async () => {
    const res = await request(app).put('/api/notificaciones/marcar-leidas').set(auth(tokenEstudiante()));
    expect(res.status).toBe(200);
    expect(Notificacion.update).toHaveBeenCalledWith({ leida: 1 }, { where: { id_usuario: 2, leida: 0 } });
  });

  test('POST /masiva: un estudiante no puede enviar (403)', async () => {
    const res = await request(app).post('/api/notificaciones/masiva').set(auth(tokenEstudiante())).send({});
    expect(res.status).toBe(403);
  });

  test('POST /masiva: el admin envía a todos los estudiantes activos', async () => {
    Usuario.findAll.mockResolvedValue([{ id_usuario: 2 }, { id_usuario: 3 }]);
    const res = await request(app).post('/api/notificaciones/masiva').set(auth(tokenAdmin()))
      .send({ titulo: 'Aviso', mensaje: 'Hola', destinatarios: 'estudiantes' });
    expect(res.body.mensaje).toBe('Notificación enviada a 2 usuarios');
    expect(Notificacion.bulkCreate.mock.calls[0][0]).toHaveLength(2);
  });
});
