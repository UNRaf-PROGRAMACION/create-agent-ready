---
title: Workshop de desarrollo guiado por agentes
duration: 4 horas en dos jornadas de 2 horas
audience: Estudiantes de Videojuegos UNRAF
---

# Workshop: del GDD a una spec y un cambio verificable

> **Resultado esperado:** terminar con un proyecto preparado para trabajar con agentes, una primera spec aprobada y un plan técnico basado en evidencia del repositorio.

[Inicio](../README.md) | [Marco conceptual](01-marco-conceptual.md) | [Referencia del CLI](03-referencia-cli.md)

## Antes de empezar

### Necesitás

- Node.js 18 o superior y Git instalados.
- Un proyecto existente creado con el motor o tecnología elegida.
- Una idea de juego o GDD previo; se acepta cualquier formato.
- La plantilla de GDD breve disponible como alternativa.

### Durante el workshop

Se instala OpenCode y se configuran modelos gratuitos. La herramienta es un ejemplo: el método sigue siendo aplicable a otros agentes.

> **Recordatorio:** no se autoriza código hasta haber inspeccionado el repositorio y aprobado una spec con alcance acotado.

## Jornada 1: contexto, harness y GDD

### Qué hace un agente

**Objetivo:** distinguir modelo, LLM, token, proveedor, agente, herramienta, contexto y evidencia.

Presentar que una salida plausible no equivale a una verificación. El agente ayuda a explorar, planificar, cambiar y comprobar, pero no decide por el equipo.

### SDD mínimo

**Objetivo:** entender cómo una idea se transforma en un cambio verificable.

```text
GDD o idea -> spec -> plan -> cambio -> evidencia -> decisión humana
```

El GDD explica por qué existe el juego y qué experiencia busca. La spec acota un cambio concreto y observable.

### Preparar el proyecto

**Objetivo:** instalar el harness sin sobrescribir archivos por sorpresa.

En la raíz del proyecto:

```bash
npx create-agent-ready-unraf . --level=sdd --workshop --dry-run
npx create-agent-ready-unraf . --level=sdd --workshop
```

Al finalizar, reconocer estos archivos:

| Ruta | Para qué sirve |
| --- | --- |
| `AGENTS.md` | Acuerdo de trabajo para agentes. |
| `.sdd/templates/` | Moldes para specs, planes y evidencia. |
| `docs/game/gdd-breve.md` | Punto de partida si no existe un GDD. |
| `.agent-ready/workshop/` | Checklist y guía de la práctica. |

### Definir la idea

**Objetivo:** registrar una visión suficiente para orientar el primer cambio.

Cada estudiante completa o adapta:

- Fantasía del jugador.
- Bucle principal.
- Pilares de diseño.
- Primera versión jugable.
- Elementos explícitamente fuera de alcance.

**Resultado:** una idea de juego o GDD breve disponible para consulta.

### Explorar antes de cambiar

**Objetivo:** obtener evidencia del proyecto antes de proponer una implementación.

Pedir al agente que inspeccione el repositorio en modo lectura. Debe informar estructura, motor, comandos de prueba y archivos relevantes. No se autoriza código todavía.

**Resultado:** información comprobable para decidir el alcance de la primera spec.

## Jornada 2: alinear, especificar y verificar

### Relación entre GDD y specs

**Objetivo:** separar la visión del juego de una unidad de trabajo implementable.

Se puede agregar la capacidad opcional de análisis:

```bash
npx create-agent-ready-unraf . --level=sdd --add=gdd-to-sdd
```

La skill no crea specs automáticamente. Hace preguntas y detecta diferencias entre el GDD y las specs existentes.

### Primera spec

**Objetivo:** acordar qué se hará, qué no y cómo se demostrará el resultado.

Elegir un cambio pequeño: movimiento básico, condición de derrota, interacción con un objeto o una regla de puntaje. Completar:

- Intención de jugador.
- Alcance y no alcance.
- Criterios observables.
- Evidencia: test, captura, video, build o prueba manual.

**Gate humano:** la persona aprueba la spec antes de pedir implementación.

### Plan técnico

**Objetivo:** decidir el camino de implementación a partir del repositorio real.

El agente inspecciona el proyecto y propone archivos, símbolos, pasos, verificación y condiciones de parada. La persona revisa el plan antes de permitir edición.

**Gate humano:** aprobar, ajustar o rechazar el plan.

### Cambio y evidencia

**Objetivo:** implementar sólo el cambio aprobado y demostrar su estado.

Implementar el alcance acordado, revisar el diff, ejecutar la verificación disponible y completar la plantilla de evidencia. Si no existe automatización, registrar los pasos de prueba manual y sus limitaciones.

**Gate humano:** aceptar el resultado o volver a la spec y al plan.

### Cierre

Responder:

1. ¿Qué pudo demostrar la evidencia?
2. ¿Qué quedó sin verificar?
3. ¿Qué debería actualizarse: GDD, spec o ambos?
4. ¿Qué decisión siguió siendo humana?

## Opcional: proveedores y seguridad

OpenCode puede conectarse a distintos proveedores y modelos. Para pasar de modelos gratuitos a opciones pagas, seguir la documentación vigente de OpenCode y del proveedor elegido.

> **Nunca** copiar una API key en `AGENTS.md`, una spec, un commit, una captura o un chat compartido. Usar variables de entorno o el mecanismo seguro recomendado por la herramienta.

Antes de elegir un proveedor pago, revisar modelo, límites, costo por token, privacidad y política institucional.

## Opcional: skills posteriores

AutoSkills puede sugerir skills según la tecnología del proyecto:

```bash
npx create-agent-ready-unraf . --skills=discover
```

La instalación es una decisión consciente porque descarga contenido externo:

```bash
npx create-agent-ready-unraf . --skills=install
```

Skill Creator se presenta como un recurso posterior para crear o mejorar una skill local cuando el equipo detecta una tarea repetitiva. El objetivo del workshop es construir software, no producir skills.

## Siguiente lectura

Consultá la [referencia rápida del CLI](03-referencia-cli.md) durante la práctica para revisar opciones, requisitos y ejemplos.
