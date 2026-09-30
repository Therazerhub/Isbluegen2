import fs from 'node:fs/promises';import sharp from 'sharp';
const root=new URL('../',import.meta.url);process.chdir(root.pathname);
await fs.mkdir('assets',{recursive:true});await fs.mkdir('fixtures',{recursive:true});
const catalog=JSON.parse(await fs.readFile('../../work/catalog.json','utf8'));
await fs.writeFile('fixtures/catalog.json',JSON.stringify(catalog,null,2));
const map={'foldable-storage':'storage','travel-portable-mini-juice-blender':'blender','mini-bluetooth-thermal-printer-inkless-pocket-printer-for-mobile-label-sticker-printer':'printer'};
for(const product of catalog.products){const name=map[product.handle]||product.handle;const response=await fetch(product.images[0].src);if(!response.ok)throw new Error('Image download failed');await sharp(Buffer.from(await response.arrayBuffer())).resize(900,900,{fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(`assets/${name}.webp`);product.localImage=`${name}.webp`;}
await fs.writeFile('fixtures/catalog.json',JSON.stringify(catalog,null,2));
const logo=await fetch('https://isblue.in/cdn/shop/files/IsBlue_logo_for_light_backgrounds.png?width=400&v=1789913200');await fs.writeFile('assets/isblue-logo.png',Buffer.from(await logo.arrayBuffer()));
await sharp('/home/razer/.codex/generated_images/01a0f1a5-e062-7bc3-a4b0-7aaeb8bec92d/exec-57237aba-23c4-4329-af03-c3370f0aa3e2.png').webp({quality:88}).toFile('assets/hero-blue.webp');
await fs.copyFile('node_modules/@designcodeio/threeui/LICENSE','assets/threeui-LICENSE.txt');
console.log('Catalog, brand logo, and hero assets prepared.');
