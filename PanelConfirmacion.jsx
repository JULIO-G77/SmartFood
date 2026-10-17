import { useState } from 'react';
import { Api, guardarSesion } from '../api/api.js';
import Mensaje from './Mensaje.jsx';

/**
 * Formulario de inicio de sesión.
 * Evento principal: onSubmit del formulario (evita recargar la página con preventDefault).
 * @param {{onIngreso: (usuario: object) => void}} props - Se llama cuando el ingreso es correcto.
 */
export default function LoginForm({ onIngreso }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  /** Envía las credenciales a la API y guarda la sesión si son correctas. */
  async function manejarEnvio(evento) {
    evento.preventDefault();
    if (!correo || !password) {
      setError('Escribe tu correo y tu contraseña');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const { token, usuario } = await Api.login(correo, password);
      guardarSesion(token, usuario);
      onIngreso(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <form className="login-caja" onSubmit={manejarEnvio} noValidate>
        <h1>SmartFood</h1>
        <h2>Iniciar sesión</h2>
        <label htmlFor="correo">Correo electrónico</label>
        <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="username" />
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <Mensaje tipo="error">{error}</Mensaje>}
        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}
