import { useCallback, useEffect, useState } from 'react';
import { Api, borrarSesion, leerUsuario } from './api/api.js';
import LoginForm from './components/LoginForm.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Inicio from './components/Inicio.jsx';
import MenuSemanal from './components/MenuSemanal.jsx';
import ConfirmarAsistencia from './components/ConfirmarAsistencia.jsx';
import Historial from './components/Historial.jsx';
import Notificaciones from './components/Notificaciones.jsx';
import Perfil from './components/Perfil.jsx';

/**
 * Componente raíz del módulo del estudiante.
 * Guarda en su estado la sesión, la vista activa y el contador de notificaciones,
 * y se los pasa a los componentes hijos mediante props.
 */
export default function App() {
  const [usuario, setUsuario] = useState(leerUsuario);
  const [vista, setVista] = useState('inicio');
  const [noLeidas, setNoLeidas] = useState(0);

  // Al iniciar sesión, consulta cuántas notificaciones nuevas tiene el estudiante.
  useEffect(() => {
    if (usuario) Api.noLeidas().then((r) => setNoLeidas(r.count)).catch(() => {});
  }, [usuario]);

  /** Cierra la sesión y vuelve al formulario de ingreso. */
  const salir = () => { borrarSesion(); setUsuario(null); setVista('inicio'); setNoLeidas(0); };
  /** Se llama cuando el estudiante abre las notificaciones: el contador vuelve a cero. */
  const alLeerNotificaciones = useCallback(() => setNoLeidas(0), []);

  if (!usuario) return <LoginForm onIngreso={setUsuario} />;

  // Tabla de vistas: evita un if/else largo y facilita agregar pantallas nuevas.
  const pantallas = {
    inicio: <Inicio />,
    semana: <MenuSemanal />,
    confirmar: <ConfirmarAsistencia />,
    historial: <Historial />,
    notificaciones: <Notificaciones onLeidas={alLeerNotificaciones} />,
    perfil: <Perfil />
  };

  return (
    <div className="app">
      <Navbar usuario={usuario} noLeidas={noLeidas} onCampana={() => setVista('notificaciones')} onSalir={salir} />
      <div className="cuerpo">
        <Sidebar vista={vista} onCambiar={setVista} />
        <main className="contenido">{pantallas[vista]}</main>
      </div>
    </div>
  );
}
