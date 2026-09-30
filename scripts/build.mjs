import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
await fs.mkdir('assets',{recursive:true});
await build({entryPoints:['src/theme.js'],bundle:true,splitting:true,format:'esm',target:'es2020',outdir:'assets',entryNames:'theme',chunkNames:'isblue-[name]-[hash]',minify:true,metafile:true,legalComments:'linked'}).then(async r=>fs.writeFile('build-meta.json',JSON.stringify(r.metafile,null,2)));
await fs.writeFile('assets/theme.css',(await fs.readFile('src/theme.css','utf8'))+'\n'+(await fs.readFile('src/product.css','utf8')));
await fs.copyFile('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2','assets/manrope-latin.woff2');
const icons=['arrow-up-right','arrow-down','caret-down','magnifying-glass','user','handbag','list','x','plus','sparkle','shield-check','chat-circle-text','asterisk'];
let iconSnippet='{% case name %}\n';
for(const name of icons){let svg=await fs.readFile(`node_modules/@phosphor-icons/core/assets/regular/${name}.svg`,'utf8');svg=svg.replace('<svg ','<svg class="icon" aria-hidden="true" focusable="false" ');iconSnippet+=`{% when '${name}' %}${svg}\n`;}
iconSnippet+='{% endcase %}';await fs.writeFile('snippets/icon.liquid',iconSnippet);
console.log('Theme assets built.');
