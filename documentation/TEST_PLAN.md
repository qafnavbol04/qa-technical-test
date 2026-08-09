# Test Plan

## Objetivo
Definir un plan de pruebas práctico y sostenible para validar la solución QA de SauceDemo (UI) y Restful Booker (API/Performance), con énfasis en automatización, mantenibilidad y evidencia reproducible.

## Herramientas seleccionadas
- Playwright Test con TypeScript: UI, API y aserciones integradas.
- Apache JMeter: prueba de carga de `GET /booking`.
- GitHub Actions: ejecución automática en `push` y `pull_request`.

## Alcance
- Validación funcional de los dos flujos críticos de SauceDemo.
- Ciclo CRUD completo de reserva en Restful Booker.
- Prueba de carga con 10 usuarios virtuales y ramp-up de 30s.
- Generación de reportes y artefactos para auditoría.

## Enfoque de pruebas
### UI
- Page Object Model (POM) para separar página/acción de las pruebas.
- Selección dinámica de productos por precio, sin dependencias de nombres fijos.
- Validaciones de cálculo financiero y estado del carrito.
- Uso de auto-waiting nativo y aserciones explícitas.

### API
- Ciclo de vida CRUD usando token de autenticación válido.
- Validación de datos enviados vs. recibidos.
- Verificación de estructura JSON y campos obligatorios.
- Control de tiempos de respuesta bajo 2000ms.
- Teardown garantizado con eliminación de reserva.

### Performance
- Warm-up previo para despertar la API antes de la carga.
- 10 usuarios virtuales, 30s ramp-up, 120s de duración.
- Reporte de throughput, porcentaje de errores, tiempos promedio y percentiles.

## Diseño de casos de prueba
### Priorización
1. Validación de la experiencia de compra completa en UI.
2. Ciclo CRUD completo en API.
3. Prueba de performance de carga.
4. Manejo de errores en UI y API.

### Casos principales automatizados
- Compra dinámica en SauceDemo con cálculo de total.
- Gestión de carrito con validación de badge y eliminación de item más caro.
- Flujo CRUD de reservas Restful Booker con limpieza de datos.

### Casos complementarios recomendados
- Error de checkout al faltar datos obligatorios.
- Validez del token de autenticación en API.
- Comportamiento del endpoint bajo fallas de red o latencia.

## Principios de calidad
- Aserciones claras y específicas.
- Datos dinámicos, no hardcoded cuando sea posible.
- Independencia de pruebas.
- Limpieza de artefactos de ejecución.
- Documentación y evidencias disponibles.

## Criterios de entrada
- Repositorio con estructura base y dependencias instaladas.
- Acceso a SauceDemo y Restful Booker.
- Entorno de ejecución preparado con Node.js y JMeter.
- Configuración de CI en `.github/workflows/ci-cd-pipeline.yml`.

## Criterios de salida
- Suite UI y API ejecutada y aprobada localmente.
- Reportes Playwright y JMeter generados.
- Documentación técnica entregada.
- Pipeline configurado y preparado para integración.

## Matriz de riesgos
| Riesgo | Impacto | Probabilidad | Mitigación |
| --- | --- | --- | --- |
| Cambios en el DOM de SauceDemo | Alto | Medio | Selección dinámica por precio y validaciones de estado. |
| Dependencia externa de Restful Booker | Alto | Medio | Validar fallos y aislar datos en el teardown. |
| Fallo de instalación de navegadores | Medio | Medio | Script `npm run prepare` y pipeline con Playwright install. |
| Resultados de performance inconsistentes | Medio | Medio | Warm-up previo y análisis de percentiles. |

## Entregables
- Suite de pruebas UI en `ui/tests/`
- Suite de pruebas API en `api/tests/`
- Plan de carga en `performance/booking_load_test.jmx`
- Documentación técnica en `documentation/`
- Pipeline de CI en `.github/workflows/ci-cd-pipeline.yml`

## Observaciones
Este plan se diseñó para entregar una solución QA clara y escalable, priorizando pruebas funcionales y métricas de calidad para futuras iteraciones.
