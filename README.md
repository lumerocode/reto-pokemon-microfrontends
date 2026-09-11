# Reto Pokemon Microfrontends

Aplicación Pokedex construida con React, TypeScript, Vite y Module Federation.

El proyecto está organizado como un monorepo pnpm con un shell principal y dos microfrontends:

- `apps/host`: shell de la aplicación, navegación, autenticación simulada, búsqueda, estado global e integración de remotes.
- `apps/mfe-detail`: microfrontend federado que muestra el detalle de un Pokemon.
- `apps/mfe-history`: microfrontend federado que muestra el historial de Pokemon visitados.
- `packages/shared`: contratos TypeScript y constantes compartidas entre aplicaciones.

## Requisitos

- Node.js 22 o superior.
- pnpm 12 o compatible con el lockfile.

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install
```

Para ejecutar las pruebas E2E por primera vez, instalar también el navegador de Playwright:

```bash
pnpm --filter host exec playwright install chromium
```

## Variables de entorno

El host incluye `apps/host/.env.example`:

```env
VITE_MFE_DETAIL_URL=http://localhost:3001
VITE_MFE_HISTORY_URL=http://localhost:3002
```

Estas variables permiten cambiar la ubicación de los microfrontends en staging, Docker o producción. Si no se definen, se utilizan los valores locales mostrados arriba.

## Acceso demo

La aplicación inicia en la pantalla de login. Para acceder al entorno demo utiliza:

```text
Username: Luis
Password: retotecnico
```

## Despliegue

La aplicación se desplegó en Vercel. La URL pública del shell es:

`https://reto-pokemon-microfrontends-host.vercel.app/`

Como el proyecto utiliza Module Federation, `host`, `mfe-detail` y `mfe-history` se desplegó como proyectos independientes en Vercel. 
En el proyecto del host, las variables `VITE_MFE_DETAIL_URL` y `VITE_MFE_HISTORY_URL` deben apuntar a las URLs públicas de los dos microfrontends, nunca a `localhost`.

## Ejecución local

### Shell y microfrontends

El comando recomendado construye los tres proyectos y levanta los servidores necesarios:

```bash
pnpm dev
```

La aplicación queda disponible en:

- Shell: `http://localhost:3000`
- `mfe-detail`: `http://localhost:3001`
- `mfe-history`: `http://localhost:3002`

El script `scripts/dev.mjs` ejecuta el shell en modo Vite dev y los microfrontends en modo preview. Por eso `pnpm dev` ejecuta primero un build completo.

Para levantar cada aplicación de forma independiente:

```bash
pnpm --filter host dev
pnpm --filter mfe-detail dev
pnpm --filter mfe-history dev
```

Cuando se pruebe la integración de modulos federados, `mfe-detail` y `mfe-history` deben estar disponibles en los puertos configurados antes de abrir el host.

## Scripts

Scripts de raíz:

| Comando | Descripción |
| --- | --- |
| `pnpm install` | Instala las dependencias del workspace. |
| `pnpm build` | Construye todas las aplicaciones dentro de `apps`. |
| `pnpm dev` | Construye el workspace y levanta shell y microfrontends. |

Scripts del host:

| Comando | Descripción |
| --- | --- |
| `pnpm --filter host build` | Typecheck y build de producción del shell. |
| `pnpm --filter host lint` | Ejecuta ESLint. |
| `pnpm --filter host test -- --run` | Ejecuta las pruebas unitarias y de componentes. |
| `pnpm --filter host e2e` | Ejecuta la prueba E2E de modulos federados con Playwright. |

Scripts de `mfe-history`:

| Comando | Descripción |
| --- | --- |
| `pnpm --filter mfe-history build` | Typecheck y build del remote. |
| `pnpm --filter mfe-history lint` | Ejecuta ESLint. |
| `pnpm --filter mfe-history test -- --run` | Ejecuta las pruebas del historial. |

Para `mfe-detail`:

```bash
pnpm --filter mfe-detail build
```

## Arquitectura y decisiones técnicas

### Module Federation

El host consume `mfe-detail/PokemonDetail` y `mfe-history/PokemonHistory` como remotes federados. El host controla la navegación y el ciclo de vida de los modals y los microfrontends reciben contratos explícitos mediante props.

### Estado y persistencia

Zustand se utiliza en el host como fuente para autenticación simulada, tema, selección, búsqueda e historial. La persistencia usa la clave `pokemon-app-storage`.

Cada Pokemon se guarda una sola vez por `id`. Al abrir nuevamente el detalle se incrementa `visitedCount` y se actualiza `lastVisited`.
El historial evita duplicados y se ordena por última visita.

### Shared package

`packages/shared` contiene contratos de dominio y constantes compartidas, como `PokemonHistoryItem`, `PokemonListItem`, `PokemonDetailResponse` y `POKEAPI_BASE_URL`. Los estilos específicos permanecen dentro de cada aplicación para evitar acoplamiento directo entre sus fuentes.

### Estilos de microfrontends

`mfe-history` se expone con `dontAppendStylesToHead` para evitar que su Tailwind global sobrescriba el responsive del navbar del host. El host escanea las utilities necesarias del historial, mientras `mfe-detail` carga su CSS sin que el host dependa de su código fuente.

### Historial de Pokemon

#### Estrategia elegida

El historial se mantiene en el store del host usando Zustand y la clave persistida `pokemon-app-storage`. Se eligió este enfoque porque el host controla la navegación y es el punto común desde el que se abren categorías, búsqueda y detalle. `mfe-history` recibe los datos mediante props y se encarga de presentarlos, sin mantener una segunda copia del historial.

La estrategia cubre los requisitos de la prueba técnica:

- **Guardar los Pokémon visitados:** al abrir un detalle se guarda el `id`, nombre e imagen del Pokémon.
- **Incrementar el contador:** si el Pokémon ya existe, `visitedCount` aumenta en uno y `lastVisited` se actualiza.
- **Evitar duplicados:** el `id` funciona como identificador único; nunca se agrega un segundo registro del mismo Pokémon.
- **Mantener persistencia:** Zustand persiste el historial en `localStorage`, por lo que se conserva entre recargas.

#### Estructura de datos

El ejemplo de la prueba técnica propone un campo `visits`. En este proyecto se eligió el nombre más explícito `visitedCount` y se añadió `lastVisited` para soportar el requisito de mostrar primero los Pokemon vistos recientemente:

```ts
{
	id: number;
	name: string;
	image: string;
	visitedCount: number;
	lastVisited: string;
}
```

`visitedCount` representa el equivalente funcional de `visits`, mientras que `lastVisited` permite ordenar el historial sin depender del orden original de inserción. La lista del microfrontend `mfe-history` se ordena por `lastVisited` descendente.

El host centraliza el estado del historial y la envía al microfrontend mediante props. Esto permite que `mfe-history` se encargue de la presentación y las acciones del modal, mientras que el host mantiene la persistencia y puede abrir el detalle seleccionado.

### Pruebas

El proyecto combina:

- Vitest y Testing Library para servicios, store y componentes.
- Pruebas propias de `mfe-history` para estado vacío, orden, contador, selección, limpieza y foco.
- Playwright para comprobar la federación real entre shell, detalle e historial en un navegador.