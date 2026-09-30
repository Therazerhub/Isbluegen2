import React from 'react';
import {createRoot} from 'react-dom/client';
import {DotMatrixBackground} from '@designcodeio/threeui/components/DotMatrixBackground';
// Only this leaf uses React. Commerce and all meaningful content remain Liquid.
export function mount(element){const root=createRoot(element);let visible=false;const render=()=>root.render(visible&&!document.hidden?React.createElement(DotMatrixBackground,{speed:Number(element.dataset.speed||2)/10,gridScale:38,opacity:.28,mouseAmount:.025,pulseSpeed:.18,radius:.08}):null);const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;render()});observer.observe(element);document.addEventListener('visibilitychange',render);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',render);root.unmount()}}
