# Defect Report Template

> Este archivo es una plantilla. La prueba automatizada asociada actualmente pasa correctamente; por lo tanto, no se registra aquí un defecto confirmado. Si se identifica una desviación real, completar los campos siguientes con evidencia reproducible.

## Defecto
- **ID:** DF-001
- **Título:** [Título breve del hallazgo]
- **Severidad:** [Crítica/Alta/Media/Baja]
- **Prioridad:** [P0/P1/P2/P3]

## Entorno de pruebas
- **Aplicación:** SauceDemo
- **Navegador:** Chromium Headless
- **URL:** https://www.saucedemo.com
- **Suite:** `ui/tests/flujo2-cart.spec.ts`
- **Fecha de ejecución:** 08/08/2026

## Descripción
[Describir el comportamiento observado y el alcance del impacto.]

## Pasos para reproducir
1. [Paso reproducible 1]
2. [Paso reproducible 2]
3. [Paso reproducible 3]

## Resultado esperado
[Comportamiento esperado.]

## Resultado actual
[Comportamiento actual observado.]

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
