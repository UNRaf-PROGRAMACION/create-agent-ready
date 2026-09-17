# create-agent-ready-unraf

Prepara un proyecto existente para desarrollo guiado por agentes y Spec-Driven Development (SDD). Incluye un harness mínimo, plantillas de trabajo y complementos para el workshop de Videojuegos UNRAF.

El CLI no crea un juego, no modifica gameplay ni instala dependencias por defecto. Agrega contexto y estructuras para que las decisiones, la verificación y la evidencia sigan siendo responsabilidad de las personas.

## Inicio rápido

Desde la raíz de un proyecto existente, primero revisa los cambios y luego aplícalos:

```bash
npx create-agent-ready-unraf . --level=sdd --dry-run
npx create-agent-ready-unraf . --level=sdd
```

Con este nivel se crean `AGENTS.md`, `.sdd/` y otros archivos de apoyo para definir cambios pequeños, planificarlos y registrar evidencia.

## Elegí un nivel

| Nivel | Elegilo si necesitás | Agrega |
| --- | --- | --- |
| `base` | Usar agentes con reglas y verificación, sin proceso SDD. | `AGENTS.md`, descubrimiento y verificación. |
| `sdd` | Definir y verificar cambios pequeños antes de implementarlos. | Todo lo de `base`, más specs, planes y evidencia. |
| `sdd-pro` | Sostener un proceso con mayor trazabilidad. | Todo lo de `sdd`, más tareas, riesgos, rollback y autopsia. |

```bash
npx create-agent-ready-unraf . --level=base
npx create-agent-ready-unraf . --level=sdd
npx create-agent-ready-unraf . --level=sdd-pro
```

## Complementos

### Workshop de videojuegos

Agrega material para las dos jornadas: una idea de juego, un GDD breve y checklists de práctica.

```bash
npx create-agent-ready-unraf . --level=sdd --workshop
```

### Relacionar GDD y specs

Agrega una guía que ayuda a comparar un GDD con las specs existentes. No genera specs ni código automáticamente.

```bash
npx create-agent-ready-unraf . --level=sdd --add=gdd-to-sdd
```

### Descubrir skills externas

AutoSkills puede recomendar o instalar skills externas. Requiere Node.js `>=22.6` y la instalación siempre es una decisión explícita.

```bash
# Ver recomendaciones sin instalar contenido externo.
npx create-agent-ready-unraf . --skills=discover

# Instalar skills externas después de revisarlas.
npx create-agent-ready-unraf . --skills=install
```

## Uso seguro

```bash
# Revisar los archivos que se escribirían.
npx create-agent-ready-unraf . --level=sdd --dry-run

# Diagnosticar el proyecto, Git, Node y archivos relevantes.
npx create-agent-ready-unraf . --doctor

# Actualizar sólo archivos registrados previamente por este CLI.
npx create-agent-ready-unraf . --level=sdd --force
```

`--force` no permite reemplazar archivos propios del proyecto: sólo actualiza rutas registradas en `.agent-ready/manifest.json`.

## Qué crea el CLI

| Ruta | Propósito |
| --- | --- |
| `AGENTS.md` | Acuerdo persistente de trabajo para agentes dentro del repositorio. |
| `.sdd/` | Specs, planes, evidencia y trazabilidad del proceso. |
| `.opencode/skills/` | Adaptaciones de skills para los ejemplos con OpenCode. |
| `.agent-ready/manifest.json` | Registro de archivos generados; protege los archivos propios. |

El método es independiente del proveedor, modelo o motor de juegos. OpenCode se usa como ejemplo en el workshop, pero no es un requisito del proceso.

## Documentación

Seguí esta ruta para conocer el método y usarlo en un proyecto:

1. [Marco conceptual](docs/01-marco-conceptual.md): principios, vocabulario, riesgos y uso responsable.
2. [Guía del workshop](docs/02-guia-workshop.md): recorrido práctico de dos jornadas, desde el GDD hasta la evidencia.
3. [Referencia rápida del CLI](docs/03-referencia-cli.md): niveles, opciones, archivos generados y ejemplos.

## Desarrollo

Se requiere Node.js 18 o superior.

```bash
npm test
npm run check
npm pack --dry-run
```

## Proyecto

- [Cómo contribuir](CONTRIBUTING.md)
- [Política de seguridad](SECURITY.md)
- [Historial de cambios](CHANGELOG.md)
- [Licencia MIT](LICENSE)
