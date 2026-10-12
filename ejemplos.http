# Documentación de la API SmartFood

Versión 1.0.0 · Autor: Julio Génes Beltrán · Repositorio: https://github.com/JULIO-G77/SmartFood

Esta documentación se genera a partir de `backend/docs/openapi.yaml` (especificación OpenAPI 3.0). La versión interactiva (Swagger UI) está disponible en `/api/docs` del servidor, por ejemplo `http://localhost:3000/api/docs` o `https://smartfood-jau7.onrender.com/api/docs`.

API REST del sistema **SmartFood**, que permite a los estudiantes de la I.E. Normal Superior Montes de María confirmar con anticipación su asistencia al comedor escolar, y al administrador gestionar menús, usuarios, notificaciones y reportes.

**Formato:** todas las peticiones y respuestas usan JSON (`Content-Type: application/json`).

**Autenticación:** primero se llama a `POST /api/auth/login`; el token JWT recibido se envía en cada petición protegida con el encabezado `Authorization: Bearer <token>`. El token vence según `JWT_EXPIRES` (7 días por defecto).

**Roles:** `estudiante` y `admin`. Cada servicio indica qué rol puede usarlo.

**Errores:** las respuestas de error tienen la forma `{ "error": "mensaje" }`. Códigos usados: 400 (datos inválidos), 401 (falta token), 403 (token inválido o rol sin permiso), 404 (no encontrado) y 500 (error del servidor).

## Resumen de servicios (28)

| # | Método | Ruta | Descripción | Acceso |
|---|---|---|---|---|
| 1 | GET | `/api/salud` | Estado del servicio | público |
| 2 | POST | `/api/auth/login` | Iniciar sesión | público |
| 3 | GET | `/api/menu/hoy` | Menú de hoy | estudiante o admin |
| 4 | GET | `/api/menu` | Menú de mañana | estudiante o admin |
| 5 | POST | `/api/menu` | Crear menú | admin |
| 6 | GET | `/api/menu/semana` | Menú de la semana | estudiante o admin |
| 7 | GET | `/api/menu/todos` | Listar todos los menús | admin |
| 8 | PUT | `/api/menu/{id}` | Editar menú | admin |
| 9 | DELETE | `/api/menu/{id}` | Eliminar menú | admin |
| 10 | POST | `/api/confirmacion` | Confirmar asistencia | estudiante |
| 11 | DELETE | `/api/confirmacion/{id_menu}` | Cancelar asistencia | estudiante |
| 12 | GET | `/api/confirmacion/mi-estado/{id_menu}` | Estado de mi confirmación | estudiante |
| 13 | GET | `/api/confirmacion/historial` | Mi historial | estudiante |
| 14 | GET | `/api/confirmacion/conteo/{id_menu}` | Conteo de confirmaciones de un menú | estudiante o admin |
| 15 | GET | `/api/confirmacion/todas` | Todas las confirmaciones de una fecha | admin |
| 16 | GET | `/api/usuarios` | Listar usuarios | admin |
| 17 | POST | `/api/usuarios` | Crear usuario | admin |
| 18 | GET | `/api/usuarios/perfil` | Ver mi perfil | estudiante o admin |
| 19 | PUT | `/api/usuarios/perfil` | Actualizar mi perfil | estudiante o admin |
| 20 | PUT | `/api/usuarios/cambiar-password` | Cambiar mi contraseña | estudiante o admin |
| 21 | PUT | `/api/usuarios/{id}` | Editar usuario | admin |
| 22 | DELETE | `/api/usuarios/{id}` | Eliminar usuario | admin |
| 23 | GET | `/api/notificaciones` | Mis notificaciones | estudiante o admin |
| 24 | GET | `/api/notificaciones/no-leidas` | Contar no leídas | estudiante o admin |
| 25 | PUT | `/api/notificaciones/marcar-leidas` | Marcar todas como leídas | estudiante o admin |
| 26 | POST | `/api/notificaciones/masiva` | Enviar notificación masiva | admin |
| 27 | GET | `/api/reportes/estadisticas` | Estadísticas generales | admin |
| 28 | GET | `/api/reportes/semanal` | Resumen semanal | admin |

## Sistema

### GET `/api/salud` — Estado del servicio

Verifica que el servidor esté en línea. No requiere autenticación.

- **Acceso:** público

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Servicio activo. |

Ejemplo de respuesta 200:

```json
{
  "estado": "OK",
  "sistema": "SmartFood",
  "version": "1.0.0"
}
```

## Autenticación

### POST `/api/auth/login` — Iniciar sesión

Valida correo y contraseña y devuelve un token JWT que debe enviarse en el encabezado `Authorization: Bearer <token>` de los demás servicios. Solo inicia sesión con usuarios activos.

- **Acceso:** público

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `correo` | string (email) | Sí |
| `password` | string | Sí |

```json
{
  "correo": "estudiante1@smartfood.co",
  "password": "est123"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Inicio de sesión correcto. |
| 400 | Datos de entrada inválidos (correo con mal formato o contraseña vacía). |
| 401 | Correo no registrado, usuario inactivo o contraseña incorrecta. |
| 500 | Error interno del servidor o de la base de datos. |

Ejemplo de respuesta 200:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 2,
    "nombre": "Sofía Martínez",
    "correo": "estudiante1@smartfood.co",
    "rol": "estudiante",
    "perfil": {
      "id_estudiante": 1,
      "curso": "11°A"
    }
  }
}
```

## Menú

### GET `/api/menu/hoy` — Menú de hoy

Devuelve el menú activo de la fecha actual (solo lectura).

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Menú de hoy. |
| 404 | No hay menú para hoy. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "id_menu": 7,
  "fecha": "2026-10-13",
  "entrada": "Ensalada de aguacate",
  "plato_principal": "Lentejas con arroz integral",
  "bebida": "Jugo de mora",
  "postre": "Fruta natural",
  "activo": 1,
  "creado_por": 1
}
```

### GET `/api/menu` — Menú de mañana

Devuelve el menú activo del día siguiente, que es el que el estudiante confirma.

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Menú de mañana. |
| 404 | No hay menú publicado para mañana. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "id_menu": 7,
  "fecha": "2026-10-13",
  "entrada": "Ensalada de aguacate",
  "plato_principal": "Lentejas con arroz integral",
  "bebida": "Jugo de mora",
  "postre": "Fruta natural",
  "activo": 1,
  "creado_por": 1
}
```

### POST `/api/menu` — Crear menú

Crea el menú de un día futuro. La fecha debe ser mañana o posterior y no puede repetirse.

- **Acceso:** admin (requiere token JWT)

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `fecha` | string (date) | Sí |
| `entrada` | string | Sí |
| `plato_principal` | string | Sí |
| `bebida` | string | Sí |
| `postre` | string | Sí |

```json
{
  "fecha": "2026-10-13",
  "entrada": "Ensalada de aguacate",
  "plato_principal": "Lentejas con arroz integral",
  "bebida": "Jugo de mora",
  "postre": "Fruta natural"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 201 | Menú creado. |
| 400 | Faltan campos, la fecha es de hoy o del pasado, o ya existe un menú para esa fecha. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 201:

```json
{
  "id_menu": 7,
  "fecha": "2026-10-13",
  "entrada": "Ensalada de aguacate",
  "plato_principal": "Lentejas con arroz integral",
  "bebida": "Jugo de mora",
  "postre": "Fruta natural",
  "activo": 1,
  "creado_por": 1
}
```

### GET `/api/menu/semana` — Menú de la semana

Lista los menús activos de lunes a viernes de la semana actual, ordenados por fecha.

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Lista de menús (puede estar vacía). |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
[
  {
    "id_menu": 7,
    "fecha": "2026-10-13",
    "entrada": "Ensalada de aguacate",
    "plato_principal": "Lentejas con arroz integral",
    "bebida": "Jugo de mora",
    "postre": "Fruta natural",
    "activo": 1,
    "creado_por": 1
  }
]
```

### GET `/api/menu/todos` — Listar todos los menús

Devuelve todos los menús registrados, del más reciente al más antiguo.

- **Acceso:** admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Lista completa de menús. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
[
  {
    "id_menu": 7,
    "fecha": "2026-10-13",
    "entrada": "Ensalada de aguacate",
    "plato_principal": "Lentejas con arroz integral",
    "bebida": "Jugo de mora",
    "postre": "Fruta natural",
    "activo": 1,
    "creado_por": 1
  }
]
```

### PUT `/api/menu/{id}` — Editar menú

Actualiza los campos enviados de un menú existente.

- **Acceso:** admin (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | path | integer | Sí | Identificador del menú (id_menu). |

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `entrada` | string | No |
| `plato_principal` | string | No |
| `bebida` | string | No |
| `postre` | string | No |
| `activo` | integer (0 | 1) | No |

```json
{
  "plato_principal": "Pollo al horno con arroz"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Menú actualizado. |
| 404 | El menú no existe. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
{
  "id_menu": 7,
  "fecha": "2026-10-13",
  "entrada": "Ensalada de aguacate",
  "plato_principal": "Lentejas con arroz integral",
  "bebida": "Jugo de mora",
  "postre": "Fruta natural",
  "activo": 1,
  "creado_por": 1
}
```

### DELETE `/api/menu/{id}` — Eliminar menú

Elimina un menú y sus confirmaciones asociadas.

- **Acceso:** admin (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | path | integer | Sí | Identificador del menú (id_menu). |

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Menú eliminado. |
| 404 | El menú no existe. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Menú eliminado"
}
```

## Confirmación

### POST `/api/confirmacion` — Confirmar asistencia

Registra (o reactiva) la confirmación del estudiante autenticado para un menú y le genera una notificación. Solo funciona con un usuario que tenga perfil de estudiante.

- **Acceso:** estudiante (requiere token JWT)

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `id_menu` | integer | Sí |

```json
{
  "id_menu": 7
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Asistencia confirmada. |
| 400 | El usuario no es estudiante. |
| 404 | El menú no existe. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Asistencia confirmada",
  "confirmacion": {
    "id_confirmacion": 12,
    "id_estudiante": 1,
    "id_menu": 7,
    "estado": "confirmado",
    "fecha_confirmacion": "2026-10-12T18:20:00.000Z"
  }
}
```

### DELETE `/api/confirmacion/{id_menu}` — Cancelar asistencia

Cambia a "cancelado" la confirmación del estudiante autenticado y genera una notificación. Se puede volver a confirmar después.

- **Acceso:** estudiante (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id_menu` | path | integer | Sí | Identificador del menú. |

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Asistencia cancelada. |
| 404 | El estudiante no había confirmado ese menú. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Asistencia cancelada"
}
```

### GET `/api/confirmacion/mi-estado/{id_menu}` — Estado de mi confirmación

Indica si el estudiante autenticado confirmó, canceló o no ha respondido para un menú.

- **Acceso:** estudiante (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id_menu` | path | integer | Sí | Identificador del menú. |

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Estado actual. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "estado": "confirmado",
  "confirmacion": {
    "id_confirmacion": 12,
    "id_estudiante": 1,
    "id_menu": 7,
    "estado": "confirmado",
    "fecha_confirmacion": "2026-10-12T18:20:00.000Z"
  }
}
```

### GET `/api/confirmacion/historial` — Mi historial

Últimas 30 confirmaciones del estudiante autenticado, de la más reciente a la más antigua, con datos del menú.

- **Acceso:** estudiante (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Historial. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
[
  {
    "id_confirmacion": 12,
    "id_estudiante": 1,
    "id_menu": 7,
    "estado": "confirmado",
    "fecha_confirmacion": "2026-10-12T18:20:00.000Z",
    "Menu": {
      "fecha": "2026-10-13",
      "plato_principal": "Lentejas con arroz integral",
      "entrada": "Ensalada de aguacate",
      "bebida": "Jugo de mora"
    }
  }
]
```

### GET `/api/confirmacion/conteo/{id_menu}` — Conteo de confirmaciones de un menú

Cuenta confirmados, cancelados y pendientes (total de estudiantes menos confirmados y cancelados). Alimenta la barra de progreso.

- **Acceso:** estudiante o admin (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id_menu` | path | integer | Sí | Identificador del menú. |

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Conteo. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "confirmados": 87,
  "cancelados": 3,
  "pendientes": 10,
  "total": 100
}
```

### GET `/api/confirmacion/todas` — Todas las confirmaciones de una fecha

Lista las confirmaciones del menú de la fecha indicada (por defecto, mañana) con nombre y correo del estudiante. Si no hay menú ese día devuelve una lista vacía.

- **Acceso:** admin (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `fecha` | query | string (date) | No | Fecha del menú (AAAA-MM-DD). Por defecto, mañana. |

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Confirmaciones de la fecha. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
[]
```

## Usuarios

### GET `/api/usuarios` — Listar usuarios

Lista todos los usuarios con su perfil de estudiante. Nunca incluye la contraseña.

- **Acceso:** admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Lista de usuarios. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
[
  {
    "id_usuario": 2,
    "nombre": "Sofía Martínez",
    "correo": "estudiante1@smartfood.co",
    "rol": "estudiante",
    "activo": 1,
    "fecha_registro": "2026-06-19T10:00:00.000Z",
    "perfil": {
      "id_estudiante": 1,
      "id_usuario": 2,
      "curso": "11°A",
      "ciudad": "San Juan de Nepomuceno",
      "alergias": "Ninguna",
      "preferencias": "ninguna"
    }
  }
]
```

### POST `/api/usuarios` — Crear usuario

Crea una cuenta. Si el rol no es "admin" también crea su perfil de estudiante con valores por defecto (curso 9°A, ciudad San Juan de Nepomuceno, alergias "Ninguna"). No existe registro público.

- **Acceso:** admin (requiere token JWT)

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `nombre` | string | Sí |
| `correo` | string (email) | Sí |
| `password` | string | Sí |
| `rol` | string (estudiante | admin) | No |
| `curso` | string | No |
| `ciudad` | string | No |
| `alergias` | string | No |
| `preferencias` | string (ninguna | vegetariano | vegano | sin-gluten) | No |

```json
{
  "nombre": "Pedro Gómez",
  "correo": "pedro@smartfood.co",
  "password": "est123",
  "rol": "estudiante",
  "curso": "10°A"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 201 | Usuario creado. |
| 400 | Faltan datos obligatorios o el correo ya existe. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 201:

```json
{
  "mensaje": "Usuario creado",
  "id": 21
}
```

### GET `/api/usuarios/perfil` — Ver mi perfil

Devuelve los datos del usuario autenticado (sin contraseña).

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Perfil del usuario. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "id_usuario": 2,
  "nombre": "Sofía Martínez",
  "correo": "estudiante1@smartfood.co",
  "rol": "estudiante",
  "activo": 1,
  "fecha_registro": "2026-06-19T10:00:00.000Z",
  "perfil": {
    "id_estudiante": 1,
    "id_usuario": 2,
    "curso": "11°A",
    "ciudad": "San Juan de Nepomuceno",
    "alergias": "Ninguna",
    "preferencias": "ninguna"
  }
}
```

### PUT `/api/usuarios/perfil` — Actualizar mi perfil

Actualiza el nombre del usuario y, si es estudiante, su curso, ciudad, alergias y preferencias.

- **Acceso:** estudiante o admin (requiere token JWT)

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `nombre` | string | No |
| `curso` | string | No |
| `ciudad` | string | No |
| `alergias` | string | No |
| `preferencias` | string (ninguna | vegetariano | vegano | sin-gluten) | No |

```json
{
  "nombre": "Sofía Martínez",
  "alergias": "Lactosa",
  "preferencias": "vegetariano"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Perfil actualizado. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Perfil actualizado exitosamente"
}
```

### PUT `/api/usuarios/cambiar-password` — Cambiar mi contraseña

Cambia la contraseña del usuario autenticado. Exige la contraseña actual y que la nueva tenga mínimo 6 caracteres. Se almacena con hash bcrypt.

- **Acceso:** estudiante o admin (requiere token JWT)

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `password_actual` | string | Sí |
| `password_nuevo` | string | Sí |

```json
{
  "password_actual": "est123",
  "password_nuevo": "NuevaClave2026"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Contraseña actualizada. |
| 400 | Nueva contraseña muy corta o contraseña actual incorrecta. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Contraseña actualizada exitosamente"
}
```

### PUT `/api/usuarios/{id}` — Editar usuario

Actualiza nombre, correo, rol y estado (activo) de un usuario y, si es estudiante, los datos de su perfil. No cambia la contraseña.

- **Acceso:** admin (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | path | integer | Sí | Identificador del usuario (id_usuario). |

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `nombre` | string | No |
| `correo` | string (email) | No |
| `rol` | string (estudiante | admin) | No |
| `activo` | integer (0 | 1) | No |
| `curso` | string | No |
| `ciudad` | string | No |
| `alergias` | string | No |
| `preferencias` | string | No |

```json
{
  "nombre": "Pedro Gómez",
  "correo": "pedro@smartfood.co",
  "rol": "estudiante",
  "activo": 1,
  "curso": "11°A"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Usuario actualizado. |
| 404 | El usuario no existe. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Usuario actualizado"
}
```

### DELETE `/api/usuarios/{id}` — Eliminar usuario

Elimina un usuario y, en cascada, su perfil, confirmaciones y notificaciones. Un administrador no puede eliminarse a sí mismo.

- **Acceso:** admin (requiere token JWT)

**Parámetros**

| Nombre | En | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| `id` | path | integer | Sí | Identificador del usuario (id_usuario). |

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Usuario eliminado. |
| 400 | Intento de eliminarse a sí mismo. |
| 404 | El usuario no existe. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Usuario eliminado"
}
```

## Notificaciones

### GET `/api/notificaciones` — Mis notificaciones

Últimas 30 notificaciones del usuario autenticado, de la más reciente a la más antigua.

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Lista de notificaciones. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
[
  {
    "id_notificacion": 5,
    "id_usuario": 2,
    "titulo": "Asistencia confirmada",
    "mensaje": "Tu asistencia al comedor del 2026-10-13 fue registrada exitosamente.",
    "tipo": "confirmacion",
    "leida": 0,
    "fecha": "2026-10-12T18:20:00.000Z"
  }
]
```

### GET `/api/notificaciones/no-leidas` — Contar no leídas

Número de notificaciones sin leer del usuario autenticado (para el distintivo del menú).

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Conteo. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "count": 3
}
```

### PUT `/api/notificaciones/marcar-leidas` — Marcar todas como leídas

Marca como leídas todas las notificaciones pendientes del usuario autenticado. No recibe cuerpo.

- **Acceso:** estudiante o admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Notificaciones actualizadas. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido o expirado. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Notificaciones marcadas como leídas"
}
```

### POST `/api/notificaciones/masiva` — Enviar notificación masiva

Crea una notificación para todos los estudiantes activos (por defecto) o para todos los usuarios activos si `destinatarios` es "todos".

- **Acceso:** admin (requiere token JWT)

**Cuerpo de la petición (entrada)**

| Campo | Tipo | Obligatorio |
|---|---|---|
| `titulo` | string | Sí |
| `mensaje` | string | Sí |
| `tipo` | string (menu | confirmacion | recordatorio | cancelacion | sistema) | No |
| `destinatarios` | string (estudiantes | todos) | No |

```json
{
  "titulo": "Cambio de menú",
  "mensaje": "Mañana el almuerzo se servirá a las 12:30.",
  "tipo": "sistema",
  "destinatarios": "estudiantes"
}
```

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Notificación enviada. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
{
  "mensaje": "Notificación enviada a 10 usuarios"
}
```

## Reportes

### GET `/api/reportes/estadisticas` — Estadísticas generales

Calcula, para el menú de mañana, los confirmados, cancelados, pendientes y el porcentaje de asistencia, más los confirmados por día (últimos 7 días) y por curso.

- **Acceso:** admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Estadísticas. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
{
  "totalEstudiantes": 10,
  "confirmadosHoy": 7,
  "canceladosHoy": 1,
  "pendientesHoy": 2,
  "porcentajeAsistencia": 70,
  "porDia": [
    {
      "fecha": "2026-10-12",
      "confirmados": 8
    }
  ],
  "porCurso": [
    {
      "curso": "11°A",
      "confirmados": 3
    }
  ]
}
```

### GET `/api/reportes/semanal` — Resumen semanal

Confirmados y cancelados por día de la semana actual (lunes a viernes) con el plato principal.

- **Acceso:** admin (requiere token JWT)

**Respuestas (salida)**

| Código | Significado |
|---|---|
| 200 | Resumen semanal. |
| 500 | Error interno del servidor o de la base de datos. |
| 401 | Falta el token (encabezado Authorization). |
| 403 | Token inválido/expirado, o el usuario no es administrador. |

Ejemplo de respuesta 200:

```json
[
  {
    "fecha": "2026-10-12",
    "plato_principal": "Lentejas con arroz integral",
    "confirmados": "8",
    "cancelados": "1"
  }
]
```

## Modelos de datos

### Menu

| Campo | Tipo |
|---|---|
| `id_menu` | integer |
| `fecha` | string (date) |
| `entrada` | string |
| `plato_principal` | string |
| `bebida` | string |
| `postre` | string |
| `activo` | integer (0 | 1) |
| `creado_por` | integer |

### Estudiante

| Campo | Tipo |
|---|---|
| `id_estudiante` | integer |
| `id_usuario` | integer |
| `curso` | string |
| `ciudad` | string |
| `alergias` | string |
| `preferencias` | string (ninguna | vegetariano | vegano | sin-gluten) |

### Usuario

| Campo | Tipo |
|---|---|
| `id_usuario` | integer |
| `nombre` | string |
| `correo` | string (email) |
| `rol` | string (admin | estudiante) |
| `activo` | integer (0 | 1) |
| `fecha_registro` | string (date-time) |
| `perfil` | Estudiante |

### UsuarioSesion

| Campo | Tipo |
|---|---|
| `id` | integer |
| `nombre` | string |
| `correo` | string |
| `rol` | string (admin | estudiante) |
| `perfil` | Estudiante |

### Confirmacion

| Campo | Tipo |
|---|---|
| `id_confirmacion` | integer |
| `id_estudiante` | integer |
| `id_menu` | integer |
| `estado` | string (confirmado | cancelado) |
| `fecha_confirmacion` | string (date-time) |

### Notificacion

| Campo | Tipo |
|---|---|
| `id_notificacion` | integer |
| `id_usuario` | integer |
| `titulo` | string |
| `mensaje` | string |
| `tipo` | string (menu | confirmacion | recordatorio | cancelacion | sistema) |
| `leida` | integer (0 | 1) |
| `fecha` | string (date-time) |

### Estadisticas

| Campo | Tipo |
|---|---|
| `totalEstudiantes` | integer |
| `confirmadosHoy` | integer |
| `canceladosHoy` | integer |
| `pendientesHoy` | integer |
| `porcentajeAsistencia` | number |
| `porDia` | lista de object |
| `porCurso` | lista de object |

## Notas de diseño

- Las rutas se agrupan por recurso (`/api/menu`, `/api/confirmacion`, ...) y usan los verbos HTTP según su función: GET consulta, POST crea, PUT actualiza y DELETE elimina.
- La autorización se resuelve con middleware (`verificarToken`, `soloAdmin`) antes de ejecutar la lógica de cada servicio.
- Las contraseñas se guardan con hash bcrypt y nunca se devuelven en las respuestas.
- Las fechas de "hoy" y "mañana" se calculan en el servidor con `toISOString()` (UTC).
- Limitación conocida: `PUT /api/menu/{id}` actualiza con el cuerpo recibido sin filtrar campos; se recomienda restringirlo a los campos documentados.
