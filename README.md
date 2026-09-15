# Geest — Gestor de contactos

Aplicación para administrar contactos y departamentos, con API propia y acceso protegido
por inicio de sesión.

|                             |                                            |
| --------------------------- | ------------------------------------------ |
| **Aplicación**              | <https://geest-web.onrender.com>           |
| **API**                     | <https://geest-api-z3fl.onrender.com/api>  |
| **Documentación de la API** | <https://geest-api-z3fl.onrender.com/docs> |

**Usuario de prueba:** `testuser` / `Test1234!`

> La primera petición puede tardar hasta 50 segundos. Los servicios del plan gratuito de
> Render se duermen tras unos minutos sin uso y tienen que despertar.

## Qué hace

- **Inicio de sesión** con usuario y contraseña. Las vistas de contactos y departamentos
  solo se ven con sesión activa.
- **Lista de contactos** con el nombre, correo, teléfono y departamento de cada uno,
  ordenada del más nuevo al más viejo.
- **Búsqueda por nombre y filtro por departamento**, que se combinan entre sí, con un
  contador de resultados.
- **Crear, editar y eliminar contactos**, con confirmación antes de borrar.
- **Departamentos**: crear, listar, editar y eliminar.

## Cómo levantarlo en local

Necesitas **Node.js 20+**, **Yarn** y **Docker**.

```bash
yarn setup             # instala las dependencias de api y web
yarn db:up             # levanta MongoDB en Docker (puerto 27018)
cp api/.env.example api/.env
yarn dev               # levanta la API y el frontend juntos
```

| Servicio | URL                          |
| -------- | ---------------------------- |
| Frontend | <http://localhost:5173>      |
| API      | <http://localhost:4000/api>  |
| Swagger  | <http://localhost:4000/docs> |
| MongoDB  | `mongodb://127.0.0.1:27018`  |

El usuario de prueba se crea solo al levantar la base. MongoDB usa el puerto 27018 y no el
27017, para no chocar con una instalación local que ya pudieras tener.

Para empezar de cero: `yarn db:reset`.

## Datos de ejemplo

```bash
yarn db:seed                    # 1000 contactos y 5 departamentos
yarn db:seed --contacts=50000   # la cantidad que quieras
yarn db:seed --departments=10   # hasta 10 departamentos
yarn db:seed --clean            # borra los de ejemplo y vuelve a sembrar
```

También por variable de entorno: `SEED_CONTACTS=50000 yarn db:seed`.

El script crea el usuario de prueba si no existe, así que sirve igual para una base local
que para una hospedada. Los contactos de ejemplo usan correos `contacto<n>@geest.test`:
por eso se pueden sembrar de nuevo sin repetir correos, y `--clean` borra solo esos, nunca
los que hayas creado tú. Sembrar 50 000 contactos toma unos 4 segundos.

## Decisiones técnicas

**NestJS y MongoDB.** NestJS impone una estructura clara (módulo, controlador, servicio) y
trae validación y documentación integradas, así que se dedica menos tiempo a cablear cosas.
MongoDB encaja porque el modelo es simple y el contacto se lee casi siempre completo.

**Los ids son UUID v7, no ObjectId.** El reto los pide en formato UUID. Elegí la versión 7
porque empieza por la fecha de creación: se ordena por antigüedad igual que un ObjectId.

**El correo y el nombre del departamento son únicos sin distinguir mayúsculas.** Se resuelve
con un índice único con `collation`, no comparando en el código: así lo garantiza la base
aunque lleguen dos peticiones a la vez.

**El departamento de un contacto es una referencia, no texto.** Se guarda como UUID con
`ref`, del mismo tipo que el id del departamento, lo que permite traerlo con `populate` en
una sola consulta.

**TanStack Query para los datos del servidor, Redux Toolkit para la sesión.** Son dos
problemas distintos: los datos de la API se cachean, se recargan y se invalidan solos; la
sesión es estado propio de la aplicación y se guarda con `redux-persist` para que no se
pierda al recargar.

**Los servicios se agrupan en tres archivos por dominio** (`services.ts` con las llamadas,
`mutation.ts` con los envoltorios de React Query, `index.ts` como barril). Las vistas nunca
llaman a la API directo: pasan por el hook del dominio.

**Cada vista es un `index.tsx` y un `useHook.ts`.** La pantalla se queda con el maquetado y
el hook con el estado, las peticiones y los manejadores.

**Índices en la colección de contactos.** Uno por `createdAt`, que es por donde ordena
siempre el listado, y otro por `department + createdAt`, que es el filtro habitual. Sin
ellos, cada consulta recorre la colección completa y ordena en memoria.

**Docker solo para la base en local.** En producción la base es MongoDB Atlas, y la API y el
frontend están en Render.

## Cosas que hice de más

El reto pide implementar solo el alcance descrito y anotar lo demás. Estas quedaron dentro,
y conviene saber que no estaban pedidas:

- **CRUD de departamentos en el frontend.** El reto pide sus endpoints, pero en la interfaz
  solo pide las vistas de contactos.
- **No se puede borrar un departamento que tenga contactos**: responde 409 en vez de dejar
  contactos apuntando a algo que ya no existe.
- **Swagger** para probar la API sin Postman.
- **Notificaciones** al crear, editar o borrar.
- **Panel de inicio y cerrar sesión.**
- **Validaciones adicionales**: teléfono de 10 dígitos y límites de longitud.

## Estructura

```
geest/
├── api/    NestJS 12 + MongoDB    ->  ver api/README.md para los endpoints
└── web/    React 19 + Vite + MUI
```

Cada proyecto tiene sus propias dependencias. Los scripts de la raíz solo redirigen a uno
u otro:

```bash
yarn dev      # api y web a la vez
yarn build    # compila ambos
yarn lint     # linta ambos
yarn db:up    # levanta MongoDB
yarn db:seed  # carga datos de ejemplo
```
