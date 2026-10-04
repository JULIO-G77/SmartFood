const jwt = require('jsonwebtoken');
const { verificarToken, soloAdmin, soloEstudiante } = require('../middleware/auth');
const { tokenAdmin } = require('./helpers/mocks');

const resFalso = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Seguridad — middleware JWT y roles', () => {
  test('verificarToken sin token responde 401', () => {
    const res = resFalso(); const next = jest.fn();
    verificarToken({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('verificarToken con token falso responde 403', () => {
    const res = resFalso(); const next = jest.fn();
    verificarToken({ headers: { authorization: 'Bearer basura' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('verificarToken con token expirado responde 403', () => {
    const vencido = jwt.sign({ id: 1, rol: 'admin' }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res = resFalso(); const next = jest.fn();
    verificarToken({ headers: { authorization: `Bearer ${vencido}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('verificarToken válido llena req.usuario y llama next()', () => {
    const req = { headers: { authorization: `Bearer ${tokenAdmin()}` } };
    const res = resFalso(); const next = jest.fn();
    verificarToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.usuario.rol).toBe('admin');
  });

  test('soloAdmin bloquea a un estudiante (403)', () => {
    const res = resFalso(); const next = jest.fn();
    soloAdmin({ usuario: { rol: 'estudiante' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('soloAdmin deja pasar a un admin', () => {
    const next = jest.fn();
    soloAdmin({ usuario: { rol: 'admin' } }, resFalso(), next);
    expect(next).toHaveBeenCalled();
  });

  test('soloEstudiante bloquea a un admin (403)', () => {
    const res = resFalso(); const next = jest.fn();
    soloEstudiante({ usuario: { rol: 'admin' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
