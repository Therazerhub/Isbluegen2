// One-time initial merchandising; merchants can change it in the theme editor.
import fs from 'node:fs/promises';
const file='templates/index.json';const index=JSON.parse(await fs.readFile(file));
index.sections.hero.settings.link='/collections/all';
index.sections.categories.blocks.tech.settings.link='/products/mini-bluetooth-thermal-printer-inkless-pocket-printer-for-mobile-label-sticker-printer';
index.sections.products.settings.products=['mini-bluetooth-thermal-printer-inkless-pocket-printer-for-mobile-label-sticker-printer','travel-portable-mini-juice-blender','foldable-storage','lotus-reflection-water-sensor-diyapack-of-12'];
await fs.writeFile(file,JSON.stringify(index,null,2)+'\n');
