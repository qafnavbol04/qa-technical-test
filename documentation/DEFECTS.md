# Defect Report

## Resultado de la revisión
- **ID:** DF-000
- **Título:** No se identificaron defectos en la ejecución actual
- **Severidad:** Baja
- **Prioridad:** P3

## Entorno de pruebas
- **Aplicación UI:** SauceDemo
- **Navegadores:** Chromium, Firefox y WebKit en modo headless
- **URL UI:** https://www.saucedemo.com
- **Suite UI:** `ui/tests/flujo1-checkout.spec.ts`, `ui/tests/flujo2-cart.spec.ts`
- **Aplicación API:** Restful Booker
- **URL API:** https://restful-booker.herokuapp.com
- **Suite API:** `api/tests/booking-crud.spec.ts`, `api/tests/booking-negative.spec.ts`
- **Fecha de ejecución funcional:** 10/08/2026

## Descripción
Se ejecutaron los flujos de UI y los casos de API definidos en el repositorio. No se identificaron desviaciones funcionales en los pasos automatizados ni en las validaciones de datos principales.

## Pasos ejecutados
1. Ejecución de los 12 escenarios UI en Chromium, Firefox y WebKit.
2. Login en SauceDemo con `standard_user` y `secret_sauce`.
3. Flujo de compra dinámico con selección de producto más barato y más caro.
4. Validación de cálculo: Subtotal + Impuesto = Total.
5. Flujo de carrito con 3 productos, eliminación del producto más caro y validación de mensajes de checkout.
6. Ciclo CRUD de booking en Restful Booker con creación, lectura, actualización y eliminación.
7. Casos negativos de API: payload incompleto, booking no existente, operaciones sin autenticación y cuerpo vacío.
8. Prueba de carga de `GET /booking` con 8.491 muestras, 0 errores y P95 de 179 ms; se observó un máximo aislado de 6.149 ms.

## Resultado esperado
Las pruebas automatizadas debían completarse sin errores y las validaciones de UI/API debían pasar correctamente.

## Resultado actual
Todas las pruebas definidas pasaron según la ejecución automatizada disponible en el repositorio. No se encontraron defectos en los flujos revisados.

## Evidencia
- Reportes de Playwright generados en `playwright-report`.
- Reporte de JMeter generado en `performance/reports/html-report`.
- Ejecución de pipeline GitHub con evidencia de run exitoso y run fallido controlado.

## Recomendación
- Mantener esta documentación como registro de verificación cuando no se detecten defectos.
- Si se identifica un comportamiento anómalo en futuras ejecuciones, registrar el hallazgo con pasos y evidencia detallada aquí.
