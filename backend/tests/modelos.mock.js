// jest.mock exige que las variables empiecen por "mock"
const { crearModeloFalso } = require('./helpers/mocks');
module.exports = {
  Usuario: crearModeloFalso(),
  Estudiante: crearModeloFalso(),
  Menu: crearModeloFalso(),
  Confirmacion: crearModeloFalso(),
  Notificacion: crearModeloFalso()
};
