import { Api } from '../api/api.js';
import { useCargar } from '../hooks/useCargar.js';
import Mensaje from './Mensaje.jsx';
import TarjetaMenu from './TarjetaMenu.jsx';

/** Bloque que muestra un menú o el aviso de que aún no está disponible. */
function BloqueMenu({ cargando, error, menu, titulo, soloLectura }) {
  if (cargando) return <p>Cargando {titulo.toLowerCase()}...</p>;
  if (error) return <Mensaje tipo="info">{error}</Mensaje>;
  return <TarjetaMenu menu={menu} titulo={titulo} soloLectura={soloLectura} />;
}

/** Pantalla de inicio: menú de hoy (solo lectura) y menú de mañana (el que se confirma). */
export default function Inicio() {
  const hoy = useCargar(Api.menuHoy);
  const manana = useCargar(Api.menuManana);
  return (
    <section>
      <h2>Inicio</h2>
      <BloqueMenu {...hoy} menu={hoy.datos} titulo="Menú de hoy" soloLectura />
      <BloqueMenu {...manana} menu={manana.datos} titulo="Menú de mañana" />
    </section>
  );
}
