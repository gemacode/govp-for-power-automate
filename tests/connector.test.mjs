import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const api=JSON.parse(await readFile(new URL('../apiDefinition.swagger.json',import.meta.url),'utf8'));

test('las acciones usan operationId únicos y visibles',()=>{
  const operations=Object.values(api.paths).flatMap((path)=>Object.values(path));
  assert.equal(new Set(operations.map((operation)=>operation.operationId)).size,4);
  for(const operation of operations)assert.equal(operation['x-ms-visibility'],'important');
});

test('las acciones usan la conexión autenticada de Power Platform',()=>{
  assert.equal(api.paths['/connectors/govps/{code}'].get.security,undefined);
  assert.equal(api.paths['/connectors/issue'].post.security,undefined);
  assert.equal(api.paths['/connectors/govps/{code}/revoke'].post.security,undefined);
});

test('la emisión solo declara la plataforma Power Automate',()=>{
  assert.deepEqual(api.definitions.Source.properties.platform.enum,['power_automate']);
  assert.equal(api.definitions.IssuanceCommand.properties.evidence.minItems,1);
  assert.match(api.definitions.Evidence.properties.sha256.pattern,/64/);
});

test('no se anuncian triggers sin contrato webhook',()=>{
  for(const path of Object.values(api.paths))for(const operation of Object.values(path))assert(!operation['x-ms-trigger']);
});
