import { Api } from '../api/api.js';
import { useCargar } from '../hooks/useCargar.js';
import Mensaje from './Mensaje.jsx';
import TarjetaMenu from './TarjetaMenu.jsx';

/** Lista los menús de lunes a viernes de la semana actual. */
export default function MenuSemanal() {
  const { datos, cargando, error } = useCargar(Api.menuSemana);
  if (cargando) return <p>Cargando menú semanal...</p>;
  if (error) return <Mensaje tipo="error">{error}</Mensaje>;
  return (
    <section>
      <h2>Menú semanal</h2>
      {datos.length === 0 && <Mensaje>Todavía no hay menús publicados para esta semana.</Mensaje>}
      {datos.map((menu) => <TarjetaMenu key={menu.id_menu} menu={menu} titulo="Menú" />)}
    </section>
  );
}
