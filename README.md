# QA Automation Suite - Ceiba Software

## Resumen del proyecto
Este repositorio contiene una solución de automatización integral para la prueba técnica de Ceiba Software, incluyendo:
- Automatización de UI para SauceDemo con Playwright y TypeScript.
- Automatización de API para Restful Booker con Playwright Test.
- Pruebas de carga en JMeter contra el endpoint `GET /booking`.
- Pipeline CI/CD en GitHub Actions con publicación de reportes.

## Arquitectura de la solución
- `ui/pages/`: Page Object Model para separar interacciones de los tests.
- `ui/tests/`: Flujos de regresión E2E que validan comportamiento de compra y carrito.
- `api/tests/`: Ciclo CRUD completo de reservas con validaciones de estado, datos y tiempos.
- `performance/`: Plan de carga JMeter con warm-up, métricas y reporte HTML.
- `documentation/`: Plan de pruebas, defectos y feedback profesional.

## Herramientas utilizadas
- Playwright Test con TypeScript
- Apache JMeter
- GitHub Actions
- Node.js / npm

## Justificación técnica
Se eligió Playwright por su estabilidad en UI y su capacidad nativa para pruebas API desde un solo framework. JMeter fue seleccionado para medir performance de carga real en el endpoint crítico de la API. GitHub Actions garantiza ejecución automatizada y reporte de resultados en cada push/pull request.

## Requisitos
- Node.js 20+
- npm
- JMeter (para ejecución local de performance)
- GitHub Actions para CI/CD

## Configuración local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Instalar navegadores Playwright:
   ```bash
   npm run prepare
   ```
3. Verificar instalación de JMeter:
   ```bash
   jmeter --version
   ```

## Scripts disponibles
- Ejecutar tests UI:
  ```bash
  npm run test:ui
  ```
- Ejecutar tests API:
  ```bash
  npm run test:api
  ```
- Ejecutar prueba de performance:
  ```bash
  npm run test:performance
  ```
- Ejecutar tests UI y API:
  ```bash
  npm run test:all
  ```
- Ejecutar el pipeline completo localmente:
  ```bash
  npm run test:ci
  ```
- Mostrar reporte HTML de Playwright:
  ```bash
  npm run report
  ```
- Limpiar artefactos:
  ```bash
  npm run clean
  ```

## Pipeline CI/CD
El workflow `.github/workflows/ci-cd-pipeline.yml` está diseñado para ejecutar:
- checkout del repositorio
- instalación de Node.js y dependencias
- instalación de navegadores Playwright
- instalación de JMeter
- ejecución de pruebas API
- ejecución de pruebas UI
- ejecución de prueba de performance
- publicación de reportes HTML como artifacts

## Resultados y evidencia
- Reportes de Playwright en `playwright-report`
- Resultados de JMeter en `performance/reports/html-report`
- Documentación técnica en `documentation/`

## Mejores prácticas aplicadas
- Page Object Model para tests UI claros y mantenibles.
- Validaciones dinámicas por precio en SauceDemo.
- Aserciones matemáticas explícitas para subtotal + impuesto = total.
- Pruebas API con ciclo CRUD completo y validaciones de estructura y tiempos.
- Configuración CI-friendly para ejecución en entornos de integración.

## Documentación incluida
- `documentation/TEST_PLAN.md`
- `documentation/DEFECTS.md`
- `documentation/FEEDBACK.md`
- `performance/README_PERFORMANCE.md`

## Observaciones
Este repositorio está preparado para evolucionar hacia un enfoque data-driven y una capa de objetos de prueba más amplia en futuras iteraciones.
