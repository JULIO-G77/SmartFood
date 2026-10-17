import { Api } from '../api/api.js';
import { useCargar } from '../hooks/useCargar.js';
import { ETIQUETA_ESTADO, fechaLarga } from '../utils/formato.js';
import Mensaje from './Mensaje.jsx';

/** Tabla con las últimas confirmaciones del estudiante (la API devuelve hasta 30). */
export default function Historial() {
  const { datos, cargando, error } = useCargar(Api.historial);
  if (cargando) return <p>Cargando historial...</p>;
  if (error) return <Mensaje tipo="error">{error}</Mensaje>;
  return (
    <section>
      <h2>Mi historial</h2>
      {datos.length === 0 ? <Mensaje>Aún no has confirmado ninguna asistencia.</Mensaje> : (
        <table className="tabla">
          <thead><tr><th>Fecha</th><th>Plato principal</th><th>Estado</th></tr></thead>
          <tbody>
            {datos.map((fila) => (
              <tr key={fila.id_confirmacion}>
                <td>{fechaLarga(fila.Menu?.fecha)}</td>
                <td>{fila.Menu?.plato_principal}</td>
                <td>{ETIQUETA_ESTADO[fila.estado] ?? fila.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
