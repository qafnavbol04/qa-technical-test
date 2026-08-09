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

## Resultados y cómo publicar los artefactos

Este repositorio incluye el plan de JMeter en `performance/booking_load_test.jmx`. Tras ejecutar la prueba local o en CI, los resultados y el reporte HTML se generan en:

- Archivo de resultados JTL: `performance/results.jtl`
- Reporte HTML: `performance/reports/html-report`

Recomendación para publicar los artefactos en la release `v1.0` (o cualquier tag):

1. Ejecutar la prueba localmente (asegúrate de tener JMeter instalado):
```powershell
npm run test:performance
```

2. Comprimir el reporte HTML (Windows PowerShell):
```powershell
# Empaqueta el reporte para subirlo a GitHub Release
Compress-Archive -Path performance\reports\html-report\* -DestinationPath performance\reports\html-report.zip
```

3. Subir el zip como asset a la release usando GitHub CLI (`gh`) (requiere `gh auth login`):
```powershell
# Asumiendo que la tag 'v1.0' ya existe en el repo
gh release upload v1.0 performance/reports/html-report.zip --repo qafnavbol04/qa-technical-test
```

Alternativa: si prefieres la UI web, ve a la página de Releases del repositorio, edita la release `v1.0` y arrastra el archivo `html-report.zip`.

Plantilla de resumen de performance (pegala en este archivo o en la release notes):

- Fecha: YYYY-MM-DD
- Entorno: CI / Local
- Comando ejecutado: `npm run test:performance`
- Usuarios virtuales: 10
- Ramp-up: 30s
- Duración total: 120s
- Throughput (req/s): <valor>
- % Requests exitosas: <valor>
- Media de latencia: <valor> ms
- P95 latency: <valor> ms
- Max latency: <valor> ms
- Errores observados: <lista/ejemplos>
- Observaciones: <comentarios>

Si quieres, puedo ejecutar la prueba en CI para generar los artefactos y adjuntarlos a la release (requiere que el workflow de CI permita ejecutar JMeter y que el job produzca el `performance/reports/html-report.zip`).
