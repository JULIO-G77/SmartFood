import { Api } from '../api/api.js';
import { useCargar } from '../hooks/useCargar.js';
import Mensaje from './Mensaje.jsx';
import PanelConfirmacion from './PanelConfirmacion.jsx';
import TarjetaMenu from './TarjetaMenu.jsx';

/** Pantalla "Confirmar asistencia": muestra el menú de mañana y el panel para decidir. */
export default function ConfirmarAsistencia() {
  const { datos: menu, cargando, error } = useCargar(Api.menuManana);
  return (
    <section>
      <h2>Confirmar asistencia</h2>
      <p>Confirma si vas a comer mañana en el comedor (antes de las 6:00 p.m.).</p>
      {cargando && <p>Cargando menú...</p>}
      {error && <Mensaje tipo="info">{error}</Mensaje>}
      {menu && (
        <>
          <TarjetaMenu menu={menu} titulo="Menú de mañana" />
          <PanelConfirmacion menu={menu} />
        </>
      )}
    </section>
  );
}
