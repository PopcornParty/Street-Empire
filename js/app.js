(() => {
  const KEY = "se-rich-v1";
  const CODE = "FERRARI1";
  const RANKS = [[0,"Starter"],[60,"Clerk"],[200,"Owner"],[500,"Investor"],[1100,"Director"],[2200,"Tycoon"],[4500,"Mogul"],[8000,"Magnate"],[13000,"Sovereign"]];
  const CATS = ["Shop","Works","Kitchen","Builder","Motors","Labs","Bank","Energy"];
  const BIZ = [
    {id:"kiosk",n:"Lane Kiosk",i:"🏪",c:"Shop",p:400,h:18,max:20},
    {id:"mart",n:"Night Mart",i:"🛒",c:"Shop",p:2200,h:70,max:20},
    {id:"mall",n:"Arcade Hall",i:"🏬",c:"Shop",p:28000,h:620,max:22},
    {id:"shed",n:"River Shed",i:"🏭",c:"Works",p:3500,h:95,max:20},
    {id:"plant",n:"Forge Plant",i:"⚙️",c:"Works",p:42000,h:880,max:22},
    {id:"cart",n:"Corner Cart",i:"🌮",c:"Kitchen",p:700,h:28,max:18},
    {id:"cafe",n:"Harbor Roast",i:"☕",c:"Kitchen",p:2600,h:82,max:20},
    {id:"hall",n:"Goldfork",i:"🍽️",c:"Kitchen",p:36000,h:760,max:22},
    {id:"yard",n:"Brick Yard",i:"🧱",c:"Builder",p:8000,h:160,max:20},
    {id:"crew",n:"Skyline Crew",i:"🏗️",c:"Builder",p:64000,h:1200,max:22},
    {id:"lot",n:"Apex Lot",i:"🚗",c:"Motors",p:18000,h:380,max:20},
    {id:"show",n:"Crown Motors",i:"🏎️",c:"Motors",p:120000,h:2100,max:22},
    {id:"studio",n:"Pixel Desk",i:"💻",c:"Labs",p:24000,h:520,max:20},
    {id:"campus",n:"Lumen Labs",i:"🖥️",c:"Labs",p:180000,h:3200,max:22},
    {id:"vault",n:"Ledger Vault",i:"🏦",c:"Bank",p:90000,h:1600,max:24},
    {id:"hold",n:"Aurelia Hold",i:"🏛️",c:"Bank",p:750000,h:9800,max:24},
    {id:"well",n:"Helios Yard",i:"⛽",c:"Energy",p:220000,h:3800,max:24},
    {id:"field",n:"North Field",i:"🛢️",c:"Energy",p:1800000,h:24000,max:24}
  ];
  const HOMES = [
    {id:"studio",n:"Canal Studio",i:"🏠",p:12000,r:55,max:5},
    {id:"row",n:"Maple Row",i:"🏡",p:28000,r:120,max:5},
    {id:"loft",n:"Dock Loft",i:"🪟",p:76000,r:280,max:5},
    {id:"suite",n:"Ledger Suite",i:"🏢",p:180000,r:620,max:5},
    {id:"villa",n:"Vista Villa",i:"🌅",p:420000,r:1400,max:5},
    {id:"manor",n:"Crown Manor",i:"🏰",p:1600000,r:4800,max:5}
  ];
  const CARS = [
    {id:"city",n:"City Hatch",i:"🚗",p:8000,h:12},
    {id:"sedan",n:"Aurelia Sedan",i:"🚘",p:28000,h:40},
    {id:"sport",n:"Ridge Sport",i:"🏎️",p:120000,h:140},
    {id:"limo",n:"Night Limo",i:"🚖",p:260000,h:280},
    {id:"jet",n:"Sky Runner",i:"✈️",p:1800000,h:1600}
  ];
  const TICKER = [{id:"AUR",n:"Aurelia Goods"},{id:"NTH",n:"Northlight"},{id:"HLS",n:"Helios Energy"},{id:"PIX",n:"Pixel Desk"},{id:"CRW",n:"Crown Hold"},{id:"RVR",n:"Riverline"}];
  const JOBS = [
    ["j1","First tap","Tap the earn pad.",s=>s.stats.taps>=1,80,8],
    ["j2","Open a shop","Own any business.",s=>Object.keys(s.biz).length>=1,200,15],
    ["j3","House keys","Buy a home.",s=>Object.keys(s.homes).length>=1,300,18],
    ["j4","Market ticket","Buy a share.",s=>Object.values(s.shares).some(n=>n>0),250,16],
    ["j5","Three shops","Own 3 businesses.",s=>Object.keys(s.biz).length>=3,800,25],
    ["j6","Wheels","Buy a vehicle.",s=>s.cars.length>=1,400,18],
    ["j7","Builder","Open a Builder firm.",s=>!!s.biz.yard||!!s.biz.crew,900,28],
    ["j8","Banker","Open a bank.",s=>!!s.biz.vault||!!s.biz.hold,2000,40]
  ];
  const money=n=>{const a=Math.abs(n),s=n<0?"-":"";if(a>=1e9)return s+"$"+(a/1e9).toFixed(2)+"B";if(a>=1e6)return s+"$"+(a/1e6).toFixed(2)+"M";if(a>=1e4)return s+"$"+(a/1e3).toFixed(1)+"K";return s+"$"+Math.floor(a).toLocaleString();};
  const def=id=>BIZ.find(b=>b.id===id);
  const rate=b=>def(b.id).h*(1+(b.lv-1)*0.16);
  const upCost=b=>Math.floor(def(b.id).p*0.32*Math.pow(1.2,b.lv-1));
  const homeRate=h=>HOMES.find(x=>x.id===h.id).r*(1+h.imp*0.22);
  const tapVal=s=>1+s.tapLv*2+s.cars.length;
  const hour=s=>{let n=0;Object.values(s.biz).forEach(b=>n+=rate(b));Object.values(s.homes).forEach(h=>n+=homeRate(h));s.cars.forEach(id=>{const c=CARS.find(x=>x.id===id);if(c)n+=c.h;});return n;};
  const worth=s=>{let n=s.cash;Object.values(s.biz).forEach(b=>n+=def(b.id).p*b.lv*0.7+b.store);Object.values(s.homes).forEach(h=>n+=HOMES.find(x=>x.id===h.id).p);s.cars.forEach(id=>{const c=CARS.find(x=>x.id===id);if(c)n+=c.p*0.6;});TICKER.forEach(t=>n+=(s.shares[t.id]||0)*s.px[t.id]);return n;};
  const rank=s=>{let i=0;RANKS.forEach((r,idx)=>{if(s.xp>=r[0])i=idx;});const cur=RANKS[i],nxt=RANKS[i+1],span=nxt?nxt[0]-cur[0]:1;return {i,name:cur[1],pct:nxt?Math.min(1,(s.xp-cur[0])/span):1};};
  let S,tab="earn",filter="All",tapN=0;
  const fresh=()=>{const px={};TICKER.forEach(t=>px[t.id]=20+Math.random()*40);return {cash:0,xp:0,tapLv:0,biz:{},homes:{},cars:[],shares:{},px,jobs:[],stats:{taps:0,earned:0},last:Date.now(),name:"Founder",build:null};};
  const load=()=>{try{S=Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||"null")||fresh());}catch(e){S=fresh();}};
  const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
  const toast=m=>{const h=document.getElementById("toasts"),e=document.createElement("div");e.className="toast";e.textContent=m;h.prepend(e);setTimeout(()=>e.remove(),2600);};
  function tick(ms){const hr=ms/3600000;Object.values(S.biz).forEach(b=>b.store+=rate(b)*hr);Object.values(S.homes).forEach(h=>S.cash+=homeRate(h)*hr);S.cars.forEach(id=>{const c=CARS.find(x=>x.id===id);if(c)S.cash+=c.h*hr;});TICKER.forEach(t=>{const d=(Math.random()-0.48)*0.8;S.px[t.id]=Math.max(2,+(S.px[t.id]*(1+d/100)).toFixed(2));});if(S.build&&Date.now()>=S.build.done){S.cash+=S.build.pay;S.stats.earned+=S.build.pay;S.xp+=12;toast("Build finished +"+money(S.build.pay));S.build=null;}S.last=Date.now();}
  function scan(){JOBS.forEach(j=>{if(!S.jobs.includes(j[0])&&j[3](S)){S.jobs.push(j[0]);S.cash+=j[4];S.xp+=j[5];toast("Job: "+j[1]+" +"+money(j[4]));}})}
  function collect(){let n=0;Object.values(S.biz).forEach(b=>{n+=b.store;b.store=0;});if(n<1){toast("Nothing to collect");return;}S.cash+=n;S.stats.earned+=n;S.xp+=Math.max(1,Math.floor(n/2500));toast("Collected "+money(n));scan();paint();save();}
  function buyBiz(id){const b=def(id);if(!b||S.biz[id]||S.cash<b.p)return;S.cash-=b.p;S.biz[id]={id,lv:1,store:0};S.xp+=12;toast("Opened "+b.n);scan();paint();save();}
  function upBiz(id){const inst=S.biz[id],b=def(id);if(!inst||inst.lv>=b.max)return;const c=upCost(inst);if(S.cash<c){toast("Need "+money(c));return;}S.cash-=c;inst.lv++;S.xp+=6;toast(b.n+" lv "+inst.lv);scan();paint();save();}
  function buyHome(id){const h=HOMES.find(x=>x.id===id);if(!h||S.homes[id]||S.cash<h.p)return;S.cash-=h.p;S.homes[id]={id,imp:0};S.xp+=10;toast("Bought "+h.n);scan();paint();save();}
  function impHome(id){const h=S.homes[id],d=HOMES.find(x=>x.id===id);if(!h||h.imp>=d.max)return;const c=Math.floor(d.p*0.18*(h.imp+1));if(S.cash<c)return;S.cash-=c;h.imp++;S.xp+=5;toast(d.n+" improved");paint();save();}
  function buyCar(id){const c=CARS.find(x=>x.id===id);if(!c||S.cars.includes(id)||S.cash<c.p)return;S.cash-=c.p;S.cars.push(id);S.xp+=8;toast("Parked "+c.n);scan();paint();save();}
  function buyShare(id,n){const cost=S.px[id]*n;if(S.cash<cost)return;S.cash-=cost;S.shares[id]=(S.shares[id]||0)+n;scan();paint();save();}
  function sellShare(id,n){const have=S.shares[id]||0;if(have<n)return;S.shares[id]=have-n;S.cash+=S.px[id]*n;paint();save();}
  function startBuild(){if(!S.biz.yard&&!S.biz.crew){toast("Open a Builder firm first");return;}if(S.build){toast("A job is already running");return;}const cost=S.biz.crew?6000:1800,pay=S.biz.crew?16000:4800,wait=S.biz.crew?25000:18000;if(S.cash<cost){toast("Need "+money(cost));return;}S.cash-=cost;S.build={done:Date.now()+wait,pay};toast("Crew started a build");paint();save();}
  function paint(){const r=rank(S);document.getElementById("title-line").textContent="Aurelia · "+r.name;document.getElementById("worth-chip").textContent=money(worth(S));const dock=document.getElementById("dock");const tabs=[["earn","💵","Earn"],["biz","🏢","Biz"],["home","🏠","Homes"],["mkt","📈","Market"],["life","✨","Life"]];dock.innerHTML=tabs.map(t=>`<button class="${tab===t[0]?"on":""}" data-t="${t[0]}" type="button"><span>${t[1]}</span>${t[2]}</button>`).join("");dock.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;paint();});document.getElementById("view").innerHTML=({earn:vEarn,biz:vBiz,home:vHome,mkt:vMkt,life:vLife}[tab])();wire();}
  function vEarn(){const stored=Object.values(S.biz).reduce((n,b)=>n+b.store,0);const r=rank(S);return `<section class="cash-board"><div class="lbl">CASH ON HAND</div><div class="big">${money(S.cash)}</div><div class="muted">${money(hour(S))}/hr idle · tap ${money(tapVal(S))}</div><button class="tap" id="tap" type="button">TAP</button></section><div class="grid2"><div class="stat"><span>NET WORTH</span><b>${money(worth(S))}</b></div><div class="stat"><span>STORED</span><b>${money(stored)}</b></div><div class="stat"><span>RANK</span><b>${r.name}</b></div><div class="stat"><span>FIRMS</span><b>${Object.keys(S.biz).length}</b></div></div><div class="bar" style="margin:10px 0"><i style="width:${Math.round(r.pct*100)}%"></i></div><div class="grid2"><button class="btn m" data-a="collect" type="button">Collect firms</button><button class="btn g" data-a="tapup" type="button">Tap desk ${money(40+S.tapLv*55)}</button></div>${S.build?`<div class="card" style="margin-top:10px"><b>Build in progress</b><div class="muted">Payout ${money(S.build.pay)}</div></div>`:""}<div class="card" style="margin-top:10px"><b>Jobs</b>${JOBS.filter(j=>!S.jobs.includes(j[0])).slice(0,3).map(j=>`<div class="muted" style="margin-top:6px">${j[1]} · ${j[2]}</div>`).join("")||"<div class='muted'>Starter jobs done.</div>"}</div>`;}
  function vBiz(){const list=filter==="All"?BIZ:BIZ.filter(b=>b.c===filter);return `<div class="tabs"><button class="tab ${filter==="All"?"on":""}" data-f="All" type="button">All</button>${CATS.map(c=>`<button class="tab ${filter===c?"on":""}" data-f="${c}" type="button">${c}</button>`).join("")}</div>${(filter==="Builder"||Object.keys(S.biz).some(id=>def(id).c==="Builder"))?`<button class="btn g" data-a="build" type="button" style="width:100%;margin-bottom:8px">${S.build?"Build running…":"Start a construction job"}</button>`:""}${list.map(b=>{const o=S.biz[b.id];return `<article class="item"><div class="ico">${b.i}</div><div><b>${b.n}</b><div class="muted">${b.c} · ${o?"Lv "+o.lv+" · "+money(rate(o))+"/hr":money(b.h)+"/hr"}</div></div>${o?`<button class="btn g" data-up="${b.id}" type="button">${o.lv>=b.max?"Max":money(upCost(o))}</button>`:`<button class="btn g" data-buy="${b.id}" ${S.cash<b.p?"disabled":""} type="button">${money(b.p)}</button>`}</article>`;}).join("")}`;}
  function vHome(){return HOMES.map(h=>{const o=S.homes[h.id];return `<article class="item"><div class="ico">${h.i}</div><div><b>${h.n}</b><div class="muted">${o?"Imp "+o.imp+"/"+h.max+" · "+money(homeRate(o))+"/hr":money(h.r)+"/hr rent"}</div></div>${o?`<button class="btn g" data-imp="${h.id}" type="button">${o.imp>=h.max?"Max":money(Math.floor(h.p*0.18*(o.imp+1)))}</button>`:`<button class="btn g" data-home="${h.id}" ${S.cash<h.p?"disabled":""} type="button">${money(h.p)}</button>`}</article>`;}).join("");}
  function vMkt(){return `<div class="muted" style="margin-bottom:8px">Prices drift every second. Buy low, sell later.</div>`+TICKER.map(t=>{const have=S.shares[t.id]||0;return `<article class="card"><div class="row"><b>${t.id}</b><span class="price">${money(S.px[t.id])}</span></div><div class="muted">${t.n} · you hold ${have}</div><div class="grid2" style="margin-top:8px"><button class="btn g" data-bs="${t.id}" type="button">Buy 1</button><button class="btn" data-ss="${t.id}" type="button">Sell 1</button></div></article>`;}).join("");}
  function vLife(){return `<div class="card"><div class="field"><label class="muted">Display name</label><input id="nm" value="${S.name}" maxlength="16"></div><div class="field"><label class="muted">Access code</label><input id="cd" placeholder="Enter code" autocomplete="off"><button class="btn g" data-a="code" type="button">Submit</button></div></div><h2 class="h">Garage</h2>`+CARS.map(c=>{const have=S.cars.includes(c.id);return `<article class="item"><div class="ico">${c.i}</div><div><b>${c.n}</b><div class="muted">+${money(c.h)}/hr status</div></div><button class="btn g" data-car="${c.id}" ${have||S.cash<c.p?"disabled":""} type="button">${have?"Owned":money(c.p)}</button></article>`;}).join("")+`<button class="btn d" data-a="reset" type="button" style="width:100%;margin-top:8px">Reset save</button>`;}
  function wire(){const v=document.getElementById("view");const tap=document.getElementById("tap");if(tap)tap.onclick=()=>{S.cash+=tapVal(S);S.stats.taps++;S.stats.earned+=tapVal(S);S.xp+=0.05;tap.style.transform="scale(.94)";setTimeout(()=>tap.style.transform="",80);const big=document.querySelector(".big");if(big)big.textContent=money(S.cash);scan();};v.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{filter=b.dataset.f;paint();});v.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buyBiz(b.dataset.buy));v.querySelectorAll("[data-up]").forEach(b=>b.onclick=()=>upBiz(b.dataset.up));v.querySelectorAll("[data-home]").forEach(b=>b.onclick=()=>buyHome(b.dataset.home));v.querySelectorAll("[data-imp]").forEach(b=>b.onclick=()=>impHome(b.dataset.imp));v.querySelectorAll("[data-car]").forEach(b=>b.onclick=()=>buyCar(b.dataset.car));v.querySelectorAll("[data-bs]").forEach(b=>b.onclick=()=>buyShare(b.dataset.bs,1));v.querySelectorAll("[data-ss]").forEach(b=>b.onclick=()=>sellShare(b.dataset.ss,1));v.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>act(b.dataset.a));const nm=v.querySelector("#nm");if(nm)nm.onchange=()=>{S.name=nm.value.slice(0,16)||"Founder";save();};}
  function act(a){if(a==="collect")collect();if(a==="tapup"){const c=40+S.tapLv*55;if(S.cash<c){toast("Need "+money(c));return;}S.cash-=c;S.tapLv++;toast("Tap is now "+money(tapVal(S)));paint();save();}if(a==="build")startBuild();if(a==="code")tryCode((document.getElementById("cd")||{}).value);if(a==="reset"){if(confirm("Delete this save?")){S=fresh();save();paint();}}}
  function tryCode(v){if(String(v||"").trim().toUpperCase()===CODE){const a=document.activeElement;if(a&&a.blur)a.blur();setTimeout(openAdmin,100);return true;}toast("Wrong code");return false;}
  function pin(el){const vv=window.visualViewport,t=vv?Math.round(vv.offsetTop):0,l=vv?Math.round(vv.offsetLeft):0,w=vv?Math.round(vv.width):innerWidth,h=vv?Math.round(vv.height):innerHeight;el.style.cssText=`display:flex;position:fixed;z-index:2147483000;top:${t}px;left:${l}px;width:${w}px;height:${h}px;background:#08101c;flex-direction:column`;}
  function openAdmin(){const el=document.getElementById("admin");el.hidden=false;pin(el);el.innerHTML=`<div class="admin-top"><div><div class="muted">CONSOLE</div><h3 style="margin:0;color:var(--gold)">FERRARI1</h3></div><button class="btn g" id="ax" type="button">Close</button></div><div class="admin-body"><button class="btn" data-c="100000" type="button">+$100K</button><button class="btn" data-c="1000000" type="button">+$1M</button><button class="btn" data-c="100000000" type="button">+$100M</button><button class="btn" data-x="1" type="button">+500 XP</button><button class="btn d" data-r="1" type="button">Reset</button></div>`;el.querySelector("#ax").onclick=closeAdmin;el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{S.cash+=+b.dataset.c;save();paint();openAdmin();});el.querySelector("[data-x]").onclick=()=>{S.xp+=500;save();paint();openAdmin();};el.querySelector("[data-r]").onclick=()=>{if(confirm("Reset?")){S=fresh();closeAdmin();save();paint();}};}
  function closeAdmin(){const el=document.getElementById("admin");el.hidden=true;el.innerHTML="";el.removeAttribute("style");}
  function boot(){load();const away=Date.now()-S.last;if(away>12000){const cap=Math.min(away,8*3600000);const before=S.cash+Object.values(S.biz).reduce((n,b)=>n+b.store,0);tick(cap);const after=S.cash+Object.values(S.biz).reduce((n,b)=>n+b.store,0);if(after-before>1)toast("While away "+money(after-before));}scan();paint();setInterval(()=>{tick(1000);if(tab==="mkt")paint();else{const big=document.querySelector(".big");if(big)big.textContent=money(S.cash);document.getElementById("worth-chip").textContent=money(worth(S));}save();},1000);document.getElementById("logo").onclick=()=>{tapN++;setTimeout(()=>tapN=0,1400);if(tapN>=5){tapN=0;const v=prompt("Access code");if(v)tryCode(v);}};document.addEventListener("keydown",e=>{if((e.target.tagName||"")==="INPUT")return;if(!e.key||e.key.length!==1)return;boot.buf=((boot.buf||"")+e.key.toUpperCase()).slice(-CODE.length);if(boot.buf===CODE){boot.buf="";openAdmin();}});}
  boot();
})();
