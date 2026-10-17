/* Estilos del módulo del estudiante de SmartFood (paleta verde de la marca). */
:root { --verde: #15803d; --verde-claro: #eaf7ee; --gris: #6b7280; --borde: #e5e7eb; --rojo: #dc2626; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, 'Segoe UI', Arial, sans-serif; background: #f9fafb; color: #111827; }
h1, h2, h3 { margin: 0 0 12px; }

/* Barra superior */
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #fff; border-bottom: 1px solid var(--borde); }
.marca { color: var(--verde); font-size: 20px; }
.navbar-derecha { display: flex; align-items: center; gap: 14px; }
.campana { position: relative; background: none; border: 0; font-size: 20px; cursor: pointer; }
.insignia { position: absolute; top: -6px; right: -8px; background: var(--rojo); color: #fff; border-radius: 999px; font-size: 11px; padding: 1px 6px; }

/* Estructura general */
.cuerpo { display: flex; min-height: calc(100vh - 56px); }
.sidebar { width: 210px; padding: 14px 10px; background: #fff; border-right: 1px solid var(--borde); display: flex; flex-direction: column; gap: 4px; }
.sidebar-link { text-align: left; padding: 10px 12px; border: 0; border-radius: 8px; background: none; color: var(--gris); cursor: pointer; font-size: 14px; }
.sidebar-link.activo { background: var(--verde-claro); color: var(--verde); font-weight: 600; }
.contenido { flex: 1; padding: 22px; max-width: 900px; }

/* Tarjetas y menús */
.tarjeta { background: #fff; border: 1px solid var(--borde); border-radius: 12px; padding: 16px 18px; margin-bottom: 16px; }
.tarjeta-gris { background: #f3f4f6; color: var(--gris); }
.fecha { display: inline-block; font-size: 14px; font-weight: 400; color: var(--gris); }
.fecha::first-letter { text-transform: uppercase; }
.platos { margin: 0; }
.plato { display: flex; gap: 12px; padding: 7px 0; border-bottom: 1px solid var(--borde); }
.plato dt { width: 140px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--gris); }
.plato dd { margin: 0; }

/* Formularios y botones */
label { display: block; margin: 10px 0 4px; font-size: 13px; font-weight: 600; }
input, select { width: 100%; padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 8px; font: inherit; }
.boton { margin-top: 12px; padding: 10px 16px; border: 0; border-radius: 8px; background: var(--verde); color: #fff; font-weight: 600; cursor: pointer; }
.boton:disabled { opacity: .55; cursor: not-allowed; }
.boton-claro { background: #fff; color: #111827; border: 1px solid #d1d5db; }
.boton-ancho { display: block; width: 100%; }

/* Avisos y progreso */
.mensaje { margin: 12px 0; padding: 10px 12px; border-radius: 8px; font-size: 14px; }
.mensaje-exito { background: var(--verde-claro); border: 1px solid #86efac; color: #14532d; }
.mensaje-error { background: #fee2e2; border: 1px solid #fca5a5; color: #7f1d1d; }
.mensaje-info { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; }
.progreso { height: 12px; background: var(--borde); border-radius: 999px; overflow: hidden; }
.progreso-barra { height: 100%; background: var(--verde); transition: width .4s; }
[data-estado='confirmado'] { color: var(--verde); }
[data-estado='cancelado'] { color: var(--rojo); }

/* Tabla y notificaciones */
.tabla { width: 100%; border-collapse: collapse; background: #fff; }
.tabla th, .tabla td { padding: 9px 10px; border-bottom: 1px solid var(--borde); text-align: left; font-size: 14px; }
.lista-notif { list-style: none; padding: 0; }
.lista-notif li { background: #fff; border: 1px solid var(--borde); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
.lista-notif li.sin-leer { border-left: 4px solid var(--verde); }
.lista-notif p { margin: 4px 0 0; color: var(--gris); }

/* Inicio de sesión */
.login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #14532d, #16a34a); }
.login-caja { width: 360px; background: #fff; padding: 28px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.25); }
.login-caja h1 { color: var(--verde); text-align: center; }
.login-caja h2 { text-align: center; font-size: 16px; color: var(--gris); }
.login-caja .boton { width: 100%; }

/* Celulares: el menú lateral pasa arriba */
@media (max-width: 720px) {
  .cuerpo { flex-direction: column; }
  .sidebar { width: 100%; flex-direction: row; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--borde); }
  .sidebar-link { white-space: nowrap; }
  .plato { flex-direction: column; gap: 2px; }
}
