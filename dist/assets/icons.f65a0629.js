import{bk as et,bU as ot,bT as B,a as rt,F as nt,k as st,c as k,h as g,f as P,p as z,U as it,V as ut,cm as o,v as at,x as ct,o as N,t as lt,cn as _t,y as pt}from"./index.b3874ab7.js";var H={exports:{}};/*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */(function(h,L){(function(D,y){h.exports=y()})(et,function(){return function(){var I={686:function(c,u,t){t.d(u,{default:function(){return tt}});var s=t(279),_=t.n(s),p=t(370),E=t.n(p),f=t(817),T=t.n(f);function v(a){try{return document.execCommand(a)}catch{return!1}}var m=function(r){var e=T()(r);return v("cut"),e},d=m;function O(a){var r=document.documentElement.getAttribute("dir")==="rtl",e=document.createElement("textarea");e.style.fontSize="12pt",e.style.border="0",e.style.padding="0",e.style.margin="0",e.style.position="absolute",e.style[r?"right":"left"]="-9999px";var n=window.pageYOffset||document.documentElement.scrollTop;return e.style.top="".concat(n,"px"),e.setAttribute("readonly",""),e.value=a,e}var M=function(r,e){var n=O(r);e.container.appendChild(n);var i=T()(n);return v("copy"),n.remove(),i},U=function(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{container:document.body},n="";return typeof r=="string"?n=M(r,e):r instanceof HTMLInputElement&&!["text","search","url","tel","password"].includes(r==null?void 0:r.type)?n=M(r.value,e):(n=T()(r),v("copy")),n},S=U;function V(a){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?V=function(e){return typeof e}:V=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},V(a)}var $=function(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=r.action,n=e===void 0?"copy":e,i=r.container,l=r.target,A=r.text;if(n!=="copy"&&n!=="cut")throw new Error('Invalid "action" value, use either "copy" or "cut"');if(l!==void 0)if(l&&V(l)==="object"&&l.nodeType===1){if(n==="copy"&&l.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if(n==="cut"&&(l.hasAttribute("readonly")||l.hasAttribute("disabled")))throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`)}else throw new Error('Invalid "target" value, use a valid Element');if(A)return S(A,{container:i});if(l)return n==="cut"?d(l):S(l,{container:i})},Y=$;function R(a){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?R=function(e){return typeof e}:R=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},R(a)}function q(a,r){if(!(a instanceof r))throw new TypeError("Cannot call a class as a function")}function j(a,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(a,n.key,n)}}function G(a,r,e){return r&&j(a.prototype,r),e&&j(a,e),a}function X(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(r&&r.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),r&&F(a,r)}function F(a,r){return F=Object.setPrototypeOf||function(n,i){return n.__proto__=i,n},F(a,r)}function J(a){var r=W();return function(){var n=x(a),i;if(r){var l=x(this).constructor;i=Reflect.construct(n,arguments,l)}else i=n.apply(this,arguments);return K(this,i)}}function K(a,r){return r&&(R(r)==="object"||typeof r=="function")?r:Q(a)}function Q(a){if(a===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function W(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function x(a){return x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},x(a)}function w(a,r){var e="data-clipboard-".concat(a);if(!!r.hasAttribute(e))return r.getAttribute(e)}var Z=function(a){X(e,a);var r=J(e);function e(n,i){var l;return q(this,e),l=r.call(this),l.resolveOptions(i),l.listenClick(n),l}return G(e,[{key:"resolveOptions",value:function(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};this.action=typeof i.action=="function"?i.action:this.defaultAction,this.target=typeof i.target=="function"?i.target:this.defaultTarget,this.text=typeof i.text=="function"?i.text:this.defaultText,this.container=R(i.container)==="object"?i.container:document.body}},{key:"listenClick",value:function(i){var l=this;this.listener=E()(i,"click",function(A){return l.onClick(A)})}},{key:"onClick",value:function(i){var l=i.delegateTarget||i.currentTarget,A=this.action(l)||"copy",C=Y({action:A,container:this.container,target:this.target(l),text:this.text(l)});this.emit(C?"success":"error",{action:A,text:C,trigger:l,clearSelection:function(){l&&l.focus(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(i){return w("action",i)}},{key:"defaultTarget",value:function(i){var l=w("target",i);if(l)return document.querySelector(l)}},{key:"defaultText",value:function(i){return w("text",i)}},{key:"destroy",value:function(){this.listener.destroy()}}],[{key:"copy",value:function(i){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{container:document.body};return S(i,l)}},{key:"cut",value:function(i){return d(i)}},{key:"isSupported",value:function(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:["copy","cut"],l=typeof i=="string"?[i]:i,A=!!document.queryCommandSupported;return l.forEach(function(C){A=A&&!!document.queryCommandSupported(C)}),A}}]),e}(_()),tt=Z},828:function(c){var u=9;if(typeof Element<"u"&&!Element.prototype.matches){var t=Element.prototype;t.matches=t.matchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector||t.webkitMatchesSelector}function s(_,p){for(;_&&_.nodeType!==u;){if(typeof _.matches=="function"&&_.matches(p))return _;_=_.parentNode}}c.exports=s},438:function(c,u,t){var s=t(828);function _(f,T,v,m,d){var O=E.apply(this,arguments);return f.addEventListener(v,O,d),{destroy:function(){f.removeEventListener(v,O,d)}}}function p(f,T,v,m,d){return typeof f.addEventListener=="function"?_.apply(null,arguments):typeof v=="function"?_.bind(null,document).apply(null,arguments):(typeof f=="string"&&(f=document.querySelectorAll(f)),Array.prototype.map.call(f,function(O){return _(O,T,v,m,d)}))}function E(f,T,v,m){return function(d){d.delegateTarget=s(d.target,T),d.delegateTarget&&m.call(f,d)}}c.exports=p},879:function(c,u){u.node=function(t){return t!==void 0&&t instanceof HTMLElement&&t.nodeType===1},u.nodeList=function(t){var s=Object.prototype.toString.call(t);return t!==void 0&&(s==="[object NodeList]"||s==="[object HTMLCollection]")&&"length"in t&&(t.length===0||u.node(t[0]))},u.string=function(t){return typeof t=="string"||t instanceof String},u.fn=function(t){var s=Object.prototype.toString.call(t);return s==="[object Function]"}},370:function(c,u,t){var s=t(879),_=t(438);function p(v,m,d){if(!v&&!m&&!d)throw new Error("Missing required arguments");if(!s.string(m))throw new TypeError("Second argument must be a String");if(!s.fn(d))throw new TypeError("Third argument must be a Function");if(s.node(v))return E(v,m,d);if(s.nodeList(v))return f(v,m,d);if(s.string(v))return T(v,m,d);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function E(v,m,d){return v.addEventListener(m,d),{destroy:function(){v.removeEventListener(m,d)}}}function f(v,m,d){return Array.prototype.forEach.call(v,function(O){O.addEventListener(m,d)}),{destroy:function(){Array.prototype.forEach.call(v,function(O){O.removeEventListener(m,d)})}}}function T(v,m,d){return _(document.body,v,m,d)}c.exports=p},817:function(c){function u(t){var s;if(t.nodeName==="SELECT")t.focus(),s=t.value;else if(t.nodeName==="INPUT"||t.nodeName==="TEXTAREA"){var _=t.hasAttribute("readonly");_||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),_||t.removeAttribute("readonly"),s=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var p=window.getSelection(),E=document.createRange();E.selectNodeContents(t),p.removeAllRanges(),p.addRange(E),s=p.toString()}return s}c.exports=u},279:function(c){function u(){}u.prototype={on:function(t,s,_){var p=this.e||(this.e={});return(p[t]||(p[t]=[])).push({fn:s,ctx:_}),this},once:function(t,s,_){var p=this;function E(){p.off(t,E),s.apply(_,arguments)}return E._=s,this.on(t,E,_)},emit:function(t){var s=[].slice.call(arguments,1),_=((this.e||(this.e={}))[t]||[]).slice(),p=0,E=_.length;for(p;p<E;p++)_[p].fn.apply(_[p].ctx,s);return this},off:function(t,s){var _=this.e||(this.e={}),p=_[t],E=[];if(p&&s)for(var f=0,T=p.length;f<T;f++)p[f].fn!==s&&p[f].fn._!==s&&E.push(p[f]);return E.length?_[t]=E:delete _[t],this}},c.exports=u,c.exports.TinyEmitter=u}},D={};function y(c){if(D[c])return D[c].exports;var u=D[c]={exports:{}};return I[c](u,u.exports,y),u.exports}return function(){y.n=function(c){var u=c&&c.__esModule?function(){return c.default}:function(){return c};return y.d(u,{a:u}),u}}(),function(){y.d=function(c,u){for(var t in u)y.o(u,t)&&!y.o(c,t)&&Object.defineProperty(c,t,{enumerable:!0,get:u[t]})}}(),function(){y.o=function(c,u){return Object.prototype.hasOwnProperty.call(c,u)}}(),y(686)}().default})})(H);const vt=ot(H.exports),dt=h=>{const L=(h==null?void 0:h.appendToBody)===void 0?!0:h.appendToBody;return{toClipboard(I,D){return new Promise((y,c)=>{const u=document.createElement("button"),t=new vt(u,{text:()=>I,action:()=>"copy",container:D!==void 0?D:document.body});t.on("success",s=>{t.destroy(),y(s)}),t.on("error",s=>{t.destroy(),c(s)}),L&&document.body.appendChild(u),u.click(),L&&document.body.removeChild(u)})}}};function ft(h){const{toClipboard:L}=dt();try{L(h),B.success("\u590D\u5236\u6210\u529F Copy successfully")}catch(I){B.error("\u590D\u5236\u5931\u8D25 Copy failed"+I)}}const b=h=>(at("data-v-8f869751"),h=h(),ct(),h),mt={class:"container"},gt={class:"usage-text"},Et=b(()=>g("b",null,[g("i",null," 'src/components/icon'")],-1)),yt=b(()=>g("b",null,"Icon",-1)),ht=b(()=>g("br",null,null,-1)),bt=b(()=>g("br",null,null,-1)),Tt=b(()=>g("br",null,null,-1)),At=b(()=>g("b",null,[g("i",null,"el-icon-")],-1)),Ot=b(()=>g("b",null,[g("i",null,"svg-")],-1)),Dt=b(()=>g("b",null,[g("i",null,"'src/assets/icons/svg'")],-1)),Lt=b(()=>g("br",null,null,-1)),It=b(()=>g("br",null,null,-1)),Pt=b(()=>g("b",null,"example: ",-1)),Rt=b(()=>g("br",null,null,-1)),Vt=b(()=>g("pre",null,'<Icon name="svg-chart" size="15px" color="#00aadf"></Icon>',-1)),xt={class:"grid"},Ct=["onClick"],St=rt({__name:"icons",setup(h){const L=nt([]);st(()=>{I()});const I=()=>{const c=Object.assign({"../../assets/icons/svg/404.svg":()=>o(()=>import("./404.b46c7eb9.js"),[],import.meta.url),"../../assets/icons/svg/bug.svg":()=>o(()=>import("./bug.c2b901ab.js"),[],import.meta.url),"../../assets/icons/svg/chain.svg":()=>o(()=>import("./chain.a69aefbd.js"),[],import.meta.url),"../../assets/icons/svg/chart.svg":()=>o(()=>import("./chart.47c5fc09.js"),[],import.meta.url),"../../assets/icons/svg/clipboard.svg":()=>o(()=>import("./clipboard.4cb84a95.js"),[],import.meta.url),"../../assets/icons/svg/component.svg":()=>o(()=>import("./component.742535b9.js"),[],import.meta.url),"../../assets/icons/svg/cooperation.svg":()=>o(()=>import("./cooperation.e6af2d0d.js"),[],import.meta.url),"../../assets/icons/svg/dashboard.svg":()=>o(()=>import("./dashboard.1cdb26b4.js"),[],import.meta.url),"../../assets/icons/svg/documentation.svg":()=>o(()=>import("./documentation.a5f1c591.js"),[],import.meta.url),"../../assets/icons/svg/drag.svg":()=>o(()=>import("./drag.855f09b1.js"),[],import.meta.url),"../../assets/icons/svg/edit.svg":()=>o(()=>import("./edit.6138f7bd.js"),[],import.meta.url),"../../assets/icons/svg/education.svg":()=>o(()=>import("./education.9cdfc09c.js"),[],import.meta.url),"../../assets/icons/svg/email.svg":()=>o(()=>import("./email.6177a1b7.js"),[],import.meta.url),"../../assets/icons/svg/enter.svg":()=>o(()=>import("./enter.0a5d2d66.js"),[],import.meta.url),"../../assets/icons/svg/example.svg":()=>o(()=>import("./example.28eb468e.js"),[],import.meta.url),"../../assets/icons/svg/excel.svg":()=>o(()=>import("./excel.9680a7a3.js"),[],import.meta.url),"../../assets/icons/svg/exit-fullscreen.svg":()=>o(()=>import("./exit-fullscreen.7693107c.js"),[],import.meta.url),"../../assets/icons/svg/eye-open.svg":()=>o(()=>import("./eye-open.2742c814.js"),[],import.meta.url),"../../assets/icons/svg/eye.svg":()=>o(()=>import("./eye.7efea8d7.js"),[],import.meta.url),"../../assets/icons/svg/form.svg":()=>o(()=>import("./form.fe6029ff.js"),[],import.meta.url),"../../assets/icons/svg/fullscreen.svg":()=>o(()=>import("./fullscreen.181ef4f1.js"),[],import.meta.url),"../../assets/icons/svg/goods-checked.svg":()=>o(()=>import("./goods-checked.201a1aa7.js"),[],import.meta.url),"../../assets/icons/svg/guide.svg":()=>o(()=>import("./guide.40474b41.js"),[],import.meta.url),"../../assets/icons/svg/icon.svg":()=>o(()=>import("./icon.2d1c0100.js"),[],import.meta.url),"../../assets/icons/svg/in-storage.svg":()=>o(()=>import("./in-storage.2390afd3.js"),[],import.meta.url),"../../assets/icons/svg/inspect.svg":()=>o(()=>import("./inspect.36c8071a.js"),[],import.meta.url),"../../assets/icons/svg/international.svg":()=>o(()=>import("./international.7ee45404.js"),[],import.meta.url),"../../assets/icons/svg/language.svg":()=>o(()=>import("./language.443cf574.js"),[],import.meta.url),"../../assets/icons/svg/link.svg":()=>o(()=>import("./link.64f798fb.js"),[],import.meta.url),"../../assets/icons/svg/list.svg":()=>o(()=>import("./list.88f483cb.js"),[],import.meta.url),"../../assets/icons/svg/lock.svg":()=>o(()=>import("./lock.b3970863.js"),[],import.meta.url),"../../assets/icons/svg/message.svg":()=>o(()=>import("./message.082e45f4.js"),[],import.meta.url),"../../assets/icons/svg/money.svg":()=>o(()=>import("./money.1bcf65d6.js"),[],import.meta.url),"../../assets/icons/svg/nested.svg":()=>o(()=>import("./nested.0325dcc4.js"),[],import.meta.url),"../../assets/icons/svg/outbound.svg":()=>o(()=>import("./outbound.0d2b551b.js"),[],import.meta.url),"../../assets/icons/svg/password.svg":()=>o(()=>import("./password.b44da77b.js"),[],import.meta.url),"../../assets/icons/svg/pdf.svg":()=>o(()=>import("./pdf.53cff26e.js"),[],import.meta.url),"../../assets/icons/svg/people.svg":()=>o(()=>import("./people.87963c2b.js"),[],import.meta.url),"../../assets/icons/svg/peoples.svg":()=>o(()=>import("./peoples.0e6279eb.js"),[],import.meta.url),"../../assets/icons/svg/qq.svg":()=>o(()=>import("./qq.74ce5ed3.js"),[],import.meta.url),"../../assets/icons/svg/save-fill.svg":()=>o(()=>import("./save-fill.80b0373e.js"),[],import.meta.url),"../../assets/icons/svg/search.svg":()=>o(()=>import("./search.33b822fc.js"),[],import.meta.url),"../../assets/icons/svg/shopping.svg":()=>o(()=>import("./shopping.b0e0ebd3.js"),[],import.meta.url),"../../assets/icons/svg/size.svg":()=>o(()=>import("./size.a85972fe.js"),[],import.meta.url),"../../assets/icons/svg/skill.svg":()=>o(()=>import("./skill.bb02a4ac.js"),[],import.meta.url),"../../assets/icons/svg/star.svg":()=>o(()=>import("./star.5374eaaa.js"),[],import.meta.url),"../../assets/icons/svg/tab.svg":()=>o(()=>import("./tab.837765b4.js"),[],import.meta.url),"../../assets/icons/svg/table.svg":()=>o(()=>import("./table.53c6772c.js"),[],import.meta.url),"../../assets/icons/svg/theme.svg":()=>o(()=>import("./theme.988b699a.js"),[],import.meta.url),"../../assets/icons/svg/tree-table.svg":()=>o(()=>import("./tree-table.a57dac2f.js"),[],import.meta.url),"../../assets/icons/svg/tree.svg":()=>o(()=>import("./tree.3a250732.js"),[],import.meta.url),"../../assets/icons/svg/user-info.svg":()=>o(()=>import("./user-info.5e6aebdf.js"),[],import.meta.url),"../../assets/icons/svg/user.svg":()=>o(()=>import("./user.0c7aa22a.js"),[],import.meta.url),"../../assets/icons/svg/wechat.svg":()=>o(()=>import("./wechat.ec3af840.js"),[],import.meta.url),"../../assets/icons/svg/zip.svg":()=>o(()=>import("./zip.fc1b638f.js"),[],import.meta.url)});for(const u in c){const t=u.replace(/(\.\.\/\.\.\/assets\/icons\/svg\/|\.svg)/g,"");L.value.push(t)}},D=c=>`<Icon name="svg-${c}" size="25px" color="#999"></Icon>`,y=c=>{ft(c)};return(c,u)=>{const t=_t;return N(),k("div",mt,[g("section",gt,[P(" \u5728 "),Et,P(" \u4E2D\u5C01\u88C5\u4E86 "),yt,P(" \u7EC4\u4EF6\uFF0C"),ht,P(" \u5E76\u5168\u5C40\u6CE8\u518C\uFF0C\u53EA\u9700\u5728\u6240\u9700\u7684\u5730\u65B9\u76F4\u63A5\u4F7F\u7528\u5E76\u4F20\u5165\u56FE\u6807\u540D\u79F0\uFF0C\u5927\u5C0F\uFF0C\u989C\u8272;"),bt,P(" \u65E0\u8BBA @element-plus/icons-vue \u8FD8\u662F\u81EA\u5B9A\u4E49\u989D\u5916\u62D3\u5C55\u7684 svg \u56FE\u6807,"),Tt,P(" \u4F7F\u7528 @element-plus/icons-vue \u65F6\u9700\u4EE5 "),At,P(" \u4E3A\u524D\u7F00\u6216\u8005\u76F4\u63A5\u9996\u5B57\u6BCD\u5927\u5199\u7684\u56FE\u6807\u540D\u79F0 \u4F7F\u7528 svg \u56FE\u6807\u8D44\u6E90\u9700\u4EE5 "),Ot,P(" \u4E3A\u524D\u7F00\uFF0Csvg \u8D44\u6E90\u6587\u4EF6\u5B58\u653E\u5728 "),Dt,Lt,It,Pt,Rt,z(t,{name:"svg-chart",size:"15px",color:"#00aadf"}),Vt]),g("div",xt,[(N(!0),k(it,null,ut(L.value,s=>(N(),k("div",{key:s,class:"icon-item",onClick:_=>y(D(s))},[z(t,{name:"svg-"+s,size:"25px",color:"#999"},null,8,["name"]),g("span",null,lt(s),1)],8,Ct))),128))])])}}});const kt=pt(St,[["__scopeId","data-v-8f869751"]]);export{kt as default};
