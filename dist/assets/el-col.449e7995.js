import{b as h,d as o,aZ as n,a as m,a7 as _,P as c,u as g,ah as f,a_ as $,o as N,a0 as C,q as x,r as j,n as v,e as r,i as O,aP as w,_ as E,w as k}from"./index.f3a675bf.js";const P=Symbol("rowContextKey"),S=h({tag:{type:String,default:"div"},span:{type:Number,default:24},offset:{type:Number,default:0},pull:{type:Number,default:0},push:{type:Number,default:0},xs:{type:o([Number,Object]),default:()=>n({})},sm:{type:o([Number,Object]),default:()=>n({})},md:{type:o([Number,Object]),default:()=>n({})},lg:{type:o([Number,Object]),default:()=>n({})},xl:{type:o([Number,Object]),default:()=>n({})}}),B=m({name:"ElCol"}),K=m({...B,props:S,setup(b){const t=b,{gutter:u}=_(P,{gutter:c(()=>0)}),a=g("col"),d=c(()=>{const e={};return u.value&&(e.paddingLeft=e.paddingRight=`${u.value/2}px`),e}),i=c(()=>{const e=[];return["span","offset","pull","push"].forEach(s=>{const l=t[s];f(l)&&(s==="span"?e.push(a.b(`${t[s]}`)):l>0&&e.push(a.b(`${s}-${t[s]}`)))}),["xs","sm","md","lg","xl"].forEach(s=>{f(t[s])?e.push(a.b(`${s}-${t[s]}`)):$(t[s])&&Object.entries(t[s]).forEach(([l,p])=>{e.push(l!=="span"?a.b(`${s}-${l}-${p}`):a.b(`${s}-${p}`))})}),u.value&&e.push(a.is("guttered")),e});return(e,y)=>(N(),C(w(e.tag),{class:v([r(a).b(),r(i)]),style:O(r(d))},{default:x(()=>[j(e.$slots,"default")]),_:3},8,["class","style"]))}});var q=E(K,[["__file","/home/runner/work/element-plus/element-plus/packages/components/col/src/col.vue"]]);const L=k(q);export{L as E,P as r};
