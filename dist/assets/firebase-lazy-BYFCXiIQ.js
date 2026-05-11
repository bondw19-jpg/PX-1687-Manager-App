const dI=function(){const e=typeof document<"u"&&document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),fI=function(n){return"/"+n},Jh={},te=function(e,t,r){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(t.map(u=>{if(u=fI(u),u in Jh)return;Jh[u]=!0;const l=u.endsWith(".css"),d=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":dI,l||(m.as="script"),m.crossOrigin="",m.href=u,c&&m.setAttribute("nonce",c),document.head.appendChild(m),l)return new Promise((g,T)=>{m.addEventListener("load",g),m.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})},Zn="store_1687",mI="bondw19@gmail.com",_t={ADMIN:"admin",MANAGER:"manager",SHIFT_LEAD:"shift_lead"},Uc=[{value:_t.ADMIN,label:"Admin / Main Manager",shortLabel:"Admin",description:"Full access, including settings, backups, restores, and user-role controls.",rank:100},{value:_t.MANAGER,label:"Manager",shortLabel:"Manager",description:"Full daily manager access for current store operations.",rank:80},{value:_t.SHIFT_LEAD,label:"Shift Lead",shortLabel:"Shift Lead",description:"Future limited access for shift-level tools without admin controls.",rank:40}],pI=new Set(Uc.map(n=>n.value));function mn(n,e=""){if(String(e||"").trim().toLowerCase()===mI)return _t.ADMIN;const r=String(n||"").trim().toLowerCase().replace(/[\s-]+/g,"_");return r==="shiftlead"||r==="lead"||r==="shift_leader"?_t.SHIFT_LEAD:r==="store_manager"||r==="assistant_manager"?_t.MANAGER:pI.has(r)?r:_t.MANAGER}function Qf(n,e=""){const t=mn(n,e);return Uc.find(r=>r.value===t)||Uc[1]}function mD(n,e=""){return Qf(n,e).shortLabel}function Or(n,e=null){if(!n)return null;const t={...e||{},...n},r=mn(t.role,t.email),i=Qf(r,t.email);return{...t,role:r,roleLabel:i.label,storeId:t.storeId||Zn,permissionsVersion:1}}function pD(n){return mn(n==null?void 0:n.role,n==null?void 0:n.email)===_t.ADMIN}const gI={VIEW_DASHBOARD:"view_dashboard",MANAGE_ASSOCIATES:"manage_associates",MANAGE_UNIFORMS:"manage_uniforms",MANAGE_NOTES:"manage_notes",MANAGE_TASKS:"manage_tasks",MANAGE_CHECKLISTS:"manage_checklists",MANAGE_SETTINGS:"manage_settings",MANAGE_BACKUPS:"manage_backups",MANAGE_USERS:"manage_users"};_t.ADMIN+"",new Set(Object.values(gI));var Yh={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jf=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},_I=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],o=n[t++],c=n[t++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=n[t++],o=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Yf={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],o=i+1<n.length,c=o?n[i+1]:0,u=i+2<n.length,l=u?n[i+2]:0,d=s>>2,m=(s&3)<<4|c>>4;let g=(c&15)<<2|l>>6,T=l&63;u||(T=64,o||(g=64)),r.push(t[d],t[m],t[g],t[T])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Jf(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):_I(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],c=i<n.length?t[n.charAt(i)]:0;++i;const l=i<n.length?t[n.charAt(i)]:64;++i;const m=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||c==null||l==null||m==null)throw new yI;const g=s<<2|c>>4;if(r.push(g),l!==64){const T=c<<4&240|l>>2;if(r.push(T),m!==64){const w=l<<6&192|m;r.push(w)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class yI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const II=function(n){const e=Jf(n);return Yf.encodeByteArray(e,!0)},qo=function(n){return II(n).replace(/\./g,"")},Xf=function(n){try{return Yf.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TI(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EI=()=>TI().__FIREBASE_DEFAULTS__,vI=()=>{if(typeof process>"u"||typeof Yh>"u")return;const n=Yh.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},wI=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Xf(n[1]);return e&&JSON.parse(e)},ha=()=>{try{return EI()||vI()||wI()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Zf=n=>{var e,t;return(t=(e=ha())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},em=n=>{const e=Zf(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},tm=()=>{var n;return(n=ha())===null||n===void 0?void 0:n.config},nm=n=>{var e;return(e=ha())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AI{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[qo(JSON.stringify(t)),qo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function RI(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ce())}function bI(){var n;const e=(n=ha())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function SI(){return typeof window<"u"||im()}function im(){return typeof WorkerGlobalScope<"u"&&typeof self<"u"&&self instanceof WorkerGlobalScope}function PI(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function CI(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function DI(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function kI(){const n=Ce();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function sm(){return!bI()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function om(){try{return typeof indexedDB=="object"}catch{return!1}}function NI(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VI="FirebaseError";class pt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=VI,Object.setPrototypeOf(this,pt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ss.prototype.create)}}class Ss{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?OI(s,r):"Error",c=`${this.serviceName}: ${o} (${i}).`;return new pt(i,c,r)}}function OI(n,e){return n.replace(xI,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const xI=/\{\$([^}]+)}/g;function LI(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function pn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],o=e[i];if(Xh(s)&&Xh(o)){if(!pn(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function Xh(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ti(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Gi(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function $i(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function MI(n,e){const t=new FI(n,e);return t.subscribe.bind(t)}class FI{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");UI(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Ec),i.error===void 0&&(i.error=Ec),i.complete===void 0&&(i.complete=Ec);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function UI(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ec(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(n){return n&&n._delegate?n._delegate:n}class gn{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BI{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new AI;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(jI(e))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=jn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=jn){return this.instances.has(e)}getOptions(e=jn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);r===c&&o.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:qI(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=jn){return this.component?this.component.multipleInstances?e:jn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function qI(n){return n===jn?void 0:n}function jI(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new BI(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gu=[];var Y;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Y||(Y={}));const cm={debug:Y.DEBUG,verbose:Y.VERBOSE,info:Y.INFO,warn:Y.WARN,error:Y.ERROR,silent:Y.SILENT},zI=Y.INFO,GI={[Y.DEBUG]:"log",[Y.VERBOSE]:"log",[Y.INFO]:"info",[Y.WARN]:"warn",[Y.ERROR]:"error"},$I=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=GI[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class _u{constructor(e){this.name=e,this._logLevel=zI,this._logHandler=$I,this._userLogHandler=null,gu.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Y))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?cm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Y.DEBUG,...e),this._logHandler(this,Y.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Y.VERBOSE,...e),this._logHandler(this,Y.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Y.INFO,...e),this._logHandler(this,Y.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Y.WARN,...e),this._logHandler(this,Y.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Y.ERROR,...e),this._logHandler(this,Y.ERROR,...e)}}function KI(n){gu.forEach(e=>{e.setLogLevel(n)})}function HI(n,e){for(const t of gu){let r=null;e&&e.level&&(r=cm[e.level]),n===null?t.userLogHandler=null:t.userLogHandler=(i,s,...o)=>{const c=o.map(u=>{if(u==null)return null;if(typeof u=="string")return u;if(typeof u=="number"||typeof u=="boolean")return u.toString();if(u instanceof Error)return u.message;try{return JSON.stringify(u)}catch{return null}}).filter(u=>u).join(" ");s>=(r??i.logLevel)&&n({level:Y[s].toLowerCase(),message:c,args:o,type:i.name})}}}const WI=(n,e)=>e.some(t=>n instanceof t);let Zh,ed;function QI(){return Zh||(Zh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function JI(){return ed||(ed=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const um=new WeakMap,Bc=new WeakMap,lm=new WeakMap,vc=new WeakMap,yu=new WeakMap;function YI(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(hn(n.result)),i()},o=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&um.set(t,n)}).catch(()=>{}),yu.set(e,n),e}function XI(n){if(Bc.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});Bc.set(n,e)}let qc={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Bc.get(n);if(e==="objectStoreNames")return n.objectStoreNames||lm.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return hn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ZI(n){qc=n(qc)}function eT(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(wc(this),e,...t);return lm.set(r,e.sort?e.sort():[e]),hn(r)}:JI().includes(n)?function(...e){return n.apply(wc(this),e),hn(um.get(this))}:function(...e){return hn(n.apply(wc(this),e))}}function tT(n){return typeof n=="function"?eT(n):(n instanceof IDBTransaction&&XI(n),WI(n,QI())?new Proxy(n,qc):n)}function hn(n){if(n instanceof IDBRequest)return YI(n);if(vc.has(n))return vc.get(n);const e=tT(n);return e!==n&&(vc.set(n,e),yu.set(e,n)),e}const wc=n=>yu.get(n);function nT(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(n,e),c=hn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(hn(o.result),u.oldVersion,u.newVersion,hn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const rT=["get","getKey","getAll","getAllKeys","count"],iT=["put","add","delete","clear"],Ac=new Map;function td(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ac.get(e))return Ac.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=iT.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||rT.includes(t)))return;const s=async function(o,...c){const u=this.transaction(o,i?"readwrite":"readonly");let l=u.store;return r&&(l=l.index(c.shift())),(await Promise.all([l[t](...c),i&&u.done]))[0]};return Ac.set(e,s),s}ZI(n=>({...n,get:(e,t,r)=>td(e,t)||n.get(e,t,r),has:(e,t)=>!!td(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(oT(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function oT(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const jo="@firebase/app",jc="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut=new _u("@firebase/app"),aT="@firebase/app-compat",cT="@firebase/analytics-compat",uT="@firebase/analytics",lT="@firebase/app-check-compat",hT="@firebase/app-check",dT="@firebase/auth",fT="@firebase/auth-compat",mT="@firebase/database",pT="@firebase/data-connect",gT="@firebase/database-compat",_T="@firebase/functions",yT="@firebase/functions-compat",IT="@firebase/installations",TT="@firebase/installations-compat",ET="@firebase/messaging",vT="@firebase/messaging-compat",wT="@firebase/performance",AT="@firebase/performance-compat",RT="@firebase/remote-config",bT="@firebase/remote-config-compat",ST="@firebase/storage",PT="@firebase/storage-compat",CT="@firebase/firestore",DT="@firebase/vertexai-preview",kT="@firebase/firestore-compat",NT="firebase",VT="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ls="[DEFAULT]",OT={[jo]:"fire-core",[aT]:"fire-core-compat",[uT]:"fire-analytics",[cT]:"fire-analytics-compat",[hT]:"fire-app-check",[lT]:"fire-app-check-compat",[dT]:"fire-auth",[fT]:"fire-auth-compat",[mT]:"fire-rtdb",[pT]:"fire-data-connect",[gT]:"fire-rtdb-compat",[_T]:"fire-fn",[yT]:"fire-fn-compat",[IT]:"fire-iid",[TT]:"fire-iid-compat",[ET]:"fire-fcm",[vT]:"fire-fcm-compat",[wT]:"fire-perf",[AT]:"fire-perf-compat",[RT]:"fire-rc",[bT]:"fire-rc-compat",[ST]:"fire-gcs",[PT]:"fire-gcs-compat",[CT]:"fire-fst",[kT]:"fire-fst-compat",[DT]:"fire-vertex","fire-js":"fire-js",[NT]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=new Map,xr=new Map,Lr=new Map;function zc(n,e){try{n.container.addComponent(e)}catch(t){Ut.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function xT(n,e){n.container.addOrOverwriteComponent(e)}function yn(n){const e=n.name;if(Lr.has(e))return Ut.debug(`There were multiple attempts to register component ${e}.`),!1;Lr.set(e,n);for(const t of _n.values())zc(t,n);for(const t of xr.values())zc(t,n);return!0}function lr(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function hm(n,e,t=ls){lr(n,e).clearInstance(t)}function dm(n){return n.options!==void 0}function ve(n){return n.settings!==void 0}function LT(){Lr.clear()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ut=new Ss("app","Firebase",MT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new gn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ut.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FT extends fm{constructor(e,t,r,i){const s=t.automaticDataCollectionEnabled!==void 0?t.automaticDataCollectionEnabled:!1,o={name:r,automaticDataCollectionEnabled:s};if(e.apiKey!==void 0)super(e,o,i);else{const c=e;super(c.options,o,i)}this._serverConfig=Object.assign({automaticDataCollectionEnabled:s},t),this._finalizationRegistry=null,typeof FinalizationRegistry<"u"&&(this._finalizationRegistry=new FinalizationRegistry(()=>{this.automaticCleanup()})),this._refCount=0,this.incRefCount(this._serverConfig.releaseOnDeref),this._serverConfig.releaseOnDeref=void 0,t.releaseOnDeref=void 0,lt(jo,jc,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(e){this.isDeleted||(this._refCount++,e!==void 0&&this._finalizationRegistry!==null&&this._finalizationRegistry.register(e,this))}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){pm(this)}get settings(){return this.checkDestroyed(),this._serverConfig}checkDestroyed(){if(this.isDeleted)throw ut.create("server-app-deleted")}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pn=VT;function mm(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ls,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw ut.create("bad-app-name",{appName:String(i)});if(t||(t=tm()),!t)throw ut.create("no-options");const s=_n.get(i);if(s){if(pn(t,s.options)&&pn(r,s.config))return s;throw ut.create("duplicate-app",{appName:i})}const o=new am(i);for(const u of Lr.values())o.addComponent(u);const c=new fm(t,r,o);return _n.set(i,c),c}function UT(n,e){if(SI()&&!im())throw ut.create("invalid-server-app-environment");e.automaticDataCollectionEnabled===void 0&&(e.automaticDataCollectionEnabled=!1);let t;dm(n)?t=n.options:t=n;const r=Object.assign(Object.assign({},e),t);r.releaseOnDeref!==void 0&&delete r.releaseOnDeref;const i=l=>[...l].reduce((d,m)=>Math.imul(31,d)+m.charCodeAt(0)|0,0);if(e.releaseOnDeref!==void 0&&typeof FinalizationRegistry>"u")throw ut.create("finalization-registry-not-supported",{});const s=""+i(JSON.stringify(r)),o=xr.get(s);if(o)return o.incRefCount(e.releaseOnDeref),o;const c=new am(s);for(const l of Lr.values())c.addComponent(l);const u=new FT(t,e,s,c);return xr.set(s,u),u}function da(n=ls){const e=_n.get(n);if(!e&&n===ls&&tm())return mm();if(!e)throw ut.create("no-app",{appName:n});return e}function BT(){return Array.from(_n.values())}async function pm(n){let e=!1;const t=n.name;_n.has(t)?(e=!0,_n.delete(t)):xr.has(t)&&n.decRefCount()<=0&&(xr.delete(t),e=!0),e&&(await Promise.all(n.container.getProviders().map(r=>r.delete())),n.isDeleted=!0)}function lt(n,e,t){var r;let i=(r=OT[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&c.push("and"),o&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ut.warn(c.join(" "));return}yn(new gn(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}function qT(n,e){if(n!==null&&typeof n!="function")throw ut.create("invalid-log-argument");HI(n,e)}function jT(n){KI(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zT="firebase-heartbeat-database",GT=1,hs="firebase-heartbeat-store";let Rc=null;function gm(){return Rc||(Rc=nT(zT,GT,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(hs)}catch(t){console.warn(t)}}}}).catch(n=>{throw ut.create("idb-open",{originalErrorMessage:n.message})})),Rc}async function $T(n){try{const t=(await gm()).transaction(hs),r=await t.objectStore(hs).get(_m(n));return await t.done,r}catch(e){if(e instanceof pt)Ut.warn(e.message);else{const t=ut.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ut.warn(t.message)}}}async function nd(n,e){try{const r=(await gm()).transaction(hs,"readwrite");await r.objectStore(hs).put(e,_m(n)),await r.done}catch(t){if(t instanceof pt)Ut.warn(t.message);else{const r=ut.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Ut.warn(r.message)}}}function _m(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KT=1024,HT=30*24*60*60*1e3;class WT{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new JT(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=rd();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const c=new Date(o.date).valueOf();return Date.now()-c<=HT}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Ut.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=rd(),{heartbeatsToSend:r,unsentEntries:i}=QT(this._heartbeatsCache.heartbeats),s=qo(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Ut.warn(t),""}}}function rd(){return new Date().toISOString().substring(0,10)}function QT(n,e=KT){const t=[];let r=n.slice();for(const i of n){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),id(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),id(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class JT{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return om()?NI().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await $T(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return nd(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return nd(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function id(n){return qo(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YT(n){yn(new gn("platform-logger",e=>new sT(e),"PRIVATE")),yn(new gn("heartbeat",e=>new WT(e),"PRIVATE")),lt(jo,jc,n),lt(jo,jc,"esm2017"),lt("fire-js","")}YT("");var sd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Qn,ym;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,_){function y(){}y.prototype=_.prototype,E.D=_.prototype,E.prototype=new y,E.prototype.constructor=E,E.C=function(v,A,S){for(var I=Array(arguments.length-2),St=2;St<arguments.length;St++)I[St-2]=arguments[St];return _.prototype[A].apply(v,I)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,_,y){y||(y=0);var v=Array(16);if(typeof _=="string")for(var A=0;16>A;++A)v[A]=_.charCodeAt(y++)|_.charCodeAt(y++)<<8|_.charCodeAt(y++)<<16|_.charCodeAt(y++)<<24;else for(A=0;16>A;++A)v[A]=_[y++]|_[y++]<<8|_[y++]<<16|_[y++]<<24;_=E.g[0],y=E.g[1],A=E.g[2];var S=E.g[3],I=_+(S^y&(A^S))+v[0]+3614090360&4294967295;_=y+(I<<7&4294967295|I>>>25),I=S+(A^_&(y^A))+v[1]+3905402710&4294967295,S=_+(I<<12&4294967295|I>>>20),I=A+(y^S&(_^y))+v[2]+606105819&4294967295,A=S+(I<<17&4294967295|I>>>15),I=y+(_^A&(S^_))+v[3]+3250441966&4294967295,y=A+(I<<22&4294967295|I>>>10),I=_+(S^y&(A^S))+v[4]+4118548399&4294967295,_=y+(I<<7&4294967295|I>>>25),I=S+(A^_&(y^A))+v[5]+1200080426&4294967295,S=_+(I<<12&4294967295|I>>>20),I=A+(y^S&(_^y))+v[6]+2821735955&4294967295,A=S+(I<<17&4294967295|I>>>15),I=y+(_^A&(S^_))+v[7]+4249261313&4294967295,y=A+(I<<22&4294967295|I>>>10),I=_+(S^y&(A^S))+v[8]+1770035416&4294967295,_=y+(I<<7&4294967295|I>>>25),I=S+(A^_&(y^A))+v[9]+2336552879&4294967295,S=_+(I<<12&4294967295|I>>>20),I=A+(y^S&(_^y))+v[10]+4294925233&4294967295,A=S+(I<<17&4294967295|I>>>15),I=y+(_^A&(S^_))+v[11]+2304563134&4294967295,y=A+(I<<22&4294967295|I>>>10),I=_+(S^y&(A^S))+v[12]+1804603682&4294967295,_=y+(I<<7&4294967295|I>>>25),I=S+(A^_&(y^A))+v[13]+4254626195&4294967295,S=_+(I<<12&4294967295|I>>>20),I=A+(y^S&(_^y))+v[14]+2792965006&4294967295,A=S+(I<<17&4294967295|I>>>15),I=y+(_^A&(S^_))+v[15]+1236535329&4294967295,y=A+(I<<22&4294967295|I>>>10),I=_+(A^S&(y^A))+v[1]+4129170786&4294967295,_=y+(I<<5&4294967295|I>>>27),I=S+(y^A&(_^y))+v[6]+3225465664&4294967295,S=_+(I<<9&4294967295|I>>>23),I=A+(_^y&(S^_))+v[11]+643717713&4294967295,A=S+(I<<14&4294967295|I>>>18),I=y+(S^_&(A^S))+v[0]+3921069994&4294967295,y=A+(I<<20&4294967295|I>>>12),I=_+(A^S&(y^A))+v[5]+3593408605&4294967295,_=y+(I<<5&4294967295|I>>>27),I=S+(y^A&(_^y))+v[10]+38016083&4294967295,S=_+(I<<9&4294967295|I>>>23),I=A+(_^y&(S^_))+v[15]+3634488961&4294967295,A=S+(I<<14&4294967295|I>>>18),I=y+(S^_&(A^S))+v[4]+3889429448&4294967295,y=A+(I<<20&4294967295|I>>>12),I=_+(A^S&(y^A))+v[9]+568446438&4294967295,_=y+(I<<5&4294967295|I>>>27),I=S+(y^A&(_^y))+v[14]+3275163606&4294967295,S=_+(I<<9&4294967295|I>>>23),I=A+(_^y&(S^_))+v[3]+4107603335&4294967295,A=S+(I<<14&4294967295|I>>>18),I=y+(S^_&(A^S))+v[8]+1163531501&4294967295,y=A+(I<<20&4294967295|I>>>12),I=_+(A^S&(y^A))+v[13]+2850285829&4294967295,_=y+(I<<5&4294967295|I>>>27),I=S+(y^A&(_^y))+v[2]+4243563512&4294967295,S=_+(I<<9&4294967295|I>>>23),I=A+(_^y&(S^_))+v[7]+1735328473&4294967295,A=S+(I<<14&4294967295|I>>>18),I=y+(S^_&(A^S))+v[12]+2368359562&4294967295,y=A+(I<<20&4294967295|I>>>12),I=_+(y^A^S)+v[5]+4294588738&4294967295,_=y+(I<<4&4294967295|I>>>28),I=S+(_^y^A)+v[8]+2272392833&4294967295,S=_+(I<<11&4294967295|I>>>21),I=A+(S^_^y)+v[11]+1839030562&4294967295,A=S+(I<<16&4294967295|I>>>16),I=y+(A^S^_)+v[14]+4259657740&4294967295,y=A+(I<<23&4294967295|I>>>9),I=_+(y^A^S)+v[1]+2763975236&4294967295,_=y+(I<<4&4294967295|I>>>28),I=S+(_^y^A)+v[4]+1272893353&4294967295,S=_+(I<<11&4294967295|I>>>21),I=A+(S^_^y)+v[7]+4139469664&4294967295,A=S+(I<<16&4294967295|I>>>16),I=y+(A^S^_)+v[10]+3200236656&4294967295,y=A+(I<<23&4294967295|I>>>9),I=_+(y^A^S)+v[13]+681279174&4294967295,_=y+(I<<4&4294967295|I>>>28),I=S+(_^y^A)+v[0]+3936430074&4294967295,S=_+(I<<11&4294967295|I>>>21),I=A+(S^_^y)+v[3]+3572445317&4294967295,A=S+(I<<16&4294967295|I>>>16),I=y+(A^S^_)+v[6]+76029189&4294967295,y=A+(I<<23&4294967295|I>>>9),I=_+(y^A^S)+v[9]+3654602809&4294967295,_=y+(I<<4&4294967295|I>>>28),I=S+(_^y^A)+v[12]+3873151461&4294967295,S=_+(I<<11&4294967295|I>>>21),I=A+(S^_^y)+v[15]+530742520&4294967295,A=S+(I<<16&4294967295|I>>>16),I=y+(A^S^_)+v[2]+3299628645&4294967295,y=A+(I<<23&4294967295|I>>>9),I=_+(A^(y|~S))+v[0]+4096336452&4294967295,_=y+(I<<6&4294967295|I>>>26),I=S+(y^(_|~A))+v[7]+1126891415&4294967295,S=_+(I<<10&4294967295|I>>>22),I=A+(_^(S|~y))+v[14]+2878612391&4294967295,A=S+(I<<15&4294967295|I>>>17),I=y+(S^(A|~_))+v[5]+4237533241&4294967295,y=A+(I<<21&4294967295|I>>>11),I=_+(A^(y|~S))+v[12]+1700485571&4294967295,_=y+(I<<6&4294967295|I>>>26),I=S+(y^(_|~A))+v[3]+2399980690&4294967295,S=_+(I<<10&4294967295|I>>>22),I=A+(_^(S|~y))+v[10]+4293915773&4294967295,A=S+(I<<15&4294967295|I>>>17),I=y+(S^(A|~_))+v[1]+2240044497&4294967295,y=A+(I<<21&4294967295|I>>>11),I=_+(A^(y|~S))+v[8]+1873313359&4294967295,_=y+(I<<6&4294967295|I>>>26),I=S+(y^(_|~A))+v[15]+4264355552&4294967295,S=_+(I<<10&4294967295|I>>>22),I=A+(_^(S|~y))+v[6]+2734768916&4294967295,A=S+(I<<15&4294967295|I>>>17),I=y+(S^(A|~_))+v[13]+1309151649&4294967295,y=A+(I<<21&4294967295|I>>>11),I=_+(A^(y|~S))+v[4]+4149444226&4294967295,_=y+(I<<6&4294967295|I>>>26),I=S+(y^(_|~A))+v[11]+3174756917&4294967295,S=_+(I<<10&4294967295|I>>>22),I=A+(_^(S|~y))+v[2]+718787259&4294967295,A=S+(I<<15&4294967295|I>>>17),I=y+(S^(A|~_))+v[9]+3951481745&4294967295,E.g[0]=E.g[0]+_&4294967295,E.g[1]=E.g[1]+(A+(I<<21&4294967295|I>>>11))&4294967295,E.g[2]=E.g[2]+A&4294967295,E.g[3]=E.g[3]+S&4294967295}r.prototype.u=function(E,_){_===void 0&&(_=E.length);for(var y=_-this.blockSize,v=this.B,A=this.h,S=0;S<_;){if(A==0)for(;S<=y;)i(this,E,S),S+=this.blockSize;if(typeof E=="string"){for(;S<_;)if(v[A++]=E.charCodeAt(S++),A==this.blockSize){i(this,v),A=0;break}}else for(;S<_;)if(v[A++]=E[S++],A==this.blockSize){i(this,v),A=0;break}}this.h=A,this.o+=_},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var _=1;_<E.length-8;++_)E[_]=0;var y=8*this.o;for(_=E.length-8;_<E.length;++_)E[_]=y&255,y/=256;for(this.u(E),E=Array(16),_=y=0;4>_;++_)for(var v=0;32>v;v+=8)E[y++]=this.g[_]>>>v&255;return E};function s(E,_){var y=c;return Object.prototype.hasOwnProperty.call(y,E)?y[E]:y[E]=_(E)}function o(E,_){this.h=_;for(var y=[],v=!0,A=E.length-1;0<=A;A--){var S=E[A]|0;v&&S==_||(y[A]=S,v=!1)}this.g=y}var c={};function u(E){return-128<=E&&128>E?s(E,function(_){return new o([_|0],0>_?-1:0)}):new o([E|0],0>E?-1:0)}function l(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return P(l(-E));for(var _=[],y=1,v=0;E>=y;v++)_[v]=E/y|0,y*=4294967296;return new o(_,0)}function d(E,_){if(E.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(E.charAt(0)=="-")return P(d(E.substring(1),_));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=l(Math.pow(_,8)),v=m,A=0;A<E.length;A+=8){var S=Math.min(8,E.length-A),I=parseInt(E.substring(A,A+S),_);8>S?(S=l(Math.pow(_,S)),v=v.j(S).add(l(I))):(v=v.j(y),v=v.add(l(I)))}return v}var m=u(0),g=u(1),T=u(16777216);n=o.prototype,n.m=function(){if(D(this))return-P(this).m();for(var E=0,_=1,y=0;y<this.g.length;y++){var v=this.i(y);E+=(0<=v?v:4294967296+v)*_,_*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(w(this))return"0";if(D(this))return"-"+P(this).toString(E);for(var _=l(Math.pow(E,6)),y=this,v="";;){var A=G(y,_).g;y=x(y,A.j(_));var S=((0<y.g.length?y.g[0]:y.h)>>>0).toString(E);if(y=A,w(y))return S+v;for(;6>S.length;)S="0"+S;v=S+v}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function w(E){if(E.h!=0)return!1;for(var _=0;_<E.g.length;_++)if(E.g[_]!=0)return!1;return!0}function D(E){return E.h==-1}n.l=function(E){return E=x(this,E),D(E)?-1:w(E)?0:1};function P(E){for(var _=E.g.length,y=[],v=0;v<_;v++)y[v]=~E.g[v];return new o(y,~E.h).add(g)}n.abs=function(){return D(this)?P(this):this},n.add=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],v=0,A=0;A<=_;A++){var S=v+(this.i(A)&65535)+(E.i(A)&65535),I=(S>>>16)+(this.i(A)>>>16)+(E.i(A)>>>16);v=I>>>16,S&=65535,I&=65535,y[A]=I<<16|S}return new o(y,y[y.length-1]&-2147483648?-1:0)};function x(E,_){return E.add(P(_))}n.j=function(E){if(w(this)||w(E))return m;if(D(this))return D(E)?P(this).j(P(E)):P(P(this).j(E));if(D(E))return P(this.j(P(E)));if(0>this.l(T)&&0>E.l(T))return l(this.m()*E.m());for(var _=this.g.length+E.g.length,y=[],v=0;v<2*_;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var A=0;A<E.g.length;A++){var S=this.i(v)>>>16,I=this.i(v)&65535,St=E.i(A)>>>16,Ti=E.i(A)&65535;y[2*v+2*A]+=I*Ti,M(y,2*v+2*A),y[2*v+2*A+1]+=S*Ti,M(y,2*v+2*A+1),y[2*v+2*A+1]+=I*St,M(y,2*v+2*A+1),y[2*v+2*A+2]+=S*St,M(y,2*v+2*A+2)}for(v=0;v<_;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=_;v<2*_;v++)y[v]=0;return new o(y,0)};function M(E,_){for(;(E[_]&65535)!=E[_];)E[_+1]+=E[_]>>>16,E[_]&=65535,_++}function O(E,_){this.g=E,this.h=_}function G(E,_){if(w(_))throw Error("division by zero");if(w(E))return new O(m,m);if(D(E))return _=G(P(E),_),new O(P(_.g),P(_.h));if(D(_))return _=G(E,P(_)),new O(P(_.g),_.h);if(30<E.g.length){if(D(E)||D(_))throw Error("slowDivide_ only works with positive integers.");for(var y=g,v=_;0>=v.l(E);)y=W(y),v=W(v);var A=$(y,1),S=$(v,1);for(v=$(v,2),y=$(y,2);!w(v);){var I=S.add(v);0>=I.l(E)&&(A=A.add(y),S=I),v=$(v,1),y=$(y,1)}return _=x(E,A.j(_)),new O(A,_)}for(A=m;0<=E.l(_);){for(y=Math.max(1,Math.floor(E.m()/_.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),S=l(y),I=S.j(_);D(I)||0<I.l(E);)y-=v,S=l(y),I=S.j(_);w(S)&&(S=g),A=A.add(S),E=x(E,I)}return new O(A,E)}n.A=function(E){return G(this,E).h},n.and=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],v=0;v<_;v++)y[v]=this.i(v)&E.i(v);return new o(y,this.h&E.h)},n.or=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],v=0;v<_;v++)y[v]=this.i(v)|E.i(v);return new o(y,this.h|E.h)},n.xor=function(E){for(var _=Math.max(this.g.length,E.g.length),y=[],v=0;v<_;v++)y[v]=this.i(v)^E.i(v);return new o(y,this.h^E.h)};function W(E){for(var _=E.g.length+1,y=[],v=0;v<_;v++)y[v]=E.i(v)<<1|E.i(v-1)>>>31;return new o(y,E.h)}function $(E,_){var y=_>>5;_%=32;for(var v=E.g.length-y,A=[],S=0;S<v;S++)A[S]=0<_?E.i(S+y)>>>_|E.i(S+y+1)<<32-_:E.i(S+y);return new o(A,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,ym=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=d,Qn=o}).apply(typeof sd<"u"?sd:typeof self<"u"?self:typeof window<"u"?window:{});var po=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Im,Ki,Tm,bo,Gc,Em,vm,wm;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,h,f){return a==Array.prototype||a==Object.prototype||(a[h]=f.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof po=="object"&&po];for(var h=0;h<a.length;++h){var f=a[h];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=t(this);function i(a,h){if(h)e:{var f=r;a=a.split(".");for(var p=0;p<a.length-1;p++){var b=a[p];if(!(b in f))break e;f=f[b]}a=a[a.length-1],p=f[a],h=h(p),h!=p&&h!=null&&e(f,a,{configurable:!0,writable:!0,value:h})}}function s(a,h){a instanceof String&&(a+="");var f=0,p=!1,b={next:function(){if(!p&&f<a.length){var k=f++;return{value:h(k,a[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}i("Array.prototype.values",function(a){return a||function(){return s(this,function(h,f){return f})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},c=this||self;function u(a){var h=typeof a;return h=h!="object"?h:a?Array.isArray(a)?"array":h:"null",h=="array"||h=="object"&&typeof a.length=="number"}function l(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function d(a,h,f){return a.call.apply(a.bind,arguments)}function m(a,h,f){if(!a)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,p),a.apply(h,b)}}return function(){return a.apply(h,arguments)}}function g(a,h,f){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:m,g.apply(null,arguments)}function T(a,h){var f=Array.prototype.slice.call(arguments,1);return function(){var p=f.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function w(a,h){function f(){}f.prototype=h.prototype,a.aa=h.prototype,a.prototype=new f,a.prototype.constructor=a,a.Qb=function(p,b,k){for(var U=Array(arguments.length-2),oe=2;oe<arguments.length;oe++)U[oe-2]=arguments[oe];return h.prototype[b].apply(p,U)}}function D(a){const h=a.length;if(0<h){const f=Array(h);for(let p=0;p<h;p++)f[p]=a[p];return f}return[]}function P(a,h){for(let f=1;f<arguments.length;f++){const p=arguments[f];if(u(p)){const b=a.length||0,k=p.length||0;a.length=b+k;for(let U=0;U<k;U++)a[b+U]=p[U]}else a.push(p)}}class x{constructor(h,f){this.i=h,this.j=f,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function M(a){return/^[\s\xa0]*$/.test(a)}function O(){var a=c.navigator;return a&&(a=a.userAgent)?a:""}function G(a){return G[" "](a),a}G[" "]=function(){};var W=O().indexOf("Gecko")!=-1&&!(O().toLowerCase().indexOf("webkit")!=-1&&O().indexOf("Edge")==-1)&&!(O().indexOf("Trident")!=-1||O().indexOf("MSIE")!=-1)&&O().indexOf("Edge")==-1;function $(a,h,f){for(const p in a)h.call(f,a[p],p,a)}function E(a,h){for(const f in a)h.call(void 0,a[f],f,a)}function _(a){const h={};for(const f in a)h[f]=a[f];return h}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(a,h){let f,p;for(let b=1;b<arguments.length;b++){p=arguments[b];for(f in p)a[f]=p[f];for(let k=0;k<y.length;k++)f=y[k],Object.prototype.hasOwnProperty.call(p,f)&&(a[f]=p[f])}}function A(a){var h=1;a=a.split(":");const f=[];for(;0<h&&a.length;)f.push(a.shift()),h--;return a.length&&f.push(a.join(":")),f}function S(a){c.setTimeout(()=>{throw a},0)}function I(){var a=Ya;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class St{constructor(){this.h=this.g=null}add(h,f){const p=Ti.get();p.set(h,f),this.h?this.h.next=p:this.g=p,this.h=p}}var Ti=new x(()=>new ky,a=>a.reset());class ky{constructor(){this.next=this.g=this.h=null}set(h,f){this.h=h,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Ei,vi=!1,Ya=new St,Jl=()=>{const a=c.Promise.resolve(void 0);Ei=()=>{a.then(Ny)}};var Ny=()=>{for(var a;a=I();){try{a.h.call(a.g)}catch(f){S(f)}var h=Ti;h.j(a),100>h.h&&(h.h++,a.next=h.g,h.g=a)}vi=!1};function Yt(){this.s=this.s,this.C=this.C}Yt.prototype.s=!1,Yt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Yt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ue(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}Ue.prototype.h=function(){this.defaultPrevented=!0};var Vy=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};c.addEventListener("test",f,h),c.removeEventListener("test",f,h)}catch{}return a}();function wi(a,h){if(Ue.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var f=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget){if(W){e:{try{G(h.nodeName);var b=!0;break e}catch{}b=!1}b||(h=null)}}else f=="mouseover"?h=a.fromElement:f=="mouseout"&&(h=a.toElement);this.relatedTarget=h,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Oy[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&wi.aa.h.call(this)}}w(wi,Ue);var Oy={2:"touch",3:"pen",4:"mouse"};wi.prototype.h=function(){wi.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Qs="closure_listenable_"+(1e6*Math.random()|0),xy=0;function Ly(a,h,f,p,b){this.listener=a,this.proxy=null,this.src=h,this.type=f,this.capture=!!p,this.ha=b,this.key=++xy,this.da=this.fa=!1}function Js(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Ys(a){this.src=a,this.g={},this.h=0}Ys.prototype.add=function(a,h,f,p,b){var k=a.toString();a=this.g[k],a||(a=this.g[k]=[],this.h++);var U=Za(a,h,p,b);return-1<U?(h=a[U],f||(h.fa=!1)):(h=new Ly(h,this.src,k,!!p,b),h.fa=f,a.push(h)),h};function Xa(a,h){var f=h.type;if(f in a.g){var p=a.g[f],b=Array.prototype.indexOf.call(p,h,void 0),k;(k=0<=b)&&Array.prototype.splice.call(p,b,1),k&&(Js(h),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Za(a,h,f,p){for(var b=0;b<a.length;++b){var k=a[b];if(!k.da&&k.listener==h&&k.capture==!!f&&k.ha==p)return b}return-1}var ec="closure_lm_"+(1e6*Math.random()|0),tc={};function Yl(a,h,f,p,b){if(Array.isArray(h)){for(var k=0;k<h.length;k++)Yl(a,h[k],f,p,b);return null}return f=eh(f),a&&a[Qs]?a.K(h,f,l(p)?!!p.capture:!1,b):My(a,h,f,!1,p,b)}function My(a,h,f,p,b,k){if(!h)throw Error("Invalid event type");var U=l(b)?!!b.capture:!!b,oe=rc(a);if(oe||(a[ec]=oe=new Ys(a)),f=oe.add(h,f,p,U,k),f.proxy)return f;if(p=Fy(),f.proxy=p,p.src=a,p.listener=f,a.addEventListener)Vy||(b=U),b===void 0&&(b=!1),a.addEventListener(h.toString(),p,b);else if(a.attachEvent)a.attachEvent(Zl(h.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Fy(){function a(f){return h.call(a.src,a.listener,f)}const h=Uy;return a}function Xl(a,h,f,p,b){if(Array.isArray(h))for(var k=0;k<h.length;k++)Xl(a,h[k],f,p,b);else p=l(p)?!!p.capture:!!p,f=eh(f),a&&a[Qs]?(a=a.i,h=String(h).toString(),h in a.g&&(k=a.g[h],f=Za(k,f,p,b),-1<f&&(Js(k[f]),Array.prototype.splice.call(k,f,1),k.length==0&&(delete a.g[h],a.h--)))):a&&(a=rc(a))&&(h=a.g[h.toString()],a=-1,h&&(a=Za(h,f,p,b)),(f=-1<a?h[a]:null)&&nc(f))}function nc(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[Qs])Xa(h.i,a);else{var f=a.type,p=a.proxy;h.removeEventListener?h.removeEventListener(f,p,a.capture):h.detachEvent?h.detachEvent(Zl(f),p):h.addListener&&h.removeListener&&h.removeListener(p),(f=rc(h))?(Xa(f,a),f.h==0&&(f.src=null,h[ec]=null)):Js(a)}}}function Zl(a){return a in tc?tc[a]:tc[a]="on"+a}function Uy(a,h){if(a.da)a=!0;else{h=new wi(h,this);var f=a.listener,p=a.ha||a.src;a.fa&&nc(a),a=f.call(p,h)}return a}function rc(a){return a=a[ec],a instanceof Ys?a:null}var ic="__closure_events_fn_"+(1e9*Math.random()>>>0);function eh(a){return typeof a=="function"?a:(a[ic]||(a[ic]=function(h){return a.handleEvent(h)}),a[ic])}function Be(){Yt.call(this),this.i=new Ys(this),this.M=this,this.F=null}w(Be,Yt),Be.prototype[Qs]=!0,Be.prototype.removeEventListener=function(a,h,f,p){Xl(this,a,h,f,p)};function We(a,h){var f,p=a.F;if(p)for(f=[];p;p=p.F)f.push(p);if(a=a.M,p=h.type||h,typeof h=="string")h=new Ue(h,a);else if(h instanceof Ue)h.target=h.target||a;else{var b=h;h=new Ue(p,a),v(h,b)}if(b=!0,f)for(var k=f.length-1;0<=k;k--){var U=h.g=f[k];b=Xs(U,p,!0,h)&&b}if(U=h.g=a,b=Xs(U,p,!0,h)&&b,b=Xs(U,p,!1,h)&&b,f)for(k=0;k<f.length;k++)U=h.g=f[k],b=Xs(U,p,!1,h)&&b}Be.prototype.N=function(){if(Be.aa.N.call(this),this.i){var a=this.i,h;for(h in a.g){for(var f=a.g[h],p=0;p<f.length;p++)Js(f[p]);delete a.g[h],a.h--}}this.F=null},Be.prototype.K=function(a,h,f,p){return this.i.add(String(a),h,!1,f,p)},Be.prototype.L=function(a,h,f,p){return this.i.add(String(a),h,!0,f,p)};function Xs(a,h,f,p){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();for(var b=!0,k=0;k<h.length;++k){var U=h[k];if(U&&!U.da&&U.capture==f){var oe=U.listener,Le=U.ha||U.src;U.fa&&Xa(a.i,U),b=oe.call(Le,p)!==!1&&b}}return b&&!p.defaultPrevented}function th(a,h,f){if(typeof a=="function")f&&(a=g(a,f));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:c.setTimeout(a,h||0)}function nh(a){a.g=th(()=>{a.g=null,a.i&&(a.i=!1,nh(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class By extends Yt{constructor(h,f){super(),this.m=h,this.l=f,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:nh(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ai(a){Yt.call(this),this.h=a,this.g={}}w(Ai,Yt);var rh=[];function ih(a){$(a.g,function(h,f){this.g.hasOwnProperty(f)&&nc(h)},a),a.g={}}Ai.prototype.N=function(){Ai.aa.N.call(this),ih(this)},Ai.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var sc=c.JSON.stringify,qy=c.JSON.parse,jy=class{stringify(a){return c.JSON.stringify(a,void 0)}parse(a){return c.JSON.parse(a,void 0)}};function oc(){}oc.prototype.h=null;function sh(a){return a.h||(a.h=a.i())}function oh(){}var Ri={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ac(){Ue.call(this,"d")}w(ac,Ue);function cc(){Ue.call(this,"c")}w(cc,Ue);var Mn={},ah=null;function Zs(){return ah=ah||new Be}Mn.La="serverreachability";function ch(a){Ue.call(this,Mn.La,a)}w(ch,Ue);function bi(a){const h=Zs();We(h,new ch(h))}Mn.STAT_EVENT="statevent";function uh(a,h){Ue.call(this,Mn.STAT_EVENT,a),this.stat=h}w(uh,Ue);function Qe(a){const h=Zs();We(h,new uh(h,a))}Mn.Ma="timingevent";function lh(a,h){Ue.call(this,Mn.Ma,a),this.size=h}w(lh,Ue);function Si(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){a()},h)}function Pi(){this.g=!0}Pi.prototype.xa=function(){this.g=!1};function zy(a,h,f,p,b,k){a.info(function(){if(a.g)if(k)for(var U="",oe=k.split("&"),Le=0;Le<oe.length;Le++){var ne=oe[Le].split("=");if(1<ne.length){var qe=ne[0];ne=ne[1];var je=qe.split("_");U=2<=je.length&&je[1]=="type"?U+(qe+"="+ne+"&"):U+(qe+"=redacted&")}}else U=null;else U=k;return"XMLHTTP REQ ("+p+") [attempt "+b+"]: "+h+`
`+f+`
`+U})}function Gy(a,h,f,p,b,k,U){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+b+"]: "+h+`
`+f+`
`+k+" "+U})}function pr(a,h,f,p){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+Ky(a,f)+(p?" "+p:"")})}function $y(a,h){a.info(function(){return"TIMEOUT: "+h})}Pi.prototype.info=function(){};function Ky(a,h){if(!a.g)return h;if(!h)return null;try{var f=JSON.parse(h);if(f){for(a=0;a<f.length;a++)if(Array.isArray(f[a])){var p=f[a];if(!(2>p.length)){var b=p[1];if(Array.isArray(b)&&!(1>b.length)){var k=b[0];if(k!="noop"&&k!="stop"&&k!="close")for(var U=1;U<b.length;U++)b[U]=""}}}}return sc(f)}catch{return h}}var eo={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},hh={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},uc;function to(){}w(to,oc),to.prototype.g=function(){return new XMLHttpRequest},to.prototype.i=function(){return{}},uc=new to;function Xt(a,h,f,p){this.j=a,this.i=h,this.l=f,this.R=p||1,this.U=new Ai(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new dh}function dh(){this.i=null,this.g="",this.h=!1}var fh={},lc={};function hc(a,h,f){a.L=1,a.v=so(Pt(h)),a.m=f,a.P=!0,mh(a,null)}function mh(a,h){a.F=Date.now(),no(a),a.A=Pt(a.v);var f=a.A,p=a.R;Array.isArray(p)||(p=[String(p)]),Ph(f.i,"t",p),a.C=0,f=a.j.J,a.h=new dh,a.g=Kh(a.j,f?h:null,!a.m),0<a.O&&(a.M=new By(g(a.Y,a,a.g),a.O)),h=a.U,f=a.g,p=a.ca;var b="readystatechange";Array.isArray(b)||(b&&(rh[0]=b.toString()),b=rh);for(var k=0;k<b.length;k++){var U=Yl(f,b[k],p||h.handleEvent,!1,h.h||h);if(!U)break;h.g[U.key]=U}h=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,h)):(a.u="GET",a.g.ea(a.A,a.u,null,h)),bi(),zy(a.i,a.u,a.A,a.l,a.R,a.m)}Xt.prototype.ca=function(a){a=a.target;const h=this.M;h&&Ct(a)==3?h.j():this.Y(a)},Xt.prototype.Y=function(a){try{if(a==this.g)e:{const je=Ct(this.g);var h=this.g.Ba();const yr=this.g.Z();if(!(3>je)&&(je!=3||this.g&&(this.h.h||this.g.oa()||xh(this.g)))){this.J||je!=4||h==7||(h==8||0>=yr?bi(3):bi(2)),dc(this);var f=this.g.Z();this.X=f;t:if(ph(this)){var p=xh(this.g);a="";var b=p.length,k=Ct(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Fn(this),Ci(this);var U="";break t}this.h.i=new c.TextDecoder}for(h=0;h<b;h++)this.h.h=!0,a+=this.h.i.decode(p[h],{stream:!(k&&h==b-1)});p.length=0,this.h.g+=a,this.C=0,U=this.h.g}else U=this.g.oa();if(this.o=f==200,Gy(this.i,this.u,this.A,this.l,this.R,je,f),this.o){if(this.T&&!this.K){t:{if(this.g){var oe,Le=this.g;if((oe=Le.g?Le.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!M(oe)){var ne=oe;break t}}ne=null}if(f=ne)pr(this.i,this.l,f,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,fc(this,f);else{this.o=!1,this.s=3,Qe(12),Fn(this),Ci(this);break e}}if(this.P){f=!0;let dt;for(;!this.J&&this.C<U.length;)if(dt=Hy(this,U),dt==lc){je==4&&(this.s=4,Qe(14),f=!1),pr(this.i,this.l,null,"[Incomplete Response]");break}else if(dt==fh){this.s=4,Qe(15),pr(this.i,this.l,U,"[Invalid Chunk]"),f=!1;break}else pr(this.i,this.l,dt,null),fc(this,dt);if(ph(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),je!=4||U.length!=0||this.h.h||(this.s=1,Qe(16),f=!1),this.o=this.o&&f,!f)pr(this.i,this.l,U,"[Invalid Chunked Response]"),Fn(this),Ci(this);else if(0<U.length&&!this.W){this.W=!0;var qe=this.j;qe.g==this&&qe.ba&&!qe.M&&(qe.j.info("Great, no buffering proxy detected. Bytes received: "+U.length),Ic(qe),qe.M=!0,Qe(11))}}else pr(this.i,this.l,U,null),fc(this,U);je==4&&Fn(this),this.o&&!this.J&&(je==4?jh(this.j,this):(this.o=!1,no(this)))}else lI(this.g),f==400&&0<U.indexOf("Unknown SID")?(this.s=3,Qe(12)):(this.s=0,Qe(13)),Fn(this),Ci(this)}}}catch{}finally{}};function ph(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Hy(a,h){var f=a.C,p=h.indexOf(`
`,f);return p==-1?lc:(f=Number(h.substring(f,p)),isNaN(f)?fh:(p+=1,p+f>h.length?lc:(h=h.slice(p,p+f),a.C=p+f,h)))}Xt.prototype.cancel=function(){this.J=!0,Fn(this)};function no(a){a.S=Date.now()+a.I,gh(a,a.I)}function gh(a,h){if(a.B!=null)throw Error("WatchDog timer not null");a.B=Si(g(a.ba,a),h)}function dc(a){a.B&&(c.clearTimeout(a.B),a.B=null)}Xt.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?($y(this.i,this.A),this.L!=2&&(bi(),Qe(17)),Fn(this),this.s=2,Ci(this)):gh(this,this.S-a)};function Ci(a){a.j.G==0||a.J||jh(a.j,a)}function Fn(a){dc(a);var h=a.M;h&&typeof h.ma=="function"&&h.ma(),a.M=null,ih(a.U),a.g&&(h=a.g,a.g=null,h.abort(),h.ma())}function fc(a,h){try{var f=a.j;if(f.G!=0&&(f.g==a||mc(f.h,a))){if(!a.K&&mc(f.h,a)&&f.G==3){try{var p=f.Da.g.parse(h)}catch{p=null}if(Array.isArray(p)&&p.length==3){var b=p;if(b[0]==0){e:if(!f.u){if(f.g)if(f.g.F+3e3<a.F)ho(f),uo(f);else break e;yc(f),Qe(18)}}else f.za=b[1],0<f.za-f.T&&37500>b[2]&&f.F&&f.v==0&&!f.C&&(f.C=Si(g(f.Za,f),6e3));if(1>=Ih(f.h)&&f.ca){try{f.ca()}catch{}f.ca=void 0}}else Bn(f,11)}else if((a.K||f.g==a)&&ho(f),!M(h))for(b=f.Da.g.parse(h),h=0;h<b.length;h++){let ne=b[h];if(f.T=ne[0],ne=ne[1],f.G==2)if(ne[0]=="c"){f.K=ne[1],f.ia=ne[2];const qe=ne[3];qe!=null&&(f.la=qe,f.j.info("VER="+f.la));const je=ne[4];je!=null&&(f.Aa=je,f.j.info("SVER="+f.Aa));const yr=ne[5];yr!=null&&typeof yr=="number"&&0<yr&&(p=1.5*yr,f.L=p,f.j.info("backChannelRequestTimeoutMs_="+p)),p=f;const dt=a.g;if(dt){const mo=dt.g?dt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(mo){var k=p.h;k.g||mo.indexOf("spdy")==-1&&mo.indexOf("quic")==-1&&mo.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(pc(k,k.h),k.h=null))}if(p.D){const Tc=dt.g?dt.g.getResponseHeader("X-HTTP-Session-Id"):null;Tc&&(p.ya=Tc,ue(p.I,p.D,Tc))}}f.G=3,f.l&&f.l.ua(),f.ba&&(f.R=Date.now()-a.F,f.j.info("Handshake RTT: "+f.R+"ms")),p=f;var U=a;if(p.qa=$h(p,p.J?p.ia:null,p.W),U.K){Th(p.h,U);var oe=U,Le=p.L;Le&&(oe.I=Le),oe.B&&(dc(oe),no(oe)),p.g=U}else Bh(p);0<f.i.length&&lo(f)}else ne[0]!="stop"&&ne[0]!="close"||Bn(f,7);else f.G==3&&(ne[0]=="stop"||ne[0]=="close"?ne[0]=="stop"?Bn(f,7):_c(f):ne[0]!="noop"&&f.l&&f.l.ta(ne),f.v=0)}}bi(4)}catch{}}var Wy=class{constructor(a,h){this.g=a,this.map=h}};function _h(a){this.l=a||10,c.PerformanceNavigationTiming?(a=c.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function yh(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Ih(a){return a.h?1:a.g?a.g.size:0}function mc(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function pc(a,h){a.g?a.g.add(h):a.h=h}function Th(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}_h.prototype.cancel=function(){if(this.i=Eh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Eh(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const f of a.g.values())h=h.concat(f.D);return h}return D(a.i)}function Qy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var h=[],f=a.length,p=0;p<f;p++)h.push(a[p]);return h}h=[],f=0;for(p in a)h[f++]=a[p];return h}function Jy(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var h=[];a=a.length;for(var f=0;f<a;f++)h.push(f);return h}h=[],f=0;for(const p in a)h[f++]=p;return h}}}function vh(a,h){if(a.forEach&&typeof a.forEach=="function")a.forEach(h,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,h,void 0);else for(var f=Jy(a),p=Qy(a),b=p.length,k=0;k<b;k++)h.call(void 0,p[k],f&&f[k],a)}var wh=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Yy(a,h){if(a){a=a.split("&");for(var f=0;f<a.length;f++){var p=a[f].indexOf("="),b=null;if(0<=p){var k=a[f].substring(0,p);b=a[f].substring(p+1)}else k=a[f];h(k,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Un(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Un){this.h=a.h,ro(this,a.j),this.o=a.o,this.g=a.g,io(this,a.s),this.l=a.l;var h=a.i,f=new Ni;f.i=h.i,h.g&&(f.g=new Map(h.g),f.h=h.h),Ah(this,f),this.m=a.m}else a&&(h=String(a).match(wh))?(this.h=!1,ro(this,h[1]||"",!0),this.o=Di(h[2]||""),this.g=Di(h[3]||"",!0),io(this,h[4]),this.l=Di(h[5]||"",!0),Ah(this,h[6]||"",!0),this.m=Di(h[7]||"")):(this.h=!1,this.i=new Ni(null,this.h))}Un.prototype.toString=function(){var a=[],h=this.j;h&&a.push(ki(h,Rh,!0),":");var f=this.g;return(f||h=="file")&&(a.push("//"),(h=this.o)&&a.push(ki(h,Rh,!0),"@"),a.push(encodeURIComponent(String(f)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.s,f!=null&&a.push(":",String(f))),(f=this.l)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(ki(f,f.charAt(0)=="/"?eI:Zy,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",ki(f,nI)),a.join("")};function Pt(a){return new Un(a)}function ro(a,h,f){a.j=f?Di(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function io(a,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);a.s=h}else a.s=null}function Ah(a,h,f){h instanceof Ni?(a.i=h,rI(a.i,a.h)):(f||(h=ki(h,tI)),a.i=new Ni(h,a.h))}function ue(a,h,f){a.i.set(h,f)}function so(a){return ue(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Di(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function ki(a,h,f){return typeof a=="string"?(a=encodeURI(a).replace(h,Xy),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Xy(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Rh=/[#\/\?@]/g,Zy=/[#\?:]/g,eI=/[#\?]/g,tI=/[#\?@]/g,nI=/#/g;function Ni(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function Zt(a){a.g||(a.g=new Map,a.h=0,a.i&&Yy(a.i,function(h,f){a.add(decodeURIComponent(h.replace(/\+/g," ")),f)}))}n=Ni.prototype,n.add=function(a,h){Zt(this),this.i=null,a=gr(this,a);var f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(h),this.h+=1,this};function bh(a,h){Zt(a),h=gr(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function Sh(a,h){return Zt(a),h=gr(a,h),a.g.has(h)}n.forEach=function(a,h){Zt(this),this.g.forEach(function(f,p){f.forEach(function(b){a.call(h,b,p,this)},this)},this)},n.na=function(){Zt(this);const a=Array.from(this.g.values()),h=Array.from(this.g.keys()),f=[];for(let p=0;p<h.length;p++){const b=a[p];for(let k=0;k<b.length;k++)f.push(h[p])}return f},n.V=function(a){Zt(this);let h=[];if(typeof a=="string")Sh(this,a)&&(h=h.concat(this.g.get(gr(this,a))));else{a=Array.from(this.g.values());for(let f=0;f<a.length;f++)h=h.concat(a[f])}return h},n.set=function(a,h){return Zt(this),this.i=null,a=gr(this,a),Sh(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},n.get=function(a,h){return a?(a=this.V(a),0<a.length?String(a[0]):h):h};function Ph(a,h,f){bh(a,h),0<f.length&&(a.i=null,a.g.set(gr(a,h),D(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(var f=0;f<h.length;f++){var p=h[f];const k=encodeURIComponent(String(p)),U=this.V(p);for(p=0;p<U.length;p++){var b=k;U[p]!==""&&(b+="="+encodeURIComponent(String(U[p]))),a.push(b)}}return this.i=a.join("&")};function gr(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function rI(a,h){h&&!a.j&&(Zt(a),a.i=null,a.g.forEach(function(f,p){var b=p.toLowerCase();p!=b&&(bh(this,p),Ph(this,b,f))},a)),a.j=h}function iI(a,h){const f=new Pi;if(c.Image){const p=new Image;p.onload=T(en,f,"TestLoadImage: loaded",!0,h,p),p.onerror=T(en,f,"TestLoadImage: error",!1,h,p),p.onabort=T(en,f,"TestLoadImage: abort",!1,h,p),p.ontimeout=T(en,f,"TestLoadImage: timeout",!1,h,p),c.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else h(!1)}function sI(a,h){const f=new Pi,p=new AbortController,b=setTimeout(()=>{p.abort(),en(f,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:p.signal}).then(k=>{clearTimeout(b),k.ok?en(f,"TestPingServer: ok",!0,h):en(f,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(b),en(f,"TestPingServer: error",!1,h)})}function en(a,h,f,p,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),p(f)}catch{}}function oI(){this.g=new jy}function aI(a,h,f){const p=f||"";try{vh(a,function(b,k){let U=b;l(b)&&(U=sc(b)),h.push(p+k+"="+encodeURIComponent(U))})}catch(b){throw h.push(p+"type="+encodeURIComponent("_badmap")),b}}function oo(a){this.l=a.Ub||null,this.j=a.eb||!1}w(oo,oc),oo.prototype.g=function(){return new ao(this.l,this.j)},oo.prototype.i=function(a){return function(){return a}}({});function ao(a,h){Be.call(this),this.D=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}w(ao,Be),n=ao.prototype,n.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=h,this.readyState=1,Oi(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(h.body=a),(this.D||c).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Vi(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Oi(this)),this.g&&(this.readyState=3,Oi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ch(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ch(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?Vi(this):Oi(this),this.readyState==3&&Ch(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,Vi(this))},n.Qa=function(a){this.g&&(this.response=a,Vi(this))},n.ga=function(){this.g&&Vi(this)};function Vi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Oi(a)}n.setRequestHeader=function(a,h){this.u.append(a,h)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var f=h.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=h.next();return a.join(`\r
`)};function Oi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ao.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Dh(a){let h="";return $(a,function(f,p){h+=p,h+=":",h+=f,h+=`\r
`}),h}function gc(a,h,f){e:{for(p in f){var p=!1;break e}p=!0}p||(f=Dh(f),typeof a=="string"?f!=null&&encodeURIComponent(String(f)):ue(a,h,f))}function Ee(a){Be.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}w(Ee,Be);var cI=/^https?$/i,uI=["POST","PUT"];n=Ee.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,h,f,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():uc.g(),this.v=this.o?sh(this.o):sh(uc),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(k){kh(this,k);return}if(a=f||"",f=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var b in p)f.set(b,p[b]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())f.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(f.keys()).find(k=>k.toLowerCase()=="content-type"),b=c.FormData&&a instanceof c.FormData,!(0<=Array.prototype.indexOf.call(uI,h,void 0))||p||b||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,U]of f)this.g.setRequestHeader(k,U);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Oh(this),this.u=!0,this.g.send(a),this.u=!1}catch(k){kh(this,k)}};function kh(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.m=5,Nh(a),co(a)}function Nh(a){a.A||(a.A=!0,We(a,"complete"),We(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,We(this,"complete"),We(this,"abort"),co(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),co(this,!0)),Ee.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Vh(this):this.bb())},n.bb=function(){Vh(this)};function Vh(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Ct(a)!=4||a.Z()!=2)){if(a.u&&Ct(a)==4)th(a.Ea,0,a);else if(We(a,"readystatechange"),Ct(a)==4){a.h=!1;try{const U=a.Z();e:switch(U){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var f;if(!(f=h)){var p;if(p=U===0){var b=String(a.D).match(wh)[1]||null;!b&&c.self&&c.self.location&&(b=c.self.location.protocol.slice(0,-1)),p=!cI.test(b?b.toLowerCase():"")}f=p}if(f)We(a,"complete"),We(a,"success");else{a.m=6;try{var k=2<Ct(a)?a.g.statusText:""}catch{k=""}a.l=k+" ["+a.Z()+"]",Nh(a)}}finally{co(a)}}}}function co(a,h){if(a.g){Oh(a);const f=a.g,p=a.v[0]?()=>{}:null;a.g=null,a.v=null,h||We(a,"ready");try{f.onreadystatechange=p}catch{}}}function Oh(a){a.I&&(c.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function Ct(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<Ct(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),qy(h)}};function xh(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function lI(a){const h={};a=(a.g&&2<=Ct(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(M(a[p]))continue;var f=A(a[p]);const b=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const k=h[b]||[];h[b]=k,k.push(f)}E(h,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function xi(a,h,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||h}function Lh(a){this.Aa=0,this.i=[],this.j=new Pi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=xi("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=xi("baseRetryDelayMs",5e3,a),this.cb=xi("retryDelaySeedMs",1e4,a),this.Wa=xi("forwardChannelMaxRetries",2,a),this.wa=xi("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new _h(a&&a.concurrentRequestLimit),this.Da=new oI,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Lh.prototype,n.la=8,n.G=1,n.connect=function(a,h,f,p){Qe(0),this.W=a,this.H=h||{},f&&p!==void 0&&(this.H.OSID=f,this.H.OAID=p),this.F=this.X,this.I=$h(this,null,this.W),lo(this)};function _c(a){if(Mh(a),a.G==3){var h=a.U++,f=Pt(a.I);if(ue(f,"SID",a.K),ue(f,"RID",h),ue(f,"TYPE","terminate"),Li(a,f),h=new Xt(a,a.j,h),h.L=2,h.v=so(Pt(f)),f=!1,c.navigator&&c.navigator.sendBeacon)try{f=c.navigator.sendBeacon(h.v.toString(),"")}catch{}!f&&c.Image&&(new Image().src=h.v,f=!0),f||(h.g=Kh(h.j,null),h.g.ea(h.v)),h.F=Date.now(),no(h)}Gh(a)}function uo(a){a.g&&(Ic(a),a.g.cancel(),a.g=null)}function Mh(a){uo(a),a.u&&(c.clearTimeout(a.u),a.u=null),ho(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&c.clearTimeout(a.s),a.s=null)}function lo(a){if(!yh(a.h)&&!a.s){a.s=!0;var h=a.Ga;Ei||Jl(),vi||(Ei(),vi=!0),Ya.add(h,a),a.B=0}}function hI(a,h){return Ih(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=h.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=Si(g(a.Ga,a,h),zh(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const b=new Xt(this,this.j,a);let k=this.o;if(this.S&&(k?(k=_(k),v(k,this.S)):k=this.S),this.m!==null||this.O||(b.H=k,k=null),this.P)e:{for(var h=0,f=0;f<this.i.length;f++){t:{var p=this.i[f];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(h+=p,4096<h){h=f;break e}if(h===4096||f===this.i.length-1){h=f+1;break e}}h=1e3}else h=1e3;h=Uh(this,b,h),f=Pt(this.I),ue(f,"RID",a),ue(f,"CVER",22),this.D&&ue(f,"X-HTTP-Session-Id",this.D),Li(this,f),k&&(this.O?h="headers="+encodeURIComponent(String(Dh(k)))+"&"+h:this.m&&gc(f,this.m,k)),pc(this.h,b),this.Ua&&ue(f,"TYPE","init"),this.P?(ue(f,"$req",h),ue(f,"SID","null"),b.T=!0,hc(b,f,null)):hc(b,f,h),this.G=2}}else this.G==3&&(a?Fh(this,a):this.i.length==0||yh(this.h)||Fh(this))};function Fh(a,h){var f;h?f=h.l:f=a.U++;const p=Pt(a.I);ue(p,"SID",a.K),ue(p,"RID",f),ue(p,"AID",a.T),Li(a,p),a.m&&a.o&&gc(p,a.m,a.o),f=new Xt(a,a.j,f,a.B+1),a.m===null&&(f.H=a.o),h&&(a.i=h.D.concat(a.i)),h=Uh(a,f,1e3),f.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),pc(a.h,f),hc(f,p,h)}function Li(a,h){a.H&&$(a.H,function(f,p){ue(h,p,f)}),a.l&&vh({},function(f,p){ue(h,p,f)})}function Uh(a,h,f){f=Math.min(a.i.length,f);var p=a.l?g(a.l.Na,a.l,a):null;e:{var b=a.i;let k=-1;for(;;){const U=["count="+f];k==-1?0<f?(k=b[0].g,U.push("ofs="+k)):k=0:U.push("ofs="+k);let oe=!0;for(let Le=0;Le<f;Le++){let ne=b[Le].g;const qe=b[Le].map;if(ne-=k,0>ne)k=Math.max(0,b[Le].g-100),oe=!1;else try{aI(qe,U,"req"+ne+"_")}catch{p&&p(qe)}}if(oe){p=U.join("&");break e}}}return a=a.i.splice(0,f),h.D=a,p}function Bh(a){if(!a.g&&!a.u){a.Y=1;var h=a.Fa;Ei||Jl(),vi||(Ei(),vi=!0),Ya.add(h,a),a.v=0}}function yc(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=Si(g(a.Fa,a),zh(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,qh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=Si(g(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Qe(10),uo(this),qh(this))};function Ic(a){a.A!=null&&(c.clearTimeout(a.A),a.A=null)}function qh(a){a.g=new Xt(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var h=Pt(a.qa);ue(h,"RID","rpc"),ue(h,"SID",a.K),ue(h,"AID",a.T),ue(h,"CI",a.F?"0":"1"),!a.F&&a.ja&&ue(h,"TO",a.ja),ue(h,"TYPE","xmlhttp"),Li(a,h),a.m&&a.o&&gc(h,a.m,a.o),a.L&&(a.g.I=a.L);var f=a.g;a=a.ia,f.L=1,f.v=so(Pt(h)),f.m=null,f.P=!0,mh(f,a)}n.Za=function(){this.C!=null&&(this.C=null,uo(this),yc(this),Qe(19))};function ho(a){a.C!=null&&(c.clearTimeout(a.C),a.C=null)}function jh(a,h){var f=null;if(a.g==h){ho(a),Ic(a),a.g=null;var p=2}else if(mc(a.h,h))f=h.D,Th(a.h,h),p=1;else return;if(a.G!=0){if(h.o)if(p==1){f=h.m?h.m.length:0,h=Date.now()-h.F;var b=a.B;p=Zs(),We(p,new lh(p,f)),lo(a)}else Bh(a);else if(b=h.s,b==3||b==0&&0<h.X||!(p==1&&hI(a,h)||p==2&&yc(a)))switch(f&&0<f.length&&(h=a.h,h.i=h.i.concat(f)),b){case 1:Bn(a,5);break;case 4:Bn(a,10);break;case 3:Bn(a,6);break;default:Bn(a,2)}}}function zh(a,h){let f=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(f*=2),f*h}function Bn(a,h){if(a.j.info("Error code "+h),h==2){var f=g(a.fb,a),p=a.Xa;const b=!p;p=new Un(p||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||ro(p,"https"),so(p),b?iI(p.toString(),f):sI(p.toString(),f)}else Qe(2);a.G=0,a.l&&a.l.sa(h),Gh(a),Mh(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),Qe(2)):(this.j.info("Failed to ping google.com"),Qe(1))};function Gh(a){if(a.G=0,a.ka=[],a.l){const h=Eh(a.h);(h.length!=0||a.i.length!=0)&&(P(a.ka,h),P(a.ka,a.i),a.h.i.length=0,D(a.i),a.i.length=0),a.l.ra()}}function $h(a,h,f){var p=f instanceof Un?Pt(f):new Un(f);if(p.g!="")h&&(p.g=h+"."+p.g),io(p,p.s);else{var b=c.location;p=b.protocol,h=h?h+"."+b.hostname:b.hostname,b=+b.port;var k=new Un(null);p&&ro(k,p),h&&(k.g=h),b&&io(k,b),f&&(k.l=f),p=k}return f=a.D,h=a.ya,f&&h&&ue(p,f,h),ue(p,"VER",a.la),Li(a,p),p}function Kh(a,h,f){if(h&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Ca&&!a.pa?new Ee(new oo({eb:f})):new Ee(a.pa),h.Ha(a.J),h}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Hh(){}n=Hh.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function fo(){}fo.prototype.g=function(a,h){return new rt(a,h)};function rt(a,h){Be.call(this),this.g=new Lh(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(a?a["X-WebChannel-Client-Profile"]=h.va:a={"X-WebChannel-Client-Profile":h.va}),this.g.S=a,(a=h&&h.Sb)&&!M(a)&&(this.g.m=a),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!M(h)&&(this.g.D=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new _r(this)}w(rt,Be),rt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},rt.prototype.close=function(){_c(this.g)},rt.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.u&&(f={},f.__data__=sc(a),a=f);h.i.push(new Wy(h.Ya++,a)),h.G==3&&lo(h)},rt.prototype.N=function(){this.g.l=null,delete this.j,_c(this.g),delete this.g,rt.aa.N.call(this)};function Wh(a){ac.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const f in h){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}w(Wh,ac);function Qh(){cc.call(this),this.status=1}w(Qh,cc);function _r(a){this.g=a}w(_r,Hh),_r.prototype.ua=function(){We(this.g,"a")},_r.prototype.ta=function(a){We(this.g,new Wh(a))},_r.prototype.sa=function(a){We(this.g,new Qh)},_r.prototype.ra=function(){We(this.g,"b")},fo.prototype.createWebChannel=fo.prototype.g,rt.prototype.send=rt.prototype.o,rt.prototype.open=rt.prototype.m,rt.prototype.close=rt.prototype.close,wm=function(){return new fo},vm=function(){return Zs()},Em=Mn,Gc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},eo.NO_ERROR=0,eo.TIMEOUT=8,eo.HTTP_ERROR=6,bo=eo,hh.COMPLETE="complete",Tm=hh,oh.EventType=Ri,Ri.OPEN="a",Ri.CLOSE="b",Ri.ERROR="c",Ri.MESSAGE="d",Be.prototype.listen=Be.prototype.K,Ki=oh,Ee.prototype.listenOnce=Ee.prototype.L,Ee.prototype.getLastError=Ee.prototype.Ka,Ee.prototype.getLastErrorCode=Ee.prototype.Ba,Ee.prototype.getStatus=Ee.prototype.Z,Ee.prototype.getResponseJson=Ee.prototype.Oa,Ee.prototype.getResponseText=Ee.prototype.oa,Ee.prototype.send=Ee.prototype.ea,Ee.prototype.setWithCredentials=Ee.prototype.Ha,Im=Ee}).apply(typeof po<"u"?po:typeof self<"u"?self:typeof window<"u"?window:{});const od="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ne.UNAUTHENTICATED=new Ne(null),Ne.GOOGLE_CREDENTIALS=new Ne("google-credentials-uid"),Ne.FIRST_PARTY=new Ne("first-party-uid"),Ne.MOCK_USER=new Ne("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ni="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const In=new _u("@firebase/firestore");function Rr(){return In.logLevel}function XT(n){In.setLogLevel(n)}function V(n,...e){if(In.logLevel<=Y.DEBUG){const t=e.map(Iu);In.debug(`Firestore (${ni}): ${n}`,...t)}}function Re(n,...e){if(In.logLevel<=Y.ERROR){const t=e.map(Iu);In.error(`Firestore (${ni}): ${n}`,...t)}}function it(n,...e){if(In.logLevel<=Y.WARN){const t=e.map(Iu);In.warn(`Firestore (${ni}): ${n}`,...t)}}function Iu(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(n="Unexpected state"){const e=`FIRESTORE (${ni}) INTERNAL ASSERTION FAILED: `+n;throw Re(e),new Error(e)}function z(n,e){n||j()}function ZT(n,e){n||j()}function F(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends pt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Rm{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ne.UNAUTHENTICATED))}shutdown(){}}class eE{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class tE{constructor(e){this.t=e,this.currentUser=Ne.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){z(this.o===void 0);let r=this.i;const i=u=>this.i!==r?(r=this.i,t(u)):Promise.resolve();let s=new Ve;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Ve,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},c=u=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>c(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Ve)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(z(typeof r.accessToken=="string"),new Am(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return z(e===null||typeof e=="string"),new Ne(e)}}class nE{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Ne.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class rE{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new nE(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Ne.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class bm{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class iE{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){z(this.o===void 0);const r=s=>{s.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,V("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(z(typeof t.token=="string"),this.R=t.token,new bm(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class sE{getToken(){return Promise.resolve(new bm(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oE(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=oE(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%e.length))}return r}}function H(n,e){return n<e?-1:n>e?1:0}function Mr(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}function Sm(n){return n+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new N(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ge.fromMillis(Date.now())}static fromDate(e){return ge.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new ge(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?H(this.nanoseconds,e.nanoseconds):H(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.timestamp=e}static fromTimestamp(e){return new K(e)}static min(){return new K(new ge(0,0))}static max(){return new K(new ge(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ds{constructor(e,t,r){t===void 0?t=0:t>e.length&&j(),r===void 0?r=e.length-t:r>e.length-t&&j(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ds.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ds?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=e.get(i),o=t.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class X extends ds{construct(e,t,r){return new X(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(C.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new X(t)}static emptyPath(){return new X([])}}const aE=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class he extends ds{construct(e,t,r){return new he(e,t,r)}static isValidIdentifier(e){return aE.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),he.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new he(["__name__"])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new N(C.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let o=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new N(C.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new N(C.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else c==="`"?(o=!o,i++):c!=="."||o?(r+=c,i++):(s(),i++)}if(s(),o)throw new N(C.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new he(t)}static emptyPath(){return new he([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.path=e}static fromPath(e){return new B(X.fromString(e))}static fromName(e){return new B(X.fromString(e).popFirst(5))}static empty(){return new B(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&X.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return X.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new B(new X(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,t,r,i){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=i}}function $c(n){return n.fields.find(e=>e.kind===2)}function zn(n){return n.fields.filter(e=>e.kind!==2)}function cE(n,e){let t=H(n.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let r=0;r<Math.min(n.fields.length,e.fields.length);++r)if(t=uE(n.fields[r],e.fields[r]),t!==0)return t;return H(n.fields.length,e.fields.length)}Fr.UNKNOWN_ID=-1;class Jn{constructor(e,t){this.fieldPath=e,this.kind=t}}function uE(n,e){const t=he.comparator(n.fieldPath,e.fieldPath);return t!==0?t:H(n.kind,e.kind)}class Ur{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Ur(0,st.min())}}function Pm(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=K.fromTimestamp(r===1e9?new ge(t+1,0):new ge(t,r));return new st(i,B.empty(),e)}function Cm(n){return new st(n.readTime,n.key,-1)}class st{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new st(K.min(),B.empty(),-1)}static max(){return new st(K.max(),B.empty(),-1)}}function Eu(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=B.comparator(n.documentKey,e.documentKey),t!==0?t:H(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dm="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class km{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cn(n){if(n.code!==C.FAILED_PRECONDITION||n.message!==Dm)throw n;V("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&j(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new R((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof R?t:R.resolve(t)}catch(t){return R.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):R.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):R.reject(t)}static resolve(e){return new R((t,r)=>{t(e)})}static reject(e){return new R((t,r)=>{r(e)})}static waitFor(e){return new R((t,r)=>{let i=0,s=0,o=!1;e.forEach(c=>{++i,c.next(()=>{++s,o&&s===i&&t()},u=>r(u))}),o=!0,s===i&&t()})}static or(e){let t=R.resolve(!1);for(const r of e)t=t.next(i=>i?R.resolve(i):r());return t}static forEach(e,t){const r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new R((r,i)=>{const s=e.length,o=new Array(s);let c=0;for(let u=0;u<s;u++){const l=u;t(e[l]).next(d=>{o[l]=d,++c,c===s&&r(o)},d=>i(d))}})}static doWhile(e,t){return new R((r,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.V=new Ve,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{t.error?this.V.reject(new es(e,t.error)):this.V.resolve()},this.transaction.onerror=r=>{const i=vu(r.target.error);this.V.reject(new es(e,i))}}static open(e,t,r,i){try{return new fa(t,e.transaction(i,r))}catch(s){throw new es(t,s)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(V("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new hE(t)}}class Et{constructor(e,t,r){this.name=e,this.version=t,this.p=r,Et.S(Ce())===12.2&&Re("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return V("SimpleDb","Removing database:",e),Gn(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!om())return!1;if(Et.v())return!0;const e=Ce(),t=Et.S(e),r=0<t&&t<10,i=Nm(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||r||s)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.C)==="YES"}static F(e,t){return e.store(t)}static S(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),r=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(r)}async M(e){return this.db||(V("SimpleDb","Opening database:",this.name),this.db=await new Promise((t,r)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const o=s.target.result;t(o)},i.onblocked=()=>{r(new es(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const o=s.target.error;o.name==="VersionError"?r(new N(C.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?r(new N(C.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):r(new es(e,o))},i.onupgradeneeded=s=>{V("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const o=s.target.result;this.p.O(o,i.transaction,s.oldVersion,this.version).next(()=>{V("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=t=>this.N(t)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,r,i){const s=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.M(e);const c=fa.open(this.db,e,s?"readonly":"readwrite",r),u=i(c).next(l=>(c.g(),l)).catch(l=>(c.abort(l),R.reject(l))).toPromise();return u.catch(()=>{}),await c.m,u}catch(c){const u=c,l=u.name!=="FirebaseError"&&o<3;if(V("SimpleDb","Transaction failed with error:",u.message,"Retrying:",l),this.close(),!l)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Nm(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class lE{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return Gn(this.B.delete())}}class es extends N{constructor(e,t){super(C.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Dn(n){return n.name==="IndexedDbTransactionError"}class hE{constructor(e){this.store=e}put(e,t){let r;return t!==void 0?(V("SimpleDb","PUT",this.store.name,e,t),r=this.store.put(t,e)):(V("SimpleDb","PUT",this.store.name,"<auto-key>",e),r=this.store.put(e)),Gn(r)}add(e){return V("SimpleDb","ADD",this.store.name,e,e),Gn(this.store.add(e))}get(e){return Gn(this.store.get(e)).next(t=>(t===void 0&&(t=null),V("SimpleDb","GET",this.store.name,e,t),t))}delete(e){return V("SimpleDb","DELETE",this.store.name,e),Gn(this.store.delete(e))}count(){return V("SimpleDb","COUNT",this.store.name),Gn(this.store.count())}U(e,t){const r=this.options(e,t),i=r.index?this.store.index(r.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(r.range);return new R((o,c)=>{s.onerror=u=>{c(u.target.error)},s.onsuccess=u=>{o(u.target.result)}})}{const s=this.cursor(r),o=[];return this.W(s,(c,u)=>{o.push(u)}).next(()=>o)}}G(e,t){const r=this.store.getAll(e,t===null?void 0:t);return new R((i,s)=>{r.onerror=o=>{s(o.target.error)},r.onsuccess=o=>{i(o.target.result)}})}j(e,t){V("SimpleDb","DELETE ALL",this.store.name);const r=this.options(e,t);r.H=!1;const i=this.cursor(r);return this.W(i,(s,o,c)=>c.delete())}J(e,t){let r;t?r=e:(r={},t=e);const i=this.cursor(r);return this.W(i,t)}Y(e){const t=this.cursor({});return new R((r,i)=>{t.onerror=s=>{const o=vu(s.target.error);i(o)},t.onsuccess=s=>{const o=s.target.result;o?e(o.primaryKey,o.value).next(c=>{c?o.continue():r()}):r()}})}W(e,t){const r=[];return new R((i,s)=>{e.onerror=o=>{s(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void i();const u=new lE(c),l=t(c.primaryKey,c.value,u);if(l instanceof R){const d=l.catch(m=>(u.done(),R.reject(m)));r.push(d)}u.isDone?i():u.K===null?c.continue():c.continue(u.K)}}).next(()=>R.waitFor(r))}options(e,t){let r;return e!==void 0&&(typeof e=="string"?r=e:t=e),{index:r,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const r=this.store.index(e.index);return e.H?r.openKeyCursor(e.range,t):r.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Gn(n){return new R((e,t)=>{n.onsuccess=r=>{const i=r.target.result;e(i)},n.onerror=r=>{const i=vu(r.target.error);t(i)}})}let ad=!1;function vu(n){const e=Et.S(Ce());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(n.message.indexOf(t)>=0){const r=new N("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return ad||(ad=!0,setTimeout(()=>{throw r},0)),r}}return n}class dE{constructor(e,t){this.asyncQueue=e,this.Z=t,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}X(e){V("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{V("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(t){Dn(t)?V("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",t):await Cn(t)}await this.X(6e4)})}}class fE{constructor(e,t){this.localStore=e,this.persistence=t}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.te(t,e))}te(e,t){const r=new Set;let i=t,s=!0;return R.doWhile(()=>s===!0&&i>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!r.has(o))return V("IndexBackfiller",`Processing collection: ${o}`),this.ne(e,o,i).next(c=>{i-=c,r.add(o)});s=!1})).next(()=>t-i)}ne(e,t,r){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(i=>this.localStore.localDocuments.getNextDocuments(e,t,i,r).next(s=>{const o=s.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.re(i,s)).next(c=>(V("IndexBackfiller",`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c))).next(()=>o.size)}))}re(e,t){let r=e;return t.changes.forEach((i,s)=>{const o=Cm(s);Eu(o,r)>0&&(r=o)}),new st(r.readTime,r.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ze.oe=-1;function Ps(n){return n==null}function fs(n){return n===0&&1/n==-1/0}function Vm(n){return typeof n=="number"&&Number.isInteger(n)&&!fs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=cd(e)),e=mE(n.get(t),e);return cd(e)}function mE(n,e){let t=e;const r=n.length;for(let i=0;i<r;i++){const s=n.charAt(i);switch(s){case"\0":t+="";break;case"":t+="";break;default:t+=s}}return t}function cd(n){return n+""}function yt(n){const e=n.length;if(z(e>=2),e===2)return z(n.charAt(0)===""&&n.charAt(1)===""),X.emptyPath();const t=e-2,r=[];let i="";for(let s=0;s<e;){const o=n.indexOf("",s);switch((o<0||o>t)&&j(),n.charAt(o+1)){case"":const c=n.substring(s,o);let u;i.length===0?u=c:(i+=c,u=i,i=""),r.push(u);break;case"":i+=n.substring(s,o),i+="\0";break;case"":i+=n.substring(s,o+1);break;default:j()}s=o+2}return new X(r)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function So(n,e){return[n,Ke(e)]}function Om(n,e,t){return[n,Ke(e),t]}const pE={},gE=["prefixPath","collectionGroup","readTime","documentId"],_E=["prefixPath","collectionGroup","documentId"],yE=["collectionGroup","readTime","prefixPath","documentId"],IE=["canonicalId","targetId"],TE=["targetId","path"],EE=["path","targetId"],vE=["collectionId","parent"],wE=["indexId","uid"],AE=["uid","sequenceNumber"],RE=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],bE=["indexId","uid","orderedDocumentKey"],SE=["userId","collectionPath","documentId"],PE=["userId","collectionPath","largestBatchId"],CE=["userId","collectionGroup","largestBatchId"],xm=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],DE=[...xm,"documentOverlays"],Lm=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],Mm=Lm,wu=[...Mm,"indexConfiguration","indexState","indexEntries"],kE=wu,NE=[...wu,"globals"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc extends km{constructor(e,t){super(),this._e=e,this.currentSequenceNumber=t}}function De(n,e){const t=F(n);return Et.F(t._e,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ld(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function kn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Fm(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function Um(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e,t){this.comparator=e,this.root=t||Me.EMPTY}insert(e,t){return new ae(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Me.BLACK,null,null))}remove(e){return new ae(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Me.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new go(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new go(this.root,e,this.comparator,!1)}getReverseIterator(){return new go(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new go(this.root,e,this.comparator,!0)}}class go{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Me{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??Me.RED,this.left=i??Me.EMPTY,this.right=s??Me.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new Me(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Me.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Me.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Me.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Me.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw j();const e=this.left.check();if(e!==this.right.check())throw j();return e+(this.isRed()?0:1)}}Me.EMPTY=null,Me.RED=!0,Me.BLACK=!1;Me.EMPTY=new class{constructor(){this.size=0}get key(){throw j()}get value(){throw j()}get color(){throw j()}get left(){throw j()}get right(){throw j()}copy(e,t,r,i,s){return this}insert(e,t,r){return new Me(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(e){this.comparator=e,this.data=new ae(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new hd(this.data.getIterator())}getIteratorFrom(e){return new hd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof ie)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ie(this.comparator);return t.data=e,t}}class hd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Ir(n){return n.hasNext()?n.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.fields=e,e.sort(he.comparator)}static empty(){return new et([])}unionWith(e){let t=new ie(he.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new et(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Mr(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VE(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Bm("Invalid base64 string: "+s):s}}(e);return new Te(t)}static fromUint8Array(e){const t=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new Te(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return H(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Te.EMPTY_BYTE_STRING=new Te("");const OE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Bt(n){if(z(!!n),typeof n=="string"){let e=0;const t=OE.exec(n);if(z(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:me(n.seconds),nanos:me(n.nanos)}}function me(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function qt(n){return typeof n=="string"?Te.fromBase64String(n):Te.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ma(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function pa(n){const e=n.mapValue.fields.__previous_value__;return ma(e)?pa(e):e}function ms(n){const e=Bt(n.mapValue.fields.__local_write_time__.timestampValue);return new ge(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xE{constructor(e,t,r,i,s,o,c,u,l){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=l}}class Tn{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Tn("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Tn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},Po={nullValue:"NULL_VALUE"};function En(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?ma(n)?4:qm(n)?9007199254740991:ga(n)?10:11:j()}function At(n,e){if(n===e)return!0;const t=En(n);if(t!==En(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ms(n).isEqual(ms(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Bt(i.timestampValue),c=Bt(s.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return qt(i.bytesValue).isEqual(qt(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return me(i.geoPointValue.latitude)===me(s.geoPointValue.latitude)&&me(i.geoPointValue.longitude)===me(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return me(i.integerValue)===me(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=me(i.doubleValue),c=me(s.doubleValue);return o===c?fs(o)===fs(c):isNaN(o)&&isNaN(c)}return!1}(n,e);case 9:return Mr(n.arrayValue.values||[],e.arrayValue.values||[],At);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},c=s.mapValue.fields||{};if(ld(o)!==ld(c))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(c[u]===void 0||!At(o[u],c[u])))return!1;return!0}(n,e);default:return j()}}function ps(n,e){return(n.values||[]).find(t=>At(t,e))!==void 0}function vn(n,e){if(n===e)return 0;const t=En(n),r=En(e);if(t!==r)return H(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return H(n.booleanValue,e.booleanValue);case 2:return function(s,o){const c=me(s.integerValue||s.doubleValue),u=me(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1}(n,e);case 3:return dd(n.timestampValue,e.timestampValue);case 4:return dd(ms(n),ms(e));case 5:return H(n.stringValue,e.stringValue);case 6:return function(s,o){const c=qt(s),u=qt(o);return c.compareTo(u)}(n.bytesValue,e.bytesValue);case 7:return function(s,o){const c=s.split("/"),u=o.split("/");for(let l=0;l<c.length&&l<u.length;l++){const d=H(c[l],u[l]);if(d!==0)return d}return H(c.length,u.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,o){const c=H(me(s.latitude),me(o.latitude));return c!==0?c:H(me(s.longitude),me(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return fd(n.arrayValue,e.arrayValue);case 10:return function(s,o){var c,u,l,d;const m=s.fields||{},g=o.fields||{},T=(c=m.value)===null||c===void 0?void 0:c.arrayValue,w=(u=g.value)===null||u===void 0?void 0:u.arrayValue,D=H(((l=T==null?void 0:T.values)===null||l===void 0?void 0:l.length)||0,((d=w==null?void 0:w.values)===null||d===void 0?void 0:d.length)||0);return D!==0?D:fd(T,w)}(n.mapValue,e.mapValue);case 11:return function(s,o){if(s===un.mapValue&&o===un.mapValue)return 0;if(s===un.mapValue)return 1;if(o===un.mapValue)return-1;const c=s.fields||{},u=Object.keys(c),l=o.fields||{},d=Object.keys(l);u.sort(),d.sort();for(let m=0;m<u.length&&m<d.length;++m){const g=H(u[m],d[m]);if(g!==0)return g;const T=vn(c[u[m]],l[d[m]]);if(T!==0)return T}return H(u.length,d.length)}(n.mapValue,e.mapValue);default:throw j()}}function dd(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return H(n,e);const t=Bt(n),r=Bt(e),i=H(t.seconds,r.seconds);return i!==0?i:H(t.nanos,r.nanos)}function fd(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=vn(t[i],r[i]);if(s)return s}return H(t.length,r.length)}function Br(n){return Hc(n)}function Hc(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=Bt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return qt(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return B.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=Hc(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${Hc(t.fields[o])}`;return i+"}"}(n.mapValue):j()}function Co(n){switch(En(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=pa(n);return e?16+Co(e):16;case 5:return 2*n.stringValue.length;case 6:return qt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+Co(s),0)}(n.arrayValue);case 10:case 11:return function(r){let i=0;return kn(r.fields,(s,o)=>{i+=s.length+Co(o)}),i}(n.mapValue);default:throw j()}}function er(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Wc(n){return!!n&&"integerValue"in n}function gs(n){return!!n&&"arrayValue"in n}function md(n){return!!n&&"nullValue"in n}function pd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Do(n){return!!n&&"mapValue"in n}function ga(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function ts(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return kn(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=ts(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ts(n.arrayValue.values[t]);return e}return Object.assign({},n)}function qm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}const jm={mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{}}}}};function LE(n){return"nullValue"in n?Po:"booleanValue"in n?{booleanValue:!1}:"integerValue"in n||"doubleValue"in n?{doubleValue:NaN}:"timestampValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in n?{stringValue:""}:"bytesValue"in n?{bytesValue:""}:"referenceValue"in n?er(Tn.empty(),B.empty()):"geoPointValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in n?{arrayValue:{}}:"mapValue"in n?ga(n)?jm:{mapValue:{}}:j()}function ME(n){return"nullValue"in n?{booleanValue:!1}:"booleanValue"in n?{doubleValue:NaN}:"integerValue"in n||"doubleValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in n?{stringValue:""}:"stringValue"in n?{bytesValue:""}:"bytesValue"in n?er(Tn.empty(),B.empty()):"referenceValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in n?{arrayValue:{}}:"arrayValue"in n?jm:"mapValue"in n?ga(n)?{mapValue:{}}:un:j()}function gd(n,e){const t=vn(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?-1:!n.inclusive&&e.inclusive?1:0}function _d(n,e){const t=vn(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?1:!n.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e){this.value=e}static empty(){return new Fe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Do(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ts(t)}setAll(e){let t=he.emptyPath(),r={},i=[];e.forEach((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,r,i),r={},i=[],t=c.popLast()}o?r[c.lastSegment()]=ts(o):i.push(c.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());Do(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return At(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];Do(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){kn(t,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new Fe(ts(this.value))}}function zm(n){const e=[];return kn(n.fields,(t,r)=>{const i=new he([t]);if(Do(r)){const s=zm(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new et(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(e,t,r,i,s,o,c){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=c}static newInvalidDocument(e){return new le(e,0,K.min(),K.min(),K.min(),Fe.empty(),0)}static newFoundDocument(e,t,r,i){return new le(e,1,t,K.min(),r,i,0)}static newNoDocument(e,t){return new le(e,2,t,K.min(),K.min(),Fe.empty(),0)}static newUnknownDocument(e,t){return new le(e,3,t,K.min(),K.min(),Fe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(K.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Fe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Fe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=K.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof le&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new le(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e,t){this.position=e,this.inclusive=t}}function yd(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],o=n.position[i];if(s.field.isKeyField()?r=B.comparator(B.fromName(o.referenceValue),t.key):r=vn(o,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Id(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!At(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e,t="asc"){this.field=e,this.dir=t}}function FE(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{}class Z extends Gm{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new UE(e,t,r):t==="array-contains"?new jE(e,r):t==="in"?new Jm(e,r):t==="not-in"?new zE(e,r):t==="array-contains-any"?new GE(e,r):new Z(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new BE(e,r):new qE(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(vn(t,this.value)):t!==null&&En(this.value)===En(t)&&this.matchesComparison(vn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return j()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class re extends Gm{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new re(e,t)}matches(e){return qr(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function qr(n){return n.op==="and"}function Qc(n){return n.op==="or"}function Au(n){return $m(n)&&qr(n)}function $m(n){for(const e of n.filters)if(e instanceof re)return!1;return!0}function Jc(n){if(n instanceof Z)return n.field.canonicalString()+n.op.toString()+Br(n.value);if(Au(n))return n.filters.map(e=>Jc(e)).join(",");{const e=n.filters.map(t=>Jc(t)).join(",");return`${n.op}(${e})`}}function Km(n,e){return n instanceof Z?function(r,i){return i instanceof Z&&r.op===i.op&&r.field.isEqual(i.field)&&At(r.value,i.value)}(n,e):n instanceof re?function(r,i){return i instanceof re&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,c)=>s&&Km(o,i.filters[c]),!0):!1}(n,e):void j()}function Hm(n,e){const t=n.filters.concat(e);return re.create(t,n.op)}function Wm(n){return n instanceof Z?function(t){return`${t.field.canonicalString()} ${t.op} ${Br(t.value)}`}(n):n instanceof re?function(t){return t.op.toString()+" {"+t.getFilters().map(Wm).join(" ,")+"}"}(n):"Filter"}class UE extends Z{constructor(e,t,r){super(e,t,r),this.key=B.fromName(r.referenceValue)}matches(e){const t=B.comparator(e.key,this.key);return this.matchesComparison(t)}}class BE extends Z{constructor(e,t){super(e,"in",t),this.keys=Qm("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class qE extends Z{constructor(e,t){super(e,"not-in",t),this.keys=Qm("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Qm(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>B.fromName(r.referenceValue))}class jE extends Z{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return gs(t)&&ps(t.arrayValue,this.value)}}class Jm extends Z{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ps(this.value.arrayValue,t)}}class zE extends Z{constructor(e,t){super(e,"not-in",t)}matches(e){if(ps(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!ps(this.value.arrayValue,t)}}class GE extends Z{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!gs(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>ps(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $E{constructor(e,t=null,r=[],i=[],s=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=c,this.ue=null}}function Yc(n,e=null,t=[],r=[],i=null,s=null,o=null){return new $E(n,e,t,r,i,s,o)}function tr(n){const e=F(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Jc(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Ps(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Br(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Br(r)).join(",")),e.ue=t}return e.ue}function Cs(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!FE(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Km(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Id(n.startAt,e.startAt)&&Id(n.endAt,e.endAt)}function zo(n){return B.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Go(n,e){return n.filters.filter(t=>t instanceof Z&&t.field.isEqual(e))}function Td(n,e,t){let r=Po,i=!0;for(const s of Go(n,e)){let o=Po,c=!0;switch(s.op){case"<":case"<=":o=LE(s.value);break;case"==":case"in":case">=":o=s.value;break;case">":o=s.value,c=!1;break;case"!=":case"not-in":o=Po}gd({value:r,inclusive:i},{value:o,inclusive:c})<0&&(r=o,i=c)}if(t!==null){for(let s=0;s<n.orderBy.length;++s)if(n.orderBy[s].field.isEqual(e)){const o=t.position[s];gd({value:r,inclusive:i},{value:o,inclusive:t.inclusive})<0&&(r=o,i=t.inclusive);break}}return{value:r,inclusive:i}}function Ed(n,e,t){let r=un,i=!0;for(const s of Go(n,e)){let o=un,c=!0;switch(s.op){case">=":case">":o=ME(s.value),c=!1;break;case"==":case"in":case"<=":o=s.value;break;case"<":o=s.value,c=!1;break;case"!=":case"not-in":o=un}_d({value:r,inclusive:i},{value:o,inclusive:c})>0&&(r=o,i=c)}if(t!==null){for(let s=0;s<n.orderBy.length;++s)if(n.orderBy[s].field.isEqual(e)){const o=t.position[s];_d({value:r,inclusive:i},{value:o,inclusive:t.inclusive})>0&&(r=o,i=t.inclusive);break}}return{value:r,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e,t=null,r=[],i=[],s=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=c,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Ym(n,e,t,r,i,s,o,c){return new Gt(n,e,t,r,i,s,o,c)}function ri(n){return new Gt(n)}function vd(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Ru(n){return n.collectionGroup!==null}function Cr(n){const e=F(n);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new ie(he.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(l=>{l.isInequality()&&(c=c.add(l.field))})}),c})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new _s(s,r))}),t.has(he.keyField().canonicalString())||e.ce.push(new _s(he.keyField(),r))}return e.ce}function He(n){const e=F(n);return e.le||(e.le=Zm(e,Cr(n))),e.le}function Xm(n){const e=F(n);return e.he||(e.he=Zm(e,n.explicitOrderBy)),e.he}function Zm(n,e){if(n.limitType==="F")return Yc(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new _s(i.field,s)});const t=n.endAt?new wn(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new wn(n.startAt.position,n.startAt.inclusive):null;return Yc(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Xc(n,e){const t=n.filters.concat([e]);return new Gt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function $o(n,e,t){return new Gt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Ds(n,e){return Cs(He(n),He(e))&&n.limitType===e.limitType}function ep(n){return`${tr(He(n))}|lt:${n.limitType}`}function br(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>Wm(i)).join(", ")}]`),Ps(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>Br(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>Br(i)).join(",")),`Target(${r})`}(He(n))}; limitType=${n.limitType})`}function ks(n,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):B.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(const s of Cr(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(o,c,u){const l=yd(o,c,u);return o.inclusive?l<=0:l<0}(r.startAt,Cr(r),i)||r.endAt&&!function(o,c,u){const l=yd(o,c,u);return o.inclusive?l>=0:l>0}(r.endAt,Cr(r),i))}(n,e)}function tp(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function np(n){return(e,t)=>{let r=!1;for(const i of Cr(n)){const s=KE(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function KE(n,e,t){const r=n.field.isKeyField()?B.comparator(e.key,t.key):function(s,o,c){const u=o.data.field(s),l=c.data.field(s);return u!==null&&l!==null?vn(u,l):j()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return j()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){kn(this.inner,(t,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return Um(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HE=new ae(B.comparator);function tt(){return HE}const rp=new ae(B.comparator);function Hi(...n){let e=rp;for(const t of n)e=e.insert(t.key,t);return e}function ip(n){let e=rp;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function It(){return ns()}function sp(){return ns()}function ns(){return new $t(n=>n.toString(),(n,e)=>n.isEqual(e))}const WE=new ae(B.comparator),QE=new ie(B.comparator);function Q(...n){let e=QE;for(const t of n)e=e.add(t);return e}const JE=new ie(H);function bu(){return JE}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Su(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:fs(e)?"-0":e}}function op(n){return{integerValue:""+n}}function ap(n,e){return Vm(e)?op(e):Su(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _a{constructor(){this._=void 0}}function YE(n,e,t){return n instanceof jr?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&ma(s)&&(s=pa(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(t,e):n instanceof nr?up(n,e):n instanceof rr?lp(n,e):function(i,s){const o=cp(i,s),c=wd(o)+wd(i.Pe);return Wc(o)&&Wc(i.Pe)?op(c):Su(i.serializer,c)}(n,e)}function XE(n,e,t){return n instanceof nr?up(n,e):n instanceof rr?lp(n,e):t}function cp(n,e){return n instanceof zr?function(r){return Wc(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class jr extends _a{}class nr extends _a{constructor(e){super(),this.elements=e}}function up(n,e){const t=hp(e);for(const r of n.elements)t.some(i=>At(i,r))||t.push(r);return{arrayValue:{values:t}}}class rr extends _a{constructor(e){super(),this.elements=e}}function lp(n,e){let t=hp(e);for(const r of n.elements)t=t.filter(i=>!At(i,r));return{arrayValue:{values:t}}}class zr extends _a{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function wd(n){return me(n.integerValue||n.doubleValue)}function hp(n){return gs(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(e,t){this.field=e,this.transform=t}}function ZE(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof nr&&i instanceof nr||r instanceof rr&&i instanceof rr?Mr(r.elements,i.elements,At):r instanceof zr&&i instanceof zr?At(r.Pe,i.Pe):r instanceof jr&&i instanceof jr}(n.transform,e.transform)}class ev{constructor(e,t){this.version=e,this.transformResults=t}}class pe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new pe}static exists(e){return new pe(void 0,e)}static updateTime(e){return new pe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ko(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ya{}function dp(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new si(n.key,pe.none()):new ii(n.key,n.data,pe.none());{const t=n.data,r=Fe.empty();let i=new ie(he.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new Kt(n.key,r,new et(i.toArray()),pe.none())}}function tv(n,e,t){n instanceof ii?function(i,s,o){const c=i.value.clone(),u=Rd(i.fieldTransforms,s,o.transformResults);c.setAll(u),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):n instanceof Kt?function(i,s,o){if(!ko(i.precondition,s))return void s.convertToUnknownDocument(o.version);const c=Rd(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(fp(i)),u.setAll(c),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(n,e,t):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function rs(n,e,t,r){return n instanceof ii?function(s,o,c,u){if(!ko(s.precondition,o))return c;const l=s.value.clone(),d=bd(s.fieldTransforms,u,o);return l.setAll(d),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null}(n,e,t,r):n instanceof Kt?function(s,o,c,u){if(!ko(s.precondition,o))return c;const l=bd(s.fieldTransforms,u,o),d=o.data;return d.setAll(fp(s)),d.setAll(l),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(n,e,t,r):function(s,o,c){return ko(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c}(n,e,t)}function nv(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=cp(r.transform,i||null);s!=null&&(t===null&&(t=Fe.empty()),t.set(r.field,s))}return t||null}function Ad(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&Mr(r,i,(s,o)=>ZE(s,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class ii extends ya{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Kt extends ya{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function fp(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Rd(n,e,t){const r=new Map;z(n.length===t.length);for(let i=0;i<t.length;i++){const s=n[i],o=s.transform,c=e.data.field(s.field);r.set(s.field,XE(o,c,t[i]))}return r}function bd(n,e,t){const r=new Map;for(const i of n){const s=i.transform,o=t.data.field(i.field);r.set(i.field,YE(s,o,e))}return r}class si extends ya{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Pu extends ya{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&tv(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=rs(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=rs(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=sp();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let c=this.applyToLocalView(o,s.mutatedFields);c=t.has(i.key)?null:c;const u=dp(o,c);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(K.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Q())}isEqual(e){return this.batchId===e.batchId&&Mr(this.mutations,e.mutations,(t,r)=>Ad(t,r))&&Mr(this.baseMutations,e.baseMutations,(t,r)=>Ad(t,r))}}class Du{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){z(e.mutations.length===r.length);let i=function(){return WE}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new Du(e,t,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ku{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mp{constructor(e,t,r){this.alias=e,this.aggregateType=t,this.fieldPath=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Se,ee;function pp(n){switch(n){default:return j();case C.CANCELLED:case C.UNKNOWN:case C.DEADLINE_EXCEEDED:case C.RESOURCE_EXHAUSTED:case C.INTERNAL:case C.UNAVAILABLE:case C.UNAUTHENTICATED:return!1;case C.INVALID_ARGUMENT:case C.NOT_FOUND:case C.ALREADY_EXISTS:case C.PERMISSION_DENIED:case C.FAILED_PRECONDITION:case C.ABORTED:case C.OUT_OF_RANGE:case C.UNIMPLEMENTED:case C.DATA_LOSS:return!0}}function gp(n){if(n===void 0)return Re("GRPC error has no .code"),C.UNKNOWN;switch(n){case Se.OK:return C.OK;case Se.CANCELLED:return C.CANCELLED;case Se.UNKNOWN:return C.UNKNOWN;case Se.DEADLINE_EXCEEDED:return C.DEADLINE_EXCEEDED;case Se.RESOURCE_EXHAUSTED:return C.RESOURCE_EXHAUSTED;case Se.INTERNAL:return C.INTERNAL;case Se.UNAVAILABLE:return C.UNAVAILABLE;case Se.UNAUTHENTICATED:return C.UNAUTHENTICATED;case Se.INVALID_ARGUMENT:return C.INVALID_ARGUMENT;case Se.NOT_FOUND:return C.NOT_FOUND;case Se.ALREADY_EXISTS:return C.ALREADY_EXISTS;case Se.PERMISSION_DENIED:return C.PERMISSION_DENIED;case Se.FAILED_PRECONDITION:return C.FAILED_PRECONDITION;case Se.ABORTED:return C.ABORTED;case Se.OUT_OF_RANGE:return C.OUT_OF_RANGE;case Se.UNIMPLEMENTED:return C.UNIMPLEMENTED;case Se.DATA_LOSS:return C.DATA_LOSS;default:return j()}}(ee=Se||(Se={}))[ee.OK=0]="OK",ee[ee.CANCELLED=1]="CANCELLED",ee[ee.UNKNOWN=2]="UNKNOWN",ee[ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ee[ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ee[ee.NOT_FOUND=5]="NOT_FOUND",ee[ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",ee[ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",ee[ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",ee[ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ee[ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ee[ee.ABORTED=10]="ABORTED",ee[ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",ee[ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",ee[ee.INTERNAL=13]="INTERNAL",ee[ee.UNAVAILABLE=14]="UNAVAILABLE",ee[ee.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ko=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _p(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=new Qn([4294967295,4294967295],0);function Sd(n){const e=_p().encode(n),t=new ym;return t.update(e),new Uint8Array(t.digest())}function Pd(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Qn([t,r],0),new Qn([i,s],0)]}class Nu{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Wi(`Invalid padding: ${t}`);if(r<0)throw new Wi(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Wi(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Wi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Qn.fromNumber(this.Ie)}Ee(e,t,r){let i=e.add(t.multiply(Qn.fromNumber(r)));return i.compare(iv)===1&&(i=new Qn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Sd(e),[r,i]=Pd(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);if(!this.de(o))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Nu(s,i,t);return r.forEach(c=>o.insert(c)),o}insert(e){if(this.Ie===0)return;const t=Sd(e),[r,i]=Pd(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Wi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,Os.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Vs(K.min(),i,new ae(H),tt(),Q())}}class Os{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Os(r,t,Q(),Q(),Q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No{constructor(e,t,r,i){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=i}}class yp{constructor(e,t){this.targetId=e,this.me=t}}class Ip{constructor(e,t,r=Te.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class Cd{constructor(){this.fe=0,this.ge=kd(),this.pe=Te.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=Q(),t=Q(),r=Q();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:j()}}),new Os(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=kd()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,z(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class sv{constructor(e){this.Le=e,this.Be=new Map,this.ke=tt(),this.qe=Dd(),this.Qe=new ae(H)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:j()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,r=e.me.count,i=this.Je(t);if(i){const s=i.target;if(zo(s))if(r===0){const o=new B(s.path);this.Ue(t,o,le.newNoDocument(o,K.min()))}else z(r===1);else{const o=this.Ye(t);if(o!==r){const c=this.Ze(e),u=c?this.Xe(c,e,o):1;if(u!==0){this.je(t);const l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,l)}Ko==null||Ko.et(function(d,m,g,T,w){var D,P,x,M,O,G;const W={localCacheCount:d,existenceFilterCount:m.count,databaseId:g.database,projectId:g.projectId},$=m.unchangedNames;return $&&(W.bloomFilter={applied:w===0,hashCount:(D=$==null?void 0:$.hashCount)!==null&&D!==void 0?D:0,bitmapLength:(M=(x=(P=$==null?void 0:$.bits)===null||P===void 0?void 0:P.bitmap)===null||x===void 0?void 0:x.length)!==null&&M!==void 0?M:0,padding:(G=(O=$==null?void 0:$.bits)===null||O===void 0?void 0:O.padding)!==null&&G!==void 0?G:0,mightContain:E=>{var _;return(_=T==null?void 0:T.mightContain(E))!==null&&_!==void 0&&_}}),W}(o,e.me,this.Le.tt(),c,u))}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let o,c;try{o=qt(r).toUint8Array()}catch(u){if(u instanceof Bm)return it("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new Nu(o,i,s)}catch(u){return it(u instanceof Wi?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.Ie===0?null:c}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let i=0;return r.forEach(s=>{const o=this.Le.tt(),c=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,s,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((s,o)=>{const c=this.Je(o);if(c){if(s.current&&zo(c.target)){const u=new B(c.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,le.newNoDocument(u,e))}s.be&&(t.set(o,s.ve()),s.Ce())}});let r=Q();this.qe.forEach((s,o)=>{let c=!0;o.forEachWhile(u=>{const l=this.Je(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(r=r.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new Vs(e,t,this.Qe,this.ke,r);return this.ke=tt(),this.qe=Dd(),this.Qe=new ae(H),i}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Cd,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new ie(H),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||V("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Cd),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Dd(){return new ae(B.comparator)}function kd(){return new ae(B.comparator)}const ov={asc:"ASCENDING",desc:"DESCENDING"},av={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},cv={and:"AND",or:"OR"};class uv{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Zc(n,e){return n.useProto3Json||Ps(e)?e:{value:e}}function Gr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Tp(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function lv(n,e){return Gr(n,e.toTimestamp())}function be(n){return z(!!n),K.fromTimestamp(function(t){const r=Bt(t);return new ge(r.seconds,r.nanos)}(n))}function Vu(n,e){return eu(n,e).canonicalString()}function eu(n,e){const t=function(i){return new X(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Ep(n){const e=X.fromString(n);return z(kp(e)),e}function ys(n,e){return Vu(n.databaseId,e.path)}function vt(n,e){const t=Ep(e);if(t.get(1)!==n.databaseId.projectId)throw new N(C.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new N(C.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new B(Ap(t))}function vp(n,e){return Vu(n.databaseId,e)}function wp(n){const e=Ep(n);return e.length===4?X.emptyPath():Ap(e)}function tu(n){return new X(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Ap(n){return z(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Nd(n,e,t){return{name:ys(n,e),fields:t.value.mapValue.fields}}function Rp(n,e,t){const r=vt(n,e.name),i=be(e.updateTime),s=e.createTime?be(e.createTime):K.min(),o=new Fe({mapValue:{fields:e.fields}}),c=le.newFoundDocument(r,i,s,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function hv(n,e){return"found"in e?function(r,i){z(!!i.found),i.found.name,i.found.updateTime;const s=vt(r,i.found.name),o=be(i.found.updateTime),c=i.found.createTime?be(i.found.createTime):K.min(),u=new Fe({mapValue:{fields:i.found.fields}});return le.newFoundDocument(s,o,c,u)}(n,e):"missing"in e?function(r,i){z(!!i.missing),z(!!i.readTime);const s=vt(r,i.missing),o=be(i.readTime);return le.newNoDocument(s,o)}(n,e):j()}function dv(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:j()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(l,d){return l.useProto3Json?(z(d===void 0||typeof d=="string"),Te.fromBase64String(d||"")):(z(d===void 0||d instanceof Buffer||d instanceof Uint8Array),Te.fromUint8Array(d||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&function(l){const d=l.code===void 0?C.UNKNOWN:gp(l.code);return new N(d,l.message||"")}(o);t=new Ip(r,i,s,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=vt(n,r.document.name),s=be(r.document.updateTime),o=r.document.createTime?be(r.document.createTime):K.min(),c=new Fe({mapValue:{fields:r.document.fields}}),u=le.newFoundDocument(i,s,o,c),l=r.targetIds||[],d=r.removedTargetIds||[];t=new No(l,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=vt(n,r.document),s=r.readTime?be(r.readTime):K.min(),o=le.newNoDocument(i,s),c=r.removedTargetIds||[];t=new No([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=vt(n,r.document),s=r.removedTargetIds||[];t=new No([],s,i,null)}else{if(!("filter"in e))return j();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new rv(i,s),c=r.targetId;t=new yp(c,o)}}return t}function Is(n,e){let t;if(e instanceof ii)t={update:Nd(n,e.key,e.value)};else if(e instanceof si)t={delete:ys(n,e.key)};else if(e instanceof Kt)t={update:Nd(n,e.key,e.data),updateMask:yv(e.fieldMask)};else{if(!(e instanceof Pu))return j();t={verify:ys(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const c=o.transform;if(c instanceof jr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof nr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof rr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof zr)return{fieldPath:o.field.canonicalString(),increment:c.Pe};throw j()}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:lv(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:j()}(n,e.precondition)),t}function nu(n,e){const t=e.currentDocument?function(s){return s.updateTime!==void 0?pe.updateTime(be(s.updateTime)):s.exists!==void 0?pe.exists(s.exists):pe.none()}(e.currentDocument):pe.none(),r=e.updateTransforms?e.updateTransforms.map(i=>function(o,c){let u=null;if("setToServerValue"in c)z(c.setToServerValue==="REQUEST_TIME"),u=new jr;else if("appendMissingElements"in c){const d=c.appendMissingElements.values||[];u=new nr(d)}else if("removeAllFromArray"in c){const d=c.removeAllFromArray.values||[];u=new rr(d)}else"increment"in c?u=new zr(o,c.increment):j();const l=he.fromServerFormat(c.fieldPath);return new Ns(l,u)}(n,i)):[];if(e.update){e.update.name;const i=vt(n,e.update.name),s=new Fe({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(u){const l=u.fieldPaths||[];return new et(l.map(d=>he.fromServerFormat(d)))}(e.updateMask);return new Kt(i,s,o,t,r)}return new ii(i,s,t,r)}if(e.delete){const i=vt(n,e.delete);return new si(i,t)}if(e.verify){const i=vt(n,e.verify);return new Pu(i,t)}return j()}function fv(n,e){return n&&n.length>0?(z(e!==void 0),n.map(t=>function(i,s){let o=i.updateTime?be(i.updateTime):be(s);return o.isEqual(K.min())&&(o=be(s)),new ev(o,i.transformResults||[])}(t,e))):[]}function bp(n,e){return{documents:[vp(n,e.path)]}}function Ia(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=vp(n,i);const s=function(l){if(l.length!==0)return Dp(re.create(l,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const o=function(l){if(l.length!==0)return l.map(d=>function(g){return{field:on(g.field),direction:pv(g.dir)}}(d))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Zc(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(l){return{before:l.inclusive,values:l.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(l){return{before:!l.inclusive,values:l.position}}(e.endAt)),{_t:t,parent:i}}function Sp(n,e,t,r){const{_t:i,parent:s}=Ia(n,e),o={},c=[];let u=0;return t.forEach(l=>{const d=r?l.alias:"aggregate_"+u++;o[d]=l.alias,l.aggregateType==="count"?c.push({alias:d,count:{}}):l.aggregateType==="avg"?c.push({alias:d,avg:{field:on(l.fieldPath)}}):l.aggregateType==="sum"&&c.push({alias:d,sum:{field:on(l.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:c,structuredQuery:i.structuredQuery},parent:i.parent},ut:o,parent:s}}function Pp(n){let e=wp(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){z(r===1);const d=t.from[0];d.allDescendants?i=d.collectionId:e=e.child(d.collectionId)}let s=[];t.where&&(s=function(m){const g=Cp(m);return g instanceof re&&Au(g)?g.getFilters():[g]}(t.where));let o=[];t.orderBy&&(o=function(m){return m.map(g=>function(w){return new _s(Sr(w.field),function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(w.direction))}(g))}(t.orderBy));let c=null;t.limit&&(c=function(m){let g;return g=typeof m=="object"?m.value:m,Ps(g)?null:g}(t.limit));let u=null;t.startAt&&(u=function(m){const g=!!m.before,T=m.values||[];return new wn(T,g)}(t.startAt));let l=null;return t.endAt&&(l=function(m){const g=!m.before,T=m.values||[];return new wn(T,g)}(t.endAt)),Ym(e,i,o,s,c,"F",u,l)}function mv(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return j()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Cp(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Sr(t.unaryFilter.field);return Z.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=Sr(t.unaryFilter.field);return Z.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Sr(t.unaryFilter.field);return Z.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Sr(t.unaryFilter.field);return Z.create(o,"!=",{nullValue:"NULL_VALUE"});default:return j()}}(n):n.fieldFilter!==void 0?function(t){return Z.create(Sr(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return j()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return re.create(t.compositeFilter.filters.map(r=>Cp(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return j()}}(t.compositeFilter.op))}(n):j()}function pv(n){return ov[n]}function gv(n){return av[n]}function _v(n){return cv[n]}function on(n){return{fieldPath:n.canonicalString()}}function Sr(n){return he.fromServerFormat(n.fieldPath)}function Dp(n){return n instanceof Z?function(t){if(t.op==="=="){if(pd(t.value))return{unaryFilter:{field:on(t.field),op:"IS_NAN"}};if(md(t.value))return{unaryFilter:{field:on(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(pd(t.value))return{unaryFilter:{field:on(t.field),op:"IS_NOT_NAN"}};if(md(t.value))return{unaryFilter:{field:on(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:on(t.field),op:gv(t.op),value:t.value}}}(n):n instanceof re?function(t){const r=t.getFilters().map(i=>Dp(i));return r.length===1?r[0]:{compositeFilter:{op:_v(t.op),filters:r}}}(n):j()}function yv(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function kp(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e,t,r,i,s=K.min(),o=K.min(),c=Te.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Ot(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ot(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ot(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ot(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np{constructor(e){this.ct=e}}function Iv(n,e){let t;if(e.document)t=Rp(n.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const r=B.fromSegments(e.noDocument.path),i=sr(e.noDocument.readTime);t=le.newNoDocument(r,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return j();{const r=B.fromSegments(e.unknownDocument.path),i=sr(e.unknownDocument.version);t=le.newUnknownDocument(r,i)}}return e.readTime&&t.setReadTime(function(i){const s=new ge(i[0],i[1]);return K.fromTimestamp(s)}(e.readTime)),t}function Vd(n,e){const t=e.key,r={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Ho(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())r.document=function(s,o){return{name:ys(s,o.key),fields:o.data.value.mapValue.fields,updateTime:Gr(s,o.version.toTimestamp()),createTime:Gr(s,o.createTime.toTimestamp())}}(n.ct,e);else if(e.isNoDocument())r.noDocument={path:t.path.toArray(),readTime:ir(e.version)};else{if(!e.isUnknownDocument())return j();r.unknownDocument={path:t.path.toArray(),version:ir(e.version)}}return r}function Ho(n){const e=n.toTimestamp();return[e.seconds,e.nanoseconds]}function ir(n){const e=n.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function sr(n){const e=new ge(n.seconds,n.nanoseconds);return K.fromTimestamp(e)}function $n(n,e){const t=(e.baseMutations||[]).map(s=>nu(n.ct,s));for(let s=0;s<e.mutations.length-1;++s){const o=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const c=e.mutations[s+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const r=e.mutations.map(s=>nu(n.ct,s)),i=ge.fromMillis(e.localWriteTimeMs);return new Cu(e.batchId,i,t,r)}function Qi(n){const e=sr(n.readTime),t=n.lastLimboFreeSnapshotVersion!==void 0?sr(n.lastLimboFreeSnapshotVersion):K.min();let r;return r=function(s){return s.documents!==void 0}(n.query)?function(s){return z(s.documents.length===1),He(ri(wp(s.documents[0])))}(n.query):function(s){return He(Pp(s))}(n.query),new Ot(r,n.targetId,"TargetPurposeListen",n.lastListenSequenceNumber,e,t,Te.fromBase64String(n.resumeToken))}function Vp(n,e){const t=ir(e.snapshotVersion),r=ir(e.lastLimboFreeSnapshotVersion);let i;i=zo(e.target)?bp(n.ct,e.target):Ia(n.ct,e.target)._t;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:tr(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function Ou(n){const e=Pp({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?$o(e,e.limit,"L"):e}function bc(n,e){return new ku(e.largestBatchId,nu(n.ct,e.overlayMutation))}function Od(n,e){const t=e.path.lastSegment();return[n,Ke(e.path.popLast()),t]}function xd(n,e,t,r){return{indexId:n,uid:e,sequenceNumber:t,readTime:ir(r.readTime),documentKey:Ke(r.documentKey.path),largestBatchId:r.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tv{getBundleMetadata(e,t){return Ld(e).get(t).next(r=>{if(r)return function(s){return{id:s.bundleId,createTime:sr(s.createTime),version:s.version}}(r)})}saveBundleMetadata(e,t){return Ld(e).put(function(i){return{bundleId:i.id,createTime:ir(be(i.createTime)),version:i.version}}(t))}getNamedQuery(e,t){return Md(e).get(t).next(r=>{if(r)return function(s){return{name:s.name,query:Ou(s.bundledQuery),readTime:sr(s.readTime)}}(r)})}saveNamedQuery(e,t){return Md(e).put(function(i){return{name:i.name,readTime:ir(be(i.readTime)),bundledQuery:i.bundledQuery}}(t))}}function Ld(n){return De(n,"bundles")}function Md(n){return De(n,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{constructor(e,t){this.serializer=e,this.userId=t}static lt(e,t){const r=t.uid||"";return new Ta(e,r)}getOverlay(e,t){return Mi(e).get(Od(this.userId,t)).next(r=>r?bc(this.serializer,r):null)}getOverlays(e,t){const r=It();return R.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){const i=[];return r.forEach((s,o)=>{const c=new ku(t,o);i.push(this.ht(e,c))}),R.waitFor(i)}removeOverlaysForBatchId(e,t,r){const i=new Set;t.forEach(o=>i.add(Ke(o.getCollectionPath())));const s=[];return i.forEach(o=>{const c=IDBKeyRange.bound([this.userId,o,r],[this.userId,o,r+1],!1,!0);s.push(Mi(e).j("collectionPathOverlayIndex",c))}),R.waitFor(s)}getOverlaysForCollection(e,t,r){const i=It(),s=Ke(t),o=IDBKeyRange.bound([this.userId,s,r],[this.userId,s,Number.POSITIVE_INFINITY],!0);return Mi(e).U("collectionPathOverlayIndex",o).next(c=>{for(const u of c){const l=bc(this.serializer,u);i.set(l.getKey(),l)}return i})}getOverlaysForCollectionGroup(e,t,r,i){const s=It();let o;const c=IDBKeyRange.bound([this.userId,t,r],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Mi(e).J({index:"collectionGroupOverlayIndex",range:c},(u,l,d)=>{const m=bc(this.serializer,l);s.size()<i||m.largestBatchId===o?(s.set(m.getKey(),m),o=m.largestBatchId):d.done()}).next(()=>s)}ht(e,t){return Mi(e).put(function(i,s,o){const[c,u,l]=Od(s,o.mutation.key);return{userId:s,collectionPath:u,documentId:l,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Is(i.ct,o.mutation)}}(this.serializer,this.userId,t))}}function Mi(n){return De(n,"documentOverlays")}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ev{Pt(e){return De(e,"globals")}getSessionToken(e){return this.Pt(e).get("sessionToken").next(t=>{const r=t==null?void 0:t.value;return r?Te.fromUint8Array(r):Te.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.Pt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(){}It(e,t){this.Tt(e,t),t.Et()}Tt(e,t){if("nullValue"in e)this.dt(t,5);else if("booleanValue"in e)this.dt(t,10),t.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(t,15),t.At(me(e.integerValue));else if("doubleValue"in e){const r=me(e.doubleValue);isNaN(r)?this.dt(t,13):(this.dt(t,15),fs(r)?t.At(0):t.At(r))}else if("timestampValue"in e){let r=e.timestampValue;this.dt(t,20),typeof r=="string"&&(r=Bt(r)),t.Rt(`${r.seconds||""}`),t.At(r.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,t),this.ft(t);else if("bytesValue"in e)this.dt(t,30),t.gt(qt(e.bytesValue)),this.ft(t);else if("referenceValue"in e)this.yt(e.referenceValue,t);else if("geoPointValue"in e){const r=e.geoPointValue;this.dt(t,45),t.At(r.latitude||0),t.At(r.longitude||0)}else"mapValue"in e?qm(e)?this.dt(t,Number.MAX_SAFE_INTEGER):ga(e)?this.wt(e.mapValue,t):(this.St(e.mapValue,t),this.ft(t)):"arrayValue"in e?(this.bt(e.arrayValue,t),this.ft(t)):j()}Vt(e,t){this.dt(t,25),this.Dt(e,t)}Dt(e,t){t.Rt(e)}St(e,t){const r=e.fields||{};this.dt(t,55);for(const i of Object.keys(r))this.Vt(i,t),this.Tt(r[i],t)}wt(e,t){var r,i;const s=e.fields||{};this.dt(t,53);const o="value",c=((i=(r=s[o].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.length)||0;this.dt(t,15),t.At(me(c)),this.Vt(o,t),this.Tt(s[o],t)}bt(e,t){const r=e.values||[];this.dt(t,50);for(const i of r)this.Tt(i,t)}yt(e,t){this.dt(t,37),B.fromName(e).path.forEach(r=>{this.dt(t,60),this.Dt(r,t)})}dt(e,t){e.At(t)}ft(e){e.At(2)}}Kn.vt=new Kn;function vv(n){if(n===0)return 8;let e=0;return!(n>>4)&&(e+=4,n<<=4),!(n>>6)&&(e+=2,n<<=2),!(n>>7)&&(e+=1),e}function Fd(n){const e=64-function(r){let i=0;for(let s=0;s<8;++s){const o=vv(255&r[s]);if(i+=o,o!==8)break}return i}(n);return Math.ceil(e/8)}class wv{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(e){const t=e[Symbol.iterator]();let r=t.next();for(;!r.done;)this.Ft(r.value),r=t.next();this.Mt()}xt(e){const t=e[Symbol.iterator]();let r=t.next();for(;!r.done;)this.Ot(r.value),r=t.next();this.Nt()}Lt(e){for(const t of e){const r=t.charCodeAt(0);if(r<128)this.Ft(r);else if(r<2048)this.Ft(960|r>>>6),this.Ft(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.Ft(480|r>>>12),this.Ft(128|63&r>>>6),this.Ft(128|63&r);else{const i=t.codePointAt(0);this.Ft(240|i>>>18),this.Ft(128|63&i>>>12),this.Ft(128|63&i>>>6),this.Ft(128|63&i)}}this.Mt()}Bt(e){for(const t of e){const r=t.charCodeAt(0);if(r<128)this.Ot(r);else if(r<2048)this.Ot(960|r>>>6),this.Ot(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.Ot(480|r>>>12),this.Ot(128|63&r>>>6),this.Ot(128|63&r);else{const i=t.codePointAt(0);this.Ot(240|i>>>18),this.Ot(128|63&i>>>12),this.Ot(128|63&i>>>6),this.Ot(128|63&i)}}this.Nt()}kt(e){const t=this.qt(e),r=Fd(t);this.Qt(1+r),this.buffer[this.position++]=255&r;for(let i=t.length-r;i<t.length;++i)this.buffer[this.position++]=255&t[i]}Kt(e){const t=this.qt(e),r=Fd(t);this.Qt(1+r),this.buffer[this.position++]=~(255&r);for(let i=t.length-r;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}$t(){this.Ut(255),this.Ut(255)}Wt(){this.Gt(255),this.Gt(255)}reset(){this.position=0}seed(e){this.Qt(e.length),this.buffer.set(e,this.position),this.position+=e.length}zt(){return this.buffer.slice(0,this.position)}qt(e){const t=function(s){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,s,!1),new Uint8Array(o.buffer)}(e),r=(128&t[0])!=0;t[0]^=r?255:128;for(let i=1;i<t.length;++i)t[i]^=r?255:0;return t}Ft(e){const t=255&e;t===0?(this.Ut(0),this.Ut(255)):t===255?(this.Ut(255),this.Ut(0)):this.Ut(t)}Ot(e){const t=255&e;t===0?(this.Gt(0),this.Gt(255)):t===255?(this.Gt(255),this.Gt(0)):this.Gt(e)}Mt(){this.Ut(0),this.Ut(1)}Nt(){this.Gt(0),this.Gt(1)}Ut(e){this.Qt(1),this.buffer[this.position++]=e}Gt(e){this.Qt(1),this.buffer[this.position++]=~e}Qt(e){const t=e+this.position;if(t<=this.buffer.length)return;let r=2*this.buffer.length;r<t&&(r=t);const i=new Uint8Array(r);i.set(this.buffer),this.buffer=i}}class Av{constructor(e){this.jt=e}gt(e){this.jt.Ct(e)}Rt(e){this.jt.Lt(e)}At(e){this.jt.kt(e)}Et(){this.jt.$t()}}class Rv{constructor(e){this.jt=e}gt(e){this.jt.xt(e)}Rt(e){this.jt.Bt(e)}At(e){this.jt.Kt(e)}Et(){this.jt.Wt()}}class Fi{constructor(){this.jt=new wv,this.Ht=new Av(this.jt),this.Jt=new Rv(this.jt)}seed(e){this.jt.seed(e)}Yt(e){return e===0?this.Ht:this.Jt}zt(){return this.jt.zt()}reset(){this.jt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn{constructor(e,t,r,i){this.indexId=e,this.documentKey=t,this.arrayValue=r,this.directionalValue=i}Zt(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,r=new Uint8Array(t);return r.set(this.directionalValue,0),t!==e?r.set([0],this.directionalValue.length):++r[r.length-1],new Hn(this.indexId,this.documentKey,this.arrayValue,r)}}function tn(n,e){let t=n.indexId-e.indexId;return t!==0?t:(t=Ud(n.arrayValue,e.arrayValue),t!==0?t:(t=Ud(n.directionalValue,e.directionalValue),t!==0?t:B.comparator(n.documentKey,e.documentKey)))}function Ud(n,e){for(let t=0;t<n.length&&t<e.length;++t){const r=n[t]-e[t];if(r!==0)return r}return n.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{constructor(e){this.Xt=new ie((t,r)=>he.comparator(t.field,r.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.en=e.orderBy,this.tn=[];for(const t of e.filters){const r=t;r.isInequality()?this.Xt=this.Xt.add(r):this.tn.push(r)}}get nn(){return this.Xt.size>1}rn(e){if(z(e.collectionGroup===this.collectionId),this.nn)return!1;const t=$c(e);if(t!==void 0&&!this.sn(t))return!1;const r=zn(e);let i=new Set,s=0,o=0;for(;s<r.length&&this.sn(r[s]);++s)i=i.add(r[s].fieldPath.canonicalString());if(s===r.length)return!0;if(this.Xt.size>0){const c=this.Xt.getIterator().getNext();if(!i.has(c.field.canonicalString())){const u=r[s];if(!this.on(c,u)||!this._n(this.en[o++],u))return!1}++s}for(;s<r.length;++s){const c=r[s];if(o>=this.en.length||!this._n(this.en[o++],c))return!1}return!0}an(){if(this.nn)return null;let e=new ie(he.comparator);const t=[];for(const r of this.tn)if(!r.field.isKeyField())if(r.op==="array-contains"||r.op==="array-contains-any")t.push(new Jn(r.field,2));else{if(e.has(r.field))continue;e=e.add(r.field),t.push(new Jn(r.field,0))}for(const r of this.en)r.field.isKeyField()||e.has(r.field)||(e=e.add(r.field),t.push(new Jn(r.field,r.dir==="asc"?0:1)));return new Fr(Fr.UNKNOWN_ID,this.collectionId,t,Ur.empty())}sn(e){for(const t of this.tn)if(this.on(t,e))return!0;return!1}on(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const r=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===r}_n(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Op(n){var e,t;if(z(n instanceof Z||n instanceof re),n instanceof Z){if(n instanceof Jm){const i=((t=(e=n.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(s=>Z.create(n.field,"==",s)))||[];return re.create(i,"or")}return n}const r=n.filters.map(i=>Op(i));return re.create(r,n.op)}function bv(n){if(n.getFilters().length===0)return[];const e=su(Op(n));return z(xp(e)),ru(e)||iu(e)?[e]:e.getFilters()}function ru(n){return n instanceof Z}function iu(n){return n instanceof re&&Au(n)}function xp(n){return ru(n)||iu(n)||function(t){if(t instanceof re&&Qc(t)){for(const r of t.getFilters())if(!ru(r)&&!iu(r))return!1;return!0}return!1}(n)}function su(n){if(z(n instanceof Z||n instanceof re),n instanceof Z)return n;if(n.filters.length===1)return su(n.filters[0]);const e=n.filters.map(r=>su(r));let t=re.create(e,n.op);return t=Wo(t),xp(t)?t:(z(t instanceof re),z(qr(t)),z(t.filters.length>1),t.filters.reduce((r,i)=>xu(r,i)))}function xu(n,e){let t;return z(n instanceof Z||n instanceof re),z(e instanceof Z||e instanceof re),t=n instanceof Z?e instanceof Z?function(i,s){return re.create([i,s],"and")}(n,e):qd(n,e):e instanceof Z?qd(e,n):function(i,s){if(z(i.filters.length>0&&s.filters.length>0),qr(i)&&qr(s))return Hm(i,s.getFilters());const o=Qc(i)?i:s,c=Qc(i)?s:i,u=o.filters.map(l=>xu(l,c));return re.create(u,"or")}(n,e),Wo(t)}function qd(n,e){if(qr(e))return Hm(e,n.getFilters());{const t=e.filters.map(r=>xu(n,r));return re.create(t,"or")}}function Wo(n){if(z(n instanceof Z||n instanceof re),n instanceof Z)return n;const e=n.getFilters();if(e.length===1)return Wo(e[0]);if($m(n))return n;const t=e.map(i=>Wo(i)),r=[];return t.forEach(i=>{i instanceof Z?r.push(i):i instanceof re&&(i.op===n.op?r.push(...i.filters):r.push(i))}),r.length===1?r[0]:re.create(r,n.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sv{constructor(){this.un=new Lu}addToCollectionParentIndex(e,t){return this.un.add(t),R.resolve()}getCollectionParents(e,t){return R.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return R.resolve()}deleteFieldIndex(e,t){return R.resolve()}deleteAllFieldIndexes(e){return R.resolve()}createTargetIndexes(e,t){return R.resolve()}getDocumentsMatchingTarget(e,t){return R.resolve(null)}getIndexType(e,t){return R.resolve(0)}getFieldIndexes(e,t){return R.resolve([])}getNextCollectionGroupToUpdate(e){return R.resolve(null)}getMinOffset(e,t){return R.resolve(st.min())}getMinOffsetFromCollectionGroup(e,t){return R.resolve(st.min())}updateCollectionGroup(e,t,r){return R.resolve()}updateIndexEntries(e,t){return R.resolve()}}class Lu{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new ie(X.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new ie(X.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _o=new Uint8Array(0);class Pv{constructor(e,t){this.databaseId=t,this.cn=new Lu,this.ln=new $t(r=>tr(r),(r,i)=>Cs(r,i)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.cn.has(t)){const r=t.lastSegment(),i=t.popLast();e.addOnCommittedListener(()=>{this.cn.add(t)});const s={collectionId:r,parent:Ke(i)};return jd(e).put(s)}return R.resolve()}getCollectionParents(e,t){const r=[],i=IDBKeyRange.bound([t,""],[Sm(t),""],!1,!0);return jd(e).U(i).next(s=>{for(const o of s){if(o.collectionId!==t)break;r.push(yt(o.parent))}return r})}addFieldIndex(e,t){const r=Ui(e),i=function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(t);delete i.indexId;const s=r.add(i);if(t.indexState){const o=Er(e);return s.next(c=>{o.put(xd(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const r=Ui(e),i=Er(e),s=Tr(e);return r.delete(t.indexId).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Ui(e),r=Tr(e),i=Er(e);return t.j().next(()=>r.j()).next(()=>i.j())}createTargetIndexes(e,t){return R.forEach(this.hn(t),r=>this.getIndexType(e,r).next(i=>{if(i===0||i===1){const s=new Bd(r).an();if(s!=null)return this.addFieldIndex(e,s)}}))}getDocumentsMatchingTarget(e,t){const r=Tr(e);let i=!0;const s=new Map;return R.forEach(this.hn(t),o=>this.Pn(e,o).next(c=>{i&&(i=!!c),s.set(o,c)})).next(()=>{if(i){let o=Q();const c=[];return R.forEach(s,(u,l)=>{V("IndexedDbIndexManager",`Using index ${function(O){return`id=${O.indexId}|cg=${O.collectionGroup}|f=${O.fields.map(G=>`${G.fieldPath}:${G.kind}`).join(",")}`}(u)} to execute ${tr(t)}`);const d=function(O,G){const W=$c(G);if(W===void 0)return null;for(const $ of Go(O,W.fieldPath))switch($.op){case"array-contains-any":return $.value.arrayValue.values||[];case"array-contains":return[$.value]}return null}(l,u),m=function(O,G){const W=new Map;for(const $ of zn(G))for(const E of Go(O,$.fieldPath))switch(E.op){case"==":case"in":W.set($.fieldPath.canonicalString(),E.value);break;case"not-in":case"!=":return W.set($.fieldPath.canonicalString(),E.value),Array.from(W.values())}return null}(l,u),g=function(O,G){const W=[];let $=!0;for(const E of zn(G)){const _=E.kind===0?Td(O,E.fieldPath,O.startAt):Ed(O,E.fieldPath,O.startAt);W.push(_.value),$&&($=_.inclusive)}return new wn(W,$)}(l,u),T=function(O,G){const W=[];let $=!0;for(const E of zn(G)){const _=E.kind===0?Ed(O,E.fieldPath,O.endAt):Td(O,E.fieldPath,O.endAt);W.push(_.value),$&&($=_.inclusive)}return new wn(W,$)}(l,u),w=this.In(u,l,g),D=this.In(u,l,T),P=this.Tn(u,l,m),x=this.En(u.indexId,d,w,g.inclusive,D,T.inclusive,P);return R.forEach(x,M=>r.G(M,t.limit).next(O=>{O.forEach(G=>{const W=B.fromSegments(G.documentKey);o.has(W)||(o=o.add(W),c.push(W))})}))}).next(()=>c)}return R.resolve(null)})}hn(e){let t=this.ln.get(e);return t||(e.filters.length===0?t=[e]:t=bv(re.create(e.filters,"and")).map(r=>Yc(e.path,e.collectionGroup,e.orderBy,r.getFilters(),e.limit,e.startAt,e.endAt)),this.ln.set(e,t),t)}En(e,t,r,i,s,o,c){const u=(t!=null?t.length:1)*Math.max(r.length,s.length),l=u/(t!=null?t.length:1),d=[];for(let m=0;m<u;++m){const g=t?this.dn(t[m/l]):_o,T=this.An(e,g,r[m%l],i),w=this.Rn(e,g,s[m%l],o),D=c.map(P=>this.An(e,g,P,!0));d.push(...this.createRange(T,w,D))}return d}An(e,t,r,i){const s=new Hn(e,B.empty(),t,r);return i?s:s.Zt()}Rn(e,t,r,i){const s=new Hn(e,B.empty(),t,r);return i?s.Zt():s}Pn(e,t){const r=new Bd(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next(s=>{let o=null;for(const c of s)r.rn(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o})}getIndexType(e,t){let r=2;const i=this.hn(t);return R.forEach(i,s=>this.Pn(e,s).next(o=>{o?r!==0&&o.fields.length<function(u){let l=new ie(he.comparator),d=!1;for(const m of u.filters)for(const g of m.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?d=!0:l=l.add(g.field));for(const m of u.orderBy)m.field.isKeyField()||(l=l.add(m.field));return l.size+(d?1:0)}(s)&&(r=1):r=0})).next(()=>function(o){return o.limit!==null}(t)&&i.length>1&&r===2?1:r)}Vn(e,t){const r=new Fi;for(const i of zn(e)){const s=t.data.field(i.fieldPath);if(s==null)return null;const o=r.Yt(i.kind);Kn.vt.It(s,o)}return r.zt()}dn(e){const t=new Fi;return Kn.vt.It(e,t.Yt(0)),t.zt()}mn(e,t){const r=new Fi;return Kn.vt.It(er(this.databaseId,t),r.Yt(function(s){const o=zn(s);return o.length===0?0:o[o.length-1].kind}(e))),r.zt()}Tn(e,t,r){if(r===null)return[];let i=[];i.push(new Fi);let s=0;for(const o of zn(e)){const c=r[s++];for(const u of i)if(this.fn(t,o.fieldPath)&&gs(c))i=this.gn(i,o,c);else{const l=u.Yt(o.kind);Kn.vt.It(c,l)}}return this.pn(i)}In(e,t,r){return this.Tn(e,t,r.position)}pn(e){const t=[];for(let r=0;r<e.length;++r)t[r]=e[r].zt();return t}gn(e,t,r){const i=[...e],s=[];for(const o of r.arrayValue.values||[])for(const c of i){const u=new Fi;u.seed(c.zt()),Kn.vt.It(o,u.Yt(t.kind)),s.push(u)}return s}fn(e,t){return!!e.filters.find(r=>r instanceof Z&&r.field.isEqual(t)&&(r.op==="in"||r.op==="not-in"))}getFieldIndexes(e,t){const r=Ui(e),i=Er(e);return(t?r.U("collectionGroupIndex",IDBKeyRange.bound(t,t)):r.U()).next(s=>{const o=[];return R.forEach(s,c=>i.get([c.indexId,this.uid]).next(u=>{o.push(function(d,m){const g=m?new Ur(m.sequenceNumber,new st(sr(m.readTime),new B(yt(m.documentKey)),m.largestBatchId)):Ur.empty(),T=d.fields.map(([w,D])=>new Jn(he.fromServerFormat(w),D));return new Fr(d.indexId,d.collectionGroup,T,g)}(c,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((r,i)=>{const s=r.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:H(r.collectionGroup,i.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,r){const i=Ui(e),s=Er(e);return this.yn(e).next(o=>i.U("collectionGroupIndex",IDBKeyRange.bound(t,t)).next(c=>R.forEach(c,u=>s.put(xd(u.indexId,this.uid,o,r)))))}updateIndexEntries(e,t){const r=new Map;return R.forEach(t,(i,s)=>{const o=r.get(i.collectionGroup);return(o?R.resolve(o):this.getFieldIndexes(e,i.collectionGroup)).next(c=>(r.set(i.collectionGroup,c),R.forEach(c,u=>this.wn(e,i,u).next(l=>{const d=this.Sn(s,u);return l.isEqual(d)?R.resolve():this.bn(e,s,u,l,d)}))))})}Dn(e,t,r,i){return Tr(e).put({indexId:i.indexId,uid:this.uid,arrayValue:i.arrayValue,directionalValue:i.directionalValue,orderedDocumentKey:this.mn(r,t.key),documentKey:t.key.path.toArray()})}vn(e,t,r,i){return Tr(e).delete([i.indexId,this.uid,i.arrayValue,i.directionalValue,this.mn(r,t.key),t.key.path.toArray()])}wn(e,t,r){const i=Tr(e);let s=new ie(tn);return i.J({index:"documentKeyIndex",range:IDBKeyRange.only([r.indexId,this.uid,this.mn(r,t)])},(o,c)=>{s=s.add(new Hn(r.indexId,t,c.arrayValue,c.directionalValue))}).next(()=>s)}Sn(e,t){let r=new ie(tn);const i=this.Vn(t,e);if(i==null)return r;const s=$c(t);if(s!=null){const o=e.data.field(s.fieldPath);if(gs(o))for(const c of o.arrayValue.values||[])r=r.add(new Hn(t.indexId,e.key,this.dn(c),i))}else r=r.add(new Hn(t.indexId,e.key,_o,i));return r}bn(e,t,r,i,s){V("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);const o=[];return function(u,l,d,m,g){const T=u.getIterator(),w=l.getIterator();let D=Ir(T),P=Ir(w);for(;D||P;){let x=!1,M=!1;if(D&&P){const O=d(D,P);O<0?M=!0:O>0&&(x=!0)}else D!=null?M=!0:x=!0;x?(m(P),P=Ir(w)):M?(g(D),D=Ir(T)):(D=Ir(T),P=Ir(w))}}(i,s,tn,c=>{o.push(this.Dn(e,t,r,c))},c=>{o.push(this.vn(e,t,r,c))}),R.waitFor(o)}yn(e){let t=1;return Er(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(r,i,s)=>{s.done(),t=i.sequenceNumber+1}).next(()=>t)}createRange(e,t,r){r=r.sort((o,c)=>tn(o,c)).filter((o,c,u)=>!c||tn(o,u[c-1])!==0);const i=[];i.push(e);for(const o of r){const c=tn(o,e),u=tn(o,t);if(c===0)i[0]=e.Zt();else if(c>0&&u<0)i.push(o),i.push(o.Zt());else if(u>0)break}i.push(t);const s=[];for(let o=0;o<i.length;o+=2){if(this.Cn(i[o],i[o+1]))return[];const c=[i[o].indexId,this.uid,i[o].arrayValue,i[o].directionalValue,_o,[]],u=[i[o+1].indexId,this.uid,i[o+1].arrayValue,i[o+1].directionalValue,_o,[]];s.push(IDBKeyRange.bound(c,u))}return s}Cn(e,t){return tn(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(zd)}getMinOffset(e,t){return R.mapArray(this.hn(t),r=>this.Pn(e,r).next(i=>i||j())).next(zd)}}function jd(n){return De(n,"collectionParents")}function Tr(n){return De(n,"indexEntries")}function Ui(n){return De(n,"indexConfiguration")}function Er(n){return De(n,"indexState")}function zd(n){z(n.length!==0);let e=n[0].indexState.offset,t=e.largestBatchId;for(let r=1;r<n.length;r++){const i=n[r].indexState.offset;Eu(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new st(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gd={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class Ge{constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}static withCacheSize(e){return new Ge(e,Ge.DEFAULT_COLLECTION_PERCENTILE,Ge.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lp(n,e,t){const r=n.store("mutations"),i=n.store("documentMutations"),s=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=r.J({range:o},(d,m,g)=>(c++,g.delete()));s.push(u.next(()=>{z(c===1)}));const l=[];for(const d of t.mutations){const m=Om(e,d.key.path,t.batchId);s.push(i.delete(m)),l.push(d.key)}return R.waitFor(s).next(()=>l)}function Qo(n){if(!n)return 0;let e;if(n.document)e=n.document;else if(n.unknownDocument)e=n.unknownDocument;else{if(!n.noDocument)throw j();e=n.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ge.DEFAULT_COLLECTION_PERCENTILE=10,Ge.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ge.DEFAULT=new Ge(41943040,Ge.DEFAULT_COLLECTION_PERCENTILE,Ge.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ge.DISABLED=new Ge(-1,0,0);class Ea{constructor(e,t,r,i){this.userId=e,this.serializer=t,this.indexManager=r,this.referenceDelegate=i,this.Fn={}}static lt(e,t,r,i){z(e.uid!=="");const s=e.isAuthenticated()?e.uid:"";return new Ea(s,t,r,i)}checkEmpty(e){let t=!0;const r=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return nn(e).J({index:"userMutationsIndex",range:r},(i,s,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,r,i){const s=Pr(e),o=nn(e);return o.add({}).next(c=>{z(typeof c=="number");const u=new Cu(c,t,r,i),l=function(T,w,D){const P=D.baseMutations.map(M=>Is(T.ct,M)),x=D.mutations.map(M=>Is(T.ct,M));return{userId:w,batchId:D.batchId,localWriteTimeMs:D.localWriteTime.toMillis(),baseMutations:P,mutations:x}}(this.serializer,this.userId,u),d=[];let m=new ie((g,T)=>H(g.canonicalString(),T.canonicalString()));for(const g of i){const T=Om(this.userId,g.key.path,c);m=m.add(g.key.path.popLast()),d.push(o.put(l)),d.push(s.put(T,pE))}return m.forEach(g=>{d.push(this.indexManager.addToCollectionParentIndex(e,g))}),e.addOnCommittedListener(()=>{this.Fn[c]=u.keys()}),R.waitFor(d).next(()=>u)})}lookupMutationBatch(e,t){return nn(e).get(t).next(r=>r?(z(r.userId===this.userId),$n(this.serializer,r)):null)}Mn(e,t){return this.Fn[t]?R.resolve(this.Fn[t]):this.lookupMutationBatch(e,t).next(r=>{if(r){const i=r.keys();return this.Fn[t]=i,i}return null})}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=IDBKeyRange.lowerBound([this.userId,r]);let s=null;return nn(e).J({index:"userMutationsIndex",range:i},(o,c,u)=>{c.userId===this.userId&&(z(c.batchId>=r),s=$n(this.serializer,c)),u.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let r=-1;return nn(e).J({index:"userMutationsIndex",range:t,reverse:!0},(i,s,o)=>{r=s.batchId,o.done()}).next(()=>r)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return nn(e).U("userMutationsIndex",t).next(r=>r.map(i=>$n(this.serializer,i)))}getAllMutationBatchesAffectingDocumentKey(e,t){const r=So(this.userId,t.path),i=IDBKeyRange.lowerBound(r),s=[];return Pr(e).J({range:i},(o,c,u)=>{const[l,d,m]=o,g=yt(d);if(l===this.userId&&t.path.isEqual(g))return nn(e).get(m).next(T=>{if(!T)throw j();z(T.userId===this.userId),s.push($n(this.serializer,T))});u.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ie(H);const i=[];return t.forEach(s=>{const o=So(this.userId,s.path),c=IDBKeyRange.lowerBound(o),u=Pr(e).J({range:c},(l,d,m)=>{const[g,T,w]=l,D=yt(T);g===this.userId&&s.path.isEqual(D)?r=r.add(w):m.done()});i.push(u)}),R.waitFor(i).next(()=>this.xn(e,r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1,s=So(this.userId,r),o=IDBKeyRange.lowerBound(s);let c=new ie(H);return Pr(e).J({range:o},(u,l,d)=>{const[m,g,T]=u,w=yt(g);m===this.userId&&r.isPrefixOf(w)?w.length===i&&(c=c.add(T)):d.done()}).next(()=>this.xn(e,c))}xn(e,t){const r=[],i=[];return t.forEach(s=>{i.push(nn(e).get(s).next(o=>{if(o===null)throw j();z(o.userId===this.userId),r.push($n(this.serializer,o))}))}),R.waitFor(i).next(()=>r)}removeMutationBatch(e,t){return Lp(e._e,this.userId,t).next(r=>(e.addOnCommittedListener(()=>{this.On(t.batchId)}),R.forEach(r,i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))}On(e){delete this.Fn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return R.resolve();const r=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),i=[];return Pr(e).J({range:r},(s,o,c)=>{if(s[0]===this.userId){const u=yt(s[1]);i.push(u)}else c.done()}).next(()=>{z(i.length===0)})})}containsKey(e,t){return Mp(e,this.userId,t)}Nn(e){return Fp(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function Mp(n,e,t){const r=So(e,t.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return Pr(n).J({range:s,H:!0},(c,u,l)=>{const[d,m,g]=c;d===e&&m===i&&(o=!0),l.done()}).next(()=>o)}function nn(n){return De(n,"mutations")}function Pr(n){return De(n,"documentMutations")}function Fp(n){return De(n,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new or(0)}static kn(){return new or(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.qn(e).next(t=>{const r=new or(t.highestTargetId);return t.highestTargetId=r.next(),this.Qn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.qn(e).next(t=>K.fromTimestamp(new ge(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.qn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,r){return this.qn(e).next(i=>(i.highestListenSequenceNumber=t,r&&(i.lastRemoteSnapshotVersion=r.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.Qn(e,i)))}addTargetData(e,t){return this.Kn(e,t).next(()=>this.qn(e).next(r=>(r.targetCount+=1,this.$n(t,r),this.Qn(e,r))))}updateTargetData(e,t){return this.Kn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>vr(e).delete(t.targetId)).next(()=>this.qn(e)).next(r=>(z(r.targetCount>0),r.targetCount-=1,this.Qn(e,r)))}removeTargets(e,t,r){let i=0;const s=[];return vr(e).J((o,c)=>{const u=Qi(c);u.sequenceNumber<=t&&r.get(u.targetId)===null&&(i++,s.push(this.removeTargetData(e,u)))}).next(()=>R.waitFor(s)).next(()=>i)}forEachTarget(e,t){return vr(e).J((r,i)=>{const s=Qi(i);t(s)})}qn(e){return $d(e).get("targetGlobalKey").next(t=>(z(t!==null),t))}Qn(e,t){return $d(e).put("targetGlobalKey",t)}Kn(e,t){return vr(e).put(Vp(this.serializer,t))}$n(e,t){let r=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,r=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,r=!0),r}getTargetCount(e){return this.qn(e).next(t=>t.targetCount)}getTargetData(e,t){const r=tr(t),i=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]);let s=null;return vr(e).J({range:i,index:"queryTargetsIndex"},(o,c,u)=>{const l=Qi(c);Cs(t,l.target)&&(s=l,u.done())}).next(()=>s)}addMatchingKeys(e,t,r){const i=[],s=an(e);return t.forEach(o=>{const c=Ke(o.path);i.push(s.put({targetId:r,path:c})),i.push(this.referenceDelegate.addReference(e,r,o))}),R.waitFor(i)}removeMatchingKeys(e,t,r){const i=an(e);return R.forEach(t,s=>{const o=Ke(s.path);return R.waitFor([i.delete([r,o]),this.referenceDelegate.removeReference(e,r,s)])})}removeMatchingKeysForTargetId(e,t){const r=an(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return r.delete(i)}getMatchingKeysForTargetId(e,t){const r=IDBKeyRange.bound([t],[t+1],!1,!0),i=an(e);let s=Q();return i.J({range:r,H:!0},(o,c,u)=>{const l=yt(o[1]),d=new B(l);s=s.add(d)}).next(()=>s)}containsKey(e,t){const r=Ke(t.path),i=IDBKeyRange.bound([r],[Sm(r)],!1,!0);let s=0;return an(e).J({index:"documentTargetsIndex",H:!0,range:i},([o,c],u,l)=>{o!==0&&(s++,l.done())}).next(()=>s>0)}ot(e,t){return vr(e).get(t).next(r=>r?Qi(r):null)}}function vr(n){return De(n,"targets")}function $d(n){return De(n,"targetGlobal")}function an(n){return De(n,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kd([n,e],[t,r]){const i=H(n,t);return i===0?H(e,r):i}class Dv{constructor(e){this.Un=e,this.buffer=new ie(Kd),this.Wn=0}Gn(){return++this.Wn}zn(e){const t=[e,this.Gn()];if(this.buffer.size<this.Un)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Kd(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Up{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.jn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Hn(6e4)}stop(){this.jn&&(this.jn.cancel(),this.jn=null)}get started(){return this.jn!==null}Hn(e){V("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Dn(t)?V("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await Cn(t)}await this.Hn(3e5)})}}class kv{constructor(e,t){this.Jn=e,this.params=t}calculateTargetCount(e,t){return this.Jn.Yn(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return R.resolve(Ze.oe);const r=new Dv(t);return this.Jn.forEachTarget(e,i=>r.zn(i.sequenceNumber)).next(()=>this.Jn.Zn(e,i=>r.zn(i))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.Jn.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Jn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(V("LruGarbageCollector","Garbage collection skipped; disabled"),R.resolve(Gd)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(V("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Gd):this.Xn(e,t))}getCacheSize(e){return this.Jn.getCacheSize(e)}Xn(e,t){let r,i,s,o,c,u,l;const d=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(V("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),i=this.params.maximumSequenceNumbersToCollect):i=m,o=Date.now(),this.nthSequenceNumber(e,i))).next(m=>(r=m,c=Date.now(),this.removeTargets(e,r,t))).next(m=>(s=m,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(m=>(l=Date.now(),Rr()<=Y.DEBUG&&V("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-d}ms
	Determined least recently used ${i} in `+(c-o)+`ms
	Removed ${s} targets in `+(u-c)+`ms
	Removed ${m} documents in `+(l-u)+`ms
Total Duration: ${l-d}ms`),R.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:m})))}}function Bp(n,e){return new kv(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nv{constructor(e,t){this.db=e,this.garbageCollector=Bp(this,t)}Yn(e){const t=this.er(e);return this.db.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}er(e){let t=0;return this.Zn(e,r=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Zn(e,t){return this.tr(e,(r,i)=>t(i))}addReference(e,t,r){return yo(e,r)}removeReference(e,t,r){return yo(e,r)}removeTargets(e,t,r){return this.db.getTargetCache().removeTargets(e,t,r)}markPotentiallyOrphaned(e,t){return yo(e,t)}nr(e,t){return function(i,s){let o=!1;return Fp(i).Y(c=>Mp(i,c,s).next(u=>(u&&(o=!0),R.resolve(!u)))).next(()=>o)}(e,t)}removeOrphanedDocuments(e,t){const r=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.tr(e,(o,c)=>{if(c<=t){const u=this.nr(e,o).next(l=>{if(!l)return s++,r.getEntry(e,o).next(()=>(r.removeEntry(o,K.min()),an(e).delete(function(m){return[0,Ke(m.path)]}(o))))});i.push(u)}}).next(()=>R.waitFor(i)).next(()=>r.apply(e)).next(()=>s)}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,r)}updateLimboDocument(e,t){return yo(e,t)}tr(e,t){const r=an(e);let i,s=Ze.oe;return r.J({index:"documentTargetsIndex"},([o,c],{path:u,sequenceNumber:l})=>{o===0?(s!==Ze.oe&&t(new B(yt(i)),s),s=l,i=u):s=Ze.oe}).next(()=>{s!==Ze.oe&&t(new B(yt(i)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function yo(n,e){return an(n).put(function(r,i){return{targetId:0,path:Ke(r.path),sequenceNumber:i}}(e,n.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(){this.changes=new $t(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,le.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?R.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vv{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,r){return qn(e).put(r)}removeEntry(e,t,r){return qn(e).delete(function(s,o){const c=s.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],Ho(o),c[c.length-1]]}(t,r))}updateMetadata(e,t){return this.getMetadata(e).next(r=>(r.byteSize+=t,this.rr(e,r)))}getEntry(e,t){let r=le.newInvalidDocument(t);return qn(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(Bi(t))},(i,s)=>{r=this.ir(t,s)}).next(()=>r)}sr(e,t){let r={size:0,document:le.newInvalidDocument(t)};return qn(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(Bi(t))},(i,s)=>{r={document:this.ir(t,s),size:Qo(s)}}).next(()=>r)}getEntries(e,t){let r=tt();return this._r(e,t,(i,s)=>{const o=this.ir(i,s);r=r.insert(i,o)}).next(()=>r)}ar(e,t){let r=tt(),i=new ae(B.comparator);return this._r(e,t,(s,o)=>{const c=this.ir(s,o);r=r.insert(s,c),i=i.insert(s,Qo(o))}).next(()=>({documents:r,ur:i}))}_r(e,t,r){if(t.isEmpty())return R.resolve();let i=new ie(Qd);t.forEach(u=>i=i.add(u));const s=IDBKeyRange.bound(Bi(i.first()),Bi(i.last())),o=i.getIterator();let c=o.getNext();return qn(e).J({index:"documentKeyIndex",range:s},(u,l,d)=>{const m=B.fromSegments([...l.prefixPath,l.collectionGroup,l.documentId]);for(;c&&Qd(c,m)<0;)r(c,null),c=o.getNext();c&&c.isEqual(m)&&(r(c,l),c=o.hasNext()?o.getNext():null),c?d.$(Bi(c)):d.done()}).next(()=>{for(;c;)r(c,null),c=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,t,r,i,s){const o=t.path,c=[o.popLast().toArray(),o.lastSegment(),Ho(r.readTime),r.documentKey.path.isEmpty()?"":r.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return qn(e).U(IDBKeyRange.bound(c,u,!0)).next(l=>{s==null||s.incrementDocumentReadCount(l.length);let d=tt();for(const m of l){const g=this.ir(B.fromSegments(m.prefixPath.concat(m.collectionGroup,m.documentId)),m);g.isFoundDocument()&&(ks(t,g)||i.has(g.key))&&(d=d.insert(g.key,g))}return d})}getAllFromCollectionGroup(e,t,r,i){let s=tt();const o=Wd(t,r),c=Wd(t,st.max());return qn(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(o,c,!0)},(u,l,d)=>{const m=this.ir(B.fromSegments(l.prefixPath.concat(l.collectionGroup,l.documentId)),l);s=s.insert(m.key,m),s.size===i&&d.done()}).next(()=>s)}newChangeBuffer(e){return new Ov(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return Hd(e).get("remoteDocumentGlobalKey").next(t=>(z(!!t),t))}rr(e,t){return Hd(e).put("remoteDocumentGlobalKey",t)}ir(e,t){if(t){const r=Iv(this.serializer,t);if(!(r.isNoDocument()&&r.version.isEqual(K.min())))return r}return le.newInvalidDocument(e)}}function jp(n){return new Vv(n)}class Ov extends qp{constructor(e,t){super(),this.cr=e,this.trackRemovals=t,this.lr=new $t(r=>r.toString(),(r,i)=>r.isEqual(i))}applyChanges(e){const t=[];let r=0,i=new ie((s,o)=>H(s.canonicalString(),o.canonicalString()));return this.changes.forEach((s,o)=>{const c=this.lr.get(s);if(t.push(this.cr.removeEntry(e,s,c.readTime)),o.isValidDocument()){const u=Vd(this.cr.serializer,o);i=i.add(s.path.popLast());const l=Qo(u);r+=l-c.size,t.push(this.cr.addEntry(e,s,u))}else if(r-=c.size,this.trackRemovals){const u=Vd(this.cr.serializer,o.convertToNoDocument(K.min()));t.push(this.cr.addEntry(e,s,u))}}),i.forEach(s=>{t.push(this.cr.indexManager.addToCollectionParentIndex(e,s))}),t.push(this.cr.updateMetadata(e,r)),R.waitFor(t)}getFromCache(e,t){return this.cr.sr(e,t).next(r=>(this.lr.set(t,{size:r.size,readTime:r.document.readTime}),r.document))}getAllFromCache(e,t){return this.cr.ar(e,t).next(({documents:r,ur:i})=>(i.forEach((s,o)=>{this.lr.set(s,{size:o,readTime:r.get(s).readTime})}),r))}}function Hd(n){return De(n,"remoteDocumentGlobal")}function qn(n){return De(n,"remoteDocumentsV14")}function Bi(n){const e=n.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Wd(n,e){const t=e.documentKey.path.toArray();return[n,Ho(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function Qd(n,e){const t=n.path.toArray(),r=e.path.toArray();let i=0;for(let s=0;s<t.length-2&&s<r.length-2;++s)if(i=H(t[s],r[s]),i)return i;return i=H(t.length,r.length),i||(i=H(t[t.length-2],r[r.length-2]),i||H(t[t.length-1],r[r.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&rs(r.mutation,i,et.empty(),ge.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,Q()).next(()=>r))}getLocalViewOfDocuments(e,t,r=Q()){const i=It();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let o=Hi();return s.forEach((c,u)=>{o=o.insert(c,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const r=It();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,Q()))}populateOverlays(e,t,r){const i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,c)=>{t.set(o,c)})})}computeViews(e,t,r,i){let s=tt();const o=ns(),c=function(){return ns()}();return t.forEach((u,l)=>{const d=r.get(l.key);i.has(l.key)&&(d===void 0||d.mutation instanceof Kt)?s=s.insert(l.key,l):d!==void 0?(o.set(l.key,d.mutation.getFieldMask()),rs(d.mutation,l,d.mutation.getFieldMask(),ge.now())):o.set(l.key,et.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((l,d)=>o.set(l,d)),t.forEach((l,d)=>{var m;return c.set(l,new xv(d,(m=o.get(l))!==null&&m!==void 0?m:null))}),c))}recalculateAndSaveOverlays(e,t){const r=ns();let i=new ae((o,c)=>o-c),s=Q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const c of o)c.keys().forEach(u=>{const l=t.get(u);if(l===null)return;let d=r.get(u)||et.empty();d=c.applyToLocalView(l,d),r.set(u,d);const m=(i.get(c.batchId)||Q()).add(u);i=i.insert(c.batchId,m)})}).next(()=>{const o=[],c=i.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),l=u.key,d=u.value,m=sp();d.forEach(g=>{if(!s.has(g)){const T=dp(t.get(g),r.get(g));T!==null&&m.set(g,T),s=s.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,l,m))}return R.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(o){return B.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ru(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):R.resolve(It());let c=-1,u=s;return o.next(l=>R.forEach(l,(d,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),s.get(d)?R.resolve():this.remoteDocumentCache.getEntry(e,d).next(g=>{u=u.insert(d,g)}))).next(()=>this.populateOverlays(e,l,s)).next(()=>this.computeViews(e,u,l,Q())).next(d=>({batchId:c,changes:ip(d)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new B(t)).next(r=>{let i=Hi();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let o=Hi();return this.indexManager.getCollectionParents(e,s).next(c=>R.forEach(c,u=>{const l=function(m,g){return new Gt(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,l,r,i).next(d=>{d.forEach((m,g)=>{o=o.insert(m,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(o=>{s.forEach((u,l)=>{const d=l.getKey();o.get(d)===null&&(o=o.insert(d,le.newInvalidDocument(d)))});let c=Hi();return o.forEach((u,l)=>{const d=s.get(u);d!==void 0&&rs(d.mutation,l,et.empty(),ge.now()),ks(t,l)&&(c=c.insert(u,l))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lv{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return R.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:be(i.createTime)}}(t)),R.resolve()}getNamedQuery(e,t){return R.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:Ou(i.bundledQuery),readTime:be(i.readTime)}}(t)),R.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mv{constructor(){this.overlays=new ae(B.comparator),this.Ir=new Map}getOverlay(e,t){return R.resolve(this.overlays.get(t))}getOverlays(e,t){const r=It();return R.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.ht(e,t,s)}),R.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),R.resolve()}getOverlaysForCollection(e,t,r){const i=It(),s=t.length+1,o=new B(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return R.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new ae((l,d)=>l-d);const o=this.overlays.getIterator();for(;o.hasNext();){const l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>r){let d=s.get(l.largestBatchId);d===null&&(d=It(),s=s.insert(l.largestBatchId,d)),d.set(l.getKey(),l)}}const c=It(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((l,d)=>c.set(l,d)),!(c.size()>=i)););return R.resolve(c)}ht(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new ku(t,r));let s=this.Ir.get(t);s===void 0&&(s=Q(),this.Ir.set(t,s)),this.Ir.set(t,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{constructor(){this.sessionToken=Te.EMPTY_BYTE_STRING}getSessionToken(e){return R.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,R.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mu{constructor(){this.Tr=new ie(ke.Er),this.dr=new ie(ke.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new ke(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new ke(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new B(new X([])),r=new ke(t,e),i=new ke(t,e+1),s=[];return this.dr.forEachInRange([r,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new B(new X([])),r=new ke(t,e),i=new ke(t,e+1);let s=Q();return this.dr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const t=new ke(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class ke{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return B.comparator(e.key,t.key)||H(e.wr,t.wr)}static Ar(e,t){return H(e.wr,t.wr)||B.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uv{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new ie(ke.Er)}checkEmpty(e){return R.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Cu(s,t,r,i);this.mutationQueue.push(o);for(const c of i)this.br=this.br.add(new ke(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return R.resolve(o)}lookupMutationBatch(e,t){return R.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.vr(r),s=i<0?0:i;return R.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return R.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return R.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new ke(t,0),i=new ke(t,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],o=>{const c=this.Dr(o.wr);s.push(c)}),R.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ie(H);return t.forEach(i=>{const s=new ke(i,0),o=new ke(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],c=>{r=r.add(c.wr)})}),R.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;B.isDocumentKey(s)||(s=s.child(""));const o=new ke(new B(s),0);let c=new ie(H);return this.br.forEachWhile(u=>{const l=u.key.path;return!!r.isPrefixOf(l)&&(l.length===i&&(c=c.add(u.wr)),!0)},o),R.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){z(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return R.forEach(t.mutations,i=>{const s=new ke(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new ke(t,0),i=this.br.firstAfterOrEqual(r);return R.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,R.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bv{constructor(e){this.Mr=e,this.docs=function(){return new ae(B.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return R.resolve(r?r.document.mutableCopy():le.newInvalidDocument(t))}getEntries(e,t){let r=tt();return t.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():le.newInvalidDocument(i))}),R.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=tt();const o=t.path,c=new B(o.child("")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:l,value:{document:d}}=u.getNext();if(!o.isPrefixOf(l.path))break;l.path.length>o.length+1||Eu(Cm(d),r)<=0||(i.has(d.key)||ks(t,d))&&(s=s.insert(d.key,d.mutableCopy()))}return R.resolve(s)}getAllFromCollectionGroup(e,t,r,i){j()}Or(e,t){return R.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new qv(this)}getSize(e){return R.resolve(this.size)}}class qv extends qp{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),R.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jv{constructor(e){this.persistence=e,this.Nr=new $t(t=>tr(t),Cs),this.lastRemoteSnapshotVersion=K.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Mu,this.targetCount=0,this.kr=or.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,i)=>t(i)),R.resolve()}getLastRemoteSnapshotVersion(e){return R.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return R.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),R.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),R.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new or(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,R.resolve()}updateTargetData(e,t){return this.Kn(t),R.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,R.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.Nr.forEach((o,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)}),R.waitFor(s).next(()=>i)}getTargetCount(e){return R.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return R.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),R.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),R.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),R.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return R.resolve(r)}containsKey(e,t){return R.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Ze(0),this.Kr=!1,this.Kr=!0,this.$r=new Fv,this.referenceDelegate=e(this),this.Ur=new jv(this),this.indexManager=new Sv,this.remoteDocumentCache=function(i){return new Bv(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new Np(t),this.Gr=new Lv(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Mv,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new Uv(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){V("MemoryPersistence","Starting transaction:",e);const i=new zv(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,t){return R.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class zv extends km{constructor(e){super(),this.currentSequenceNumber=e}}class va{constructor(e){this.persistence=e,this.Jr=new Mu,this.Yr=null}static Zr(e){return new va(e)}get Xr(){if(this.Yr)return this.Yr;throw j()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),R.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),R.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),R.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return R.forEach(this.Xr,r=>{const i=B.fromPath(r);return this.ei(e,i).next(s=>{s||t.removeEntry(i,K.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return R.or([()=>R.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}class Jo{constructor(e,t){this.persistence=e,this.ti=new $t(r=>Ke(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=Bp(this,t)}static Zr(e,t){return new Jo(e,t)}zr(){}jr(e){return R.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Yn(e){const t=this.er(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}er(e){let t=0;return this.Zn(e,r=>{t++}).next(()=>t)}Zn(e,t){return R.forEach(this.ti,(r,i)=>this.nr(e,r,i).next(s=>s?R.resolve():t(i)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.Or(e,o=>this.nr(e,o,t).next(c=>{c||(r++,s.removeEntry(o,K.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.ti.set(t,e.currentSequenceNumber),R.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.ti.set(r,e.currentSequenceNumber),R.resolve()}removeReference(e,t,r){return this.ti.set(r,e.currentSequenceNumber),R.resolve()}updateLimboDocument(e,t){return this.ti.set(t,e.currentSequenceNumber),R.resolve()}Wr(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Co(e.data.value)),t}nr(e,t,r){return R.or([()=>this.persistence.Hr(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.ti.get(t);return R.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gv{constructor(e){this.serializer=e}O(e,t,r,i){const s=new fa("createOrUpgrade",t);r<1&&i>=1&&(function(u){u.createObjectStore("owner")}(e),function(u){u.createObjectStore("mutationQueues",{keyPath:"userId"}),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",ud,{unique:!0}),u.createObjectStore("documentMutations")}(e),Jd(e),function(u){u.createObjectStore("remoteDocuments")}(e));let o=R.resolve();return r<3&&i>=3&&(r!==0&&(function(u){u.deleteObjectStore("targetDocuments"),u.deleteObjectStore("targets"),u.deleteObjectStore("targetGlobal")}(e),Jd(e)),o=o.next(()=>function(u){const l=u.store("targetGlobal"),d={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:K.min().toTimestamp(),targetCount:0};return l.put("targetGlobalKey",d)}(s))),r<4&&i>=4&&(r!==0&&(o=o.next(()=>function(u,l){return l.store("mutations").U().next(d=>{u.deleteObjectStore("mutations"),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",ud,{unique:!0});const m=l.store("mutations"),g=d.map(T=>m.put(T));return R.waitFor(g)})}(e,s))),o=o.next(()=>{(function(u){u.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)})),r<5&&i>=5&&(o=o.next(()=>this.ni(s))),r<6&&i>=6&&(o=o.next(()=>(function(u){u.createObjectStore("remoteDocumentGlobal")}(e),this.ri(s)))),r<7&&i>=7&&(o=o.next(()=>this.ii(s))),r<8&&i>=8&&(o=o.next(()=>this.si(e,s))),r<9&&i>=9&&(o=o.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),r<10&&i>=10&&(o=o.next(()=>this.oi(s))),r<11&&i>=11&&(o=o.next(()=>{(function(u){u.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(u){u.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),r<12&&i>=12&&(o=o.next(()=>{(function(u){const l=u.createObjectStore("documentOverlays",{keyPath:SE});l.createIndex("collectionPathOverlayIndex",PE,{unique:!1}),l.createIndex("collectionGroupOverlayIndex",CE,{unique:!1})})(e)})),r<13&&i>=13&&(o=o.next(()=>function(u){const l=u.createObjectStore("remoteDocumentsV14",{keyPath:gE});l.createIndex("documentKeyIndex",_E),l.createIndex("collectionGroupIndex",yE)}(e)).next(()=>this._i(e,s)).next(()=>e.deleteObjectStore("remoteDocuments"))),r<14&&i>=14&&(o=o.next(()=>this.ai(e,s))),r<15&&i>=15&&(o=o.next(()=>function(u){u.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),u.createObjectStore("indexState",{keyPath:wE}).createIndex("sequenceNumberIndex",AE,{unique:!1}),u.createObjectStore("indexEntries",{keyPath:RE}).createIndex("documentKeyIndex",bE,{unique:!1})}(e))),r<16&&i>=16&&(o=o.next(()=>{t.objectStore("indexState").clear()}).next(()=>{t.objectStore("indexEntries").clear()})),r<17&&i>=17&&(o=o.next(()=>{(function(u){u.createObjectStore("globals",{keyPath:"name"})})(e)})),o}ri(e){let t=0;return e.store("remoteDocuments").J((r,i)=>{t+=Qo(i)}).next(()=>{const r={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",r)})}ni(e){const t=e.store("mutationQueues"),r=e.store("mutations");return t.U().next(i=>R.forEach(i,s=>{const o=IDBKeyRange.bound([s.userId,-1],[s.userId,s.lastAcknowledgedBatchId]);return r.U("userMutationsIndex",o).next(c=>R.forEach(c,u=>{z(u.userId===s.userId);const l=$n(this.serializer,u);return Lp(e,s.userId,l).next(()=>{})}))}))}ii(e){const t=e.store("targetDocuments"),r=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(i=>{const s=[];return r.J((o,c)=>{const u=new X(o),l=function(m){return[0,Ke(m)]}(u);s.push(t.get(l).next(d=>d?R.resolve():(m=>t.put({targetId:0,path:Ke(m),sequenceNumber:i.highestListenSequenceNumber}))(u)))}).next(()=>R.waitFor(s))})}si(e,t){e.createObjectStore("collectionParents",{keyPath:vE});const r=t.store("collectionParents"),i=new Lu,s=o=>{if(i.add(o)){const c=o.lastSegment(),u=o.popLast();return r.put({collectionId:c,parent:Ke(u)})}};return t.store("remoteDocuments").J({H:!0},(o,c)=>{const u=new X(o);return s(u.popLast())}).next(()=>t.store("documentMutations").J({H:!0},([o,c,u],l)=>{const d=yt(c);return s(d.popLast())}))}oi(e){const t=e.store("targets");return t.J((r,i)=>{const s=Qi(i),o=Vp(this.serializer,s);return t.put(o)})}_i(e,t){const r=t.store("remoteDocuments"),i=[];return r.J((s,o)=>{const c=t.store("remoteDocumentsV14"),u=function(m){return m.document?new B(X.fromString(m.document.name).popFirst(5)):m.noDocument?B.fromSegments(m.noDocument.path):m.unknownDocument?B.fromSegments(m.unknownDocument.path):j()}(o).path.toArray(),l={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};i.push(c.put(l))}).next(()=>R.waitFor(i))}ai(e,t){const r=t.store("mutations"),i=jp(this.serializer),s=new Fu(va.Zr,this.serializer.ct);return r.U().next(o=>{const c=new Map;return o.forEach(u=>{var l;let d=(l=c.get(u.userId))!==null&&l!==void 0?l:Q();$n(this.serializer,u).keys().forEach(m=>d=d.add(m)),c.set(u.userId,d)}),R.forEach(c,(u,l)=>{const d=new Ne(l),m=Ta.lt(this.serializer,d),g=s.getIndexManager(d),T=Ea.lt(d,this.serializer,g,s.referenceDelegate);return new zp(i,T,m,g).recalculateAndSaveOverlaysForDocumentKeys(new Kc(t,Ze.oe),u).next()})})}}function Jd(n){n.createObjectStore("targetDocuments",{keyPath:TE}).createIndex("documentTargetsIndex",EE,{unique:!0}),n.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",IE,{unique:!0}),n.createObjectStore("targetGlobal")}const Sc="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class Uu{constructor(e,t,r,i,s,o,c,u,l,d,m=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=r,this.ui=s,this.window=o,this.document=c,this.ci=l,this.li=d,this.hi=m,this.Qr=null,this.Kr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Pi=null,this.inForeground=!1,this.Ii=null,this.Ti=null,this.Ei=Number.NEGATIVE_INFINITY,this.di=g=>Promise.resolve(),!Uu.D())throw new N(C.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Nv(this,i),this.Ai=t+"main",this.serializer=new Np(u),this.Ri=new Et(this.Ai,this.hi,new Gv(this.serializer)),this.$r=new Ev,this.Ur=new Cv(this.referenceDelegate,this.serializer),this.remoteDocumentCache=jp(this.serializer),this.Gr=new Tv,this.window&&this.window.localStorage?this.Vi=this.window.localStorage:(this.Vi=null,d===!1&&Re("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.mi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new N(C.FAILED_PRECONDITION,Sc);return this.fi(),this.gi(),this.pi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Ur.getHighestSequenceNumber(e))}).then(e=>{this.Qr=new Ze(e,this.ci)}).then(()=>{this.Kr=!0}).catch(e=>(this.Ri&&this.Ri.close(),Promise.reject(e)))}yi(e){return this.di=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ri.L(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.ui.enqueueAndForget(async()=>{this.started&&await this.mi()}))}mi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>Io(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.wi(e).next(t=>{t||(this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)))})}).next(()=>this.Si(e)).next(t=>this.isPrimary&&!t?this.bi(e).next(()=>!1):!!t&&this.Di(e).next(()=>!0))).catch(e=>{if(Dn(e))return V("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return V("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.ui.enqueueRetryable(()=>this.di(e)),this.isPrimary=e})}wi(e){return qi(e).get("owner").next(t=>R.resolve(this.vi(t)))}Ci(e){return Io(e).delete(this.clientId)}async Fi(){if(this.isPrimary&&!this.Mi(this.Ei,18e5)){this.Ei=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const r=De(t,"clientMetadata");return r.U().next(i=>{const s=this.xi(i,18e5),o=i.filter(c=>s.indexOf(c)===-1);return R.forEach(o,c=>r.delete(c.clientId)).next(()=>o)})}).catch(()=>[]);if(this.Vi)for(const t of e)this.Vi.removeItem(this.Oi(t.clientId))}}pi(){this.Ti=this.ui.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.mi().then(()=>this.Fi()).then(()=>this.pi()))}vi(e){return!!e&&e.ownerId===this.clientId}Si(e){return this.li?R.resolve(!0):qi(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)){if(this.vi(t)&&this.networkEnabled)return!0;if(!this.vi(t)){if(!t.allowTabSynchronization)throw new N(C.FAILED_PRECONDITION,Sc);return!1}}return!(!this.networkEnabled||!this.inForeground)||Io(e).U().next(r=>this.xi(r,5e3).find(i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,o=!this.inForeground&&i.inForeground,c=this.networkEnabled===i.networkEnabled;if(s||o&&c)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&V("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.Kr=!1,this.Li(),this.Ti&&(this.Ti.cancel(),this.Ti=null),this.Bi(),this.ki(),await this.Ri.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{const t=new Kc(e,Ze.oe);return this.bi(t).next(()=>this.Ci(t))}),this.Ri.close(),this.qi()}xi(e,t){return e.filter(r=>this.Mi(r.updateTimeMs,t)&&!this.Ni(r.clientId))}Qi(){return this.runTransaction("getActiveClients","readonly",e=>Io(e).U().next(t=>this.xi(t,18e5).map(r=>r.clientId)))}get started(){return this.Kr}getGlobalsCache(){return this.$r}getMutationQueue(e,t){return Ea.lt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Pv(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return Ta.lt(this.serializer,e)}getBundleCache(){return this.Gr}runTransaction(e,t,r){V("IndexedDbPersistence","Starting transaction:",e);const i=t==="readonly"?"readonly":"readwrite",s=function(u){return u===17?NE:u===16?kE:u===15?wu:u===14?Mm:u===13?Lm:u===12?DE:u===11?xm:void j()}(this.hi);let o;return this.Ri.runTransaction(e,i,s,c=>(o=new Kc(c,this.Qr?this.Qr.next():Ze.oe),t==="readwrite-primary"?this.wi(o).next(u=>!!u||this.Si(o)).next(u=>{if(!u)throw Re(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)),new N(C.FAILED_PRECONDITION,Dm);return r(o)}).next(u=>this.Di(o).next(()=>u)):this.Ki(o).next(()=>r(o)))).then(c=>(o.raiseOnCommittedEvent(),c))}Ki(e){return qi(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)&&!this.vi(t)&&!(this.li||this.allowTabSynchronization&&t.allowTabSynchronization))throw new N(C.FAILED_PRECONDITION,Sc)})}Di(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return qi(e).put("owner",t)}static D(){return Et.D()}bi(e){const t=qi(e);return t.get("owner").next(r=>this.vi(r)?(V("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):R.resolve())}Mi(e,t){const r=Date.now();return!(e<r-t)&&(!(e>r)||(Re(`Detected an update time that is in the future: ${e} > ${r}`),!1))}fi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ii=()=>{this.ui.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.mi()))},this.document.addEventListener("visibilitychange",this.Ii),this.inForeground=this.document.visibilityState==="visible")}Bi(){this.Ii&&(this.document.removeEventListener("visibilitychange",this.Ii),this.Ii=null)}gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Pi=()=>{this.Li();const t=/(?:Version|Mobile)\/1[456]/;sm()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.ui.enterRestrictedMode(!0),this.ui.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Pi))}ki(){this.Pi&&(this.window.removeEventListener("pagehide",this.Pi),this.Pi=null)}Ni(e){var t;try{const r=((t=this.Vi)===null||t===void 0?void 0:t.getItem(this.Oi(e)))!==null;return V("IndexedDbPersistence",`Client '${e}' ${r?"is":"is not"} zombied in LocalStorage`),r}catch(r){return Re("IndexedDbPersistence","Failed to get zombied client id.",r),!1}}Li(){if(this.Vi)try{this.Vi.setItem(this.Oi(this.clientId),String(Date.now()))}catch(e){Re("Failed to set zombie client id.",e)}}qi(){if(this.Vi)try{this.Vi.removeItem(this.Oi(this.clientId))}catch{}}Oi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function qi(n){return De(n,"owner")}function Io(n){return De(n,"clientMetadata")}function Bu(n,e){let t=n.projectId;return n.isDefaultDatabase||(t+="."+n.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=i}static Wi(e,t){let r=Q(),i=Q();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new qu(e,t.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $v{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return sm()?8:Nm(Ce())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.Yi(e,t).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,t,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new $v;return this.Xi(e,t,o).next(c=>{if(s.result=c,this.zi)return this.es(e,t,o,c.size)})}).next(()=>s.result)}es(e,t,r,i){return r.documentReadCount<this.ji?(Rr()<=Y.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",br(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),R.resolve()):(Rr()<=Y.DEBUG&&V("QueryEngine","Query:",br(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(Rr()<=Y.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",br(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,He(t))):R.resolve())}Yi(e,t){if(vd(t))return R.resolve(null);let r=He(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=$o(t,null,"F"),r=He(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=Q(...s);return this.Ji.getDocuments(e,o).next(c=>this.indexManager.getMinOffset(e,r).next(u=>{const l=this.ts(t,c);return this.ns(t,l,o,u.readTime)?this.Yi(e,$o(t,null,"F")):this.rs(e,l,t,u)}))})))}Zi(e,t,r,i){return vd(t)||i.isEqual(K.min())?R.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const o=this.ts(t,s);return this.ns(t,o,r,i)?R.resolve(null):(Rr()<=Y.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),br(t)),this.rs(e,o,t,Pm(i,-1)).next(c=>c))})}ts(e,t){let r=new ie(np(e));return t.forEach((i,s)=>{ks(e,s)&&(r=r.add(s))}),r}ns(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,t,r){return Rr()<=Y.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",br(t)),this.Ji.getDocumentsMatchingQuery(e,t,st.min(),r)}rs(e,t,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kv{constructor(e,t,r,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new ae(H),this._s=new $t(s=>tr(s),Cs),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new zp(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function $p(n,e,t,r){return new Kv(n,e,t,r)}async function Kp(n,e){const t=F(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],c=[];let u=Q();for(const l of i){o.push(l.batchId);for(const d of l.mutations)u=u.add(d.key)}for(const l of s){c.push(l.batchId);for(const d of l.mutations)u=u.add(d.key)}return t.localDocuments.getDocuments(r,u).next(l=>({hs:l,removedBatchIds:o,addedBatchIds:c}))})})}function Hv(n,e){const t=F(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,u,l,d){const m=l.batch,g=m.keys();let T=R.resolve();return g.forEach(w=>{T=T.next(()=>d.getEntry(u,w)).next(D=>{const P=l.docVersions.get(w);z(P!==null),D.version.compareTo(P)<0&&(m.applyToRemoteDocument(D,l),D.isValidDocument()&&(D.setReadTime(l.commitVersion),d.addEntry(D)))})}),T.next(()=>c.mutationQueue.removeMutationBatch(u,m))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let u=Q();for(let l=0;l<c.mutationResults.length;++l)c.mutationResults[l].transformResults.length>0&&(u=u.add(c.batch.mutations[l].key));return u}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function Hp(n){const e=F(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function Wv(n,e){const t=F(n),r=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const c=[];e.targetChanges.forEach((d,m)=>{const g=i.get(m);if(!g)return;c.push(t.Ur.removeMatchingKeys(s,d.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(s,d.addedDocuments,m)));let T=g.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?T=T.withResumeToken(Te.EMPTY_BYTE_STRING,K.min()).withLastLimboFreeSnapshotVersion(K.min()):d.resumeToken.approximateByteSize()>0&&(T=T.withResumeToken(d.resumeToken,r)),i=i.insert(m,T),function(D,P,x){return D.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=3e8?!0:x.addedDocuments.size+x.modifiedDocuments.size+x.removedDocuments.size>0}(g,T,d)&&c.push(t.Ur.updateTargetData(s,T))});let u=tt(),l=Q();if(e.documentUpdates.forEach(d=>{e.resolvedLimboDocuments.has(d)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(s,d))}),c.push(Wp(s,o,e.documentUpdates).next(d=>{u=d.Ps,l=d.Is})),!r.isEqual(K.min())){const d=t.Ur.getLastRemoteSnapshotVersion(s).next(m=>t.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));c.push(d)}return R.waitFor(c).next(()=>o.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,u,l)).next(()=>u)}).then(s=>(t.os=i,s))}function Wp(n,e,t){let r=Q(),i=Q();return t.forEach(s=>r=r.add(s)),e.getEntries(n,r).next(s=>{let o=tt();return t.forEach((c,u)=>{const l=s.get(c);u.isFoundDocument()!==l.isFoundDocument()&&(i=i.add(c)),u.isNoDocument()&&u.version.isEqual(K.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):V("LocalStore","Ignoring outdated watch update for ",c,". Current version:",l.version," Watch version:",u.version)}),{Ps:o,Is:i}})}function Qv(n,e){const t=F(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function $r(n,e){const t=F(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return t.Ur.getTargetData(r,e).next(s=>s?(i=s,R.resolve(i)):t.Ur.allocateTargetId(r).next(o=>(i=new Ot(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=t.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function Kr(n,e,t){const r=F(n),i=r.os.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Dn(o))throw o;V("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function Yo(n,e,t){const r=F(n);let i=K.min(),s=Q();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,l,d){const m=F(u),g=m._s.get(d);return g!==void 0?R.resolve(m.os.get(g)):m.Ur.getTargetData(l,d)}(r,o,He(e)).next(c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,c.targetId).next(u=>{s=u})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,t?i:K.min(),t?s:Q())).next(c=>(Yp(r,tp(e),c),{documents:c,Ts:s})))}function Qp(n,e){const t=F(n),r=F(t.Ur),i=t.os.get(e);return i?Promise.resolve(i.target):t.persistence.runTransaction("Get target data","readonly",s=>r.ot(s,e).next(o=>o?o.target:null))}function Jp(n,e){const t=F(n),r=t.us.get(e)||K.min();return t.persistence.runTransaction("Get new document changes","readonly",i=>t.cs.getAllFromCollectionGroup(i,e,Pm(r,-1),Number.MAX_SAFE_INTEGER)).then(i=>(Yp(t,e,i),i))}function Yp(n,e,t){let r=n.us.get(e)||K.min();t.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),n.us.set(e,r)}async function Jv(n,e,t,r){const i=F(n);let s=Q(),o=tt();for(const l of t){const d=e.Es(l.metadata.name);l.document&&(s=s.add(d));const m=e.ds(l);m.setReadTime(e.As(l.metadata.readTime)),o=o.insert(d,m)}const c=i.cs.newChangeBuffer({trackRemovals:!0}),u=await $r(i,function(d){return He(ri(X.fromString(`__bundle__/docs/${d}`)))}(r));return i.persistence.runTransaction("Apply bundle documents","readwrite",l=>Wp(l,c,o).next(d=>(c.apply(l),d)).next(d=>i.Ur.removeMatchingKeysForTargetId(l,u.targetId).next(()=>i.Ur.addMatchingKeys(l,s,u.targetId)).next(()=>i.localDocuments.getLocalViewOfDocuments(l,d.Ps,d.Is)).next(()=>d.Ps)))}async function Yv(n,e,t=Q()){const r=await $r(n,He(Ou(e.bundledQuery))),i=F(n);return i.persistence.runTransaction("Save named query","readwrite",s=>{const o=be(e.readTime);if(r.snapshotVersion.compareTo(o)>=0)return i.Gr.saveNamedQuery(s,e);const c=r.withResumeToken(Te.EMPTY_BYTE_STRING,o);return i.os=i.os.insert(c.targetId,c),i.Ur.updateTargetData(s,c).next(()=>i.Ur.removeMatchingKeysForTargetId(s,r.targetId)).next(()=>i.Ur.addMatchingKeys(s,t,r.targetId)).next(()=>i.Gr.saveNamedQuery(s,e))})}function Yd(n,e){return`firestore_clients_${n}_${e}`}function Xd(n,e,t){let r=`firestore_mutations_${n}_${t}`;return e.isAuthenticated()&&(r+=`_${e.uid}`),r}function Pc(n,e){return`firestore_targets_${n}_${e}`}class Xo{constructor(e,t,r,i){this.user=e,this.batchId=t,this.state=r,this.error=i}static Rs(e,t,r){const i=JSON.parse(r);let s,o=typeof i=="object"&&["pending","acknowledged","rejected"].indexOf(i.state)!==-1&&(i.error===void 0||typeof i.error=="object");return o&&i.error&&(o=typeof i.error.message=="string"&&typeof i.error.code=="string",o&&(s=new N(i.error.code,i.error.message))),o?new Xo(e,t,i.state,s):(Re("SharedClientState",`Failed to parse mutation state for ID '${t}': ${r}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class is{constructor(e,t,r){this.targetId=e,this.state=t,this.error=r}static Rs(e,t){const r=JSON.parse(t);let i,s=typeof r=="object"&&["not-current","current","rejected"].indexOf(r.state)!==-1&&(r.error===void 0||typeof r.error=="object");return s&&r.error&&(s=typeof r.error.message=="string"&&typeof r.error.code=="string",s&&(i=new N(r.error.code,r.error.message))),s?new is(e,r.state,i):(Re("SharedClientState",`Failed to parse target state for ID '${e}': ${t}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Zo{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Rs(e,t){const r=JSON.parse(t);let i=typeof r=="object"&&r.activeTargetIds instanceof Array,s=bu();for(let o=0;i&&o<r.activeTargetIds.length;++o)i=Vm(r.activeTargetIds[o]),s=s.add(r.activeTargetIds[o]);return i?new Zo(e,s):(Re("SharedClientState",`Failed to parse client data for instance '${e}': ${t}`),null)}}class ju{constructor(e,t){this.clientId=e,this.onlineState=t}static Rs(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new ju(t.clientId,t.onlineState):(Re("SharedClientState",`Failed to parse online state: ${e}`),null)}}class ou{constructor(){this.activeTargetIds=bu()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Cc{constructor(e,t,r,i,s){this.window=e,this.ui=t,this.persistenceKey=r,this.ps=i,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ys=this.ws.bind(this),this.Ss=new ae(H),this.started=!1,this.bs=[];const o=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.Ds=Yd(this.persistenceKey,this.ps),this.vs=function(u){return`firestore_sequence_number_${u}`}(this.persistenceKey),this.Ss=this.Ss.insert(this.ps,new ou),this.Cs=new RegExp(`^firestore_clients_${o}_([^_]*)$`),this.Fs=new RegExp(`^firestore_mutations_${o}_(\\d+)(?:_(.*))?$`),this.Ms=new RegExp(`^firestore_targets_${o}_(\\d+)$`),this.xs=function(u){return`firestore_online_state_${u}`}(this.persistenceKey),this.Os=function(u){return`firestore_bundle_loaded_v2_${u}`}(this.persistenceKey),this.window.addEventListener("storage",this.ys)}static D(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Qi();for(const r of e){if(r===this.ps)continue;const i=this.getItem(Yd(this.persistenceKey,r));if(i){const s=Zo.Rs(r,i);s&&(this.Ss=this.Ss.insert(s.clientId,s))}}this.Ns();const t=this.storage.getItem(this.xs);if(t){const r=this.Ls(t);r&&this.Bs(r)}for(const r of this.bs)this.ws(r);this.bs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.vs,JSON.stringify(e))}getAllActiveQueryTargets(){return this.ks(this.Ss)}isActiveQueryTarget(e){let t=!1;return this.Ss.forEach((r,i)=>{i.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.qs(e,"pending")}updateMutationState(e,t,r){this.qs(e,t,r),this.Qs(e)}addLocalQueryTarget(e,t=!0){let r="not-current";if(this.isActiveQueryTarget(e)){const i=this.storage.getItem(Pc(this.persistenceKey,e));if(i){const s=is.Rs(e,i);s&&(r=s.state)}}return t&&this.Ks.fs(e),this.Ns(),r}removeLocalQueryTarget(e){this.Ks.gs(e),this.Ns()}isLocalQueryTarget(e){return this.Ks.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Pc(this.persistenceKey,e))}updateQueryState(e,t,r){this.$s(e,t,r)}handleUserChange(e,t,r){t.forEach(i=>{this.Qs(i)}),this.currentUser=e,r.forEach(i=>{this.addPendingMutation(i)})}setOnlineState(e){this.Us(e)}notifyBundleLoaded(e){this.Ws(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ys),this.removeItem(this.Ds),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return V("SharedClientState","READ",e,t),t}setItem(e,t){V("SharedClientState","SET",e,t),this.storage.setItem(e,t)}removeItem(e){V("SharedClientState","REMOVE",e),this.storage.removeItem(e)}ws(e){const t=e;if(t.storageArea===this.storage){if(V("SharedClientState","EVENT",t.key,t.newValue),t.key===this.Ds)return void Re("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.ui.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.Cs.test(t.key)){if(t.newValue==null){const r=this.Gs(t.key);return this.zs(r,null)}{const r=this.js(t.key,t.newValue);if(r)return this.zs(r.clientId,r)}}else if(this.Fs.test(t.key)){if(t.newValue!==null){const r=this.Hs(t.key,t.newValue);if(r)return this.Js(r)}}else if(this.Ms.test(t.key)){if(t.newValue!==null){const r=this.Ys(t.key,t.newValue);if(r)return this.Zs(r)}}else if(t.key===this.xs){if(t.newValue!==null){const r=this.Ls(t.newValue);if(r)return this.Bs(r)}}else if(t.key===this.vs){const r=function(s){let o=Ze.oe;if(s!=null)try{const c=JSON.parse(s);z(typeof c=="number"),o=c}catch(c){Re("SharedClientState","Failed to read sequence number from WebStorage",c)}return o}(t.newValue);r!==Ze.oe&&this.sequenceNumberHandler(r)}else if(t.key===this.Os){const r=this.Xs(t.newValue);await Promise.all(r.map(i=>this.syncEngine.eo(i)))}}}else this.bs.push(t)})}}get Ks(){return this.Ss.get(this.ps)}Ns(){this.setItem(this.Ds,this.Ks.Vs())}qs(e,t,r){const i=new Xo(this.currentUser,e,t,r),s=Xd(this.persistenceKey,this.currentUser,e);this.setItem(s,i.Vs())}Qs(e){const t=Xd(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Us(e){const t={clientId:this.ps,onlineState:e};this.storage.setItem(this.xs,JSON.stringify(t))}$s(e,t,r){const i=Pc(this.persistenceKey,e),s=new is(e,t,r);this.setItem(i,s.Vs())}Ws(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Os,t)}Gs(e){const t=this.Cs.exec(e);return t?t[1]:null}js(e,t){const r=this.Gs(e);return Zo.Rs(r,t)}Hs(e,t){const r=this.Fs.exec(e),i=Number(r[1]),s=r[2]!==void 0?r[2]:null;return Xo.Rs(new Ne(s),i,t)}Ys(e,t){const r=this.Ms.exec(e),i=Number(r[1]);return is.Rs(i,t)}Ls(e){return ju.Rs(e)}Xs(e){return JSON.parse(e)}async Js(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.no(e.batchId,e.state,e.error);V("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Zs(e){return this.syncEngine.ro(e.targetId,e.state,e.error)}zs(e,t){const r=t?this.Ss.insert(e,t):this.Ss.remove(e),i=this.ks(this.Ss),s=this.ks(r),o=[],c=[];return s.forEach(u=>{i.has(u)||o.push(u)}),i.forEach(u=>{s.has(u)||c.push(u)}),this.syncEngine.io(o,c).then(()=>{this.Ss=r})}Bs(e){this.Ss.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}ks(e){let t=bu();return e.forEach((r,i)=>{t=t.unionWith(i.activeTargetIds)}),t}}class Xp{constructor(){this.so=new ou,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new ou,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xv{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){V("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){V("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let To=null;function Dc(){return To===null?To=function(){return 268435456+Math.round(2147483648*Math.random())}():To++,"0x"+To.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ew{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze="WebChannelConnection";class tw extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(t,r,i,s,o){const c=Dc(),u=this.xo(t,r.toUriEncodedString());V("RestConnection",`Sending RPC '${t}' ${c}:`,u,i);const l={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(l,s,o),this.No(t,u,l,i).then(d=>(V("RestConnection",`Received RPC '${t}' ${c}: `,d),d),d=>{throw it("RestConnection",`RPC '${t}' ${c} failed with error: `,d,"url: ",u,"request:",i),d})}Lo(t,r,i,s,o,c){return this.Mo(t,r,i,s,o)}Oo(t,r,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ni}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>t[o]=s),i&&i.headers.forEach((s,o)=>t[o]=s)}xo(t,r){const i=Zv[t];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,i){const s=Dc();return new Promise((o,c)=>{const u=new Im;u.setWithCredentials(!0),u.listenOnce(Tm.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case bo.NO_ERROR:const d=u.getResponseJson();V(ze,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(d)),o(d);break;case bo.TIMEOUT:V(ze,`RPC '${e}' ${s} timed out`),c(new N(C.DEADLINE_EXCEEDED,"Request time out"));break;case bo.HTTP_ERROR:const m=u.getStatus();if(V(ze,`RPC '${e}' ${s} failed with status:`,m,"response text:",u.getResponseText()),m>0){let g=u.getResponseJson();Array.isArray(g)&&(g=g[0]);const T=g==null?void 0:g.error;if(T&&T.status&&T.message){const w=function(P){const x=P.toLowerCase().replace(/_/g,"-");return Object.values(C).indexOf(x)>=0?x:C.UNKNOWN}(T.status);c(new N(w,T.message))}else c(new N(C.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new N(C.UNAVAILABLE,"Connection failed."));break;default:j()}}finally{V(ze,`RPC '${e}' ${s} completed.`)}});const l=JSON.stringify(i);V(ze,`RPC '${e}' ${s} sending request:`,i),u.send(t,"POST",l,r,15)})}Bo(e,t,r){const i=Dc(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=wm(),c=vm(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(u.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;const d=s.join("");V(ze,`Creating RPC '${e}' stream ${i}: ${d}`,u);const m=o.createWebChannel(d,u);let g=!1,T=!1;const w=new ew({Io:P=>{T?V(ze,`Not sending because RPC '${e}' stream ${i} is closed:`,P):(g||(V(ze,`Opening RPC '${e}' stream ${i} transport.`),m.open(),g=!0),V(ze,`RPC '${e}' stream ${i} sending:`,P),m.send(P))},To:()=>m.close()}),D=(P,x,M)=>{P.listen(x,O=>{try{M(O)}catch(G){setTimeout(()=>{throw G},0)}})};return D(m,Ki.EventType.OPEN,()=>{T||(V(ze,`RPC '${e}' stream ${i} transport opened.`),w.yo())}),D(m,Ki.EventType.CLOSE,()=>{T||(T=!0,V(ze,`RPC '${e}' stream ${i} transport closed`),w.So())}),D(m,Ki.EventType.ERROR,P=>{T||(T=!0,it(ze,`RPC '${e}' stream ${i} transport errored:`,P),w.So(new N(C.UNAVAILABLE,"The operation could not be completed")))}),D(m,Ki.EventType.MESSAGE,P=>{var x;if(!T){const M=P.data[0];z(!!M);const O=M,G=O.error||((x=O[0])===null||x===void 0?void 0:x.error);if(G){V(ze,`RPC '${e}' stream ${i} received error:`,G);const W=G.status;let $=function(y){const v=Se[y];if(v!==void 0)return gp(v)}(W),E=G.message;$===void 0&&($=C.INTERNAL,E="Unknown error status: "+W+" with message "+G.message),T=!0,w.So(new N($,E)),m.close()}else V(ze,`RPC '${e}' stream ${i} received:`,M),w.bo(M)}}),D(c,Em.STAT_EVENT,P=>{P.stat===Gc.PROXY?V(ze,`RPC '${e}' stream ${i} detected buffering proxy`):P.stat===Gc.NOPROXY&&V(ze,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{w.wo()},0),w}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zp(){return typeof window<"u"?window:null}function Vo(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xs(n){return new uv(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(e,t,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-r);i>0&&V("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(e,t,r,i,s,o,c,u){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new zu(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===C.RESOURCE_EXHAUSTED?(Re(t.toString()),Re("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===C.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===t&&this.P_(r,i)},r=>{e(()=>{const i=new N(C.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return V("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(V("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class nw extends eg{constructor(e,t,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,o),this.serializer=s}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=dv(this.serializer,e),r=function(s){if(!("targetChange"in s))return K.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?K.min():o.readTime?be(o.readTime):K.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=tu(this.serializer),t.addTarget=function(s,o){let c;const u=o.target;if(c=zo(u)?{documents:bp(s,u)}:{query:Ia(s,u)._t},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Tp(s,o.resumeToken);const l=Zc(s,o.expectedCount);l!==null&&(c.expectedCount=l)}else if(o.snapshotVersion.compareTo(K.min())>0){c.readTime=Gr(s,o.snapshotVersion.toTimestamp());const l=Zc(s,o.expectedCount);l!==null&&(c.expectedCount=l)}return c}(this.serializer,e);const r=mv(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=tu(this.serializer),t.removeTarget=e,this.a_(t)}}class rw extends eg{constructor(e,t,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return z(!!e.streamToken),this.lastStreamToken=e.streamToken,z(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){z(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=fv(e.writeResults,e.commitTime),r=be(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=tu(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Is(this.serializer,r))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw extends class{}{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new N(C.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,eu(t,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new N(C.UNKNOWN,s.toString())})}Lo(e,t,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,c])=>this.connection.Lo(e,eu(t,r),i,o,c,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(C.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class sw{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Re(t),this.D_=!1):V("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ow{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{r.enqueueAndForget(async()=>{Nn(this)&&(V("RemoteStore","Restarting streams for network reachability change."),await async function(u){const l=F(u);l.L_.add(4),await oi(l),l.q_.set("Unknown"),l.L_.delete(4),await Ls(l)}(this))})}),this.q_=new sw(r,i)}}async function Ls(n){if(Nn(n))for(const e of n.B_)await e(!0)}async function oi(n){for(const e of n.B_)await e(!1)}function wa(n,e){const t=F(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Ku(t)?$u(t):ci(t).r_()&&Gu(t,e))}function Hr(n,e){const t=F(n),r=ci(t);t.N_.delete(e),r.r_()&&tg(t,e),t.N_.size===0&&(r.r_()?r.o_():Nn(t)&&t.q_.set("Unknown"))}function Gu(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(K.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ci(n).A_(e)}function tg(n,e){n.Q_.xe(e),ci(n).R_(e)}function $u(n){n.Q_=new sv({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ci(n).start(),n.q_.v_()}function Ku(n){return Nn(n)&&!ci(n).n_()&&n.N_.size>0}function Nn(n){return F(n).L_.size===0}function ng(n){n.Q_=void 0}async function aw(n){n.q_.set("Online")}async function cw(n){n.N_.forEach((e,t)=>{Gu(n,e)})}async function uw(n,e){ng(n),Ku(n)?(n.q_.M_(e),$u(n)):n.q_.set("Unknown")}async function lw(n,e,t){if(n.q_.set("Online"),e instanceof Ip&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const c of s.targetIds)i.N_.has(c)&&(await i.remoteSyncer.rejectListen(c,o),i.N_.delete(c),i.Q_.removeTarget(c))}(n,e)}catch(r){V("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await ea(n,r)}else if(e instanceof No?n.Q_.Ke(e):e instanceof yp?n.Q_.He(e):n.Q_.We(e),!t.isEqual(K.min()))try{const r=await Hp(n.localStore);t.compareTo(r)>=0&&await function(s,o){const c=s.Q_.rt(o);return c.targetChanges.forEach((u,l)=>{if(u.resumeToken.approximateByteSize()>0){const d=s.N_.get(l);d&&s.N_.set(l,d.withResumeToken(u.resumeToken,o))}}),c.targetMismatches.forEach((u,l)=>{const d=s.N_.get(u);if(!d)return;s.N_.set(u,d.withResumeToken(Te.EMPTY_BYTE_STRING,d.snapshotVersion)),tg(s,u);const m=new Ot(d.target,u,l,d.sequenceNumber);Gu(s,m)}),s.remoteSyncer.applyRemoteEvent(c)}(n,t)}catch(r){V("RemoteStore","Failed to raise snapshot:",r),await ea(n,r)}}async function ea(n,e,t){if(!Dn(e))throw e;n.L_.add(1),await oi(n),n.q_.set("Offline"),t||(t=()=>Hp(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{V("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Ls(n)})}function rg(n,e){return e().catch(t=>ea(n,t,e))}async function ai(n){const e=F(n),t=An(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;hw(e);)try{const i=await Qv(e.localStore,r);if(i===null){e.O_.length===0&&t.o_();break}r=i.batchId,dw(e,i)}catch(i){await ea(e,i)}ig(e)&&sg(e)}function hw(n){return Nn(n)&&n.O_.length<10}function dw(n,e){n.O_.push(e);const t=An(n);t.r_()&&t.V_&&t.m_(e.mutations)}function ig(n){return Nn(n)&&!An(n).n_()&&n.O_.length>0}function sg(n){An(n).start()}async function fw(n){An(n).p_()}async function mw(n){const e=An(n);for(const t of n.O_)e.m_(t.mutations)}async function pw(n,e,t){const r=n.O_.shift(),i=Du.from(r,e,t);await rg(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await ai(n)}async function gw(n,e){e&&An(n).V_&&await async function(r,i){if(function(o){return pp(o)&&o!==C.ABORTED}(i.code)){const s=r.O_.shift();An(r).s_(),await rg(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await ai(r)}}(n,e),ig(n)&&sg(n)}async function ef(n,e){const t=F(n);t.asyncQueue.verifyOperationInProgress(),V("RemoteStore","RemoteStore received new credentials");const r=Nn(t);t.L_.add(3),await oi(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Ls(t)}async function au(n,e){const t=F(n);e?(t.L_.delete(2),await Ls(t)):e||(t.L_.add(2),await oi(t),t.q_.set("Unknown"))}function ci(n){return n.K_||(n.K_=function(t,r,i){const s=F(t);return s.w_(),new nw(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Eo:aw.bind(null,n),Ro:cw.bind(null,n),mo:uw.bind(null,n),d_:lw.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Ku(n)?$u(n):n.q_.set("Unknown")):(await n.K_.stop(),ng(n))})),n.K_}function An(n){return n.U_||(n.U_=function(t,r,i){const s=F(t);return s.w_(),new rw(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:fw.bind(null,n),mo:gw.bind(null,n),f_:mw.bind(null,n),g_:pw.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await ai(n)):(await n.U_.stop(),n.O_.length>0&&(V("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new Ve,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const o=Date.now()+r,c=new Hu(e,t,o,i,s);return c.start(r),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(C.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ui(n,e){if(Re("AsyncQueue",`${e}: ${n}`),Dn(n))return new N(C.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(e){this.comparator=e?(t,r)=>e(t,r)||B.comparator(t.key,r.key):(t,r)=>B.comparator(t.key,r.key),this.keyedMap=Hi(),this.sortedSet=new ae(this.comparator)}static emptySet(e){return new Dr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Dr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Dr;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(){this.W_=new ae(B.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):j():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class Wr{constructor(e,t,r,i,s,o,c,u,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,i,s){const o=[];return t.forEach(c=>{o.push({type:0,doc:c})}),new Wr(e,t,Dr.emptySet(t),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ds(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _w{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class yw{constructor(){this.queries=nf(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const i=F(t),s=i.queries;i.queries=nf(),s.forEach((o,c)=>{for(const u of c.j_)u.onError(r)})})(this,new N(C.ABORTED,"Firestore shutting down"))}}function nf(){return new $t(n=>ep(n),Ds)}async function Wu(n,e){const t=F(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new _w,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await t.onListen(i,!0);break;case 1:s.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const c=ui(o,`Initialization of query '${br(e.query)}' failed`);return void e.onError(c)}t.queries.set(i,s),s.j_.push(e),e.Z_(t.onlineState),s.z_&&e.X_(s.z_)&&Ju(t)}async function Qu(n,e){const t=F(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Iw(n,e){const t=F(n);let r=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const c of o.j_)c.X_(i)&&(r=!0);o.z_=i}}r&&Ju(t)}function Tw(n,e,t){const r=F(n),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(t);r.queries.delete(e)}function Ju(n){n.Y_.forEach(e=>{e.next()})}var cu,rf;(rf=cu||(cu={})).ea="default",rf.Cache="cache";class Yu{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Wr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Wr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==cu.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ew{constructor(e,t){this.aa=e,this.byteLength=t}ua(){return"metadata"in this.aa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(e){this.serializer=e}Es(e){return vt(this.serializer,e)}ds(e){return e.metadata.exists?Rp(this.serializer,e.document,!1):le.newNoDocument(this.Es(e.metadata.name),this.As(e.metadata.readTime))}As(e){return be(e)}}class vw{constructor(e,t,r){this.ca=e,this.localStore=t,this.serializer=r,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=og(e)}la(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.aa.namedQuery)this.queries.push(e.aa.namedQuery);else if(e.aa.documentMetadata){this.documents.push({metadata:e.aa.documentMetadata}),e.aa.documentMetadata.exists||++t;const r=X.fromString(e.aa.documentMetadata.name);this.collectionGroups.add(r.get(r.length-2))}else e.aa.document&&(this.documents[this.documents.length-1].document=e.aa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}ha(e){const t=new Map,r=new sf(this.serializer);for(const i of e)if(i.metadata.queries){const s=r.Es(i.metadata.name);for(const o of i.metadata.queries){const c=(t.get(o)||Q()).add(s);t.set(o,c)}}return t}async complete(){const e=await Jv(this.localStore,new sf(this.serializer),this.documents,this.ca.id),t=this.ha(this.documents);for(const r of this.queries)await Yv(this.localStore,r,t.get(r.name));return this.progress.taskState="Success",{progress:this.progress,Pa:this.collectionGroups,Ia:e}}}function og(n){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:n.totalDocuments,totalBytes:n.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ag{constructor(e){this.key=e}}class cg{constructor(e){this.key=e}}class ug{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Q(),this.mutatedKeys=Q(),this.Aa=np(e),this.Ra=new Dr(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new tf,i=t?t.Ra:this.Ra;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,c=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,l=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((d,m)=>{const g=i.get(d),T=ks(this.query,m)?m:null,w=!!g&&this.mutatedKeys.has(g.key),D=!!T&&(T.hasLocalMutations||this.mutatedKeys.has(T.key)&&T.hasCommittedMutations);let P=!1;g&&T?g.data.isEqual(T.data)?w!==D&&(r.track({type:3,doc:T}),P=!0):this.ga(g,T)||(r.track({type:2,doc:T}),P=!0,(u&&this.Aa(T,u)>0||l&&this.Aa(T,l)<0)&&(c=!0)):!g&&T?(r.track({type:0,doc:T}),P=!0):g&&!T&&(r.track({type:1,doc:g}),P=!0,(u||l)&&(c=!0)),P&&(T?(o=o.add(T),s=D?s.add(d):s.delete(d)):(o=o.delete(d),s=s.delete(d)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const d=this.query.limitType==="F"?o.last():o.first();o=o.delete(d.key),s=s.delete(d.key),r.track({type:1,doc:d})}return{Ra:o,fa:r,ns:c,mutatedKeys:s}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((d,m)=>function(T,w){const D=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return j()}};return D(T)-D(w)}(d.type,m.type)||this.Aa(d.doc,m.doc)),this.pa(r),i=i!=null&&i;const c=t&&!i?this.ya():[],u=this.da.size===0&&this.current&&!i?1:0,l=u!==this.Ea;return this.Ea=u,o.length!==0||l?{snapshot:new Wr(this.query,e.Ra,s,o,e.mutatedKeys,u===0,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new tf,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=Q(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new cg(r))}),this.da.forEach(r=>{e.has(r)||t.push(new ag(r))}),t}ba(e){this.Ta=e.Ts,this.da=Q();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Wr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class ww{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Aw{constructor(e){this.key=e,this.va=!1}}class Rw{constructor(e,t,r,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new $t(c=>ep(c),Ds),this.Ma=new Map,this.xa=new Set,this.Oa=new ae(B.comparator),this.Na=new Map,this.La=new Mu,this.Ba={},this.ka=new Map,this.qa=or.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function bw(n,e,t=!0){const r=Aa(n);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await lg(r,e,t,!0),i}async function Sw(n,e){const t=Aa(n);await lg(t,e,!0,!1)}async function lg(n,e,t,r){const i=await $r(n.localStore,He(e)),s=i.targetId,o=n.sharedClientState.addLocalQueryTarget(s,t);let c;return r&&(c=await Xu(n,e,s,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&wa(n.remoteStore,i),c}async function Xu(n,e,t,r,i){n.Ka=(m,g,T)=>async function(D,P,x,M){let O=P.view.ma(x);O.ns&&(O=await Yo(D.localStore,P.query,!1).then(({documents:E})=>P.view.ma(E,O)));const G=M&&M.targetChanges.get(P.targetId),W=M&&M.targetMismatches.get(P.targetId)!=null,$=P.view.applyChanges(O,D.isPrimaryClient,G,W);return uu(D,P.targetId,$.wa),$.snapshot}(n,m,g,T);const s=await Yo(n.localStore,e,!0),o=new ug(e,s.Ts),c=o.ma(s.documents),u=Os.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),l=o.applyChanges(c,n.isPrimaryClient,u);uu(n,t,l.wa);const d=new ww(e,t,o);return n.Fa.set(e,d),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),l.snapshot}async function Pw(n,e,t){const r=F(n),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(o=>!Ds(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Kr(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),t&&Hr(r.remoteStore,i.targetId),Qr(r,i.targetId)}).catch(Cn)):(Qr(r,i.targetId),await Kr(r.localStore,i.targetId,!0))}async function Cw(n,e){const t=F(n),r=t.Fa.get(e),i=t.Ma.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Hr(t.remoteStore,r.targetId))}async function Dw(n,e,t){const r=nl(n);try{const i=await function(o,c){const u=F(o),l=ge.now(),d=c.reduce((T,w)=>T.add(w.key),Q());let m,g;return u.persistence.runTransaction("Locally write mutations","readwrite",T=>{let w=tt(),D=Q();return u.cs.getEntries(T,d).next(P=>{w=P,w.forEach((x,M)=>{M.isValidDocument()||(D=D.add(x))})}).next(()=>u.localDocuments.getOverlayedDocuments(T,w)).next(P=>{m=P;const x=[];for(const M of c){const O=nv(M,m.get(M.key).overlayedDocument);O!=null&&x.push(new Kt(M.key,O,zm(O.value.mapValue),pe.exists(!0)))}return u.mutationQueue.addMutationBatch(T,l,x,c)}).next(P=>{g=P;const x=P.applyToLocalDocumentSet(m,D);return u.documentOverlayCache.saveOverlays(T,P.batchId,x)})}).then(()=>({batchId:g.batchId,changes:ip(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,c,u){let l=o.Ba[o.currentUser.toKey()];l||(l=new ae(H)),l=l.insert(c,u),o.Ba[o.currentUser.toKey()]=l}(r,i.batchId,t),await Ht(r,i.changes),await ai(r.remoteStore)}catch(i){const s=ui(i,"Failed to persist write");t.reject(s)}}async function hg(n,e){const t=F(n);try{const r=await Wv(t.localStore,e);e.targetChanges.forEach((i,s)=>{const o=t.Na.get(s);o&&(z(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?z(o.va):i.removedDocuments.size>0&&(z(o.va),o.va=!1))}),await Ht(t,r,e)}catch(r){await Cn(r)}}function of(n,e,t){const r=F(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.Fa.forEach((s,o)=>{const c=o.view.Z_(e);c.snapshot&&i.push(c.snapshot)}),function(o,c){const u=F(o);u.onlineState=c;let l=!1;u.queries.forEach((d,m)=>{for(const g of m.j_)g.Z_(c)&&(l=!0)}),l&&Ju(u)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function kw(n,e,t){const r=F(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Na.get(e),s=i&&i.key;if(s){let o=new ae(B.comparator);o=o.insert(s,le.newNoDocument(s,K.min()));const c=Q().add(s),u=new Vs(K.min(),new Map,new ae(H),o,c);await hg(r,u),r.Oa=r.Oa.remove(s),r.Na.delete(e),tl(r)}else await Kr(r.localStore,e,!1).then(()=>Qr(r,e,t)).catch(Cn)}async function Nw(n,e){const t=F(n),r=e.batch.batchId;try{const i=await Hv(t.localStore,e);el(t,r,null),Zu(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Ht(t,i)}catch(i){await Cn(i)}}async function Vw(n,e,t){const r=F(n);try{const i=await function(o,c){const u=F(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",l=>{let d;return u.mutationQueue.lookupMutationBatch(l,c).next(m=>(z(m!==null),d=m.keys(),u.mutationQueue.removeMutationBatch(l,m))).next(()=>u.mutationQueue.performConsistencyCheck(l)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(l,d,c)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(l,d)).next(()=>u.localDocuments.getDocuments(l,d))})}(r.localStore,e);el(r,e,t),Zu(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Ht(r,i)}catch(i){await Cn(i)}}async function Ow(n,e){const t=F(n);Nn(t.remoteStore)||V("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const r=await function(o){const c=F(o);return c.persistence.runTransaction("Get highest unacknowledged batch id","readonly",u=>c.mutationQueue.getHighestUnacknowledgedBatchId(u))}(t.localStore);if(r===-1)return void e.resolve();const i=t.ka.get(r)||[];i.push(e),t.ka.set(r,i)}catch(r){const i=ui(r,"Initialization of waitForPendingWrites() operation failed");e.reject(i)}}function Zu(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function el(n,e,t){const r=F(n);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function Qr(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||dg(n,r)})}function dg(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Hr(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),tl(n))}function uu(n,e,t){for(const r of t)r instanceof ag?(n.La.addReference(r.key,e),xw(n,r)):r instanceof cg?(V("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||dg(n,r.key)):j()}function xw(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(V("SyncEngine","New document in limbo: "+t),n.xa.add(r),tl(n))}function tl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new B(X.fromString(e)),r=n.qa.next();n.Na.set(r,new Aw(t)),n.Oa=n.Oa.insert(t,r),wa(n.remoteStore,new Ot(He(ri(t.path)),r,"TargetPurposeLimboResolution",Ze.oe))}}async function Ht(n,e,t){const r=F(n),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((c,u)=>{o.push(r.Ka(u,e,t).then(l=>{var d;if((l||t)&&r.isPrimaryClient){const m=l?!l.fromCache:(d=t==null?void 0:t.targetChanges.get(u.targetId))===null||d===void 0?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(l){i.push(l);const m=qu.Wi(u.targetId,l);s.push(m)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(u,l){const d=F(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>R.forEach(l,g=>R.forEach(g.$i,T=>d.persistence.referenceDelegate.addReference(m,g.targetId,T)).next(()=>R.forEach(g.Ui,T=>d.persistence.referenceDelegate.removeReference(m,g.targetId,T)))))}catch(m){if(!Dn(m))throw m;V("LocalStore","Failed to update sequence numbers: "+m)}for(const m of l){const g=m.targetId;if(!m.fromCache){const T=d.os.get(g),w=T.snapshotVersion,D=T.withLastLimboFreeSnapshotVersion(w);d.os=d.os.insert(g,D)}}}(r.localStore,s))}async function Lw(n,e){const t=F(n);if(!t.currentUser.isEqual(e)){V("SyncEngine","User change. New user:",e.toKey());const r=await Kp(t.localStore,e);t.currentUser=e,function(s,o){s.ka.forEach(c=>{c.forEach(u=>{u.reject(new N(C.CANCELLED,o))})}),s.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ht(t,r.hs)}}function Mw(n,e){const t=F(n),r=t.Na.get(e);if(r&&r.va)return Q().add(r.key);{let i=Q();const s=t.Ma.get(e);if(!s)return i;for(const o of s){const c=t.Fa.get(o);i=i.unionWith(c.view.Va)}return i}}async function Fw(n,e){const t=F(n),r=await Yo(t.localStore,e.query,!0),i=e.view.ba(r);return t.isPrimaryClient&&uu(t,e.targetId,i.wa),i}async function Uw(n,e){const t=F(n);return Jp(t.localStore,e).then(r=>Ht(t,r))}async function Bw(n,e,t,r){const i=F(n),s=await function(c,u){const l=F(c),d=F(l.mutationQueue);return l.persistence.runTransaction("Lookup mutation documents","readonly",m=>d.Mn(m,u).next(g=>g?l.localDocuments.getDocuments(m,g):R.resolve(null)))}(i.localStore,e);s!==null?(t==="pending"?await ai(i.remoteStore):t==="acknowledged"||t==="rejected"?(el(i,e,r||null),Zu(i,e),function(c,u){F(F(c).mutationQueue).On(u)}(i.localStore,e)):j(),await Ht(i,s)):V("SyncEngine","Cannot apply mutation batch with id: "+e)}async function qw(n,e){const t=F(n);if(Aa(t),nl(t),e===!0&&t.Qa!==!0){const r=t.sharedClientState.getAllActiveQueryTargets(),i=await af(t,r.toArray());t.Qa=!0,await au(t.remoteStore,!0);for(const s of i)wa(t.remoteStore,s)}else if(e===!1&&t.Qa!==!1){const r=[];let i=Promise.resolve();t.Ma.forEach((s,o)=>{t.sharedClientState.isLocalQueryTarget(o)?r.push(o):i=i.then(()=>(Qr(t,o),Kr(t.localStore,o,!0))),Hr(t.remoteStore,o)}),await i,await af(t,r),function(o){const c=F(o);c.Na.forEach((u,l)=>{Hr(c.remoteStore,l)}),c.La.pr(),c.Na=new Map,c.Oa=new ae(B.comparator)}(t),t.Qa=!1,await au(t.remoteStore,!1)}}async function af(n,e,t){const r=F(n),i=[],s=[];for(const o of e){let c;const u=r.Ma.get(o);if(u&&u.length!==0){c=await $r(r.localStore,He(u[0]));for(const l of u){const d=r.Fa.get(l),m=await Fw(r,d);m.snapshot&&s.push(m.snapshot)}}else{const l=await Qp(r.localStore,o);c=await $r(r.localStore,l),await Xu(r,fg(l),o,!1,c.resumeToken)}i.push(c)}return r.Ca.d_(s),i}function fg(n){return Ym(n.path,n.collectionGroup,n.orderBy,n.filters,n.limit,"F",n.startAt,n.endAt)}function jw(n){return function(t){return F(F(t).persistence).Qi()}(F(n).localStore)}async function zw(n,e,t,r){const i=F(n);if(i.Qa)return void V("SyncEngine","Ignoring unexpected query state notification.");const s=i.Ma.get(e);if(s&&s.length>0)switch(t){case"current":case"not-current":{const o=await Jp(i.localStore,tp(s[0])),c=Vs.createSynthesizedRemoteEventForCurrentChange(e,t==="current",Te.EMPTY_BYTE_STRING);await Ht(i,o,c);break}case"rejected":await Kr(i.localStore,e,!0),Qr(i,e,r);break;default:j()}}async function Gw(n,e,t){const r=Aa(n);if(r.Qa){for(const i of e){if(r.Ma.has(i)&&r.sharedClientState.isActiveQueryTarget(i)){V("SyncEngine","Adding an already active target "+i);continue}const s=await Qp(r.localStore,i),o=await $r(r.localStore,s);await Xu(r,fg(s),o.targetId,!1,o.resumeToken),wa(r.remoteStore,o)}for(const i of t)r.Ma.has(i)&&await Kr(r.localStore,i,!1).then(()=>{Hr(r.remoteStore,i),Qr(r,i)}).catch(Cn)}}function Aa(n){const e=F(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=hg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Mw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=kw.bind(null,e),e.Ca.d_=Iw.bind(null,e.eventManager),e.Ca.$a=Tw.bind(null,e.eventManager),e}function nl(n){const e=F(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Nw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Vw.bind(null,e),e}function $w(n,e,t){const r=F(n);(async function(s,o,c){try{const u=await o.getMetadata();if(await function(T,w){const D=F(T),P=be(w.createTime);return D.persistence.runTransaction("hasNewerBundle","readonly",x=>D.Gr.getBundleMetadata(x,w.id)).then(x=>!!x&&x.createTime.compareTo(P)>=0)}(s.localStore,u))return await o.close(),c._completeWith(function(T){return{taskState:"Success",documentsLoaded:T.totalDocuments,bytesLoaded:T.totalBytes,totalDocuments:T.totalDocuments,totalBytes:T.totalBytes}}(u)),Promise.resolve(new Set);c._updateProgress(og(u));const l=new vw(u,s.localStore,o.serializer);let d=await o.Ua();for(;d;){const g=await l.la(d);g&&c._updateProgress(g),d=await o.Ua()}const m=await l.complete();return await Ht(s,m.Ia,void 0),await function(T,w){const D=F(T);return D.persistence.runTransaction("Save bundle","readwrite",P=>D.Gr.saveBundleMetadata(P,w))}(s.localStore,u),c._completeWith(m.progress),Promise.resolve(m.Pa)}catch(u){return it("SyncEngine",`Loading bundle failed with ${u}`),c._failWith(u),Promise.resolve(new Set)}})(r,e,t).then(i=>{r.sharedClientState.notifyBundleLoaded(i)})}class Rn{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=xs(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return $p(this.persistence,new Gp,e.initialUser,this.serializer)}Ga(e){return new Fu(va.Zr,this.serializer)}Wa(e){return new Xp}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Rn.provider={build:()=>new Rn};class Kw extends Rn{constructor(e){super(),this.cacheSizeBytes=e}ja(e,t){z(this.persistence.referenceDelegate instanceof Jo);const r=this.persistence.referenceDelegate.garbageCollector;return new Up(r,e.asyncQueue,t)}Ga(e){const t=this.cacheSizeBytes!==void 0?Ge.withCacheSize(this.cacheSizeBytes):Ge.DEFAULT;return new Fu(r=>Jo.Zr(r,t),this.serializer)}}class rl extends Rn{constructor(e,t,r){super(),this.Ja=e,this.cacheSizeBytes=t,this.forceOwnership=r,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Ja.initialize(this,e),await nl(this.Ja.syncEngine),await ai(this.Ja.remoteStore),await this.persistence.yi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}za(e){return $p(this.persistence,new Gp,e.initialUser,this.serializer)}ja(e,t){const r=this.persistence.referenceDelegate.garbageCollector;return new Up(r,e.asyncQueue,t)}Ha(e,t){const r=new fE(t,this.persistence);return new dE(e.asyncQueue,r)}Ga(e){const t=Bu(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),r=this.cacheSizeBytes!==void 0?Ge.withCacheSize(this.cacheSizeBytes):Ge.DEFAULT;return new Uu(this.synchronizeTabs,t,e.clientId,r,e.asyncQueue,Zp(),Vo(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Wa(e){return new Xp}}class mg extends rl{constructor(e,t){super(e,t,!1),this.Ja=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Ja.syncEngine;this.sharedClientState instanceof Cc&&(this.sharedClientState.syncEngine={no:Bw.bind(null,t),ro:zw.bind(null,t),io:Gw.bind(null,t),Qi:jw.bind(null,t),eo:Uw.bind(null,t)},await this.sharedClientState.start()),await this.persistence.yi(async r=>{await qw(this.Ja.syncEngine,r),this.gcScheduler&&(r&&!this.gcScheduler.started?this.gcScheduler.start():r||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(r&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():r||this.indexBackfillerScheduler.stop())})}Wa(e){const t=Zp();if(!Cc.D(t))throw new N(C.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const r=Bu(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Cc(t,e.asyncQueue,r,e.clientId,e.initialUser)}}class bn{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>of(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Lw.bind(null,this.syncEngine),await au(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new yw}()}createDatastore(e){const t=xs(e.databaseInfo.databaseId),r=function(s){return new tw(s)}(e.databaseInfo);return function(s,o,c,u){return new iw(s,o,c,u)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,o,c){return new ow(r,i,s,o,c)}(this.localStore,this.datastore,e.asyncQueue,t=>of(this.syncEngine,t,0),function(){return Zd.D()?new Zd:new Xv}())}createSyncEngine(e,t){return function(i,s,o,c,u,l,d){const m=new Rw(i,s,o,c,u,l);return d&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=F(i);V("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await oi(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}bn.provider={build:()=>new bn};function cf(n,e=10240){let t=0;return{async read(){if(t<n.byteLength){const r={value:n.slice(t,t+e),done:!1};return t+=e,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Re("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hw{constructor(e,t){this.Xa=e,this.serializer=t,this.metadata=new Ve,this.buffer=new Uint8Array,this.eu=function(){return new TextDecoder("utf-8")}(),this.tu().then(r=>{r&&r.ua()?this.metadata.resolve(r.aa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(r==null?void 0:r.aa)}`))},r=>this.metadata.reject(r))}close(){return this.Xa.cancel()}async getMetadata(){return this.metadata.promise}async Ua(){return await this.getMetadata(),this.tu()}async tu(){const e=await this.nu();if(e===null)return null;const t=this.eu.decode(e),r=Number(t);isNaN(r)&&this.ru(`length string (${t}) is not valid number`);const i=await this.iu(r);return new Ew(JSON.parse(i),e.length+r)}su(){return this.buffer.findIndex(e=>e===123)}async nu(){for(;this.su()<0&&!await this.ou(););if(this.buffer.length===0)return null;const e=this.su();e<0&&this.ru("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async iu(e){for(;this.buffer.length<e;)await this.ou()&&this.ru("Reached the end of bundle when more is expected.");const t=this.eu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}ru(e){throw this.Xa.cancel(),new Error(`Invalid bundle format: ${e}`)}async ou(){const e=await this.Xa.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ww{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new N(C.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(i,s){const o=F(i),c={documents:s.map(m=>ys(o.serializer,m))},u=await o.Lo("BatchGetDocuments",o.serializer.databaseId,X.emptyPath(),c,s.length),l=new Map;u.forEach(m=>{const g=hv(o.serializer,m);l.set(g.key.toString(),g)});const d=[];return s.forEach(m=>{const g=l.get(m.toString());z(!!g),d.push(g)}),d}(this.datastore,e);return t.forEach(r=>this.recordVersion(r)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new si(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,r)=>{const i=B.fromPath(r);this.mutations.push(new Pu(i,this.precondition(i)))}),await async function(r,i){const s=F(r),o={writes:i.map(c=>Is(s.serializer,c))};await s.Mo("Commit",s.serializer.databaseId,X.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw j();t=K.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new N(C.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(K.min())?pe.exists(!1):pe.updateTime(t):pe.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(K.min()))throw new N(C.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return pe.updateTime(t)}return pe.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qw{constructor(e,t,r,i,s){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=i,this.deferred=s,this._u=r.maxAttempts,this.t_=new zu(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new Ww(this.datastore),t=this.cu(e);t&&t.then(r=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(r)}).catch(i=>{this.lu(i)}))}).catch(r=>{this.lu(r)})})}cu(e){try{const t=this.updateFunction(e);return!Ps(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!pp(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jw{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=Ne.UNAUTHENTICATED,this.clientId=Tu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{V("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(V("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ve;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=ui(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function kc(n,e){n.asyncQueue.verifyOperationInProgress(),V("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async i=>{r.isEqual(i)||(await Kp(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function uf(n,e){n.asyncQueue.verifyOperationInProgress();const t=await il(n);V("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>ef(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>ef(e.remoteStore,i)),n._onlineComponents=e}async function il(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){V("FirestoreClient","Using user provided OfflineComponentProvider");try{await kc(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===C.FAILED_PRECONDITION||i.code===C.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;it("Error using user provided cache. Falling back to memory cache: "+t),await kc(n,new Rn)}}else V("FirestoreClient","Using default OfflineComponentProvider"),await kc(n,new Rn);return n._offlineComponents}async function ba(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(V("FirestoreClient","Using user provided OnlineComponentProvider"),await uf(n,n._uninitializedComponentsProvider._online)):(V("FirestoreClient","Using default OnlineComponentProvider"),await uf(n,new bn))),n._onlineComponents}function pg(n){return il(n).then(e=>e.persistence)}function li(n){return il(n).then(e=>e.localStore)}function gg(n){return ba(n).then(e=>e.remoteStore)}function sl(n){return ba(n).then(e=>e.syncEngine)}function _g(n){return ba(n).then(e=>e.datastore)}async function Jr(n){const e=await ba(n),t=e.eventManager;return t.onListen=bw.bind(null,e.syncEngine),t.onUnlisten=Pw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Sw.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Cw.bind(null,e.syncEngine),t}function Yw(n){return n.asyncQueue.enqueue(async()=>{const e=await pg(n),t=await gg(n);return e.setNetworkEnabled(!0),function(i){const s=F(i);return s.L_.delete(0),Ls(s)}(t)})}function Xw(n){return n.asyncQueue.enqueue(async()=>{const e=await pg(n),t=await gg(n);return e.setNetworkEnabled(!1),async function(i){const s=F(i);s.L_.add(0),await oi(s),s.q_.set("Offline")}(t)})}function Zw(n,e){const t=new Ve;return n.asyncQueue.enqueueAndForget(async()=>async function(i,s,o){try{const c=await function(l,d){const m=F(l);return m.persistence.runTransaction("read document","readonly",g=>m.localDocuments.getDocument(g,d))}(i,s);c.isFoundDocument()?o.resolve(c):c.isNoDocument()?o.resolve(null):o.reject(new N(C.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(c){const u=ui(c,`Failed to get document '${s} from cache`);o.reject(u)}}(await li(n),e,t)),t.promise}function yg(n,e,t={}){const r=new Ve;return n.asyncQueue.enqueueAndForget(async()=>function(s,o,c,u,l){const d=new Ra({next:g=>{d.Za(),o.enqueueAndForget(()=>Qu(s,m));const T=g.docs.has(c);!T&&g.fromCache?l.reject(new N(C.UNAVAILABLE,"Failed to get document because the client is offline.")):T&&g.fromCache&&u&&u.source==="server"?l.reject(new N(C.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),m=new Yu(ri(c.path),d,{includeMetadataChanges:!0,_a:!0});return Wu(s,m)}(await Jr(n),n.asyncQueue,e,t,r)),r.promise}function eA(n,e){const t=new Ve;return n.asyncQueue.enqueueAndForget(async()=>async function(i,s,o){try{const c=await Yo(i,s,!0),u=new ug(s,c.Ts),l=u.ma(c.documents),d=u.applyChanges(l,!1);o.resolve(d.snapshot)}catch(c){const u=ui(c,`Failed to execute query '${s} against cache`);o.reject(u)}}(await li(n),e,t)),t.promise}function Ig(n,e,t={}){const r=new Ve;return n.asyncQueue.enqueueAndForget(async()=>function(s,o,c,u,l){const d=new Ra({next:g=>{d.Za(),o.enqueueAndForget(()=>Qu(s,m)),g.fromCache&&u.source==="server"?l.reject(new N(C.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(g)},error:g=>l.reject(g)}),m=new Yu(c,d,{includeMetadataChanges:!0,_a:!0});return Wu(s,m)}(await Jr(n),n.asyncQueue,e,t,r)),r.promise}function tA(n,e,t){const r=new Ve;return n.asyncQueue.enqueueAndForget(async()=>{try{const i=await _g(n);r.resolve(async function(o,c,u){var l;const d=F(o),{request:m,ut:g,parent:T}=Sp(d.serializer,Xm(c),u);d.connection.Fo||delete m.parent;const w=(await d.Lo("RunAggregationQuery",d.serializer.databaseId,T,m,1)).filter(P=>!!P.result);z(w.length===1);const D=(l=w[0].result)===null||l===void 0?void 0:l.aggregateFields;return Object.keys(D).reduce((P,x)=>(P[g[x]]=D[x],P),{})}(i,e,t))}catch(i){r.reject(i)}}),r.promise}function nA(n,e){const t=new Ra(e);return n.asyncQueue.enqueueAndForget(async()=>function(i,s){F(i).Y_.add(s),s.next()}(await Jr(n),t)),()=>{t.Za(),n.asyncQueue.enqueueAndForget(async()=>function(i,s){F(i).Y_.delete(s)}(await Jr(n),t))}}function rA(n,e,t,r){const i=function(o,c){let u;return u=typeof o=="string"?_p().encode(o):o,function(d,m){return new Hw(d,m)}(function(d,m){if(d instanceof Uint8Array)return cf(d,m);if(d instanceof ArrayBuffer)return cf(new Uint8Array(d),m);if(d instanceof ReadableStream)return d.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(u),c)}(t,xs(e));n.asyncQueue.enqueueAndForget(async()=>{$w(await sl(n),i,r)})}function iA(n,e){return n.asyncQueue.enqueue(async()=>function(r,i){const s=F(r);return s.persistence.runTransaction("Get named query","readonly",o=>s.Gr.getNamedQuery(o,i))}(await li(n),e))}function sA(n,e){return n.asyncQueue.enqueue(async()=>async function(r,i){const s=F(r),o=s.indexManager,c=[];return s.persistence.runTransaction("Configure indexes","readwrite",u=>o.getFieldIndexes(u).next(l=>function(m,g,T,w,D){m=[...m],g=[...g],m.sort(T),g.sort(T);const P=m.length,x=g.length;let M=0,O=0;for(;M<x&&O<P;){const G=T(m[O],g[M]);G<0?D(m[O++]):G>0?w(g[M++]):(M++,O++)}for(;M<x;)w(g[M++]);for(;O<P;)D(m[O++])}(l,i,cE,d=>{c.push(o.addFieldIndex(u,d))},d=>{c.push(o.deleteFieldIndex(u,d))})).next(()=>R.waitFor(c)))}(await li(n),e))}function oA(n,e){return n.asyncQueue.enqueue(async()=>function(r,i){F(r).ss.zi=i}(await li(n),e))}function aA(n){return n.asyncQueue.enqueue(async()=>function(t){const r=F(t),i=r.indexManager;return r.persistence.runTransaction("Delete All Indexes","readwrite",s=>i.deleteAllFieldIndexes(s))}(await li(n)))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tg(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ol(n,e,t){if(!t)throw new N(C.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Eg(n,e,t,r){if(e===!0&&r===!0)throw new N(C.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function hf(n){if(!B.isDocumentKey(n))throw new N(C.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function df(n){if(B.isDocumentKey(n))throw new N(C.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Sa(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":j()}function J(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(C.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Sa(n);throw new N(C.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function vg(n,e){if(e<=0)throw new N(C.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new N(C.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new N(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Eg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Tg((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new N(C.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new N(C.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new N(C.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ms{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ff({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(C.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(C.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ff(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Rm;switch(r.type){case"firstParty":return new rE(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(C.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=lf.get(t);r&&(V("ComponentProvider","Removing Datastore"),lf.delete(t),r.terminate())}(this),Promise.resolve()}}function wg(n,e,t,r={}){var i;const s=(n=J(n,Ms))._getSettings(),o=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&it("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let c,u;if(typeof r.mockUserToken=="string")c=r.mockUserToken,u=Ne.MOCK_USER;else{c=rm(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const l=r.mockUserToken.sub||r.mockUserToken.user_id;if(!l)throw new N(C.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Ne(l)}n._authCredentials=new eE(new Am(c,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new xe(this.firestore,e,this._query)}}class we{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new mt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new we(this.firestore,e,this._key)}}class mt extends xe{constructor(e,t,r){super(e,t,ri(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new we(this.firestore,null,new B(e))}withConverter(e){return new mt(this.firestore,e,this._path)}}function cA(n,e,...t){if(n=q(n),ol("collection","path",e),n instanceof Ms){const r=X.fromString(e,...t);return df(r),new mt(n,null,r)}{if(!(n instanceof we||n instanceof mt))throw new N(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return df(r),new mt(n.firestore,null,r)}}function uA(n,e){if(n=J(n,Ms),ol("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new N(C.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new xe(n,null,function(r){return new Gt(X.emptyPath(),r)}(e))}function Pa(n,e,...t){if(n=q(n),arguments.length===1&&(e=Tu.newId()),ol("doc","path",e),n instanceof Ms){const r=X.fromString(e,...t);return hf(r),new we(n,null,new B(r))}{if(!(n instanceof we||n instanceof mt))throw new N(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return hf(r),new we(n.firestore,n instanceof mt?n.converter:null,new B(r))}}function lA(n,e){return n=q(n),e=q(e),(n instanceof we||n instanceof mt)&&(e instanceof we||e instanceof mt)&&n.firestore===e.firestore&&n.path===e.path&&n.converter===e.converter}function al(n,e){return n=q(n),e=q(e),n instanceof xe&&e instanceof xe&&n.firestore===e.firestore&&Ds(n._query,e._query)&&n.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mf{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new zu(this,"async_queue_retry"),this.Vu=()=>{const r=Vo();r&&V("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Vo();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Vo();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Ve;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Dn(e))throw e;V("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(o){let c=o.message||"";return o.stack&&(c=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),c}(r);throw Re("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=Hu.createAndSchedule(this,e,t,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&j()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function lu(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(n,["next","error","complete"])}class Ag{constructor(){this._progressObserver={},this._taskCompletionResolver=new Ve,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,r){this._progressObserver={next:e,error:t,complete:r}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hA=-1;class se extends Ms{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new mf,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new mf(e),this._firestoreClient=void 0,await e}}}function dA(n,e,t){t||(t="(default)");const r=lr(n,"firestore");if(r.isInitialized(t)){const i=r.getImmediate({identifier:t}),s=r.getOptions(t);if(pn(s,e))return i;throw new N(C.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new N(C.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new N(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return r.initialize({options:e,instanceIdentifier:t})}function fA(n,e){const t=typeof n=="object"?n:da(),r=typeof n=="string"?n:e||"(default)",i=lr(t,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=em("firestore");s&&wg(i,...s)}return i}function ye(n){if(n._terminated)throw new N(C.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Rg(n),n._firestoreClient}function Rg(n){var e,t,r;const i=n._freezeSettings(),s=function(c,u,l,d){return new xE(c,u,l,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,Tg(d.experimentalLongPollingOptions),d.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new Jw(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&function(c){const u=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(u),_online:u}}(n._componentsProvider))}function mA(n,e){it("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=n._freezeSettings();return bg(n,bn.provider,{build:r=>new rl(r,t.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function pA(n){it("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=n._freezeSettings();bg(n,bn.provider,{build:t=>new mg(t,e.cacheSizeBytes)})}function bg(n,e,t){if((n=J(n,se))._firestoreClient||n._terminated)throw new N(C.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(n._componentsProvider||n._getSettings().localCache)throw new N(C.FAILED_PRECONDITION,"SDK cache is already specified.");n._componentsProvider={_online:e,_offline:t},Rg(n)}function gA(n){if(n._initialized&&!n._terminated)throw new N(C.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new Ve;return n._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(r){if(!Et.D())return Promise.resolve();const i=r+"main";await Et.delete(i)}(Bu(n._databaseId,n._persistenceKey)),e.resolve()}catch(t){e.reject(t)}}),e.promise}function _A(n){return function(t){const r=new Ve;return t.asyncQueue.enqueueAndForget(async()=>Ow(await sl(t),r)),r.promise}(ye(n=J(n,se)))}function yA(n){return Yw(ye(n=J(n,se)))}function IA(n){return Xw(ye(n=J(n,se)))}function TA(n){return hm(n.app,"firestore",n._databaseId.database),n._delete()}function EA(n,e){const t=ye(n=J(n,se)),r=new Ag;return rA(t,n._databaseId,e,r),r}function vA(n,e){return iA(ye(n=J(n,se)),e).then(t=>t?new xe(n,null,t.query):null)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class Sg{constructor(e,t,r){this._userDataWriter=t,this._data=r,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Sn(Te.fromBase64String(e))}catch(t){throw new N(C.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Sn(Te.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(C.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new he(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function wA(){return new Vn("__name__")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(C.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(C.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return H(this._lat,e._lat)||H(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AA=/^__.*__$/;class RA{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Kt(e,this.data,this.fieldMask,t,this.fieldTransforms):new ii(e,this.data,t,this.fieldTransforms)}}class Pg{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Kt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Cg(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw j()}}class Da{constructor(e,t,r,i,s,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Da(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return ta(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Cg(this.Cu)&&AA.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class bA{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||xs(e)}Qu(e,t,r,i=!1){return new Da({Cu:e,methodName:t,qu:r,path:he.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function hr(n){const e=n._freezeSettings(),t=xs(n._databaseId);return new bA(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ka(n,e,t,r,i,s={}){const o=n.Qu(s.merge||s.mergeFields?2:0,e,t,i);ml("Data must be an object, but it was:",o,r);const c=Ng(r,o);let u,l;if(s.merge)u=new et(o.fieldMask),l=o.fieldTransforms;else if(s.mergeFields){const d=[];for(const m of s.mergeFields){const g=Ts(e,m,t);if(!o.contains(g))throw new N(C.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Og(d,g)||d.push(g)}u=new et(d),l=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,l=o.fieldTransforms;return new RA(new Fe(c),u,l)}class Us extends On{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Us}}function Dg(n,e,t){return new Da({Cu:3,qu:e.settings.qu,methodName:n._methodName,xu:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class cl extends On{_toFieldTransform(e){return new Ns(e.path,new jr)}isEqual(e){return e instanceof cl}}class ul extends On{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=Dg(this,e,!0),r=this.Ku.map(s=>dr(s,t)),i=new nr(r);return new Ns(e.path,i)}isEqual(e){return e instanceof ul&&pn(this.Ku,e.Ku)}}class ll extends On{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=Dg(this,e,!0),r=this.Ku.map(s=>dr(s,t)),i=new rr(r);return new Ns(e.path,i)}isEqual(e){return e instanceof ll&&pn(this.Ku,e.Ku)}}class hl extends On{constructor(e,t){super(e),this.$u=t}_toFieldTransform(e){const t=new zr(e.serializer,ap(e.serializer,this.$u));return new Ns(e.path,t)}isEqual(e){return e instanceof hl&&this.$u===e.$u}}function dl(n,e,t,r){const i=n.Qu(1,e,t);ml("Data must be an object, but it was:",i,r);const s=[],o=Fe.empty();kn(r,(u,l)=>{const d=Na(e,u,t);l=q(l);const m=i.Nu(d);if(l instanceof Us)s.push(d);else{const g=dr(l,m);g!=null&&(s.push(d),o.set(d,g))}});const c=new et(s);return new Pg(o,c,i.fieldTransforms)}function fl(n,e,t,r,i,s){const o=n.Qu(1,e,t),c=[Ts(e,r,t)],u=[i];if(s.length%2!=0)throw new N(C.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<s.length;g+=2)c.push(Ts(e,s[g])),u.push(s[g+1]);const l=[],d=Fe.empty();for(let g=c.length-1;g>=0;--g)if(!Og(l,c[g])){const T=c[g];let w=u[g];w=q(w);const D=o.Nu(T);if(w instanceof Us)l.push(T);else{const P=dr(w,D);P!=null&&(l.push(T),d.set(T,P))}}const m=new et(l);return new Pg(d,m,o.fieldTransforms)}function kg(n,e,t,r=!1){return dr(t,n.Qu(r?4:3,e))}function dr(n,e){if(Vg(n=q(n)))return ml("Unsupported field value:",e,n),Ng(n,e);if(n instanceof On)return function(r,i){if(!Cg(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const c of r){let u=dr(c,i.Lu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(n,e)}return function(r,i){if((r=q(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return ap(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=ge.fromDate(r);return{timestampValue:Gr(i.serializer,s)}}if(r instanceof ge){const s=new ge(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Gr(i.serializer,s)}}if(r instanceof Ca)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Sn)return{bytesValue:Tp(i.serializer,r._byteString)};if(r instanceof we){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Vu(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Fs)return function(o,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw c.Bu("VectorValues must only contain numeric values.");return Su(c.serializer,u)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${Sa(r)}`)}(n,e)}function Ng(n,e){const t={};return Um(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):kn(n,(r,i)=>{const s=dr(i,e.Mu(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function Vg(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ge||n instanceof Ca||n instanceof Sn||n instanceof we||n instanceof On||n instanceof Fs)}function ml(n,e,t){if(!Vg(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const r=Sa(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Ts(n,e,t){if((e=q(e))instanceof Vn)return e._internalPath;if(typeof e=="string")return Na(n,e);throw ta("Field path arguments must be of type string or ",n,!1,void 0,t)}const SA=new RegExp("[~\\*/\\[\\]]");function Na(n,e,t){if(e.search(SA)>=0)throw ta(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Vn(...e.split("."))._internalPath}catch{throw ta(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function ta(n,e,t,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new N(C.INVALID_ARGUMENT,c+n+u)}function Og(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new we(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new PA(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Va("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class PA extends Es{data(){return super.data()}}function Va(n,e){return typeof e=="string"?Na(n,e):e instanceof Vn?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xg(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(C.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class pl{}class hi extends pl{}function CA(n,e,...t){let r=[];e instanceof pl&&r.push(e),r=r.concat(t),function(s){const o=s.filter(u=>u instanceof fr).length,c=s.filter(u=>u instanceof di).length;if(o>1||o>0&&c>0)throw new N(C.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)n=i._apply(n);return n}class di extends hi{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new di(e,t,r)}_apply(e){const t=this._parse(e);return Mg(e._query,t),new xe(e.firestore,e.converter,Xc(e._query,t))}_parse(e){const t=hr(e.firestore);return function(s,o,c,u,l,d,m){let g;if(l.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new N(C.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){gf(m,d);const T=[];for(const w of m)T.push(pf(u,s,w));g={arrayValue:{values:T}}}else g=pf(u,s,m)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||gf(m,d),g=kg(c,o,m,d==="in"||d==="not-in");return Z.create(l,d,g)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function DA(n,e,t){const r=e,i=Va("where",n);return di._create(i,r,t)}class fr extends pl{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new fr(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:re.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let o=i;const c=s.getFlattenedFilters();for(const u of c)Mg(o,u),o=Xc(o,u)}(e._query,t),new xe(e.firestore,e.converter,Xc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function kA(...n){return n.forEach(e=>Fg("or",e)),fr._create("or",n)}function NA(...n){return n.forEach(e=>Fg("and",e)),fr._create("and",n)}class Oa extends hi{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Oa(e,t)}_apply(e){const t=function(i,s,o){if(i.startAt!==null)throw new N(C.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new N(C.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new _s(s,o)}(e._query,this._field,this._direction);return new xe(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new Gt(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function VA(n,e="asc"){const t=e,r=Va("orderBy",n);return Oa._create(r,t)}class Bs extends hi{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Bs(e,t,r)}_apply(e){return new xe(e.firestore,e.converter,$o(e._query,this._limit,this._limitType))}}function OA(n){return vg("limit",n),Bs._create("limit",n,"F")}function xA(n){return vg("limitToLast",n),Bs._create("limitToLast",n,"L")}class qs extends hi{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new qs(e,t,r)}_apply(e){const t=Lg(e,this.type,this._docOrFields,this._inclusive);return new xe(e.firestore,e.converter,function(i,s){return new Gt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,s,i.endAt)}(e._query,t))}}function LA(...n){return qs._create("startAt",n,!0)}function MA(...n){return qs._create("startAfter",n,!1)}class js extends hi{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new js(e,t,r)}_apply(e){const t=Lg(e,this.type,this._docOrFields,this._inclusive);return new xe(e.firestore,e.converter,function(i,s){return new Gt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,i.startAt,s)}(e._query,t))}}function FA(...n){return js._create("endBefore",n,!1)}function UA(...n){return js._create("endAt",n,!0)}function Lg(n,e,t,r){if(t[0]=q(t[0]),t[0]instanceof Es)return function(s,o,c,u,l){if(!u)throw new N(C.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);const d=[];for(const m of Cr(s))if(m.field.isKeyField())d.push(er(o,u.key));else{const g=u.data.field(m.field);if(ma(g))throw new N(C.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+m.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){const T=m.field.canonicalString();throw new N(C.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${T}' (used as the orderBy) does not exist.`)}d.push(g)}return new wn(d,l)}(n._query,n.firestore._databaseId,e,t[0]._document,r);{const i=hr(n.firestore);return function(o,c,u,l,d,m){const g=o.explicitOrderBy;if(d.length>g.length)throw new N(C.INVALID_ARGUMENT,`Too many arguments provided to ${l}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const T=[];for(let w=0;w<d.length;w++){const D=d[w];if(g[w].field.isKeyField()){if(typeof D!="string")throw new N(C.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${l}(), but got a ${typeof D}`);if(!Ru(o)&&D.indexOf("/")!==-1)throw new N(C.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${l}() must be a plain document ID, but '${D}' contains a slash.`);const P=o.path.child(X.fromString(D));if(!B.isDocumentKey(P))throw new N(C.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${l}() must result in a valid document path, but '${P}' is not because it contains an odd number of segments.`);const x=new B(P);T.push(er(c,x))}else{const P=kg(u,l,D);T.push(P)}}return new wn(T,m)}(n._query,n.firestore._databaseId,i,e,t,r)}}function pf(n,e,t){if(typeof(t=q(t))=="string"){if(t==="")throw new N(C.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ru(e)&&t.indexOf("/")!==-1)throw new N(C.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(X.fromString(t));if(!B.isDocumentKey(r))throw new N(C.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return er(n,new B(r))}if(t instanceof we)return er(n,t._key);throw new N(C.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Sa(t)}.`)}function gf(n,e){if(!Array.isArray(n)||n.length===0)throw new N(C.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Mg(n,e){const t=function(i,s){for(const o of i)for(const c of o.getFlattenedFilters())if(s.indexOf(c.op)>=0)return c.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new N(C.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(C.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function Fg(n,e){if(!(e instanceof di||e instanceof fr))throw new N(C.INVALID_ARGUMENT,`Function ${n}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class gl{convertValue(e,t="none"){switch(En(e)){case 0:return null;case 1:return e.booleanValue;case 2:return me(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(qt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw j()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return kn(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>me(o.doubleValue));return new Fs(s)}convertGeoPoint(e){return new Ca(me(e.latitude),me(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=pa(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(ms(e));default:return null}}convertTimestamp(e){const t=Bt(e);return new ge(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=X.fromString(e);z(kp(r));const i=new Tn(r.get(1),r.get(3)),s=new B(r.popFirst(5));return i.isEqual(t)||Re(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xa(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class BA extends gl{constructor(e){super(),this.firestore=e}convertBytes(e){return new Sn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new we(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qA(n){return new Yr("sum",Ts("sum",n))}function jA(n){return new Yr("avg",Ts("average",n))}function Ug(){return new Yr("count")}function zA(n,e){var t,r;return n instanceof Yr&&e instanceof Yr&&n.aggregateType===e.aggregateType&&((t=n._internalFieldPath)===null||t===void 0?void 0:t.canonicalString())===((r=e._internalFieldPath)===null||r===void 0?void 0:r.canonicalString())}function GA(n,e){return al(n.query,e.query)&&pn(n.data(),e.data())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ar extends Es{constructor(e,t,r,i,s,o){super(e,t,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ss(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Va("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class ss extends ar{data(e={}){return super.data(e)}}class cr{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new ln(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new ss(this._firestore,this._userDataWriter,r.key,r,new ln(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(C.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(c=>{const u=new ss(i._firestore,i._userDataWriter,c.doc.key,c.doc,new ln(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(c=>s||c.type!==3).map(c=>{const u=new ss(i._firestore,i._userDataWriter,c.doc.key,c.doc,new ln(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let l=-1,d=-1;return c.type!==0&&(l=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),d=o.indexOf(c.doc.key)),{type:$A(c.type),doc:u,oldIndex:l,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function $A(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return j()}}function KA(n,e){return n instanceof ar&&e instanceof ar?n._firestore===e._firestore&&n._key.isEqual(e._key)&&(n._document===null?e._document===null:n._document.isEqual(e._document))&&n._converter===e._converter:n instanceof cr&&e instanceof cr&&n._firestore===e._firestore&&al(n.query,e.query)&&n.metadata.isEqual(e.metadata)&&n._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bg(n){n=J(n,we);const e=J(n.firestore,se);return yg(ye(e),n._key).then(t=>yl(e,n,t))}class xn extends gl{constructor(e){super(),this.firestore=e}convertBytes(e){return new Sn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new we(this.firestore,null,t)}}function HA(n){n=J(n,we);const e=J(n.firestore,se),t=ye(e),r=new xn(e);return Zw(t,n._key).then(i=>new ar(e,r,n._key,i,new ln(i!==null&&i.hasLocalMutations,!0),n.converter))}function WA(n){n=J(n,we);const e=J(n.firestore,se);return yg(ye(e),n._key,{source:"server"}).then(t=>yl(e,n,t))}function QA(n){n=J(n,xe);const e=J(n.firestore,se),t=ye(e),r=new xn(e);return xg(n._query),Ig(t,n._query).then(i=>new cr(e,r,n,i))}function JA(n){n=J(n,xe);const e=J(n.firestore,se),t=ye(e),r=new xn(e);return eA(t,n._query).then(i=>new cr(e,r,n,i))}function YA(n){n=J(n,xe);const e=J(n.firestore,se),t=ye(e),r=new xn(e);return Ig(t,n._query,{source:"server"}).then(i=>new cr(e,r,n,i))}function Xr(n,e,t){n=J(n,we);const r=J(n.firestore,se),i=xa(n.converter,e,t);return fi(r,[ka(hr(r),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,pe.none())])}function _l(n,e,t,...r){n=J(n,we);const i=J(n.firestore,se),s=hr(i);let o;return o=typeof(e=q(e))=="string"||e instanceof Vn?fl(s,"updateDoc",n._key,e,t,r):dl(s,"updateDoc",n._key,e),fi(i,[o.toMutation(n._key,pe.exists(!0))])}function XA(n){return fi(J(n.firestore,se),[new si(n._key,pe.none())])}function ZA(n,e){const t=J(n.firestore,se),r=Pa(n),i=xa(n.converter,e);return fi(t,[ka(hr(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,pe.exists(!1))]).then(()=>r)}function eR(n,...e){var t,r,i;n=q(n);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||lu(e[o])||(s=e[o],o++);const c={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(lu(e[o])){const m=e[o];e[o]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[o+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[o+2]=(i=m.complete)===null||i===void 0?void 0:i.bind(m)}let u,l,d;if(n instanceof we)l=J(n.firestore,se),d=ri(n._key.path),u={next:m=>{e[o]&&e[o](yl(l,n,m))},error:e[o+1],complete:e[o+2]};else{const m=J(n,xe);l=J(m.firestore,se),d=m._query;const g=new xn(l);u={next:T=>{e[o]&&e[o](new cr(l,g,m,T))},error:e[o+1],complete:e[o+2]},xg(n._query)}return function(g,T,w,D){const P=new Ra(D),x=new Yu(T,P,w);return g.asyncQueue.enqueueAndForget(async()=>Wu(await Jr(g),x)),()=>{P.Za(),g.asyncQueue.enqueueAndForget(async()=>Qu(await Jr(g),x))}}(ye(l),d,c,u)}function tR(n,e){return nA(ye(n=J(n,se)),lu(e)?e:{next:e})}function fi(n,e){return function(r,i){const s=new Ve;return r.asyncQueue.enqueueAndForget(async()=>Dw(await sl(r),i,s)),s.promise}(ye(n),e)}function yl(n,e,t){const r=t.docs.get(e._key),i=new xn(n);return new ar(n,i,e._key,r,new ln(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nR(n){return qg(n,{count:Ug()})}function qg(n,e){const t=J(n.firestore,se),r=ye(t),i=Fm(e,(s,o)=>new mp(o,s.aggregateType,s._internalFieldPath));return tA(r,n._query,i).then(s=>function(c,u,l){const d=new xn(c);return new Sg(u,d,l)}(t,n,s))}class rR{constructor(e){this.kind="memory",this._onlineComponentProvider=bn.provider,e!=null&&e.garbageCollector?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider=Rn.provider}toJSON(){return{kind:this.kind}}}class iR{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=jg(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class sR{constructor(){this.kind="memoryEager",this._offlineComponentProvider=Rn.provider}toJSON(){return{kind:this.kind}}}class oR{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new Kw(e)}}toJSON(){return{kind:this.kind}}}function aR(){return new sR}function cR(n){return new oR(n==null?void 0:n.cacheSizeBytes)}function uR(n){return new rR(n)}function lR(n){return new iR(n)}class hR{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=bn.provider,this._offlineComponentProvider={build:t=>new rl(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class dR{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=bn.provider,this._offlineComponentProvider={build:t=>new mg(t,e==null?void 0:e.cacheSizeBytes)}}}function jg(n){return new hR(n==null?void 0:n.forceOwnership)}function fR(){return new dR}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mR={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zg{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=hr(e)}set(e,t,r){this._verifyNotCommitted();const i=cn(e,this._firestore),s=xa(i.converter,t,r),o=ka(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(o.toMutation(i._key,pe.none())),this}update(e,t,r,...i){this._verifyNotCommitted();const s=cn(e,this._firestore);let o;return o=typeof(t=q(t))=="string"||t instanceof Vn?fl(this._dataReader,"WriteBatch.update",s._key,t,r,i):dl(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,pe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=cn(e,this._firestore);return this._mutations=this._mutations.concat(new si(t._key,pe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(C.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function cn(n,e){if((n=q(n)).firestore!==e)throw new N(C.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg extends class{constructor(t,r){this._firestore=t,this._transaction=r,this._dataReader=hr(t)}get(t){const r=cn(t,this._firestore),i=new BA(this._firestore);return this._transaction.lookup([r._key]).then(s=>{if(!s||s.length!==1)return j();const o=s[0];if(o.isFoundDocument())return new Es(this._firestore,i,o.key,o,r.converter);if(o.isNoDocument())return new Es(this._firestore,i,r._key,null,r.converter);throw j()})}set(t,r,i){const s=cn(t,this._firestore),o=xa(s.converter,r,i),c=ka(this._dataReader,"Transaction.set",s._key,o,s.converter!==null,i);return this._transaction.set(s._key,c),this}update(t,r,i,...s){const o=cn(t,this._firestore);let c;return c=typeof(r=q(r))=="string"||r instanceof Vn?fl(this._dataReader,"Transaction.update",o._key,r,i,s):dl(this._dataReader,"Transaction.update",o._key,r),this._transaction.update(o._key,c),this}delete(t){const r=cn(t,this._firestore);return this._transaction.delete(r._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=cn(e,this._firestore),r=new xn(this._firestore);return super.get(e).then(i=>new ar(this._firestore,r,t._key,i._document,new ln(!1,!1),t.converter))}}function pR(n,e,t){n=J(n,se);const r=Object.assign(Object.assign({},mR),t);return function(s){if(s.maxAttempts<1)throw new N(C.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(s,o,c){const u=new Ve;return s.asyncQueue.enqueueAndForget(async()=>{const l=await _g(s);new Qw(s.asyncQueue,l,c,o,u).au()}),u.promise}(ye(n),i=>e(new Gg(n,i)),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gR(){return new Us("deleteField")}function Zr(){return new cl("serverTimestamp")}function _R(...n){return new ul("arrayUnion",n)}function yR(...n){return new ll("arrayRemove",n)}function IR(n){return new hl("increment",n)}function TR(n){return new Fs(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ER(n){return ye(n=J(n,se)),new zg(n,e=>fi(n,e))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vR(n,e){const t=ye(n=J(n,se));if(!t._uninitializedComponentsProvider||t._uninitializedComponentsProvider._offline.kind==="memory")return it("Cannot enable indexes when persistence is disabled"),Promise.resolve();const r=function(s){const o=typeof s=="string"?function(l){try{return JSON.parse(l)}catch(d){throw new N(C.INVALID_ARGUMENT,"Failed to parse JSON: "+(d==null?void 0:d.message))}}(s):s,c=[];if(Array.isArray(o.indexes))for(const u of o.indexes){const l=_f(u,"collectionGroup"),d=[];if(Array.isArray(u.fields))for(const m of u.fields){const g=Na("setIndexConfiguration",_f(m,"fieldPath"));m.arrayConfig==="CONTAINS"?d.push(new Jn(g,2)):m.order==="ASCENDING"?d.push(new Jn(g,0)):m.order==="DESCENDING"&&d.push(new Jn(g,1))}c.push(new Fr(Fr.UNKNOWN_ID,l,d,Ur.empty()))}return c}(e);return sA(t,r)}function _f(n,e){if(typeof n[e]!="string")throw new N(C.INVALID_ARGUMENT,"Missing string value for: "+e);return n[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $g{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function wR(n){var e;n=J(n,se);const t=yf.get(n);if(t)return t;if(((e=ye(n)._uninitializedComponentsProvider)===null||e===void 0?void 0:e._offline.kind)!=="persistent")return null;const r=new $g(n);return yf.set(n,r),r}function AR(n){Kg(n,!0)}function RR(n){Kg(n,!1)}function bR(n){aA(ye(n._firestore)).then(e=>V("deleting all persistent cache indexes succeeded")).catch(e=>it("deleting all persistent cache indexes failed",e))}function Kg(n,e){oA(ye(n._firestore),e).then(t=>V(`setting persistent cache index auto creation isEnabled=${e} succeeded`)).catch(t=>it(`setting persistent cache index auto creation isEnabled=${e} failed`,t))}const yf=new WeakMap;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SR(n){var e;const t=(e=ye(J(n.firestore,se))._onlineComponents)===null||e===void 0?void 0:e.datastore.serializer;return t===void 0?null:Ia(t,He(n._query))._t}function PR(n,e){var t;const r=Fm(e,(s,o)=>new mp(o,s.aggregateType,s._internalFieldPath)),i=(t=ye(J(n.firestore,se))._onlineComponents)===null||t===void 0?void 0:t.datastore.serializer;return i===void 0?null:Sp(i,Xm(n._query),r,!0).request}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CR{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return Il.instance.onExistenceFilterMismatch(e)}}class Il{constructor(){this.Uu=new Map}static get instance(){return Eo||(Eo=new Il,function(t){if(Ko)throw new Error("a TestingHooksSpi instance is already set");Ko=t}(Eo)),Eo}et(e){this.Uu.forEach(t=>t(e))}onExistenceFilterMismatch(e){const t=Symbol(),r=this.Uu;return r.set(t,e),()=>r.delete(t)}}let Eo=null;(function(e,t=!0){(function(i){ni=i})(Pn),yn(new gn("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),c=new se(new tE(r.getProvider("auth-internal")),new iE(r.getProvider("app-check-internal")),function(l,d){if(!Object.prototype.hasOwnProperty.apply(l.options,["projectId"]))throw new N(C.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Tn(l.options.projectId,d)}(o,i),o);return s=Object.assign({useFetchStreams:t},s),c._setSettings(s),c},"PUBLIC").setMultipleInstances(!0)),lt(od,"4.7.3",e),lt(od,"4.7.3","esm2017")})();const _e=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:gl,AggregateField:Yr,AggregateQuerySnapshot:Sg,Bytes:Sn,CACHE_SIZE_UNLIMITED:hA,CollectionReference:mt,DocumentReference:we,DocumentSnapshot:ar,FieldPath:Vn,FieldValue:On,Firestore:se,FirestoreError:N,GeoPoint:Ca,LoadBundleTask:Ag,PersistentCacheIndexManager:$g,Query:xe,QueryCompositeFilterConstraint:fr,QueryConstraint:hi,QueryDocumentSnapshot:ss,QueryEndAtConstraint:js,QueryFieldFilterConstraint:di,QueryLimitConstraint:Bs,QueryOrderByConstraint:Oa,QuerySnapshot:cr,QueryStartAtConstraint:qs,SnapshotMetadata:ln,Timestamp:ge,Transaction:Gg,VectorValue:Fs,WriteBatch:zg,_AutoId:Tu,_ByteString:Te,_DatabaseId:Tn,_DocumentKey:B,_EmptyAppCheckTokenProvider:sE,_EmptyAuthCredentialsProvider:Rm,_FieldPath:he,_TestingHooks:CR,_cast:J,_debugAssert:ZT,_internalAggregationQueryToProtoRunAggregationQueryRequest:PR,_internalQueryToProtoQueryTarget:SR,_isBase64Available:VE,_logWarn:it,_validateIsNotUsedTogether:Eg,addDoc:ZA,aggregateFieldEqual:zA,aggregateQuerySnapshotEqual:GA,and:NA,arrayRemove:yR,arrayUnion:_R,average:jA,clearIndexedDbPersistence:gA,collection:cA,collectionGroup:uA,connectFirestoreEmulator:wg,count:Ug,deleteAllPersistentCacheIndexes:bR,deleteDoc:XA,deleteField:gR,disableNetwork:IA,disablePersistentCacheIndexAutoCreation:RR,doc:Pa,documentId:wA,enableIndexedDbPersistence:mA,enableMultiTabIndexedDbPersistence:pA,enableNetwork:yA,enablePersistentCacheIndexAutoCreation:AR,endAt:UA,endBefore:FA,ensureFirestoreConfigured:ye,executeWrite:fi,getAggregateFromServer:qg,getCountFromServer:nR,getDoc:Bg,getDocFromCache:HA,getDocFromServer:WA,getDocs:QA,getDocsFromCache:JA,getDocsFromServer:YA,getFirestore:fA,getPersistentCacheIndexManager:wR,increment:IR,initializeFirestore:dA,limit:OA,limitToLast:xA,loadBundle:EA,memoryEagerGarbageCollector:aR,memoryLocalCache:uR,memoryLruGarbageCollector:cR,namedQuery:vA,onSnapshot:eR,onSnapshotsInSync:tR,or:kA,orderBy:VA,persistentLocalCache:lR,persistentMultipleTabManager:fR,persistentSingleTabManager:jg,query:CA,queryEqual:al,refEqual:lA,runTransaction:pR,serverTimestamp:Zr,setDoc:Xr,setIndexConfiguration:vR,setLogLevel:XT,snapshotEqual:KA,startAfter:MA,startAt:LA,sum:qA,terminate:TA,updateDoc:_l,vector:TR,waitForPendingWrites:_A,where:DA,writeBatch:ER},Symbol.toStringTag,{value:"Module"}));let wr=null,os=null,Ji=null,Oo=null,ji=null,Yi=null;const If={apiKey:"AIzaSyCK_DyOK-Ho-g-K1JL0h1oUiPkZzZcnoTM",authDomain:"px-1687-manager-app.firebaseapp.com",projectId:"px-1687-manager-app",storageBucket:"px-1687-manager-app.firebasestorage.app",messagingSenderId:"309142080118",appId:"1:309142080118:web:3e7d618f6853c38e52ad57",measurementId:"G-QD7ZEQ8BQ8"};async function mi(){return Ji?{app:wr,auth:os,db:Ji,storage:Oo}:ji||(ji=(async()=>{try{const{initializeApp:n,getApps:e,getApp:t}=await te(async()=>{const{initializeApp:o,getApps:c,getApp:u}=await Promise.resolve().then(()=>eb);return{initializeApp:o,getApps:c,getApp:u}},void 0),{getAuth:r}=await te(async()=>{const{getAuth:o}=await Promise.resolve().then(()=>ry);return{getAuth:o}},void 0),{getFirestore:i}=await te(async()=>{const{getFirestore:o}=await Promise.resolve().then(()=>_e);return{getFirestore:o}},void 0),{getStorage:s}=await te(async()=>{const{getStorage:o}=await Promise.resolve().then(()=>Dy);return{getStorage:o}},void 0);return wr=e().length?t():n(If),os=r(wr),Ji=i(wr),Oo=s(wr),console.log("[Firebase] ✅ Initialized — project:",If.projectId),{app:wr,auth:os,db:Ji,storage:Oo}}catch(n){throw console.error("[Firebase] ❌ Init failed:",n.message),ji=null,n}})(),ji)}async function DR(){return await mi(),Yi||(Yi=new Promise(n=>{(async()=>{try{const{onAuthStateChanged:e}=await te(async()=>{const{onAuthStateChanged:i}=await Promise.resolve().then(()=>ry);return{onAuthStateChanged:i}},void 0),t=setTimeout(()=>{console.warn("[Firebase] waitForAuthReady: timed out after 8s — proceeding"),n(null)},8e3),r=e(os,i=>{clearTimeout(t),r(),i?console.log("[Firebase] ✅ Auth ready — signed in as:",i.email,"| uid:",i.uid):console.log("[Firebase] Auth ready — no user signed in (PWA may need re-login)"),n(i)})}catch(e){console.warn("[Firebase] waitForAuthReady error:",e.message),n(null)}})()}),Yi)}function kR(){Yi=null}const NR=()=>Ji,VR=()=>os,OR=()=>Oo,La=Object.freeze(Object.defineProperty({__proto__:null,getAuth_:VR,getDb:NR,getFirebaseModules:mi,getStorage_:OR,resetAuthReadyPromise:kR,waitForAuthReady:DR},Symbol.toStringTag,{value:"Module"})),Ma=(n,e)=>Pa(n,"stores",Zn,"members",e),Tl=(n,e)=>Pa(n,"stores",Zn,"presence",e);function Tf(n,e={}){const t=(n==null?void 0:n.email)||e.email||"",r=mn(e.role,t);return Or({uid:(n==null?void 0:n.uid)||e.uid,email:t,name:(n==null?void 0:n.displayName)||e.name||t.split("@")[0]||"Unknown User",role:r,storeId:Zn,status:e.status||"active",disabled:e.disabled===!0})}async function xR(n,e={}){if(!(n!=null&&n.uid)||n.uid==="demo_user")return Tf(n,e);const{db:t}=await mi(),r=Ma(t,n.uid),i=await Bg(r),s=Tf(n,e);let o;if(i.exists()?o=Or({...s,...i.data(),uid:n.uid,email:n.email||i.data().email||s.email,name:i.data().name||n.displayName||s.name,lastLoginAt:new Date().toISOString()}):o=Or({...s,role:mn(s.role||_t.MANAGER,s.email),createdAt:new Date().toISOString(),lastLoginAt:new Date().toISOString()}),o.disabled===!0||o.status==="disabled"){const u=new Error("account-disabled");throw u.code="account-disabled",u}const c={uid:o.uid,email:o.email,name:o.name,role:mn(o.role,o.email),roleLabel:o.roleLabel,storeId:Zn,status:o.status||"active",disabled:o.disabled===!0,lastLoginAt:o.lastLoginAt,updatedAt:new Date().toISOString(),updatedAtServer:Zr()};return await Xr(r,{...c,createdAt:o.createdAt||new Date().toISOString()},{merge:!0}),await Xr(Tl(t,o.uid),{uid:o.uid,email:o.email,name:o.name,role:c.role,roleLabel:o.roleLabel,storeId:Zn,status:c.status,disabled:c.disabled,lastSeen:new Date().toISOString(),online:!0,updatedAtServer:Zr()},{merge:!0}),o}async function TD(n,e,t=null){const{db:r}=await mi(),i=mn(e),s={role:i,roleLabel:Or({role:i}).roleLabel,updatedAt:new Date().toISOString(),updatedAtServer:Zr(),updatedBy:t?{uid:t.uid,email:t.email,name:t.name}:null};await _l(Ma(r,n),s),await Xr(Tl(r,n),s,{merge:!0})}async function ED(n,e,t=null){const{db:r}=await mi(),i={disabled:e===!0,status:e?"disabled":"active",updatedAt:new Date().toISOString(),updatedAtServer:Zr(),updatedBy:t?{uid:t.uid,email:t.email,name:t.name}:null};await _l(Ma(r,n),i),await Xr(Tl(r,n),i,{merge:!0})}async function vD(n,e={}){var i;const{db:t}=await mi(),r=Or({uid:n,...e});return r!=null&&r.uid?(await Xr(Ma(t,n),{uid:r.uid,email:r.email||"",name:r.name||((i=r.email)==null?void 0:i.split("@")[0])||"Unknown User",role:mn(r.role,r.email),roleLabel:r.roleLabel,storeId:Zn,status:e.status||(e.disabled?"disabled":"active"),disabled:e.disabled===!0,migratedFromPresence:!0,updatedAt:new Date().toISOString(),updatedAtServer:Zr()},{merge:!0}),r):null}const ot="store_1687";function Fa(n){return!n||typeof n!="object"||!Array.isArray(n.attachments)||n.attachments.length===0?n:{...n,attachments:n.attachments.map(({dataUrl:e,...t})=>t)}}async function Hg(n,e,t="team",r){if(!n.dataUrl)return n;try{const{ref:i,uploadBytesResumable:s,getDownloadURL:o}=await te(async()=>{const{ref:D,uploadBytesResumable:P,getDownloadURL:x}=await Promise.resolve().then(()=>Dy);return{ref:D,uploadBytesResumable:P,getDownloadURL:x}},void 0),{getFirebaseModules:c}=await te(async()=>{const{getFirebaseModules:D}=await Promise.resolve().then(()=>La);return{getFirebaseModules:D}},void 0),{storage:u}=await c();if(!u)return console.warn("[Storage] storage instance not available"),{...n,_uploadError:!0,_uploadErrorMsg:"Storage not initialised"};const d=await(await fetch(n.dataUrl)).blob(),m=`noteAttachments/${t}/${e}/${n.id}`,g=i(u,m),T=s(g,d,{contentType:n.type}),w=await new Promise((D,P)=>{T.on("state_changed",x=>{const M=Math.round(x.bytesTransferred/x.totalBytes*100);r==null||r(M)},x=>{console.error("[Storage] upload error:",x==null?void 0:x.code,x==null?void 0:x.message),P(x)},async()=>{try{D(await o(T.snapshot.ref))}catch(x){P(x)}})});return{...n,storageUrl:w}}catch(i){const s=(i==null?void 0:i.code)||(i==null?void 0:i.message)||"unknown";return console.error("[Storage] uploadNoteAttachment failed:",s),{...n,_uploadError:!0,_uploadErrorMsg:s}}}async function LR(n,e="team",t){if(!Array.isArray(n.attachments)||n.attachments.length===0)return n;const r=await Promise.all(n.attachments.map(i=>i.storageUrl?i:Hg(i,n.id,e,s=>t==null?void 0:t(i.name,s,!1,!1,"")).then(s=>{const o=!!s._uploadError;return t==null||t(i.name,100,!o,o,s._uploadErrorMsg||""),s})));return{...n,attachments:r}}let Xi=null,dn=null,xo=!1,sn=[],Lo=null;async function at(){if(Xi)return Xi;const{getFirebaseModules:n}=await te(async()=>{const{getFirebaseModules:t}=await Promise.resolve().then(()=>La);return{getFirebaseModules:t}},void 0),{db:e}=await n();return Xi=e,Xi}function MR(){return dn}async function Wg(n){const{collection:e}=await te(async()=>{const{collection:r}=await Promise.resolve().then(()=>_e);return{collection:r}},void 0),t=await at();return e(t,"stores",ot,n)}async function na(n,e){const{doc:t}=await te(async()=>{const{doc:i}=await Promise.resolve().then(()=>_e);return{doc:i}},void 0),r=await at();return t(r,"stores",ot,n,e)}async function FR(n,e){const{collection:t}=await te(async()=>{const{collection:i}=await Promise.resolve().then(()=>_e);return{collection:i}},void 0),r=await at();return t(r,"users",n,e)}async function ra(n,e,t){const{doc:r}=await te(async()=>{const{doc:s}=await Promise.resolve().then(()=>_e);return{doc:s}},void 0),i=await at();return r(i,"users",n,e,t)}async function UR(n,e,t){try{const{setDoc:r,serverTimestamp:i}=await te(async()=>{const{setDoc:c,serverTimestamp:u}=await Promise.resolve().then(()=>_e);return{setDoc:c,serverTimestamp:u}},void 0),s=await na(n,e),o=Fa(t);await r(s,{...o,_updatedAt:i()},{merge:!0})}catch(r){console.warn(`[FS] set(${n}/${e}):`,(r==null?void 0:r.code)||(r==null?void 0:r.message))}}async function BR(n,e,t){const r=Fa(t);try{const{updateDoc:i,serverTimestamp:s}=await te(async()=>{const{updateDoc:c,serverTimestamp:u}=await Promise.resolve().then(()=>_e);return{updateDoc:c,serverTimestamp:u}},void 0),o=await na(n,e);await i(o,{...r,_updatedAt:s()})}catch{try{const{setDoc:i,serverTimestamp:s}=await te(async()=>{const{setDoc:c,serverTimestamp:u}=await Promise.resolve().then(()=>_e);return{setDoc:c,serverTimestamp:u}},void 0),o=await na(n,e);await i(o,{...r,_updatedAt:s()},{merge:!0})}catch(i){console.warn(`[FS] update(${n}/${e}):`,(i==null?void 0:i.code)||(i==null?void 0:i.message))}}}async function qR(n,e){try{const{deleteDoc:t}=await te(async()=>{const{deleteDoc:i}=await Promise.resolve().then(()=>_e);return{deleteDoc:i}},void 0),r=await na(n,e);await t(r)}catch(t){console.warn(`[FS] delete(${n}/${e}):`,(t==null?void 0:t.code)||(t==null?void 0:t.message))}}async function jR(n,e,t,r){const i=r||dn;if(!i){console.warn(`[FS] setPrivate(${n}/${e}): no uid — skipping`);return}try{const{setDoc:s,serverTimestamp:o}=await te(async()=>{const{setDoc:l,serverTimestamp:d}=await Promise.resolve().then(()=>_e);return{setDoc:l,serverTimestamp:d}},void 0),c=await ra(i,n,e),u=Fa(t);await s(c,{...u,_updatedAt:o()},{merge:!0})}catch(s){console.warn(`[FS] setPrivate(${n}/${e}):`,(s==null?void 0:s.code)||(s==null?void 0:s.message))}}async function zR(n,e,t,r){const i=r||dn;if(!i)return;const s=Fa(t);try{const{updateDoc:o,serverTimestamp:c}=await te(async()=>{const{updateDoc:l,serverTimestamp:d}=await Promise.resolve().then(()=>_e);return{updateDoc:l,serverTimestamp:d}},void 0),u=await ra(i,n,e);await o(u,{...s,_updatedAt:c()})}catch{try{const{setDoc:o,serverTimestamp:c}=await te(async()=>{const{setDoc:l,serverTimestamp:d}=await Promise.resolve().then(()=>_e);return{setDoc:l,serverTimestamp:d}},void 0),u=await ra(i,n,e);await o(u,{...s,_updatedAt:c()},{merge:!0})}catch(o){console.warn(`[FS] updatePrivate(${n}/${e}):`,(o==null?void 0:o.code)||(o==null?void 0:o.message))}}}async function GR(n,e,t){const r=t||dn;if(r)try{const{deleteDoc:i}=await te(async()=>{const{deleteDoc:o}=await Promise.resolve().then(()=>_e);return{deleteDoc:o}},void 0),s=await ra(r,n,e);await i(s)}catch(i){console.warn(`[FS] deletePrivate(${n}/${e}):`,(i==null?void 0:i.code)||(i==null?void 0:i.message))}}async function $R(n,e,t){try{const{setDoc:r,serverTimestamp:i,doc:s}=await te(async()=>{const{setDoc:u,serverTimestamp:l,doc:d}=await Promise.resolve().then(()=>_e);return{setDoc:u,serverTimestamp:l,doc:d}},void 0),o=await at(),c=s(o,"stores",ot,"checklists",`${n}_${e}`);await r(c,{date:n,shift:e,items:t,_updatedAt:i()})}catch(r){console.warn(`[FS] saveChecklist(${n}/${e}):`,(r==null?void 0:r.code)||(r==null?void 0:r.message))}}async function KR(n){try{const{setDoc:e,serverTimestamp:t,doc:r}=await te(async()=>{const{setDoc:o,serverTimestamp:c,doc:u}=await Promise.resolve().then(()=>_e);return{setDoc:o,serverTimestamp:c,doc:u}},void 0),i=await at(),s=r(i,"stores",ot,"customChecklists",n.id);await e(s,{...n,_updatedAt:t()})}catch(e){console.warn(`[FS] saveCustomChecklist(${n.id}):`,(e==null?void 0:e.code)||(e==null?void 0:e.message))}}async function HR(n){try{const{deleteDoc:e,doc:t}=await te(async()=>{const{deleteDoc:i,doc:s}=await Promise.resolve().then(()=>_e);return{deleteDoc:i,doc:s}},void 0),r=await at();await e(t(r,"stores",ot,"customChecklists",n))}catch(e){console.warn(`[FS] deleteCustomChecklist(${n}):`,(e==null?void 0:e.code)||(e==null?void 0:e.message))}}async function WR(n,e){try{const{setDoc:t,serverTimestamp:r,doc:i}=await te(async()=>{const{setDoc:c,serverTimestamp:u,doc:l}=await Promise.resolve().then(()=>_e);return{setDoc:c,serverTimestamp:u,doc:l}},void 0),s=await at(),o=i(s,"stores",ot,"workFiles",n);await t(o,{associateId:n,...e,_updatedAt:r()})}catch(t){console.warn(`[FS] saveWorkFile(${n}):`,(t==null?void 0:t.code)||(t==null?void 0:t.message))}}async function hu(n,e,t=!0){var r;if(n)try{const{setDoc:i,serverTimestamp:s,doc:o}=await te(async()=>{const{setDoc:l,serverTimestamp:d,doc:m}=await Promise.resolve().then(()=>_e);return{setDoc:l,serverTimestamp:d,doc:m}},void 0),c=await at(),u=o(c,"stores",ot,"presence",n);await i(u,{uid:n,name:(e.name||e.displayName||((r=e.email)==null?void 0:r.split("@")[0])||"Unknown").trim().split(/\s+/)[0],email:e.email||"",role:e.role||"manager",storeId:ot,isOnline:t,lastSeen:s()},{merge:!0})}catch(i){console.warn("[FS] writePresence failed:",(i==null?void 0:i.code)||(i==null?void 0:i.message))}}async function El(n){if(n)try{const{updateDoc:e,serverTimestamp:t,doc:r}=await te(async()=>{const{updateDoc:o,serverTimestamp:c,doc:u}=await Promise.resolve().then(()=>_e);return{updateDoc:o,serverTimestamp:c,doc:u}},void 0),i=await at(),s=r(i,"stores",ot,"presence",n);await e(s,{isOnline:!1,lastSeen:t()})}catch{}}function Qg(n,e){vl(),n&&(hu(n,e,!0),Lo=setInterval(()=>{hu(n,e,!0)},6e4))}function vl(){Lo&&(clearInterval(Lo),Lo=null)}async function Jg(n,e){const{setDoc:t,getDoc:r,serverTimestamp:i,doc:s}=await te(async()=>{const{setDoc:d,getDoc:m,serverTimestamp:g,doc:T}=await Promise.resolve().then(()=>_e);return{setDoc:d,getDoc:m,serverTimestamp:g,doc:T}},void 0),o=await at();let c=0;async function u(d,m){try{(await r(d)).exists()||(await t(d,{...m,_updatedAt:i()}),c++)}catch{}}const l=["associates","callIns","teamEvents","teamNotes","reviews","tasks","uniforms","uniformInventory","managerUniformStock","associateUniformItems","contacts","announcements"];for(const d of l){const m=n[d];if(Array.isArray(m))for(const g of m){if(!(g!=null&&g.id))continue;const T=s(o,"stores",ot,d,g.id);await u(T,g)}}if(n.workFiles&&typeof n.workFiles=="object")for(const[d,m]of Object.entries(n.workFiles)){if(!d||!m)continue;const g=s(o,"stores",ot,"workFiles",d);await u(g,{associateId:d,...m})}if(e)for(const d of["myNotes","myEvents"]){const m=n[d];if(Array.isArray(m))for(const g of m){if(!(g!=null&&g.id))continue;const T=s(o,"users",e,d,g.id);await u(T,g)}}return c}async function QR(n,e){const{setDoc:t,serverTimestamp:r,doc:i}=await te(async()=>{const{setDoc:l,serverTimestamp:d,doc:m}=await Promise.resolve().then(()=>_e);return{setDoc:l,serverTimestamp:d,doc:m}},void 0),s=await at();let o=0;async function c(l,d){try{await t(l,{...d,_updatedAt:r()},{merge:!0}),o++}catch(m){console.warn("[FS] forceWrite failed:",(m==null?void 0:m.code)||(m==null?void 0:m.message))}}const u=["associates","callIns","teamEvents","teamNotes","reviews","tasks","uniforms","uniformInventory","managerUniformStock","associateUniformItems","contacts","announcements"];for(const l of u){const d=n[l];if(Array.isArray(d))for(const m of d){if(!(m!=null&&m.id))continue;const g=i(s,"stores",ot,l,m.id);await c(g,m)}}if(n.workFiles&&typeof n.workFiles=="object")for(const[l,d]of Object.entries(n.workFiles)){if(!l||!d)continue;const m=i(s,"stores",ot,"workFiles",l);await c(m,{associateId:l,...d})}if(e)for(const l of["myNotes","myEvents"]){const d=n[l];if(Array.isArray(d))for(const m of d){if(!(m!=null&&m.id))continue;const g=i(s,"users",e,l,m.id);await c(g,m)}}return o}function Ef(n,e){let t=()=>{};return(async()=>{try{const{onSnapshot:r}=await te(async()=>{const{onSnapshot:s}=await Promise.resolve().then(()=>_e);return{onSnapshot:s}},void 0),i=await Wg(n);t=r(i,s=>e(s.docs.map(o=>({id:o.id,...o.data()}))),s=>console.warn(`[FS] snapshot(${n}):`,(s==null?void 0:s.code)||(s==null?void 0:s.message)))}catch(r){console.warn(`[FS] subscribe(${n}):`,r==null?void 0:r.message)}})(),()=>t()}function vf(n,e,t){let r=()=>{};return(async()=>{try{const{onSnapshot:i}=await te(async()=>{const{onSnapshot:o}=await Promise.resolve().then(()=>_e);return{onSnapshot:o}},void 0),s=await FR(n,e);r=i(s,o=>t(o.docs.map(c=>({id:c.id,...c.data()}))),o=>console.warn(`[FS] snapshot(users/${n}/${e}):`,(o==null?void 0:o.code)||(o==null?void 0:o.message)))}catch(i){console.warn(`[FS] subscribe(users/${n}/${e}):`,i==null?void 0:i.message)}})(),()=>r()}function JR(n){let e=()=>{};return(async()=>{try{const{onSnapshot:t}=await te(async()=>{const{onSnapshot:i}=await Promise.resolve().then(()=>_e);return{onSnapshot:i}},void 0),r=await Wg("workFiles");e=t(r,i=>{const s={};i.docs.forEach(o=>{s[o.id]=o.data()}),n(s)},i=>console.warn("[FS] snapshot(workFiles):",(i==null?void 0:i.code)||(i==null?void 0:i.message)))}catch(t){console.warn("[FS] subscribe(workFiles):",t==null?void 0:t.message)}})(),()=>e()}async function YR(n,e){var t,r,i,s;xo&&Yg(n);try{console.log("[FS] Connecting…");const{waitForAuthReady:o}=await te(async()=>{const{waitForAuthReady:w}=await Promise.resolve().then(()=>La);return{waitForAuthReady:w}},void 0),c=await o();console.log("[FS] Auth confirmed:",(c==null?void 0:c.uid)||"no firebase user"),await at();const u=(c==null?void 0:c.uid)||((t=e().user)==null?void 0:t.uid)||null;if(dn=u,console.log("[FS] uid =",u||"(none — shared data only)"),c!=null&&c.uid&&((r=e().user)!=null&&r.uid)&&c.uid!==((i=e().user)==null?void 0:i.uid)&&console.warn("[FS] uid mismatch — Firebase:",c.uid,"| Zustand:",(s=e().user)==null?void 0:s.uid,"— using Firebase uid"),c!=null&&c.uid)try{const w=await xR(c,e().user||{});n(D=>({user:Or(w,D.user)})),console.log("[FS] Role profile loaded:",w.role)}catch(w){if(console.warn("[FS] Role profile load failed:",(w==null?void 0:w.code)||(w==null?void 0:w.message)),(w==null?void 0:w.code)==="account-disabled"||(w==null?void 0:w.message)==="account-disabled")throw n({needsRelogin:!0,dbReady:!1,dbMode:"local"}),w}const l=u?`panda-fs-migrated-v4-${u}`:"panda-fs-migrated-v4-anon",d=!!localStorage.getItem(l),m={associates:"associates",callIns:"callIns",teamEvents:"teamEvents",teamNotes:"teamNotes",reviews:"reviews",tasks:"tasks",uniforms:"uniforms",uniformInventory:"uniformInventory",managerUniformStock:"managerUniformStock",associateUniformItems:"associateUniformItems",contacts:"contacts",announcements:"announcements"};let g=0;const T=Object.keys(m).length;for(const[w,D]of Object.entries(m)){const P=Ef(D,x=>{if(x.length>0||d)if(w==="teamNotes"){const M=e().teamNotes||[],O={};M.forEach(W=>{Array.isArray(W.attachments)&&W.attachments.forEach($=>{$.id&&$.dataUrl&&(O[$.id]=$.dataUrl)})});const G=x.map(W=>({...W,attachments:Array.isArray(W.attachments)?W.attachments.map($=>({...$,dataUrl:$.dataUrl||O[$.id]||void 0})):[]}));n({teamNotes:G})}else n({[w]:x});g++,g===1&&(n({dbReady:!0,dbMode:"firestore"}),console.log("[FS] ✅ Connected — live sync active.")),g===T&&console.log("[FS] All shared collections loaded.")});sn.push(P)}if(sn.push(JR(w=>n({workFiles:w}))),sn.push(Ef("customChecklists",w=>{(w.length>0||d)&&n({customChecklists:w})})),u?(sn.push(vf(u,"myNotes",w=>{const D=e().myNotes||[],P={};D.forEach(M=>{Array.isArray(M.attachments)&&M.attachments.forEach(O=>{O.id&&O.dataUrl&&(P[O.id]=O.dataUrl)})});const x=w.map(M=>({...M,attachments:Array.isArray(M.attachments)?M.attachments.map(O=>({...O,dataUrl:O.dataUrl||P[O.id]||void 0})):[]}));n({myNotes:x}),console.log(`[FS] 🔒 myNotes loaded from cloud: ${w.length} note(s)`)})),sn.push(vf(u,"myEvents",w=>{n({myEvents:w}),console.log(`[FS] 🔒 myEvents loaded from cloud: ${w.length} event(s)`)})),console.log(`[FS] 🔒 Subscribed to private collections for uid: ${u}`)):console.log("[FS] No uid — private collections (myNotes/myEvents) not subscribed."),xo=!0,u){const w=e().user||{};Qg(u,w);const D=()=>El(u).catch(()=>{});window.addEventListener("beforeunload",D),window.addEventListener("pagehide",D),sn.push(()=>{window.removeEventListener("beforeunload",D),window.removeEventListener("pagehide",D)})}if(!d)try{const w=localStorage.getItem("panda-manager-storage");if(w){const D=JSON.parse(w),P=(D==null?void 0:D.state)??D;if(["associates","callIns","teamNotes","myNotes","myEvents","reviews","tasks","uniforms","uniformInventory","managerUniformStock","associateUniformItems","contacts","announcements"].some(M=>Array.isArray(P[M])&&P[M].length>0)){console.log("[FS] Migrating local data → Firestore (create-only, no overwrites)…");const M=await Jg(P,u);console.log(`[FS] ✅ Migrated ${M} new records.`)}}localStorage.setItem(l,"1")}catch(w){console.warn("[FS] Migration error (non-fatal):",w==null?void 0:w.message)}}catch(o){throw console.warn("[FS] Connection failed:",(o==null?void 0:o.code)||(o==null?void 0:o.message)),n({dbReady:!1,dbMode:"local"}),xo=!1,o}}function Yg(n){vl(),dn&&El(dn).catch(()=>{}),sn.forEach(e=>{try{e()}catch{}}),sn=[],xo=!1,Xi=null,dn=null,n&&n({dbReady:!1,dbMode:"local"}),te(async()=>{const{resetAuthReadyPromise:e}=await Promise.resolve().then(()=>La);return{resetAuthReadyPromise:e}},void 0).then(({resetAuthReadyPromise:e})=>e()).catch(()=>{}),console.log("[FS] Disconnected.")}const wD=Object.freeze(Object.defineProperty({__proto__:null,batchForceToFirestore:QR,batchImportToFirestore:Jg,disconnectFirestore:Yg,fsDeleteCustomChecklist:HR,fsDeleteItem:qR,fsDeletePrivateItem:GR,fsSaveChecklist:$R,fsSaveCustomChecklist:KR,fsSaveWorkFile:WR,fsSetItem:UR,fsSetPrivateItem:jR,fsUpdateItem:BR,fsUpdatePrivateItem:zR,getCurrentUid:MR,initFirestoreSync:YR,startPresenceHeartbeat:Qg,stopPresenceHeartbeat:vl,uploadNoteAttachment:Hg,uploadNoteAttachments:LR,writePresence:hu,writePresenceOffline:El},Symbol.toStringTag,{value:"Module"}));var XR="firebase",ZR="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */lt(XR,ZR,"app");const eb=Object.freeze(Object.defineProperty({__proto__:null,FirebaseError:pt,SDK_VERSION:Pn,_DEFAULT_ENTRY_NAME:ls,_addComponent:zc,_addOrOverwriteComponent:xT,_apps:_n,_clearComponents:LT,_components:Lr,_getProvider:lr,_isFirebaseApp:dm,_isFirebaseServerApp:ve,_registerComponent:yn,_removeServiceInstance:hm,_serverApps:xr,deleteApp:pm,getApp:da,getApps:BT,initializeApp:mm,initializeServerApp:UT,onLog:qT,registerVersion:lt,setLogLevel:jT},Symbol.toStringTag,{value:"Module"}));function wl(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(n);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(n,r[i])&&(t[r[i]]=n[r[i]]);return t}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tb={PHONE:"phone",TOTP:"totp"},nb={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},rb={EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},ib={LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},sb={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ob(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements."}}function Xg(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ab=ob,Zg=Xg,e_=new Ss("auth","Firebase",Xg()),cb={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ia=new _u("@firebase/auth");function ub(n,...e){ia.logLevel<=Y.WARN&&ia.warn(`Auth (${Pn}): ${n}`,...e)}function Mo(n,...e){ia.logLevel<=Y.ERROR&&ia.error(`Auth (${Pn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(n,...e){throw Rl(n,...e)}function Xe(n,...e){return Rl(n,...e)}function Al(n,e,t){const r=Object.assign(Object.assign({},Zg()),{[e]:t});return new Ss("auth","Firebase",r).create(e,{appName:n.name})}function Oe(n){return Al(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function pi(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&nt(n,"argument-error"),Al(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Rl(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return e_.create(n,...e)}function L(n,e,...t){if(!n)throw Rl(e,...t)}function Tt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Mo(e),new Error(e)}function jt(n,e){n||Tt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vs(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function bl(){return wf()==="http:"||wf()==="https:"}function wf(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lb(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(bl()||CI()||"connection"in navigator)?navigator.onLine:!0}function hb(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,t){this.shortDelay=e,this.longDelay=t,jt(t>e,"Short delay should be less than long delay!"),this.isMobile=RI()||DI()}get(){return lb()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sl(n,e){jt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t_{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Tt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Tt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Tt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const db={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fb=new zs(3e4,6e4);function de(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function fe(n,e,t,r,i={}){return n_(n,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const c=ti(Object.assign({key:n.config.apiKey},o)).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);const l=Object.assign({method:e,headers:u},s);return PI()||(l.referrerPolicy="no-referrer"),t_.fetch()(r_(n,n.config.apiHost,t,c),l)})}async function n_(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},db),e);try{const i=new pb(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Zi(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const c=s.ok?o.errorMessage:o.error.message,[u,l]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Zi(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Zi(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw Zi(n,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw Al(n,d,l);nt(n,d)}}catch(i){if(i instanceof pt)throw i;nt(n,"network-request-failed",{message:String(i)})}}async function Wt(n,e,t,r,i={}){const s=await fe(n,e,t,r,i);return"mfaPendingCredential"in s&&nt(n,"multi-factor-auth-required",{_serverResponse:s}),s}function r_(n,e,t,r){const i=`${e}${t}?${r}`;return n.config.emulator?Sl(n.config,i):`${n.config.apiScheme}://${i}`}function mb(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class pb{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Xe(this.auth,"network-request-failed")),fb.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Zi(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=Xe(n,e,r);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Af(n){return n!==void 0&&n.getResponse!==void 0}function Rf(n){return n!==void 0&&n.enterprise!==void 0}class i_{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return mb(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gb(n){return(await fe(n,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function s_(n,e){return fe(n,"GET","/v2/recaptchaConfig",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _b(n,e){return fe(n,"POST","/v1/accounts:delete",e)}async function yb(n,e){return fe(n,"POST","/v1/accounts:update",e)}async function o_(n,e){return fe(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function as(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ib(n,e=!1){return q(n).getIdToken(e)}async function a_(n,e=!1){const t=q(n),r=await t.getIdToken(e),i=Ua(r);L(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:as(Nc(i.auth_time)),issuedAtTime:as(Nc(i.iat)),expirationTime:as(Nc(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Nc(n){return Number(n)*1e3}function Ua(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Mo("JWT malformed, contained fewer than 3 sections"),null;try{const i=Xf(t);return i?JSON.parse(i):(Mo("Failed to decode base64 JWT payload"),null)}catch(i){return Mo("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function bf(n){const e=Ua(n);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zt(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof pt&&Tb(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Tb({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eb{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class du{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=as(this.lastLoginAt),this.creationTime=as(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ws(n){var e;const t=n.auth,r=await n.getIdToken(),i=await zt(n,o_(t,{idToken:r}));L(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?u_(s.providerUserInfo):[],c=vb(n.providerData,o),u=n.isAnonymous,l=!(n.email&&s.passwordHash)&&!(c!=null&&c.length),d=u?l:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new du(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(n,m)}async function c_(n){const e=q(n);await ws(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function vb(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function u_(n){return n.map(e=>{var{providerId:t}=e,r=wl(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wb(n,e){const t=await n_(n,{},async()=>{const r=ti({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,o=r_(n,i,"/v1/token",`key=${s}`),c=await n._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",t_.fetch()(o,{method:"POST",headers:c,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Ab(n,e){return fe(n,"POST","/v2/accounts:revokeToken",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):bf(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){L(e.length!==0,"internal-error");const t=bf(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await wb(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,o=new kr;return r&&(L(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(L(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(L(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new kr,this.toJSON())}_performRefresh(){return Tt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rn(n,e){L(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class xt{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=wl(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Eb(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new du(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await zt(this,this.stsTokenManager.getToken(this.auth,e));return L(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return a_(this,e)}reload(){return c_(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new xt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await ws(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ve(this.auth.app))return Promise.reject(Oe(this.auth));const e=await this.getIdToken();return await zt(this,_b(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,o,c,u,l,d;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,g=(i=t.email)!==null&&i!==void 0?i:void 0,T=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,w=(o=t.photoURL)!==null&&o!==void 0?o:void 0,D=(c=t.tenantId)!==null&&c!==void 0?c:void 0,P=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,x=(l=t.createdAt)!==null&&l!==void 0?l:void 0,M=(d=t.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:O,emailVerified:G,isAnonymous:W,providerData:$,stsTokenManager:E}=t;L(O&&E,e,"internal-error");const _=kr.fromJSON(this.name,E);L(typeof O=="string",e,"internal-error"),rn(m,e.name),rn(g,e.name),L(typeof G=="boolean",e,"internal-error"),L(typeof W=="boolean",e,"internal-error"),rn(T,e.name),rn(w,e.name),rn(D,e.name),rn(P,e.name),rn(x,e.name),rn(M,e.name);const y=new xt({uid:O,auth:e,email:g,emailVerified:G,displayName:m,isAnonymous:W,photoURL:w,phoneNumber:T,tenantId:D,stsTokenManager:_,createdAt:x,lastLoginAt:M});return $&&Array.isArray($)&&(y.providerData=$.map(v=>Object.assign({},v))),P&&(y._redirectEventId=P),y}static async _fromIdTokenResponse(e,t,r=!1){const i=new kr;i.updateFromServerResponse(t);const s=new xt({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await ws(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];L(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?u_(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),c=new kr;c.updateFromIdToken(r);const u=new xt({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:o}),l={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new du(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,l),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sf=new Map;function Lt(n){jt(n instanceof Function,"Expected a class definition");let e=Sf.get(n);return e?(jt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Sf.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}l_.type="NONE";const fu=l_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fo(n,e,t){return`firebase:${n}:${e}:${t}`}class Nr{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Fo(this.userKey,i.apiKey,s),this.fullPersistenceKey=Fo("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?xt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Nr(Lt(fu),e,r);const i=(await Promise.all(t.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let s=i[0]||Lt(fu);const o=Fo(r,e.config.apiKey,e.name);let c=null;for(const l of t)try{const d=await l._get(o);if(d){const m=xt._fromJSON(e,d);l!==s&&(c=m),s=l;break}}catch{}const u=i.filter(l=>l._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new Nr(s,e,r):(s=u[0],c&&await s._set(o,c.toJSON()),await Promise.all(t.map(async l=>{if(l!==s)try{await l._remove(o)}catch{}})),new Nr(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pf(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(m_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(h_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(g_(e))return"Blackberry";if(__(e))return"Webos";if(d_(e))return"Safari";if((e.includes("chrome/")||f_(e))&&!e.includes("edge/"))return"Chrome";if(p_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function h_(n=Ce()){return/firefox\//i.test(n)}function d_(n=Ce()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function f_(n=Ce()){return/crios\//i.test(n)}function m_(n=Ce()){return/iemobile/i.test(n)}function p_(n=Ce()){return/android/i.test(n)}function g_(n=Ce()){return/blackberry/i.test(n)}function __(n=Ce()){return/webos/i.test(n)}function Pl(n=Ce()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Rb(n=Ce()){var e;return Pl(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function bb(){return kI()&&document.documentMode===10}function y_(n=Ce()){return Pl(n)||p_(n)||__(n)||g_(n)||/windows phone/i.test(n)||m_(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I_(n,e=[]){let t;switch(n){case"Browser":t=Pf(Ce());break;case"Worker":t=`${Pf(Ce())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Pn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((o,c)=>{try{const u=e(s);o(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pb(n,e={}){return fe(n,"GET","/v2/passwordPolicy",de(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cb=6;class Db{constructor(e){var t,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:Cb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,o,c;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kb{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Cf(this),this.idTokenSubscription=new Cf(this),this.beforeStateQueue=new Sb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=e_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Lt(t)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await Nr.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await o_(this,{idToken:e}),r=await xt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(ve(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await ws(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=hb()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ve(this.app))return Promise.reject(Oe(this));const t=e?q(e):null;return t&&L(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ve(this.app)?Promise.reject(Oe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ve(this.app)?Promise.reject(Oe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Lt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Pb(this),t=new Db(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ss("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Ab(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Lt(e)||this._popupRedirectResolver;L(t,this,"argument-error"),this.redirectPersistenceManager=await Nr.create(this,[Lt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(c,this,"internal-error"),c.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=I_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&ub(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Ae(n){return q(n)}class Cf{constructor(e){this.auth=e,this.observer=null,this.addObserver=MI(t=>this.observer=t)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gs={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Nb(n){Gs=n}function Cl(n){return Gs.loadJS(n)}function Vb(){return Gs.recaptchaV2Script}function Ob(){return Gs.recaptchaEnterpriseScript}function xb(){return Gs.gapiScript}function T_(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Lb="recaptcha-enterprise",Mb="NO_RECAPTCHA";class E_{constructor(e){this.type=Lb,this.auth=Ae(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,c)=>{s_(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const l=new i_(u);return s.tenantId==null?s._agentRecaptchaConfig=l:s._tenantRecaptchaConfigs[s.tenantId]=l,o(l.siteKey)}}).catch(u=>{c(u)})})}function i(s,o,c){const u=window.grecaptcha;Rf(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(l=>{o(l)}).catch(()=>{o(Mb)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{r(this.auth).then(c=>{if(!t&&Rf(window.grecaptcha))i(c,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=Ob();u.length!==0&&(u+=c),Cl(u).then(()=>{i(c,s,o)}).catch(l=>{o(l)})}}).catch(c=>{o(c)})})}}async function Df(n,e,t,r=!1){const i=new E_(n);let s;try{s=await i.verify(t)}catch{s=await i.verify(t,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function As(n,e,t,r){var i;if(!((i=n._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Df(n,e,t,t==="getOobCode");return r(n,s)}else return r(n,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Df(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(s)})}async function Fb(n){const e=Ae(n),t=await s_(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new i_(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")&&new E_(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v_(n,e){const t=lr(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(pn(s,e??{}))return i;nt(i,"already-initialized")}return t.initialize({options:e})}function Ub(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Lt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function w_(n,e,t){const r=Ae(n);L(r._canInitEmulator,r,"emulator-config-failed"),L(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!!(t!=null&&t.disableWarnings),s=A_(e),{host:o,port:c}=Bb(e),u=c===null?"":`:${c}`;r.config.emulator={url:`${s}//${o}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||qb()}function A_(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Bb(n){const e=A_(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:kf(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:kf(o)}}}function kf(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function qb(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Tt("not implemented")}_getIdTokenResponse(e){return Tt("not implemented")}_linkToIdToken(e,t){return Tt("not implemented")}_getReauthenticationResolver(e){return Tt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function R_(n,e){return fe(n,"POST","/v1/accounts:resetPassword",de(n,e))}async function jb(n,e){return fe(n,"POST","/v1/accounts:update",e)}async function zb(n,e){return fe(n,"POST","/v1/accounts:signUp",e)}async function Gb(n,e){return fe(n,"POST","/v1/accounts:update",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $b(n,e){return Wt(n,"POST","/v1/accounts:signInWithPassword",de(n,e))}async function Ba(n,e){return fe(n,"POST","/v1/accounts:sendOobCode",de(n,e))}async function Kb(n,e){return Ba(n,e)}async function Hb(n,e){return Ba(n,e)}async function Wb(n,e){return Ba(n,e)}async function Qb(n,e){return Ba(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jb(n,e){return Wt(n,"POST","/v1/accounts:signInWithEmailLink",de(n,e))}async function Yb(n,e){return Wt(n,"POST","/v1/accounts:signInWithEmailLink",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei extends gi{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new ei(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new ei(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return As(e,t,"signInWithPassword",$b);case"emailLink":return Jb(e,{email:this._email,oobCode:this._password});default:nt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return As(e,r,"signUpPassword",zb);case"emailLink":return Yb(e,{idToken:t,email:this._email,oobCode:this._password});default:nt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ft(n,e){return Wt(n,"POST","/v1/accounts:signInWithIdp",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xb="http://localhost";class Rt extends gi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Rt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):nt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=wl(t,["providerId","signInMethod"]);if(!r||!i)return null;const o=new Rt(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Ft(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Ft(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ft(e,t)}buildRequest(){const e={requestUri:Xb,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ti(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zb(n,e){return fe(n,"POST","/v1/accounts:sendVerificationCode",de(n,e))}async function eS(n,e){return Wt(n,"POST","/v1/accounts:signInWithPhoneNumber",de(n,e))}async function tS(n,e){const t=await Wt(n,"POST","/v1/accounts:signInWithPhoneNumber",de(n,e));if(t.temporaryProof)throw Zi(n,"account-exists-with-different-credential",t);return t}const nS={USER_NOT_FOUND:"user-not-found"};async function rS(n,e){const t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return Wt(n,"POST","/v1/accounts:signInWithPhoneNumber",de(n,t),nS)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn extends gi{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new fn({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new fn({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return eS(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return tS(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return rS(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:i}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s}=e;return!r&&!t&&!i&&!s?null:new fn({verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iS(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function sS(n){const e=Gi($i(n)).link,t=e?Gi($i(e)).deep_link_id:null,r=Gi($i(n)).deep_link_id;return(r?Gi($i(r)).link:null)||r||t||e||n}class _i{constructor(e){var t,r,i,s,o,c;const u=Gi($i(e)),l=(t=u.apiKey)!==null&&t!==void 0?t:null,d=(r=u.oobCode)!==null&&r!==void 0?r:null,m=iS((i=u.mode)!==null&&i!==void 0?i:null);L(l&&d&&m,"argument-error"),this.apiKey=l,this.operation=m,this.code=d,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=sS(e);try{return new _i(t)}catch{return null}}}function oS(n){return _i.parseLink(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(){this.providerId=Ln.PROVIDER_ID}static credential(e,t){return ei._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=_i.parseLink(t);return L(r,"argument-error"),ei._fromEmailAndCode(e,r.code,r.tenantId)}}Ln.PROVIDER_ID="password";Ln.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Ln.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi extends Qt{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class cs extends yi{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return L("providerId"in t&&"signInMethod"in t,"argument-error"),Rt._fromParams(t)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return L(e.idToken||e.accessToken,"argument-error"),Rt._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return cs.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return cs.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r,oauthTokenSecret:i,pendingToken:s,nonce:o,providerId:c}=e;if(!r&&!i&&!t&&!s||!c)return null;try{return new cs(c)._credential({idToken:t,accessToken:r,nonce:o,pendingToken:s})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt extends yi{constructor(){super("facebook.com")}static credential(e){return Rt._fromParams({providerId:Dt.PROVIDER_ID,signInMethod:Dt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Dt.credentialFromTaggedObject(e)}static credentialFromError(e){return Dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Dt.credential(e.oauthAccessToken)}catch{return null}}}Dt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Dt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt extends yi{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Rt._fromParams({providerId:kt.PROVIDER_ID,signInMethod:kt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return kt.credentialFromTaggedObject(e)}static credentialFromError(e){return kt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return kt.credential(t,r)}catch{return null}}}kt.GOOGLE_SIGN_IN_METHOD="google.com";kt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt extends yi{constructor(){super("github.com")}static credential(e){return Rt._fromParams({providerId:Nt.PROVIDER_ID,signInMethod:Nt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Nt.credentialFromTaggedObject(e)}static credentialFromError(e){return Nt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Nt.credential(e.oauthAccessToken)}catch{return null}}}Nt.GITHUB_SIGN_IN_METHOD="github.com";Nt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aS="http://localhost";class Rs extends gi{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){const t=this.buildRequest();return Ft(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Ft(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ft(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,pendingToken:s}=t;return!r||!i||!s||r!==i?null:new Rs(r,s)}static _create(e,t){return new Rs(e,t)}buildRequest(){return{requestUri:aS,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cS="saml.";class sa extends Qt{constructor(e){L(e.startsWith(cS),"argument-error"),super(e)}static credentialFromResult(e){return sa.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return sa.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=Rs.fromJSON(e);return L(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:r}=e;if(!t||!r)return null;try{return Rs._create(r,t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt extends yi{constructor(){super("twitter.com")}static credential(e,t){return Rt._fromParams({providerId:Vt.PROVIDER_ID,signInMethod:Vt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Vt.credentialFromTaggedObject(e)}static credentialFromError(e){return Vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Vt.credential(t,r)}catch{return null}}}Vt.TWITTER_SIGN_IN_METHOD="twitter.com";Vt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b_(n,e){return Wt(n,"POST","/v1/accounts:signUp",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await xt._fromIdTokenResponse(e,r,i),o=Nf(r);return new ht({user:s,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=Nf(r);return new ht({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function Nf(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uS(n){var e;if(ve(n.app))return Promise.reject(Oe(n));const t=Ae(n);if(await t._initializationPromise,!((e=t.currentUser)===null||e===void 0)&&e.isAnonymous)return new ht({user:t.currentUser,providerId:null,operationType:"signIn"});const r=await b_(t,{returnSecureToken:!0}),i=await ht._fromIdTokenResponse(t,"signIn",r,!0);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa extends pt{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,oa.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new oa(e,t,r,i)}}function S_(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?oa._fromErrorAndOperation(n,s,e,r):s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P_(n){return new Set(n.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lS(n,e){const t=q(n);await qa(!0,t,e);const{providerUserInfo:r}=await yb(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),i=P_(r||[]);return t.providerData=t.providerData.filter(s=>i.has(s.providerId)),i.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function Dl(n,e,t=!1){const r=await zt(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return ht._forOperation(n,"link",r)}async function qa(n,e,t){await ws(e);const r=P_(e.providerData),i=n===!1?"provider-already-linked":"no-such-provider";L(r.has(t)===n,e.auth,i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function C_(n,e,t=!1){const{auth:r}=n;if(ve(r.app))return Promise.reject(Oe(r));const i="reauthenticate";try{const s=await zt(n,S_(r,i,e,n),t);L(s.idToken,r,"internal-error");const o=Ua(s.idToken);L(o,r,"internal-error");const{sub:c}=o;return L(n.uid===c,r,"user-mismatch"),ht._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&nt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function D_(n,e,t=!1){if(ve(n.app))return Promise.reject(Oe(n));const r="signIn",i=await S_(n,r,e),s=await ht._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function ja(n,e){return D_(Ae(n),e)}async function k_(n,e){const t=q(n);return await qa(!1,t,e.providerId),Dl(t,e)}async function N_(n,e){return C_(q(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hS(n,e){return Wt(n,"POST","/v1/accounts:signInWithCustomToken",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dS(n,e){if(ve(n.app))return Promise.reject(Oe(n));const t=Ae(n),r=await hS(t,{token:e,returnSecureToken:!0}),i=await ht._fromIdTokenResponse(t,"signIn",r);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?kl._fromServerResponse(e,t):"totpInfo"in t?Nl._fromServerResponse(e,t):nt(e,"internal-error")}}class kl extends $s{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new kl(t)}}class Nl extends $s{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Nl(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(n,e,t){var r;L(((r=t.url)===null||r===void 0?void 0:r.length)>0,n,"invalid-continue-uri"),L(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,n,"invalid-dynamic-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(L(t.iOS.bundleId.length>0,n,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(L(t.android.packageName.length>0,n,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vl(n){const e=Ae(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function fS(n,e,t){const r=Ae(n),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&za(r,i,t),await As(r,i,"getOobCode",Hb)}async function mS(n,e,t){await R_(q(n),{oobCode:e,newPassword:t}).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Vl(n),r})}async function pS(n,e){await Gb(q(n),{oobCode:e})}async function V_(n,e){const t=q(n),r=await R_(t,{oobCode:e}),i=r.requestType;switch(L(i,t,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":L(r.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":L(r.mfaInfo,t,"internal-error");default:L(r.email,t,"internal-error")}let s=null;return r.mfaInfo&&(s=$s._fromServerResponse(Ae(t),r.mfaInfo)),{data:{email:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.newEmail:r.email)||null,previousEmail:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.email:r.newEmail)||null,multiFactorInfo:s},operation:i}}async function gS(n,e){const{data:t}=await V_(q(n),e);return t.email}async function _S(n,e,t){if(ve(n.app))return Promise.reject(Oe(n));const r=Ae(n),o=await As(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",b_).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Vl(n),u}),c=await ht._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(c.user),c}function yS(n,e,t){return ve(n.app)?Promise.reject(Oe(n)):ja(q(n),Ln.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Vl(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function IS(n,e,t){const r=Ae(n),i={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function s(o,c){L(c.handleCodeInApp,r,"argument-error"),c&&za(r,o,c)}s(i,t),await As(r,i,"getOobCode",Wb)}function TS(n,e){const t=_i.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function ES(n,e,t){if(ve(n.app))return Promise.reject(Oe(n));const r=q(n),i=Ln.credentialWithLink(e,t||vs());return L(i._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),ja(r,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vS(n,e){return fe(n,"POST","/v1/accounts:createAuthUri",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wS(n,e){const t=bl()?vs():"http://localhost",r={identifier:e,continueUri:t},{signinMethods:i}=await vS(q(n),r);return i||[]}async function AS(n,e){const t=q(n),i={requestType:"VERIFY_EMAIL",idToken:await n.getIdToken()};e&&za(t.auth,i,e);const{email:s}=await Kb(t.auth,i);s!==n.email&&await n.reload()}async function RS(n,e,t){const r=q(n),s={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await n.getIdToken(),newEmail:e};t&&za(r.auth,s,t);const{email:o}=await Qb(r.auth,s);o!==n.email&&await n.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bS(n,e){return fe(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function SS(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=q(n),s={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await zt(r,bS(r.auth,s));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const c=r.providerData.find(({providerId:u})=>u==="password");c&&(c.displayName=r.displayName,c.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function PS(n,e){const t=q(n);return ve(t.auth.app)?Promise.reject(Oe(t.auth)):O_(t,e,null)}function CS(n,e){return O_(q(n),null,e)}async function O_(n,e,t){const{auth:r}=n,s={idToken:await n.getIdToken(),returnSecureToken:!0};e&&(s.email=e),t&&(s.password=t);const o=await zt(n,jb(r,s));await n._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DS(n){var e,t;if(!n)return null;const{providerId:r}=n,i=n.rawUserInfo?JSON.parse(n.rawUserInfo):{},s=n.isNewUser||n.kind==="identitytoolkit#SignupNewUserResponse";if(!r&&(n!=null&&n.idToken)){const o=(t=(e=Ua(n.idToken))===null||e===void 0?void 0:e.firebase)===null||t===void 0?void 0:t.sign_in_provider;if(o){const c=o!=="anonymous"&&o!=="custom"?o:null;return new Vr(s,c)}}if(!r)return null;switch(r){case"facebook.com":return new kS(s,i);case"github.com":return new NS(s,i);case"google.com":return new VS(s,i);case"twitter.com":return new OS(s,i,n.screenName||null);case"custom":case"anonymous":return new Vr(s,null);default:return new Vr(s,r,i)}}class Vr{constructor(e,t,r={}){this.isNewUser=e,this.providerId=t,this.profile=r}}class x_ extends Vr{constructor(e,t,r,i){super(e,t,r),this.username=i}}class kS extends Vr{constructor(e,t){super(e,"facebook.com",t)}}class NS extends x_{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class VS extends Vr{constructor(e,t){super(e,"google.com",t)}}class OS extends x_{constructor(e,t,r){super(e,"twitter.com",t,r)}}function xS(n){const{user:e,_tokenResponse:t}=n;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:DS(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LS(n,e){return q(n).setPersistence(e)}function MS(n){return Fb(n)}async function FS(n,e){return Ae(n).validatePassword(e)}function L_(n,e,t,r){return q(n).onIdTokenChanged(e,t,r)}function M_(n,e,t){return q(n).beforeAuthStateChanged(e,t)}function US(n,e,t,r){return q(n).onAuthStateChanged(e,t,r)}function BS(n){q(n).useDeviceLanguage()}function qS(n,e){return q(n).updateCurrentUser(e)}function jS(n){return q(n).signOut()}function zS(n,e){return Ae(n).revokeAccessToken(e)}async function GS(n){return q(n).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wn{constructor(e,t,r){this.type=e,this.credential=t,this.user=r}static _fromIdtoken(e,t){return new Wn("enroll",e,t)}static _fromMfaPendingCredential(e){return new Wn("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var t,r;if(e!=null&&e.multiFactorSession){if(!((t=e.multiFactorSession)===null||t===void 0)&&t.pendingCredential)return Wn._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if(!((r=e.multiFactorSession)===null||r===void 0)&&r.idToken)return Wn._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol{constructor(e,t,r){this.session=e,this.hints=t,this.signInResolver=r}static _fromError(e,t){const r=Ae(e),i=t.customData._serverResponse,s=(i.mfaInfo||[]).map(c=>$s._fromServerResponse(r,c));L(i.mfaPendingCredential,r,"internal-error");const o=Wn._fromMfaPendingCredential(i.mfaPendingCredential);return new Ol(o,s,async c=>{const u=await c._process(r,o);delete i.mfaInfo,delete i.mfaPendingCredential;const l=Object.assign(Object.assign({},i),{idToken:u.idToken,refreshToken:u.refreshToken});switch(t.operationType){case"signIn":const d=await ht._fromIdTokenResponse(r,t.operationType,l);return await r._updateCurrentUser(d.user),d;case"reauthenticate":return L(t.user,r,"internal-error"),ht._forOperation(t.user,t.operationType,l);default:nt(r,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}function $S(n,e){var t;const r=q(n),i=e;return L(e.customData.operationType,r,"argument-error"),L((t=i.customData._serverResponse)===null||t===void 0?void 0:t.mfaPendingCredential,r,"argument-error"),Ol._fromError(r,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KS(n,e){return fe(n,"POST","/v2/accounts/mfaEnrollment:start",de(n,e))}function HS(n,e){return fe(n,"POST","/v2/accounts/mfaEnrollment:finalize",de(n,e))}function WS(n,e){return fe(n,"POST","/v2/accounts/mfaEnrollment:start",de(n,e))}function QS(n,e){return fe(n,"POST","/v2/accounts/mfaEnrollment:finalize",de(n,e))}function JS(n,e){return fe(n,"POST","/v2/accounts/mfaEnrollment:withdraw",de(n,e))}class xl{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(r=>$s._fromServerResponse(e.auth,r)))})}static _fromUser(e){return new xl(e)}async getSession(){return Wn._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const r=e,i=await this.getSession(),s=await zt(this.user,r._process(this.user.auth,i,t));return await this.user._updateTokensIfNecessary(s),this.user.reload()}async unenroll(e){const t=typeof e=="string"?e:e.uid,r=await this.user.getIdToken();try{const i=await zt(this.user,JS(this.user.auth,{idToken:r,mfaEnrollmentId:t}));this.enrolledFactors=this.enrolledFactors.filter(({uid:s})=>s!==t),await this.user._updateTokensIfNecessary(i),await this.user.reload()}catch(i){throw i}}}const Vc=new WeakMap;function YS(n){const e=q(n);return Vc.has(e)||Vc.set(e,xl._fromUser(e)),Vc.get(e)}const aa="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F_{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(aa,"1"),this.storage.removeItem(aa),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XS=1e3,ZS=10;class U_ extends F_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=y_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);bb()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,ZS):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},XS)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}U_.type="LOCAL";const B_=U_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_ extends F_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}q_.type="SESSION";const Ll=q_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eP(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new Ga(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const c=Array.from(o).map(async l=>l(t.origin,s)),u=await eP(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ga.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $a(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tP{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((c,u)=>{const l=$a("",20);i.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(m){const g=m;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(g.data.response);break;default:clearTimeout(d),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(){return window}function nP(n){Pe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ml(){return typeof Pe().WorkerGlobalScope<"u"&&typeof Pe().importScripts=="function"}async function rP(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function iP(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function sP(){return Ml()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j_="firebaseLocalStorageDb",oP=1,ca="firebaseLocalStorage",z_="fbase_key";class Ks{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ka(n,e){return n.transaction([ca],e?"readwrite":"readonly").objectStore(ca)}function aP(){const n=indexedDB.deleteDatabase(j_);return new Ks(n).toPromise()}function mu(){const n=indexedDB.open(j_,oP);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(ca,{keyPath:z_})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(ca)?e(r):(r.close(),await aP(),e(await mu()))})})}async function Vf(n,e,t){const r=Ka(n,!0).put({[z_]:e,value:t});return new Ks(r).toPromise()}async function cP(n,e){const t=Ka(n,!1).get(e),r=await new Ks(t).toPromise();return r===void 0?null:r.value}function Of(n,e){const t=Ka(n,!0).delete(e);return new Ks(t).toPromise()}const uP=800,lP=3;class G_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await mu(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>lP)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Ml()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ga._getInstance(sP()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await rP(),!this.activeServiceWorker)return;this.sender=new tP(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||iP()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await mu();return await Vf(e,aa,"1"),await Of(e,aa),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Vf(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>cP(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Of(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Ka(i,!1).getAll();return new Ks(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),uP)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}G_.type="LOCAL";const $_=G_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hP(n,e){return fe(n,"POST","/v2/accounts/mfaSignIn:start",de(n,e))}function dP(n,e){return fe(n,"POST","/v2/accounts/mfaSignIn:finalize",de(n,e))}function fP(n,e){return fe(n,"POST","/v2/accounts/mfaSignIn:finalize",de(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mP=500,pP=6e4,vo=1e12;class gP{constructor(e){this.auth=e,this.counter=vo,this._widgets=new Map}render(e,t){const r=this.counter;return this._widgets.set(r,new _P(e,this.auth.name,t||{})),this.counter++,r}reset(e){var t;const r=e||vo;(t=this._widgets.get(r))===null||t===void 0||t.delete(),this._widgets.delete(r)}getResponse(e){var t;const r=e||vo;return((t=this._widgets.get(r))===null||t===void 0?void 0:t.getResponse())||""}async execute(e){var t;const r=e||vo;return(t=this._widgets.get(r))===null||t===void 0||t.execute(),""}}class _P{constructor(e,t,r){this.params=r,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const i=typeof e=="string"?document.getElementById(e):e;L(i,"argument-error",{appName:t}),this.container=i,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=yP(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},pP)},mP))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function yP(n){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<n;r++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oc=T_("rcb"),IP=new zs(3e4,6e4);class TP{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(!((e=Pe().grecaptcha)===null||e===void 0)&&e.render)}load(e,t=""){return L(EP(t),e,"argument-error"),this.shouldResolveImmediately(t)&&Af(Pe().grecaptcha)?Promise.resolve(Pe().grecaptcha):new Promise((r,i)=>{const s=Pe().setTimeout(()=>{i(Xe(e,"network-request-failed"))},IP.get());Pe()[Oc]=()=>{Pe().clearTimeout(s),delete Pe()[Oc];const c=Pe().grecaptcha;if(!c||!Af(c)){i(Xe(e,"internal-error"));return}const u=c.render;c.render=(l,d)=>{const m=u(l,d);return this.counter++,m},this.hostLanguage=t,r(c)};const o=`${Vb()}?${ti({onload:Oc,render:"explicit",hl:t})}`;Cl(o).catch(()=>{clearTimeout(s),i(Xe(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(!((t=Pe().grecaptcha)===null||t===void 0)&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function EP(n){return n.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(n)}class vP{async load(e){return new gP(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K_="recaptcha",wP={theme:"light",type:"image"};class AP{constructor(e,t,r=Object.assign({},wP)){this.parameters=r,this.type=K_,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Ae(e),this.isInvisible=this.parameters.size==="invisible",L(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const i=typeof t=="string"?document.getElementById(t):t;L(i,this.auth,"argument-error"),this.container=i,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new vP:new TP,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),r=t.getResponse(e);return r||new Promise(i=>{const s=o=>{o&&(this.tokenChangeListeners.delete(s),i(o))};this.tokenChangeListeners.add(s),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){L(!this.parameters.sitekey,this.auth,"argument-error"),L(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),L(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(r=>r(t)),typeof e=="function")e(t);else if(typeof e=="string"){const r=Pe()[e];typeof r=="function"&&r(t)}}}assertNotDestroyed(){L(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){L(bl()&&!Ml(),this.auth,"internal-error"),await RP(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await gb(this.auth);L(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return L(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function RP(){let n=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}n=()=>e(),window.addEventListener("load",n)}).catch(e=>{throw n&&window.removeEventListener("load",n),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=fn._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function bP(n,e,t){if(ve(n.app))return Promise.reject(Oe(n));const r=Ae(n),i=await Ha(r,e,q(t));return new Fl(i,s=>ja(r,s))}async function SP(n,e,t){const r=q(n);await qa(!1,r,"phone");const i=await Ha(r.auth,e,q(t));return new Fl(i,s=>k_(r,s))}async function PP(n,e,t){const r=q(n);if(ve(r.auth.app))return Promise.reject(Oe(r.auth));const i=await Ha(r.auth,e,q(t));return new Fl(i,s=>N_(r,s))}async function Ha(n,e,t){var r;const i=await t.verify();try{L(typeof i=="string",n,"argument-error"),L(t.type===K_,n,"argument-error");let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const o=s.session;if("phoneNumber"in s)return L(o.type==="enroll",n,"internal-error"),(await KS(n,{idToken:o.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,recaptchaToken:i}})).phoneSessionInfo.sessionInfo;{L(o.type==="signin",n,"internal-error");const c=((r=s.multiFactorHint)===null||r===void 0?void 0:r.uid)||s.multiFactorUid;return L(c,n,"missing-multi-factor-info"),(await hP(n,{mfaPendingCredential:o.credential,mfaEnrollmentId:c,phoneSignInInfo:{recaptchaToken:i}})).phoneResponseInfo.sessionInfo}}else{const{sessionInfo:o}=await Zb(n,{phoneNumber:s.phoneNumber,recaptchaToken:i});return o}}finally{t._reset()}}async function CP(n,e){const t=q(n);if(ve(t.auth.app))return Promise.reject(Oe(t.auth));await Dl(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e){this.providerId=Yn.PROVIDER_ID,this.auth=Ae(e)}verifyPhoneNumber(e,t){return Ha(this.auth,e,q(t))}static credential(e,t){return fn._fromVerification(e,t)}static credentialFromResult(e){const t=e;return Yn.credentialFromTaggedObject(t)}static credentialFromError(e){return Yn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:r}=e;return t&&r?fn._fromTokenResponse(t,r):null}}Yn.PROVIDER_ID="phone";Yn.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mr(n,e){return e?Lt(e):(L(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul extends gi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ft(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ft(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ft(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function DP(n){return D_(n.auth,new Ul(n),n.bypassAuthState)}function kP(n){const{auth:e,user:t}=n;return L(t,e,"internal-error"),C_(t,new Ul(n),n.bypassAuthState)}async function NP(n){const{auth:e,user:t}=n;return L(t,e,"internal-error"),Dl(t,new Ul(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return DP;case"linkViaPopup":case"linkViaRedirect":return NP;case"reauthViaPopup":case"reauthViaRedirect":return kP;default:nt(this.auth,"internal-error")}}resolve(e){jt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){jt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VP=new zs(2e3,1e4);async function OP(n,e,t){if(ve(n.app))return Promise.reject(Xe(n,"operation-not-supported-in-this-environment"));const r=Ae(n);pi(n,e,Qt);const i=mr(r,t);return new Mt(r,"signInViaPopup",e,i).executeNotNull()}async function xP(n,e,t){const r=q(n);if(ve(r.auth.app))return Promise.reject(Xe(r.auth,"operation-not-supported-in-this-environment"));pi(r.auth,e,Qt);const i=mr(r.auth,t);return new Mt(r.auth,"reauthViaPopup",e,i,r).executeNotNull()}async function LP(n,e,t){const r=q(n);pi(r.auth,e,Qt);const i=mr(r.auth,t);return new Mt(r.auth,"linkViaPopup",e,i,r).executeNotNull()}class Mt extends H_{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Mt.currentPopupAction&&Mt.currentPopupAction.cancel(),Mt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){jt(this.filter.length===1,"Popup operations only handle one event");const e=$a();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Xe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Xe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Mt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Xe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,VP.get())};e()}}Mt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MP="pendingRedirect",Uo=new Map;class FP extends H_{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Uo.get(this.auth._key());if(!e){try{const r=await UP(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Uo.set(this.auth._key(),e)}return this.bypassAuthState||Uo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function UP(n,e){const t=Q_(e),r=W_(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}async function Bl(n,e){return W_(n)._set(Q_(e),"true")}function BP(n,e){Uo.set(n._key(),e)}function W_(n){return Lt(n._redirectPersistence)}function Q_(n){return Fo(MP,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qP(n,e,t){return jP(n,e,t)}async function jP(n,e,t){if(ve(n.app))return Promise.reject(Oe(n));const r=Ae(n);pi(n,e,Qt),await r._initializationPromise;const i=mr(r,t);return await Bl(i,r),i._openRedirect(r,e,"signInViaRedirect")}function zP(n,e,t){return GP(n,e,t)}async function GP(n,e,t){const r=q(n);if(pi(r.auth,e,Qt),ve(r.auth.app))return Promise.reject(Oe(r.auth));await r.auth._initializationPromise;const i=mr(r.auth,t);await Bl(i,r.auth);const s=await Y_(r);return i._openRedirect(r.auth,e,"reauthViaRedirect",s)}function $P(n,e,t){return KP(n,e,t)}async function KP(n,e,t){const r=q(n);pi(r.auth,e,Qt),await r.auth._initializationPromise;const i=mr(r.auth,t);await qa(!1,r,e.providerId),await Bl(i,r.auth);const s=await Y_(r);return i._openRedirect(r.auth,e,"linkViaRedirect",s)}async function HP(n,e){return await Ae(n)._initializationPromise,J_(n,e,!1)}async function J_(n,e,t=!1){if(ve(n.app))return Promise.reject(Oe(n));const r=Ae(n),i=mr(r,e),o=await new FP(r,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}async function Y_(n){const e=$a(`${n.uid}:::`);return n._redirectEventId=e,await n.auth._setRedirectUser(n),await n.auth._persistUserIfCurrent(n),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WP=10*60*1e3;class QP{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!JP(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!X_(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Xe(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=WP&&this.cachedEventUids.clear(),this.cachedEventUids.has(xf(e))}saveEventToCache(e){this.cachedEventUids.add(xf(e)),this.lastProcessedEventTime=Date.now()}}function xf(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function X_({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function JP(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return X_(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YP(n,e={}){return fe(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XP=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ZP=/^https?/;async function eC(n){if(n.config.emulator)return;const{authorizedDomains:e}=await YP(n);for(const t of e)try{if(tC(t))return}catch{}nt(n,"unauthorized-domain")}function tC(n){const e=vs(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!ZP.test(t))return!1;if(XP.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nC=new zs(3e4,6e4);function Lf(){const n=Pe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function rC(n){return new Promise((e,t)=>{var r,i,s;function o(){Lf(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Lf(),t(Xe(n,"network-request-failed"))},timeout:nC.get()})}if(!((i=(r=Pe().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Pe().gapi)===null||s===void 0)&&s.load)o();else{const c=T_("iframefcb");return Pe()[c]=()=>{gapi.load?o():t(Xe(n,"network-request-failed"))},Cl(`${xb()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw Bo=null,e})}let Bo=null;function iC(n){return Bo=Bo||rC(n),Bo}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sC=new zs(5e3,15e3),oC="__/auth/iframe",aC="emulator/auth/iframe",cC={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},uC=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function lC(n){const e=n.config;L(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Sl(e,aC):`https://${n.config.authDomain}/${oC}`,r={apiKey:e.apiKey,appName:n.name,v:Pn},i=uC.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${ti(r).slice(1)}`}async function hC(n){const e=await iC(n),t=Pe().gapi;return L(t,n,"internal-error"),e.open({where:document.body,url:lC(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:cC,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Xe(n,"network-request-failed"),c=Pe().setTimeout(()=>{s(o)},sC.get());function u(){Pe().clearTimeout(c),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dC={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},fC=500,mC=600,pC="_blank",gC="http://localhost";class Mf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function _C(n,e,t,r=fC,i=mC){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const u=Object.assign(Object.assign({},dC),{width:r.toString(),height:i.toString(),top:s,left:o}),l=Ce().toLowerCase();t&&(c=f_(l)?pC:t),h_(l)&&(e=e||gC,u.scrollbars="yes");const d=Object.entries(u).reduce((g,[T,w])=>`${g}${T}=${w},`,"");if(Rb(l)&&c!=="_self")return yC(e||"",c),new Mf(null);const m=window.open(e||"",c,d);L(m,n,"popup-blocked");try{m.focus()}catch{}return new Mf(m)}function yC(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IC="__/auth/handler",TC="emulator/auth/handler",EC=encodeURIComponent("fac");async function Ff(n,e,t,r,i,s){L(n.config.authDomain,n,"auth-domain-config-required"),L(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Pn,eventId:i};if(e instanceof Qt){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",LI(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,m]of Object.entries({}))o[d]=m}if(e instanceof yi){const d=e.getScopes().filter(m=>m!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const c=o;for(const d of Object.keys(c))c[d]===void 0&&delete c[d];const u=await n._getAppCheckToken(),l=u?`#${EC}=${encodeURIComponent(u)}`:"";return`${vC(n)}?${ti(c).slice(1)}${l}`}function vC({config:n}){return n.emulator?Sl(n,TC):`https://${n.authDomain}/${IC}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xc="webStorageSupport";class wC{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ll,this._completeRedirectFn=J_,this._overrideRedirectResult=BP}async _openPopup(e,t,r,i){var s;jt((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await Ff(e,t,r,vs(),i);return _C(e,o,$a())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await Ff(e,t,r,vs(),i);return nP(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(jt(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await hC(e),r=new QP(e);return t.register("authEvent",i=>(L(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(xc,{type:xc},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[xc];o!==void 0&&t(!!o),nt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=eC(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return y_()||d_()||Pl()}}const Z_=wC;class ey{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return Tt("unexpected MultiFactorSessionType")}}}class ql extends ey{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new ql(e)}_finalizeEnroll(e,t,r){return HS(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return dP(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class ty{constructor(){}static assertion(e){return ql._fromCredential(e)}}ty.FACTOR_ID="phone";class ny{static assertionForEnrollment(e,t){return bs._fromSecret(e,t)}static assertionForSignIn(e,t){return bs._fromEnrollmentId(e,t)}static async generateSecret(e){var t;const r=e;L(typeof((t=r.user)===null||t===void 0?void 0:t.auth)<"u","internal-error");const i=await WS(r.user.auth,{idToken:r.credential,totpEnrollmentInfo:{}});return Wa._fromStartTotpMfaEnrollmentResponse(i,r.user.auth)}}ny.FACTOR_ID="totp";class bs extends ey{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new bs(t,void 0,e)}static _fromEnrollmentId(e,t){return new bs(t,e)}async _finalizeEnroll(e,t,r){return L(typeof this.secret<"u",e,"argument-error"),QS(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){L(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");const r={verificationCode:this.otp};return fP(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}}class Wa{constructor(e,t,r,i,s,o,c){this.sessionInfo=o,this.auth=c,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=i,this.enrollmentCompletionDeadline=s}static _fromStartTotpMfaEnrollmentResponse(e,t){return new Wa(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var r;let i=!1;return(wo(e)||wo(t))&&(i=!0),i&&(wo(e)&&(e=((r=this.auth.currentUser)===null||r===void 0?void 0:r.email)||"unknownuser"),wo(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function wo(n){return typeof n>"u"||(n==null?void 0:n.length)===0}var Uf="@firebase/auth",Bf="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AC{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RC(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function bC(n){yn(new gn("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=r.options;L(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:I_(n)},l=new kb(r,i,s,u);return Ub(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),yn(new gn("auth-internal",e=>{const t=Ae(e.getProvider("auth").getImmediate());return(r=>new AC(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),lt(Uf,Bf,RC(n)),lt(Uf,Bf,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SC=5*60,PC=nm("authIdTokenMaxAge")||SC;let qf=null;const CC=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>PC)return;const i=t==null?void 0:t.token;qf!==i&&(qf=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function DC(n=da()){const e=lr(n,"auth");if(e.isInitialized())return e.getImmediate();const t=v_(n,{popupRedirectResolver:Z_,persistence:[$_,B_,Ll]}),r=nm("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=CC(s.toString());M_(t,o,()=>o(t.currentUser)),L_(t,c=>o(c))}}const i=Zf("auth");return i&&w_(t,`http://${i}`),t}function kC(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Nb({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=Xe("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",kC().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});bC("Browser");const ry=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:sb,ActionCodeURL:_i,AuthCredential:gi,AuthErrorCodes:cb,EmailAuthCredential:ei,EmailAuthProvider:Ln,FacebookAuthProvider:Dt,FactorId:tb,GithubAuthProvider:Nt,GoogleAuthProvider:kt,OAuthCredential:Rt,OAuthProvider:cs,OperationType:ib,PhoneAuthCredential:fn,PhoneAuthProvider:Yn,PhoneMultiFactorGenerator:ty,ProviderId:nb,RecaptchaVerifier:AP,SAMLAuthProvider:sa,SignInMethod:rb,TotpMultiFactorGenerator:ny,TotpSecret:Wa,TwitterAuthProvider:Vt,applyActionCode:pS,beforeAuthStateChanged:M_,browserLocalPersistence:B_,browserPopupRedirectResolver:Z_,browserSessionPersistence:Ll,checkActionCode:V_,confirmPasswordReset:mS,connectAuthEmulator:w_,createUserWithEmailAndPassword:_S,debugErrorMap:ab,deleteUser:GS,fetchSignInMethodsForEmail:wS,getAdditionalUserInfo:xS,getAuth:DC,getIdToken:Ib,getIdTokenResult:a_,getMultiFactorResolver:$S,getRedirectResult:HP,inMemoryPersistence:fu,indexedDBLocalPersistence:$_,initializeAuth:v_,initializeRecaptchaConfig:MS,isSignInWithEmailLink:TS,linkWithCredential:k_,linkWithPhoneNumber:SP,linkWithPopup:LP,linkWithRedirect:$P,multiFactor:YS,onAuthStateChanged:US,onIdTokenChanged:L_,parseActionCodeURL:oS,prodErrorMap:Zg,reauthenticateWithCredential:N_,reauthenticateWithPhoneNumber:PP,reauthenticateWithPopup:xP,reauthenticateWithRedirect:zP,reload:c_,revokeAccessToken:zS,sendEmailVerification:AS,sendPasswordResetEmail:fS,sendSignInLinkToEmail:IS,setPersistence:LS,signInAnonymously:uS,signInWithCredential:ja,signInWithCustomToken:dS,signInWithEmailAndPassword:yS,signInWithEmailLink:ES,signInWithPhoneNumber:bP,signInWithPopup:OP,signInWithRedirect:qP,signOut:jS,unlink:lS,updateCurrentUser:qS,updateEmail:PS,updatePassword:CS,updatePhoneNumber:CP,updateProfile:SS,useDeviceLanguage:BS,validatePassword:FS,verifyBeforeUpdateEmail:RS,verifyPasswordResetCode:gS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy="firebasestorage.googleapis.com",sy="storageBucket",NC=2*60*1e3,VC=10*60*1e3,OC=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie extends pt{constructor(e,t,r=0){super(Lc(e),`Firebase Storage: ${t} (${Lc(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Ie.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Lc(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var ce;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(ce||(ce={}));function Lc(n){return"storage/"+n}function jl(){const n="An unknown error occurred, please check the error payload for server response.";return new Ie(ce.UNKNOWN,n)}function xC(n){return new Ie(ce.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function LC(n){return new Ie(ce.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function MC(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new Ie(ce.UNAUTHENTICATED,n)}function FC(){return new Ie(ce.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function UC(n){return new Ie(ce.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function oy(){return new Ie(ce.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function ay(){return new Ie(ce.CANCELED,"User canceled the upload/download.")}function BC(n){return new Ie(ce.INVALID_URL,"Invalid URL '"+n+"'.")}function qC(n){return new Ie(ce.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function jC(){return new Ie(ce.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+sy+"' property when initializing the app?")}function cy(){return new Ie(ce.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function zC(){return new Ie(ce.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function GC(){return new Ie(ce.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function $C(n){return new Ie(ce.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function ua(n){return new Ie(ce.INVALID_ARGUMENT,n)}function uy(){return new Ie(ce.APP_DELETED,"The Firebase app was deleted.")}function ly(n){return new Ie(ce.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function us(n,e){return new Ie(ce.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function zi(n){throw new Ie(ce.INTERNAL_ERROR,"Internal error: "+n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=$e.makeFromUrl(e,t)}catch{return new $e(e,"")}if(r.path==="")return r;throw qC(e)}static makeFromUrl(e,t){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(G){G.path.charAt(G.path.length-1)==="/"&&(G.path_=G.path_.slice(0,-1))}const o="(/(.*))?$",c=new RegExp("^gs://"+i+o,"i"),u={bucket:1,path:3};function l(G){G.path_=decodeURIComponent(G.path)}const d="v[A-Za-z0-9_]+",m=t.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",T=new RegExp(`^https?://${m}/${d}/b/${i}/o${g}`,"i"),w={bucket:1,path:3},D=t===iy?"(?:storage.googleapis.com|storage.cloud.google.com)":t,P="([^?#]*)",x=new RegExp(`^https?://${D}/${i}/${P}`,"i"),O=[{regex:c,indices:u,postModify:s},{regex:T,indices:w,postModify:l},{regex:x,indices:{bucket:1,path:2},postModify:l}];for(let G=0;G<O.length;G++){const W=O[G],$=W.regex.exec(e);if($){const E=$[W.indices.bucket];let _=$[W.indices.path];_||(_=""),r=new $e(E,_),W.postModify(r);break}}if(r==null)throw BC(e);return r}}class KC{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HC(n,e,t){let r=1,i=null,s=null,o=!1,c=0;function u(){return c===2}let l=!1;function d(...P){l||(l=!0,e.apply(null,P))}function m(P){i=setTimeout(()=>{i=null,n(T,u())},P)}function g(){s&&clearTimeout(s)}function T(P,...x){if(l){g();return}if(P){g(),d.call(null,P,...x);return}if(u()||o){g(),d.call(null,P,...x);return}r<64&&(r*=2);let O;c===1?(c=2,O=0):O=(r+Math.random())*1e3,m(O)}let w=!1;function D(P){w||(w=!0,g(),!l&&(i!==null?(P||(c=2),clearTimeout(i),m(0)):P||(c=1)))}return m(0),s=setTimeout(()=>{o=!0,D(!0)},t),D}function WC(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QC(n){return n!==void 0}function JC(n){return typeof n=="function"}function YC(n){return typeof n=="object"&&!Array.isArray(n)}function Qa(n){return typeof n=="string"||n instanceof String}function jf(n){return zl()&&n instanceof Blob}function zl(){return typeof Blob<"u"}function pu(n,e,t,r){if(r<e)throw ua(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw ua(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function hy(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const i=e(r)+"="+e(n[r]);t=t+i+"&"}return t=t.slice(0,-1),t}var Xn;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Xn||(Xn={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dy(n,e){const t=n>=500&&n<600,i=[408,429].indexOf(n)!==-1,s=e.indexOf(n)!==-1;return t||i||s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XC{constructor(e,t,r,i,s,o,c,u,l,d,m,g=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=o,this.callback_=c,this.errorCallback_=u,this.timeout_=l,this.progressCallback_=d,this.connectionFactory_=m,this.retry=g,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((T,w)=>{this.resolve_=T,this.reject_=w,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new Ao(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const o=c=>{const u=c.loaded,l=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,l)};this.progressCallback_!==null&&s.addUploadProgressListener(o),s.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(o),this.pendingConnection_=null;const c=s.getErrorCode()===Xn.NO_ERROR,u=s.getStatus();if(!c||dy(u,this.additionalRetryCodes_)&&this.retry){const d=s.getErrorCode()===Xn.ABORT;r(!1,new Ao(!1,null,d));return}const l=this.successCodes_.indexOf(u)!==-1;r(!0,new Ao(l,s))})},t=(r,i)=>{const s=this.resolve_,o=this.reject_,c=i.connection;if(i.wasSuccessCode)try{const u=this.callback_(c,c.getResponse());QC(u)?s(u):s()}catch(u){o(u)}else if(c!==null){const u=jl();u.serverResponse=c.getErrorText(),this.errorCallback_?o(this.errorCallback_(c,u)):o(u)}else if(i.canceled){const u=this.appDelete_?uy():ay();o(u)}else{const u=oy();o(u)}};this.canceled_?t(!1,new Ao(!1,null,!0)):this.backoffId_=HC(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&WC(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Ao{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function ZC(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function e0(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function t0(n,e){e&&(n["X-Firebase-GMPID"]=e)}function n0(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function r0(n,e,t,r,i,s,o=!0){const c=hy(n.urlParams),u=n.url+c,l=Object.assign({},n.headers);return t0(l,e),ZC(l,t),e0(l,s),n0(l,r),new XC(u,n.method,l,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,i,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i0(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function s0(...n){const e=i0();if(e!==void 0){const t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(zl())return new Blob(n);throw new Ie(ce.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function o0(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a0(n){if(typeof atob>"u")throw $C("base-64");return atob(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ct={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Mc{constructor(e,t){this.data=e,this.contentType=t||null}}function Gl(n,e){switch(n){case ct.RAW:return new Mc(fy(e));case ct.BASE64:case ct.BASE64URL:return new Mc(my(n,e));case ct.DATA_URL:return new Mc(u0(e),l0(e))}throw jl()}function fy(n){const e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const s=r,o=n.charCodeAt(++t);r=65536|(s&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function c0(n){let e;try{e=decodeURIComponent(n)}catch{throw us(ct.DATA_URL,"Malformed data URL.")}return fy(e)}function my(n,e){switch(n){case ct.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw us(n,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case ct.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw us(n,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=a0(e)}catch(i){throw i.message.includes("polyfill")?i:us(n,"Invalid character found")}const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}class py{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw us(ct.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=t[1]||null;r!=null&&(this.base64=h0(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function u0(n){const e=new py(n);return e.base64?my(ct.BASE64,e.rest):c0(e.rest)}function l0(n){return new py(n).contentType}function h0(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e,t){let r=0,i="";jf(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,t){if(jf(this.data_)){const r=this.data_,i=o0(r,e,t);return i===null?null:new gt(i)}else{const r=new Uint8Array(this.data_.buffer,e,t-e);return new gt(r,!0)}}static getBlob(...e){if(zl()){const t=e.map(r=>r instanceof gt?r.data_:r);return new gt(s0.apply(null,t))}else{const t=e.map(o=>Qa(o)?Gl(ct.RAW,o).data:o.data_);let r=0;t.forEach(o=>{r+=o.byteLength});const i=new Uint8Array(r);let s=0;return t.forEach(o=>{for(let c=0;c<o.length;c++)i[s++]=o[c]}),new gt(i,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $l(n){let e;try{e=JSON.parse(n)}catch{return null}return YC(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function d0(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function f0(n,e){const t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function gy(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m0(n,e){return e}class Je{constructor(e,t,r,i){this.server=e,this.local=t||e,this.writable=!!r,this.xform=i||m0}}let Ro=null;function p0(n){return!Qa(n)||n.length<2?n:gy(n)}function Hs(){if(Ro)return Ro;const n=[];n.push(new Je("bucket")),n.push(new Je("generation")),n.push(new Je("metageneration")),n.push(new Je("name","fullPath",!0));function e(s,o){return p0(o)}const t=new Je("name");t.xform=e,n.push(t);function r(s,o){return o!==void 0?Number(o):o}const i=new Je("size");return i.xform=r,n.push(i),n.push(new Je("timeCreated")),n.push(new Je("updated")),n.push(new Je("md5Hash",null,!0)),n.push(new Je("cacheControl",null,!0)),n.push(new Je("contentDisposition",null,!0)),n.push(new Je("contentEncoding",null,!0)),n.push(new Je("contentLanguage",null,!0)),n.push(new Je("contentType",null,!0)),n.push(new Je("metadata","customMetadata",!0)),Ro=n,Ro}function g0(n,e){function t(){const r=n.bucket,i=n.fullPath,s=new $e(r,i);return e._makeStorageReference(s)}Object.defineProperty(n,"ref",{get:t})}function _0(n,e,t){const r={};r.type="file";const i=t.length;for(let s=0;s<i;s++){const o=t[s];r[o.local]=o.xform(r,e[o.server])}return g0(r,n),r}function _y(n,e,t){const r=$l(e);return r===null?null:_0(n,r,t)}function y0(n,e,t,r){const i=$l(e);if(i===null||!Qa(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const o=encodeURIComponent;return s.split(",").map(l=>{const d=n.bucket,m=n.fullPath,g="/b/"+o(d)+"/o/"+o(m),T=Jt(g,t,r),w=hy({alt:"media",token:l});return T+w})[0]}function Kl(n,e){const t={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(t[s.server]=n[s.local])}return JSON.stringify(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zf="prefixes",Gf="items";function I0(n,e,t){const r={prefixes:[],items:[],nextPageToken:t.nextPageToken};if(t[zf])for(const i of t[zf]){const s=i.replace(/\/$/,""),o=n._makeStorageReference(new $e(e,s));r.prefixes.push(o)}if(t[Gf])for(const i of t[Gf]){const s=n._makeStorageReference(new $e(e,i.name));r.items.push(s)}return r}function T0(n,e,t){const r=$l(t);return r===null?null:I0(n,e,r)}class bt{constructor(e,t,r,i){this.url=e,this.method=t,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(n){if(!n)throw jl()}function Ja(n,e){function t(r,i){const s=_y(n,i,e);return wt(s!==null),s}return t}function E0(n,e){function t(r,i){const s=T0(n,e,i);return wt(s!==null),s}return t}function v0(n,e){function t(r,i){const s=_y(n,i,e);return wt(s!==null),y0(s,i,n.host,n._protocol)}return t}function Ii(n){function e(t,r){let i;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?i=FC():i=MC():t.getStatus()===402?i=LC(n.bucket):t.getStatus()===403?i=UC(n.path):i=r,i.status=t.getStatus(),i.serverResponse=r.serverResponse,i}return e}function Ws(n){const e=Ii(n);function t(r,i){let s=e(r,i);return r.getStatus()===404&&(s=xC(n.path)),s.serverResponse=i.serverResponse,s}return t}function yy(n,e,t){const r=e.fullServerUrl(),i=Jt(r,n.host,n._protocol),s="GET",o=n.maxOperationRetryTime,c=new bt(i,s,Ja(n,t),o);return c.errorHandler=Ws(e),c}function w0(n,e,t,r,i){const s={};e.isRoot?s.prefix="":s.prefix=e.path+"/",t.length>0&&(s.delimiter=t),r&&(s.pageToken=r),i&&(s.maxResults=i);const o=e.bucketOnlyServerUrl(),c=Jt(o,n.host,n._protocol),u="GET",l=n.maxOperationRetryTime,d=new bt(c,u,E0(n,e.bucket),l);return d.urlParams=s,d.errorHandler=Ii(e),d}function Iy(n,e,t){const r=e.fullServerUrl(),i=Jt(r,n.host,n._protocol)+"?alt=media",s="GET",o=n.maxOperationRetryTime,c=new bt(i,s,(u,l)=>l,o);return c.errorHandler=Ws(e),t!==void 0&&(c.headers.Range=`bytes=0-${t}`,c.successCodes=[200,206]),c}function A0(n,e,t){const r=e.fullServerUrl(),i=Jt(r,n.host,n._protocol),s="GET",o=n.maxOperationRetryTime,c=new bt(i,s,v0(n,t),o);return c.errorHandler=Ws(e),c}function R0(n,e,t,r){const i=e.fullServerUrl(),s=Jt(i,n.host,n._protocol),o="PATCH",c=Kl(t,r),u={"Content-Type":"application/json; charset=utf-8"},l=n.maxOperationRetryTime,d=new bt(s,o,Ja(n,r),l);return d.headers=u,d.body=c,d.errorHandler=Ws(e),d}function b0(n,e){const t=e.fullServerUrl(),r=Jt(t,n.host,n._protocol),i="DELETE",s=n.maxOperationRetryTime;function o(u,l){}const c=new bt(r,i,o,s);return c.successCodes=[200,204],c.errorHandler=Ws(e),c}function S0(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function Ty(n,e,t){const r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=S0(null,e)),r}function Ey(n,e,t,r,i){const s=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function c(){let O="";for(let G=0;G<2;G++)O=O+Math.random().toString().slice(2);return O}const u=c();o["Content-Type"]="multipart/related; boundary="+u;const l=Ty(e,r,i),d=Kl(l,t),m="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+d+`\r
--`+u+`\r
Content-Type: `+l.contentType+`\r
\r
`,g=`\r
--`+u+"--",T=gt.getBlob(m,r,g);if(T===null)throw cy();const w={name:l.fullPath},D=Jt(s,n.host,n._protocol),P="POST",x=n.maxUploadRetryTime,M=new bt(D,P,Ja(n,t),x);return M.urlParams=w,M.headers=o,M.body=T.uploadData(),M.errorHandler=Ii(e),M}class la{constructor(e,t,r,i){this.current=e,this.total=t,this.finalized=!!r,this.metadata=i||null}}function Hl(n,e){let t=null;try{t=n.getResponseHeader("X-Goog-Upload-Status")}catch{wt(!1)}return wt(!!t&&(e||["active"]).indexOf(t)!==-1),t}function P0(n,e,t,r,i){const s=e.bucketOnlyServerUrl(),o=Ty(e,r,i),c={name:o.fullPath},u=Jt(s,n.host,n._protocol),l="POST",d={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${r.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},m=Kl(o,t),g=n.maxUploadRetryTime;function T(D){Hl(D);let P;try{P=D.getResponseHeader("X-Goog-Upload-URL")}catch{wt(!1)}return wt(Qa(P)),P}const w=new bt(u,l,T,g);return w.urlParams=c,w.headers=d,w.body=m,w.errorHandler=Ii(e),w}function C0(n,e,t,r){const i={"X-Goog-Upload-Command":"query"};function s(l){const d=Hl(l,["active","final"]);let m=null;try{m=l.getResponseHeader("X-Goog-Upload-Size-Received")}catch{wt(!1)}m||wt(!1);const g=Number(m);return wt(!isNaN(g)),new la(g,r.size(),d==="final")}const o="POST",c=n.maxUploadRetryTime,u=new bt(t,o,s,c);return u.headers=i,u.errorHandler=Ii(e),u}const $f=256*1024;function D0(n,e,t,r,i,s,o,c){const u=new la(0,0);if(o?(u.current=o.current,u.total=o.total):(u.current=0,u.total=r.size()),r.size()!==u.total)throw zC();const l=u.total-u.current;let d=l;i>0&&(d=Math.min(d,i));const m=u.current,g=m+d;let T="";d===0?T="finalize":l===d?T="upload, finalize":T="upload";const w={"X-Goog-Upload-Command":T,"X-Goog-Upload-Offset":`${u.current}`},D=r.slice(m,g);if(D===null)throw cy();function P(G,W){const $=Hl(G,["active","final"]),E=u.current+d,_=r.size();let y;return $==="final"?y=Ja(e,s)(G,W):y=null,new la(E,_,$==="final",y)}const x="POST",M=e.maxUploadRetryTime,O=new bt(t,x,P,M);return O.headers=w,O.body=D.uploadData(),O.progressCallback=c||null,O.errorHandler=Ii(n),O}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k0={STATE_CHANGED:"state_changed"},Ye={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function Fc(n){switch(n){case"running":case"pausing":case"canceling":return Ye.RUNNING;case"paused":return Ye.PAUSED;case"success":return Ye.SUCCESS;case"canceled":return Ye.CANCELED;case"error":return Ye.ERROR;default:return Ye.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N0{constructor(e,t,r){if(JC(e)||t!=null||r!=null)this.next=e,this.error=t??void 0,this.complete=r??void 0;else{const s=e;this.next=s.next,this.error=s.error,this.complete=s.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ar(n){return(...e)=>{Promise.resolve().then(()=>n(...e))}}class Wl{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Xn.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Xn.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Xn.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,i){if(this.sent_)throw zi("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const s in i)i.hasOwnProperty(s)&&this.xhr_.setRequestHeader(s,i[s].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw zi("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw zi("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw zi("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw zi("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class V0 extends Wl{initXhr(){this.xhr_.responseType="text"}}function ft(){return new V0}class O0 extends Wl{initXhr(){this.xhr_.responseType="arraybuffer"}}function x0(){return new O0}class L0 extends Wl{initXhr(){this.xhr_.responseType="blob"}}function M0(){return new L0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e,t,r=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=r,this._mappings=Hs(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=i=>{if(this._request=void 0,this._chunkMultiplier=1,i._codeEquals(ce.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const s=this.isExponentialBackoffExpired();if(dy(i.status,[]))if(s)i=oy();else{this.sleepTime=Math.max(this.sleepTime*2,OC),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=i,this._transition("error")}},this._metadataErrorHandler=i=>{this._request=void 0,i._codeEquals(ce.CANCELED)?this.completeTransitions_():(this._error=i,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((i,s)=>{this._resolve=i,this._reject=s,this._start()}),this._promise.then(null,()=>{})}isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}_makeProgressCallback(){const e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([t,r])=>{switch(this._state){case"running":e(t,r);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,t)=>{const r=P0(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),i=this._ref.storage._makeRequest(r,ft,e,t);this._request=i,i.getPromise().then(s=>{this._request=void 0,this._uploadUrl=s,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((t,r)=>{const i=C0(this._ref.storage,this._ref._location,e,this._blob),s=this._ref.storage._makeRequest(i,ft,t,r);this._request=s,s.getPromise().then(o=>{o=o,this._request=void 0,this._updateProgress(o.current),this._needToFetchStatus=!1,o.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=$f*this._chunkMultiplier,t=new la(this._transferred,this._blob.size()),r=this._uploadUrl;this._resolveToken((i,s)=>{let o;try{o=D0(this._ref._location,this._ref.storage,r,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(u){this._error=u,this._transition("error");return}const c=this._ref.storage._makeRequest(o,ft,i,s,!1);this._request=c,c.getPromise().then(u=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(u.current),u.finalized?(this._metadata=u.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){$f*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,t)=>{const r=yy(this._ref.storage,this._ref._location,this._mappings),i=this._ref.storage._makeRequest(r,ft,e,t);this._request=i,i.getPromise().then(s=>{this._request=void 0,this._metadata=s,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,t)=>{const r=Ey(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),i=this._ref.storage._makeRequest(r,ft,e,t);this._request=i,i.getPromise().then(s=>{this._request=void 0,this._metadata=s,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const t=this._state==="paused";this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=ay(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=Fc(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,r,i){const s=new N0(t||void 0,r||void 0,i||void 0);return this._addObserver(s),()=>{this._removeObserver(s)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const t=this._observers.indexOf(e);t!==-1&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(t=>{this._notifyObserver(t)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(Fc(this._state)){case Ye.SUCCESS:Ar(this._resolve.bind(null,this.snapshot))();break;case Ye.CANCELED:case Ye.ERROR:const t=this._reject;Ar(t.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(Fc(this._state)){case Ye.RUNNING:case Ye.PAUSED:e.next&&Ar(e.next.bind(e,this.snapshot))();break;case Ye.SUCCESS:e.complete&&Ar(e.complete.bind(e))();break;case Ye.CANCELED:case Ye.ERROR:e.error&&Ar(e.error.bind(e,this._error))();break;default:e.error&&Ar(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e,t){this._service=e,t instanceof $e?this._location=t:this._location=$e.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new ur(e,t)}get root(){const e=new $e(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return gy(this._location.path)}get storage(){return this._service}get parent(){const e=d0(this._location.path);if(e===null)return null;const t=new $e(this._location.bucket,e);return new ur(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw ly(e)}}function F0(n,e){n._throwIfRoot("getBytes");const t=Iy(n.storage,n._location,e);return n.storage.makeRequestWithTokens(t,x0).then(r=>e!==void 0?r.slice(0,e):r)}function U0(n,e){n._throwIfRoot("getBlob");const t=Iy(n.storage,n._location,e);return n.storage.makeRequestWithTokens(t,M0).then(r=>e!==void 0?r.slice(0,e):r)}function wy(n,e,t){n._throwIfRoot("uploadBytes");const r=Ey(n.storage,n._location,Hs(),new gt(e,!0),t);return n.storage.makeRequestWithTokens(r,ft).then(i=>({metadata:i,ref:n}))}function B0(n,e,t){return n._throwIfRoot("uploadBytesResumable"),new vy(n,new gt(e),t)}function q0(n,e,t=ct.RAW,r){n._throwIfRoot("uploadString");const i=Gl(t,e),s=Object.assign({},r);return s.contentType==null&&i.contentType!=null&&(s.contentType=i.contentType),wy(n,i.data,s)}function j0(n){const e={prefixes:[],items:[]};return Ay(n,e).then(()=>e)}async function Ay(n,e,t){const i=await Ry(n,{pageToken:t});e.prefixes.push(...i.prefixes),e.items.push(...i.items),i.nextPageToken!=null&&await Ay(n,e,i.nextPageToken)}function Ry(n,e){e!=null&&typeof e.maxResults=="number"&&pu("options.maxResults",1,1e3,e.maxResults);const t=e||{},r=w0(n.storage,n._location,"/",t.pageToken,t.maxResults);return n.storage.makeRequestWithTokens(r,ft)}function z0(n){n._throwIfRoot("getMetadata");const e=yy(n.storage,n._location,Hs());return n.storage.makeRequestWithTokens(e,ft)}function G0(n,e){n._throwIfRoot("updateMetadata");const t=R0(n.storage,n._location,e,Hs());return n.storage.makeRequestWithTokens(t,ft)}function $0(n){n._throwIfRoot("getDownloadURL");const e=A0(n.storage,n._location,Hs());return n.storage.makeRequestWithTokens(e,ft).then(t=>{if(t===null)throw GC();return t})}function K0(n){n._throwIfRoot("deleteObject");const e=b0(n.storage,n._location);return n.storage.makeRequestWithTokens(e,ft)}function by(n,e){const t=f0(n._location.path,e),r=new $e(n._location.bucket,t);return new ur(n.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H0(n){return/^[A-Za-z]+:\/\//.test(n)}function W0(n,e){return new ur(n,e)}function Sy(n,e){if(n instanceof Ql){const t=n;if(t._bucket==null)throw jC();const r=new ur(t,t._bucket);return e!=null?Sy(r,e):r}else return e!==void 0?by(n,e):n}function Q0(n,e){if(e&&H0(e)){if(n instanceof Ql)return W0(n,e);throw ua("To use ref(service, url), the first argument must be a Storage instance.")}else return Sy(n,e)}function Kf(n,e){const t=e==null?void 0:e[sy];return t==null?null:$e.makeFromBucketSpec(t,n)}function J0(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";const{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:rm(i,n.app.options.projectId))}class Ql{constructor(e,t,r,i,s){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._bucket=null,this._host=iy,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=NC,this._maxUploadRetryTime=VC,this._requests=new Set,i!=null?this._bucket=$e.makeFromBucketSpec(i,this._host):this._bucket=Kf(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=$e.makeFromBucketSpec(this._url,e):this._bucket=Kf(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){pu("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){pu("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new ur(this,e)}_makeRequest(e,t,r,i,s=!0){if(this._deleted)return new KC(uy());{const o=r0(e,this._appId,r,i,t,this._firebaseVersion,s);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,i).getPromise()}}const Hf="@firebase/storage",Wf="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Py="storage";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y0(n,e){return n=q(n),F0(n,e)}function X0(n,e,t){return n=q(n),wy(n,e,t)}function Z0(n,e,t,r){return n=q(n),q0(n,e,t,r)}function eD(n,e,t){return n=q(n),B0(n,e,t)}function tD(n){return n=q(n),z0(n)}function nD(n,e){return n=q(n),G0(n,e)}function rD(n,e){return n=q(n),Ry(n,e)}function iD(n){return n=q(n),j0(n)}function sD(n){return n=q(n),$0(n)}function oD(n){return n=q(n),K0(n)}function aD(n,e){return n=q(n),Q0(n,e)}function cD(n,e){return by(n,e)}function uD(n=da(),e){n=q(n);const r=lr(n,Py).getImmediate({identifier:e}),i=em("storage");return i&&Cy(r,...i),r}function Cy(n,e,t,r={}){J0(n,e,t,r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lD(n,e){return n=q(n),U0(n,e)}function hD(n,e){throw new Error("getStream() is only supported by NodeJS builds")}function dD(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new Ql(t,r,i,e,Pn)}function fD(){yn(new gn(Py,dD,"PUBLIC").setMultipleInstances(!0)),lt(Hf,Wf,""),lt(Hf,Wf,"esm2017")}fD();const Dy=Object.freeze(Object.defineProperty({__proto__:null,StorageError:Ie,get StorageErrorCode(){return ce},StringFormat:ct,_FbsBlob:gt,_Location:$e,_TaskEvent:k0,_TaskState:Ye,_UploadTask:vy,_dataFromString:Gl,_getChild:cD,_invalidArgument:ua,_invalidRootOperation:ly,connectStorageEmulator:Cy,deleteObject:oD,getBlob:lD,getBytes:Y0,getDownloadURL:sD,getMetadata:tD,getStorage:uD,getStream:hD,list:rD,listAll:iD,ref:aD,updateMetadata:nD,uploadBytes:X0,uploadBytesResumable:eD,uploadString:Z0},Symbol.toStringTag,{value:"Module"}));export{mI as A,_t as R,te as _,mn as a,Uc as b,ED as c,_e as d,wD as e,La as f,mD as g,ry as h,pD as i,xR as l,Or as n,vD as s,TD as u};
