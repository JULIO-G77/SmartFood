# INFORME TÉCNICO
## Estándares de Codificación — Sistema SmartFood

---

**Proyecto:** Sistema de gestión del comedor escolar SmartFood
**Institución:** I.E. Normal Superior Montes de María — San Juan de Nepomuceno, Bolívar
**Autor(es):** [Nombre del estudiante]
**Asignatura:** [Componente formativo / Programación]
**Fecha:** [Fecha de entrega]

---

## 1. INTRODUCCIÓN

SmartFood es una plataforma web que permite a los estudiantes de la I.E. Normal Superior
Montes de María confirmar anticipadamente si asistirán al comedor escolar, con el fin de
reducir el desperdicio de alimentos y optimizar la compra de insumos.

El sistema está compuesto por un **frontend** (HTML, CSS y JavaScript) que se comunica con
una **API REST** construida en Node.js con Express, y una base de datos **MySQL** manejada a
través del ORM Sequelize.

Todo software necesita reglas claras y uniformes para que el código sea legible,
mantenible y escalable. Este documento define el **estándar de codificación** adoptado
durante el desarrollo de SmartFood, para que cualquier desarrollador que continúe el
proyecto pueda leer, modificar y extender el código de forma consistente.

Los estándares descritos aquí se aplican a: nombramiento de variables, declaración de
clases, declaración de métodos/funciones, estructura de archivos, rutas de la API,
esquema de la base de datos, manejo de errores, seguridad y control de versiones.

---

## 2. OBJETIVO

Establecer y documentar las normas de programación utilizadas en el desarrollo del
sistema SmartFood, con el propósito de:

1. Garantizar **uniformidad y legibilidad** en todo el código fuente.
2. Facilitar el **mantenimiento** y la corrección de errores (bugs).
3. Permitir que **nuevos desarrolladores** se integren al proyecto rápidamente.
4. Reducir los errores causados por una mala convención de nombres.
5. Mantener la **seguridad** de la información (contraseñas, tokens, datos de estudiantes).
6. Servir de guía de referencia para futuras fases del proyecto.

---

## 3. ESTÁNDARES DE CODIFICACIÓN

### 3.1 Convenciones generales

| Regla | Norma | Ejemplo |
|-------|-------|---------|
| Idioma | Todos los nombres, mensajes y comentarios en **español** | `verificarToken`, `crearMenu` |
| Codificación de caracteres | UTF-8 en todos los archivos | — |
| Indentación | 2 espacios por nivel | `if (x) {` |
| Comillas | Comillas simples en JavaScript (`'`), dobles en HTML (`"`) | `const rol = 'admin';` |
| Punto y coma | Obligatorio al final de cada sentencia | `const menu = await Menu.findByPk(id);` |
| Máximo de línea | Preferiblemente menor a 100 caracteres | — |

### 3.2 Nombramiento de variables

**Regla general:** se usa **camelCase** (primera letra minúscula y cada palabra siguiente
con mayúscula inicial) para variables y constantes locales.

| Tipo de dato | Convención | Ejemplo correcto | Ejemplo incorrecto |
|--------------|------------|------------------|--------------------|
| Variable local | camelCase | `const fecha = ...` | `const fecha_menu = ...` |
| Constante de alcance global | UPPER_SNAKE_CASE | `const API_URL = '/api';` | `const apiUrl = '/api';` |
| Booleano | Prefijo que sugiera pregunta: `es`, `tiene`, `puede`, `esta` | `const esAdmin = true;` | `const admin = true;` |
| Colección/arreglo | Sustantivo en plural | `const menus = [...]` | `const menu = [...]` |
| Elemento de desestructuración | Nombre que coincida con el campo | `const { fecha, entrada } = req.body;` | `const x = req.body.fecha;` |

**Ejemplo real del proyecto:**

```js
const manana = new Date();
manana.setDate(manana.getDate() + 1);
const fecha = manana.toISOString().split('T')[0];
const menu = await Menu.findOne({ where: { fecha, activo: 1 } });
```

### 3.3 Declaración de clases

**Regla general:** las clases (modelos de datos) se nombran con **PascalCase** (cada
palabra con mayúscula inicial, sin separadores).

| Componente | Convención | Ejemplo |
|-----------|------------|---------|
| Nombre de clase | PascalCase, sustantivo singular | `Usuario`, `Menu`, `Confirmacion`, `Notificacion` |
| Archivo de la clase | Nombre de la clase + `.js` | `Menu.js`, `Usuario.js` |
| Nombre de la tabla | minúsculas en plural | `usuarios`, `menus` |
| Llave primaria | `id_` + nombre de la tabla en singular | `id_usuario`, `id_menu` |

**Ejemplo real del proyecto (backend/models/Menu.js):**

```js
const Menu = sequelize.define('Menu', {
  id_menu:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha:          { type: DataTypes.DATEONLY, allowNull: false, unique: true },
  entrada:        { type: DataTypes.STRING(150), allowNull: false },
  plato_principal:{ type: DataTypes.STRING(150), allowNull: false },
  bebida:         { type: DataTypes.STRING(100), allowNull: false },
  postre:         { type: DataTypes.STRING(100), allowNull: false },
  activo:         { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'menus', timestamps: true, createdAt: 'fecha_creacion', updatedAt: false });
```

### 3.4 Declaración de métodos y funciones

**Regla general:** las funciones se nombran con **camelCase**, empezando con un **verbo**
en infinitivo que describa la acción realizada.

| Tipo de función | Convención | Ejemplo |
|----------------|------------|---------|
| Función de acción | Verbo + sustantivo | `cargarDashboard()`, `verificarToken()`, `exportarCSV()` |
| Verificador | `verificar` / `validar` | `verificarToken()` |
| Middleware de autorización | Prefijo `solo` + rol | `soloAdmin()`, `soloEstudiante()` |
| Método privado (no expuesto) | Prefijo `_` | `_headers()`, `_fetch()` |
| Función asíncrona | `async` + `await` para promesas | `async function cargarUsuarios()` |
| Callback | Arrow function | `(u) => u.nombre.toLowerCase()` |

**Ejemplo real del proyecto (backend/middleware/auth.js):**

```js
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (e) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
```

### 3.5 Nombramiento de archivos y carpetas

| Capa | Convención | Ejemplos |
|------|-----------|----------|
| Modelos (backend/models) | PascalCase | `Usuario.js`, `Confirmacion.js` |
| Rutas (backend/routes) | minúsculas | `auth.js`, `menu.js`, `reportes.js` |
| Middleware (backend/middleware) | minúsculas | `auth.js` |
| Configuración (backend/config) | minúsculas | `database.js` |
| JS del frontend (frontend/js) | minúsculas | `api.js`, `app.js`, `admin.js`, `utils.js` |
| CSS (frontend/css) | minúsculas | `styles.css` |
| Página principal | fija | `index.html` |

### 3.6 Rutas de la API REST

**Regla general:** uso de sustantivos en plural y verbos HTTP con significado semántico
(`GET` lee, `POST` crea, `PUT` actualiza, `DELETE` elimina).

| Método HTTP | Ruta | Función | Acceso |
|-------------|------|---------|--------|
| POST | `/api/auth/login` | Iniciar sesión | Público |
| GET | `/api/menu/hoy` | Menú de hoy (solo lectura) | Usuario autenticado |
| GET | `/api/menu` | Menú de mañana (para confirmar) | Usuario autenticado |
| GET | `/api/menu/semana` | Menú semanal | Usuario autenticado |
| POST | `/api/menu` | Crear menú | Admin |
| PUT | `/api/menu/:id` | Editar menú | Admin |
| DELETE | `/api/menu/:id` | Eliminar menú | Admin |
| POST | `/api/confirmacion` | Confirmar asistencia | Estudiante |
| GET | `/api/confirmacion/historial` | Historial del estudiante | Estudiante |
| GET | `/api/confirmacion/todas` | Confirmaciones por fecha | Admin |

**Convención de URL:** rutas en minúsculas, separadas por `/`, parámetros precedidos
de `:`. Ejemplo: `PUT /api/usuarios/:id`.

### 3.7 Esquema de la base de datos

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Tablas | minúsculas, plural | `usuarios`, `menus`, `confirmaciones` |
| Columnas | **snake_case** | `id_usuario`, `plato_principal`, `fecha_registro` |
| Llave primaria | `id_` + tabla (singular) | `id_confirmacion` |
| Llave foránea | `id_` + tabla referenciada | `id_menu`, `id_usuario` |
| Marcas de tiempo | `fecha_creacion`, `fecha_registro` | — |
| Campo lógico | `activo` (TINYINT 0/1) | `activo: 1` |
| Estado de rol | `ENUM('admin','estudiante')` | — |

### 3.8 Manejo de errores

**Regla general:** todas las operaciones asíncronas se encierran en `try/catch` y el
error se responde en formato JSON uniforme: `{ "error": "mensaje" }`.

**Códigos de estado HTTP utilizados:**

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Consultas y actualizaciones exitosas |
| 201 | Creado | Creación de menús, confirmaciones |
| 400 | Solicitud inválida | Datos incompletos o fechas incorrectas |
| 401 | No autenticado | Falta el token |
| 403 | Prohibido | Rol sin permisos |
| 404 | No encontrado | Menú o usuario inexistente |
| 500 | Error interno | Error en el servidor/base de datos |

**Ejemplo real (backend/routes/menu.js):**

```js
try {
  const { fecha, entrada, plato_principal, bebida, postre } = req.body;
  if (!fecha || !entrada || !plato_principal || !bebida || !postre)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  const manana = new Date(); manana.setDate(manana.getDate() + 1);
  const fechaMin = manana.toISOString().split('T')[0];
  if (fecha < fechaMin)
    return res.status(400).json({ error: `No puedes crear menús para hoy o fechas pasadas. La fecha mínima es ${fechaMin}.` });
  // ...
} catch (e) { res.status(500).json({ error: e.message }); }
```

### 3.9 Seguridad en el código

| Norma | Implementación |
|-------|----------------|
| Contraseñas | Encriptadas con **bcryptjs** antes de guardarse en la base de datos |
| Autenticación | Tokens **JWT** firmados con secreto (`JWT_SECRET`) |
| Envío del token | Cabecera `Authorization: Bearer <token>` |
| Protección de rutas | Middleware `verificarToken`, `soloAdmin`, `soloEstudiante` |
| Datos sensibles | Nunca se guardan en el código; se usan variables de entorno `.env` |
| Registro de peticiones | Middleware **Morgan** guarda logs de acceso en `access.log` |
| CORS | Configurado explícitamente para las peticiones del frontend |

**Ejemplo de middleware de protección (backend/middleware/auth.js):**

```js
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin')
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  next();
};
```

### 3.10 Estructura de clases CSS

**Regla general:** clases descriptivas con guion bajo/medio para componentes (estilo
parecido a BEM). Las variables de color se definen en `:root`.

```css
:root {
  --primary: #185FA5;
  --primary-dark: #0C447C;
  --success: #3B6D11;
  --danger: #A32D2D;
}

.auth-card { ... }
.auth-logo-icon img { width: 170px; }
.stat-card .stat-n { ... }
.menu-item-label { ... }
.sidebar-toggle { display: none; }
```

### 3.11 Comentarios

| Regla | Ejemplo |
|-------|---------|
| Encabezado de archivo | `// ============ SMARTFOOD - Módulo Administrador ============` |
| Comentario de sección | `// ====== PANEL PRINCIPAL ======` |
| Comentario de línea | `// Alerta si está por debajo del promedio` |
| Comentarios en español | Siempre en el idioma del proyecto |

### 3.12 Control de versiones (Git)

| Regla | Descripción |
|-------|-------------|
| Repositorio remoto | GitHub (`JULIO-G77/SmartFood`) |
| Rama principal | `main` |
| Mensaje de commit | Formato: `tipo: descripción breve en español` |
| Tipos usados | `feat:` (funcionalidad), `fix:` (corrección), `refactor:`, `chore:` |
| Ejemplos reales | `feat: upgrade backgrounds`, `fix navbar logo paths`, `refactor: login fused with brand gradient` |
| Archivos binarios | Protegidos con `.gitattributes` para evitar corrupción |

---

## 4. CONCLUSIÓN

La adopción de un estándar de codificación uniforme ha permitido que el proyecto SmartFood
se desarrolle de forma ordenada, con un código legible, seguro y fácil de mantener. Las
convenciones definidas (camelCase para variables y funciones, PascalCase para clases,
snake_case para la base de datos, rutas REST con verbos HTTP y manejo uniforme de errores)
garantizan que cualquier desarrollador pueda continuar el proyecto sin ambigüedades.

Estos estándares seguirán aplicándose en las próximas fases del sistema y quedarán
documentados para futuras iteraciones, tal como lo exige el componente formativo.

---

## 5. REFERENCIAS

- Documentación del proyecto: `README.md`, `docs/INSTALACION.md`
- Historial de cambios: `cambios.md`
- Código fuente: `backend/` y `frontend/`
- Guías oficiales: Node.js, Express.js, Sequelize, Git
