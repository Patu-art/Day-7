(()=>{
  "use strict";

  const header=document.querySelector('[data-header]');
  const btn=document.querySelector('.menu-toggle');
  const nav=document.querySelector('nav');

  if(btn&&nav){
    const close=()=>{btn.setAttribute('aria-expanded','false');nav.classList.remove('open')};
    btn.addEventListener('click',()=>{
      const isOpen=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',String(!isOpen));
      nav.classList.toggle('open',!isOpen);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>20);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});

  const hours={0:[12,22],1:[17,23],2:[17,23],3:[17,23],4:[17,23],5:[16,23],6:[12,23]};

  function manchester(){
    const parts=new Intl.DateTimeFormat('en-GB',{
      timeZone:'Europe/London',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false
    }).formatToParts(new Date());
    const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    const d={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[p.weekday];
    return{day:d,h:Number(p.hour),m:Number(p.minute),time:`${p.hour}:${p.minute}`};
  }

  function updateVenueStatus(){
    const n=manchester();
    const [openHour,closeHour]=hours[n.day];
    const nowMinutes=n.h*60+n.m;
    const isOpen=nowMinutes>=openHour*60&&nowMinutes<closeHour*60;
    document.querySelectorAll('[data-local-time]').forEach(el=>el.textContent=n.time);
    document.querySelectorAll('[data-open-status]').forEach(el=>{
      el.textContent=isOpen?`Open until ${String(closeHour).padStart(2,'0')}:00`:'Closed now';
    });
    document.querySelectorAll('.hours-card>div').forEach(row=>{
      row.classList.toggle('today',Number(row.dataset.day)===n.day);
    });
  }

  updateVenueStatus();
  setInterval(updateVenueStatus,30000);

  const targets=document.querySelectorAll('.reveal');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced||!('IntersectionObserver' in window)){
    targets.forEach(el=>el.classList.add('visible'));
  }else{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
      });
    },{threshold:.12});
    targets.forEach(el=>io.observe(el));
  }
})();
