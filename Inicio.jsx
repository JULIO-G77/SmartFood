/**
 * Barra superior: marca, campana de notificaciones con contador, nombre y botón Salir.
 * @param {{usuario: object, noLeidas: number, onCampana: () => void, onSalir: () => void}} props
 */
export default function Navbar({ usuario, noLeidas, onCampana, onSalir }) {
  return (
    <header className="navbar">
      <strong className="marca">SmartFood</strong>
      <div className="navbar-derecha">
        <button type="button" className="campana" onClick={onCampana} aria-label={`Notificaciones: ${noLeidas} sin leer`}>
          🔔{noLeidas > 0 && <span className="insignia">{noLeidas}</span>}
        </button>
        <span className="nombre">{usuario.nombre}</span>
        <button type="button" className="boton boton-claro" onClick={onSalir}>Salir</button>
      </div>
    </header>
  );
}
