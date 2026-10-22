### Crear el proyecto y elegir el motor

Creá un proyecto en blanco con el motor que prefieras:

* **Unity:** ideal para proyectos 2D/3D complejos, con un ecosistema robusto.  
* **Godot:** alternativa ligera y de código abierto para desarrollo ágil.  
* **Phaser:** recomendado para prototipado y ciclos de iteración rápida en entorno web.

Recomendamos **Phaser** para experimentar durante el workshop.

## Flujo de Trabajo A: Creación de GDD e Inclusión de Especificaciones

**Paso 1: Inicialización del Proyecto**

Ejecutar el siguiente comando para inicializar la plantilla base del proyecto en Phaser:

```sh
npx @phaserjs/create-game@latest
```

* **Plantilla minimal**  
* **Vite**  
* **JavaScript**

**Paso 2: Configuración del Entorno de Agente (SDD)**

Configurar la estructura para el desarrollo guiado por especificaciones con el taller habilitado:

```sh
npx create-agent-ready-unraf . --workshop --level=sdd
```

**Paso 3: Prompt para Elaboración del GDD**

Enviar la siguiente instrucción al agente de programación:

```sh
"Elabora un Documento de Diseño de Juego (GDD) para replicar las mecánicas y dinámicas del juego PONG clásico. Ten en cuenta las siguientes consideraciones:"
- Modalidad 1 vs 1 con soporte para dos jugadores en un mismo teclado.
- Condición de victoria: el primer jugador en alcanzar 3 puntos gana.
- Guardar la documentación dentro de la carpeta /docs.
"Si tienes alguna duda, consúltame antes de proceder con la generación."
```

## 

**Paso 4: Planificación de Próximos Pasos**

Solicitar al agente una sugerencia sobre la secuencia óptima para continuar con el desarrollo del proyecto.

```sh
"Recomienda con que seguir"
```

## 

## Flujo de Trabajo B: Generación de Especificaciones Técnicas (Specs)

**Paso 1: Inicialización del Proyecto**

Ejecutar el comando de instalación inicial de Phaser:

```sh
npx @phaserjs/create-game@latest
```

* **Plantilla minimal**  
* **Vite**  
* **JavaScript**

**Paso 2: Preparación del Entorno SDD**

Incorporar el módulo de conversión de GDD a SDD:

```sh
npx create-agent-ready-unraf . --level=sdd --add=gdd-to-sdd
```

**Paso 3: Integración del Documento GDD**

Copiar el documento GDD previamente generado y ubicarlo dentro del directorio docs/.

**Paso 4: Generación de Especificaciones**

Ejecutar la siguiente instrucción para generar las especificaciones (specs) a partir del GDD existente:

```sh
"Generar las specs a partir del GDD." "Si tienes alguna duda, consúltame antes de proceder con la generación."
```

**Paso 5: Planificación de Próximos Pasos**

Solicitar al agente una sugerencia sobre la secuencia óptima para continuar con el desarrollo del proyecto.

```sh
"Recomienda con que seguir"
```

