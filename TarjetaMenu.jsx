import { useEffect, useState } from 'react';
import { Api } from '../api/api.js';
import Mensaje from './Mensaje.jsx';

const PREFERENCIAS = ['ninguna', 'vegetariano', 'vegano', 'sin-gluten'];

/** Formulario para actualizar los datos del perfil del estudiante. */
function FormularioDatos() {
  const [datos, setDatos] = useState({ nombre: '', curso: '', ciudad: '', alergias: '', preferencias: 'ninguna' });
  const [aviso, setAviso] = useState(null);

  // Carga los datos actuales del perfil al abrir la pantalla.
  useEffect(() => {
    Api.perfil().then((u) => setDatos({
      nombre: u.nombre ?? '',
      curso: u.perfil?.curso ?? '',
      ciudad: u.perfil?.ciudad ?? '',
      alergias: u.perfil?.alergias ?? '',
      preferencias: u.perfil?.preferencias ?? 'ninguna'
    })).catch((err) => setAviso({ tipo: 'error', texto: err.message }));
  }, []);

  /** Actualiza un campo del formulario (evento onChange de cada input). */
  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }));

  /** Guarda el perfil en la API (evento onSubmit). */
  async function guardar(e) {
    e.preventDefault();
    try {
      await Api.actualizarPerfil(datos);
      setAviso({ tipo: 'exito', texto: 'Perfil actualizado correctamente.' });
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    }
  }

  return (
    <form className="tarjeta" onSubmit={guardar}>
      <h3>Mis datos</h3>
      <label htmlFor="p-nombre">Nombre completo</label>
      <input id="p-nombre" value={datos.nombre} onChange={cambiar('nombre')} />
      <label htmlFor="p-ciudad">Ciudad</label>
      <input id="p-ciudad" value={datos.ciudad} onChange={cambiar('ciudad')} />
      <label htmlFor="p-alergias">Alergias</label>
      <input id="p-alergias" value={datos.alergias} onChange={cambiar('alergias')} />
      <label htmlFor="p-prefs">Preferencias</label>
      <select id="p-prefs" value={datos.preferencias} onChange={cambiar('preferencias')}>
        {PREFERENCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <button type="submit" className="boton">Guardar cambios</button>
    </form>
  );
}

/** Formulario para cambiar la contraseña (mínimo 6 caracteres, repetida dos veces). */
function FormularioPassword() {
  const [campos, setCampos] = useState({ actual: '', nueva: '', repetir: '' });
  const [aviso, setAviso] = useState(null);
  const cambiar = (campo) => (e) => setCampos((c) => ({ ...c, [campo]: e.target.value }));

  /** Valida en el navegador y, si todo está bien, envía el cambio a la API. */
  async function actualizar(e) {
    e.preventDefault();
    if (!campos.actual || !campos.nueva) return setAviso({ tipo: 'error', texto: 'Completa todos los campos' });
    if (campos.nueva.length < 6) return setAviso({ tipo: 'error', texto: 'La contraseña nueva debe tener mínimo 6 caracteres' });
    if (campos.nueva !== campos.repetir) return setAviso({ tipo: 'error', texto: 'Las nuevas contraseñas no coinciden' });
    try {
      await Api.cambiarPassword(campos.actual, campos.nueva);
      setAviso({ tipo: 'exito', texto: 'Contraseña actualizada exitosamente' });
      setCampos({ actual: '', nueva: '', repetir: '' });
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    }
  }

  return (
    <form className="tarjeta" onSubmit={actualizar}>
      <h3>Cambiar contraseña</h3>
      <label htmlFor="pw-actual">Contraseña actual</label>
      <input id="pw-actual" type="password" value={campos.actual} onChange={cambiar('actual')} />
      <label htmlFor="pw-nueva">Contraseña nueva</label>
      <input id="pw-nueva" type="password" value={campos.nueva} onChange={cambiar('nueva')} />
      <label htmlFor="pw-repetir">Repetir contraseña nueva</label>
      <input id="pw-repetir" type="password" value={campos.repetir} onChange={cambiar('repetir')} />
      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <button type="submit" className="boton">Actualizar contraseña</button>
    </form>
  );
}

/** Pantalla "Mi perfil": datos personales y cambio de contraseña. */
export default function Perfil() {
  return (
    <section>
      <h2>Mi perfil</h2>
      <FormularioDatos />
      <FormularioPassword />
    </section>
  );
}
