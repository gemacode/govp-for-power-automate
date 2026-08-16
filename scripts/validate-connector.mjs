import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const definition=JSON.parse(await readFile(new URL('../apiDefinition.swagger.json',import.meta.url),'utf8'));
const properties=JSON.parse(await readFile(new URL('../apiProperties.json',import.meta.url),'utf8'));
assert.equal(definition.swagger,'2.0');
assert.equal(definition.host,'partners.gemacode.org');
assert.equal(definition.basePath,'/api/exchange');
assert.deepEqual(definition.schemes,['https']);
assert.equal(definition.securityDefinitions.api_key.name,'Authorization');
assert.equal(properties.properties.connectionParameters.api_key.type,'securestring');
const operations=Object.values(definition.paths).flatMap((path)=>Object.values(path)).map((operation)=>operation.operationId);
assert.deepEqual(operations.sort(),['GetConnectorIdentity','IssueGovp','RevokeGovp','VerifyGovpAuthenticated']);
const issue=definition.paths['/connectors/issue'].post;
assert(issue.parameters.some((parameter)=>parameter.name==='Idempotency-Key'&&parameter.required));
assert.deepEqual(definition.definitions.Source.properties.platform.enum,['power_automate']);
console.log('Power Automate custom connector contract passed.');
