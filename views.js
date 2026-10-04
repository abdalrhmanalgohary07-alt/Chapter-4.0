import{h,ring,sheet,closeSheet,toast}from"./ui.js";
import*as S from"./store.js";
const pct=(d,a)=>a?Math.round(d/a*100):0;
const cnt=s=>({d:s.chapters.filter(c=>c.done).length,a:s.chapters.length});
const p2=n=>String(n).padStart(2,"0"),key=(y,m,d)=>`${y}-${p2(m+1)}-${p2(d)}`;
const todayKey=()=>{const n=new Date();return key(n.getFullYear(),n.getMonth(),n.getDate())};
const find=(st,id)=>st.subjects.find(x=>x.id===id);

export function home(){
  const st=S.get(),t=st.subjects.reduce((a,s)=>{const c=cnt(s);return{d:a.d+c.d,a:a.a+c.a}},{d:0,a:0});
  const day=st.days[todayKey()]||{},days=Object.values(st.days).filter(x=>x.done).length;
  const fi=h("input",{type:"file",accept:".json,application/json",hidden:true,onchange:e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{S.importJSON(r.result);toast("تم استرجاع بياناتك")}catch{toast("ملف النسخة الاحتياطية غير صالح")}};r.readAsText(f);e.target.value=""}});
  return h("div",{class:"view"},
    h("header",{class:"hero"},ring(pct(t.d,t.a),104,"var(--accent)",10),
      h("div",{class:"grow"},h("small",{class:"muted"},"بسم الله الرحمن الرحيم"),h("h1",{},"قائمة الشابترز"),
        h("div",{class:"chips"},h("span",{class:"chip"},`${t.d} من ${t.a} شابتر`),h("span",{class:"chip"},`${days} يوم منجز`)))),
    h("a",{class:"card today",href:"#/cal"},h("b",{},"خطة النهاردة"),h("p",{class:"muted"},day.note||"مفيش خطة مكتوبة — اضغط لإضافة")),
    h("div",{class:"sec"},h("h2",{},"المواد"),h("button",{class:"btn primary",onclick:addSubject},"＋ مادة")),
    h("section",{class:"grid"},...st.subjects.map(s=>{const{d,a}=cnt(s);
      return h("a",{class:"card subj",href:`#/s/${s.id}`,style:`--c:${s.color}`},h("div",{class:"ico"},s.icon),
        h("div",{class:"grow"},h("b",{},s.ar),h("div",{class:"en"},s.en),h("small",{class:"muted"},`${d} / ${a} شابتر`)),ring(pct(d,a),52,s.color,5))})),
    h("div",{class:"sec"},h("h2",{},"البيانات")),
    h("div",{class:"tools"},
      h("button",{class:"btn",onclick:()=>{const u=URL.createObjectURL(new Blob([S.exportJSON()],{type:"application/json"})),a=h("a",{href:u,download:"study-chapters-backup.json"});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}},"⬇️ نسخة احتياطية"),
      h("button",{class:"btn",onclick:()=>fi.click()},"⬆️ استرجاع"),
      h("button",{class:"btn",onclick:()=>S.update(s=>s.subjects.forEach(x=>x.chapters.forEach(c=>c.done=false)))},"إلغاء العلامات"),
      h("button",{class:"btn danger",onclick:()=>confirm("هترجع القائمة الأساسية وتمسح كل الشابترز والجدول؟")&&S.reset()},"إعادة ضبط"),fi));
}
function addSubject(){
  const ar=h("input",{placeholder:"اسم المادة",required:true}),en=h("input",{placeholder:"Subject name (اختياري)",dir:"ltr"});
  sheet(h("h3",{},"مادة جديدة"),h("form",{class:"stack",onsubmit:e=>{e.preventDefault();const n=ar.value.trim();if(!n)return;
    S.update(s=>s.subjects.push({id:S.uid(),ar:n,en:en.value.trim(),icon:S.ICONS[s.subjects.length%S.ICONS.length],color:S.PALETTE[s.subjects.length%S.PALETTE.length],chapters:[]}));closeSheet()}},ar,en,h("button",{class:"btn primary"},"إضافة")));
  ar.focus();
}
export function subject(id){
  const s=find(S.get(),id);
  if(!s)return h("div",{class:"view"},h("p",{class:"muted"},"المادة مش موجودة."),h("a",{class:"btn",href:"#/"},"الرئيسية"));
  const{d,a}=cnt(s),inp=h("input",{id:"addIn",placeholder:"اسم الشابتر الجديد","aria-label":"اسم الشابتر"});
  const edit=fn=>S.update(st=>fn(find(st,id)));
  return h("div",{class:"view",style:`--c:${s.color}`},h("a",{class:"back",href:"#/"},"→ كل المواد"),
    h("header",{class:"shead"},h("div",{class:"ico"},s.icon),h("div",{class:"grow"},h("h1",{},s.ar),h("div",{class:"en"},s.en),h("small",{class:"muted"},`${d} من ${a} شابتر خلصت`)),ring(pct(d,a),68,s.color,7)),
    h("form",{class:"addrow",onsubmit:e=>{e.preventDefault();const v=inp.value.trim();if(!v)return;edit(x=>x.chapters.push({id:S.uid(),name:v,done:false}));requestAnimationFrame(()=>document.getElementById("addIn")?.focus())}},inp,h("button",{class:"btn primary"},"＋ إضافة")),
    s.chapters.length?h("ul",{class:"list"},...s.chapters.map(c=>h("li",{class:"row"+(c.done?" done":"")},
      h("label",{},h("input",{type:"checkbox",checked:c.done,onchange:e=>edit(x=>{x.chapters.find(y=>y.id===c.id).done=e.target.checked})}),h("span",{},c.name)),
      h("button",{class:"icon",title:"حذف الشابتر",onclick:()=>confirm("تحذف الشابتر ده؟")&&edit(x=>{x.chapters=x.chapters.filter(y=>y.id!==c.id)})},"✕")))):h("p",{class:"empty"},"لسه مفيش شابترز — اكتب أول واحد فوق."),
    h("button",{class:"btn danger",onclick:()=>{if(confirm("تحذف المادة وكل الشابترز اللي جواها؟")){S.update(st=>{st.subjects=st.subjects.filter(x=>x.id!==id)});location.hash="#/"}}},"🗑 حذف المادة"));
}
export function calendar(ym){
  const n=new Date();let[y,m]=(ym||`${n.getFullYear()}-${n.getMonth()+1}`).split("-").map(Number);m-=1;
  const st=S.get(),first=new Date(y,m,1),off=(first.getDay()+1)%7,len=new Date(y,m+1,0).getDate(),tk=todayKey();
  const go=dm=>{const d=new Date(y,m+dm,1);location.hash=`#/cal/${d.getFullYear()}-${d.getMonth()+1}`};
  const fmt=(o,d=first)=>d.toLocaleDateString("ar-EG-u-nu-latn",o);
  const done=Object.entries(st.days).filter(([k,v])=>k.startsWith(`${y}-${p2(m+1)}-`)&&v.done).length;
  const cells=[...Array(off).fill(null).map(()=>h("i",{class:"cell off"}))];
  for(let d=1;d<=len;d++){const k=key(y,m,d),v=st.days[k]||{};
    cells.push(h("button",{class:"cell"+(v.done?" done":"")+(k===tk?" today":""),onclick:()=>openDay(k,fmt({weekday:"long",day:"numeric",month:"long"},new Date(y,m,d)))},h("b",{},d),v.done?h("em",{},"✓"):v.note?h("u",{}):null))}
  return h("div",{class:"view"},h("header",{class:"mhead"},h("button",{class:"icon",onclick:()=>go(-1),"aria-label":"الشهر السابق"},"‹"),h("div",{class:"grow"},h("h1",{},fmt({month:"long",year:"numeric"})),h("small",{class:"muted"},`${done} من ${len} يوم منجز`)),h("button",{class:"icon",onclick:()=>go(1),"aria-label":"الشهر التالي"},"›")),
    h("div",{class:"cal"},...["Sat","Sun","Mon","Tue","Wed","Thu","Fri"].map(x=>h("span",{class:"dn"},x)),...cells),
    h("p",{class:"muted hint"},"اضغط على أي يوم لكتابة خطته أو تعليمه كمنجز."));
}
function openDay(k,label){
  const cur=()=>S.get().days[k]||{note:"",done:false};
  const set=p=>S.update(s=>{const v={...cur(),...p};if(!v.note&&!v.done)delete s.days[k];else s.days[k]=v});
  const ta=h("textarea",{rows:5,placeholder:"اكتب خطة / مهمة اليوم...",value:cur().note,oninput:()=>set({note:ta.value})});
  sheet(h("h3",{},label),ta,h("label",{class:"check"},h("input",{type:"checkbox",checked:cur().done,onchange:e=>set({done:e.target.checked})}),h("span",{},"خلصت يومي")),h("button",{class:"btn primary",onclick:closeSheet},"تم"));
}
