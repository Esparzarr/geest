# API — Geest

Backend en **Node.js + TypeScript** con **NestJS 12** y **MongoDB** (Mongoose).

Tiene tres partes:

- **Auth:** login con usuario y contraseña, devuelve un JWT.
- **Departamentos:** crear, listar, editar y borrar.
- **Contactos:** crear, listar con filtros, editar y borrar. Cada contacto pertenece a un
  departamento.

## Requisitos

- Node.js 20+
- Docker (para la base de datos)

## Puesta en marcha

```bash
yarn install
cp .env.example .env   # ajustar si hace falta

yarn --cwd .. db:up    # levanta MongoDB con el usuario ya sembrado
yarn start:dev         # API en http://localhost:4000
```

MongoDB corre en un contenedor mapeado al puerto **27018** del host, no al 27017.
Es a propósito: así no choca con una instalación local de MongoDB que ya use el
puerto por defecto, y los datos del proyecto quedan aislados de cualquier otra base.

Los datos persisten en un volumen de Docker entre reinicios. Para empezar de cero:

```bash
yarn --cwd .. db:reset   # borra el volumen y vuelve a sembrar
```

## Documentación interactiva (Swagger)

Con la API corriendo:

**<http://localhost:4000/docs>**

Desde ahí se puede probar todo sin curl ni Postman: abrir un endpoint, pulsar
**Try it out**, llenar el body y **Execute**. Muestra el código de respuesta, el body
y los headers.

Para los endpoints con candado hay que autorizarse primero: ejecutar
`POST /api/auth/login`, copiar el `access_token` de la respuesta, pulsar **Authorize**
arriba a la derecha y pegarlo.

El contrato en formato OpenAPI 3.0 está en <http://localhost:4000/docs-json>, por si se
quiere importar en Postman o Insomnia.

## Usuario de prueba

La API **no expone registro ni contiene código que cree usuarios**: solo los lee
para autenticar. El usuario de prueba se siembra directamente en MongoDB mediante
`docker/mongo-init.js`, que la imagen oficial ejecuta la primera vez que inicializa
el volumen de datos.

| Campo      | Valor       |
| ---------- | ----------- |
| Usuario    | `testuser`  |
| Contraseña | `Test1234!` |

## Resumen de endpoints

| Método   | Ruta                   | Qué hace                        | Token |
| -------- | ---------------------- | ------------------------------- | ----- |
| `GET`    | `/api/health`          | Estado del servicio             | No    |
| `POST`   | `/api/auth/login`      | Inicia sesión y devuelve el JWT | No    |
| `POST`   | `/api/departments`     | Crea un departamento            | Sí    |
| `GET`    | `/api/departments`     | Lista los departamentos         | Sí    |
| `PATCH`  | `/api/departments/:id` | Renombra un departamento        | Sí    |
| `DELETE` | `/api/departments/:id` | Borra un departamento           | Sí    |
| `POST`   | `/api/contacts`        | Crea un contacto                | Sí    |
| `GET`    | `/api/contacts`        | Lista contactos, con filtros    | Sí    |
| `PATCH`  | `/api/contacts/:id`    | Edita un contacto               | Sí    |
| `DELETE` | `/api/contacts/:id`    | Borra un contacto               | Sí    |

Los que piden token lo esperan en el header `Authorization: Bearer <token>`. Sin él
responden **401**.

## Salud

### `GET /api/health`

Comprueba que la API responda y que la conexión con MongoDB esté activa.
No requiere autenticación.

```bash
curl -i http://localhost:4000/api/health
```

**200 OK**

```json
{
  "status": "ok",
  "info": { "mongodb": { "status": "up", "responseTime": 3 } },
  "error": {},
  "details": { "mongodb": { "status": "up", "responseTime": 3 } }
}
```

Devuelve **503** con el detalle del fallo si MongoDB no responde, para que un
balanceador deje de enviarle tráfico a la instancia.

## Autenticación

### `POST /api/auth/login`

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234!"}'
```

**200 OK**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "01a08de5-ef21-7c97-bc87-920a538aeda1", "username": "testuser" }
}
```

| Código | Cuándo                                                      |
| ------ | ----------------------------------------------------------- |
| `200`  | Credenciales correctas                                      |
| `400`  | Campos faltantes, vacíos o propiedades no declaradas        |
| `401`  | Usuario inexistente o contraseña incorrecta (mismo mensaje) |

El token dura un día (`JWT_EXPIRES_IN`). Para usarlo:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl http://localhost:4000/api/departments -H "Authorization: Bearer $TOKEN"
```

Para proteger un endpoint nuevo hay que importar `AuthModule` en su módulo y usar
`@UseGuards(JwtAuthGuard)`.

## Departamentos

Un departamento solo tiene nombre. El nombre es **único sin distinguir mayúsculas**:
`Ventas` y `ventas` se consideran el mismo, aunque se guarda tal como se escribió.

### `POST /api/departments`

```bash
curl -X POST http://localhost:4000/api/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Recursos Humanos"}'
```

**201 Created**

```json
{
  "id": "01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04",
  "name": "Recursos Humanos",
  "createdAt": "2026-09-11T02:32:16.840Z",
  "updatedAt": "2026-09-11T02:32:16.840Z"
}
```

| Código | Cuándo                                           |
| ------ | ------------------------------------------------ |
| `201`  | Creado                                           |
| `400`  | Nombre faltante, vacío o de más de 50 caracteres |
| `409`  | Ya existe un departamento con ese nombre         |

### `GET /api/departments`

Devuelve todos los departamentos, con el mismo formato del `POST` dentro de una lista.

```bash
curl http://localhost:4000/api/departments -H "Authorization: Bearer $TOKEN"
```

### `PATCH /api/departments/:id`

Renombra un departamento. El campo `name` es obligatorio.

```bash
curl -X PATCH http://localhost:4000/api/departments/01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"RH"}'
```

| Código | Cuándo                                     |
| ------ | ------------------------------------------ |
| `200`  | Actualizado, devuelve el departamento      |
| `400`  | Nombre faltante, vacío o demasiado largo   |
| `404`  | No existe un departamento con ese id       |
| `409`  | Ya existe otro departamento con ese nombre |

### `DELETE /api/departments/:id`

Devuelve **204** sin body si lo borra, o **404** si no existe.

## Contactos

Un contacto tiene nombre, correo, teléfono opcional y un departamento.
El correo es **único sin distinguir mayúsculas**.

### `POST /api/contacts`

```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Díaz",
    "email": "juan@ejemplo.com",
    "phone": "3123123121",
    "department": "01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04"
  }'
```

**201 Created**

```json
{
  "id": "01a09746-216c-7245-bdb5-a0b4826036b8",
  "name": "Juan Díaz",
  "email": "juan@ejemplo.com",
  "phone": "3123123121",
  "department": { "id": "01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04", "name": "Recursos Humanos" },
  "createdAt": "2026-09-12T20:19:10.829Z",
  "updatedAt": "2026-09-12T20:19:10.829Z"
}
```

El departamento se manda por **id**, y la respuesta lo devuelve con su nombre.

| Código | Cuándo                                              |
| ------ | --------------------------------------------------- |
| `201`  | Creado                                              |
| `400`  | Algún campo inválido (ver la tabla de validaciones) |
| `404`  | El departamento indicado no existe                  |
| `409`  | Ya existe un contacto con ese correo                |

### `GET /api/contacts`

Lista los contactos, **del más nuevo al más viejo** (por `createdAt`).

Acepta dos filtros opcionales que **se pueden combinar**:

| Filtro       | Qué hace                                                            |
| ------------ | ------------------------------------------------------------------- |
| `search`     | Busca una parte del nombre del contacto, sin distinguir mayúsculas  |
| `department` | Filtra por departamento. Acepta **id o nombre**, y se puede repetir |

```bash
# Todos
curl http://localhost:4000/api/contacts -H "Authorization: Bearer $TOKEN"

# Cuyo nombre contenga "jua"
curl "http://localhost:4000/api/contacts?search=jua" -H "Authorization: Bearer $TOKEN"

# De dos departamentos, por nombre
curl "http://localhost:4000/api/contacts?department=TI&department=Ventas" \
  -H "Authorization: Bearer $TOKEN"

# Los dos filtros juntos, con el departamento por id
curl "http://localhost:4000/api/contacts?search=jua&department=01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04" \
  -H "Authorization: Bearer $TOKEN"
```

Devuelve una lista con el mismo formato del `POST`. Si ningún contacto coincide,
devuelve **200** con una lista vacía, no un error.

| Código | Cuándo                                                     |
| ------ | ---------------------------------------------------------- |
| `200`  | Siempre que los filtros sean válidos                       |
| `400`  | Un filtro con formato inválido o un parámetro no declarado |

### `PATCH /api/contacts/:id`

Edita **solo los campos que se manden**; los demás se quedan como están.

```bash
curl -X PATCH http://localhost:4000/api/contacts/01a09746-216c-7245-bdb5-a0b4826036b8 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez"}'
```

| Código | Cuándo                                                   |
| ------ | -------------------------------------------------------- |
| `200`  | Actualizado, devuelve el contacto completo               |
| `400`  | Algún campo inválido                                     |
| `404`  | No existe el contacto, o el departamento nuevo no existe |
| `409`  | Ya existe otro contacto con ese correo                   |

Si se manda un departamento que no existe, se valida **antes** de guardar: responde
404 y el contacto no se modifica. Mandar `"phone": null` borra el teléfono; en los
campos obligatorios, `null` responde 400.

### `DELETE /api/contacts/:id`

Devuelve **204** sin body si lo borra, o **404** si no existe.

## Validaciones

| Campo                 | Regla                                                   |
| --------------------- | ------------------------------------------------------- |
| Departamento `name`   | Obligatorio, máximo 50 caracteres, único sin mayúsculas |
| Contacto `name`       | Obligatorio, máximo 100 caracteres                      |
| Contacto `email`      | Obligatorio, formato válido, máximo 50, único           |
| Contacto `phone`      | Opcional, exactamente 10 dígitos                        |
| Contacto `department` | Obligatorio, id de un departamento existente            |

Además, en toda la API:

- Los textos se recortan (espacios al inicio y al final) antes de validarse.
- Una propiedad que no esté declarada en el DTO responde **400**, no se ignora.
- Cada campo devuelve **un solo mensaje de error**, el de la primera regla que falla.
- Un `:id` que no tenga formato UUID responde **404**: un id mal formado tampoco
  identifica a nadie.

Los errores de validación se ven así:

```json
{
  "message": ["El correo debe ser valido"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Cómo se guardan los datos

- **Los ids son UUID v7**, generados por la API. Empiezan con la fecha de creación, así
  que se ordenan por antigüedad como los ObjectId, y MongoDB los guarda en binario.
  Por eso en Compass se ven como `UUID('01a08e10-...')`, pero la API los devuelve como
  texto y en el campo `id`, no `_id`.
- **Las fechas se guardan en UTC** y se devuelven en formato ISO 8601
  (`2026-09-12T20:19:10.829Z`). La conversión a hora local es cosa del frontend.
- **`createdAt` y `updatedAt`** los pone Mongoose solo.
- **El departamento de un contacto es una referencia** al `_id` del departamento, del
  mismo tipo UUID, lo que permite traerlo con `populate` en una sola consulta.

## Variables de entorno

Ver `.env.example`. `.env` está gitignoreado.

| Variable         | Descripción                           |
| ---------------- | ------------------------------------- |
| `MONGODB_URI`    | Conexión a MongoDB                    |
| `JWT_SECRET`     | Clave de firma de los tokens          |
| `JWT_EXPIRES_IN` | Vigencia del token (por defecto `1d`) |
| `PORT`           | Puerto HTTP (por defecto `4000`)      |

## Scripts

```bash
yarn start:dev    # desarrollo con recarga
yarn build        # compila a dist/
yarn lint
```

## Notas de seguridad

- Las contraseñas se guardan con **bcrypt** (10 rondas), nunca en texto plano.
- El campo `password` tiene `select: false`: no sale en las consultas salvo
  que se pida explícitamente.
- Login fallido devuelve el mismo mensaje exista o no el usuario, para no
  permitir enumerar usuarios registrados.
- Todos los endpoints de departamentos y contactos exigen JWT.
