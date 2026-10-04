// أدوات واجهة صغيرة: بناء عناصر آمن، حلقة تقدم، نافذة سفلية، إشعار
export const h=(t,p,...k)=>{const e=document.createElement(t);for(const[a,v]of Object.entries(p||{})){if(v==null||v===false)continue;if(a.startsWith("on"))e.addEventListener(a.slice(2),v);else if(a==="class")e.className=v;else if(a==="style")e.style.cssText=v;else if(a in e&&a!=="list")e[a]=v;else e.setAttribute(a,v)}e.append(...k.flat().filter(x=>x!=null&&x!==false));return e};
export function ring(p,s=56,c="var(--accent)",w=6){
  const r=(s-w)/2,L=2*Math.PI*r,m=s/2,d=h("div",{class:"ring",style:`width:${s}px;height:${s}px;font-size:${Math.round(s/4.2)}px`});
  d.innerHTML=`<svg width="${s}" height="${s}"><circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${w}"/><circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L*(1-p/100)}" transform="rotate(-90 ${m} ${m})"/></svg><span>${p}%</span>`;return d;
}
const root=()=>document.getElementById("sheet");
export function closeSheet(){root().classList.remove("open");root().replaceChildren()}
export function sheet(...k){root().replaceChildren(h("div",{class:"scrim",onclick:closeSheet}),h("div",{class:"panel",role:"dialog"},h("div",{class:"grab"}),...k));root().classList.add("open")}
export function toast(m){const t=h("div",{class:"toast"},m);document.body.append(t);setTimeout(()=>t.remove(),2400)}
