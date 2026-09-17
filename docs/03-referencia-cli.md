---
title: Referencia rápida de create-agent-ready-unraf
---

# Referencia rápida del CLI

> **Uso habitual:** preparar el proyecto actual con SDD y revisar los cambios antes de escribirlos.

```bash
npx create-agent-ready-unraf . --level=sdd --dry-run
```

[Inicio](../README.md) | [Marco conceptual](01-marco-conceptual.md) | [Guía del workshop](02-guia-workshop.md)

## Sintaxis

```bash
npx create-agent-ready-unraf [directorio] [opciones]
```

El punto (`.`) significa "el directorio actual". Si la terminal está abierta en la raíz del proyecto, el comando prepara ese proyecto.

```bash
# Preparar el proyecto actual.
npx create-agent-ready-unraf . --level=sdd

# Preparar una carpeta existente.
npx create-agent-ready-unraf mi-juego --level=sdd
```

## Niveles de preparación

| Opción | Caso de uso | Resultado |
| --- | --- | --- |
| `--level=base` | Reglas y verificación sin SDD. | `AGENTS.md`, descubrimiento y verificación. |
| `--level=sdd` | Cambios pequeños definidos antes de implementar. | Base más templates de spec, plan y evidencia. |
| `--level=sdd-pro` | Proceso sostenido con mayor trazabilidad. | SDD más tareas, trazabilidad, riesgos, rollback y autopsia. |

## Opciones por objetivo

### Material del workshop

| Opción | Qué hace |
| --- | --- |
| `--workshop` | Agrega guías, checklist, idea de juego y GDD breve para el workshop. |
| `--add=gdd-to-sdd` | Agrega la skill que guía la relación entre GDD y specs. Requiere `--level=sdd` o `--level=sdd-pro`. |

### Skills externas

| Opción | Qué hace |
| --- | --- |
| `--skills=discover` | Ejecuta AutoSkills en vista previa. Requiere Node.js `>=22.6`. |
| `--skills=install` | Ejecuta AutoSkills después de confirmar. Requiere Node.js `>=22.6`. |

Usar `--skills` por sí solo no genera archivos: permite descubrir o instalar skills en un proyecto ya preparado. Combinarlo con `--level` aplica ambas acciones.

### Inspección y actualización segura

| Opción | Qué hace |
| --- | --- |
| `--dry-run` | Muestra los archivos que se escribirían sin modificar el proyecto. |
| `--doctor` | Reporta el estado del entorno y la preparación del proyecto. |
| `--force` | Reemplaza sólo archivos generados y registrados previamente por este CLI. |

> **Atención:** `--force` no habilita a modificar archivos propios del proyecto. Sólo reemplaza rutas registradas en `.agent-ready/manifest.json`.

## Archivos generados

| Ruta | Uso |
| --- | --- |
| `AGENTS.md` | Reglas de trabajo persistentes para agentes. |
| `.agent-ready/manifest.json` | Registro de archivos generados y protección contra sobrescritura. |
| `.opencode/skills/` | Skills del ejemplo OpenCode. |
| `.sdd/templates/` | Plantillas de specs, planes, evidencia y prácticas pro. |
| `docs/game/` | Idea de juego y GDD breve, cuando se usa `--workshop`. |

## Ejemplos frecuentes

```bash
# Proyecto listo para usar agentes, sin SDD.
npx create-agent-ready-unraf . --level=base

# SDD mínimo para un proyecto de software.
npx create-agent-ready-unraf . --level=sdd

# Revisar archivos antes de preparar un proyecto.
npx create-agent-ready-unraf . --level=sdd --dry-run

# Diagnosticar proyecto, Git, Node y archivos relevantes.
npx create-agent-ready-unraf . --doctor

# Workshop de videojuegos con alineación GDD y specs.
npx create-agent-ready-unraf . --level=sdd --workshop --add=gdd-to-sdd

# Proceso SDD con prácticas de trazabilidad.
npx create-agent-ready-unraf . --level=sdd-pro
```

## Problemas frecuentes

| Situación | Qué revisar |
| --- | --- |
| El CLI detecta archivos existentes. | Ejecutar primero con `--dry-run`. El CLI protege archivos que no generó. |
| Se necesita actualizar archivos del harness. | Usar `--force` sólo si fueron registrados previamente en `.agent-ready/manifest.json`. |
| AutoSkills no se ejecuta. | Verificar que Node.js sea `>=22.6`, o ejecutar el scaffold sin `--skills`. |
| Se quiere usar `gdd-to-sdd`. | Usar un nivel `sdd` o `sdd-pro`; no está disponible con `base`. |

## Continuar

Para entender el proceso antes de aplicarlo, leer el [marco conceptual](01-marco-conceptual.md). Para seguir la práctica completa, abrir la [guía del workshop](02-guia-workshop.md).
