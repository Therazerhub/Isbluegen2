import fs from 'node:fs/promises';import path from 'node:path';import {execFileSync} from 'node:child_process';import zlib from 'node:zlib';
process.chdir(path.resolve(import.meta.dirname,'..'));let checks=0;
for(const file of await fs.readdir('theme/templates')){if(!file.endsWith('.json'))continue;const data=JSON.parse(await fs.readFile('theme/templates/'+file));for(const id of data.order){if(!data.sections[id])throw new Error('Missing section '+id);await fs.access('theme/sections/'+data.sections[id].type+'.liquid');checks++}}
for(const file of await fs.readdir('theme/sections')){if(!file.endsWith('.liquid'))continue;const source=await fs.readFile('theme/sections/'+file,'utf8');const schema=JSON.parse(source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/)[1]);if(schema.name.length>25)throw new Error('Section name too long: '+schema.name);checks++}
execFileSync('shopify',['theme','check','--path','theme'],{stdio:'inherit'});
let js=0;for(const file of await fs.readdir('theme/assets'))if(file.endsWith('.js')){const data=await fs.readFile('theme/assets/'+file);js+=zlib.gzipSync(data).length;console.log(file,Math.round(zlib.gzipSync(data).length/1024)+' KB gzip')}
console.log(`${checks} structural checks passed. All JS including optional ThreeUI: ${Math.round(js/1024)} KB gzip.`);
