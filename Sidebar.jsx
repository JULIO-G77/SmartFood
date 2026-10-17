/**
 * Mensaje de aviso para el usuario (éxito, error o información).
 * @param {{tipo?: 'exito'|'error'|'info', children: React.ReactNode}} props
 */
export default function Mensaje({ tipo = 'info', children }) {
  return (
    <div className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
