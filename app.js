const $=id=>document.getElementById(id);
const MOODS={feliz:{emoji:"😊",label:"Feliz"},tranquilo:{emoji:"😌",label:"Tranquilo/a"},emocionado:{emoji:"🤩",label:"Emocionado/a"},cansado:{emoji:"😴",label:"Cansado/a"},triste:{emoji:"😔",label:"Triste"},enojado:{emoji:"😤",label:"Enojado/a"},confundido:{emoji:"😵‍💫",label:"Confundido/a"},neutral:{emoji:"🙂",label:"Neutral"}};

const DEMO=[{id:"demo-1",date:"2026-08-13",mood:"tranquilo",title:"Empezar este diario",content:"Hoy decidí tener un lugar para escribir cosas que quiero recordar. No tiene que ser perfecto ni muy largo. Puede ser una idea, algo que me pasó o simplemente cómo estuvo el día.",tags:["inicio","ideas"],createdAt:"2026-08-13T12:00:00.000Z",updatedAt:"2026-08-13T12:00:00.000Z"}];

let entries=load(),selectedId=null;

function cloneDemo(){return DEMO.map(e=>({...e,tags:[...e.tags]}))}
function load(){try{const r=localStorage.getItem("my-personal-diary");if(r){const p=JSON.parse(r);if(Array.isArray(p))return p}}catch{}return cloneDemo()}
function save(){localStorage.setItem("my-personal-diary",JSON.stringify(entries))}
function esc(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function words(t){const c=String(t||"").trim();return c?c.split(/\s+/).length:0}
function excerpt(t,max=115){const c=String(t||"").replace(/\s+/g," ").trim();return c.length>max?c.slice(0,max).trim()+"…":c}
function dateLabel(v){const[y,m,d]=v.split("-").map(Number);return new Intl.DateTimeFormat("es-CL",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(y,m-1,d))}
function shortDate(v){const[y,m,d]=v.split("-").map(Number);return new Intl.DateTimeFormat("es-CL",{day:"numeric",month:"short",year:"numeric"}).format(new Date(y,m-1,d))}
function visible(){
 const q=$("searchInput").value.trim().toLowerCase(),mood=$("moodFilter").value,sort=$("sortFilter").value;
 const list=entries.filter(e=>{const hay=`${e.title} ${e.content} ${(e.tags||[]).join(" ")}`.toLowerCase();return(!q||hay.includes(q))&&(mood==="all"||e.mood===mood)});
 list.sort((a,b)=>sort==="oldest"?a.date.localeCompare(b.date):sort==="updated"?String(b.updatedAt).localeCompare(String(a.updatedAt)):b.date.localeCompare(a.date));
 return list;
}
function render(){
 $("entryCount").textContent=entries.length;
 const now=new Date();$("monthCount").textContent=entries.filter(e=>{const[y,m]=e.date.split("-").map(Number);return y===now.getFullYear()&&m===now.getMonth()+1}).length;
 const list=visible();
 if(!selectedId||!entries.some(e=>e.id===selectedId))selectedId=list[0]?.id||entries[0]?.id||null;
 $("timelineList").innerHTML=list.length?list.map(e=>`<button class="timeline-item ${e.id===selectedId?"active":""}" data-entry="${e.id}"><div class="top"><b>${esc(e.title||"Sin título")}</b><span>${(MOODS[e.mood]||MOODS.neutral).emoji}</span></div><p>${esc(excerpt(e.content))}</p><small>${esc(shortDate(e.date))}</small></button>`).join(""):'<p style="color:var(--muted);font-size:.75rem">No hay entradas con estos filtros.</p>';
 renderReader();
}
function renderReader(){
 const e=entries.find(x=>x.id===selectedId);
 $("emptyReader").classList.toggle("hidden",!!e);$("entryReader").classList.toggle("hidden",!e);if(!e)return;
 $("readerMood").textContent=(MOODS[e.mood]||MOODS.neutral).emoji;$("readerDate").textContent=dateLabel(e.date);$("readerTitle").textContent=e.title||"Sin título";
 $("readerTags").innerHTML=(e.tags||[]).map(t=>`<span class="tag">#${esc(t)}</span>`).join("");$("readerContent").textContent=e.content;$("readerWords").textContent=`${words(e.content)} palabras`;
 $("readerUpdated").textContent=e.updatedAt!==e.createdAt?`Editado: ${new Intl.DateTimeFormat("es-CL",{dateStyle:"medium",timeStyle:"short"}).format(new Date(e.updatedAt))}`:"Entrada original";
}
function meta(){const t=$("contentInput").value;$("charCount").textContent=t.length.toLocaleString("es-CL");$("wordCount").textContent=words(t).toLocaleString("es-CL")}
function openDialog(e=null){
 $("entryForm").reset();$("formFeedback").textContent="";
 if(e){$("dialogTitle").textContent="Editar entrada";$("entryId").value=e.id;$("dateInput").value=e.date;$("moodInput").value=e.mood;$("titleInput").value=e.title;$("contentInput").value=e.content;$("tagsInput").value=(e.tags||[]).join(", ")}
 else{const n=new Date();$("dialogTitle").textContent="Nueva entrada";$("entryId").value="";$("dateInput").value=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;$("moodInput").value="neutral"}
 meta();$("entryDialog").showModal();
}
$("timelineList").onclick=e=>{const b=e.target.closest("[data-entry]");if(!b)return;selectedId=b.dataset.entry;render()};
$("newEntryBtn").onclick=()=>openDialog();$("emptyNewBtn").onclick=()=>openDialog();$("closeDialogBtn").onclick=()=>$("entryDialog").close();
$("editEntryBtn").onclick=()=>{const e=entries.find(x=>x.id===selectedId);if(e)openDialog(e)};
$("deleteEntryBtn").onclick=()=>{const e=entries.find(x=>x.id===selectedId);if(!e)return;if(!confirm(`¿Eliminar la entrada “${e.title||"Sin título"}”?`))return;entries=entries.filter(x=>x.id!==selectedId);selectedId=null;save();render()};
$("contentInput").oninput=meta;
$("entryForm").onsubmit=e=>{
 e.preventDefault();const id=$("entryId").value,content=$("contentInput").value.trim();if(!content){$("formFeedback").textContent="Escribe algo antes de guardar.";return}
 const now=new Date().toISOString(),tags=[...new Set($("tagsInput").value.split(",").map(t=>t.trim().replace(/^#/,"")).filter(Boolean))].slice(0,12);
 if(id){const i=entries.findIndex(x=>x.id===id);if(i>=0)entries[i]={...entries[i],date:$("dateInput").value,mood:$("moodInput").value,title:$("titleInput").value.trim(),content,tags,updatedAt:now};selectedId=id}
 else{const n={id:crypto.randomUUID(),date:$("dateInput").value,mood:$("moodInput").value,title:$("titleInput").value.trim(),content,tags,createdAt:now,updatedAt:now};entries.push(n);selectedId=n.id}
 save();$("entryDialog").close();render();
};
$("searchInput").oninput=render;$("moodFilter").onchange=render;$("sortFilter").onchange=render;
$("clearFiltersBtn").onclick=()=>{$("searchInput").value="";$("moodFilter").value="all";$("sortFilter").value="newest";render()};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({app:"Mi Diario",exportedAt:new Date().toISOString(),entries},null,2)],{type:"application/json"}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=`mi-diario-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);$("backupFeedback").textContent="Diario exportado correctamente."};
$("importInput").onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text()),arr=Array.isArray(d)?d:d.entries;if(!Array.isArray(arr))throw new Error("El archivo no contiene entradas válidas.");arr.forEach((x,i)=>{if(!x.id||!x.date||typeof x.content!=="string")throw new Error(`La entrada ${i+1} está incompleta.`)});entries=arr;selectedId=null;save();render();$("backupFeedback").textContent=`Se importaron ${entries.length} entradas.`}catch(err){$("backupFeedback").textContent=`No se pudo importar: ${err.message}`}e.target.value=""};
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");const d=document.body.classList.contains("dark");$("themeBtn").textContent=d?"🌙":"☀️";localStorage.setItem("my-diary-theme",d?"dark":"light")};
if(localStorage.getItem("my-diary-theme")==="dark"){document.body.classList.add("dark");$("themeBtn").textContent="🌙"}
render();