---
title: Referencia rápida de create-agent-ready-unraf
---

# Referencia rápida del CLI

> [!TIP]
> **Uso habitual:** preparar el proyecto actual con SDD y revisar las rutas antes de escribirlas.

```bash
npx create-agent-ready-unraf . --level=sdd --dry-run
```

[Inicio](../README.md) | [Marco conceptual](01-marco-conceptual.md) | [Guía del workshop](02-guia-workshop.md)

## ⌨️ Sintaxis

```bash
npx create-agent-ready-unraf [directorio] [opciones]
```

El punto (`.`) significa "el directorio actual". Si la terminal está abierta en la raíz del proyecto, el comando prepara ese proyecto. Para una práctica reproducible se puede fijar una versión publicada: `npx create-agent-ready-unraf@<version> . --level=sdd --dry-run`.

```bash
# Preparar el proyecto actual.
npx create-agent-ready-unraf . --level=sdd

# Preparar una carpeta existente.
npx create-agent-ready-unraf mi-juego --level=sdd
```

## 🧩 Niveles de preparación

| Opción | Caso de uso | Resultado |
| --- | --- | --- |
| `--level=base` | Reglas y verificación sin SDD. | `AGENTS.md`, descubrimiento y verificación. |
| `--level=sdd` | Cambios pequeños definidos antes de implementar. | Base más templates de spec, plan y evidencia. |
| `--level=sdd-pro` | Proceso sostenido con mayor trazabilidad. | SDD más tareas, trazabilidad, riesgos, rollback y autopsia. |

## 🎯 Opciones por objetivo

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

### 🛡️ Inspección y actualización segura

| Opción | Qué hace |
| --- | --- |
| `--dry-run` | Muestra las rutas que se escribirían sin modificar el proyecto; no muestra su contenido. |
| `--doctor` | Reporta el estado del entorno y la preparación del proyecto. |
| `--force` | Reemplaza sólo archivos generados y registrados previamente por este CLI. |

> [!WARNING]
> `--force` no habilita a modificar archivos propios del proyecto. Sólo reemplaza rutas registradas en `.agent-ready/manifest.json`. Un manifiesto de otro origen bloquea la operación para evitar sobrescribirlo.

## 📦 Archivos generados

| Ruta | Uso |
| --- | --- |
| `AGENTS.md` | Reglas de trabajo persistentes para agentes. |
| `.agent-ready/manifest.json` | Registro de archivos generados y protección contra sobrescritura. |
| `.opencode/skills/` | Skills del ejemplo OpenCode. |
| `.sdd/templates/` | Plantillas de specs, planes, evidencia y prácticas pro. |
| `.sdd/specs/`, `.sdd/plans/`, `.sdd/evidence/` | Destinos para las instancias reales copiadas desde las plantillas. |
| `docs/game/` | Idea de juego y GDD breve, cuando se usa `--workshop`. |

## 💡 Ejemplos frecuentes

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

## 🩺 Problemas frecuentes

| Situación | Qué revisar |
| --- | --- |
| El CLI detecta archivos existentes. | Ejecutar primero con `--dry-run`, que sólo lista rutas. El CLI protege archivos que no generó. |
| Se necesita actualizar archivos del harness. | Usar `--force` sólo si fueron registrados previamente en `.agent-ready/manifest.json`. |
| Ya existe un manifiesto de otro origen. | Mover el manifiesto o elegir otro directorio. El CLI no lo reemplaza. |
| AutoSkills no se ejecuta. | Verificar que Node.js sea `>=22.6`, o ejecutar el scaffold sin `--skills`. |
| Se quiere usar `gdd-to-sdd`. | Usar un nivel `sdd` o `sdd-pro`; no está disponible con `base`. |

## ➡️ Continuar

Para entender el proceso antes de aplicarlo, leer el [marco conceptual](01-marco-conceptual.md). Para seguir la práctica completa, abrir la [guía del workshop](02-guia-workshop.md).
