# QA Automation Suite - Ceiba Software

![CI](https://github.com/qafnavbol04/qa-technical-test/actions/workflows/ci-cd-pipeline.yml/badge.svg)

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

## Decisiones técnicas relevantes
Se eligió Playwright por su estabilidad en UI y su capacidad nativa para pruebas API desde un solo framework. JMeter fue seleccionado para medir performance de carga real en el endpoint crítico de la API. GitHub Actions garantiza ejecución automatizada y reporte de resultados en cada push/pull request.

Se aplicó Page Object Model para separar las acciones de página de los escenarios. Los productos UI se seleccionan dinámicamente por precio, el `bookingid` de API se reutiliza durante el ciclo CRUD y las pruebas usan assertions explícitas y auto-waiting en lugar de esperas fijas.

## Requisitos
- Node.js 20+
- npm
- JMeter (para ejecución local de performance)
- GitHub Actions para CI/CD
- Acceso de red a `https://www.saucedemo.com` y `https://restful-booker.herokuapp.com`.

## Instalación
1. Instalar dependencias:
   ```bash
   npm ci
   ```
2. Instalar navegadores Playwright:
   ```bash
   npm run prepare
   ```

Para una instalación inicial sin `package-lock.json`, puede utilizarse `npm install`.

## Configuración
1. La UI utiliza la URL base `https://www.saucedemo.com`.
2. La API utiliza la URL base `https://restful-booker.herokuapp.com`.
3. Las credenciales de prueba están definidas en los escenarios según el alcance de la prueba técnica.
4. Playwright está configurado con proyectos independientes para Chromium, Firefox, WebKit y API.
5. Para performance, JMeter debe estar disponible en el `PATH`:
   ```bash
   jmeter --version
   ```

La configuración detallada de Playwright se encuentra en `playwright.config.ts` y la del pipeline en `.github/workflows/ci-cd-pipeline.yml`.

## Ejecución

### UI
- Ejecutar tests UI:
  ```bash
  npm run test:ui
  ```

Para ejecutar las pruebas UI mostrando el navegador:
```bash
npm run test:ui:headed
```

Para una demostración más controlada usando solamente Chromium:
```bash
npm run test:ui:headed:chromium
```

Para abrir Chromium y pausar la prueba para avanzar paso a paso:
```bash
npm run test:ui:debug
```

No agregues `--list` si quieres ejecutar la prueba: ese parámetro solo muestra los casos y no abre el navegador.

Para ejecutar solamente Chromium:
```bash
npx playwright test ui/tests --project=ui
```

Para ejecutar un flujo específico:
```bash
npx playwright test ui/tests/flujo1-checkout.spec.ts --project=ui
npx playwright test ui/tests/flujo2-cart.spec.ts --project=ui
```

### Nombres de pruebas UI actuales
- `Compra extremo`: Compra extremos y valida total
- `Carrito`: Elimina caro y valida checkout
- `Checkout negativo`: Valida campos faltantes
- `Login negativo`: Muestra error credenciales inválidas

### API
- Ejecutar tests API:
  ```bash
  npm run test:api
  ```

Para separar CRUD y negativos:
```bash
npx playwright test api/tests/booking-crud.spec.ts --project=api
npx playwright test api/tests/booking-negative.spec.ts --project=api
```

### Performance
- Ejecutar prueba de performance:
  ```bash
  npm run test:performance
  ```

La prueba utiliza warm-up, 10 usuarios virtuales, ramp-up de 30 segundos y duración de 120 segundos sobre `GET /booking`.

### Pipeline local
- Ejecutar tests UI y API:
  ```bash
  npm run test:all
  ```
- Ejecutar el pipeline completo localmente:
  ```bash
  npm run test:ci
  ```

El workflow remoto se ejecuta automáticamente en `push` y `pull_request` hacia `main` o `master`. También puede iniciarse manualmente desde GitHub Actions.
- Mostrar reporte HTML de Playwright:
  ```bash
  npm run report
  ```
- Limpiar artefactos:
  ```bash
  npm run clean
  ```

## Generación de reportes

Playwright genera el reporte HTML en `playwright-report`:

```bash
npm run report
```

Los resultados de diagnóstico UI, como screenshots, videos y traces, se conservan principalmente ante fallos según `playwright.config.ts`.

JMeter genera:

- Resultados raw: `performance/results.jtl`
- Reporte HTML: `performance/reports/html-report/index.html`

Para abrir el reporte de JMeter en Windows PowerShell:

```powershell
Start-Process .\performance\reports\html-report\index.html
```

Para comprimirlo como evidencia:

```powershell
Compress-Archive -Path performance\reports\html-report\* -DestinationPath performance\reports\html-report.zip -Force
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

Los artifacts publicados son `playwright-report` y `jmeter-report`. Para demostrar un fallo controlado, ejecutar manualmente el workflow con `simulate_failure=true`; el paso finaliza con error intencional y los reportes se publican mediante `if: always()`.

### Evidencia de pipeline
- Ejecución exitosa: `CI/CD Pipeline #9` ✅
- Ejecución fallida controlada: `CI/CD Pipeline #7` con `simulate_failure=true` ❌

## Resultados
- UI: flujos de compra dinámica, carrito y validaciones negativas implementados.
- API: ciclo CRUD completo con validaciones de status, estructura, datos, tiempos y errores.
- Performance: resultado documentado en `performance/README_PERFORMANCE.md`, incluyendo promedio, P90, P95, throughput y porcentaje de errores.
- Pipeline: ejecución exitosa y ejecución fallida controlada documentadas mediante GitHub Actions.

## Reportes y evidencia
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
