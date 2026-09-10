# API — Geest

Backend en **Node.js + TypeScript** con **NestJS 12** y **MongoDB** (Mongoose).

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

Desde ahí se puede probar el endpoint sin curl ni Postman: abrir `POST /api/auth/login`,
pulsar **Try it out** (el body ya viene relleno con el usuario de prueba) y **Execute**.
Muestra el código de respuesta, el body y los headers.

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

## Endpoints

### `POST /api/auth/login`

Autenticación con usuario y contraseña. Devuelve un JWT.

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234!"}'
```

**200 OK**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "testuser" }
}
```

| Código | Cuándo                                                      |
| ------ | ----------------------------------------------------------- |
| `200`  | Credenciales correctas                                      |
| `401`  | Usuario inexistente o contraseña incorrecta (mismo mensaje) |
| `400`  | Campos faltantes, vacíos o propiedades no declaradas        |

Para proteger un endpoint nuevo basta con `@UseGuards(JwtAuthGuard)`; el token
viaja en `Authorization: Bearer <token>`.

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
