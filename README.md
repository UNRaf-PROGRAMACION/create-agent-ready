# create-agent-ready-unraf

Prepara un proyecto existente para desarrollo guiado por agentes. Ofrece un harness mínimo, Spec-Driven Development (SDD) y complementos para el workshop de Videojuegos UNRAF.

```bash
npx create-agent-ready-unraf . --level=sdd --workshop --add gdd-to-sdd
```

El comando no crea un juego, no modifica código de gameplay y no instala dependencias por defecto. Agrega instrucciones, plantillas y skills para que una persona conserve las decisiones y la evidencia del trabajo.

## Niveles

| Nivel | Uso | Agrega |
| --- | --- | --- |
| `base` | Usar agentes sin SDD | `AGENTS.md`, descubrimiento y verificación |
| `sdd` | SDD práctico | Specs, planes y evidencia |
| `sdd-pro` | Proyectos sostenidos | Tareas, trazabilidad, riesgos, rollback y autopsia |

```bash
npx create-agent-ready-unraf . --level=base
npx create-agent-ready-unraf . --level=sdd
npx create-agent-ready-unraf . --level=sdd-pro
```

## Complementos

```bash
# Material de las dos jornadas del workshop de videojuegos.
npx create-agent-ready-unraf . --level=sdd --workshop

# Guía GDD <-> specs; no genera specs ni código automáticamente.
npx create-agent-ready-unraf . --level=sdd --add gdd-to-sdd

# Ver qué skills recomendaría AutoSkills. Requiere Node >=22.6.
npx create-agent-ready-unraf . --skills=discover

# Instalar skills externas sólo con decisión explícita.
npx create-agent-ready-unraf . --skills=install
```

Use `--dry-run` para revisar cambios, `--doctor` para diagnosticar el proyecto y `--force` sólo para actualizar archivos generados previamente por este CLI.

## Convenciones

- `AGENTS.md`: acuerdo persistente para agentes dentro del repositorio.
- `.sdd/`: specs, planes, evidencia y trazabilidad.
- `.opencode/skills/`: adaptación de las skills para los ejemplos con OpenCode.
- `.agent-ready/manifest.json`: registro de archivos generados, usado para proteger archivos propios.

El método es agnóstico de proveedor y agente. OpenCode se usa como ejemplo del workshop; la configuración del proyecto no depende de un modelo pago ni de un motor de juegos concreto.

## Documentación

- [Marco conceptual](docs/01-marco-conceptual.md)
- [Guía del workshop](docs/02-guia-workshop.md)
- [Referencia rápida del CLI](docs/03-referencia-cli.md)

## Desarrollo

Requiere Node 18 o superior.

```bash
npm test
npm run check
npm pack --dry-run
```

La primera publicación pública se realizará como `create-agent-ready-unraf@0.1.0`.
