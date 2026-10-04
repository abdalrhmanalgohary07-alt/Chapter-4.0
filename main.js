import*as S from"./store.js";import{home,subject,calendar}from"./views.js";import{closeSheet}from"./ui.js";
const app=document.getElementById("app");let last="";
function render(){
  const[,r,a]=(location.hash.slice(1)||"/").split("/"),same=last===location.hash,y=scrollY;
  app.replaceChildren(r==="s"?subject(a):r==="cal"?calendar(a):home());
  scrollTo(0,same?y:0);last=location.hash;
  document.querySelectorAll(".tabs a").forEach(t=>t.classList.toggle("on",(t.dataset.t==="cal")===(r==="cal")));
}
S.subscribe(render);
addEventListener("hashchange",()=>{closeSheet();render()});
render();
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
