# Feedback y conclusiones de la prueba técnica

## Contexto de la evaluación

En esta prueba quise automatizar lo más importante sin perder de vista que las validaciones se ejecutan contra servicios externos.

- SauceDemo para validar el flujo de compra por interfaz.
- Restful Booker para validar el ciclo de vida de una reserva por API.
- JMeter para medir cómo responde `GET /booking` bajo carga.
- GitHub Actions para que la ejecución sea repetible y deje evidencia.

La evaluación se basa en los escenarios desarrollados y la ejecución realizada. No se identificaron defectos en los flujos cubiertos, aunque esa conclusión aplica al alcance y al contexto de esta ejecución.

## 1. ¿Cuál fue el principal riesgo identificado?

El mayor riesgo es la dependencia de servicios externos.

SauceDemo y Restful Booker no forman parte del código del repositorio, así que si cambia la interfaz, el contrato de la API o la disponibilidad del servicio, una prueba puede fallar aunque el script esté bien.

Además, la prueba de carga usa un servicio compartido, lo que introduce más variabilidad en los resultados.

### ¿Cómo se mitigó?

- En UI la selección de productos se hace por precio, no por nombre o posición fija.
- Se usa Page Object Model para tener los selectores centralizados y facilitar los cambios.
- En API el `bookingid` se obtiene del flujo de creación y se reutiliza en las siguientes operaciones.
- El escenario CRUD elimina la reserva creada y valida que ya no exista.
- La prueba de carga incluye un warm-up para estabilizar las mediciones.

### ¿Qué limitación queda?

Aún no hay un aislamiento completo. En un proyecto real, sería mejor contar con un ambiente controlado y datos propios para distinguir mejor un fallo de la aplicación de un problema de disponibilidad externa.

## 2. ¿Qué pruebas considera prioritarias para una regresión?

Las pruebas más importantes son las que cubren el flujo de negocio y la consistencia de los datos.

### Prioridad alta

- Compra completa en SauceDemo: login, seleccionar producto más barato y más caro, carrito, checkout y validar el total.
- Carrito: agregar tres productos, eliminar el más caro y verificar que el pedido se actualiza.
- Ciclo CRUD en Restful Booker: crear, leer, actualizar, leer de nuevo y eliminar una reserva.
- Prueba de carga de `GET /booking`: validar que el endpoint responde correctamente bajo la carga definida.

### Prioridad media

- Checkout sin datos obligatorios.
- Login con credenciales inválidas.
- Peticiones API con payload incompleto o vacío.
- Operaciones de actualización o eliminación sin autenticación.

Estas pruebas protegen tanto el camino feliz como los rechazos esperados.

## 3. ¿Qué pruebas adicionales automatizaría?

La base actual está bien, pero hay oportunidades para ampliar la cobertura.

- Probar otros usuarios de SauceDemo: `locked_out_user`, `problem_user`, `performance_glitch_user` y `error_user`.
- Validar tokens inválidos, expirados o malformados en Restful Booker.
- Probar datos mal formados, fechas inválidas, valores negativos y campos inesperados.
- Verificar headers incorrectos o métodos HTTP no permitidos.
- Añadir pruebas básicas de accesibilidad y navegación por teclado en la UI.
- Ejecutar escenarios data-driven con distintas combinaciones de productos y datos de checkout.
- Incluir escenarios de fallos de red, timeouts y respuestas lentas.
- Hacer un smoke test de `/ping` antes de ejecutar la suite API.
- Agregar pruebas de `PATCH` para completar la cobertura de actualización parcial.

## 4. ¿Qué oportunidades de mejora identifica en la solución desarrollada?

La solución cumple el objetivo, pero puede mejorar en mantenimiento y confiabilidad.

### Datos y configuración

Hoy algunos datos de prueba están en el código. En un entorno real movería credenciales, URLs y valores variables a variables de entorno o a una configuración centralizada.

### Manejo de limpieza

El flujo CRUD elimina la reserva al final, pero conviene proteger esa limpieza con un `try/finally` o un teardown para que la reserva se borre aun si falla una validación intermedia.

### Reportes

Ya se generan reportes de Playwright y JMeter. Una mejora sería conservar un historial de ejecuciones, métricas de tendencia y alertas cuando cambien los tiempos o los errores.

### Cobertura funcional

Se puede ampliar hacia accesibilidad, seguridad básica, usuarios alternativos, datos inválidos y escenarios de red. También sería útil una matriz de trazabilidad entre requisitos, casos de prueba y evidencia.

### Pipeline

Separar el pipeline en jobs independientes para UI, API y performance facilita encontrar qué capa falló. También evita que una prueba de carga larga bloquee la retroalimentación rápida de las pruebas UI o API.

## 5. Si estas pruebas fueran llevadas a un proyecto real, ¿qué mejoraría de la estrategia propuesta?

En un proyecto real reforzaría los ambientes de prueba y usaría datos controlados.

Eso ayuda a distinguir un defecto real de un falso negativo causado por disponibilidad o cambios externos.

### Estrategia por niveles

1. Smoke tests para validar disponibilidad.
2. Pruebas API para validar reglas y contratos.
3. Pruebas UI para los flujos críticos.
4. Pruebas de regresión para escenarios estables.
5. Performance con comparación contra una línea base.

También integraría la automatización con la gestión de requerimientos o incidencias, para que quede claro qué se cubre y qué quedó pendiente. En Scrum, esto debería alinearse con la Definition of Done; en Kanban, con estados claros de prueba.

## Resultado de performance observado

En la ejecución registrada el 10/08/2026, JMeter entregó 8.491 muestras, 100% de solicitudes exitosas, cero errores, latencia promedio de 126 ms, P90 de 155 ms, P95 de 179 ms y throughput promedio de 70,7 solicitudes por segundo. También se observó un máximo aislado de 6.149 ms, lo que confirma la variabilidad normal de un servicio externo compartido.

Ese resultado indica que `GET /booking` soportó la carga definida en disponibilidad y en el comportamiento de la mayoría de solicitudes: el P95 fue inferior a 2.000 ms y no se observaron errores. El máximo aislado muestra que no conviene basar la conclusión en una sola ejecución; en un proyecto real repetiría la medición en un entorno controlado y construiría una línea base histórica.

## Conclusión personal

El foco fue automatizar los escenarios de mayor riesgo: compra, carrito, checkout, validaciones negativas, ciclo CRUD de reserva y carga.

La automatización ayuda a repetir esos escenarios con menos esfuerzo y a detectar regresiones más rápido. Pero no reemplaza el criterio del tester, por eso también dejo registrado el riesgo y las mejoras posibles.
