const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const content = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Resumen del Proyecto QA - Ceiba Software</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.5; color: #222; }
  h1, h2, h3, h4 { color: #0f4c81; }
  pre { background: #f5f5f5; padding: 12px 14px; border-radius: 6px; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  th { background: #e8f0fb; }
  .section { margin-bottom: 28px; }
  .example { background: #f8f9fa; padding: 12px; border-radius: 6px; }
</style>
</head>
<body>
<h1>Resumen del Proyecto QA - Ceiba Software</h1>
<p>Documento de apoyo para sustentación. Este PDF describe la solución de automatización desarrollada en el repositorio <strong>qa-technical-test</strong>.</p>

<section class="section">
  <h2>1. Contexto general</h2>
  <p>El proyecto automatiza pruebas para:</p>
  <ul>
    <li>UI de <strong>SauceDemo</strong> con Playwright y TypeScript.</li>
    <li>API de <strong>Restful Booker</strong> con Playwright Test.</li>
    <li>Performance para <code>GET /booking</code> con Apache JMeter.</li>
  </ul>
  <p>Además se incluye documentación de pruebas y un pipeline CI/CD en GitHub Actions.</p>
</section>

<section class="section">
  <h2>2. Estructura de carpetas y archivos</h2>
  <pre>.
├── api/
│   └── tests/
│       ├── booking-crud.spec.ts
│       └── booking-negative.spec.ts
├── documentation/
│   ├── DEFECTS.md
│   ├── FEEDBACK.md
│   └── TEST_PLAN.md
├── performance/
│   ├── booking_load_test.jmx
│   ├── README_PERFORMANCE.md
│   └── reports/
├── ui/
│   ├── pages/
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── InventoryPage.ts
│   │   └── LoginPage.ts
│   └── tests/
│       ├── checkout-negative.spec.ts
│       ├── flujo1-checkout.spec.ts
│       ├── flujo2-cart.spec.ts
│       └── login-negative.spec.ts
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
  </pre>
  <p>La solución utiliza la arquitectura Page Object Model para separar las interacciones de la UI de los escenarios de prueba.</p>
</section>

<section class="section">
  <h2>3. Patrones de pruebas e implementación</h2>
  <h3>3.1 UI</h3>
  <p>La capa de UI usa <strong>Playwright</strong> con Page Objects:</p>
  <ul>
    <li><strong>LoginPage</strong>: gestión de login, navegación y validación de URL.</li>
    <li><strong>InventoryPage</strong>: ordenamiento por precio, selección dinámica de productos y apertura de carrito.</li>
    <li><strong>CartPage</strong>: validación de cantidades, precios, eliminación de producto y avance a checkout.</li>
    <li><strong>CheckoutPage</strong>: llenado de formulario, validación de pasos de checkout, cálculo de subtotal/tax/total y confirmación de orden.</li>
  </ul>
  <p>Este patrón mejora la mantenibilidad y facilita cambiar selectores sin alterar los tests.</p>

  <h3>3.2 API</h3>
  <p>Las pruebas API usan Playwright Test con el cliente HTTP integrado:</p>
  <ul>
    <li>Autenticación con <code>POST /auth</code>.</li>
    <li>Creación de reserva con <code>POST /booking</code>.</li>
    <li>Consulta de reserva con <code>GET /booking/{id}</code>.</li>
    <li>Actualización con <code>PUT /booking/{id}</code>.</li>
    <li>Eliminación con <code>DELETE /booking/{id}</code>.</li>
  </ul>
  <p>Se valida el ciclo CRUD completo y se miden tiempos de respuesta para cada petición.</p>

  <h3>3.3 Performance</h3>
  <p>Se generó un plan JMeter con dos Thread Groups:</p>
  <ul>
    <li><strong>Calentamiento</strong>: 1 usuario y 15 segundos.</li>
    <li><strong>Carga</strong>: 10 usuarios, ramp-up de 30 segundos y duración de 120 segundos.</li>
  </ul>
  <p>El objetivo es validar la estabilidad y latencia del endpoint <code>GET /booking</code> bajo carga.</p>
</section>

<section class="section">
  <h2>4. Casos de prueba implementados</h2>
  <h3>4.1 UI</h3>
  <table>
    <thead><tr><th>Archivo</th><th>Descripción</th><th>Test</th><th>Valida</th></tr></thead>
    <tbody>
      <tr><td>ui/tests/flujo1-checkout.spec.ts</td><td>Compra extremo</td><td>Compra extremos y valida total</td><td>Selecciona el producto más barato y más caro, valida badge, checkout y total con impuestos.</td></tr>
      <tr><td>ui/tests/flujo2-cart.spec.ts</td><td>Carrito</td><td>Elimina carro y valida checkout</td><td>Agrega 3 productos dinámicos, elimina el más caro y verifica el error al continuar sin datos.</td></tr>
      <tr><td>ui/tests/checkout-negative.spec.ts</td><td>Checkout negativo</td><td>Valida campos faltantes</td><td>Verifica mensajes de error cuando faltan nombre, apellido y código postal.</td></tr>
      <tr><td>ui/tests/login-negative.spec.ts</td><td>Login negativo</td><td>Muestra error credenciales inválidas</td><td>Valida error de login con credenciales inválidas y permanencia en la página de login.</td></tr>
    </tbody>
  </table>

  <p>Total de tests UI: 4 archivos de especificación. Al ejecutarse con los 3 proyectos de navegador (<code>ui</code>, <code>ui-firefox</code>, <code>ui-webkit</code>) se convierten en 12 ejecuciones.</p>

  <h3>4.2 API</h3>
  <table>
    <thead><tr><th>Archivo</th><th>Descripción</th><th>Test</th><th>Valida</th></tr></thead>
    <tbody>
      <tr><td>api/tests/booking-crud.spec.ts</td><td>CRUD de reservas</td><td>CRUD completo</td><td>Autentica, crea, consulta, actualiza, consulta de nuevo y elimina una reserva. Verifica estado, esquema y tiempos.</td></tr>
      <tr><td>api/tests/booking-negative.spec.ts</td><td>Reservas negativas</td><td>Reserva incompleta falla</td><td>Verifica que el servicio rechaza una reserva sin campos obligatorios.</td></tr>
      <tr><td>api/tests/booking-negative.spec.ts</td><td>Reservas negativas</td><td>Reserva inexistente 404</td><td>Verifica que consultar una reserva no existente devuelve 404.</td></tr>
      <tr><td>api/tests/booking-negative.spec.ts</td><td>Reservas negativas</td><td>Actualización sin auth rechaza</td><td>Verifica que actualizar sin token devuelve 401/403.</td></tr>
      <tr><td>api/tests/booking-negative.spec.ts</td><td>Reservas negativas</td><td>Eliminación sin auth rechaza</td><td>Verifica que eliminar sin token devuelve 401/403.</td></tr>
      <tr><td>api/tests/booking-negative.spec.ts</td><td>Reservas negativas</td><td>Reserva cuerpo vacío falla</td><td>Verifica que crear con body vacío devuelve error.</td></tr>
    </tbody>
  </table>

  <p>Total de tests API: 6 pruebas.</p>

  <h3>4.3 Performance</h3>
  <table>
    <thead><tr><th>Métrica</th><th>Resultado de la última ejecución</th></tr></thead>
    <tbody>
      <tr><td>Muestras</td><td>8.491, incluyendo 1 warm-up y 8.490 de carga principal.</td></tr>
      <tr><td>Solicitudes exitosas</td><td>8.491 de 8.491 (100%).</td></tr>
      <tr><td>Errores</td><td>0.</td></tr>
      <tr><td>Promedio</td><td>126 ms.</td></tr>
      <tr><td>P90 / P95</td><td>155 ms / 179 ms.</td></tr>
      <tr><td>Throughput</td><td>70,7 solicitudes por segundo.</td></tr>
      <tr><td>Máximo</td><td>6.149 ms, como valor aislado.</td></tr>
    </tbody>
  </table>
  <p>Conclusión: el endpoint respondió sin errores y el P95 fue inferior a 2.000 ms. El máximo aislado recomienda repetir la medición en un ambiente controlado y construir una línea base histórica.</p>
</section>

<section class="section">
  <h2>5. Cómo se ejecutan las pruebas</h2>
  <h3>5.1 Comandos principales</h3>
  <ul>
    <li><code>npm run test:ui</code>: Ejecuta UI en Chromium, Firefox y WebKit.</li>
    <li><code>npm run test:api</code>: Ejecuta API con Playwright Test.</li>
    <li><code>npm run test:performance</code>: Ejecuta JMeter.</li>
    <li><code>npm run test:all</code>: Ejecuta API y UI.</li>
    <li><code>npm run test:ci</code>: Ejecuta API, UI y performance.</li>
  </ul>

  <h3>5.2 Ejecución UI con exploración visual</h3>
  <ul>
    <li><code>npm run test:ui:headed</code>: muestra los navegadores.</li>
    <li><code>npm run test:ui:headed:chromium</code>: ejecuta solo Chromium visible.</li>
    <li><code>npm run test:ui:debug</code>: abre el modo debug de Playwright.</li>
  </ul>
</section>

<section class="section">
  <h2>6. Validación de resultados y evidencia</h2>
  <p>Los resultados quedan disponibles en:</p>
  <ul>
    <li><code>playwright-report/</code>: reporte HTML de Playwright.</li>
    <li><code>playwright-results/</code>: artefactos generados por Playwright.</li>
    <li><code>performance/reports/html-report/</code>: reporte HTML de JMeter.</li>
  </ul>
  <p>Para abrir el reporte Playwright:</p>
  <pre>npm run report</pre>
  <p>Para abrir el reporte JMeter:</p>
  <pre>Start-Process .\performance\reports\html-report\index.html</pre>
  <p>En Windows, <code>npm run test:performance</code> utiliza <code>scripts/run-performance.js</code>, que ejecuta JMeter mediante Java y limpia los resultados anteriores antes de iniciar una nueva medición.</p>
</section>

<section class="section">
  <h2>7. Configuración relevante</h2>
  <p>Archivo principal de configuración:</p>
  <pre>playwright.config.ts</pre>
  <p>Puntos clave:</p>
  <ul>
    <li><code>baseURL</code> para UI: <code>https://www.saucedemo.com</code>.</li>
    <li><code>baseURL</code> para API: <code>https://restful-booker.herokuapp.com</code>.</li>
    <li><code>trace</code>, <code>screenshot</code>, <code>video</code> se retienen solo en fallos.</li>
    <li><code>outputDir</code> configurado en <code>playwright-results</code>.</li>
  </ul>

  <p>Archivo TypeScript:</p>
  <pre>tsconfig.json</pre>
  <p>Puntos clave:</p>
  <ul>
    <li><code>target</code>: ES2020</li>
    <li><code>module</code>: CommonJS</li>
    <li><code>moduleResolution</code>: node</li>
    <li><code>strict</code>: true</li>
    <li><code>skipLibCheck</code>: true</li>
  </ul>
</section>

<section class="section">
  <h2>8. Asuntos importantes de sustentación</h2>
  <ul>
    <li>El proyecto está diseñado para pruebas E2E en UI, pruebas de contrato API y prueba de carga.</li>
    <li>Se emplea Page Object Model en UI para mantener separada la lógica de interacción del flujo de pruebas.</li>
    <li>Los nombres de los tests UI se estandarizaron a español para una presentación más clara.</li>
    <li>Las pruebas API validan tanto el flujo correcto como escenarios negativos de seguridad/autenticación.</li>
    <li>Los resultados se validan en reportes HTML, que son evidencia de ejecución y fallos.</li>
  </ul>
</section>

</body>
</html>`;

  const outputPath = path.resolve(__dirname, '..', 'project-summary.html');
  fs.writeFileSync(outputPath, content, 'utf8');

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1200, height: 1600 } });
  const page = await context.newPage();
  await page.goto('file://' + outputPath.replace(/\\/g, '/'));
  await page.pdf({ path: path.resolve(__dirname, '..', 'project-summary.pdf'), format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } });
  await browser.close();
  console.log('PDF generado en project-summary.pdf');
})();
