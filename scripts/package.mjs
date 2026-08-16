import { cp, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root=resolve(import.meta.dirname,'..');
const dist=resolve(root,'dist');
const staging=await mkdtemp(join(tmpdir(),'govp-power-automate-'));
try{
  await mkdir(dist,{recursive:true});
  for(const name of ['apiDefinition.swagger.json','apiProperties.json','README.md','LICENSE'])await cp(resolve(root,name),resolve(staging,name));
  const output=resolve(dist,'govp-for-power-automate-0.1.1.zip');
  await rm(output,{force:true});
  const result=spawnSync('zip',['-q','-r',output,'.'],{cwd:staging,encoding:'utf8'});
  if(result.status!==0)throw new Error(result.stderr||'Could not package connector.');
  console.log(output);
}finally{await rm(staging,{recursive:true,force:true});}
