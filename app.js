const foods=[
["Egg, whole","മുട്ട","1 large egg",6.3],["Egg white","മുട്ടയുടെ വെള്ള","1 large egg white",3.6],
["Cow's milk","പാൽ","100 ml",3.3],["Curd / yogurt","തൈര്","100 g",3.5],["Paneer","പനീർ","100 g",18],
["Fish, cooked","മീൻ (വേവിച്ചത്)","100 g",22],["Chicken, cooked","കോഴി (വേവിച്ചത്)","100 g",27],
["Dal, cooked","പരിപ്പ് (വേവിച്ചത്)","100 g",7.5],["Chickpeas, cooked","കടല (വേവിച്ചത്)","100 g",8.9],
["Green gram, cooked","ചെറുപയർ (വേവിച്ചത്)","100 g",7],["Roasted gram","പൊട്ടുകടല","30 g",6],
["Peanuts","നിലക്കടല","30 g",7.5],["Soy chunks, dry","സോയ ചങ്ക്സ് (ഉണങ്ങിയത്)","30 g",15.6],
["Tofu","ടോഫു","100 g",8],["Oats, dry","ഓട്സ് (ഉണങ്ങിയത്)","40 g",5.2],
["Cooked rice","ചോറ്","100 g",2.7],["Puttu","പുട്ട്","1 medium piece",4],
["Idli","ഇഡ്ഡലി","1 medium",2],["Dosa","ദോശ","1 medium",3],
["Sambar","സാമ്പാർ","100 ml",2.5],["Almonds","ബദാം","30 g",6.3]
];
const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
let data=JSON.parse(localStorage.getItem("proteinManager")||"null")||{
 profiles:[{id:"father",name:"Father",age:66,weight:50.75,type:"recovery",kidney:"unknown",target:65}],
 active:"father",logs:{},language:"en"
};
let editingId=null;
function save(){localStorage.setItem("proteinManager",JSON.stringify(data))}
function profile(){return data.profiles.find(p=>p.id===data.active)||data.profiles[0]}
function suggested(p){if(p.target)return Number(p.target);let rate=p.type==="recovery"?1.2:p.age>=65?1.0:0.8;return Math.round(p.weight*rate)}
function key(){return `${data.active}_${today()}`}
function entries(){return data.logs[key()]||[]}
function total(){return entries().reduce((s,e)=>s+e.protein,0)}
function render(){
 const p=profile();$("profileSelect").innerHTML=data.profiles.map(x=>`<option value="${x.id}" ${x.id===p.id?"selected":""}>${esc(x.name)}</option>`).join("");
 $("profileDetails").innerHTML=`<div class="muted">Age</div><strong>${p.age||"—"} years</strong><div class="muted" style="margin-top:8px">Weight</div><strong>${p.weight||"—"} kg</strong><div class="muted" style="margin-top:8px">Profile</div><strong>${typeName(p.type)}</strong><div class="muted" style="margin-top:8px">Kidney status</div><strong>${kidneyName(p.kidney)}</strong>`;
 let t=suggested(p),c=total(),rem=Math.max(0,t-c);
 $("targetValue").textContent=t;$("targetNote").textContent=p.target?"Custom target saved":"Illustrative estimate — confirm with clinician";
 $("consumed").textContent=c.toFixed(1);$("remaining").textContent=rem.toFixed(1);$("progressFill").style.width=Math.min(100,c/t*100)+"%";
 $("todayDate").textContent=new Date().toLocaleDateString();$("mealSummary").innerHTML=["Breakfast","Mid-morning","Lunch","Evening","Dinner","Other"].map(m=>{let v=entries().filter(e=>e.meal===m).reduce((s,e)=>s+e.protein,0);return v?`<span class="meal-chip">${m}: <b>${v.toFixed(1)}g</b></span>`:""}).join("")||'<span class="muted">No food logged yet.</span>';
 $("intakeRows").innerHTML=entries().length?entries().map((e,i)=>`<div class="intake-row"><span><b>${esc(e.name)}</b><small class="muted"> · ${e.qty} × ${esc(e.unit)} · ${e.meal}</small></span><strong>${e.protein.toFixed(1)} g</strong><button onclick="removeEntry(${i})">Remove</button></div>`).join(""):'<p class="muted">No entries today. Add food above to start your chart.</p>';
 renderWeek();renderFoodList();
}
function typeName(t){return ({recovery:"Post-surgery recovery",general:"General adult",older:"Older adult",custom:"Custom / other"})[t]||t}
function kidneyName(k){return ({unknown:"Not known",normal:"No known problem",issue:"Needs clinician review"})[k]||k}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function populateFood(){ $("foodSelect").innerHTML=foods.map((f,i)=>`<option value="${i}">${f[0]} — ${f[3]}g / ${f[2]}</option>`).join("");updateEstimate()}
function updateEstimate(){let f=foods[+$("foodSelect").value]||foods[0];$("unit").value=f[2];$("estimate").textContent=(f[3]*Number($("quantity").value||0)).toFixed(1)}
function renderFoodList(){let q=$("foodSearch").value.toLowerCase();$("foodList").innerHTML=foods.filter(f=>(f[0]+" "+f[1]).toLowerCase().includes(q)).map(f=>`<div class="food-item"><span>${esc(f[0])}<small>${esc(f[1])} · ${f[2]}</small></span><strong>${f[3]} g</strong></div>`).join("")}
function renderWeek(){let out="";let max=1;let vals=[];for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);let k=`${data.active}_${d.toISOString().slice(0,10)}`;let v=(data.logs[k]||[]).reduce((s,e)=>s+e.protein,0);vals.push({label:d.toLocaleDateString(undefined,{weekday:"short"}),v}) ;max=Math.max(max,v)}$("weeklyChart").innerHTML=vals.map(x=>`<div class="bar-col"><div class="bar" style="height:${Math.max(3,x.v/max*105)}px" title="${x.v.toFixed(1)} g"></div>${x.v?x.v.toFixed(0)+"g":""}<br>${x.label}</div>`).join("")}
function removeEntry(i){let a=entries();a.splice(i,1);data.logs[key()]=a;save();render()}
$("profileSelect").addEventListener("change",e=>{data.active=e.target.value;save();render()});
$("foodSelect").addEventListener("change",updateEstimate);$("quantity").addEventListener("input",updateEstimate);
$("foodSearch").addEventListener("input",renderFoodList);
$("intakeForm").addEventListener("submit",e=>{e.preventDefault();let f=foods[+$("foodSelect").value],q=Number($("quantity").value);let k=key();data.logs[k]=entries();data.logs[k].push({name:f[0],qty:q,unit:f[2],protein:f[3]*q,meal:$("meal").value});save();$("quantity").value=1;updateEstimate();render()});
$("addProfileBtn").onclick=()=>openProfile();
$("editProfileBtn").onclick=()=>openProfile(profile());
function openProfile(p=null){editingId=p?.id||null;$("profileDialogTitle").textContent=p?"Edit profile":"Add person";$("pName").value=p?.name||"";$("pAge").value=p?.age||30;$("pWeight").value=p?.weight||65;$("pType").value=p?.type||"general";$("pKidney").value=p?.kidney||"unknown";$("pTarget").value=p?.target||"";$("profileDialog").showModal()}
$("cancelProfile").onclick=()=>$("profileDialog").close();
$("profileForm").onsubmit=e=>{e.preventDefault();let obj={id:editingId||("p"+Date.now()),name:$("pName").value.trim(),age:Number($("pAge").value),weight:Number($("pWeight").value),type:$("pType").value,kidney:$("pKidney").value,target:$("pTarget").value?Number($("pTarget").value):null};if(editingId){let i=data.profiles.findIndex(p=>p.id===editingId);data.profiles[i]=obj}else{data.profiles.push(obj);data.active=obj.id}save();$("profileDialog").close();render()};
$("targetBtn").onclick=()=>{$("newTarget").value=suggested(profile());$("targetDialog").showModal()};
$("cancelTarget").onclick=()=>$("targetDialog").close();
$("targetForm").onsubmit=e=>{e.preventDefault();profile().target=Number($("newTarget").value);save();$("targetDialog").close();render()};
$("clearDayBtn").onclick=()=>{if(confirm("Clear today's food entries for this profile?")){data.logs[key()]=[];save();render()}};
$("langBtn").onclick=()=>{data.language=data.language==="en"?"ml":"en";document.querySelectorAll("[data-en]").forEach(el=>el.textContent=el.dataset[data.language]);$("langBtn").textContent=data.language==="en"?"മലയാളം":"English";save()};
function init(){populateFood();$("todayDate").textContent=new Date().toLocaleDateString();render();if(data.language==="ml")$("langBtn").click()}
init();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
