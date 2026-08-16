# GOVP for Power Automate

Custom connector open source para emitir, comprobar y revocar GOVP desde Power
Automate y Power Apps sin escribir código.

> Estado `0.1.1`: conector instalado y validado de extremo a extremo en un
> entorno Power Platform real. La validación cubre conexión, identidad, emisión,
> repetición idempotente, comprobación, revocación y comprobación posterior.

## Contenido

- `apiDefinition.swagger.json`: definición OpenAPI 2.0 para Power Platform;
- `apiProperties.json`: credencial segura y metadatos del conector;
- acciones **Issue GOVP**, **Verify GOVP** y **Revoke GOVP**;
- acción de prueba de conexión mediante `/connectors/me`;
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

## Límite explícito

Exchange todavía no publica un contrato de suscripción con webhooks firmados.
Por eso esta versión ofrece acciones, pero no finge triggers de solicitud,
emisión, entrega, rechazo o revocación. Esos triggers se añadirán cuando exista
replay protection, rotación y entrega verificable del webhook.

## Desarrollo

```bash
npm run check
```

La salida reproducible queda en `dist/govp-for-power-automate-0.1.1.zip`.

Apache-2.0. Microsoft, Power Automate y Power Apps son marcas de Microsoft; este
proyecto no está afiliado ni certificado por Microsoft.
