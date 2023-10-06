import{bL as jl,b as Ql,br as Gl,a as se,am as zl,u as ae,U as p,o as h,c as P,h as M,r as le,n as g,e as b,a5 as z,v as w,s as x,aV as Tl,aL as j,E as bl,g as K,i as X,bF as hl,_ as Ie,w as Kl,ac as qe,aI as We,Q as N,V as R,T as gl,j as Fe,W as yl,m as Ul,X as A,a8 as Te,aq as Cl,t as _,S as B,k as Sl,al as Al,a3 as Ol,bo as Xl,bM as Il,aG as Yl,bg as Zl,aH as Jl,aW as ie,bN as we,Z as xl,av as _l,ao as en,bO as vl,R as Ll,b3 as El,aE as ee,aw as Bl,bP as ln,be as nn,b5 as ql,bq as tn,$ as on,a0 as an,bc as sn,bl as kl,aT as rn,a1 as un,bd as dn,ap as Wl,bQ as cn,p as J,a4 as pn,a6 as Be,a7 as ml,bi as F,bh as fn,bR as vn,aN as Ml,ax as Fl}from"./index.5c273e28.js";import{t as mn,a as bn,d as $l,C as hn}from"./el-tag.42b34b8b.js";import{o as Vl}from"./isEqual.87dc7c2b.js";import{i as gn}from"./validator.2d0809e8.js";var Dl=1/0,yn=17976931348623157e292;function Cn(e){if(!e)return e===0?e:0;if(e=mn(e),e===Dl||e===-Dl){var l=e<0?-1:1;return l*yn}return e===e?e:0}function Sn(e){var l=Cn(e),a=l%1;return l===l?a?l-a:l:0}function On(e,l,a,v){for(var d=e.length,u=a+(v?1:-1);v?u--:++u<d;)if(l(e[u],u,e))return u;return-1}var wn=Math.max,Tn=Math.min;function In(e,l,a){var v=e==null?0:e.length;if(!v)return-1;var d=v-1;return a!==void 0&&(d=Sn(a),d=a<0?wn(v+d,0):Tn(d,v-1)),On(e,bn(l),d,!0)}const Ln=(e="")=>e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d"),En=e=>jl[e||"default"],Nl=Ql({type:{type:String,values:["success","info","warning","danger",""],default:""},closable:Boolean,disableTransitions:Boolean,hit:Boolean,color:{type:String,default:""},size:{type:String,values:Gl,default:""},effect:{type:String,values:["dark","light","plain"],default:"light"},round:Boolean}),kn={close:e=>e instanceof MouseEvent,click:e=>e instanceof MouseEvent},Mn=se({name:"ElTag"}),$n=se({...Mn,props:Nl,emits:kn,setup(e,{emit:l}){const a=e,v=zl(),d=ae("tag"),u=p(()=>{const{type:s,hit:S,effect:C,closable:m,round:$}=a;return[d.b(),d.is("closable",m),d.m(s),d.m(v.value),d.m(C),d.is("hit",S),d.is("round",$)]}),c=s=>{l("close",s)},f=s=>{l("click",s)};return(s,S)=>s.disableTransitions?(h(),P("span",{key:0,class:g(b(u)),style:X({backgroundColor:s.color}),onClick:f},[M("span",{class:g(b(d).e("content"))},[le(s.$slots,"default")],2),s.closable?(h(),z(b(bl),{key:0,class:g(b(d).e("close")),onClick:j(c,["stop"])},{default:w(()=>[x(b(Tl))]),_:1},8,["class","onClick"])):K("v-if",!0)],6)):(h(),z(hl,{key:1,name:`${b(d).namespace.value}-zoom-in-center`,appear:""},{default:w(()=>[M("span",{class:g(b(u)),style:X({backgroundColor:s.color}),onClick:f},[M("span",{class:g(b(d).e("content"))},[le(s.$slots,"default")],2),s.closable?(h(),z(b(bl),{key:0,class:g(b(d).e("close")),onClick:j(c,["stop"])},{default:w(()=>[x(b(Tl))]),_:1},8,["class","onClick"])):K("v-if",!0)],6)]),_:3},8,["name"]))}});var Vn=Ie($n,[["__file","/home/runner/work/element-plus/element-plus/packages/components/tag/src/tag.vue"]]);const Dn=Kl(Vn),Rl=Symbol("ElSelectGroup"),Ne=Symbol("ElSelect");function Pn(e,l){const a=qe(Ne),v=qe(Rl,{disabled:!1}),d=p(()=>Object.prototype.toString.call(e.value).toLowerCase()==="[object object]"),u=p(()=>a.props.multiple?m(a.props.modelValue,e.value):$(e.value,a.props.modelValue)),c=p(()=>{if(a.props.multiple){const o=a.props.modelValue||[];return!u.value&&o.length>=a.props.multipleLimit&&a.props.multipleLimit>0}else return!1}),f=p(()=>e.label||(d.value?"":e.value)),s=p(()=>e.value||e.label||""),S=p(()=>e.disabled||l.groupDisabled||c.value),C=gl(),m=(o=[],y)=>{if(d.value){const O=a.props.valueKey;return o&&o.some(L=>We(N(L,O))===N(y,O))}else return o&&o.includes(y)},$=(o,y)=>{if(d.value){const{valueKey:O}=a.props;return N(o,O)===N(y,O)}else return o===y},T=()=>{!e.disabled&&!v.disabled&&(a.hoverIndex=a.optionsArray.indexOf(C.proxy))};R(()=>f.value,()=>{!e.created&&!a.props.remote&&a.setSelected()}),R(()=>e.value,(o,y)=>{const{remote:O,valueKey:L}=a.props;if(Object.is(o,y)||(a.onOptionDestroy(y,C.proxy),a.onOptionCreate(C.proxy)),!e.created&&!O){if(L&&typeof o=="object"&&typeof y=="object"&&o[L]===y[L])return;a.setSelected()}}),R(()=>v.disabled,()=>{l.groupDisabled=v.disabled},{immediate:!0});const{queryChange:I}=We(a);return R(I,o=>{const{query:y}=b(o),O=new RegExp(Ln(y),"i");l.visible=O.test(f.value)||e.created,l.visible||a.filteredOptionsCount--},{immediate:!0}),{select:a,currentLabel:f,currentValue:s,itemSelected:u,isDisabled:S,hoverItem:T}}const zn=se({name:"ElOption",componentName:"ElOption",props:{value:{required:!0,type:[String,Number,Boolean,Object]},label:[String,Number],created:Boolean,disabled:Boolean},setup(e){const l=ae("select"),a=p(()=>[l.be("dropdown","item"),l.is("disabled",b(c)),{selected:b(u),hover:b(C)}]),v=Fe({index:-1,groupDisabled:!1,visible:!0,hitState:!1,hover:!1}),{currentLabel:d,itemSelected:u,isDisabled:c,select:f,hoverItem:s}=Pn(e,v),{visible:S,hover:C}=yl(v),m=gl().proxy;f.onOptionCreate(m),Ul(()=>{const T=m.value,{selected:I}=f,y=(f.props.multiple?I:[I]).some(O=>O.value===m.value);A(()=>{f.cachedOptions.get(T)===m&&!y&&f.cachedOptions.delete(T)}),f.onOptionDestroy(T,m)});function $(){e.disabled!==!0&&v.groupDisabled!==!0&&f.handleOptionSelect(m)}return{ns:l,containerKls:a,currentLabel:d,itemSelected:u,isDisabled:c,select:f,hoverItem:s,visible:S,hover:C,selectOptionClick:$,states:v}}});function Kn(e,l,a,v,d,u){return Te((h(),P("li",{class:g(e.containerKls),onMouseenter:l[0]||(l[0]=(...c)=>e.hoverItem&&e.hoverItem(...c)),onClick:l[1]||(l[1]=j((...c)=>e.selectOptionClick&&e.selectOptionClick(...c),["stop"]))},[le(e.$slots,"default",{},()=>[M("span",null,_(e.currentLabel),1)])],34)),[[Cl,e.visible]])}var wl=Ie(zn,[["render",Kn],["__file","/home/runner/work/element-plus/element-plus/packages/components/select/src/option.vue"]]);const An=se({name:"ElSelectDropdown",componentName:"ElSelectDropdown",setup(){const e=qe(Ne),l=ae("select"),a=p(()=>e.props.popperClass),v=p(()=>e.props.multiple),d=p(()=>e.props.fitInputWidth),u=B("");function c(){var f;u.value=`${(f=e.selectWrapper)==null?void 0:f.offsetWidth}px`}return Sl(()=>{c(),Al(e.selectWrapper,c)}),{ns:l,minWidth:u,popperClass:a,isMultiple:v,isFitInputWidth:d}}});function Bn(e,l,a,v,d,u){return h(),P("div",{class:g([e.ns.b("dropdown"),e.ns.is("multiple",e.isMultiple),e.popperClass]),style:X({[e.isFitInputWidth?"width":"minWidth"]:e.minWidth})},[le(e.$slots,"default")],6)}var qn=Ie(An,[["render",Bn],["__file","/home/runner/work/element-plus/element-plus/packages/components/select/src/select-dropdown.vue"]]);function Wn(e){const{t:l}=Ol();return Fe({options:new Map,cachedOptions:new Map,disabledOptions:new Map,createdLabel:null,createdSelected:!1,selected:e.multiple?[]:{},inputLength:20,inputWidth:0,optionsCount:0,filteredOptionsCount:0,visible:!1,selectedLabel:"",hoverIndex:-1,query:"",previousQuery:null,inputHovering:!1,cachedPlaceHolder:"",currentPlaceholder:l("el.select.placeholder"),menuVisibleOnFocus:!1,isOnComposition:!1,prefixWidth:11,mouseEnter:!1,focused:!1})}const Fn=(e,l,a)=>{const{t:v}=Ol(),d=ae("select");Xl({from:"suffixTransition",replacement:"override style scheme",version:"2.3.0",scope:"props",ref:"https://element-plus.org/en-US/component/select.html#select-attributes"},p(()=>e.suffixTransition===!1));const u=B(null),c=B(null),f=B(null),s=B(null),S=B(null),C=B(null),m=B(null),$=B(null),T=B(-1),I=Il({query:""}),o=Il(""),y=B([]);let O=0;const{form:L,formItem:Q}=Yl(),Le=p(()=>!e.filterable||e.multiple||!l.visible),Y=p(()=>e.disabled||(L==null?void 0:L.disabled)),Re=p(()=>{const n=e.multiple?Array.isArray(e.modelValue)&&e.modelValue.length>0:e.modelValue!==void 0&&e.modelValue!==null&&e.modelValue!=="";return e.clearable&&!Y.value&&l.inputHovering&&n}),re=p(()=>e.remote&&e.filterable&&!e.remoteShowSuffix?"":e.suffixIcon),He=p(()=>d.is("reverse",re.value&&l.visible&&e.suffixTransition)),je=p(()=>(L==null?void 0:L.statusIcon)&&(Q==null?void 0:Q.validateState)&&Zl[Q==null?void 0:Q.validateState]),Ee=p(()=>e.remote?300:0),pe=p(()=>e.loading?e.loadingText||v("el.select.loading"):e.remote&&l.query===""&&l.options.size===0?!1:e.filterable&&l.query&&l.options.size>0&&l.filteredOptionsCount===0?e.noMatchText||v("el.select.noMatch"):l.options.size===0?e.noDataText||v("el.select.noData"):null),V=p(()=>{const n=Array.from(l.options.values()),t=[];return y.value.forEach(i=>{const r=n.findIndex(E=>E.currentLabel===i);r>-1&&t.push(n[r])}),t.length>=n.length?t:n}),Qe=p(()=>Array.from(l.cachedOptions.values())),Ge=p(()=>{const n=V.value.filter(t=>!t.created).some(t=>t.currentLabel===l.query);return e.filterable&&e.allowCreate&&l.query!==""&&!n}),ne=zl(),Ue=p(()=>["small"].includes(ne.value)?"small":"default"),Xe=p({get(){return l.visible&&pe.value!==!1},set(n){l.visible=n}});R([()=>Y.value,()=>ne.value,()=>L==null?void 0:L.size],()=>{A(()=>{H()})}),R(()=>e.placeholder,n=>{l.cachedPlaceHolder=l.currentPlaceholder=n,e.multiple&&Array.isArray(e.modelValue)&&e.modelValue.length>0&&(l.currentPlaceholder="")}),R(()=>e.modelValue,(n,t)=>{e.multiple&&(H(),n&&n.length>0||c.value&&l.query!==""?l.currentPlaceholder="":l.currentPlaceholder=l.cachedPlaceHolder,e.filterable&&!e.reserveKeyword&&(l.query="",Z(l.query))),fe(),e.filterable&&!e.multiple&&(l.inputLength=20),!Vl(n,t)&&e.validateEvent&&(Q==null||Q.validate("change").catch(i=>Jl()))},{flush:"post",deep:!0}),R(()=>l.visible,n=>{var t,i,r,E,D;n?((i=(t=s.value)==null?void 0:t.updatePopper)==null||i.call(t),e.filterable&&(l.filteredOptionsCount=l.optionsCount,l.query=e.remote?"":l.selectedLabel,(E=(r=f.value)==null?void 0:r.focus)==null||E.call(r),e.multiple?(D=c.value)==null||D.focus():l.selectedLabel&&(l.currentPlaceholder=`${l.selectedLabel}`,l.selectedLabel=""),Z(l.query),!e.multiple&&!e.remote&&(I.value.query="",we(I),we(o)))):(e.filterable&&(ie(e.filterMethod)&&e.filterMethod(""),ie(e.remoteMethod)&&e.remoteMethod("")),l.query="",l.previousQuery=null,l.selectedLabel="",l.inputLength=20,l.menuVisibleOnFocus=!1,Ye(),A(()=>{c.value&&c.value.value===""&&l.selected.length===0&&(l.currentPlaceholder=l.cachedPlaceHolder)}),e.multiple||(l.selected&&(e.filterable&&e.allowCreate&&l.createdSelected&&l.createdLabel?l.selectedLabel=l.createdLabel:l.selectedLabel=l.selected.currentLabel,e.filterable&&(l.query=l.selectedLabel)),e.filterable&&(l.currentPlaceholder=l.cachedPlaceHolder))),a.emit("visible-change",n)}),R(()=>l.options.entries(),()=>{var n,t,i;if(!xl)return;(t=(n=s.value)==null?void 0:n.updatePopper)==null||t.call(n),e.multiple&&H();const r=((i=m.value)==null?void 0:i.querySelectorAll("input"))||[];(!e.filterable&&!e.defaultFirstOption&&!_l(e.modelValue)||!Array.from(r).includes(document.activeElement))&&fe(),e.defaultFirstOption&&(e.filterable||e.remote)&&l.filteredOptionsCount&&Me()},{flush:"post"}),R(()=>l.hoverIndex,n=>{en(n)&&n>-1?T.value=V.value[n]||{}:T.value={},V.value.forEach(t=>{t.hover=T.value===t})});const H=()=>{A(()=>{var n,t;if(!u.value)return;const i=u.value.$el.querySelector("input");O=O||(i.clientHeight>0?i.clientHeight+2:0);const r=C.value,E=En(ne.value||(L==null?void 0:L.size)),D=ne.value||E===O||O<=0?E:O;!(i.offsetParent===null)&&(i.style.height=`${(l.selected.length===0?D:Math.max(r?r.clientHeight+(r.clientHeight>D?6:0):0,D))-2}px`),l.visible&&pe.value!==!1&&((t=(n=s.value)==null?void 0:n.updatePopper)==null||t.call(n))})},Z=async n=>{if(!(l.previousQuery===n||l.isOnComposition)){if(l.previousQuery===null&&(ie(e.filterMethod)||ie(e.remoteMethod))){l.previousQuery=n;return}l.previousQuery=n,A(()=>{var t,i;l.visible&&((i=(t=s.value)==null?void 0:t.updatePopper)==null||i.call(t))}),l.hoverIndex=-1,e.multiple&&e.filterable&&A(()=>{if(!Y.value){const t=c.value.value.length*15+20;l.inputLength=e.collapseTags?Math.min(50,t):t,ke()}H()}),e.remote&&ie(e.remoteMethod)?(l.hoverIndex=-1,e.remoteMethod(n)):ie(e.filterMethod)?(e.filterMethod(n),we(o)):(l.filteredOptionsCount=l.optionsCount,I.value.query=n,we(I),we(o)),e.defaultFirstOption&&(e.filterable||e.remote)&&l.filteredOptionsCount&&(await A(),Me())}},ke=()=>{l.currentPlaceholder!==""&&(l.currentPlaceholder=c.value.value?"":l.cachedPlaceHolder)},Me=()=>{const n=V.value.filter(r=>r.visible&&!r.disabled&&!r.states.groupDisabled),t=n.find(r=>r.created),i=n[0];l.hoverIndex=Pe(V.value,t||i)},fe=()=>{var n;if(e.multiple)l.selectedLabel="";else{const i=$e(e.modelValue);(n=i.props)!=null&&n.created?(l.createdLabel=i.props.value,l.createdSelected=!0):l.createdSelected=!1,l.selectedLabel=i.currentLabel,l.selected=i,e.filterable&&(l.query=l.selectedLabel);return}const t=[];Array.isArray(e.modelValue)&&e.modelValue.forEach(i=>{t.push($e(i))}),l.selected=t,A(()=>{H()})},$e=n=>{let t;const i=vl(n).toLowerCase()==="object",r=vl(n).toLowerCase()==="null",E=vl(n).toLowerCase()==="undefined";for(let U=l.cachedOptions.size-1;U>=0;U--){const W=Qe.value[U];if(i?N(W.value,e.valueKey)===N(n,e.valueKey):W.value===n){t={value:n,currentLabel:W.currentLabel,isDisabled:W.isDisabled};break}}if(t)return t;const D=i?n.label:!r&&!E?n:"",G={value:n,currentLabel:D};return e.multiple&&(G.hitState=!1),G},Ye=()=>{setTimeout(()=>{const n=e.valueKey;e.multiple?l.selected.length>0?l.hoverIndex=Math.min.apply(null,l.selected.map(t=>V.value.findIndex(i=>N(i,n)===N(t,n)))):l.hoverIndex=-1:l.hoverIndex=V.value.findIndex(t=>Ce(t)===Ce(l.selected))},300)},Ze=()=>{var n,t;Je(),(t=(n=s.value)==null?void 0:n.updatePopper)==null||t.call(n),e.multiple&&H()},Je=()=>{var n;l.inputWidth=(n=u.value)==null?void 0:n.$el.offsetWidth},xe=()=>{e.filterable&&l.query!==l.selectedLabel&&(l.query=l.selectedLabel,Z(l.query))},_e=$l(()=>{xe()},Ee.value),el=$l(n=>{Z(n.target.value)},Ee.value),te=n=>{Vl(e.modelValue,n)||a.emit(ql,n)},ue=n=>In(n,t=>!l.disabledOptions.has(t)),ll=n=>{if(n.code!==El.delete){if(n.target.value.length<=0&&!be()){const t=e.modelValue.slice(),i=ue(t);if(i<0)return;t.splice(i,1),a.emit(ee,t),te(t)}n.target.value.length===1&&e.modelValue.length===0&&(l.currentPlaceholder=l.cachedPlaceHolder)}},Ve=(n,t)=>{const i=l.selected.indexOf(t);if(i>-1&&!Y.value){const r=e.modelValue.slice();r.splice(i,1),a.emit(ee,r),te(r),a.emit("remove-tag",t.value)}n.stopPropagation(),q()},ve=n=>{n.stopPropagation();const t=e.multiple?[]:"";if(!Bl(t))for(const i of l.selected)i.isDisabled&&t.push(i.value);a.emit(ee,t),te(t),l.hoverIndex=-1,l.visible=!1,a.emit("clear"),q()},De=n=>{var t;if(e.multiple){const i=(e.modelValue||[]).slice(),r=Pe(i,n.value);r>-1?i.splice(r,1):(e.multipleLimit<=0||i.length<e.multipleLimit)&&i.push(n.value),a.emit(ee,i),te(i),n.created&&(l.query="",Z(""),l.inputLength=20),e.filterable&&((t=c.value)==null||t.focus())}else a.emit(ee,n.value),te(n.value),l.visible=!1;me(),!l.visible&&A(()=>{de(n)})},Pe=(n=[],t)=>{if(!Ll(t))return n.indexOf(t);const i=e.valueKey;let r=-1;return n.some((E,D)=>We(N(E,i))===N(t,i)?(r=D,!0):!1),r},me=()=>{const n=c.value||u.value;n&&(n==null||n.focus())},de=n=>{var t,i,r,E,D;const G=Array.isArray(n)?n[0]:n;let U=null;if(G!=null&&G.value){const W=V.value.filter(k=>k.value===G.value);W.length>0&&(U=W[0].$el)}if(s.value&&U){const W=(E=(r=(i=(t=s.value)==null?void 0:t.popperRef)==null?void 0:i.contentRef)==null?void 0:r.querySelector)==null?void 0:E.call(r,`.${d.be("dropdown","wrap")}`);W&&ln(W,U)}(D=$.value)==null||D.handleScroll()},nl=n=>{l.optionsCount++,l.filteredOptionsCount++,l.options.set(n.value,n),l.cachedOptions.set(n.value,n),n.disabled&&l.disabledOptions.set(n.value,n)},tl=(n,t)=>{l.options.get(n)===t&&(l.optionsCount--,l.filteredOptionsCount--,l.options.delete(n))},ol=n=>{n.code!==El.backspace&&be(!1),l.inputLength=c.value.value.length*15+20,H()},be=n=>{if(!Array.isArray(l.selected))return;const t=ue(l.selected.map(r=>r.value)),i=l.selected[t];if(!!i)return n===!0||n===!1?(i.hitState=n,n):(i.hitState=!i.hitState,i.hitState)},il=n=>{const t=n.target.value;if(n.type==="compositionend")l.isOnComposition=!1,A(()=>Z(t));else{const i=t[t.length-1]||"";l.isOnComposition=!nn(i)}},al=()=>{A(()=>de(l.selected))},sl=n=>{l.focused||((e.automaticDropdown||e.filterable)&&(e.filterable&&!l.visible&&(l.menuVisibleOnFocus=!0),l.visible=!0),l.focused=!0,a.emit("focus",n))},q=()=>{var n,t;l.visible?(n=c.value||u.value)==null||n.focus():(t=u.value)==null||t.focus()},he=()=>{var n,t,i;l.visible=!1,(n=u.value)==null||n.blur(),(i=(t=f.value)==null?void 0:t.blur)==null||i.call(t)},ze=n=>{var t,i,r;((t=s.value)==null?void 0:t.isFocusInsideContent(n))||((i=S.value)==null?void 0:i.isFocusInsideContent(n))||((r=m.value)==null?void 0:r.contains(n.relatedTarget))||(l.visible&&Ke(),l.focused=!1,a.emit("blur",n))},ge=n=>{ve(n)},Ke=()=>{l.visible=!1},rl=n=>{l.visible&&(n.preventDefault(),n.stopPropagation(),l.visible=!1)},ye=n=>{n&&!l.mouseEnter||Y.value||(l.menuVisibleOnFocus?l.menuVisibleOnFocus=!1:(!s.value||!s.value.isFocusInsideContent())&&(l.visible=!l.visible),q())},Ae=()=>{l.visible?V.value[l.hoverIndex]&&De(V.value[l.hoverIndex]):ye()},Ce=n=>Ll(n.value)?N(n.value,e.valueKey):n.value,Se=p(()=>V.value.filter(n=>n.visible).every(n=>n.disabled)),ul=p(()=>e.multiple?l.selected.slice(0,e.maxCollapseTags):[]),dl=p(()=>e.multiple?l.selected.slice(e.maxCollapseTags):[]),Oe=n=>{if(!l.visible){l.visible=!0;return}if(!(l.options.size===0||l.filteredOptionsCount===0)&&!l.isOnComposition&&!Se.value){n==="next"?(l.hoverIndex++,l.hoverIndex===l.options.size&&(l.hoverIndex=0)):n==="prev"&&(l.hoverIndex--,l.hoverIndex<0&&(l.hoverIndex=l.options.size-1));const t=V.value[l.hoverIndex];(t.disabled===!0||t.states.groupDisabled===!0||!t.visible)&&Oe(n),A(()=>de(T.value))}},cl=()=>{l.mouseEnter=!0},pl=()=>{l.mouseEnter=!1},ce=(n,t)=>{var i,r;Ve(n,t),(r=(i=S.value)==null?void 0:i.updatePopper)==null||r.call(i)},fl=p(()=>({maxWidth:`${b(l.inputWidth)-32-(je.value?22:0)}px`,width:"100%"}));return{optionList:y,optionsArray:V,selectSize:ne,handleResize:Ze,debouncedOnInputChange:_e,debouncedQueryChange:el,deletePrevTag:ll,deleteTag:Ve,deleteSelected:ve,handleOptionSelect:De,scrollToOption:de,readonly:Le,resetInputHeight:H,showClose:Re,iconComponent:re,iconReverse:He,showNewOption:Ge,collapseTagSize:Ue,setSelected:fe,managePlaceholder:ke,selectDisabled:Y,emptyText:pe,toggleLastOptionHitState:be,resetInputState:ol,handleComposition:il,onOptionCreate:nl,onOptionDestroy:tl,handleMenuEnter:al,handleFocus:sl,focus:q,blur:he,handleBlur:ze,handleClearClick:ge,handleClose:Ke,handleKeydownEscape:rl,toggleMenu:ye,selectOption:Ae,getValueKey:Ce,navigateOptions:Oe,handleDeleteTooltipTag:ce,dropMenuVisible:Xe,queryChange:I,groupQueryChange:o,showTagList:ul,collapseTagList:dl,selectTagsStyle:fl,reference:u,input:c,iOSInput:f,tooltipRef:s,tagTooltipRef:S,tags:C,selectWrapper:m,scrollbar:$,handleMouseEnter:cl,handleMouseLeave:pl}};var Nn=se({name:"ElOptions",emits:["update-options"],setup(e,{slots:l,emit:a}){let v=[];function d(u,c){if(u.length!==c.length)return!1;for(const[f]of u.entries())if(u[f]!=c[f])return!1;return!0}return()=>{var u,c;const f=(u=l.default)==null?void 0:u.call(l),s=[];function S(C){!Array.isArray(C)||C.forEach(m=>{var $,T,I,o;const y=($=(m==null?void 0:m.type)||{})==null?void 0:$.name;y==="ElOptionGroup"?S(!Bl(m.children)&&!Array.isArray(m.children)&&ie((T=m.children)==null?void 0:T.default)?(I=m.children)==null?void 0:I.default():m.children):y==="ElOption"?s.push((o=m.props)==null?void 0:o.label):Array.isArray(m.children)&&S(m.children)})}return f.length&&S((c=f[0])==null?void 0:c.children),d(s,v)||(v=s,a("update-options",s)),f}}});const Pl="ElSelect",Rn=se({name:Pl,componentName:Pl,components:{ElInput:tn,ElSelectMenu:qn,ElOption:wl,ElOptions:Nn,ElTag:Dn,ElScrollbar:on,ElTooltip:an,ElIcon:bl},directives:{ClickOutside:hn},props:{name:String,id:String,modelValue:{type:[Array,String,Number,Boolean,Object],default:void 0},autocomplete:{type:String,default:"off"},automaticDropdown:Boolean,size:{type:String,validator:gn},effect:{type:String,default:"light"},disabled:Boolean,clearable:Boolean,filterable:Boolean,allowCreate:Boolean,loading:Boolean,popperClass:{type:String,default:""},popperOptions:{type:Object,default:()=>({})},remote:Boolean,loadingText:String,noMatchText:String,noDataText:String,remoteMethod:Function,filterMethod:Function,multiple:Boolean,multipleLimit:{type:Number,default:0},placeholder:{type:String},defaultFirstOption:Boolean,reserveKeyword:{type:Boolean,default:!0},valueKey:{type:String,default:"value"},collapseTags:Boolean,collapseTagsTooltip:Boolean,maxCollapseTags:{type:Number,default:1},teleported:sn.teleported,persistent:{type:Boolean,default:!0},clearIcon:{type:kl,default:rn},fitInputWidth:Boolean,suffixIcon:{type:kl,default:un},tagType:{...Nl.type,default:"info"},validateEvent:{type:Boolean,default:!0},remoteShowSuffix:Boolean,suffixTransition:{type:Boolean,default:!0},placement:{type:String,values:dn,default:"bottom-start"},ariaLabel:{type:String,default:void 0}},emits:[ee,ql,"remove-tag","clear","visible-change","focus","blur"],setup(e,l){const a=ae("select"),v=ae("input"),{t:d}=Ol(),u=Wn(e),{optionList:c,optionsArray:f,selectSize:s,readonly:S,handleResize:C,collapseTagSize:m,debouncedOnInputChange:$,debouncedQueryChange:T,deletePrevTag:I,deleteTag:o,deleteSelected:y,handleOptionSelect:O,scrollToOption:L,setSelected:Q,resetInputHeight:Le,managePlaceholder:Y,showClose:Re,selectDisabled:re,iconComponent:He,iconReverse:je,showNewOption:Ee,emptyText:pe,toggleLastOptionHitState:V,resetInputState:Qe,handleComposition:Ge,onOptionCreate:ne,onOptionDestroy:Ue,handleMenuEnter:Xe,handleFocus:H,focus:Z,blur:ke,handleBlur:Me,handleClearClick:fe,handleClose:$e,handleKeydownEscape:Ye,toggleMenu:Ze,selectOption:Je,getValueKey:xe,navigateOptions:_e,handleDeleteTooltipTag:el,dropMenuVisible:te,reference:ue,input:ll,iOSInput:Ve,tooltipRef:ve,tagTooltipRef:De,tags:Pe,selectWrapper:me,scrollbar:de,queryChange:nl,groupQueryChange:tl,handleMouseEnter:ol,handleMouseLeave:be,showTagList:il,collapseTagList:al,selectTagsStyle:sl}=Fn(e,u,l),{inputWidth:q,selected:he,inputLength:ze,filteredOptionsCount:ge,visible:Ke,selectedLabel:rl,hoverIndex:ye,query:Ae,inputHovering:Ce,currentPlaceholder:Se,menuVisibleOnFocus:ul,isOnComposition:dl,options:Oe,cachedOptions:cl,optionsCount:pl,prefixWidth:ce}=yl(u),fl=p(()=>{const k=[a.b()],oe=b(s);return oe&&k.push(a.m(oe)),e.disabled&&k.push(a.m("disabled")),k}),n=p(()=>[a.e("tags"),a.is("disabled",b(re))]),t=p(()=>[a.b("tags-wrapper"),{"has-prefix":b(ce)&&b(he).length}]),i=p(()=>[a.e("input"),a.is(b(s)),a.is("disabled",b(re))]),r=p(()=>[a.e("input"),a.is(b(s)),a.em("input","iOS")]),E=p(()=>[a.is("empty",!e.allowCreate&&Boolean(b(Ae))&&b(ge)===0)]),D=p(()=>({maxWidth:`${b(q)>123?b(q)-123:b(q)-75}px`})),G=p(()=>({marginLeft:`${b(ce)}px`,flexGrow:1,width:`${b(ze)/(b(q)-32)}%`,maxWidth:`${b(q)-42}px`}));Wl(Ne,Fe({props:e,options:Oe,optionsArray:f,cachedOptions:cl,optionsCount:pl,filteredOptionsCount:ge,hoverIndex:ye,handleOptionSelect:O,onOptionCreate:ne,onOptionDestroy:Ue,selectWrapper:me,selected:he,setSelected:Q,queryChange:nl,groupQueryChange:tl})),Sl(()=>{u.cachedPlaceHolder=Se.value=e.placeholder||(()=>d("el.select.placeholder")),e.multiple&&Array.isArray(e.modelValue)&&e.modelValue.length>0&&(Se.value=""),Al(me,C),e.remote&&e.multiple&&Le(),A(()=>{const k=ue.value&&ue.value.$el;if(!!k&&(q.value=k.getBoundingClientRect().width,l.slots.prefix)){const oe=k.querySelector(`.${v.e("prefix")}`);ce.value=Math.max(oe.getBoundingClientRect().width+11,30)}}),Q()}),e.multiple&&!Array.isArray(e.modelValue)&&l.emit(ee,[]),!e.multiple&&Array.isArray(e.modelValue)&&l.emit(ee,"");const U=p(()=>{var k,oe;return(oe=(k=ve.value)==null?void 0:k.popperRef)==null?void 0:oe.contentRef});return{isIOS:cn,onOptionsRendered:k=>{c.value=k},prefixWidth:ce,selectSize:s,readonly:S,handleResize:C,collapseTagSize:m,debouncedOnInputChange:$,debouncedQueryChange:T,deletePrevTag:I,deleteTag:o,handleDeleteTooltipTag:el,deleteSelected:y,handleOptionSelect:O,scrollToOption:L,inputWidth:q,selected:he,inputLength:ze,filteredOptionsCount:ge,visible:Ke,selectedLabel:rl,hoverIndex:ye,query:Ae,inputHovering:Ce,currentPlaceholder:Se,menuVisibleOnFocus:ul,isOnComposition:dl,options:Oe,resetInputHeight:Le,managePlaceholder:Y,showClose:Re,selectDisabled:re,iconComponent:He,iconReverse:je,showNewOption:Ee,emptyText:pe,toggleLastOptionHitState:V,resetInputState:Qe,handleComposition:Ge,handleMenuEnter:Xe,handleFocus:H,focus:Z,blur:ke,handleBlur:Me,handleClearClick:fe,handleClose:$e,handleKeydownEscape:Ye,toggleMenu:Ze,selectOption:Je,getValueKey:xe,navigateOptions:_e,dropMenuVisible:te,reference:ue,input:ll,iOSInput:Ve,tooltipRef:ve,popperPaneRef:U,tags:Pe,selectWrapper:me,scrollbar:de,wrapperKls:fl,tagsKls:n,tagWrapperKls:t,inputKls:i,iOSInputKls:r,scrollbarKls:E,selectTagsStyle:sl,nsSelect:a,tagTextStyle:D,inputStyle:G,handleMouseEnter:ol,handleMouseLeave:be,showTagList:il,collapseTagList:al,tagTooltipRef:De}}}),Hn=["disabled","autocomplete","aria-label"],jn=["disabled"],Qn={style:{height:"100%",display:"flex","justify-content":"center","align-items":"center"}};function Gn(e,l,a,v,d,u){const c=J("el-tag"),f=J("el-tooltip"),s=J("el-icon"),S=J("el-input"),C=J("el-option"),m=J("el-options"),$=J("el-scrollbar"),T=J("el-select-menu"),I=pn("click-outside");return Te((h(),P("div",{ref:"selectWrapper",class:g(e.wrapperKls),onMouseenter:l[22]||(l[22]=(...o)=>e.handleMouseEnter&&e.handleMouseEnter(...o)),onMouseleave:l[23]||(l[23]=(...o)=>e.handleMouseLeave&&e.handleMouseLeave(...o)),onClick:l[24]||(l[24]=j((...o)=>e.toggleMenu&&e.toggleMenu(...o),["stop"]))},[x(f,{ref:"tooltipRef",visible:e.dropMenuVisible,placement:e.placement,teleported:e.teleported,"popper-class":[e.nsSelect.e("popper"),e.popperClass],"popper-options":e.popperOptions,"fallback-placements":["bottom-start","top-start","right","left"],effect:e.effect,pure:"",trigger:"click",transition:`${e.nsSelect.namespace.value}-zoom-in-top`,"stop-popper-mouse-event":!1,"gpu-acceleration":!1,persistent:e.persistent,onShow:e.handleMenuEnter},{default:w(()=>[M("div",{class:"select-trigger",onMouseenter:l[20]||(l[20]=o=>e.inputHovering=!0),onMouseleave:l[21]||(l[21]=o=>e.inputHovering=!1)},[e.multiple?(h(),P("div",{key:0,ref:"tags",tabindex:"-1",class:g(e.tagsKls),style:X(e.selectTagsStyle),onClick:l[15]||(l[15]=(...o)=>e.focus&&e.focus(...o))},[e.collapseTags&&e.selected.length?(h(),z(hl,{key:0,onAfterLeave:e.resetInputHeight},{default:w(()=>[M("span",{class:g(e.tagWrapperKls)},[(h(!0),P(Be,null,ml(e.showTagList,o=>(h(),z(c,{key:e.getValueKey(o),closable:!e.selectDisabled&&!o.isDisabled,size:e.collapseTagSize,hit:o.hitState,type:e.tagType,"disable-transitions":"",onClose:y=>e.deleteTag(y,o)},{default:w(()=>[M("span",{class:g(e.nsSelect.e("tags-text")),style:X(e.tagTextStyle)},_(o.currentLabel),7)]),_:2},1032,["closable","size","hit","type","onClose"]))),128)),e.selected.length>e.maxCollapseTags?(h(),z(c,{key:0,closable:!1,size:e.collapseTagSize,type:e.tagType,"disable-transitions":""},{default:w(()=>[e.collapseTagsTooltip?(h(),z(f,{key:0,ref:"tagTooltipRef",disabled:e.dropMenuVisible,"fallback-placements":["bottom","top","right","left"],effect:e.effect,placement:"bottom",teleported:e.teleported},{default:w(()=>[M("span",{class:g(e.nsSelect.e("tags-text"))},"+ "+_(e.selected.length-e.maxCollapseTags),3)]),content:w(()=>[M("div",{class:g(e.nsSelect.e("collapse-tags"))},[(h(!0),P(Be,null,ml(e.collapseTagList,o=>(h(),P("div",{key:e.getValueKey(o),class:g(e.nsSelect.e("collapse-tag"))},[x(c,{class:"in-tooltip",closable:!e.selectDisabled&&!o.isDisabled,size:e.collapseTagSize,hit:o.hitState,type:e.tagType,"disable-transitions":"",style:{margin:"2px"},onClose:y=>e.handleDeleteTooltipTag(y,o)},{default:w(()=>[M("span",{class:g(e.nsSelect.e("tags-text")),style:X({maxWidth:e.inputWidth-75+"px"})},_(o.currentLabel),7)]),_:2},1032,["closable","size","hit","type","onClose"])],2))),128))],2)]),_:1},8,["disabled","effect","teleported"])):(h(),P("span",{key:1,class:g(e.nsSelect.e("tags-text"))},"+ "+_(e.selected.length-e.maxCollapseTags),3))]),_:1},8,["size","type"])):K("v-if",!0)],2)]),_:1},8,["onAfterLeave"])):K("v-if",!0),e.collapseTags?K("v-if",!0):(h(),z(hl,{key:1,onAfterLeave:e.resetInputHeight},{default:w(()=>[M("span",{class:g(e.tagWrapperKls),style:X(e.prefixWidth&&e.selected.length?{marginLeft:`${e.prefixWidth}px`}:"")},[(h(!0),P(Be,null,ml(e.selected,o=>(h(),z(c,{key:e.getValueKey(o),closable:!e.selectDisabled&&!o.isDisabled,size:e.collapseTagSize,hit:o.hitState,type:e.tagType,"disable-transitions":"",onClose:y=>e.deleteTag(y,o)},{default:w(()=>[M("span",{class:g(e.nsSelect.e("tags-text")),style:X({maxWidth:e.inputWidth-75+"px"})},_(o.currentLabel),7)]),_:2},1032,["closable","size","hit","type","onClose"]))),128))],6)]),_:1},8,["onAfterLeave"])),e.filterable&&!e.selectDisabled?Te((h(),P("input",{key:2,ref:"input","onUpdate:modelValue":l[0]||(l[0]=o=>e.query=o),type:"text",class:g(e.inputKls),disabled:e.selectDisabled,autocomplete:e.autocomplete,style:X(e.inputStyle),"aria-label":e.ariaLabel,onFocus:l[1]||(l[1]=(...o)=>e.handleFocus&&e.handleFocus(...o)),onBlur:l[2]||(l[2]=(...o)=>e.handleBlur&&e.handleBlur(...o)),onKeyup:l[3]||(l[3]=(...o)=>e.managePlaceholder&&e.managePlaceholder(...o)),onKeydown:[l[4]||(l[4]=(...o)=>e.resetInputState&&e.resetInputState(...o)),l[5]||(l[5]=F(j(o=>e.navigateOptions("next"),["prevent"]),["down"])),l[6]||(l[6]=F(j(o=>e.navigateOptions("prev"),["prevent"]),["up"])),l[7]||(l[7]=F((...o)=>e.handleKeydownEscape&&e.handleKeydownEscape(...o),["esc"])),l[8]||(l[8]=F(j((...o)=>e.selectOption&&e.selectOption(...o),["stop","prevent"]),["enter"])),l[9]||(l[9]=F((...o)=>e.deletePrevTag&&e.deletePrevTag(...o),["delete"])),l[10]||(l[10]=F(o=>e.visible=!1,["tab"]))],onCompositionstart:l[11]||(l[11]=(...o)=>e.handleComposition&&e.handleComposition(...o)),onCompositionupdate:l[12]||(l[12]=(...o)=>e.handleComposition&&e.handleComposition(...o)),onCompositionend:l[13]||(l[13]=(...o)=>e.handleComposition&&e.handleComposition(...o)),onInput:l[14]||(l[14]=(...o)=>e.debouncedQueryChange&&e.debouncedQueryChange(...o))},null,46,Hn)),[[fn,e.query]]):K("v-if",!0)],6)):K("v-if",!0),K(" fix: https://github.com/element-plus/element-plus/issues/11415 "),e.isIOS&&!e.multiple&&e.filterable&&e.readonly?(h(),P("input",{key:1,ref:"iOSInput",class:g(e.iOSInputKls),disabled:e.selectDisabled,type:"text"},null,10,jn)):K("v-if",!0),x(S,{id:e.id,ref:"reference",modelValue:e.selectedLabel,"onUpdate:modelValue":l[16]||(l[16]=o=>e.selectedLabel=o),type:"text",placeholder:typeof e.currentPlaceholder=="function"?e.currentPlaceholder():e.currentPlaceholder,name:e.name,autocomplete:e.autocomplete,size:e.selectSize,disabled:e.selectDisabled,readonly:e.readonly,"validate-event":!1,class:g([e.nsSelect.is("focus",e.visible)]),tabindex:e.multiple&&e.filterable?-1:void 0,label:e.ariaLabel,onFocus:e.handleFocus,onBlur:e.handleBlur,onInput:e.debouncedOnInputChange,onPaste:e.debouncedOnInputChange,onCompositionstart:e.handleComposition,onCompositionupdate:e.handleComposition,onCompositionend:e.handleComposition,onKeydown:[l[17]||(l[17]=F(j(o=>e.navigateOptions("next"),["stop","prevent"]),["down"])),l[18]||(l[18]=F(j(o=>e.navigateOptions("prev"),["stop","prevent"]),["up"])),F(j(e.selectOption,["stop","prevent"]),["enter"]),F(e.handleKeydownEscape,["esc"]),l[19]||(l[19]=F(o=>e.visible=!1,["tab"]))]},vn({suffix:w(()=>[e.iconComponent&&!e.showClose?(h(),z(s,{key:0,class:g([e.nsSelect.e("caret"),e.nsSelect.e("icon"),e.iconReverse])},{default:w(()=>[(h(),z(Ml(e.iconComponent)))]),_:1},8,["class"])):K("v-if",!0),e.showClose&&e.clearIcon?(h(),z(s,{key:1,class:g([e.nsSelect.e("caret"),e.nsSelect.e("icon")]),onClick:e.handleClearClick},{default:w(()=>[(h(),z(Ml(e.clearIcon)))]),_:1},8,["class","onClick"])):K("v-if",!0)]),_:2},[e.$slots.prefix?{name:"prefix",fn:w(()=>[M("div",Qn,[le(e.$slots,"prefix")])])}:void 0]),1032,["id","modelValue","placeholder","name","autocomplete","size","disabled","readonly","class","tabindex","label","onFocus","onBlur","onInput","onPaste","onCompositionstart","onCompositionupdate","onCompositionend","onKeydown"])],32)]),content:w(()=>[x(T,null,{default:w(()=>[Te(x($,{ref:"scrollbar",tag:"ul","wrap-class":e.nsSelect.be("dropdown","wrap"),"view-class":e.nsSelect.be("dropdown","list"),class:g(e.scrollbarKls)},{default:w(()=>[e.showNewOption?(h(),z(C,{key:0,value:e.query,created:!0},null,8,["value"])):K("v-if",!0),x(m,{onUpdateOptions:e.onOptionsRendered},{default:w(()=>[le(e.$slots,"default")]),_:3},8,["onUpdateOptions"])]),_:3},8,["wrap-class","view-class","class"]),[[Cl,e.options.size>0&&!e.loading]]),e.emptyText&&(!e.allowCreate||e.loading||e.allowCreate&&e.options.size===0)?(h(),P(Be,{key:0},[e.$slots.empty?le(e.$slots,"empty",{key:0}):(h(),P("p",{key:1,class:g(e.nsSelect.be("dropdown","empty"))},_(e.emptyText),3))],64)):K("v-if",!0)]),_:3})]),_:3},8,["visible","placement","teleported","popper-class","popper-options","effect","transition","persistent","onShow"])],34)),[[I,e.handleClose,e.popperPaneRef]])}var Un=Ie(Rn,[["render",Gn],["__file","/home/runner/work/element-plus/element-plus/packages/components/select/src/select.vue"]]);const Xn=se({name:"ElOptionGroup",componentName:"ElOptionGroup",props:{label:String,disabled:Boolean},setup(e){const l=ae("select"),a=B(!0),v=gl(),d=B([]);Wl(Rl,Fe({...yl(e)}));const u=qe(Ne);Sl(()=>{d.value=c(v.subTree)});const c=s=>{const S=[];return Array.isArray(s.children)&&s.children.forEach(C=>{var m;C.type&&C.type.name==="ElOption"&&C.component&&C.component.proxy?S.push(C.component.proxy):(m=C.children)!=null&&m.length&&S.push(...c(C))}),S},{groupQueryChange:f}=We(u);return R(f,()=>{a.value=d.value.some(s=>s.visible===!0)},{flush:"post"}),{visible:a,ns:l}}});function Yn(e,l,a,v,d,u){return Te((h(),P("ul",{class:g(e.ns.be("group","wrap"))},[M("li",{class:g(e.ns.be("group","title"))},_(e.label),3),M("li",null,[M("ul",{class:g(e.ns.b("group"))},[le(e.$slots,"default")],2)])],2)),[[Cl,e.visible]])}var Hl=Ie(Xn,[["render",Yn],["__file","/home/runner/work/element-plus/element-plus/packages/components/select/src/option-group.vue"]]);const et=Kl(Un,{Option:wl,OptionGroup:Hl}),lt=Fl(wl);Fl(Hl);export{Dn as E,lt as a,On as b,et as c,Ln as e};
