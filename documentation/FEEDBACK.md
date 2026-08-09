# Feedback de la prueba técnica

## 1. ¿Cuál fue el principal riesgo identificado?
El principal riesgo fue la dependencia de aplicaciones externas (SauceDemo y Restful Booker), ya que cualquier cambio en su UI o disponibilidad puede impactar la suite. Se mitigó mediante selección dinámica en UI y teardown completo en API.

## 2. ¿Qué pruebas considera prioritarias para una regresión?
- Flujos críticos de compra en SauceDemo.
- Manejo de carrito y validaciones de errores en checkout.
- Ciclo CRUD completo de reservas en Restful Booker.
- Prueba de carga de `GET /booking` para asegurar estabilidad bajo concurrencia.

## 3. ¿Qué pruebas adicionales automatizaría?
- Escenarios adicionales de API para tokens expirados y payloads con tipos inválidos.
- Ya se cubrieron booking inexistente y operaciones de actualización/eliminación sin autenticación.
- Validaciones de seguridad básicas en API (headers, auth y CORS).
- Pruebas cross-browser en Playwright para asegurar compatibilidad en Chrome/Firefox.
- Pruebas de regresión data-driven para combos de productos y datos de checkout.

## 4. ¿Qué oportunidades de mejora identifica en la solución desarrollada?
- Añadir una capa de datos de prueba parametrizados para separar datos de lógica.
- Incluir reportes de cobertura y métricas de calidad técnica.
- Extender la suite con pruebas de accesibilidad y usabilidad en UI.
- Mejorar el manejo de artefactos en el pipeline con reportes versionados.

## 5. Si estas pruebas fueran llevadas a un proyecto real, ¿qué mejoraría de la estrategia propuesta?
- Implementar entornos de prueba dedicados y datos aislados para evitar interferencias.
- Incorporar un framework de reporte centralizado para análisis histórico.
- Automatizar alertas de regresión en caso de caída de percentiles de performance.
- Generar documentación de diseño de pruebas y casos de prueba en formato colaborativo.
