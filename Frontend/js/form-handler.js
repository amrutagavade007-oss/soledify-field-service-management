/* Survey definitions: 25 company/flow-chart/suggested parameters per survey.
   Param: [key, label, spec, optional?, condition?]
   Spec tokens joined by "+", each "type:opt1|opt2@Sub-label":
   a auto | t text | to optional text | x textarea | ph phone | n number >=0 | N number >0 | d date
   s select | m multi-select | y yes/no (No asks r/p) | Y yes/no (Yes asks r/p) | pf pass/fail (Fail asks r/p)
   pfg pass/fail group | r remarks | g signature | gps location | ci check-in/out | cnt cleaning counter
   FILES: p photo | po optional photo | u upload (photo or PDF) | k sketch photo | c camera photos (opt = one tile each) | v video
   Field keys sent to the API are <key>_<position>, e.g. roofType_0, earthR_0. */
const SV = {
pre:{title:'Pre-installation survey',steps:[
 ['Visit and customer',[
  ['visit','Visit ID, date and technician','a+t@Technician name'],
  ['cust','Customer name and contact number','a+ph@Contact number'],
  ['addr','Site address','t'],
  ['gps','GPS location (captured at check-in)','gps'],
  ['siteType','Site type','s:Residential|Commercial|Industrial']]],
 ['Roof',[
  ['roofType','Roof type','s:Metal sheet|RCC'],
  ['roofAngle','Roof angle (degrees)','n'],
  ['space','Available space for panels (m²)','N'],
  ['roofCond','Roof assessment: condition (leakage, cracks, corrosion)','s:Good|Leakage|Cracks|Corrosion+r'],
  ['facing','Roof direction (facing)','s:North|North-East|East|South-East|South|South-West|West|North-West'],
  ['dims','Roof assessment: dimensions and sketch','t@Length × width (m)+k@Sketch'],
  ['shade','Shading sources (trees, buildings, tanks, etc.)','m:Trees|Buildings|Water tank|Other|None+po@Shading photo'],
  ['access','Roof access','s:Stairs|Ladder|Crane needed']]],
 ['Electrical',[
  ['supply','Electrical check: supply type and voltage','s:Single phase 230V|Three phase 415V'],
  ['load','Electrical check: sanctioned load / contract demand','N@Load+s:kW|kVA@Unit'],
  ['meter','Electrical check: meter and main panel location and condition','p+t@Location and condition'],
  ['bills','Electrical bills (last 12 months)','u'],
  ['consume','Average monthly consumption (kWh)','N'],
  ['earthing','Earthing details (existing earthing)','s:Good|Needs repair|Not available+p']]],
 ['Plant layout',[
  ['invLoc','Proposed inverter location','p+t@Location notes'],
  ['cable','Proposed cable route and injection point','k']]],
 ['Photos and videos',[
  ['photos','Site photos (mandatory set, time-stamped)','c:Front|Roof|Shade|Meter|Panel|Earthing'],
  ['videos','Site videos (walkthrough)','v',1]]],
 ['Sign-off',[
  ['custReq','Customer requirements and customer signature','x@Customer requirements+g@Customer signature'],
  ['status','Survey report status and handoff to quotation','s:Ready for review|Needs revisit@Report status+y@Hand off findings to the quotation team?']]]]},
post:{title:'Post-installation survey',steps:[
 ['Installation',[
  ['visit','Visit ID, date and technician','a+t@Technician name'],
  ['plant','Plant ID, customer and site','a'],
  ['instDate','Installation completion date','d'],
  ['kwp','Installed capacity (kWp)','N'],
  ['equip','Equipment details (panel, inverter make, model, serial)','t@Panel make, model, serial+t@Inverter make, model, serial'],
  ['layout','Panel count and layout compared with the approved pre-survey','N@Panels installed+y@Layout matches the approved pre-survey?']]],
 ['Array and roof',[
  ['arrayArea','Area covered by the solar array (m²)','N'],
  ['spaceLeft','Space available (remaining / for expansion)','n@Space (m²)+p'],
  ['roofAfter','Roof assessment after installation (leakage, sealing, drilling)','s:Good|Leakage|Sealing needed|Drilling damage+p'],
  ['angle','Panel angle as installed (degrees)','n'],
  ['panelCond','Inspection: panel physical condition (cracks, damage)','s:Good|Cracks|Damaged+p']]],
 ['Electrical',[
  ['room','Electrical space / room condition','s:Good|Needs attention|Unsafe+p'],
  ['wiring','Electrical check: DC / AC wiring, cable route and junction box','s:Good|Needs attention|Not satisfactory+p'],
  ['meterConn','Electrical check: meter and main panel connection','p+t@Notes'],
  ['invInst','Inverter installation and location','p+t@Notes'],
  ['inject','Injection point details and location','t@Details+p'],
  ['earthLoc','Earthing location','p+t@Notes'],
  ['earthR','Earthing resistance reading (Ω)','N']]],
 ['Protection and commissioning',[
  ['prot','Protection devices (MCB, SPD, fuse) and lightning arrester','pfg:MCB|SPD|Fuse|Lightning arrester'],
  ['comm','Commissioning readings (voltage, current, initial generation)','n@DC voltage (V)+n@AC voltage (V)+n@DC current (A)+n@AC current (A)+n@Initial generation (kWh)'],
  ['sched','Maintenance schedule set up (frequency and first due date)','s:Monthly|Quarterly|Half-yearly|Yearly@Frequency+d@First due date'],
  ['reqMet','Customer requirements met (compared with the pre-survey)','y+r']]],
 ['Photos and videos',[
  ['photos','Photos (as built, time-stamped)','c:Array|Inverter|Meter|Earthing|Injection point'],
  ['videos','Videos (plant walkthrough)','v']]],
 ['Handover',[
  ['handoff','Post-survey report, handoff and customer signature','s:Ready for review|Pending work@Report status+g@Customer signature']]]]},
om:{title:'Maintenance survey',steps:[
 ['Visit',[
  ['visit','Visit ID, date and O&M technician / team','a+t@Technician / team'],
  ['plant','Plant ID, customer and site','a'],
  ['vtype','Visit type','s:Maintenance|Cleaning|Inspection'],
  ['yearly','Yearly re-check visit? (extra field, shows the yearly steps)','y',1],
  ['sched','Maintenance schedule: planned date and frequency','d@Planned date+s:Monthly|Quarterly|Half-yearly|Yearly@Frequency'],
  ['nextDue','Next maintenance due date','d'],
  ['checkio','Check-in and check-out time with GPS location','ci'],
  ['cleanCnt','Cleaning checks completed this year (target 18 to 24 for C&I)','cnt']]],
 ['Cleaning',[
  ['method','Cleaning method','s:Dry|Water|Other'],
  ['qty','Panels / area cleaned (count or m²)','N@Quantity+s:Panels|m²@Unit'],
  ['surface','Panel surface condition (dust, bird droppings, stains)','s:Clean|Dust|Bird droppings|Stains+r'],
  ['before','Before photos / videos (time-stamped)','c'],
  ['after','After photos / videos (time-stamped)','c']]],
 ['Inspection',[
  ['damage','Inspection: visible damage (cracks, broken glass, frame)','Y+p'],
  ['mount','Inspection: mounting structure and clamps condition','s:Good|Loose|Damaged+r'],
  ['cable','Inspection: cable and connector condition','s:Good|Needs attention|Damaged+r'],
  ['inverter','Inverter status and error codes','s:Normal|Warning|Fault+to@Error code (if any)'],
  ['gen','Generation reading on the day (kWh)','n'],
  ['prot','Earthing and protection devices check (MCB, SPD, fuse)','pfg:MCB|SPD|Fuse']]],
 ['Yearly re-check',[
  ['yRecheck','Yearly re-check: area, electrical space, space, injection point, earthing location','n@Area (m²)+p',0,['yearly_0','Yes']],
  ['yVideo','Yearly videos of the plant','v',0,['yearly_0','Yes']]]],
 ['Work performed',[
  ['issues','Issues found and parts replaced','x+po@Photo (optional)'],
  ['action','Corrective action taken / follow-up visit needed','x@Corrective action taken (write None if nothing)+y@Follow-up visit needed?']]],
 ['Sign-off and reports',[
  ['feedback','Customer feedback and signature','x@Customer feedback+g@Customer signature'],
  ['report','Maintenance report: sent quarterly through WhatsApp, and yearly','s:Not due|Pending|Sent@Status+d@Date'],
  ['recip','Reporting schedule and recipient','s:O&M team|Management|Customer']]]]}
};
/* Soledify technician frontend (no backend needed): survey schema, dashboard, form engine. */
const PAGE={pre:'pre-visit.html',post:'post-visit.html',om:'o&amp;m.html'};
const API_BASE = 'http://localhost:5000'; // e.g. 'http://localhost:3000' once Member 2's API is ready
const G=id=>document.getElementById(id),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS={g:k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},d:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const TN={pre:'Pre-installation',post:'Post-installation',om:'Maintenance'};
const dk=(id,t)=>`soledify_draft_${id}_${t}`;
const ACC={p:'image/*',po:'image/*',k:'image/*',c:'image/*',u:'image/*,application/pdf',v:'video/*'};

/* ---------- file storage for drafts (IndexedDB keeps real photos/videos offline) ---------- */
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('soledify',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=rej});
async function fput(k,v){try{const d=await idb();d.transaction('f','readwrite').objectStore('f').put(v,k)}catch(e){}}
async function fdel(k){try{const d=await idb();d.transaction('f','readwrite').objectStore('f').delete(k)}catch(e){}}
async function fget(k){try{const d=await idb();return await new Promise(r=>{const q=d.transaction('f').objectStore('f').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})}catch(e){return null}}

function status(v){const s=LS.g('soledify_status')||{},x=s[v.id+v.type];if(x)return x;if(v.st!=='Scheduled')return v.st;return LS.g(dk(v.id,v.type))?'In progress':'Scheduled'}
function side(a){G('side').innerHTML='<b class="br">Soledify</b><small>FIELDOPS SUITE</small>'+[['all','Dashboard'],['pre','Pre-installation'],['post','Post-installation'],['om','Maintenance']].map(([k,l])=>`<a href="dashboard.html${k==='all'?'':'?type='+k}" class="${k===a?'on':''}">${l}</a>`).join('')}

/* ---------- DASHBOARD ---------- */
function dash(){
 const type=new URLSearchParams(location.search).get('type')||'all';side(type);
 const all=MOCK.map(v=>({...v,s:status(v)})),OPEN=['Scheduled','In progress','Returned'],hr=new Date().getHours();
 const sts=['Scheduled','In progress','Returned','Submitted','Approved'],COL=['#94A3B8','#F59E0B','#C0392B','#2563A8','#0F4C3A'];
 G('hero').innerHTML=`<small>${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · Demo data</small><h1>${hr<12?'Good morning':hr<17?'Good afternoon':'Good evening'}, John</h1><p>${all.filter(v=>OPEN.includes(v.s)).length} site visits are waiting for your survey.</p>`;
 G('kpis').innerHTML=[['Total visits',all.length],['In progress',all.filter(v=>v.s==='In progress').length],['Pending review',all.filter(v=>v.s==='Submitted').length],['Maintenance due',all.filter(v=>v.type==='om'&&OPEN.includes(v.s)).length]].map(([l,n])=>`<div class="kpi"><span>${l}</span><b>${n}</b></div>`).join('');
 let flt='All',q='';
 const draw=()=>{const rows=all.filter(v=>(type==='all'||v.type===type)&&(flt==='All'||v.s===flt)&&(v.id+v.name+v.addr).toLowerCase().includes(q.toLowerCase()));
  G('chips').innerHTML=['All',...sts].map(s=>`<button class="chip ${s===flt?'on':''}" data-f="${s}">${s}</button>`).join('');
  G('list').innerHTML=rows.map(v=>`<article class="vc"><div class="r1"><b>${v.id}</b><span class="tag t-${v.type}">${TN[v.type]}</span><span class="st s-${v.s.replace(' ','')}">${v.s}</span></div><h3>${esc(v.name)}</h3><p>${esc(v.addr)}</p><div class="r2"><small>${v.date} · ${v.time} · ${v.tech}</small>${OPEN.includes(v.s)?`<a class="btn" href="${PAGE[v.type]}?cust=${v.id}">${v.s==='Scheduled'?'Open survey':'Continue'}</a>`:`<small>${v.s==='Approved'?'Approved':'Sent for review'}</small>`}</div></article>`).join('')||'<p class="mu">No visits match. Check the Customer ID or clear the filter.</p>'};
 draw();G('chips').onclick=e=>{if(e.target.dataset.f){flt=e.target.dataset.f;draw()}};G('q').oninput=e=>{q=e.target.value;draw()};
 const cnt=sts.map(s=>all.filter(v=>v.s===s).length),C=2*Math.PI*40;let off=0;
 G('donut').innerHTML=`<svg viewBox="0 0 100 100" class="dn"><g transform="rotate(-90 50 50)">${cnt.map((n,i)=>{const L=n/all.length*C,s=`<circle cx="50" cy="50" r="40" fill="none" stroke="${COL[i]}" stroke-width="14" stroke-dasharray="${L} ${C-L}" stroke-dashoffset="${-off}"/>`;off+=L;return s}).join('')}</g><text x="50" y="52" text-anchor="middle" font-size="16" font-weight="700">${all.length}</text><text x="50" y="62" text-anchor="middle" font-size="6">TOTAL VISITS</text></svg><ul class="lg">${sts.map((s,i)=>`<li><i style="background:${COL[i]}"></i>${s}: ${cnt[i]}</li>`).join('')}</ul>`;
}

/* ---------- SURVEY ENGINE ---------- */
let cur,P,D={},F={},step=0,conf=0;
const mk=([k,l,spec,opt,cond])=>{const c=spec.split('+').map((tok,i)=>{const[h,lab]=tok.split('@'),[t,o]=h.split(':');return{t,o:o?o.split('|'):[],l:lab||'',k:k+'_'+i}});
 const tr=c.find(x=>['y','Y','pf'].includes(x.t)),tv=tr&&c.some(x=>x.t==='r'||x.t==='p')?{y:'No',Y:'Yes',pf:'Fail'}[tr.t]:null;return{k,l,opt:!!opt,cond,c,tr,tv}};
const slots=x=>x.t==='c'&&x.o.length?x.o.map((c,j)=>[x.k+'.'+j,c]):[[x.k,'']];
const vis=pa=>!pa.cond||D[pa.cond[0]]===pa.cond[1];
const shown=(pa,x)=>pa.tv&&(x.t==='r'||x.t==='p')?D[pa.tr.k]===pa.tv:true;
const vs=i=>i<P.length&&P[i].ps.some(vis);
const go=(i,d)=>{while(i>=0&&i<P.length&&!vs(i))i+=d;return i};
const fkey=k=>dk(cur.id,cur.type)+'|'+k;
const rad=(k,o,v)=>`<div class="opts">${o.map(z=>`<label><input type="radio" name="${k}" data-k="${k}" value="${z}" ${v===z?'checked':''}>${z}</label>`).join('')}</div>`;

async function survey(){
 const p=new URLSearchParams(location.search);
 const ty=document.body.dataset.type;cur=MOCK.find(v=>v.id===p.get('cust')&&v.type===ty);
 if(!cur){G('root').innerHTML='<h2>Visit not found</h2><p>Open a visit from the dashboard.</p><br><a class="btn" href="dashboard.html">Back to dashboard</a>';return}
 G('ttl').textContent=SV[cur.type].title;net();addEventListener('online',net);addEventListener('offline',net);
 P=SV[cur.type].steps.map(([t,ps])=>({t,ps:ps.map(mk)}));
 console.log('Survey answer keys:', P.flatMap(s => s.ps.flatMap(pa => pa.c.map(x => x.k))));
 const d=LS.g(dk(cur.id,cur.type));D=d?d.D:{};F={};
 const subs=(LS.g('soledify_submissions')||[]).filter(s=>s.customerId===cur.id&&s.type==='om').length;
 const jobs=[];
 P.forEach(s=>s.ps.forEach(pa=>pa.c.forEach(x=>{
  if(x.t==='a')D[x.k]=pa.k==='visit'?`${cur.id} · ${cur.date}`:pa.k==='cust'?cur.name:`${cur.id} · ${cur.name} · ${cur.addr}`;
  if(x.t==='cnt')D[x.k]=(cur.base||0)+subs+1;
  if(pa.k==='visit'&&x.t==='t'&&!D[x.k])D[x.k]=cur.tech;
  if(pa.k==='addr'&&!D[x.k])D[x.k]=cur.addr;
  if(ACC[x.t])slots(x).forEach(([k])=>jobs.push(fget(fkey(k)).then(a=>{if(a&&a.length)F[k]=a})))})));
 await Promise.all(jobs);step=go(0,1);render();
}
function net(){const e=G('net');e.textContent=navigator.onLine?'Online':'Offline mode';e.className='net'+(navigator.onLine?'':' off')}

function rc(x,pa){const v=D[x.k]??'',t=x.t,L=x.l&&!['pfg','c'].includes(t)?`<div class="sl">${esc(x.l)}</div>`:'';let h='';
 if(t==='a')h=`<input class="ro" readonly value="${esc(v)}">`;
 else if(t==='cnt')h=`<input class="ro" readonly value="Check ${v} of 24 this year">`;
 else if(['t','to','ph'].includes(t))h=`<input data-k="${x.k}" type="${t==='ph'?'tel':'text'}" value="${esc(v)}" ${t==='ph'?'inputmode="tel" placeholder="10-digit mobile number"':''}>`;
 else if(t==='x'||t==='r')h=`<textarea data-k="${x.k}" rows="3" placeholder="${t==='r'?'Remarks':''}">${esc(v)}</textarea>`;
 else if(t==='n'||t==='N')h=`<input data-k="${x.k}" type="number" inputmode="decimal" step="any" min="0" value="${esc(v)}">`;
 else if(t==='d')h=`<input data-k="${x.k}" type="date" value="${esc(v)}">`;
 else if(t==='s')h=`<select data-k="${x.k}"><option value="">Select…</option>${x.o.map(o=>`<option ${v===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
 else if(t==='m')h=`<div class="opts">${x.o.map(o=>`<label><input type="checkbox" data-k="${x.k}" value="${esc(o)}" ${(v||[]).includes(o)?'checked':''}>${esc(o)}</label>`).join('')}</div>`;
 else if(['y','Y','pf'].includes(t))h=rad(x.k,t==='pf'?['Pass','Fail']:['Yes','No'],v);
 else if(t==='pfg')h=x.o.map((o,j)=>`<div class="pg"><span>${esc(o)}</span>${rad(x.k+'.'+j,['Pass','Fail'],D[x.k+'.'+j])}</div>`).join('');
 else if(t==='g')h=`<canvas data-sig="${x.k}"></canvas><button type="button" class="chip" data-clr="${x.k}">Clear signature</button>`;
 else if(t==='gps')h=`<div class="row"><input data-k="${x.k}" value="${esc(v)}" placeholder="Latitude, longitude"><button type="button" class="btn s" data-gps="${x.k}">Capture location</button></div>`;
 else if(t==='ci')h=['in','out'].map(z=>`<div class="row"><input class="ro" readonly id="ci_${x.k}.${z}" value="${esc(D[x.k+'.'+z]||'')}" placeholder="${z==='in'?'Check-in':'Check-out'} time and location"><button type="button" class="btn s" data-ci="${x.k}.${z}">${z==='in'?'Check in':'Check out'}</button></div>`).join('');
 else h=slots(x).map(([k,c])=>`<div class="fs">${c?`<div class="sl">${esc(c)}</div>`:''}<label class="fb"><input type="file" hidden data-k="${k}" accept="${ACC[t]}" ${t==='c'?'capture="environment"':''} multiple>＋ ${t==='v'?'Add video':t==='u'?'Add bill (photo or PDF)':t==='k'?'Add sketch photo':'Add photo'}${t==='c'?' (camera)':''}</label><div class="th" id="th_${k}"></div><div class="fe" id="fe_${k}"></div></div>`).join('');
 return `<div class="c" id="c_${x.k}" ${shown(pa,x)?'':'hidden'}>${L}${h}</div>`}
const pcard=pa=>`<section class="pc" id="p_${pa.k}" ${vis(pa)?'':'hidden'}><div class="pl">${esc(pa.l)}${pa.opt?' <em>(optional)</em>':'<b class="rq">*</b>'}</div>${pa.c.map(x=>rc(x,pa)).join('')}<div class="er" id="e_${pa.k}"></div></section>`;

function render(){const n=P.length,rev=step===n,vsl=P.map((_,i)=>i).filter(vs),pos=rev?vsl.length:vsl.indexOf(step);
 G('root').innerHTML=`<div class="ban"><b>${cur.id}</b> · ${esc(cur.name)}<br><small>${esc(cur.addr)} · Visit ${cur.date}</small></div>
 <div class="pills">${vsl.map((i,j)=>`<button class="pill ${i===step?'on':j<pos?'dn':''}" data-s="${i}">${j+1}. ${P[i].t}</button>`).join('')}<button class="pill ${rev?'on':''}" data-s="${n}">Review</button></div>
 <div class="bar"><i style="width:${Math.round(pos/vsl.length*100)}%"></i></div>
 <h2>${rev?'Review and submit':P[step].t}</h2>
 <form id="fm" novalidate onsubmit="return false">${rev?review():P[step].ps.map(pcard).join('')}</form>
 <div class="svt" id="svt"></div>
 <div class="nav"><button class="btn s" id="bk">Previous</button><button class="btn s" id="sv">Save draft</button><button class="btn" id="nx">${rev?'Submit survey':'Next section'}</button></div>`;
 if(!rev)P[step].ps.forEach(pa=>pa.c.forEach(x=>{if(ACC[x.t])slots(x).forEach(([k])=>th(k))}));
 $$('canvas[data-sig]').forEach(sig);
 G('bk').onclick=()=>{const i=go(step-1,-1);if(i>=0){step=i;render()}};
 G('sv').onclick=()=>save();
 G('nx').onclick=next;
 $$('[data-s]').forEach(b=>b.onclick=()=>{const i=+b.dataset.s;if(i<=step||valTo(i)){step=i;render()}});
 const f=G('fm');f.oninput=f.onchange=onInput;f.onclick=onClick;scrollTo(0,0)}

function onInput(e){const t=e.target,k=t.dataset.k;if(!k)return;if(t.type==='file')return addF(t);
 D[k]=t.type==='checkbox'?$$(`[data-k="${k}"]:checked`,G('fm')).map(x=>x.value):t.value;
 const pc=t.closest('.pc');if(pc)pc.classList.remove('bad');
 P[step].ps.forEach(pa=>{G('p_'+pa.k).hidden=!vis(pa);pa.c.forEach(x=>{G('c_'+x.k).hidden=!shown(pa,x)})});save(1)}
function onClick(e){const d=e.target.dataset;
 if(d.rm){const[k,i]=d.rm.split('|');F[k].splice(+i,1);th(k);fput(fkey(k),F[k])}
 if(d.clr){D[d.clr]='';const c=document.querySelector(`[data-sig="${d.clr}"]`);c.getContext('2d').clearRect(0,0,c.width,c.height);save(1)}
 if(d.gps)geo(c=>{const el=document.querySelector(`[data-k="${d.gps}"]`);if(c){D[d.gps]=c;el.value=c;save(1)}else G('e_'+d.gps.split('_')[0]).textContent='Location unavailable. Allow location access or type the coordinates.'});
 if(d.ci)geo(c=>{D[d.ci]=new Date().toLocaleString('en-IN')+(c?` @ ${c}`:'');G('ci_'+d.ci).value=D[d.ci];save(1)})}
function geo(cb){if(!navigator.geolocation)return cb(null);navigator.geolocation.getCurrentPosition(p=>cb(`${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`),()=>cb(null),{timeout:6000})}

async function addF(inp){const k=inp.dataset.k,bad=[];
 for(const f of inp.files){const ok=inp.accept.split(',').some(a=>a.endsWith('/*')?f.type.startsWith(a.slice(0,-1)):f.type===a),mx=f.type.startsWith('video')?100:25;
  if(!ok)bad.push(`${f.name}: file type not allowed`);else if(f.size>mx*1048576)bad.push(`${f.name}: over ${mx} MB`);else(F[k]=F[k]||[]).push(f)}
 inp.value='';th(k);G('fe_'+k).textContent=bad.join('; ');const pc=G('th_'+k).closest('.pc');pc&&pc.classList.remove('bad');await fput(fkey(k),F[k]);save(1)}
function th(k){const e=G('th_'+k);if(!e)return;e.innerHTML=(F[k]||[]).map((f,i)=>{const u=URL.createObjectURL(f);return `<div class="tb">${f.type.startsWith('image')?`<img src="${u}" alt="">`:f.type.startsWith('video')?`<video src="${u}" muted playsinline></video>`:'<div class="dc">PDF</div>'}<span>${esc(f.name)}</span><small>${(f.size/1048576).toFixed(1)} MB · ${new Date(f.lastModified).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small><button type="button" data-rm="${k}|${i}" aria-label="Remove ${esc(f.name)}">×</button></div>`}).join('')}
function sig(c){const x=c.getContext('2d'),r=c.getBoundingClientRect(),k=c.dataset.sig;c.width=r.width;c.height=150;x.lineWidth=2.2;x.lineCap='round';x.strokeStyle='#0F172A';
 if(D[k]){const im=new Image();im.onload=()=>x.drawImage(im,0,0,c.width,c.height);im.src=D[k]}
 let dn=0;const p=e=>{const b=c.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top]};
 c.onpointerdown=e=>{dn=1;c.setPointerCapture(e.pointerId);x.beginPath();x.moveTo(...p(e))};
 c.onpointermove=e=>{if(dn){x.lineTo(...p(e));x.stroke()}};
 c.onpointerup=()=>{dn=0;D[k]=c.toDataURL();c.closest('.pc').classList.remove('bad');save(1)}}
function save(q){LS.s(dk(cur.id,cur.type),{D,t:Date.now()});const e=G('svt');if(e)e.textContent='Draft saved '+new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})+(navigator.onLine?'':' (offline, stored on this device)')}

/* ---------- validation ---------- */
function chk(pa){if(!vis(pa)||pa.opt)return'';
 for(const x of pa.c){if(!shown(pa,x))continue;const t=x.t,v=D[x.k],nm=x.l.replace(/ \(.*\)/,''),z=+v;let m='';
  if(t==='t'||t==='x'){if(!(v||'').trim())m=`Fill in ${nm||'this field'}`}
  else if(t==='r'){if(pa.tv&&!(v||'').trim())m='Add remarks for this answer'}
  else if(t==='ph'){if(!/^\+?[\d\s-]{10,14}$/.test(v||''))m='Enter a valid contact number'}
  else if(t==='n'||t==='N'){if(v===''||v==null||isNaN(z)||z<0||(t==='N'&&z===0))m=`Enter ${t==='N'?'a number above 0':'a number (0 or more)'}${nm?' for '+nm:''}`}
  else if(t==='d'||t==='s'){if(!v)m=`${t==='d'?'Pick a date':'Select an option'}${nm?' for '+nm:''}`}
  else if(t==='m'){if(!(v||[]).length)m='Select at least one option'}
  else if(['y','Y','pf'].includes(t)){if(!v)m='Choose an answer'}
  else if(t==='pfg'){if(x.o.some((_,j)=>!D[x.k+'.'+j]))m='Mark every item Pass or Fail'}
  else if(t==='g'){if(!v)m='Signature required'}
  else if(t==='gps'){if(!(v||'').trim())m='Capture the location'}
  else if(t==='ci'){if(!D[x.k+'.in']||!D[x.k+'.out'])m='Record both check-in and check-out'}
  else if(ACC[t]&&t!=='po'){const ms=slots(x).filter(([k])=>!(F[k]||[]).length).map(s=>s[1]);if(ms.length)m=t==='v'?'Add a video':ms[0]?'Add photos for: '+ms.join(', '):`Add at least one ${t==='u'?'file':'photo'}`}
  if(m)return m}
 return''}
function valStep(i){let ok=1,first;P[i].ps.forEach(pa=>{const m=chk(pa),e=G('p_'+pa.k);if(!e)return;e.classList.toggle('bad',!!m);G('e_'+pa.k).textContent=m;if(m){ok=0;first=first||e}});if(first)first.scrollIntoView({block:'center'});return ok}
function valTo(i){for(let s=0;s<Math.min(i,P.length);s++)if(vs(s)&&P[s].ps.some(pa=>chk(pa))){step=s;render();valStep(s);return 0}return 1}
function next(){if(step===P.length)return submit();if(!valStep(step))return;save(1);const i=go(step+1,1);step=i>=P.length?P.length:i;render()}

/* ---------- review, submit ---------- */
function sum(pa){return pa.c.filter(x=>shown(pa,x)&&x.t!=='cnt').map(x=>{const t=x.t,v=D[x.k];
 if(t==='g')return v?'Signed':'Not signed';
 if(t==='pfg')return x.o.map((o,j)=>`${o}: ${D[x.k+'.'+j]||'-'}`).join(', ');
 if(t==='ci')return `In: ${D[x.k+'.in']||'-'}; Out: ${D[x.k+'.out']||'-'}`;
 if(ACC[t])return slots(x).map(([k,c])=>`${c?c+': ':''}${(F[k]||[]).length} file(s)`).join(', ');
 if(Array.isArray(v))return v.join(', ')||'-';
 return `${x.l&&t!=='a'?x.l+': ':''}${v||'-'}`}).join(' · ')}
const review=()=>`<p class="mu">Check your answers. Use the step buttons above to correct anything.</p><div class="rv"><table>${P.flatMap(s=>s.ps.filter(vis)).map(pa=>`<tr><td>${esc(pa.l)}</td><td>${esc(sum(pa))}</td></tr>`).join('')}</table></div><p class="mu" id="cf" style="margin-top:10px"></p>`;


async function uploadSurveyFiles(visitId, filesByField) {
    const files = Object.values(filesByField || {}).flat();

    if (files.length === 0) {
        return { success: true, uploaded_count: 0 };
    }

    let uploadedCount = 0;

    // Backend accepts up to 5 files per request.
    for (let i = 0; i < files.length; i += 5) {
        const batch = files.slice(i, i + 5);
        const formData = new FormData();

        for (const file of batch) {
            formData.append('files', file, file.name);
        }

        formData.append('uploaded_by', '1');

        const response = await fetch(
            `${API_BASE}/api/visits/${visitId}/files`,
            {
                method: 'POST',
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error(result.message || 'File upload failed');
        }

        uploadedCount += batch.length;
    }

    return {
        success: true,
        uploaded_count: uploadedCount
    };
}


async function send(pl) {
    if (!API_BASE) {
        return { ok: true, success: true, demo: true };
    }

    if (!cur.visitId) {
        throw new Error('No backend visit ID is configured.');
    }

    const answers = Object.entries(pl.answers || {})
        .filter(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return false;
            }

            if (/^(photos|videos|bills|before|after|yVideo)_\d+$/.test(key)) {
                return false;
            }

            if (typeof value === 'string' && value.startsWith('data:image')) {
                return false;
            }

            return true;
        })
        .map(([key, value]) => ({
            question_key: key,
            question_label: key.replace(/_\d+$/, '').replace(/([A-Z])/g, ' $1').trim(),
            section_name: 'Site Survey',
            answer_value: typeof value === 'object'
                ? JSON.stringify(value)
                : String(value),
            answer_type: typeof value === 'number'
                ? 'number'
                : typeof value === 'boolean'
                    ? 'boolean'
                    : typeof value === 'object'
                        ? 'json'
                        : 'text'
        }));

    // Save survey answers
    const answersResponse = await fetch(
        `${API_BASE}/api/visits/${cur.visitId}/answers`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        }
    );

    const answersResult = await answersResponse.json();

    if (!answersResponse.ok || answersResult.success !== true) {
        throw new Error(
            answersResult.message || 'Could not save survey answers'
        );
    }
    // Upload photos and videos before marking the visit submitted
    await uploadSurveyFiles(cur.visitId, F);
    // Update visit status
    const statusResponse = await fetch(
        `${API_BASE}/api/visits/${cur.visitId}/status`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Submitted' })
        }
    );

    const statusResult = await statusResponse.json();

    if (!statusResponse.ok || statusResult.success !== true) {
        throw new Error(
            statusResult.message || 'Could not update visit status'
        );
    }

    return {
        ok: true,
        success: true,
        answersResult,
        statusResult
    };
}



async function submit(){
 for(let i=0;i<P.length;i++)if(vs(i)&&P[i].ps.some(pa=>chk(pa))){step=i;render();valStep(i);return}
 if(!conf){conf=1;G('nx').textContent='Tap again to confirm';G('cf').textContent='Once submitted, this survey goes to the advisor for review.';setTimeout(()=>{conf=0;const b=G('nx');if(b&&!b.disabled)b.textContent='Submit survey'},6000);return}
 G('nx').disabled=true;G('nx').textContent='Submitting…';
 const pl={customerId:cur.id,surveyType:cur.type,technician:cur.tech,status:'Submitted',submittedAt:new Date().toISOString(),answers:D,files:Object.fromEntries(Object.entries(F).filter(([,a])=>a.length).map(([k,a])=>[k,a.map(f=>f.name)]))};
try {
    const result = await send(pl);

    if (!result || result.ok !== true || result.success !== true) {
        throw new Error(result?.message || 'Submission failed');
    }
} catch (e) {
    conf = 0;
    console.error('Survey submission error:', e);
    G('nx').disabled = false;
    G('nx').textContent = 'Submit survey';
    G('cf').textContent =
        'Could not submit. Your answers are saved as a draft on this device. Try again when you have a signal.';
    return;
}
 const subs=LS.g('soledify_submissions')||[];subs.push({customerId:cur.id,type:cur.type,submittedAt:pl.submittedAt,answers:Object.fromEntries(Object.entries(D).filter(([,v])=>!(typeof v==='string'&&v.startsWith('data:'))))});LS.s('soledify_submissions',subs);
 const st=LS.g('soledify_status')||{};st[cur.id+cur.type]='Submitted';LS.s('soledify_status',st);LS.d(dk(cur.id,cur.type));Object.keys(F).forEach(k=>fdel(fkey(k)));
 const out=JSON.stringify(pl,(k,v)=>typeof v==='string'&&v.startsWith('data:image')?'[signature image]':v,2);
 G('root').innerHTML=`<div class="ban"><h2>Survey submitted</h2><p class="mu">${cur.id} · ${SV[cur.type].title}. Status is now Submitted.${API_BASE?'':' Demo mode: nothing was sent to a server.'}</p></div><details><summary>Payload sent to the API</summary><pre>${esc(out)}</pre></details><div class="nav"><a class="btn" href="dashboard.html">Back to dashboard</a></div>`}
