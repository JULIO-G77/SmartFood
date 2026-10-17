import { useCallback, useEffect, useState } from 'react';
import { Api } from '../api/api.js';
import { ETIQUETA_ESTADO, porcentaje } from '../utils/formato.js';
import Mensaje from './Mensaje.jsx';

/**
 * Botones para confirmar o cancelar la asistencia a un menú, con el estado actual
 * y la barra de progreso de estudiantes confirmados.
 * Eventos: onClick de "Confirmar asistencia" y de "No asistiré mañana".
 * @param {{menu: object}} props - Menú de mañana (debe incluir id_menu).
 */
export default function PanelConfirmacion({ menu }) {
  const [estado, setEstado] = useState('pendiente');
  const [conteo, setConteo] = useState({ confirmados: 0, total: 0 });
  const [aviso, setAviso] = useState(null); // { tipo, texto }
  const [ocupado, setOcupado] = useState(false);

  /** Consulta el estado propio y el conteo general de confirmados. */
  const actualizar = useCallback(async () => {
    const [mio, general] = await Promise.all([Api.estadoConfirmacion(menu.id_menu), Api.conteo(menu.id_menu)]);
    setEstado(mio.estado);
    setConteo(general);
  }, [menu.id_menu]);

  useEffect(() => {
    actualizar().catch((err) => setAviso({ tipo: 'error', texto: err.message }));
  }, [actualizar]);

  /** Ejecuta una acción (confirmar o cancelar), muestra el resultado y refresca los datos. */
  async function ejecutar(accion, textoExito) {
    setOcupado(true);
    setAviso(null);
    try {
      await accion(menu.id_menu);
      setAviso({ tipo: 'exito', texto: textoExito });
      await actualizar();
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    } finally {
      setOcupado(false);
    }
  }

  const pct = porcentaje(conteo.confirmados, conteo.total);
  return (
    <div className="tarjeta">
      <p>Estado: <strong data-estado={estado}>{ETIQUETA_ESTADO[estado] ?? estado}</strong></p>
      <button type="button" className="boton boton-ancho" disabled={ocupado || estado === 'confirmado'}
        onClick={() => ejecutar(Api.confirmar, 'Tu asistencia fue registrada exitosamente')}>
        Confirmar asistencia para mañana
      </button>
      <button type="button" className="boton boton-ancho boton-claro" disabled={ocupado || estado === 'cancelado'}
        onClick={() => ejecutar(Api.cancelar, 'Tu reserva fue cancelada. Puedes volver a confirmar antes de las 6:00 p.m.')}>
        No asistiré mañana
      </button>
      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <p className="progreso-texto">Confirmados hoy: <strong>{conteo.confirmados} de {conteo.total}</strong></p>
      <div className="progreso" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progreso-barra" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
