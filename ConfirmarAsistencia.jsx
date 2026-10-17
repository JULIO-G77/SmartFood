import { useEffect } from 'react';
import { Api } from '../api/api.js';
import { useCargar } from '../hooks/useCargar.js';
import Mensaje from './Mensaje.jsx';

/**
 * Lista de notificaciones. Al abrirla se marcan como leídas y se avisa al componente
 * padre para que quite el contador rojo de la campana.
 * @param {{onLeidas: () => void}} props
 */
export default function Notificaciones({ onLeidas }) {
  const { datos, cargando, error } = useCargar(Api.notificaciones);

  // Efecto: se ejecuta una sola vez, cuando la lista aparece en pantalla.
  useEffect(() => {
    Api.marcarLeidas().then(onLeidas).catch(() => {});
  }, [onLeidas]);

  if (cargando) return <p>Cargando notificaciones...</p>;
  if (error) return <Mensaje tipo="error">{error}</Mensaje>;
  return (
    <section>
      <h2>Notificaciones</h2>
      {datos.length === 0 && <Mensaje>No tienes notificaciones.</Mensaje>}
      <ul className="lista-notif">
        {datos.map((n, i) => (
          <li key={n.id_notificacion ?? i} className={n.leida ? '' : 'sin-leer'}>
            <strong>{n.titulo}</strong>
            <p>{n.mensaje}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
