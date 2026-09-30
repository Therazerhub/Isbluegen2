import {execFileSync} from 'node:child_process';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');execFileSync('zip',['-qr',path.join(root,'../isblue-frequency-theme.zip'),'.'],{cwd:path.join(root,'theme'),stdio:'inherit'});console.log('Created outputs/isblue-frequency-theme.zip');
