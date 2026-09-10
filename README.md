# Geest

Monorepo con frontend y backend.

```
geest/
├── web/    React 19 + Vite + MUI        -> http://localhost:5173
└── api/    NestJS 12 + MongoDB          -> http://localhost:4000
```

## Puesta en marcha

Requisitos: **Node.js 20+**, **Yarn** y **Docker**.

```bash
yarn setup     # instala dependencias de web y api
yarn db:up     # levanta MongoDB en Docker (puerto 27018)
               # el usuario de prueba se siembra solo

cp api/.env.example api/.env
yarn dev       # levanta frontend y backend juntos
```

| Servicio | URL                            |
| -------- | ------------------------------ |
| Frontend | <http://localhost:5173>        |
| API      | <http://localhost:4000/api>    |
| Swagger  | <http://localhost:4000/docs>   |
| MongoDB  | `mongodb://127.0.0.1:27018`    |

### Usuario de prueba

| Usuario    | Contraseña  |
| ---------- | ----------- |
| `testuser` | `Test1234!` |

Se crea automáticamente al levantar la base (`docker/mongo-init.js`). La API no
expone registro ni contiene código de creación de usuarios.

## Scripts

```bash
yarn dev            # web + api en paralelo
yarn dev:web        # solo frontend
yarn dev:api        # solo backend
yarn build          # compila ambos
yarn lint           # linta ambos
yarn format         # formatea ambos

yarn db:up          # levanta MongoDB
yarn db:down        # lo detiene
yarn db:reset       # borra los datos y vuelve a levantar
yarn db:logs        # sigue los logs del contenedor
```

## Notas

MongoDB se expone en el puerto **27018** en lugar del 27017 por defecto, para no
chocar con una instalación local de MongoDB que pudiera existir en la máquina.

Cada proyecto mantiene sus propias dependencias y su propio `yarn.lock`. Los
scripts de la raíz solo redirigen a `web/` o `api/`.
