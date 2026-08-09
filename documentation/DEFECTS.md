# Defect Report Template

## Defecto
- **ID:** DF-001
- **Título:** Error de validación de checkout cuando faltan datos obligatorios
- **Severidad:** Alta
- **Prioridad:** P1

## Entorno de pruebas
- **Aplicación:** SauceDemo
- **Navegador:** Chromium Headless
- **URL:** https://www.saucedemo.com
- **Suite:** `ui/tests/flujo2-cart.spec.ts`
- **Fecha de ejecución:** 08/08/2026

## Descripción
En el flujo de carrito, al intentar continuar al checkout sin completar los datos obligatorios, el sistema debe mostrar un mensaje de error claro y mantener al usuario en la misma página de ingreso de datos.

## Pasos para reproducir
1. Ingresar a SauceDemo con `standard_user` / `secret_sauce`.
2. Agregar 3 productos diferentes al carrito.
3. Eliminar el producto de mayor precio.
4. Presionar `CHECKOUT`.
5. Hacer clic en `CONTINUE` sin completar los campos de nombre, apellido y código postal.

## Resultado esperado
- Se muestra el mensaje de error `Error: First Name is required`.
- El usuario permanece en la página `checkout-step-one.html`.
- El estado del carrito no cambia.

## Resultado actual
- [Describir el comportamiento observado en el hallazgo real, por ejemplo: no se muestra mensaje o el flujo avanza incorrectamente].

## Evidencia
- Captura de pantalla o video generado en `playwright-report`.
- Trace de Playwright disponible en `playwright-results`.
- Logs de ejecución y pasos reproducidos.

## Impacto
- El error bloquea la experiencia de checkout y puede permitir transacciones incompletas.
- Alto impacto en la validación de datos de usuario.

## Recomendación
- Revisar la validación de campos obligatorios en la página de checkout.
- Asegurar que el mensaje de error se exponga en el elemento `[data-test="error"]`.
- Agregar pruebas de regresión que validen errores de formulario en UI.
