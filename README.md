# create-agent-ready-unraf

> Prepará un proyecto existente para desarrollo guiado por agentes y Spec-Driven Development (SDD), con contexto, límites y evidencia verificable.

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-ffbe5c.svg)](LICENSE)
[![Node.js 18 o superior](https://img.shields.io/badge/Node.js-%3E%3D18-7df9d1.svg)](https://nodejs.org/)
[![Deploy GitHub Pages](https://github.com/UNRaf-PROGRAMACION/create-agent-ready/actions/workflows/pages.yml/badge.svg)](https://github.com/UNRaf-PROGRAMACION/create-agent-ready/actions/workflows/pages.yml)

[![Abrir guías en línea](https://img.shields.io/badge/ABRIR_GU%C3%8DAS_EN_L%C3%8DNEA-7df9d1?style=for-the-badge&labelColor=080d1b)](https://unraf-programacion.github.io/create-agent-ready/)

[Repositorio](https://github.com/UNRaf-PROGRAMACION/create-agent-ready) | [Reportar un problema](https://github.com/UNRaf-PROGRAMACION/create-agent-ready/issues)

## 🧭 Qué hace

`create-agent-ready-unraf` prepara un proyecto que ya existe para trabajar con agentes de programación de forma observable. Agrega un harness mínimo: contexto persistente, plantillas para definir cambios pequeños y un registro que protege archivos propios del proyecto.

El CLI no crea un juego, no modifica gameplay ni instala dependencias en el proyecto objetivo por defecto. Tampoco reemplaza decisiones de producto, revisión humana ni verificación: las personas definen la intención, el alcance y la evidencia aceptable.

## 🔁 El ciclo de trabajo

```text
contexto -> spec -> plan -> cambio pequeño -> verificación -> evidencia -> decisión humana
```

El CLI prepara la estructura para sostener este ciclo. La persona sigue siendo responsable de revisar el repositorio, aprobar la spec, decidir el plan y evaluar el resultado.

## ⚡ Inicio rápido

Desde la raíz de un proyecto existente, revisá primero las rutas que se escribirían y aplicá el cambio sólo después de inspeccionarlas:

```bash
npx create-agent-ready-unraf . --level=sdd --dry-run
npx create-agent-ready-unraf . --level=sdd
```

> [!IMPORTANT]
> `--dry-run` muestra rutas, no el contenido de los archivos. Aplicá cambios sólo después de inspeccionar las rutas propuestas; luego revisá el diff local.

El nivel `sdd` agrega `AGENTS.md`, `.sdd/` y otros archivos de apoyo para definir cambios pequeños, planificarlos y registrar evidencia.

## 🧩 Elegí un nivel

| Nivel | Elegilo si necesitás | Agrega |
| --- | --- | --- |
| `base` | Reglas y verificación para trabajar con agentes, sin proceso SDD. | `AGENTS.md`, descubrimiento y verificación. |
| `sdd` | Definir y verificar cambios pequeños antes de implementar. | Todo lo de `base`, más specs, planes y evidencia. |
| `sdd-pro` | Sostener un proceso con mayor trazabilidad. | Todo lo de `sdd`, más tareas, riesgos, rollback y autopsia. |

```bash
npx create-agent-ready-unraf . --level=base
npx create-agent-ready-unraf . --level=sdd
npx create-agent-ready-unraf . --level=sdd-pro
```

Consultá la [referencia rápida del CLI](docs/03-referencia-cli.md) para conocer todas las opciones y ejemplos.

## 📦 Qué agrega al proyecto

| Ruta | Propósito |
| --- | --- |
| `AGENTS.md` | Acuerdo persistente de trabajo para agentes dentro del repositorio. |
| `.sdd/` | Plantillas y carpetas para specs, planes, evidencia y trazabilidad del proceso. |
| `.opencode/skills/` | Adaptaciones de skills para los ejemplos con OpenCode. |
| `.agent-ready/manifest.json` | Registro de archivos generados; protege los archivos propios. |

El método es independiente del proveedor, modelo o motor de juegos. OpenCode se usa como ejemplo en el workshop, pero no es un requisito del proceso.

## 🧰 Complementos

### Workshop de videojuegos

Agrega material para dos jornadas: una idea de juego, un GDD breve y checklists de práctica.

```bash
npx create-agent-ready-unraf . --level=sdd --workshop
```

### Relacionar GDD y specs

Agrega una guía para comparar un GDD con las specs existentes. No genera specs ni código automáticamente.

```bash
npx create-agent-ready-unraf . --level=sdd --add=gdd-to-sdd
```

### Descubrir skills externas

AutoSkills puede recomendar o instalar skills externas. Requiere Node.js `>=22.6`; la instalación siempre es una decisión explícita después de revisar el contenido.

```bash
# Ver recomendaciones sin instalar contenido externo.
npx create-agent-ready-unraf . --skills=discover

# Instalar skills externas después de revisarlas.
npx create-agent-ready-unraf . --skills=install
```

## 🛡️ Uso seguro

```bash
# Revisar los archivos que se escribirían.
npx create-agent-ready-unraf . --level=sdd --dry-run

# Diagnosticar el proyecto, Git, Node y archivos relevantes.
npx create-agent-ready-unraf . --doctor

# Actualizar sólo archivos registrados previamente por este CLI.
npx create-agent-ready-unraf . --level=sdd --force
```

> [!WARNING]
> `--force` no permite reemplazar archivos propios del proyecto. Sólo actualiza rutas registradas previamente en `.agent-ready/manifest.json`. Si ya existe un manifiesto de otro origen, el CLI se detiene sin reemplazarlo.

Antes de aceptar un cambio, inspeccioná el diff, ejecutá las verificaciones disponibles y registrá las limitaciones.

> [!CAUTION]
> Nunca incluyas claves, datos personales o material sin autorización en el contexto compartido con un agente.

## 📚 Documentación

**[Abrí las guías en línea ->](https://unraf-programacion.github.io/create-agent-ready/)**

Seguí esta ruta para entender el método y aplicarlo a un proyecto:

1. [Marco conceptual](docs/01-marco-conceptual.md): principios, vocabulario, riesgos y uso responsable.
2. [Guía del workshop](docs/02-guia-workshop.md): recorrido práctico de dos jornadas, desde el GDD hasta la evidencia.
3. [Referencia rápida del CLI](docs/03-referencia-cli.md): niveles, opciones, archivos generados y ejemplos.

Los Markdown se mantienen en el repositorio como fuente de contenido y para facilitar contribuciones. Dentro de un proyecto preparado, copiá las plantillas de `.sdd/templates/` a `.sdd/specs/`, `.sdd/plans/` o `.sdd/evidence/`; usá el mismo identificador en los registros relacionados.

## 🎓 Uso académico responsable

El estudiante debe poder explicar la intención, el proceso y la evidencia de su trabajo. Se debe declarar asistencia de IA cuando la institución lo requiera. No se deben compartir claves, datos personales, material con licencia incompatible ni repositorios privados sin autorización.

El agente puede ayudar a producir; no sustituye la comprensión ni la evaluación. Para ampliar estos criterios, consultá el [marco conceptual](docs/01-marco-conceptual.md).

## 🔧 Desarrollo

Se requiere Node.js 18 o superior. Para workshops reproducibles se puede fijar la versión publicada, por ejemplo `npx create-agent-ready-unraf@<version> . --level=sdd --dry-run`.

```bash
npm test
npm run check
npm run pack:check
```

`npm run check` valida el CLI, sus pruebas y el build de documentación. `npm run pack:check` confirma qué archivos entrarán al paquete publicado en npm.

## 🤝 Proyecto

- [Cómo contribuir](CONTRIBUTING.md)
- [Política de seguridad](SECURITY.md)
- [Historial de cambios](CHANGELOG.md)
- [Licencia MIT](LICENSE)
