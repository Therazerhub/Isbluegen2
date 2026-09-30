import {execFileSync} from 'node:child_process';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const output=path.join(root,'../isblue-frequency-theme.zip');
execFileSync('zip',['-qrFS',output,'assets','config','layout','locales','sections','snippets','templates'],{cwd:root,stdio:'inherit'});
console.log('Created outputs/isblue-frequency-theme.zip');
