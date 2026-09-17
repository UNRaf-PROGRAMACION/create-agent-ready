---
title: Desarrollo Guiado por Agentes
subtitle: Marco conceptual, prácticas y panorama actual
audiencia: Estudiantes de Videojuegos UNRAF y otras áreas de desarrollo
---

# Desarrollo Guiado por Agentes

## Propósito

El desarrollo guiado por agentes usa modelos de lenguaje y herramientas de programación para acelerar exploración, planificación, cambios y verificación. No transfiere la responsabilidad: la persona define intención, límites, criterios de aceptación y decisiones de riesgo.

Este marco se puede usar en videojuegos, web, datos, móviles o software de escritorio. En el workshop, OpenCode es la herramienta demostrada; el método no depende de ella.

## Modelo mental

Un agente puede leer archivos, buscar símbolos, proponer planes, editar código y ejecutar herramientas. Su resultado no es una garantía: puede inferir mal, desconocer una convención local o afirmar algo que no verificó. Por eso se trabaja en un ciclo corto:

```text
contexto -> spec -> plan -> cambio pequeño -> verificación -> evidencia -> decisión humana
```

El agente acelera trabajo bajo restricciones. La autoridad sobre el producto, el repositorio y la publicación sigue siendo humana.

## Glosario

| Término | Definición operativa |
| --- | --- |
| Modelo | Sistema estadístico que predice y genera contenido a partir de instrucciones y contexto. |
| LLM | Large Language Model: modelo entrenado para comprender y generar lenguaje, código y formatos relacionados. |
| Token | Unidad de texto procesada por un modelo. Afecta límites de contexto, latencia y costo. |
| Ventana de contexto | Cantidad limitada de tokens que el modelo puede considerar durante una interacción. |
| Proveedor | Servicio que ofrece acceso a modelos mediante cuenta, aplicación o API. |
| Agente | Sistema que combina modelo, instrucciones y herramientas para perseguir una tarea. |
| Herramienta | Capacidad concreta: leer archivos, buscar, editar, ejecutar pruebas o consultar un servicio. |
| Prompt | Instrucción dada al modelo o agente. No reemplaza contexto verificable del proyecto. |
| Contexto | Información relevante: repositorio, convenciones, GDD, specs, pruebas y decisiones previas. |
| Harness | Conjunto de reglas, archivos, skills y verificaciones que condicionan el trabajo de un agente. |
| Skill | Instrucción reutilizable para una tarea delimitada, con proceso y resultado esperado. |
| Spec | Contrato pequeño de cambio: valor, alcance, no alcance, criterios y evidencia. |
| Plan | Ruta técnica propuesta después de inspeccionar el repositorio. |
| Evidencia | Resultado observable: test, build, diff, captura, log o revisión manual. |
| Gate humano | Punto de decisión donde una persona aprueba, ajusta o detiene el trabajo. |

## SDD

Spec-Driven Development comienza por hacer explícito qué cambio se desea antes de pedir implementación. Una spec útil responde:

1. ¿Qué problema o valor de jugador resuelve?
2. ¿Qué queda dentro del alcance?
3. ¿Qué queda fuera deliberadamente?
4. ¿Cómo se observará que funciona?
5. ¿Qué evidencia hará falta?

La spec no es un documento largo ni una promesa de que el agente ya entendió todo. Es un contrato revisable para orientar un cambio pequeño.

En videojuegos, el GDD conserva la visión general: fantasía del jugador, pilares, bucle, mecánicas y tono. La spec define una pieza implementable. Un GDD no debe convertirse automáticamente en código ni en specs numeradas.

## Contexto Y Harness

Un agente sin contexto puede producir código plausible pero incorrecto. Un harness reduce esa incertidumbre con convenciones persistentes:

- `AGENTS.md` explica cómo trabajar dentro del repositorio.
- `.sdd/` conserva los contratos y la evidencia del proceso.
- `.opencode/skills/` contiene instrucciones utilizables por OpenCode en el workshop.
- Las pruebas y comandos existentes muestran cómo verificar realmente el proyecto.

El objetivo no es acumular archivos. Cada archivo debe resolver una ambigüedad real o ayudar a verificar una decisión.

## Control Y Riesgos

Riesgos habituales:

- Confundir una respuesta convincente con una verificación real.
- Permitir cambios amplios sin revisar el diff.
- Incluir secretos, datos personales o claves en el contexto.
- Adoptar skills externas sin revisar su procedencia y licencia.
- Perder la intención de diseño al implementar sólo tareas locales.
- Delegar decisiones de producto, autoría o evaluación académica.

Prácticas recomendadas:

- Inspeccionar antes de editar.
- Definir un alcance pequeño y un no alcance explícito.
- Separar plan e implementación.
- Revisar diffs y ejecutar verificaciones existentes.
- Conservar evidencia y declarar limitaciones.
- Detenerse ante ambigüedad, acciones destructivas o secretos.

## Panorama Actual

El ecosistema incluye agentes integrados a editores, CLIs de programación, proveedores de modelos, registries de skills y herramientas de evaluación. OpenCode es el ejemplo del workshop. También existen herramientas como Claude Code, Codex, Cursor, GitHub Copilot y Gemini CLI; se mencionan como alternativas, pero no forman parte del soporte inicial del CLI.

Las herramientas cambian rápido. La habilidad transferible no es memorizar una interfaz: es saber definir contexto, límites, evidencia y decisiones humanas.

### Fuentes de consulta

Panorama revisado el 2026-09-17. Estas referencias describen herramientas y conceptos, no sustituyen las reglas del curso:

- [OpenCode](https://opencode.ai/)
- [Agent Development Kit: conceptos centrales](https://adk.dev/get-started/about/)
- [AutoSkills](https://github.com/midudev/autoskills)
- [Anthropic Skill Creator](https://www.skills.sh/anthropics/skills/skill-creator)

## Uso Académico Responsable

El estudiante debe poder explicar la intención, el proceso y la evidencia de su trabajo. Se debe declarar asistencia de IA cuando la institución lo requiera. No se deben compartir claves, datos personales, material con licencia incompatible ni repositorios privados sin autorización. El agente puede ayudar a producir; no sustituye la comprensión ni la evaluación del estudiante.
