/** Opciones del menú lateral del estudiante: identificador de la vista y texto visible. */
export const OPCIONES = [
  ['inicio', 'Inicio'],
  ['semana', 'Menú semanal'],
  ['confirmar', 'Confirmar asistencia'],
  ['historial', 'Mi historial'],
  ['notificaciones', 'Notificaciones'],
  ['perfil', 'Mi perfil']
];

/**
 * Menú lateral de navegación.
 * @param {{vista: string, onCambiar: (vista: string) => void}} props
 */
export default function Sidebar({ vista, onCambiar }) {
  return (
    <nav className="sidebar" aria-label="Menú principal">
      {OPCIONES.map(([id, texto]) => (
        <button
          key={id}
          type="button"
          className={`sidebar-link ${vista === id ? 'activo' : ''}`}
          aria-current={vista === id ? 'page' : undefined}
          onClick={() => onCambiar(id)}
        >
          {texto}
        </button>
      ))}
    </nav>
  );
}
