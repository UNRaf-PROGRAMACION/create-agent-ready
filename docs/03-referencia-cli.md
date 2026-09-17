---
title: Referencia rápida de create-agent-ready-unraf
---

# Referencia Rápida

## Forma general

```bash
npx create-agent-ready-unraf [directorio] [opciones]
```

El punto (`.`) significa "el directorio actual". Si la terminal está abierta en la raíz del proyecto, el comando prepara ese proyecto.

```bash
npx create-agent-ready-unraf . --level=sdd
```

También se puede indicar una carpeta existente:

```bash
npx create-agent-ready-unraf mi-juego --level=sdd
```

## Niveles

| Comando | Qué agrega |
| --- | --- |
| `--level=base` | Harness sin SDD: `AGENTS.md`, descubrimiento y verificación. |
| `--level=sdd` | Base más templates de spec, plan y evidencia. |
| `--level=sdd-pro` | SDD más tareas, trazabilidad, riesgos, rollback y autopsia. |

## Complementos

| Opción | Qué hace |
| --- | --- |
| `--workshop` | Agrega guías, checklist, idea de juego y GDD breve para el workshop. |
| `--add=gdd-to-sdd` | Agrega la skill que guía GDD ↔ specs. Requiere nivel SDD. |
| `--skills=discover` | Ejecuta AutoSkills en vista previa. Requiere Node >=22.6. |
| `--skills=install` | Ejecuta AutoSkills después de confirmar. Requiere Node >=22.6. |

Usar `--skills` por sí solo no genera archivos: permite descubrir o instalar skills en un proyecto ya preparado. Combinarlo con `--level` aplica ambas acciones.

## Seguridad

```bash
# Ver archivos sin escribirlos.
npx create-agent-ready-unraf . --level=sdd --dry-run

# Diagnosticar proyecto, Git, Node y archivos relevantes.
npx create-agent-ready-unraf . --doctor

# Reemplazar sólo archivos ya registrados por este CLI.
npx create-agent-ready-unraf . --level=sdd --force
```

El CLI se niega a reemplazar archivos propios del proyecto. `--force` no habilita a modificar archivos que no estén en `.agent-ready/manifest.json`.

## Archivos Generados

| Ruta | Uso |
| --- | --- |
| `AGENTS.md` | Reglas de trabajo persistentes para agentes. |
| `.agent-ready/manifest.json` | Registro de archivos generados y protección contra sobrescritura. |
| `.opencode/skills/` | Skills del ejemplo OpenCode. |
| `.sdd/templates/` | Plantillas de specs, planes, evidencia y prácticas pro. |
| `docs/game/` | Idea de juego y GDD breve, cuando se usa `--workshop`. |

## Ejemplos

```bash
# Proyecto listo para usar agentes, sin SDD.
npx create-agent-ready-unraf . --level=base

# SDD mínimo para un proyecto de software.
npx create-agent-ready-unraf . --level=sdd

# Workshop de videojuegos con alineación GDD ↔ specs.
npx create-agent-ready-unraf . --level=sdd --workshop --add=gdd-to-sdd

# Proceso SDD con prácticas de trazabilidad.
npx create-agent-ready-unraf . --level=sdd-pro
```
