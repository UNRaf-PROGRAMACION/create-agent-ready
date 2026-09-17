---
title: Workshop de Desarrollo Guiado por Agentes
duration: 4 horas en dos jornadas de 2 horas
audience: Estudiantes de Videojuegos UNRAF
---

# Workshop: Del GDD a una Spec y un Cambio Verificable

## Resultado esperado

Cada participante termina con un proyecto existente preparado para trabajar con agentes, una idea o GDD breve, una primera spec definida por la persona y un plan técnico basado en evidencia del repositorio. Si el tiempo y el proyecto lo permiten, inicia un cambio pequeño y guarda su evidencia.

## Preparación

Antes de la primera jornada:

- Node.js 18 o superior y Git instalados.
- Un proyecto existente creado con el motor o tecnología elegida.
- Una idea de juego o GDD previo. Se acepta cualquier formato.
- La plantilla de GDD breve disponible como alternativa.

Durante el workshop se instala OpenCode y se configuran modelos gratuitos. La herramienta es un ejemplo: el método sigue siendo aplicable a otros agentes.

## Jornada 1: Contexto, Harness Y GDD

### 0:00 a 0:20 - Qué hace un agente

Presentar modelo, LLM, token, proveedor, agente, herramienta, contexto y evidencia. Aclarar que una salida plausible no equivale a una verificación.

### 0:20 a 0:40 - SDD mínimo

Presentar el ciclo:

```text
GDD o idea -> spec -> plan -> cambio -> evidencia -> decisión humana
```

Comparar un GDD con una spec. El GDD explica por qué el juego existe y qué experiencia busca. La spec acota un cambio concreto.

### 0:40 a 1:05 - Preparar el proyecto

En la raíz del proyecto:

```bash
npx create-agent-ready-unraf . --level=sdd --workshop --dry-run
npx create-agent-ready-unraf . --level=sdd --workshop
```

Explicar los archivos principales:

- `AGENTS.md`: acuerdo de trabajo para agentes.
- `.sdd/templates/`: moldes para specs, planes y evidencia.
- `docs/game/gdd-breve.md`: punto de partida si no existe GDD.
- `.agent-ready/workshop/`: checklist de la práctica.

### 1:05 a 1:35 - Definir la idea

Cada estudiante completa o adapta:

- Fantasía del jugador.
- Bucle principal.
- Pilares de diseño.
- Primera versión jugable.
- Elementos explícitamente fuera de alcance.

### 1:35 a 2:00 - Explorar antes de cambiar

Pedir al agente que inspeccione el repositorio en modo lectura. Debe informar estructura, motor, comandos de prueba y archivos relevantes. No se autoriza código todavía.

## Jornada 2: Alinear, Especificar Y Verificar

### 0:00 a 0:25 - Relación GDD y specs

Agregar la capacidad opcional de análisis:

```bash
npx create-agent-ready-unraf . --level=sdd --add=gdd-to-sdd
```

La skill no crea specs automáticamente. Hace preguntas y detecta diferencias entre GDD y specs existentes.

### 0:25 a 0:55 - Primera spec

Elegir un cambio pequeño: movimiento básico, condición de derrota, interacción con un objeto o una regla de puntaje. Completar:

- Intención de jugador.
- Alcance y no alcance.
- Criterios observables.
- Evidencia: test, captura, video, build o prueba manual.

### 0:55 a 1:20 - Plan técnico

El agente inspecciona el proyecto y propone archivos, símbolos, pasos, verificación y condiciones de parada. La persona revisa el plan antes de permitir edición.

### 1:20 a 1:45 - Cambio y evidencia

Implementar sólo el cambio aprobado. Revisar diff, ejecutar la verificación disponible y completar la plantilla de evidencia. Si no existe automatización, registrar los pasos de prueba manual.

### 1:45 a 2:00 - Cierre

Responder:

1. ¿Qué pudo demostrar la evidencia?
2. ¿Qué quedó sin verificar?
3. ¿Qué debería actualizarse: GDD, spec o ambos?
4. ¿Qué decisión siguió siendo humana?

## Connect Provider

OpenCode puede conectarse a distintos proveedores y modelos. Para cambiar desde modelos gratuitos a opciones pagas, seguir la documentación vigente de OpenCode y del proveedor elegido. Nunca copiar una API key en `AGENTS.md`, una spec, un commit, una captura o un chat compartido. Usar variables de entorno o el mecanismo seguro recomendado por la herramienta.

Antes de elegir un proveedor pago, revisar modelo, límites, costo por token, privacidad y política institucional.

## Complementos Posteriores

AutoSkills puede sugerir skills según la tecnología del proyecto:

```bash
npx create-agent-ready-unraf . --skills=discover
```

La instalación es una decisión consciente porque descarga contenido externo:

```bash
npx create-agent-ready-unraf . --skills=install
```

Skill Creator se presenta como un recurso posterior para crear o mejorar una skill local cuando el equipo detecta una tarea repetitiva. El objetivo del workshop es construir software, no producir skills.
