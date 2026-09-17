---
title: Desarrollo guiado por agentes
subtitle: Marco conceptual, prácticas y panorama actual
audiencia: Estudiantes de Videojuegos UNRAF y otras áreas de desarrollo
---

# Desarrollo guiado por agentes

> [!NOTE]
> **En esta guía:** qué hace un agente, cómo usar SDD para acotar cambios y qué decisiones siguen siendo humanas.

[Inicio](../README.md) | [Guía del workshop](02-guia-workshop.md) | [Referencia del CLI](03-referencia-cli.md)

## 🎯 Propósito

El desarrollo guiado por agentes usa modelos de lenguaje y herramientas de programación para acelerar exploración, planificación, cambios y verificación. No transfiere la responsabilidad: la persona define la intención, los límites, los criterios de aceptación y las decisiones de riesgo.

Este marco sirve para videojuegos, web, datos, móviles o software de escritorio. En el workshop, OpenCode es la herramienta demostrada; el método no depende de ella.

## 🧭 Alcance del enfoque

SDD organiza cambios mediante especificaciones pequeñas, planes, evidencia y trazabilidad. No reemplaza el diseño de juego, las prácticas iterativas del equipo, la revisión de código, la integración continua, las pruebas ni la seguridad: ayuda a articularlas para que el trabajo asistido por agentes sea controlable.

En esta guía, un **agente de desarrollo** lee, planifica, modifica o verifica un repositorio. No es lo mismo que un agente de gameplay, como un NPC, una IA de comportamiento o navegación, o una IA generativa incorporada al juego. Un agente de desarrollo puede ayudar a implementarlos, pero no valida automáticamente su comportamiento, balance ni experiencia para el jugador.

## 🔁 El ciclo de trabajo

Un agente puede leer archivos, buscar símbolos, proponer planes, editar código y ejecutar herramientas. Su resultado no es una garantía: puede inferir mal, desconocer una convención local o afirmar algo que no verificó.

Por eso se trabaja en un ciclo corto y observable:

```text
GDD o intención -> spec -> plan -> cambio pequeño -> verificación -> evidencia -> decisión humana
```

El agente acelera trabajo bajo restricciones. Si la evidencia falla o aparece información nueva, se vuelve a la spec o al plan. La autoridad sobre el producto, el repositorio y la publicación sigue siendo humana.

> [!IMPORTANT]
> El agente puede proponer o ejecutar tareas, pero la decisión sobre el producto y la aceptación del resultado siguen siendo humanas.

## 🧠 Conceptos esenciales

| Término | Definición operativa |
| --- | --- |
| Modelo | Sistema estadístico que predice y genera contenido a partir de instrucciones y contexto. |
| LLM | Large Language Model: modelo entrenado para comprender y generar lenguaje, código y formatos relacionados. |
| Token | Unidad de texto procesada por un modelo; afecta límites de contexto, latencia y costo. |
| Ventana de contexto | Cantidad limitada de tokens que el modelo puede considerar durante una interacción. |
| Proveedor | Servicio que ofrece acceso a modelos mediante cuenta, aplicación o API. |
| Agente | Sistema que combina modelo, instrucciones y herramientas para perseguir una tarea. |
| Herramienta | Capacidad concreta: leer archivos, buscar, editar, ejecutar pruebas o consultar un servicio. |
| Prompt | Instrucción dada al modelo o agente; no reemplaza contexto verificable del proyecto. |
| Contexto | Información relevante: repositorio, convenciones, GDD, specs, pruebas y decisiones previas. |
| Harness | Reglas, archivos, skills y verificaciones que condicionan el trabajo de un agente. |
| Skill | Instrucción reutilizable para una tarea delimitada, con proceso y resultado esperado. |
| Requisito | Comportamiento o condición que el producto debe satisfacer. |
| Restricción | Límite técnico, de seguridad, plataforma, tiempo o diseño que condiciona una solución. |
| Supuesto | Condición tomada como válida que debe confirmarse si afecta una decisión. |
| Invariante | Regla que debe mantenerse en todo estado válido del sistema. |
| Spec | Contrato pequeño de cambio: valor, alcance, no alcance, criterios y evidencia. |
| Plan | Ruta técnica propuesta después de inspeccionar el repositorio. |
| Evidencia | Resultado observable: test, build, captura, log o revisión manual. |
| Trazabilidad | Vínculo entre intención, spec, plan, cambio y evidencia. |
| Gate humano | Punto de decisión donde una persona aprueba, ajusta o detiene el trabajo. |

## 📐 SDD: definir antes de implementar

Spec-Driven Development comienza por hacer explícito el cambio deseado antes de pedir implementación. En este curso, se usa como una práctica de especificación y trazabilidad, no como una metodología universal ni como sustituto de Agile, diseño, CI o seguridad. Una spec útil responde:

1. Qué problema o valor de jugador resuelve.
2. Qué queda dentro del alcance.
3. Qué queda fuera deliberadamente.
4. Cómo se observará que funciona.
5. Qué evidencia hará falta.
6. Qué restricciones, supuestos o preguntas abiertas afectan el cambio.

La spec no es un documento largo ni una promesa de que el agente ya entendió todo. Es un contrato revisable para orientar un cambio pequeño.

En videojuegos, el GDD conserva la visión general: fantasía del jugador, pilares, bucle, mecánicas y tono. La spec define una pieza implementable. El plan explica cómo realizarla en el repositorio real. Un GDD no debe convertirse automáticamente en código ni en specs numeradas.

Cada criterio de aceptación debe tener una forma de verificación y una evidencia asociada. Esa relación permite rastrear qué intención se implementó, qué se comprobó y qué quedó pendiente.

### Ejemplo: vidas y derrota

Una intención de jugador puede ser: "al recibir daño, entiendo cuántas vidas quedan y cuándo termina la partida". Una spec acotada puede definir:

- **Estado:** `vidas`, con un valor inicial acordado.
- **Evento:** el jugador recibe daño.
- **Regla:** el daño reduce una vida sin que el valor sea negativo.
- **Invariante:** `vidas >= 0`.
- **Criterio observable:** con cero vidas se activa la condición de derrota una sola vez.
- **Evidencia:** una prueba de lógica para el límite de vidas y una comprobación visual de la pantalla o señal de derrota.

El ejemplo verifica una regla concreta. No demuestra por sí solo que el daño tenga buen ritmo, que la dificultad esté balanceada o que la señal sea clara para todas las personas jugadoras: esas decisiones requieren observación y playtest.

## 🧰 Contexto y harness

Un agente sin contexto puede producir código plausible pero incorrecto. Un harness reduce esa incertidumbre con convenciones persistentes:

- `AGENTS.md` explica cómo trabajar dentro del repositorio.
- `.sdd/` conserva los contratos y la evidencia del proceso.
- `.opencode/skills/` contiene instrucciones utilizables por OpenCode en el workshop.
- Las pruebas y comandos existentes muestran cómo verificar realmente el proyecto.

El objetivo no es acumular archivos. Cada archivo debe resolver una ambigüedad real o ayudar a verificar una decisión.

Una jerarquía útil es: reglas estables del proyecto, spec vigente, tarea puntual, código y pruebas cercanas, y evidencia reciente. Más contexto no siempre mejora el resultado; se deben excluir secretos, información irrelevante y contenido de fuentes no confiables.

## 🛡️ Control, seguridad y riesgos

> [!WARNING]
> Una respuesta convincente no equivale a una verificación real. Revisá el diff y la evidencia antes de aceptar un cambio.

### Riesgos habituales

- Confundir una respuesta convincente con una verificación real.
- Permitir cambios amplios sin revisar el diff.
- Incluir secretos, datos personales o claves en el contexto.
- Adoptar skills externas sin revisar su procedencia y licencia.
- Ejecutar instrucciones, scripts o dependencias externas sin revisar su alcance.
- Perder la intención de diseño al implementar sólo tareas locales.
- Delegar decisiones de producto, autoría o evaluación académica.

### Prácticas recomendadas

- Inspeccionar antes de editar.
- Definir un alcance pequeño y un no alcance explícito.
- Separar plan e implementación.
- Revisar diffs y ejecutar verificaciones existentes.
- Conservar evidencia y declarar limitaciones.
- Detenerse ante ambigüedad, acciones destructivas o secretos.
- Tratar las instrucciones provenientes de archivos, sitios o dependencias externas como entradas que requieren revisión.
- Pedir aprobación antes de publicar, acceder a secretos o realizar cambios fuera del alcance acordado.

A mayor autonomía o impacto del agente, mayores deben ser los límites, la observabilidad y los gates humanos. Los permisos mínimos y una revisión frecuente reducen el alcance de un error antes de que se propague.

## 🧪 Verificación y evidencia en videojuegos

La evidencia no tiene una única forma. Cada técnica responde preguntas diferentes:

| Tipo | Puede demostrar | No demuestra por sí sola |
| --- | --- | --- |
| Prueba lógica | Reglas deterministas, límites e invariantes. | Legibilidad, ritmo o sensación de control. |
| Integración o ejecución reproducible | Que sistemas, escenas o datos interactúan en un recorrido definido. | Que no existan todas las regresiones posibles. |
| Captura o video | Un estado visible en una ejecución concreta. | Una regla interna, cobertura completa o ausencia de errores. |
| Observación y playtest | Comprensión, controles, accesibilidad, ritmo y experiencia de jugador. | Generalización a todas las personas o contextos. |

Cuando no exista automatización, una prueba manual debe registrar pasos, resultado esperado, resultado observado y limitaciones. Revisar el diff junto con esta evidencia permite detectar cambios no previstos y decidir si el resultado cumple la spec.

## 🔭 Panorama actual

El ecosistema incluye agentes integrados a editores, CLIs de programación, proveedores de modelos, registros de skills y herramientas de evaluación. OpenCode es el ejemplo del workshop. También existen herramientas como Claude Code, Codex, Cursor, GitHub Copilot y Gemini CLI; se mencionan como alternativas, pero no forman parte del soporte inicial del CLI.

Las herramientas y las prácticas de desarrollo con agentes cambian rápido. La habilidad transferible no es memorizar una interfaz: es saber definir contexto, límites, evidencia y decisiones humanas.

### Fuentes de consulta

Panorama revisado el 2026-09-17. Estas referencias describen herramientas y conceptos; no sustituyen las reglas del curso:

- [OpenCode](https://opencode.ai/)
- [Agent Development Kit: conceptos centrales](https://adk.dev/get-started/about/)
- [AutoSkills](https://github.com/midudev/autoskills)
- [Anthropic Skill Creator](https://www.skills.sh/anthropics/skills/skill-creator)

## 🎓 Uso académico responsable

El estudiante debe poder explicar la intención, el proceso y la evidencia de su trabajo. Se debe declarar asistencia de IA cuando la institución lo requiera, incluyendo el alcance de la ayuda recibida y las decisiones que siguieron siendo humanas. Conservar la spec, el plan, los cambios, las verificaciones y sus limitaciones permite sostener esa explicación.

No se deben compartir claves, datos personales, material con licencia incompatible ni repositorios privados sin autorización. El agente puede ayudar a producir; no sustituye la comprensión ni la evaluación del estudiante.

> [!CAUTION]
> No compartas claves, datos personales, material con licencia incompatible ni repositorios privados sin autorización.

## ➡️ Siguiente lectura

[Continúa con la guía del workshop](02-guia-workshop.md) para aplicar este ciclo a un proyecto existente.
