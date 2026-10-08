/* ARP Solar Energy: lightweight, accessible animation controller */
(()=>{
'use strict';
const start=()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress=document.createElement('div');
  progress.className='motion-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  const header=document.querySelector('.main-header');
  let queued=false;
  const onScroll=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    progress.style.transform='scaleX('+Math.min(1,Math.max(0,window.scrollY/max))+')';
    header?.classList.toggle('is-scrolled',window.scrollY>20);
  };
  const tick=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;onScroll();});};
  window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick,{passive:true});onScroll();
  const menu=document.querySelector('.nav-links'),toggle=document.querySelector('.nav-toggle');
  if(menu&&toggle){
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('is-open')){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
  }
  if(reduce||!('IntersectionObserver'in window))return;
  const selectors=[
    '.hero-eyebrow','.hero-content h1','.hero-content > p','.hero-actions','.hero-facts','.hero-photo-wrap',
    '.intro-bar-inner > *','.section-header','.service-card','.about-visual','.about-content',
    '.benefit-title','.benefit','.process-card','.planner-copy','.planner-aside',
    '.projects-copy','.projects-placeholder','.faq-grid > *','.contact-left','.form-card',
    '.interior-banner .in-breadcrumb','.interior-banner .in-eyebrow','.interior-banner h1','.interior-banner p',
    '.in-split > *','.in-heading','.value-card','.gallery-tile','.guide-intro',
    '.guide-type-grid > *','.guide-side-card','.mini-contact','.legal-copy > *',
    '.cta-flex > *','.footer-top > *','.footer-bottom'
  ];
  const items=[...document.querySelectorAll(selectors.join(','))];
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:'0px 0px -35px 0px'});
  items.forEach((el,i)=>{
    el.classList.add('solar-reveal');
    const b=el.getBoundingClientRect(),visible=b.top<window.innerHeight*.94&&b.bottom>-30;
    el.style.setProperty('--reveal-delay',(visible?(i%4)*70:(i%4)*55)+'ms');
    if(visible)el.classList.add('is-visible');else observer.observe(el);
  });
  document.documentElement.classList.add('solar-motion');
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  document.querySelectorAll('.service-card,.value-card,.gallery-tile').forEach(card=>{
    card.classList.add('tilt-card');let frame=0;
    card.addEventListener('pointermove',event=>{
      if(event.pointerType&&event.pointerType!=='mouse')return;
      if(frame)cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect();
        const x=((event.clientX-r.left)/r.width-.5)*2,y=((event.clientY-r.top)/r.height-.5)*2;
        card.style.setProperty('--tilt-x',(-2*y).toFixed(2)+'deg');
        card.style.setProperty('--tilt-y',(2*x).toFixed(2)+'deg');frame=0;
      });
    },{passive:true});
    card.addEventListener('pointerleave',()=>{
      if(frame)cancelAnimationFrame(frame);
      card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');
    },{passive:true});
  });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
