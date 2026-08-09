# Performance Testing

Este documento describe el plan de pruebas de rendimiento para el endpoint `GET /booking` de la API Restful Booker.

## Objetivo

Validar la capacidad de respuesta del endpoint `GET /booking` bajo carga concurrente y asegurar que el servicio responde con HTTP 200 en un escenario de 10 usuarios virtuales.

## Plan de prueba

- Herramienta: Apache JMeter
- Archivo de prueba: `performance/booking_load_test.jmx`
- Endpoint: `https://restful-booker.herokuapp.com/booking`
- Usuarios virtuales: 10
- Ramp-up: 30 segundos
- Duración: 120 segundos
- Warm-up: 1 hilo durante 15 segundos antes de la prueba principal
- Resultados: `performance/results.jtl`
- Reporte HTML: `performance/reports/html-report`

## Ejecución

```bash
npm run test:performance
```

## Criterios de aceptación

- Todos los requests deben retornar HTTP 200.
- El tiempo de respuesta debe ser menor a 2000ms para la mayoría de las transacciones.
- El servidor debe mantenerse estable durante los 120 segundos de carga.
