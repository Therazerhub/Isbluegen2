import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import {Liquid} from 'liquidjs';
process.chdir(path.resolve(import.meta.dirname,'..'));
const port=Number(process.env.PORT||4173),theme=path.resolve('.');
const readThemeJSON=async file=>JSON.parse((await fs.readFile(file,'utf8')).replace(/^(?:\s*\/\*[\s\S]*?\*\/)+/,''));
const raw=JSON.parse(await fs.readFile('fixtures/catalog.json','utf8')).products;
const products=raw.map((p,i)=>{const variants=p.variants.map(v=>({...v,price:Math.round(Number(v.price)*100),compare_at_price:Math.round(Number(v.compare_at_price||0)*100),available:v.available!==false}));const image={src:'/assets/'+p.localImage,url:'/assets/'+p.localImage,alt:p.title,width:900,height:900};return{...p,description:p.body_html,object_type:'product',type:['Wellness','Gadgets','Home & living','Accessories','Home & living','Everyday essentials'][i],url:'/products/'+p.handle,price:variants[0].price,compare_at_price:variants[0].compare_at_price,available:variants.some(v=>v.available),variants,has_only_default_variant:variants.length===1&&variants[0].title==='Default Title',selected_or_first_available_variant:variants.find(v=>v.available)||variants[0],featured_image:image,media:[{...image,id:i+1,media_type:'image',preview_image:image}],images:[image]}});
const byHandle=Object.fromEntries(products.map(p=>[p.handle,p]));
// Local-only content examples. Storefront chapters always use the merchant's product data.
const stories={
 'travel-portable-mini-juice-blender':[
  ['Everyday portability','Take your routine with you.','A compact bottle format for your everyday bag. The loop handle makes it easy to pick up and carry between uses.'],
  ['A closer look','See the blend. Enjoy the moment.','The clear blending cup keeps your ingredients in view, with a secure lid to keep the contents contained while moving.'],
  ['Your daily rhythm','At home. At work. On the move.','Soft fruit smoothies, shakes and mixed drinks for your everyday routine. A simple rinse helps get the bottle ready for the next blend.']
 ],
 'foldable-storage':[
  ['Thoughtful spaces','Make room for everyday life.','A foldable storage rack for the things you reach for each day.'],
  ['A closer look','Useful from every angle.','Fold it out when you need extra storage, then collapse it flat when you need the space back.'],
  ['Made for your space','A place for the essentials.','Keep your everyday essentials organised in the bedroom, pantry or living space.']
 ]
};
for(const product of products){
 const original=raw.find(p=>p.handle===product.handle);
 product.media=original.images.map((item,i)=>{const img={src:i===0?product.featured_image.src:item.src,alt:product.title,width:item.width||900,height:item.height||900};return {...img,id:i+1,media_type:'image',preview_image:img}});
 if(product.handle==='travel-portable-mini-juice-blender'){
  product.media=['studio','navy','lifestyle'].map((name,i)=>{const img={src:'/preview-media/blender-'+name+'.png',alt:'Illustrative preview: portable pink blender',width:1254,height:1254};return {...img,id:i+1,media_type:'image',preview_image:img}});
  product.featured_image=product.media[0];
 }
 product.images=product.media;product.featured_media=product.media[0];
 const chapters=stories[product.handle];
 if(chapters)product.metafields={custom:{subtitle:{value:product.handle==='foldable-storage'?'A little order. A little more room.':'A small addition to your everyday.'},product_story:{value:chapters.map(([eyebrow,heading,body],i)=>({eyebrow:{value:eyebrow},heading:{value:heading},body:{value:'<p>'+body+'</p>'},image:{value:product.media[i%product.media.length]}}))}}};
 // Preview-only deadline to demonstrate the optional sale countdown.
 if(product.handle==='travel-portable-mini-juice-blender')product.metafields.custom.promotion_ends_at={value:new Date(Date.now()+48*60*60*1000).toISOString()};
}
const routes={root_url:'/',all_products_collection_url:'/collections/all',collections_url:'/collections',cart_url:'/cart',cart_add_url:'/cart/add',search_url:'/search',account_url:'https://isblue.in/account'};
const sortOptions=[{value:'manual',name:'Featured'},{value:'best-selling',name:'Best selling'},{value:'created-descending',name:'Newest first'},{value:'price-ascending',name:'Price: low to high'},{value:'price-descending',name:'Price: high to low'}];
const all={title:'All the good things.',url:'/collections/all',products,products_count:products.length,sort_options:sortOptions,sort_by:'manual',filters:[]};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const engine=new Liquid({root:[theme+'/snippets'],extname:'.liquid',strictFilters:false,strictVariables:false});
// Shopify makes these objects global inside isolated render tags.
engine.options.globals={routes,shop:{name:'IsBlue',currency:'INR'},cart:{item_count:0,total_price:0,currency:{iso_code:'INR'}}};
engine.registerFilter('preload_tag',(v)=>`<link rel="preload" href="${v}" as="font" type="font/woff2" crossorigin>`);
engine.registerFilter('default',function(value,fallback){return value==null||value===''||value===false||value?.length===0?fallback:value});
engine.registerFilter('asset_url',v=>'/assets/'+v);engine.registerFilter('stylesheet_tag',v=>`<link rel="stylesheet" href="${v}">`);
engine.registerFilter('metafield_tag',v=>v?.value||'');
engine.registerFilter('image_url',v=>typeof v==='string'?v:(v?.src||v?.url||v?.preview_image?.src||''));
engine.registerFilter('image_tag',(src,...args)=>{const attrs=Object.fromEntries(args.filter(Array.isArray));return `<img src="${escape(src)}" width="${attrs.width||900}" height="${attrs.height||900}" alt="${escape(attrs.alt||'')}" loading="${attrs.loading||'lazy'}" class="${escape(attrs.class||'')}" ${attrs.fetchpriority?`fetchpriority="${attrs.fetchpriority}"`:''}>`});
engine.registerFilter('money',n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(n)/100));
engine.registerFilter('json',v=>JSON.stringify(v??null));engine.registerFilter('structured_data',p=>JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.title}));engine.registerFilter('default_errors',()=> '');engine.registerFilter('payment_button',()=> '<div class="shopify-payment-button"><button type="button" class="shopify-payment-button__button shopify-payment-button__button--unbranded" onclick="this.nextElementSibling.textContent=\'Checkout is available in the Shopify store preview.\'">Buy it now</button><p class="preview-payment-note" role="status">Local preview · checkout unavailable</p></div>');engine.registerFilter('default_pagination',()=> '');engine.registerFilter('placeholder_svg_tag',()=>'<div class="placeholder">Product</div>');
function preprocess(source){return source.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g,'').replace(/{%\s*paginate[^%]*%}/g,'').replace(/{%\s*endpaginate\s*%}/g,'').replace(/{%\s*form\s+'([^']+)'([^%]*)%}/g,(_,type,rest)=>{const cls=rest.match(/class:\s*'([^']+)'/)?.[1]||'';return `<form method="post" action="${type==='product'?'/cart/add':type==='contact'?'/contact':'/contact#contact_form'}" class="${cls}" ${type==='product'?'data-product-form':''} ${type!=='product'?'data-preview-form':''}>`}).replace(/{%\s*endform\s*%}/g,'</form>').replace(/shopify:\/\/collections\/all/g,'/collections/all')}
const nativeRender=engine.parseAndRender.bind(engine);
engine.parseAndRender=(source,ctx,options)=>{if(ctx.section?.settings?.products)ctx.section.settings.products=ctx.section.settings.products.map(p=>typeof p==='string'?byHandle[p]:p).filter(Boolean);return nativeRender(source,ctx,options)};
async function section(type,data,context){
 const original=await fs.readFile(`${theme}/sections/${type}.liquid`,'utf8');
 const schema=JSON.parse(original.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/)?.[1]||'{}');
 const resolveSettings=(definitions,values={})=>{
  const settings={...Object.fromEntries((definitions||[]).filter(s=>'default'in s).map(s=>[s.id,s.default])),...values};
  for(const s of definitions||[]){
   if(s.type==='collection')settings[s.id]=settings[s.id]?all:undefined;
   if(s.type==='product')settings[s.id]=byHandle[settings[s.id]];
   if(s.type==='link_list')settings[s.id]={links:[{title:'Home & living',url:'/products/foldable-storage'},{title:'Gadgets',url:'/products/mini-bluetooth-thermal-printer-inkless-pocket-printer-for-mobile-label-sticker-printer'},{title:'Everyday essentials',url:'/products/travel-portable-mini-juice-blender'}]};
  }
  return settings;
 };
 const settings=resolveSettings(schema.settings,data.settings);
 const blocks=(data.block_order||Object.keys(data.blocks||{})).map(id=>({...data.blocks[id],settings:resolveSettings(schema.blocks?.find(b=>b.type===data.blocks[id].type)?.settings,data.blocks[id].settings),id,shopify_attributes:''}));
 return engine.parseAndRender(preprocess(original),{...context,section:{id:data.id||type,settings,blocks}});
}
async function group(name,ctx){const group=await readThemeJSON(`${theme}/sections/${name}.json`);return(await Promise.all(group.order.filter(id=>!group.sections[id].disabled&&group.sections[id].type!=='_blocks').map(id=>section(group.sections[id].type,{...group.sections[id],id},ctx)))).join('')}
async function render(url){let template='index';const q=url.searchParams;const ctx={shop:{name:'IsBlue',currency:'INR'},request:{locale:{iso_code:'en-IN'}},routes,settings:(await readThemeJSON(`${theme}/config/settings_data.json`)).current,collections:{all},all_products:byHandle,cart:{item_count:0,total_price:0,currency:{iso_code:'INR'},items:[]},page_title:'IsBlue | Useful gadgets and everyday solutions',page_description:'Shop useful gadgets, home helpers, and everyday essentials that solve small problems and make daily life easier.',canonical_url:'https://isblue.in'+url.pathname,content_for_header:'',form:{},paginate:{pages:1},page:{title:'',content:''}};
if(url.pathname.startsWith('/products/')){ctx.product=byHandle[url.pathname.split('/').pop()];template=ctx.product?'product':'404';if(ctx.product)ctx.page_title=ctx.product.title;}
else if(url.pathname.startsWith('/collections')){template='collection';const sorted=[...products];if(q.get('sort_by')==='price-ascending')sorted.sort((a,b)=>a.price-b.price);if(q.get('sort_by')==='price-descending')sorted.sort((a,b)=>b.price-a.price);ctx.collection={...all,products:sorted,sort_by:q.get('sort_by')||'manual'};ctx.page_title='All products';}
else if(url.pathname==='/search'){template='search';const results=products.filter(p=>p.title.toLowerCase().includes((q.get('q')||'').toLowerCase()));ctx.search={performed:q.has('q'),terms:q.get('q'),results_count:results.length,results};}
else if(url.pathname==='/pages/contact'){template='page.contact';ctx.page.title='Contact';ctx.page_title='Contact IsBlue'}
else if(url.pathname==='/cart')template='cart';
else if(url.pathname!=='/'){template='404';ctx.page_title='Page not found'}
if(template==='product'&&q.get('view')==='minimal')template='product.minimal';
ctx.request.page_type=template==='index'?'index':template.split('.')[0];
const manifest=await readThemeJSON(`${theme}/templates/${template}.json`);ctx.content_for_layout=(await Promise.all(manifest.order.map(id=>section(manifest.sections[id].type,{...manifest.sections[id],id},ctx)))).join('');let layout=await fs.readFile(`${theme}/layout/theme.liquid`,'utf8');layout=layout.replace(/{% sections 'header-group' %}/g,await group('header-group',ctx)).replace(/{% sections 'footer-group' %}/g,await group('footer-group',ctx));let html=await engine.parseAndRender(layout,ctx);if(template==='product.minimal')html=html.replaceAll('/preview-media/blender-navy.png','/preview-media/blender-lifestyle.png');html=html.replace('</body>',`<script type="application/json" id="preview-products">${JSON.stringify(products).replace(/</g,'\\u003c')}</script><script src="/preview-runtime.js"></script></body>`);return html;}
const mime={'.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname.startsWith('/preview-media/')){const name=path.basename(url.pathname);if(!/^blender-(studio|navy|lifestyle)\.png$/.test(name)){res.writeHead(404);res.end();return}res.setHeader('Content-Type','image/png');res.end(await fs.readFile(path.join('fixtures/cinematic',name)));return}if(url.pathname.startsWith('/assets/')){const target=path.resolve(theme,'.'+url.pathname);if(!target.startsWith(theme+'/assets/')){res.writeHead(403);res.end();return}const data=await fs.readFile(target);res.setHeader('Content-Type',mime[path.extname(target)]||'text/plain');res.end(data);return}if(url.pathname==='/preview-runtime.js'){res.setHeader('Content-Type','application/javascript');res.end(await fs.readFile('scripts/preview-runtime.js'));return}if(url.pathname.startsWith('/policies/')){res.writeHead(302,{Location:'https://isblue.in'+url.pathname});res.end();return}res.setHeader('Content-Type','text/html;charset=utf-8');res.end(await render(url))}catch(e){console.error(e);res.writeHead(500);res.end(e.message)}}).listen(port,'0.0.0.0',()=>console.log(`IsBlue preview at http://localhost:${port}`));
