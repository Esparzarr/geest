# API — Geest

Backend en **Node.js + TypeScript** con **NestJS 12** y **MongoDB** (Mongoose).

Tiene tres partes: **auth** (login que devuelve un JWT), **departamentos** y **contactos**.
Cada contacto pertenece a un departamento.

## Puesta en marcha

```bash
yarn install
cp .env.example .env

yarn --cwd .. db:up    # MongoDB en Docker, con el usuario ya sembrado
yarn start:dev         # API en http://localhost:4000
```

MongoDB se expone en el puerto **27018** para no chocar con una instalación local que
use el 27017. Para empezar de cero: `yarn --cwd .. db:reset`.

## Swagger

**<http://localhost:4000/docs>**

Ahí está cada endpoint con su body, sus respuestas y un botón para probarlo. Para las
rutas con candado: ejecuta `POST /api/auth/login`, copia el `access_token`, pulsa
**Authorize** y pégalo. El contrato en OpenAPI está en `/docs-json`.

## Usuario de prueba

| Usuario    | Contraseña  |
| ---------- | ----------- |
| `testuser` | `Test1234!` |

Se siembra en MongoDB con `docker/mongo-init.js`. La API no expone registro ni tiene
código que cree usuarios: solo los lee para autenticar.

## Endpoints

| Método   | Ruta                   | Qué hace                        | Token |
| -------- | ---------------------- | ------------------------------- | ----- |
| `GET`    | `/api/health`          | Estado del servicio y de Mongo  | No    |
| `POST`   | `/api/auth/login`      | Inicia sesión y devuelve el JWT | No    |
| `GET`    | `/api/departments`     | Lista los departamentos         | Sí    |
| `POST`   | `/api/departments`     | Crea un departamento            | Sí    |
| `PATCH`  | `/api/departments/:id` | Renombra un departamento        | Sí    |
| `DELETE` | `/api/departments/:id` | Borra un departamento           | Sí    |
| `GET`    | `/api/contacts`        | Lista contactos, con filtros    | Sí    |
| `POST`   | `/api/contacts`        | Crea un contacto                | Sí    |
| `PATCH`  | `/api/contacts/:id`    | Edita un contacto               | Sí    |
| `DELETE` | `/api/contacts/:id`    | Borra un contacto               | Sí    |

El token viaja en `Authorization: Bearer <token>` y dura un día. Para empezar:

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234!"}' | jq -r .access_token)

curl http://localhost:4000/api/contacts -H "Authorization: Bearer $TOKEN"
```

### Filtros de `GET /api/contacts`

La lista viene ordenada del contacto más nuevo al más viejo. Acepta dos filtros, que
se pueden combinar:

| Filtro       | Qué hace                                                            |
| ------------ | ------------------------------------------------------------------- |
| `search`     | Parte del nombre del contacto, sin distinguir mayúsculas            |
| `department` | Filtra por departamento. Acepta **id o nombre**, y se puede repetir |

```bash
curl "http://localhost:4000/api/contacts?search=jua&department=Ventas&department=Sistemas" \
  -H "Authorization: Bearer $TOKEN"
```

Si nada coincide devuelve una lista vacía, no un error.

## Validaciones

| Campo                 | Regla                                                   |
| --------------------- | ------------------------------------------------------- |
| Departamento `name`   | Obligatorio, máximo 50 caracteres, único sin mayúsculas |
| Contacto `name`       | Obligatorio, máximo 100 caracteres                      |
| Contacto `email`      | Obligatorio, formato válido, máximo 50, único           |
| Contacto `phone`      | Opcional, exactamente 10 dígitos                        |
| Contacto `department` | Obligatorio, id de un departamento existente            |

En toda la API: los textos se recortan antes de validarse, una propiedad no declarada
responde 400 en vez de ignorarse, y cada campo devuelve un solo mensaje de error.

Los códigos que usa:

| Código | Cuándo                                                          |
| ------ | --------------------------------------------------------------- |
| `400`  | Datos inválidos                                                 |
| `401`  | Falta el token o no es válido                                   |
| `404`  | No existe el recurso; también si el `:id` no tiene formato UUID |
| `409`  | Nombre de departamento o correo de contacto repetido            |
| `204`  | Borrado correcto, sin body                                      |

Un `PATCH` solo cambia los campos que se manden. Si el departamento nuevo no existe,
se valida antes de guardar: responde 404 y el contacto no se toca.

## Cómo se guardan los datos

- **Los ids son UUID v7**, generados por la API. MongoDB los guarda en binario, por eso
  en Compass se ven como `UUID('01a08e10-...')`, pero la API los devuelve como texto y
  en el campo `id`, no `_id`.
- **Las fechas van en UTC**, en formato ISO 8601. `createdAt` y `updatedAt` los pone
  Mongoose solo.
- **El departamento de un contacto es una referencia** al id del departamento, del mismo
  tipo UUID, así se trae con `populate` en una sola consulta.

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
yarn start:dev              # desarrollo con recarga
yarn build                  # compila a dist/
yarn seed --contacts=1000   # datos de ejemplo (ver el README de la raíz)
yarn lint
```

## Seguridad

- Las contraseñas se guardan con **bcrypt** (10 rondas), nunca en texto plano.
- El campo `password` tiene `select: false`: no sale en las consultas.
- Un login fallido devuelve el mismo mensaje exista o no el usuario, para no permitir
  averiguar qué usuarios hay.
- Departamentos y contactos exigen JWT en todos sus endpoints.
