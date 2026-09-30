const instances=new Map();
export async function mountChapters(scope=document){
 const sections=scope.querySelectorAll('[data-chapters]');
 if(!sections.length)return;
 const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
 gsap.registerPlugin(ScrollTrigger);
 sections.forEach(section=>{
  if(!section.isConnected||instances.has(section))return;
  const mm=gsap.matchMedia();
  const steps=[...section.querySelectorAll('[data-chapter-step]')];
  const stage=section.querySelector('.chapter-visuals');
  mm.add({all:'(min-width: 0px)',desktop:'(min-width: 990px)',reduce:'(prefers-reduced-motion: reduce)'},({conditions})=>{
   const animated=!conditions.reduce&&section.dataset.motion==='true'&&!window.Shopify?.designMode;
   // Videos keep normal flow so playback controls remain accessible.
   const cinematic=animated&&conditions.desktop&&section.dataset.layout==='cinematic'&&steps.length>1&&steps.every(s=>s.querySelector('.chapter-inline-media img')&&!s.querySelector('video'));
   let active=-1;
   if(cinematic){
    section.classList.add('chapters-enhanced');
    const visuals=steps.map(step=>{
     const clone=step.querySelector('.chapter-inline-media').cloneNode(true);
     clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
     stage.append(clone);return clone;
    });
    gsap.set(visuals,{autoAlpha:0});
    const activate=index=>{
     if(active===index)return;
     active=index;
     visuals.forEach((el,i)=>gsap.to(el,{autoAlpha:i===index?1:0,scale:i===index?1:.98,duration:.65,ease:'power2.out',overwrite:true}));
     section.querySelector('[data-chapter-current]').textContent=String(index+1).padStart(2,'0');
    };
    activate(0);
    steps.forEach((step,index)=>ScrollTrigger.create({trigger:step,start:'top 65%',end:'bottom 65%',onEnter:()=>activate(index),onEnterBack:()=>activate(index)}));
   }
   if(animated)steps.forEach(step=>{
    const targets=cinematic?[step.querySelector('.chapter-copy')]:[step.querySelector('.chapter-inline-media'),step.querySelector('.chapter-copy')];
    gsap.from(targets,{opacity:0,y:24,duration:.7,stagger:.12,ease:'power2.out',clearProps:'opacity,transform',scrollTrigger:{trigger:step,start:'top 88%',once:true}});
   });
   return ()=>{gsap.killTweensOf(stage.children);section.classList.remove('chapters-enhanced');stage.replaceChildren()};
  });
  const refresh=()=>ScrollTrigger.refresh();
  section.addEventListener('load',refresh,true);
  document.fonts?.ready.then(()=>{if(section.isConnected)refresh()});
  instances.set(section,()=>{mm.revert();section.removeEventListener('load',refresh,true)});
 });
 ScrollTrigger.refresh();
}
export function unmountChapters(scope){
 instances.forEach((cleanup,section)=>{if(scope.contains(section)){cleanup();instances.delete(section)}});
}
