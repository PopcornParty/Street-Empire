(() => {
  const SAVE_KEY = "se-empire-v2";
  const CODE = "FERRARI1";
  const RANKS = [[0,"Starter"],[80,"Hustler"],[250,"Owner"],[600,"Investor"],[1200,"Operator"],[2200,"Tycoon"],[4000,"Mogul"],[7000,"Magnate"],[11000,"Legend"],[17000,"Sovereign"]];
  const DISTRICTS = [
    { id:"downtown", name:"Downtown", cash:0, tint:"#3fd6b3" },
    { id:"suburbs", name:"Suburbs", cash:18000, tint:"#8b7cff" },
    { id:"yard", name:"Yard", cash:65000, tint:"#f3c15a" },
    { id:"harbour", name:"Harbour", cash:160000, tint:"#4da6ff" },
    { id:"ledger", name:"Ledger Row", cash:420000, tint:"#53d48a" },
    { id:"neon", name:"Neon Strip", cash:850000, tint:"#ff6b8a" },
    { id:"hills", name:"Vista Hills", cash:1800000, tint:"#ffb36b" },
    { id:"sky", name:"Skygate", cash:4500000, tint:"#7ad0ff" }
  ];
  const BIZ = [
    { id:"cart", name:"Corner Cart", icon:"🌮", d:"downtown", price:2200, hour:80, max:12 },
    { id:"cafe", name:"Harbor Roast", icon:"☕", d:"downtown", price:5500, hour:160, max:12 },
    { id:"mart", name:"Night Owl Mart", icon:"🏪", d:"downtown", price:8200, hour:220, max:12 },
    { id:"wash", name:"Sparkle Wash", icon:"🚿", d:"downtown", price:11000, hour:280, max:12 },
    { id:"threads", name:"Thread & Co.", icon:"👕", d:"downtown", price:14000, hour:320, max:12 },
    { id:"oven", name:"Sunrise Oven", icon:"🥐", d:"suburbs", price:16000, hour:360, max:14 },
    { id:"gym", name:"Iron Hour", icon:"💪", d:"suburbs", price:28000, hour:620, max:14 },
    { id:"aisle", name:"Fresh Aisle", icon:"🛒", d:"suburbs", price:48000, hour:980, max:15 },
    { id:"petal", name:"Petal Market", icon:"💐", d:"suburbs", price:20000, hour:440, max:12 },
    { id:"garage", name:"Torque Works", icon:"🔧", d:"yard", price:42000, hour:900, max:14 },
    { id:"plant", name:"Riverline Works", icon:"🏭", d:"yard", price:190000, hour:3400, max:16 },
    { id:"cars", name:"Apex Motors", icon:"🚗", d:"yard", price:260000, hour:4200, max:16 },
    { id:"pack", name:"Gridline Yard", icon:"📦", d:"yard", price:720000, hour:9800, max:18 },
    { id:"inn", name:"Lantern Inn", icon:"🛏️", d:"harbour", price:64000, hour:1200, max:15 },
    { id:"hotel", name:"Crown Hotel", icon:"🏨", d:"harbour", price:980000, hour:12800, max:18 },
    { id:"docks", name:"Atlas Docks", icon:"🚢", d:"harbour", price:8200000, hour:72000, max:20 },
    { id:"office", name:"Northlight", icon:"🏢", d:"ledger", price:160000, hour:2800, max:16 },
    { id:"tower", name:"Keystone Tower", icon:"🏙️", d:"ledger", price:680000, hour:8800, max:18 },
    { id:"bank", name:"Aegis Bank", icon:"🏦", d:"ledger", price:2800000, hour:32000, max:20 },
    { id:"cinema", name:"Velvet Screen", icon:"🎬", d:"neon", price:210000, hour:3600, max:16 },
    { id:"bowl", name:"River Bowl", icon:"🏟️", d:"neon", price:1400000, hour:17000, max:18 },
    { id:"dine", name:"Goldfork", icon:"🥂", d:"hills", price:230000, hour:3800, max:16 },
    { id:"villa", name:"Hillcrest Club", icon:"🏡", d:"hills", price:520000, hour:7600, max:16 },
    { id:"gate", name:"Terminal A", icon:"✈️", d:"sky", price:3600000, hour:42000, max:20 },
    { id:"intl", name:"Skygate Intl", icon:"🌐", d:"sky", price:14000000, hour:130000, max:20 }
  ];
  const PROPS = [
    { id:"studio", name:"Canal Studio", icon:"🏠", d:"downtown", price:18000, rent:70 },
    { id:"row", name:"Maple Row House", icon:"🏡", d:"suburbs", price:42000, rent:160 },
    { id:"loft", name:"Dock Loft", icon:"🪟", d:"harbour", price:120000, rent:420 },
    { id:"suite", name:"Ledger Suite", icon:"🏢", d:"ledger", price:280000, rent:900 },
    { id:"villa", name:"Vista Villa", icon:"🌅", d:"hills", price:750000, rent:2200 }
  ];
  const JOBS = [
    { id:"j1", name:"Open a shop", text:"Buy your first business.", check:s => owned(s).length >= 1, cash:400, xp:20 },
    { id:"j2", name:"First till", text:"Collect profits once.", check:s => s.stats.collects >= 1, cash:250, xp:10 },
    { id:"j3", name:"Level 2", text:"Upgrade any shop to level 2.", check:s => owned(s).some(b => b.lv >= 2), cash:500, xp:20 },
    { id:"j4", name:"Two signs", text:"Own 2 businesses.", check:s => owned(s).length >= 2, cash:700, xp:25 },
    { id:"j5", name:"Unlock Suburbs", text:"Open the Suburbs district.", check:s => s.districts.includes("suburbs"), cash:900, xp:30 },
    { id:"j6", name:"Five shops", text:"Own 5 businesses.", check:s => owned(s).length >= 5, cash:2000, xp:40 },
    { id:"j7", name:"Landlord", text:"Buy a property.", check:s => Object.keys(s.props).length >= 1, cash:800, xp:25 },
    { id:"j8", name:"Busy hour", text:"Reach $1,000 / hr.", check:s => netHour(s) >= 1000, cash:1500, xp:35 },
    { id:"j9", name:"Yard papers", text:"Unlock the Yard.", check:s => s.districts.includes("yard"), cash:2500, xp:45 },
    { id:"j10", name:"Million book", text:"Reach $1,000,000 net worth.", check:s => worth(s) >= 1e6, cash:4000, xp:60 }
  ];
  const ACH = [
    { id:"a1", name:"First Deal", text:"Buy a business.", check:s => owned(s).length >= 1, cash:150, xp:8 },
    { id:"a2", name:"Pocket Cash", text:"Hold $20,000.", check:s => s.cash >= 20000, cash:200, xp:8 },
    { id:"a3", name:"Two Keys", text:"Own 2 properties.", check:s => Object.keys(s.props).length >= 2, cash:250, xp:10 },
    { id:"a4", name:"Five Shops", text:"Own 5 businesses.", check:s => owned(s).length >= 5, cash:300, xp:12 },
    { id:"a5", name:"Collector", text:"Collect 8 times.", check:s => s.stats.collects >= 8, cash:180, xp:8 },
    { id:"a6", name:"Upgrader", text:"Upgrade 6 times.", check:s => s.stats.ups >= 6, cash:180, xp:8 },
    { id:"a7", name:"New Streets", text:"Unlock 3 districts.", check:s => s.districts.length >= 3, cash:280, xp:12 },
    { id:"a8", name:"Owner Rank", text:"Reach Owner rank.", check:s => rank(s).i >= 2, cash:220, xp:10 }
  ];
  const money = n => {
    const a = Math.abs(n); const s = n < 0 ? "-" : "";
    if (a >= 1e9) return s + "$" + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return s + "$" + (a / 1e6).toFixed(2) + "M";
    if (a >= 1e4) return s + "$" + (a / 1e3).toFixed(1) + "K";
    return s + "$" + Math.floor(a).toLocaleString();
  };
  const def = id => BIZ.find(b => b.id === id);
  const owned = s => Object.values(s.biz);
  const rate = inst => def(inst.id).hour * (1 + (inst.lv - 1) * 0.18);
  const upCost = inst => Math.floor(def(inst.id).price * 0.34 * Math.pow(1.22, inst.lv - 1));
  const netHour = s => owned(s).reduce((n, b) => n + rate(b), 0) + Object.keys(s.props).reduce((n, id) => n + (PROPS.find(p => p.id === id)?.rent || 0), 0);
  const worth = s => s.cash + owned(s).reduce((n, b) => n + def(b.id).price * b.lv * 0.7 + b.stored, 0) + Object.keys(s.props).reduce((n, id) => n + (PROPS.find(p => p.id === id)?.price || 0), 0);
  const rank = s => {
    let i = 0; RANKS.forEach((r, idx) => { if (s.xp >= r[0]) i = idx; });
    const cur = RANKS[i], next = RANKS[i + 1], span = next ? next[0] - cur[0] : 1;
    return { i, name: cur[1], pct: next ? Math.min(1, (s.xp - cur[0]) / span) : 1 };
  };
  let S = null, tab = "map", tapLogo = 0;
  function fresh() {
    return { cash:10000, xp:0, biz:{}, props:{}, districts:["downtown"], jobs:[], ach:[], stats:{collects:0,ups:0,earned:0}, last:Date.now(), name:"Founder", tutorial:false };
  }
  function load() { try { const raw = localStorage.getItem(SAVE_KEY); S = raw ? Object.assign(fresh(), JSON.parse(raw)) : fresh(); } catch { S = fresh(); } }
  function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
  function toast(msg) {
    const host = document.getElementById("toasts"); const el = document.createElement("div");
    el.className = "toast"; el.textContent = msg; host.prepend(el); setTimeout(() => el.remove(), 2800);
  }
  function tick(dt) {
    const hours = dt / 3600000;
    owned(S).forEach(b => { b.stored += rate(b) * hours; });
    Object.keys(S.props).forEach(id => { const p = PROPS.find(x => x.id === id); if (p) S.cash += p.rent * hours; });
    S.last = Date.now();
  }
  function collectAll() {
    let n = 0; owned(S).forEach(b => { n += b.stored; b.stored = 0; });
    if (n < 1) { toast("Tills are empty."); return; }
    S.cash += n; S.stats.earned += n; S.stats.collects += 1; S.xp += Math.max(1, Math.floor(n / 4000));
    toast("Collected " + money(n)); scan(); paint(); save();
  }
  function buyBiz(id) {
    const b = def(id); if (!b || S.biz[id] || S.cash < b.price || !S.districts.includes(b.d)) return;
    S.cash -= b.price; S.biz[id] = { id, lv:1, stored:0 }; S.xp += 15; toast("Opened " + b.name); scan(); paint(); save();
  }
  function upgrade(id) {
    const inst = S.biz[id], b = def(id); if (!inst || inst.lv >= b.max) return;
    const cost = upCost(inst); if (S.cash < cost) { toast("Need " + money(cost)); return; }
    S.cash -= cost; inst.lv += 1; S.stats.ups += 1; S.xp += 8; toast(b.name + " → Lv " + inst.lv); scan(); paint(); save();
  }
  function unlockDistrict(id) {
    const d = DISTRICTS.find(x => x.id === id); if (!d || S.districts.includes(id) || S.cash < d.cash) return;
    S.cash -= d.cash; S.districts.push(id); S.xp += 25; toast(d.name + " is open"); scan(); paint(); save();
  }
  function buyProp(id) {
    const p = PROPS.find(x => x.id === id); if (!p || S.props[id] || S.cash < p.price || !S.districts.includes(p.d)) return;
    S.cash -= p.price; S.props[id] = 1; S.xp += 12; toast("Bought " + p.name); scan(); paint(); save();
  }
  function scan() {
    JOBS.forEach(j => { if (!S.jobs.includes(j.id) && j.check(S)) { S.jobs.push(j.id); S.cash += j.cash; S.xp += j.xp; toast("Job done: " + j.name + " +" + money(j.cash)); } });
    ACH.forEach(a => { if (!S.ach.includes(a.id) && a.check(S)) { S.ach.push(a.id); S.cash += a.cash; S.xp += a.xp; toast("Badge: " + a.name); } });
  }
  function top() {
    document.getElementById("cash-label").textContent = money(S.cash);
    document.getElementById("rate-label").textContent = money(netHour(S));
    document.getElementById("rank-label").textContent = rank(S).name;
  }
  function paint() {
    top();
    const view = document.getElementById("view"); const dock = document.getElementById("dock");
    const tabs = [["map","🗺️","City"],["empire","🏢","Empire"],["shop","🛒","Shop"],["jobs","🎯","Jobs"],["more","☰","More"]];
    dock.innerHTML = tabs.map(t => `<button class="${tab === t[0] ? "on" : ""}" data-tab="${t[0]}" type="button"><span>${t[1]}</span>${t[2]}</button>`).join("");
    dock.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; paint(); });
    view.innerHTML = ({ map: viewMap, empire: viewEmpire, shop: viewShop, jobs: viewJobs, more: viewMore }[tab] || viewMap)();
    wire(view);
  }
  function viewMap() {
    return `<div class="city">${DISTRICTS.map(d => {
      const open = S.districts.includes(d.id); const plots = BIZ.filter(b => b.d === d.id);
      return `<section class="district ${open ? "" : "lock"}" style="border-color:${d.tint}55">
        <div class="row"><b>${d.name}</b>${open ? `<span class="muted">${plots.filter(p => S.biz[p.id]).length}/${plots.length} owned</span>` : `<button class="btn gold" data-unlock="${d.id}" ${S.cash >= d.cash ? "" : "disabled"} type="button">Unlock ${money(d.cash)}</button>`}</div>
        <div class="plots">${plots.map(b => { const o = S.biz[b.id]; return `<button class="plot ${o ? "own" : ""}" data-plot="${b.id}" type="button">${b.icon}<small>${o ? "Lv " + o.lv : open ? money(b.price) : "🔒"}</small></button>`; }).join("")}</div></section>`;
    }).join("")}</div>`;
  }
  function viewEmpire() {
    const list = owned(S); const stored = list.reduce((n, b) => n + b.stored, 0); const r = rank(S);
    if (!list.length) return `<div class="card"><h2 class="h">No shops yet</h2><p class="muted">Open City and tap an empty plot.</p><button class="btn gold" data-tabgo="map" type="button">Go to city</button></div>`;
    return `<div class="hero"><div class="muted">YOUR EMPIRE</div><h1>${S.name}</h1><div class="row"><span>${r.name}</span><span class="muted">${S.xp} XP</span></div><div class="bar"><i style="width:${Math.round(r.pct * 100)}%"></i></div></div>
      <div class="actions" style="margin-bottom:10px"><button class="btn mint" data-act="collect" type="button">Collect ${stored > 1 ? money(stored) : ""}</button></div>
      <div class="list">${list.map(inst => { const b = def(inst.id); return `<article class="item"><div class="ico">${b.icon}</div><div><b>${b.name}</b><div class="muted">Lv ${inst.lv}/${b.max} · ${money(rate(inst))}/hr</div></div><button class="btn gold" data-up="${b.id}" type="button">${inst.lv >= b.max ? "Max" : money(upCost(inst))}</button></article>`; }).join("")}</div>`;
  }
  function viewShop() {
    return `<h2 class="h">Buy in open districts</h2><div class="list">${BIZ.map(b => {
      const open = S.districts.includes(b.d); const have = !!S.biz[b.id];
      return `<article class="item"><div class="ico">${b.icon}</div><div><b>${b.name}</b><div class="muted">${money(b.hour)}/hr · ${DISTRICTS.find(d => d.id === b.d).name}</div></div><button class="btn gold" data-buy="${b.id}" ${have || !open || S.cash < b.price ? "disabled" : ""} type="button">${have ? "Owned" : !open ? "Locked" : money(b.price)}</button></article>`;
    }).join("")}</div><h2 class="h" style="margin-top:14px">Properties</h2><div class="list">${PROPS.map(p => {
      const have = !!S.props[p.id]; const open = S.districts.includes(p.d);
      return `<article class="item"><div class="ico">${p.icon}</div><div><b>${p.name}</b><div class="muted">Rent ${money(p.rent)}/hr</div></div><button class="btn gold" data-prop="${p.id}" ${have || !open || S.cash < p.price ? "disabled" : ""} type="button">${have ? "Owned" : money(p.price)}</button></article>`;
    }).join("")}</div>`;
  }
  function viewJobs() {
    const open = JOBS.filter(j => !S.jobs.includes(j.id));
    return `<h2 class="h">Jobs ${S.jobs.length}/${JOBS.length}</h2><div class="list">${(open.length ? open : JOBS.slice(-3)).map(j => `<article class="card"><b>${j.name}</b><div class="muted">${j.text}</div><div class="price" style="margin-top:6px">${S.jobs.includes(j.id) ? "Done" : money(j.cash)}</div></article>`).join("")}</div>
      <h2 class="h" style="margin-top:14px">Badges ${S.ach.length}/${ACH.length}</h2><div class="ach">${ACH.map(a => `<div class="badge ${S.ach.includes(a.id) ? "on" : ""}"><b>${a.name}</b><div class="muted">${a.text}</div><div class="muted">${money(a.cash)}</div></div>`).join("")}</div>`;
  }
  function viewMore() {
    return `<div class="kpis"><div class="kpi"><span>NET WORTH</span><b>${money(worth(S))}</b></div><div class="kpi"><span>SHOPS</span><b>${owned(S).length}</b></div><div class="kpi"><span>DISTRICTS</span><b>${S.districts.length}/${DISTRICTS.length}</b></div><div class="kpi"><span>EARNED</span><b>${money(S.stats.earned)}</b></div></div>
    <div class="card"><div class="field"><label class="muted">Display name</label><input id="name-in" value="${S.name}" maxlength="16" /></div>
      <div class="field"><label class="muted">Access code</label><input id="code-in" placeholder="Type a code" autocomplete="off" /><button class="btn gold" data-act="code" type="button">Submit code</button></div>
      <button class="btn" data-act="export" type="button">Export save</button><button class="btn danger" data-act="reset" type="button">Reset save</button></div>`;
  }
  function wire(root) {
    root.querySelectorAll("[data-tabgo]").forEach(b => b.onclick = () => { tab = b.dataset.tabgo; paint(); });
    root.querySelectorAll("[data-unlock]").forEach(b => b.onclick = () => unlockDistrict(b.dataset.unlock));
    root.querySelectorAll("[data-plot]").forEach(b => b.onclick = () => openPlot(b.dataset.plot));
    root.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => buyBiz(b.dataset.buy));
    root.querySelectorAll("[data-up]").forEach(b => b.onclick = () => upgrade(b.dataset.up));
    root.querySelectorAll("[data-prop]").forEach(b => b.onclick = () => buyProp(b.dataset.prop));
    root.querySelectorAll("[data-act]").forEach(b => b.onclick = () => act(b.dataset.act));
    const name = root.querySelector("#name-in"); if (name) name.onchange = () => { S.name = name.value.slice(0, 16) || "Founder"; save(); };
  }
  function openPlot(id) {
    const b = def(id); const inst = S.biz[id];
    if (!S.districts.includes(b.d)) { toast("Unlock this district first."); return; }
    if (!inst) {
      sheet(`<h3>${b.icon} ${b.name}</h3><p class="muted">${money(b.hour)}/hr at level 1</p><p class="price">${money(b.price)}</p><button class="btn gold" id="do" ${S.cash >= b.price ? "" : "disabled"} type="button">Buy</button>`, el => {
        const btn = el.querySelector("#do"); if (btn && !btn.disabled) btn.onclick = () => { buyBiz(id); closeSheet(); };
      }); return;
    }
    sheet(`<h3>${b.icon} ${b.name}</h3><p class="muted">Level ${inst.lv}/${b.max} · ${money(rate(inst))}/hr</p><p class="muted">Stored ${money(inst.stored)}</p><button class="btn mint" id="col" type="button">Collect shop</button><button class="btn gold" id="up" ${inst.lv >= b.max || S.cash < upCost(inst) ? "disabled" : ""} type="button">Upgrade ${inst.lv >= b.max ? "" : money(upCost(inst))}</button>`, el => {
      el.querySelector("#col").onclick = () => { S.cash += inst.stored; S.stats.earned += inst.stored; if (inst.stored > 1) S.stats.collects += 1; inst.stored = 0; save(); paint(); closeSheet(); };
      const up = el.querySelector("#up"); if (up && !up.disabled) up.onclick = () => { upgrade(id); closeSheet(); };
    });
  }
  function sheet(html, bind) {
    const host = document.getElementById("sheet"); host.hidden = false;
    host.innerHTML = `<div class="sheet">${html}<button class="btn" id="sheet-x" type="button" style="margin-top:10px">Close</button></div>`;
    host.onclick = e => { if (e.target === host) closeSheet(); }; host.querySelector("#sheet-x").onclick = closeSheet; if (bind) bind(host);
  }
  function closeSheet() { const host = document.getElementById("sheet"); host.hidden = true; host.innerHTML = ""; }
  function act(kind) {
    if (kind === "collect") collectAll();
    if (kind === "code") { const box = document.getElementById("code-in"); tryCode(box ? box.value : ""); }
    if (kind === "export") { const blob = new Blob([JSON.stringify(S)], { type:"application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "street-empire.json"; a.click(); }
    if (kind === "reset") { if (confirm("Delete this save?")) { S = fresh(); save(); paint(); } }
  }
  function tryCode(v) {
    if (String(v || "").trim().toUpperCase() === CODE) { const a = document.activeElement; if (a && a.blur) a.blur(); setTimeout(openAdmin, 120); return true; }
    toast("That code does nothing."); return false;
  }
  function pinAdmin(el) {
    const vv = window.visualViewport; const top = vv ? Math.round(vv.offsetTop) : 0; const left = vv ? Math.round(vv.offsetLeft) : 0;
    const w = vv ? Math.round(vv.width) : window.innerWidth; const h = vv ? Math.round(vv.height) : window.innerHeight;
    el.style.cssText = `display:flex;position:fixed;z-index:2147483000;top:${top}px;left:${left}px;width:${w}px;height:${h}px;background:#071018;flex-direction:column;`;
  }
  function openAdmin() {
    const el = document.getElementById("admin"); el.hidden = false; pinAdmin(el);
    el.innerHTML = `<div class="admin-top"><div><div class="muted">SECRET CONSOLE</div><h3 style="margin:0;color:var(--gold)">FERRARI1 ADMIN</h3></div><button class="btn gold" id="ad-x" type="button">Close</button></div>
      <div class="admin-body"><button class="btn" data-cash="100000" type="button">+$100K</button><button class="btn" data-cash="1000000" type="button">+$1M</button><button class="btn" data-cash="100000000" type="button">+$100M</button><button class="btn" data-ad="xp" type="button">+400 XP</button><button class="btn" data-ad="open" type="button">Unlock city</button><button class="btn" data-ad="shops" type="button">Own all shops</button><button class="btn danger" data-ad="reset" type="button">Reset progress</button></div>`;
    el.querySelector("#ad-x").onclick = closeAdmin;
    el.querySelectorAll("[data-cash]").forEach(b => b.onclick = () => { S.cash += Number(b.dataset.cash); save(); paint(); openAdmin(); });
    el.querySelectorAll("[data-ad]").forEach(b => b.onclick = () => adminAct(b.dataset.ad));
  }
  function closeAdmin() { const el = document.getElementById("admin"); el.hidden = true; el.innerHTML = ""; el.removeAttribute("style"); }
  function adminAct(act) {
    if (act === "xp") S.xp += 400;
    if (act === "open") DISTRICTS.forEach(d => { if (!S.districts.includes(d.id)) S.districts.push(d.id); });
    if (act === "shops") { BIZ.forEach(b => { if (!S.biz[b.id]) S.biz[b.id] = { id:b.id, lv:1, stored:0 }; }); S.districts = DISTRICTS.map(d => d.id); }
    if (act === "reset") { if (confirm("Delete this save?")) { S = fresh(); closeAdmin(); save(); paint(); return; } }
    save(); paint(); openAdmin();
  }
  function boot() {
    load();
    const away = Date.now() - S.last;
    if (away > 15000) {
      const cap = Math.min(away, 8 * 3600000);
      const before = S.cash + owned(S).reduce((n, b) => n + b.stored, 0);
      tick(cap); const after = S.cash + owned(S).reduce((n, b) => n + b.stored, 0);
      if (after - before > 1) toast("While away: " + money(after - before));
    }
    scan(); paint();
    if (!S.tutorial) {
      sheet(`<h3>Welcome to Street Empire</h3><p class="muted">You have $10,000 in Downtown. Buy a shop, let it earn, collect, upgrade, then unlock the next district.</p><button class="btn gold" id="go" type="button">Start in the city</button>`, el => {
        el.querySelector("#go").onclick = () => { S.tutorial = true; save(); closeSheet(); tab = "map"; paint(); };
      });
    }
    setInterval(() => { tick(1000); top(); save(); }, 1000);
    document.getElementById("logo-btn").onclick = () => {
      tapLogo += 1; setTimeout(() => { tapLogo = 0; }, 1400);
      if (tapLogo >= 5) { tapLogo = 0; const v = prompt("Enter access code"); if (v) tryCode(v); }
    };
    document.addEventListener("keydown", e => {
      if ((e.target.tagName || "") === "INPUT") return;
      if (!e.key || e.key.length !== 1) return;
      boot.buf = ((boot.buf || "") + e.key.toUpperCase()).slice(-CODE.length);
      if (boot.buf === CODE) { boot.buf = ""; openAdmin(); }
    });
  }
  boot();
})();
