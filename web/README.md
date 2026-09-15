# Web — Geest

Frontend en **React 19 + TypeScript** con **Vite** y **MUI 9**. Consume la API del
proyecto: no lee datos de ningún archivo local.

## Puesta en marcha

```bash
yarn install
yarn dev        # http://localhost:5173
```

Necesita la API corriendo en `http://localhost:4000/api`. Para levantar API y frontend
juntos, desde la raíz del repositorio: `yarn dev`.

La URL de la API se toma de `VITE_API_URL`. Si no está definida se usa
`http://localhost:4000/api`.

## Scripts

```bash
yarn dev        # desarrollo con recarga
yarn build      # typecheck y compilación a dist/
yarn preview    # sirve lo ya compilado
yarn lint
yarn format
```

## Cómo está organizado

```
src/
├── pages/        una carpeta por vista: index.tsx (maquetado) + useHook.ts (estado)
├── services/     por dominio: services.ts (llamadas), mutation.ts (React Query), index.ts
├── components/   piezas compartidas, como el modal
├── redux/        la sesión, persistida con redux-persist
├── schemas/      validaciones con Yup
├── routes/       rutas y guard de sesión
└── utils/        instancia de axios e interceptores
```

Las vistas nunca llaman a la API directamente: pasan por el hook de su dominio.
**TanStack Query** cachea los datos del servidor y **Redux Toolkit** guarda la sesión.
Los formularios usan **Formik + Yup**.

Las decisiones técnicas y el despliegue están en el [README de la raíz](../README.md).
