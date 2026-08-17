import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const api=JSON.parse(await readFile(new URL('../apiDefinition.swagger.json',import.meta.url),'utf8'));
const methods=new Set(['get','post','put','patch','delete']);
const operations=()=>Object.values(api.paths).flatMap((path)=>Object.entries(path).filter(([name])=>methods.has(name)).map(([,operation])=>operation));

test('las acciones usan operationId únicos y visibles',()=>{
  const declared=operations();
  assert.equal(new Set(declared.map((operation)=>operation.operationId)).size,6);
  for(const operation of declared.filter(item=>item.operationId!=='DeleteGovpEventSubscription'))assert.equal(operation['x-ms-visibility'],'important');
  assert.equal(api.paths['/connectors/webhooks/{id}'].delete['x-ms-visibility'],'internal');
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

test('declara alta, notificación firmada y baja del trigger webhook',()=>{
  const resource=api.paths['/connectors/webhooks'];
  assert.equal(resource.post['x-ms-trigger'],'single');
  assert(resource['x-ms-notification-content'].schema.$ref.endsWith('/WebhookEnvelope'));
  assert.equal(api.definitions.WebhookSubscriptionCommand.properties.url['x-ms-notification-url'],true);
  assert(api.paths['/connectors/webhooks/{id}'].delete);
  assert(api.paths['/connectors/webhooks'].post.responses['201'].headers.Location);
});
