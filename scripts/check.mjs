import fs from 'node:fs/promises';import path from 'node:path';import {execFileSync} from 'node:child_process';import zlib from 'node:zlib';
process.chdir(path.resolve(import.meta.dirname,'..'));let checks=0;
execFileSync(process.execPath,['scripts/check-product.mjs'],{stdio:'inherit'});
for(const file of await fs.readdir('templates')){if(!file.endsWith('.json'))continue;const data=JSON.parse(await fs.readFile('templates/'+file));for(const id of data.order){if(!data.sections[id])throw new Error('Missing section '+id);await fs.access('sections/'+data.sections[id].type+'.liquid');checks++}}
for(const file of await fs.readdir('sections')){if(!file.endsWith('.liquid'))continue;const source=await fs.readFile('sections/'+file,'utf8');const match=source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);if(!match)continue;const schema=JSON.parse(match[1]);if(schema.name.length>25)throw new Error('Section name too long: '+schema.name);checks++}
execFileSync('shopify',['theme','check','--path','.'],{stdio:'inherit'});
let js=0;for(const file of await fs.readdir('assets'))if(file.endsWith('.js')){const data=await fs.readFile('assets/'+file);js+=zlib.gzipSync(data).length;console.log(file,Math.round(zlib.gzipSync(data).length/1024)+' KB gzip')}
console.log(`${checks} structural checks passed. All JS including optional ThreeUI: ${Math.round(js/1024)} KB gzip.`);
