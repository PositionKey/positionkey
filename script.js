/* ================================================
   POSITION KEY — All JavaScript
================================================ */
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function rnd(a,b){return Math.random()*(b-a)+a;}

// Hamburger
(function(){
  var hb=document.getElementById('hamburger');
  var nl=document.getElementById('navLinks');
  if(!hb||!nl)return;
  hb.addEventListener('click',function(){
    var o=nl.classList.toggle('open');
    hb.classList.toggle('open',o);
    hb.setAttribute('aria-expanded',String(o));
    document.body.style.overflow=o?'hidden':'';
  });
  nl.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      nl.classList.remove('open');hb.classList.remove('open');
      hb.setAttribute('aria-expanded','false');document.body.style.overflow='';
    });
  });
  document.addEventListener('click',function(e){
    if(!hb.contains(e.target)&&!nl.contains(e.target)){
      nl.classList.remove('open');hb.classList.remove('open');
      hb.setAttribute('aria-expanded','false');document.body.style.overflow='';
    }
  });
})();

// Nav solid on scroll
window.addEventListener('scroll',function(){
  var nav=document.querySelector('nav');if(!nav)return;
  nav.style.background=window.scrollY>10?'rgba(8,11,20,.98)':'';
  nav.style.borderBottom=window.scrollY>10?'1px solid rgba(124,58,237,.15)':'';
},{passive:true});

// Scroll reveal
if(!reduced){
  var ro=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}});
  },{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(function(el){ro.observe(el);});
}else{document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('visible');});}

// Nav highlight
var secEls=document.querySelectorAll('section[id]');
var navAs=document.querySelectorAll('#navLinks a[href^="#"]');
window.addEventListener('scroll',function(){
  var cur='';secEls.forEach(function(s){if(window.scrollY>=s.offsetTop-120)cur=s.id;});
  navAs.forEach(function(a){a.style.color=a.getAttribute('href')==='#'+cur?'var(--gold2)':'';});
},{passive:true});

// Candlestick
(function(){
  var cv=document.getElementById('heroChart');if(!cv)return;
  var ctx=cv.getContext('2d'),ca=[],N=36,tm=0;
  function gen(p){var o=p?p.close:2345,m=(Math.random()<0.54?1:-1)*rnd(1,11),cl=o+m;
    return{open:o,close:cl,high:Math.max(o,cl)+rnd(1,7),low:Math.min(o,cl)-rnd(1,7),alpha:0,x:0};}
  for(var i=0;i<N;i++)ca.push(gen(ca[ca.length-1]));
  function rsz(){cv.width=cv.offsetWidth*(window.devicePixelRatio||1);cv.height=cv.offsetHeight*(window.devicePixelRatio||1);}
  function draw(){
    requestAnimationFrame(draw);tm++;
    if(tm>=88){tm=0;ca.push(gen(ca[ca.length-1]));if(ca.length>N+6)ca.shift();}
    var W=cv.width,H=cv.height,dpr=window.devicePixelRatio||1;ctx.clearRect(0,0,W,H);
    var all=[];ca.forEach(function(x){all.push(x.high,x.low);});
    var mn=Math.min.apply(null,all),mx=Math.max.apply(null,all),rng=mx-mn||1;
    var pad=H*0.09,cw=Math.floor(W/(ca.length+2));
    function toY(p){return pad+(1-(p-mn)/rng)*(H-pad*2);}
    ctx.strokeStyle='rgba(124,58,237,.07)';ctx.lineWidth=1;
    for(var g=0;g<=4;g++){var gy=pad+(g/4)*(H-pad*2);ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}
    ca.forEach(function(x,i){
      if(x.alpha<1)x.alpha=Math.min(1,x.alpha+0.07);x.x=(i+1)*cw+cw*0.5;
      var up=x.close>=x.open,col=up?'74,222,128':'248,113,113';
      ctx.strokeStyle='rgba('+col+','+x.alpha*0.65+')';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x.x,toY(x.high));ctx.lineTo(x.x,toY(x.low));ctx.stroke();
      var bt=toY(Math.max(x.open,x.close)),bb=toY(Math.min(x.open,x.close)),bh=Math.max(bb-bt,2),bw=Math.max(cw*0.55,3);
      if(i===ca.length-1){ctx.shadowColor='rgba('+col+',.7)';ctx.shadowBlur=8*dpr;}
      ctx.fillStyle='rgba('+col+','+x.alpha*0.85+')';ctx.fillRect(x.x-bw/2,bt,bw,bh);ctx.shadowBlur=0;
    });
    if(ca.length>1){ctx.beginPath();ca.forEach(function(x,i){if(i===0)ctx.moveTo(x.x,toY(x.close));else ctx.lineTo(x.x,toY(x.close));});
      ctx.strokeStyle='rgba(200,146,42,.28)';ctx.lineWidth=1.5;ctx.stroke();}
    var last=ca[ca.length-1];
    if(last){var up2=last.close>=last.open,lc=up2?'74,222,128':'248,113,113',lx=last.x+cw*0.7,ly=toY(last.close);
      ctx.beginPath();ctx.arc(last.x,ly,3*dpr,0,Math.PI*2);
      ctx.fillStyle='rgba('+lc+',1)';ctx.shadowColor='rgba('+lc+',.8)';ctx.shadowBlur=6*dpr;ctx.fill();ctx.shadowBlur=0;
      ctx.font='bold '+(10*dpr)+'px monospace';var pr=last.close.toFixed(1),tw=ctx.measureText(pr).width;
      ctx.fillStyle='rgba(8,11,20,.8)';ctx.fillRect(lx-4,ly-9*dpr,tw+8,14*dpr);
      ctx.fillStyle='rgba('+lc+',1)';ctx.fillText(pr,lx,ly+3*dpr);}
  }
  rsz();window.addEventListener('resize',rsz);if(!reduced)requestAnimationFrame(draw);
})();

// Ticker
(function(){
  var ts=[
    {id:'tXAU',cid:'tXAUc',base:2345,open:2336,fmt:function(v){return v.toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1});}},
    {id:'tEUR',cid:'tEURc',base:1.0821,open:1.0835,fmt:function(v){return v.toFixed(4);}}
  ];
  var px={tXAU:2345,tEUR:1.0821};
  function upd(){ts.forEach(function(t){
    var el=document.getElementById(t.id),ec=document.getElementById(t.cid);if(!el||!ec)return;
    var d=(Math.random()-0.485)*(t.id==='tXAU'?0.7:0.0003);
    px[t.id]=Math.max(t.base*0.97,Math.min(t.base*1.03,px[t.id]+d));
    var v=px[t.id],p=((v-t.open)/t.open)*100,up=p>=0;
    el.textContent=t.fmt(v);ec.textContent=(up?'+':'')+p.toFixed(2)+'%';
    ec.className='ticker-chg '+(up?'tick-up tick-up-bg':'tick-down tick-down-bg');
    el.style.color=up?'#4ADE80':'#F87171';setTimeout(function(){el.style.color='';},280);
  });}
  if(!reduced)setInterval(upd,1900+Math.random()*600);
})();

// Particles
(function(){
  var cv=document.getElementById('emotivityParticles');if(!cv)return;
  var ctx=cv.getContext('2d'),pts=[];
  function rsz(){
    cv.width=cv.parentElement.offsetWidth*(window.devicePixelRatio||1);
    cv.height=cv.parentElement.offsetHeight*(window.devicePixelRatio||1);
    var n=Math.max(20,Math.min(70,Math.floor(cv.width*cv.height/18000)));
    pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3});
  }
  function draw(){
    if(!reduced)requestAnimationFrame(draw);ctx.clearRect(0,0,cv.width,cv.height);
    var md=110*(window.devicePixelRatio||1);
    pts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=cv.width;if(p.x>cv.width)p.x=0;if(p.y<0)p.y=cv.height;if(p.y>cv.height)p.y=0;});
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<md){ctx.strokeStyle='rgba(124,58,237,'+(1-d/md)*0.22+')';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}}
      ctx.beginPath();ctx.arc(pts[i].x,pts[i].y,1.2,0,Math.PI*2);ctx.fillStyle='rgba(159,103,255,.45)';ctx.fill();
    }
  }
  rsz();try{new ResizeObserver(rsz).observe(cv.parentElement);}catch(e){}if(!reduced)requestAnimationFrame(draw);
})();

// CTA price line
(function(){
  var cv=document.getElementById('ctaPriceLine');if(!cv)return;
  var ctx=cv.getContext('2d'),pts=[],N=80,t=0;
  function rsz(){cv.width=cv.parentElement.offsetWidth*(window.devicePixelRatio||1);cv.height=cv.parentElement.offsetHeight*(window.devicePixelRatio||1);
    pts=[];var b=cv.height*0.6;for(var i=0;i<N;i++)pts.push(b+Math.sin(i*0.3)*20+Math.sin(i*0.07)*30);}
  function draw(){
    if(!reduced)requestAnimationFrame(draw);t+=0.013;var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);
    pts.shift();pts.push(Math.max(H*0.15,Math.min(H*0.88,pts[pts.length-1]+(Math.random()-0.48)*6+Math.sin(t)*3)));
    var step=W/(N-1);
    var gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(124,58,237,.15)');gr.addColorStop(0.7,'rgba(124,58,237,.04)');gr.addColorStop(1,'rgba(124,58,237,0)');
    ctx.beginPath();pts.forEach(function(y,i){if(i===0){ctx.moveTo(0,y);return;}var cpx=(i-0.5)*step;ctx.bezierCurveTo(cpx,pts[i-1],cpx,y,i*step,y);});
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle=gr;ctx.fill();
    ctx.beginPath();pts.forEach(function(y,i){if(i===0){ctx.moveTo(0,y);return;}var cpx=(i-0.5)*step;ctx.bezierCurveTo(cpx,pts[i-1],cpx,y,i*step,y);});
    var lg=ctx.createLinearGradient(0,0,W,0);lg.addColorStop(0,'rgba(124,58,237,.25)');lg.addColorStop(0.5,'rgba(200,146,42,.75)');lg.addColorStop(1,'rgba(124,58,237,.25)');
    ctx.strokeStyle=lg;ctx.lineWidth=1.5*(window.devicePixelRatio||1);ctx.stroke();
    var dpr=window.devicePixelRatio||1;ctx.beginPath();ctx.arc((N-1)*step,pts[N-1],4*dpr,0,Math.PI*2);
    ctx.fillStyle='#E6B84A';ctx.shadowColor='rgba(230,184,74,.9)';ctx.shadowBlur=8*dpr;ctx.fill();ctx.shadowBlur=0;
  }
  rsz();try{new ResizeObserver(rsz).observe(cv.parentElement);}catch(e){}if(!reduced)requestAnimationFrame(draw);
})();

// Counters
(function(){
  var defs=[
    {s:'.hero-stat:nth-child(1) .val',t:5,p:'<',sf:'s'},
    {s:'.hero-stat:nth-child(2) .val',t:4,p:'',sf:''},
    {s:'.hero-stat:nth-child(4) .val',t:100,p:'',sf:'%'},
    {s:'.stat-item:nth-child(1) .stat-num',t:82,p:'',sf:'%'},
    {s:'.stat-item:nth-child(3) .stat-num',t:0,p:'',sf:''}
  ];
  function anim(el,end,dur,pre,suf){var s=null;function step(ts){if(!s)s=ts;var pg=Math.min((ts-s)/dur,1),e=1-Math.pow(1-pg,3);el.textContent=pre+Math.round(end*e)+suf;if(pg<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  var ob=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,t=parseFloat(el.dataset.t),p=el.dataset.p||'',sf=el.dataset.sf||'';if(!isNaN(t))anim(el,t,1400,p,sf);ob.unobserve(el);});},{threshold:0.4});
  defs.forEach(function(d){var el=document.querySelector(d.s);if(!el)return;el.dataset.t=d.t;el.dataset.p=d.p;el.dataset.sf=d.sf;el.textContent=d.p+'0'+d.sf;if(!reduced)ob.observe(el);else el.textContent=d.p+d.t+d.sf;});
  var bo=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');bo.unobserve(e.target);}});},{threshold:0.3});
  document.querySelectorAll('.stat-item').forEach(function(el){if(!reduced)bo.observe(el);else el.classList.add('in-view');});
})();

// Feature stagger
(function(){
  var cards=document.querySelectorAll('.feature-card');if(!cards.length||reduced)return;
  var ob=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;var idx=Array.from(cards).indexOf(e.target);setTimeout(function(){e.target.style.opacity='1';e.target.style.transform='translateY(0)';},idx*75);ob.unobserve(e.target);});},{threshold:0.08});
  cards.forEach(function(c){c.style.opacity='0';c.style.transform='translateY(14px)';c.style.transition='opacity .5s ease,transform .5s ease,background .2s,box-shadow .3s';ob.observe(c);});
})();

// ESC chiude modal
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    if(typeof closeModal==='function')closeModal();
    if(typeof closeContactModal==='function')closeContactModal();
  }
});

/* ---- MODAL RICHIEDI ACCESSO ---- */
function openModal(){
  var o=document.getElementById('modalOverlay');if(!o)return;
  o.classList.add('open');document.body.style.overflow='hidden';
  setTimeout(function(){var f=document.getElementById('fNome');if(f)f.focus();},150);
}
function closeModal(){
  var o=document.getElementById('modalOverlay');if(!o)return;
  o.classList.remove('open');document.body.style.overflow='';
  var form=document.getElementById('accessForm');if(form)form.reset();
  document.querySelectorAll('#accessForm .form-input,#accessForm .form-select').forEach(function(el){el.classList.remove('error');});
  document.querySelectorAll('#accessForm .form-error').forEach(function(el){el.classList.remove('show');});
  document.querySelectorAll('.pricing-card').forEach(function(c){c.classList.remove('selected');});
  var fc=document.getElementById('modalFormContent'),ms=document.getElementById('modalSuccess');
  if(fc)fc.classList.remove('hide');if(ms)ms.classList.remove('show');
  var btn=document.getElementById('btnSubmit');if(btn){btn.classList.remove('loading');btn.disabled=false;}
}
function submitForm(){
  var ok=true;
  function vf(id,eid){var el=document.getElementById(id),er=document.getElementById(eid);if(!el||!er)return true;if(!el.value.trim()){el.classList.add('error');er.classList.add('show');return false;}el.classList.remove('error');er.classList.remove('show');return true;}
  ok=vf('fNome','eNome')&&ok;ok=vf('fCognome','eCognome')&&ok;ok=vf('fAcc','eAcc')&&ok;
  var pt=document.getElementById('fPiat');
  if(pt&&!pt.value){pt.classList.add('error');var e1=document.getElementById('ePiat');if(e1)e1.classList.add('show');ok=false;}
  else if(pt){pt.classList.remove('error');var e2=document.getElementById('ePiat');if(e2)e2.classList.remove('show');}
  var vr=document.getElementById('fVer');
  if(vr&&!vr.value){vr.classList.add('error');var e3=document.getElementById('eVer');if(e3)e3.classList.add('show');ok=false;}
  else if(vr){vr.classList.remove('error');var e4=document.getElementById('eVer');if(e4)e4.classList.remove('show');}
  var pg=document.querySelector('input[name="pagamento"]:checked');
  if(!pg){var e5=document.getElementById('ePag');if(e5)e5.classList.add('show');ok=false;}
  if(!ok){var fe=document.querySelector('#accessForm .form-input.error,#accessForm .form-select.error');if(fe)fe.scrollIntoView({behavior:'smooth',block:'center'});return;}
  var nome=document.getElementById('fNome').value.trim();
  var cog=document.getElementById('fCognome').value.trim();
  var piat=pt.value,ver=vr.value,acc=document.getElementById('fAcc').value.trim();
  var paga=pg.value,isU=pg.id==='payUsdt';
  var noteU=isU?'\n\nNOTE USDT: inserire il numero account nelle note: '+acc:'';
  var sub=encodeURIComponent('Richiesta Licenza Position Key - '+nome+' '+cog);
  var body=encodeURIComponent('Richiesta Licenza Position Key\n==============================\n\nNome: '+nome+'\nCognome: '+cog+'\nPiattaforma: '+piat+'\nVersione: '+ver+'\nAccount: '+acc+'\nPagamento: '+paga+noteU+'\n\n==============================\nInviato dal sito Position Key');
  var sbtn=document.getElementById('btnSubmit');if(sbtn){sbtn.classList.add('loading');sbtn.disabled=true;}
  window.location.href='mailto:helppositionkey@proton.me?subject='+sub+'&body='+body;
  setTimeout(function(){var fc=document.getElementById('modalFormContent'),ms=document.getElementById('modalSuccess');if(fc)fc.classList.add('hide');if(ms)ms.classList.add('show');if(sbtn){sbtn.classList.remove('loading');sbtn.disabled=false;}},900);
}

/* ---- MODAL CONTATTACI ---- */
function openContactModal(){
  var o=document.getElementById('contactOverlay');if(!o)return;
  o.classList.add('open');document.body.style.overflow='hidden';
  setTimeout(function(){var f=document.getElementById('cNome');if(f)f.focus();},150);
}
function closeContactModal(){
  var o=document.getElementById('contactOverlay');if(!o)return;
  o.classList.remove('open');document.body.style.overflow='';
  var form=document.getElementById('contactForm');if(form)form.reset();
  document.querySelectorAll('#contactForm .form-input,#contactForm .form-textarea').forEach(function(el){el.classList.remove('error');});
  document.querySelectorAll('#contactForm .form-error').forEach(function(el){el.classList.remove('show');});
  var fw=document.getElementById('contactFormWrap'),cs=document.getElementById('contactSuccess');
  if(fw)fw.classList.remove('hide');if(cs)cs.classList.remove('show');
  var btn=document.getElementById('btnContact');if(btn){btn.classList.remove('loading');btn.disabled=false;}
}
function submitContact(){
  function vcf(id,eid){var el=document.getElementById(id),er=document.getElementById(eid);if(!el||!er)return true;if(!el.value.trim()){el.classList.add('error');er.classList.add('show');return false;}el.classList.remove('error');er.classList.remove('show');return true;}
  function vcfEmail(id,eid){var el=document.getElementById(id),er=document.getElementById(eid);if(!el||!er)return true;var v=el.value.trim();var ok=v.length>0&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);if(!ok){el.classList.add('error');er.classList.add('show');return false;}el.classList.remove('error');er.classList.remove('show');return true;}
  var ok=true;
  ok=vcf('cNome','ecNome')&&ok;ok=vcf('cCognome','ecCognome')&&ok;
  ok=vcfEmail('cEmail','ecEmail')&&ok;ok=vcf('cMessaggio','ecMessaggio')&&ok;
  if(!ok){var fe=document.querySelector('#contactForm .form-input.error,#contactForm .form-textarea.error');if(fe)fe.scrollIntoView({behavior:'smooth',block:'center'});return;}
  var nome=document.getElementById('cNome').value.trim();
  var cognome=document.getElementById('cCognome').value.trim();
  var email=document.getElementById('cEmail').value.trim();
  var msg=document.getElementById('cMessaggio').value.trim();
  var sub=encodeURIComponent('Messaggio da '+nome+' '+cognome+' - Position Key');
  var body=encodeURIComponent('Mittente: '+nome+' '+cognome+'\nEmail: '+email+'\n==============================\n\n'+msg+'\n\n==============================\nInviato dal sito Position Key');
  var btn=document.getElementById('btnContact');if(btn){btn.classList.add('loading');btn.disabled=true;}
  window.location.href='mailto:helppositionkey@proton.me?subject='+sub+'&body='+body;
  setTimeout(function(){var fw=document.getElementById('contactFormWrap'),cs=document.getElementById('contactSuccess');if(fw)fw.classList.add('hide');if(cs)cs.classList.add('show');if(btn){btn.classList.remove('loading');btn.disabled=false;}},900);
}

// Collega tutti i bottoni al caricamento del DOM
document.addEventListener('DOMContentLoaded',function(){
  // Richiedi Accesso
  ['btnRichiediAccesso','btnRichiediLicenza'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.addEventListener('click',function(e){e.preventDefault();openModal();});
  });
  // Contattaci
  var bc=document.getElementById('btnContattaci');
  if(bc)bc.addEventListener('click',function(e){e.preventDefault();openContactModal();});
  // Chiudi modal
  var bCloseMod=document.getElementById('btnCloseModal');
  if(bCloseMod)bCloseMod.addEventListener('click',closeModal);
  var bCloseModS=document.getElementById('btnCloseModalSuccess');
  if(bCloseModS)bCloseModS.addEventListener('click',closeModal);
  var bCloseContactS=document.getElementById('btnCloseContactSuccess');
  if(bCloseContactS)bCloseContactS.addEventListener('click',closeContactModal);
  var bCloseContact=document.getElementById('btnCloseContact');
  if(bCloseContact)bCloseContact.addEventListener('click',closeContactModal);
  // Submit
  var bSubmit=document.getElementById('btnSubmitForm');
  if(bSubmit)bSubmit.addEventListener('click',submitForm);
  var bSubmitC=document.getElementById('btnSubmitContact');
  if(bSubmitC)bSubmitC.addEventListener('click',submitContact);
  // Overlay click
  var ov=document.getElementById('modalOverlay');
  if(ov)ov.addEventListener('click',function(e){if(e.target===this)closeModal();});
  var cov=document.getElementById('contactOverlay');
  if(cov)cov.addEventListener('click',function(e){if(e.target===this)closeContactModal();});
  // Pricing cards
  document.querySelectorAll('.pricing-card').forEach(function(card){
    card.addEventListener('click',function(){
      document.querySelectorAll('.pricing-card').forEach(function(c){c.classList.remove('selected');});
      card.classList.add('selected');
      var r=card.querySelector('input[type="radio"]');if(r)r.checked=true;
      var ep=document.getElementById('ePag');if(ep)ep.classList.remove('show');
    });
  });
  // Live validation blur
  var bfields=[['fNome','eNome'],['fCognome','eCognome'],['fAcc','eAcc']];
  bfields.forEach(function(f){var el=document.getElementById(f[0]);if(el)el.addEventListener('blur',function(){var er=document.getElementById(f[1]);if(!el.value.trim()){el.classList.add('error');if(er)er.classList.add('show');}else{el.classList.remove('error');if(er)er.classList.remove('show');}});});
  ['fPiat','fVer'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('change',function(){el.classList.remove('error');var er=document.getElementById('e'+id.slice(1));if(er)er.classList.remove('show');});});
  var cfields=[['cNome','ecNome'],['cCognome','ecCognome'],['cMessaggio','ecMessaggio']];
  cfields.forEach(function(f){var el=document.getElementById(f[0]);if(el)el.addEventListener('blur',function(){var er=document.getElementById(f[1]);if(!el.value.trim()){el.classList.add('error');if(er)er.classList.add('show');}else{el.classList.remove('error');if(er)er.classList.remove('show');}});});
  var cEmail=document.getElementById('cEmail');
  if(cEmail)cEmail.addEventListener('blur',function(){var er=document.getElementById('ecEmail');var ok=cEmail.value.trim().length>0&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail.value.trim());if(!ok){cEmail.classList.add('error');if(er)er.classList.add('show');}else{cEmail.classList.remove('error');if(er)er.classList.remove('show');}});
});
