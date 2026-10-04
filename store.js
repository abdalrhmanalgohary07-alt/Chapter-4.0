// الحالة + الحفظ + الترحيل من النسخ القديمة
const KEY="chapters_app_v4",OLD=["flexible_chapter_todo_v3","flexible_chapter_month_oct_2026_v1"];
export const PALETTE=["#a78bfa","#fb7185","#22d3ee","#fbbf24","#4ade80","#60a5fa","#f472b6","#f97316"];
export const ICONS=["📚","🧪","🧠","📝","🧬","📖"];
export const uid=()=>Math.random().toString(36).slice(2,9);
const SEED=[["الكيمياء الحيوية","Biochemistry","⚗️"],["علم الدم","Hematology","🩸"],["الأجهزة والأدوات المعملية","Medical Devices / TEC","🔬"],["اللغة الإنجليزية","English","📘"],["الطفيليات","Parasitology","🦠"],["الميكروبيولوجي","Microbiology","🧫"]];
const seed=()=>({subjects:SEED.map(([ar,en,icon],i)=>({id:uid(),ar,en,icon,color:PALETTE[i],chapters:[]})),days:{}});
const color=c=>/^#[0-9a-f]{3,8}$/i.test(c)?c:"#60a5fa";
function normalize(s){
  const days={};
  for(const[k,v]of Object.entries(s.days||{}))if(v&&typeof v==="object")days[k]={note:String(v.note||""),done:!!v.done};
  return{subjects:(s.subjects||[]).filter(x=>x&&typeof x.ar==="string").map(x=>({id:x.id||uid(),ar:x.ar,en:String(x.en||""),icon:String(x.icon||"📚"),color:color(x.color),chapters:(x.chapters||[]).map(c=>({id:c.id||uid(),name:String(c.name||"Chapter"),done:!!c.done}))})),days};
}
const fromOld=md=>Object.fromEntries(Object.entries(md||{}).map(([d,v])=>[`2026-10-${String(d).padStart(2,"0")}`,v]));
function load(){
  try{const r=localStorage.getItem(KEY);if(r){const s=JSON.parse(r);if(s&&Array.isArray(s.subjects))return normalize(s)}}catch{}
  try{const sub=JSON.parse(localStorage.getItem(OLD[0]));if(Array.isArray(sub))return normalize({subjects:sub,days:fromOld(JSON.parse(localStorage.getItem(OLD[1])||"{}"))})}catch{}
  return seed();
}
let state=load();const subs=new Set();
export const get=()=>state;
export const subscribe=f=>subs.add(f);
export function update(fn){fn(state);try{localStorage.setItem(KEY,JSON.stringify(state))}catch{alert("المتصفح منع الحفظ التلقائي. نزّل نسخة احتياطية.")}subs.forEach(f=>f())}
export const reset=()=>update(s=>Object.assign(s,seed()));
export const exportJSON=()=>JSON.stringify({version:3,updatedAt:new Date().toISOString(),...state},null,2);
export function importJSON(text){
  const d=JSON.parse(text),items=Array.isArray(d)?d:d.subjects;
  if(!Array.isArray(items)||!items.every(s=>s&&typeof s.ar==="string"&&Array.isArray(s.chapters)))throw new Error("invalid");
  const n=normalize({subjects:items,days:d.days||fromOld(d.monthDays)});update(s=>Object.assign(s,n));
}
