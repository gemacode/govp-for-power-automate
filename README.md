# GOVP for Power Automate

Custom connector open source para emitir, comprobar y revocar GOVP desde Power
Automate y Power Apps sin escribir código.

> Estado `0.2.0`: las acciones `0.1.1` siguen validadas de extremo a extremo y
> se añade un trigger webhook candidato pendiente de importación nativa.
> entorno Power Platform real. La validación cubre conexión, identidad, emisión,
> repetición idempotente, comprobación, revocación y comprobación posterior.

## Contenido

- `apiDefinition.swagger.json`: definición OpenAPI 2.0 para Power Platform;
- `apiProperties.json`: credencial segura y metadatos del conector;
- acciones **Issue GOVP**, **Verify GOVP** y **Revoke GOVP**;
- acción de prueba de conexión mediante `/connectors/me`;
- trigger **When a GOVP event occurs**, con alta y baja automáticas;
- idempotencia obligatoria en emisión.

La comprobación HTTP `/govps/{code}` de Exchange continúa siendo pública. Dentro
del custom connector, **Verify GOVP** usa el alias autenticado
`/connectors/govps/{code}` para que Azure API Hub conserve la ruta de conexión al
invocar la acción.

La prueba nativa se realizó en el entorno aislado `GOVP CRM Test`; no requirió
modificar el entorno predeterminado ni la administración de usuarios de
Microsoft 365.

La estructura sigue la [documentación oficial de custom
connectors](https://learn.microsoft.com/connectors/custom-connectors/define-openapi-definition).

## Importación de prueba

Descarga el ZIP de Releases, descomprímelo y usa `paconn` o el asistente de
custom connectors de Power Platform con `apiDefinition.swagger.json`.

Al crear la conexión, introduce en el campo de autorización:

```text
Bearer gx_el_token_del_conector
```

El token se trata como `securestring`. No lo incluyas en parámetros, soluciones
exportadas, capturas ni historial del flujo.

## Trigger firmado

Power Automate entrega a Exchange una callback secreta al activar el flujo y
la elimina automáticamente usando la cabecera `Location`. El payload incluye
evento, huella y firma ECDSA. La URL de callback limita el origen práctico, pero
Power Platform no verifica por sí solo la firma declarada en OpenAPI: para una
decisión de alto riesgo, conserva `event.id` con unicidad duradera y valida la
firma mediante un componente confiable antes de continuar el flujo.

El trigger se mantiene como candidato hasta importarlo y ejecutarlo en el
entorno de prueba Power Platform; las acciones ya validadas no pierden su estado.

## Desarrollo

```bash
npm run check
```

La salida reproducible queda en `dist/govp-for-power-automate-0.2.0.zip`.

Apache-2.0. Microsoft, Power Automate y Power Apps son marcas de Microsoft; este
proyecto no está afiliado ni certificado por Microsoft.
