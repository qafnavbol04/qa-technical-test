# Feedback y conclusiones de la prueba técnica

## Contexto de la evaluación

Como QA Automation, enfoqué la solución en cubrir los riesgos más importantes de los dos servicios definidos en la prueba:

- SauceDemo para validar la experiencia de compra desde la interfaz.
- Restful Booker para validar el ciclo de vida de una reserva mediante API.
- JMeter para observar el comportamiento de `GET /booking` bajo carga.
- GitHub Actions para ejecutar las pruebas de forma repetible y publicar la evidencia.

La conclusión se basa en los escenarios automatizados, los resultados documentados y el alcance definido. No pretende afirmar que las aplicaciones no tengan ningún defecto, sino que no se encontraron desviaciones dentro de los flujos y ambientes evaluados.

## 1. ¿Cuál fue el principal riesgo identificado?

El principal riesgo identificado fue la dependencia de servicios externos. SauceDemo y Restful Booker están fuera del control del proyecto, por lo que una indisponibilidad, un cambio en la interfaz, una modificación del contrato API o una variación en los tiempos de respuesta puede afectar la ejecución de las pruebas.

En SauceDemo, el flujo depende de elementos como el catálogo, el carrito y el checkout. En Restful Booker, el flujo depende de que estén disponibles los endpoints de autenticación y reservas. Además, la prueba de performance se ejecuta contra un servicio compartido, por lo que sus resultados pueden variar entre ejecuciones.

### ¿Cómo se mitigó en esta solución?

- Los productos no se seleccionan por nombre ni por una posición fija. Se leen sus precios y se seleccionan dinámicamente el menor, el mayor o los tres productos requeridos.
- El flujo UI utiliza Page Object Model, lo que concentra los selectores y reduce el impacto de cambios en la interfaz.
- El `bookingid` se obtiene de la respuesta de creación y se reutiliza en las operaciones posteriores.
- El ciclo API termina eliminando la reserva creada y valida con un `404` que ya no esté disponible.
- La prueba de performance incluye un warm-up para reducir el efecto de la primera petición sobre las mediciones.
- Los reportes y evidencias se publican desde el pipeline para facilitar el análisis posterior.

### ¿Qué limitación permanece?

El aislamiento no es total porque se utilizan servicios públicos. En un proyecto real complementaría estas pruebas con ambientes controlados, datos propios y pruebas simuladas para separar los defectos de la aplicación de los problemas de disponibilidad externa.

## 2. ¿Qué pruebas considera prioritarias para una regresión?

Priorizaría las pruebas que representan la ruta crítica del negocio y que podrían afectar directamente la experiencia del usuario o la integridad de los datos.

### Prioridad P0

- **Compra completa en SauceDemo:** login, selección dinámica del producto más barato y más caro, carrito, checkout, cálculo del total y confirmación.
- **Carrito:** agregar tres productos, validar el contador, eliminar el producto de mayor precio y comprobar que el estado se actualice.
- **Ciclo CRUD de Restful Booker:** autenticar, crear, consultar, actualizar, consultar nuevamente y eliminar una reserva.
- **Prueba de carga de `GET /booking`:** verificar que el endpoint mantenga respuestas exitosas y tiempos aceptables bajo la carga definida.

### Prioridad P1

- Checkout sin datos obligatorios.
- Login con credenciales inválidas.
- Payloads incompletos o vacíos en la API.
- Intentos de actualizar o eliminar una reserva sin autenticación.

Estas pruebas son prioritarias porque cubren tanto el camino feliz como los errores más probables en formularios, autorización, datos y operación del servicio.

## 3. ¿Qué pruebas adicionales automatizaría?

La solución ya incluye ejecución UI en Chromium, Firefox y WebKit mediante los proyectos configurados en Playwright. Como siguientes pasos, ampliaría la cobertura en estas áreas:

- Probar los usuarios adicionales que ofrece SauceDemo, especialmente `locked_out_user`, `problem_user`, `performance_glitch_user` y `error_user`.
- Validar tokens inválidos, expirados o malformados en Restful Booker.
- Probar tipos de datos incorrectos, fechas inválidas, valores negativos y campos adicionales no esperados.
- Validar de forma específica headers, formatos JSON, métodos HTTP no permitidos y comportamiento ante errores del servicio.
- Incorporar pruebas de accesibilidad y navegación básica por teclado en la interfaz.
- Agregar escenarios data-driven para ejecutar el mismo flujo con distintos datos de checkout y combinaciones de productos.
- Probar fallas de red, timeouts y respuestas lentas para verificar el comportamiento de la automatización.
- Validar el endpoint `/ping` como smoke test antes de ejecutar el resto de la suite API.
- Agregar pruebas de `PATCH` para complementar la cobertura de actualización parcial documentada por Restful Booker.

## 4. ¿Qué oportunidades de mejora identifica en la solución desarrollada?

La solución cumple el alcance principal, pero todavía puede evolucionar en mantenibilidad, seguridad y observabilidad.

### Datos y configuración

Actualmente algunos datos de prueba están definidos directamente en los archivos de prueba. Para un proyecto real, separaría las credenciales, URLs y datos variables usando variables de entorno, secretos del pipeline y builders o fixtures de datos.

### Limpieza de datos

El flujo CRUD elimina la reserva al final y valida su desaparición. Como mejora, protegería la limpieza con un bloque `try/finally` o con un mecanismo de teardown para que la reserva también se elimine si una validación intermedia falla.

### Reportes

La solución genera reportes de Playwright y JMeter. Como siguiente paso, incorporaría un historial de ejecuciones, tendencias de duración y alertas cuando aumenten los fallos o se deterioren los percentiles de performance.

### Cobertura funcional

Ampliaría la cobertura de accesibilidad, seguridad básica, usuarios alternativos, datos inválidos y escenarios de red. También formalizaría una matriz de trazabilidad entre requisito, caso de prueba, resultado y evidencia.

### Pipeline

Separaría el pipeline en jobs independientes para API, UI y performance. Así sería más fácil identificar qué capa falló y evitaría que una prueba de carga larga bloquee innecesariamente la retroalimentación rápida de UI o API.

## 5. Si estas pruebas fueran llevadas a un proyecto real, ¿qué mejoraría de la estrategia propuesta?

En un proyecto real comenzaría por establecer ambientes de prueba dedicados y datos controlados. Esto permitiría diferenciar un defecto funcional de una falla causada por disponibilidad, cambios o saturación de un servicio externo.

También organizaría la estrategia en diferentes niveles:

1. **Smoke tests:** validar rápidamente que la aplicación y sus servicios estén disponibles.
2. **Pruebas API:** validar reglas, contratos y datos con mayor velocidad que la UI.
3. **Pruebas UI:** cubrir los flujos críticos que representan valor para el usuario.
4. **Pruebas de regresión:** ejecutar los escenarios estables antes de liberar cambios.
5. **Performance:** ejecutar mediciones controladas y compararlas contra una línea base histórica.

Además, integraría la automatización con Jira o Azure Boards para relacionar historias de usuario, criterios de aceptación, casos, defectos y evidencias. En un equipo Scrum, los criterios de aceptación y la Definition of Done deberían incluir la ejecución de las pruebas prioritarias. En un flujo Kanban, usaría estados claros para identificar pruebas pendientes, fallidas, bloqueadas, corregidas y cerradas.

## Resultado de performance observado

En la ejecución documentada de JMeter se obtuvieron 10.193 muestras, 100% de solicitudes exitosas, cero errores, latencia promedio de 104 ms, P90 de 112 ms, P95 de 118 ms y throughput promedio de 84,8 solicitudes por segundo.

Con esos datos, considero que `GET /booking` soportó adecuadamente la carga definida para esta ejecución, ya que el P95 estuvo por debajo del umbral de 2.000 ms y no se observaron errores. Esta conclusión es válida para el ambiente y momento de la medición; en un proyecto real repetiría la prueba en un ambiente controlado y compararía el resultado con una línea base.

## Conclusión personal como QA Automation

La prioridad de esta solución no fue crear una gran cantidad de pruebas, sino automatizar los escenarios que representan mayor riesgo: comprar, gestionar el carrito, validar errores, administrar una reserva y observar el comportamiento de la API bajo carga.

La automatización permite repetir estos escenarios con menor esfuerzo y detectar regresiones rápidamente. Sin embargo, no reemplaza el análisis funcional ni el criterio del tester. Por eso, además de implementar los casos, documenté riesgos, resultados, limitaciones y mejoras posibles.
