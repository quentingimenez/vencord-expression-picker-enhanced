/*! gifenc - MIT License - https://github.com/mattdesl/gifenc
 * Bundled for the expression picker import feature.
 */
/* eslint-disable */
// prettier-ignore
var Gifenc=(()=>{var Q=Object.defineProperty;var st=Object.getOwnPropertyDescriptor;var at=Object.getOwnPropertyNames;var ut=Object.prototype.hasOwnProperty;var xt=(t,e)=>{for(var i in e)Q(t,i,{get:e[i],enumerable:!0})},gt=(t,e,i,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of at(e))!ut.call(t,r)&&r!==i&&Q(t,r,{get:()=>e[r],enumerable:!(n=st(e,r))||n.enumerable});return t};var bt=t=>gt(Q({},"__esModule",{value:!0}),t);var kt={};xt(kt,{GIFEncoder:()=>ct,applyPalette:()=>rt,default:()=>vt,nearestColor:()=>it,nearestColorIndex:()=>W,nearestColorIndexWithDistance:()=>Z,prequantize:()=>nt,quantize:()=>j,snapColorsToPalette:()=>ot});var J={signature:"GIF",version:"89a",trailer:59,extensionIntroducer:33,applicationExtensionLabel:255,graphicControlExtensionLabel:249,imageSeparator:44,signatureSize:3,versionSize:3,globalColorTableFlagMask:128,colorResolutionMask:112,sortFlagMask:8,globalColorTableSizeMask:7,applicationIdentifierSize:8,applicationAuthCodeSize:3,disposalMethodMask:28,userInputFlagMask:2,transparentColorFlagMask:1,localColorTableFlagMask:128,interlaceFlagMask:64,idSortFlagMask:32,localColorTableSizeMask:7};function U(t=256){let e=0,i=new Uint8Array(t);return{get buffer(){return i.buffer},reset(){e=0},bytesView(){return i.subarray(0,e)},bytes(){return i.slice(0,e)},writeByte(r){n(e+1),i[e]=r,e++},writeBytes(r,o=0,f=r.length){n(e+f);for(let l=0;l<f;l++)i[e++]=r[l+o]},writeBytesView(r,o=0,f=r.byteLength){n(e+f),i.set(r.subarray(o,o+f),e),e+=f}};function n(r){var o=i.length;if(o>=r)return;var f=1024*1024;r=Math.max(r,o*(o<f?2:1.125)>>>0),o!=0&&(r=Math.max(r,256));let l=i;i=new Uint8Array(r),e>0&&i.set(l.subarray(0,e),0)}}var H=12,$=5003,dt=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function ht(t,e,i,n,r=U(512),o=new Uint8Array(256),f=new Int32Array($),l=new Int32Array($)){let x=f.length,a=Math.max(2,n);o.fill(0),l.fill(0),f.fill(-1);let s=0,c=0,g=a+1,p=g,b=!1,d=p,_=(1<<d)-1,u=1<<g-1,v=u+1,B=u+2,h=0,A=i[0],F=0;for(let y=x;y<65536;y*=2)++F;F=8-F,r.writeByte(a),I(u);let w=i.length;for(let y=1;y<w;y++)t:{let k=i[y],m=(k<<H)+A,M=k<<F^A;if(f[M]===m){A=l[M];break t}let L=M===0?1:x-M;for(;f[M]>=0;)if(M-=L,M<0&&(M+=x),f[M]===m){A=l[M];break t}I(A),A=k,B<1<<H?(l[M]=B++,f[M]=m):(f.fill(-1),B=u+2,b=!0,I(u))}return I(A),I(v),r.writeByte(0),r.bytesView();function I(y){for(s&=dt[c],c>0?s|=y<<c:s=y,c+=d;c>=8;)o[h++]=s&255,h>=254&&(r.writeByte(h),r.writeBytesView(o,0,h),h=0),s>>=8,c-=8;if((B>_||b)&&(b?(d=p,_=(1<<d)-1,b=!1):(++d,_=d===H?1<<d:(1<<d)-1)),y==v){for(;c>0;)o[h++]=s&255,h>=254&&(r.writeByte(h),r.writeBytesView(o,0,h),h=0),s>>=8,c-=8;h>0&&(r.writeByte(h),r.writeBytesView(o,0,h),h=0)}}}var tt=ht;function D(t,e,i){return t<<8&63488|e<<2&992|i>>3}function G(t,e,i,n){return t>>4|e&240|(i&240)<<4|(n&240)<<8}function R(t,e,i){return t>>4<<8|e&240|i>>4}function P(t,e,i){return t<e?e:t>i?i:t}function q(t){return t*t}function et(t,e,i){var n=0,r=1e100;let o=t[e],f=o.cnt,l=o.ac,x=o.rc,a=o.gc,s=o.bc;for(var c=o.fw;c!=0;c=t[c].fw){let p=t[c],b=p.cnt,d=f*b/(f+b);if(!(d>=r)){var g=0;i&&(g+=d*q(p.ac-l),g>=r)||(g+=d*q(p.rc-x),!(g>=r)&&(g+=d*q(p.gc-a),!(g>=r)&&(g+=d*q(p.bc-s),!(g>=r)&&(r=g,n=c))))}}o.err=r,o.nn=n}function N(){return{ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0}}function wt(t,e){let i=e==="rgb444"?4096:65536,n=new Array(i),r=t.length;if(e==="rgba4444")for(let o=0;o<r;++o){let f=t[o],l=f>>24&255,x=f>>16&255,a=f>>8&255,s=f&255,c=G(s,a,x,l),g=c in n?n[c]:n[c]=N();g.rc+=s,g.gc+=a,g.bc+=x,g.ac+=l,g.cnt++}else if(e==="rgb444")for(let o=0;o<r;++o){let f=t[o],l=f>>16&255,x=f>>8&255,a=f&255,s=R(a,x,l),c=s in n?n[s]:n[s]=N();c.rc+=a,c.gc+=x,c.bc+=l,c.cnt++}else for(let o=0;o<r;++o){let f=t[o],l=f>>16&255,x=f>>8&255,a=f&255,s=D(a,x,l),c=s in n?n[s]:n[s]=N();c.rc+=a,c.gc+=x,c.bc+=l,c.cnt++}return n}function j(t,e,i={}){let{format:n="rgb565",clearAlpha:r=!0,clearAlphaColor:o=0,clearAlphaThreshold:f=0,oneBitAlpha:l=!1}=i;if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array)&&!(t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");let x=new Uint32Array(t.buffer),a=i.useSqrt!==!1,s=n==="rgba4444",c=wt(x,n),g=c.length,p=g-1,b=new Uint32Array(g+1);for(var d=0,u=0;u<g;++u){let C=c[u];if(C!=null){var _=1/C.cnt;s&&(C.ac*=_),C.rc*=_,C.gc*=_,C.bc*=_,c[d++]=C}}q(e)/d<.022&&(a=!1);for(var u=0;u<d-1;++u)c[u].fw=u+1,c[u+1].bk=u,a&&(c[u].cnt=Math.sqrt(c[u].cnt));a&&(c[u].cnt=Math.sqrt(c[u].cnt));var v,B,h;for(u=0;u<d;++u){et(c,u,!1);var A=c[u].err;for(B=++b[0];B>1&&(h=B>>1,!(c[v=b[h]].err<=A));B=h)b[B]=v;b[B]=u}var F=d-e;for(u=0;u<F;){for(var w;;){var I=b[1];if(w=c[I],w.tm>=w.mtm&&c[w.nn].mtm<=w.tm)break;w.mtm==p?I=b[1]=b[b[0]--]:(et(c,I,!1),w.tm=u);var A=c[I].err;for(B=1;(h=B+B)<=b[0]&&(h<b[0]&&c[b[h]].err>c[b[h+1]].err&&h++,!(A<=c[v=b[h]].err));B=h)b[B]=v;b[B]=I}var y=c[w.nn],k=w.cnt,m=y.cnt,_=1/(k+m);s&&(w.ac=_*(k*w.ac+m*y.ac)),w.rc=_*(k*w.rc+m*y.rc),w.gc=_*(k*w.gc+m*y.gc),w.bc=_*(k*w.bc+m*y.bc),w.cnt+=y.cnt,w.mtm=++u,c[y.bk].fw=y.fw,c[y.fw].bk=y.bk,y.mtm=p}let M=[];var L=0;for(u=0;;++L){let Y=P(Math.round(c[u].rc),0,255),C=P(Math.round(c[u].gc),0,255),O=P(Math.round(c[u].bc),0,255),T=255;s&&(T=P(Math.round(c[u].ac),0,255),l&&(T=T<=(typeof l=="number"?l:127)?0:255),r&&T<=f&&(Y=C=O=o,T=0));let X=s?[Y,C,O,T]:[Y,C,O];if(pt(M,X)||M.push(X),(u=c[u].fw)==0)break}return M}function pt(t,e){for(let i=0;i<t.length;i++){let n=t[i],r=n[0]===e[0]&&n[1]===e[1]&&n[2]===e[2],o=n.length>=4&&e.length>=4?n[3]===e[3]:!0;if(r&&o)return!0}return!1}function E(t,e){var i=0,n;for(n=0;n<t.length;n++){let r=t[n]-e[n];i+=r*r}return i}function V(t,e){return e>1?Math.round(t/e)*e:t}function nt(t,{roundRGB:e=5,roundAlpha:i=10,oneBitAlpha:n=null}={}){let r=new Uint32Array(t.buffer);for(let o=0;o<r.length;o++){let f=r[o],l=f>>24&255,x=f>>16&255,a=f>>8&255,s=f&255;l=V(l,i),n&&(l=l<=(typeof n=="number"?n:127)?0:255),s=V(s,e),a=V(a,e),x=V(x,e),r[o]=l<<24|x<<16|a<<8|s<<0}}function rt(t,e,i="rgb565"){if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array)&&!(t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");if(e.length>256)throw new Error("applyPalette() only works with 256 colors or less");let n=new Uint32Array(t.buffer),r=n.length,o=i==="rgb444"?4096:65536,f=new Uint8Array(r),l=new Array(o),x=i==="rgba4444";if(i==="rgba4444")for(let a=0;a<r;a++){let s=n[a],c=s>>24&255,g=s>>16&255,p=s>>8&255,b=s&255,d=G(b,p,g,c),_=d in l?l[d]:l[d]=yt(b,p,g,c,e);f[a]=_}else{let a=i==="rgb444"?R:D;for(let s=0;s<r;s++){let c=n[s],g=c>>16&255,p=c>>8&255,b=c&255,d=a(b,p,g),_=d in l?l[d]:l[d]=Bt(b,p,g,e);f[s]=_}}return f}function yt(t,e,i,n,r){let o=0,f=1e100;for(let l=0;l<r.length;l++){let x=r[l],a=x[3],s=z(a-n);if(s>f)continue;let c=x[0];if(s+=z(c-t),s>f)continue;let g=x[1];if(s+=z(g-e),s>f)continue;let p=x[2];s+=z(p-i),!(s>f)&&(f=s,o=l)}return o}function Bt(t,e,i,n){let r=0,o=1e100;for(let f=0;f<n.length;f++){let l=n[f],x=l[0],a=z(x-t);if(a>o)continue;let s=l[1];if(a+=z(s-e),a>o)continue;let c=l[2];a+=z(c-i),!(a>o)&&(o=a,r=f)}return r}function ot(t,e,i=5){if(!t.length||!e.length)return;let n=t.map(f=>f.slice(0,3)),r=i*i,o=t[0].length;for(let f=0;f<e.length;f++){let l=e[f];l.length<o?l=[l[0],l[1],l[2],255]:l.length>o?l=l.slice(0,3):l=l.slice();let x=Z(n,l.slice(0,3),E),a=x[0],s=x[1];s>0&&s<=r&&(t[a]=l)}}function z(t){return t*t}function W(t,e,i=E){let n=1/0,r=-1;for(let o=0;o<t.length;o++){let f=t[o],l=i(e,f);l<n&&(n=l,r=o)}return r}function Z(t,e,i=E){let n=1/0,r=-1;for(let o=0;o<t.length;o++){let f=t[o],l=i(e,f);l<n&&(n=l,r=o)}return[r,n]}function it(t,e,i=E){return t[W(t,e,i)]}function ct(t={}){let{initialCapacity:e=4096,auto:i=!0}=t,n=U(e),r=5003,o=new Uint8Array(256),f=new Int32Array(r),l=new Int32Array(r),x=!1;return{reset(){n.reset(),x=!1},finish(){n.writeByte(J.trailer)},bytes(){return n.bytes()},bytesView(){return n.bytesView()},get buffer(){return n.buffer},get stream(){return n},writeHeader:a,writeFrame(s,c,g,p={}){let{transparent:b=!1,transparentIndex:d=0,delay:_=0,palette:u=null,repeat:v=0,colorDepth:B=8,dispose:h=-1}=p,A=!1;if(i?x||(A=!0,a(),x=!0):A=!!p.first,c=Math.max(0,Math.floor(c)),g=Math.max(0,Math.floor(g)),A){if(!u)throw new Error("First frame must include a { palette } option");At(n,c,g,u,B),ft(n,u),v>=0&&Mt(n,v)}let F=Math.round(_/10);_t(n,h,F,b,d);let w=!!u&&!A;It(n,c,g,w?u:null),w&&ft(n,u),Ct(n,s,c,g,B,o,f,l)}};function a(){lt(n,"GIF89a")}}function _t(t,e,i,n,r){t.writeByte(33),t.writeByte(249),t.writeByte(4),r<0&&(r=0,n=!1);var o,f;n?(o=1,f=2):(o=0,f=0),e>=0&&(f=e&7),f<<=2,t.writeByte(0|f|0|o),S(t,i),t.writeByte(r||0),t.writeByte(0)}function At(t,e,i,n,r=8){let l=K(n.length)-1,x=128|r-1<<4|0|l,a=0,s=0;S(t,e),S(t,i),t.writeBytes([x,a,s])}function Mt(t,e){t.writeByte(33),t.writeByte(255),t.writeByte(11),lt(t,"NETSCAPE2.0"),t.writeByte(3),t.writeByte(1),S(t,e),t.writeByte(0)}function ft(t,e){let i=1<<K(e.length);for(let n=0;n<i;n++){let r=[0,0,0];n<e.length&&(r=e[n]),t.writeByte(r[0]),t.writeByte(r[1]),t.writeByte(r[2])}}function It(t,e,i,n){if(t.writeByte(44),S(t,0),S(t,0),S(t,e),S(t,i),n){let f=K(n.length)-1;t.writeByte(128|f)}else t.writeByte(0)}function Ct(t,e,i,n,r=8,o,f,l){tt(i,n,e,r,t,o,f,l)}function S(t,e){t.writeByte(e&255),t.writeByte(e>>8&255)}function lt(t,e){for(var i=0;i<e.length;i++)t.writeByte(e.charCodeAt(i))}function K(t){return Math.max(Math.ceil(Math.log2(t)),1)}var vt=ct;return bt(kt);})();
/* eslint-enable */

/*
 * Vencord - Expression Picker Enhanced
 *
 * Adds a top-left resize handle to Discord's expression picker
 * (GIF / stickers / emoji), remembers its height, imports local GIFs and
 * keeps the last opened category.
 *
 * Width is persisted by Discord itself (expressionPickerWidth).
 * Height is stored in %LOCALAPPDATA%\VencordPickerResize\size.json.
 *
 * Loaded in the renderer main world by a small loader appended to
 * Vencord's preload.js. The loader also exposes VencordPickerResize
 * so the saved height is known before the picker is created (no flash).
 *
 * Architecture note: this is intentionally a single injected file because
 * the preload loader executes one script in the page world. Everything lives
 * in one IIFE so the resize and import features can share:
 *   - one host/install guard and one test hook;
 *   - DOM selectors, style injection and activation helpers;
 *   - localization, clamping and logging utilities;
 *   - a single maintenance timer instead of one timer per feature.
 * The bundled `gifenc` block at the top is vendored and minified; do not
 * reformat or edit it directly.
 */
(() => {
    "use strict";

    // Allow an empty hostname (preload can run before navigation) but
    // don't run in the Monaco editor window or other remote pages.
    const isDiscordHost = !location.hostname || /(^|\.)discord\.com$/i.test(location.hostname);
    if (!isDiscordHost) return;

    // Both features used to be separate IIFEs. They now live in a single
    // bootstrap so they can share utilities, constants and a single timer.
    const INSTALL_FLAG = "__vcExpressionPickerResizeInstalled";
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;
    // Kept for compatibility with the previous split-module version and its
    // diagnostics/tests; the single bootstrap guard is INSTALL_FLAG above.
    window.__vcPickerImportInstalled = true;

    // The Node test suite sets this object to load the helpers without
    // starting any observer, timer or DOM mutation.
    const TEST_HOOK = window.__VC_PICKER_RESIZE_TEST__ ?? null;

    const MIN_WIDTH = 498;
    const MIN_HEIGHT = 320;
    const MAX_HEIGHT = 5000;
    const TOP_MARGIN = 60;
    const HANDLE_CLASS = "vc-picker-resize";
    const STYLE_ID = "vc-picker-resize-style";
    const VARS_STYLE_ID = "vc-picker-resize-vars";
    const IMPORT_STYLE_ID = "vc-picker-import-style";
    const HEIGHT_VAR = "--vc-picker-saved-height";
    const SETTINGS_KEY = "vcExpressionPickerSize";

    /** All UI/delivery timings in one place, in milliseconds. */
    const TIMINGS = Object.freeze({
        maintain: 250,
        styleRetry: 250,
        gifReveal: 10000,
        layerLookup: 2000,
        status: 3500,
        favoriteRefresh: 350,
        importError: 1300,
        restoreWindow: 5000,
        videoMetadata: 15000,
        videoSeek: 7000,
        composerFocusRetry: 50,
        startRetry: 50
    });

    const ATTEMPTS = Object.freeze({
        styleRetry: 20,
        composerFocus: 12,
        startRetry: 100
    });

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const round = (value) => Math.round(value);

    const LOG_PREFIX = "[ExpressionPickerEnhanced]";

    /** Selectors for Discord internals. Keep every hashed class in one place. */
    const SELECTORS = Object.freeze({
        pickerLayer: '[class*="expressionPickerPositionLayer"]',
        drawer: '[class*="drawerSizingWrapper"]',
        gifPanelId: "gif-picker-tab-panel",
        nativeBackButton: ".backButton_fed6d3",
        favoritesHeader: '[class*="favoritesHeader"]',
        rootCards: '.content_fed6d3 .result__2dc39[role="button"]',
        rootCardClass: "result__2dc39",
        categoryLabel: '[class*="categoryText"], [class*="categoryName"]',
        searchInput: 'input[role="searchbox"]',
        clearButton: '[class*="clearButton"]',
        slateEditor: '[data-slate-editor="true"]'
    });
    const DRAWER_SELECTOR = `${SELECTORS.pickerLayer} ${SELECTORS.drawer}`;

    const ROOT_VIEWS = new Set(["root", "favorites", "imports"]);

    function getVencord() {
        try {
            return window.Vencord ?? null;
        } catch {
            return null;
        }
    }

    function getWebpack() {
        return getVencord()?.Webpack ?? null;
    }

    function getWebpackCommon() {
        return getWebpack()?.Common ?? null;
    }

    /**
     * Resolves a Discord module defensively. Discord's internals change
     * between releases, so every call site must tolerate a missing module.
     */
    function findByProps(...properties) {
        try {
            return getWebpack()?.findByProps?.(...properties) ?? null;
        } catch {
            return null;
        }
    }

    /** Returns a normalized pathname for a Discord media URL, or null. */
    function toPathname(src) {
        try {
            return new URL(src, location.href).pathname.toLowerCase();
        } catch {
            return null;
        }
    }

    function hasFavoritesView(root) {
        return !!root?.querySelector?.(SELECTORS.favoritesHeader);
    }

    function injectStyle(id, css) {
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement("style");
            style.id = id;
            (document.head || document.documentElement).appendChild(style);
        }
        if (style.textContent !== css) style.textContent = css;
        return style;
    }

    /** Keyboard support for non-button elements with role="button". */
    function addActivationHandler(element, handler) {
        element.addEventListener("click", handler);
        element.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") handler(event);
        });
    }

    function createIconAction({ className, label, icon, onActivate }) {
        const element = document.createElement("div");
        element.className = className;
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-label", label);
        element.innerHTML = icon;
        addActivationHandler(element, onActivate);
        return element;
    }

    const STATIC_CSS = `
/* --- Large expression picker ------------------------------------------- */
[class*="expressionPickerPositionLayer"] [class*="positionContainer__"] {
    width: calc(100% - 24px) !important;
    height: auto !important;
}

html body [class*="expressionPickerPositionLayer"] [class*="drawerSizingWrapper"] {
    position: relative !important;
    inset-inline-end: auto !important;
    margin-inline-start: auto !important;
    margin-inline-end: 0 !important;

    height: var(${HEIGHT_VAR}, min(80vh, 920px));
    min-height: ${MIN_HEIGHT}px;
    max-height: calc(100vh - ${TOP_MARGIN * 2}px);
}

/* --- Discord's native left-edge width handle: hidden ------------------- */
[class*="expressionPickerPositionLayer"] [class*="resizeHandle__"] {
    display: none !important;
}

/* --- GIF tiles: avoid the blue loading state, fade in when ready -------- */
#gif-picker-tab-panel [class*="result__"] {
    background-color: var(--background-mod-subtle) !important;
}

#gif-picker-tab-panel [class*="placeholder__"] {
    background: transparent !important;
}

#gif-picker-tab-panel [class*="gif__"] {
    transition: opacity 0.15s ease;
}

#gif-picker-tab-panel [class*="gif__"]:not(.vc-gif-ready) {
    opacity: 0;
}

/* --- Minimal top-left resize grip (inside the panel) ------------------- */
.${HANDLE_CLASS} {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: 20;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 12px;
    height: 12px;
    border-radius: 3px;
    border: none;
    background: transparent;
    box-shadow: none;
    color: var(--interactive-text-default);

    cursor: nwse-resize;
    opacity: 0.35;
    touch-action: none;
    user-select: none;
    transition: opacity 0.15s, background-color 0.15s, color 0.15s;
}

.${HANDLE_CLASS}:hover,
.${HANDLE_CLASS}.active,
.${HANDLE_CLASS}:focus-visible {
    opacity: 1;
    background: var(--background-mod-subtle);
    color: var(--interactive-text-hover);
}

.${HANDLE_CLASS}:focus-visible {
    outline: 2px solid var(--focus-primary, var(--brand-500));
    outline-offset: 2px;
}

.${HANDLE_CLASS} svg {
    width: 9px;
    height: 9px;
    pointer-events: none;
}
`;

    function getApi() {
        try {
            return window.VencordPickerResize ?? null;
        } catch {
            return null;
        }
    }

    function getSettings() {
        try {
            return getVencord()?.Settings ?? null;
        } catch {
            return null;
        }
    }

    /** Returns the persisted height, clamped, or null when none exists. */
    function loadSavedHeight() {
        try {
            const api = getApi();
            if (api && Number.isFinite(api.savedHeight)) {
                return clamp(api.savedHeight, MIN_HEIGHT, MAX_HEIGHT);
            }

            const value = getSettings()?.[SETTINGS_KEY];
            const height = Number(value?.height);
            return Number.isFinite(height) ? clamp(height, MIN_HEIGHT, MAX_HEIGHT) : null;
        } catch {
            return null;
        }
    }

    /** Persists the height through the preload bridge and Vencord settings. */
    function saveHeight(height) {
        if (!Number.isFinite(height)) return;
        const value = round(clamp(height, MIN_HEIGHT, MAX_HEIGHT));

        const api = getApi();
        if (api?.saveHeight) {
            try {
                api.saveHeight(value);
            } catch (error) {
                console.error(`${LOG_PREFIX} Failed to save height`, error);
            }
        }

        // Keep a copy in Vencord's settings as a fallback.
        try {
            const settings = getSettings();
            if (settings) {
                settings[SETTINGS_KEY] = {
                    ...(settings[SETTINGS_KEY] ?? {}),
                    height: value
                };
            }
        } catch {
            /* Vencord settings may be read-only or unavailable. */
        }
    }

    let cachedSettingsSetter = null;

    function setDiscordWidth(width) {
        if (!Number.isFinite(width)) return;
        try {
            if (!cachedSettingsSetter) {
                cachedSettingsSetter = findByProps("updatedUnsyncedSettings");
            }
            cachedSettingsSetter?.updatedUnsyncedSettings({ expressionPickerWidth: round(width) });
        } catch {
            // Discord internals changed - retry discovery on the next resize.
            cachedSettingsSetter = null;
        }
    }

    function ensureStyleTag() {
        return injectStyle(STYLE_ID, STATIC_CSS);
    }

    function applySavedHeight(height) {
        if (!Number.isFinite(height)) return;
        ensureStyleTag();

        // Use a stylesheet rule instead of an inline style on <html>: Discord
        // rewrites the <html> style attribute during startup, which would
        // otherwise wipe the variable and bring the resize flash back.
        // Set this before the picker exists so its very first paint already
        // uses the remembered height (no visible resize flash).
        injectStyle(VARS_STYLE_ID, `:root { ${HEIGHT_VAR}: ${round(height)}px; }`);
    }

    let savedHeight = loadSavedHeight();

    function initStyle() {
        ensureStyleTag();
        if (savedHeight) applySavedHeight(savedHeight);
    }

    if (!TEST_HOOK) {
        if (document.documentElement) {
            initStyle();
        } else {
            const observer = new MutationObserver(() => {
                if (!document.documentElement) return;
                observer.disconnect();
                initStyle();
            });
            observer.observe(document, { childList: true, subtree: true });
        }

        // Vencord may not be initialised yet when this script starts; retry briefly.
        let attempts = 0;
        const styleRetry = setInterval(() => {
            if (savedHeight) {
                initStyle();
                clearInterval(styleRetry);
                return;
            }

            const height = loadSavedHeight();
            if (height) {
                savedHeight = height;
                initStyle();
                clearInterval(styleRetry);
                return;
            }

            if (++attempts > ATTEMPTS.styleRetry) clearInterval(styleRetry);
        }, TIMINGS.styleRetry);
    }

    let gifPanelObserver = null;
    let gifPanelEl = null;

    function markGifMedia(media) {
        if (!media || media.__vcGifMarked) return;
        media.__vcGifMarked = true;

        let revealTimer = 0;
        const reveal = () => {
            if (media.__vcGifReady) return;
            clearTimeout(revealTimer);
            media.__vcGifReady = true;
            media.classList.add("vc-gif-ready");
        };

        if (media.tagName === "IMG") {
            if (media.complete && media.naturalWidth > 0) {
                reveal();
            } else {
                media.addEventListener("load", reveal, { once: true });
                media.addEventListener("error", reveal, { once: true });
            }
        } else if (media.readyState >= 2) {
            reveal();
        } else {
            media.addEventListener("loadeddata", reveal, { once: true });
            media.addEventListener("playing", reveal, { once: true });
            media.addEventListener("canplay", reveal, { once: true });
            media.addEventListener("error", reveal, { once: true });
        }

        // Never leave a tile invisible forever if the media never loads.
        if (!media.__vcGifReady) {
            revealTimer = setTimeout(reveal, TIMINGS.gifReveal);
        }
    }

    function markGifMediaIn(root) {
        if (!root || root.nodeType !== 1) return;
        if (root.matches?.('[class*="gif__"]')) markGifMedia(root);
        root.querySelectorAll?.('[class*="gif__"]').forEach(markGifMedia);
    }

    function setupGifObserver() {
        if (gifPanelEl && !gifPanelEl.isConnected) {
            gifPanelObserver?.disconnect();
            gifPanelObserver = null;
            gifPanelEl = null;
        }

        const panel = findPanel();
        if (!panel || panel === gifPanelEl) return;

        gifPanelObserver?.disconnect();
        gifPanelEl = panel;

        gifPanelObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    markGifMediaIn(node);
                }
            }
        });
        gifPanelObserver.observe(panel, { childList: true, subtree: true });
        markGifMediaIn(panel);
    }

    function createHandle() {
        const handle = document.createElement("div");
        handle.className = HANDLE_CLASS;
        handle.title = t("resizeHandle");
        handle.setAttribute("role", "button");
        handle.setAttribute("tabindex", "0");
        handle.setAttribute("aria-label", t("resizeHandleLabel"));
        handle.innerHTML = `
            <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                <path d="M3.25 3.25 16.75 16.75M3.25 9.25v-6h6M16.75 10.75v6h-6"
                    fill="none" stroke="currentColor" stroke-width="1.7"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

        // Keep Discord's "click outside to close" handler from firing.
        handle.addEventListener("mousedown", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });

        return handle;
    }

    /** Adds the resize grip to a picker drawer once and restores its height. */
    function initDrawer(drawer) {
        if (!drawer || drawer.__vcPickerResize) return;
        drawer.__vcPickerResize = true;

        if (!savedHeight) {
            savedHeight = loadSavedHeight();
        }
        if (savedHeight) {
            applySavedHeight(savedHeight);
            drawer.style.height = `${savedHeight}px`;
        }

        const handle = createHandle();
        drawer.appendChild(handle);
        setupGifObserver();

        let drag = null;

        const getSizeBounds = () => {
            const rect = drawer.getBoundingClientRect();
            const parentRect = drawer.parentElement?.getBoundingClientRect() ?? rect;
            return {
                rect,
                maxWidth: Math.max(MIN_WIDTH, parentRect.width),
                maxHeight: Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, rect.bottom - TOP_MARGIN))
            };
        };

        const applyDrawerSize = (width, height) => {
            drawer.style.width = `${round(width)}px`;
            drawer.style.height = `${round(height)}px`;
        };

        const persistSize = (width, height) => {
            savedHeight = round(height);
            // Update the CSS variable so the next opening has the right size
            // from its first paint.
            applySavedHeight(savedHeight);
            saveHeight(savedHeight);
            setDiscordWidth(width);
        };

        handle.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.stopPropagation();

            const { rect, maxWidth, maxHeight } = getSizeBounds();

            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startWidth: rect.width,
                startHeight: rect.height,
                maxWidth,
                maxHeight
            };

            handle.classList.add("active");
            try {
                handle.setPointerCapture(event.pointerId);
            } catch {
                /* ignore */
            }
        });

        handle.addEventListener("pointermove", (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            event.preventDefault();

            // The picker is anchored bottom-right: dragging left/up enlarges it.
            const width = clamp(drag.startWidth + (drag.startX - event.clientX), MIN_WIDTH, drag.maxWidth);
            const height = clamp(drag.startHeight + (drag.startY - event.clientY), MIN_HEIGHT, drag.maxHeight);

            applyDrawerSize(width, height);
        });

        const finishDrag = (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;

            drag = null;
            handle.classList.remove("active");
            try {
                handle.releasePointerCapture(event.pointerId);
            } catch {
                /* ignore */
            }

            const rect = drawer.getBoundingClientRect();
            persistSize(rect.width, rect.height);
        };

        handle.addEventListener("pointerup", finishDrag);
        handle.addEventListener("pointercancel", finishDrag);

        // Arrow keys provide the same resize affordance without a pointer.
        handle.addEventListener("keydown", (event) => {
            const step = event.shiftKey ? 32 : 8;
            let deltaWidth = 0;
            let deltaHeight = 0;
            if (event.key === "ArrowLeft") deltaWidth = step;
            else if (event.key === "ArrowRight") deltaWidth = -step;
            else if (event.key === "ArrowUp") deltaHeight = step;
            else if (event.key === "ArrowDown") deltaHeight = -step;
            else return;

            event.preventDefault();
            const { rect, maxWidth, maxHeight } = getSizeBounds();
            const width = clamp(rect.width + deltaWidth, MIN_WIDTH, maxWidth);
            const height = clamp(rect.height + deltaHeight, MIN_HEIGHT, maxHeight);
            applyDrawerSize(width, height);
            persistSize(width, height);
        });
    }

    function initFromLayer(layer) {
        const drawer = layer.querySelector?.(SELECTORS.drawer);
        if (drawer) {
            initDrawer(drawer);
            return;
        }

        const observer = new MutationObserver(() => {
            const found = layer.querySelector?.(SELECTORS.drawer);
            if (!found) return;
            clearTimeout(timeout);
            observer.disconnect();
            initDrawer(found);
        });
        const timeout = setTimeout(() => observer.disconnect(), TIMINGS.layerLookup);
        observer.observe(layer, { childList: true, subtree: true });
    }

    function startPickerObserver() {
        if (!document.body) return false;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches?.(SELECTORS.pickerLayer)) initFromLayer(node);
                    node.querySelectorAll?.(SELECTORS.pickerLayer).forEach(initFromLayer);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return true;
    }

    /*
     * Local GIF imports
     * Adds an import button to the GIF page, converts files to GIF and
     * shows them in a dedicated "Imported" category of the GIF picker.
     *
     * This part intentionally shares the outer IIFE with the resize feature:
     * the whole module is injected as one script, so a single scope avoids
     * duplicated guards, helpers and polling timers.
     */

    const DB_NAME = "VencordPickerResize";
    const DB_VERSION = 1;
    const STORE = "gifs";

    const MAX_INPUT_BYTES = 100 * 1024 * 1024;
    const MAX_OUTPUT_BYTES = 8 * 1024 * 1024;
    const MAX_DIMENSION = 480;
    const MAX_DURATION = 6;
    const FPS = 10;
    const MAX_VIDEO_FRAMES = 60;
    const MAX_IMAGE_FRAMES = 120;
    const UPLOAD_PLATFORM_WEB = 1;
    const DRAFT_TYPE_CHANNEL_MESSAGE = 0;
    const GIF_EXTENSIONS = [".gif"];
    const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".apng", ".bmp"];
    const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv", ".m4v"];
    const IMAGE_MIME_TYPES = [
        "image/gif",
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/avif",
        "image/apng",
        "image/bmp"
    ];
    const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
    const ACCEPT = [
        ...GIF_EXTENSIONS,
        ...IMAGE_EXTENSIONS,
        ...IMAGE_MIME_TYPES,
        ...VIDEO_EXTENSIONS,
        ...VIDEO_MIME_TYPES
    ].join(",");

    const MESSAGES = {
        en: {
            categoryName: "Imported",
            importButton: "Import GIFs",
            resizeHandle: "Resize picker",
            resizeHandleLabel: "Resize the expression picker",
            importTile: "Import",
            searchPlaceholder: "Search imported",
            back: "Back",
            clear: "Clear",
            addToMessage: "Add {name} to message",
            deleteImport: "Delete {name}",
            deleteCompletely: "Delete this imported GIF completely",
            addFavorite: "Add to favorites",
            removeFavorite: "Remove from favorites",
            countGifs: { one: "{count} GIF", other: "{count} GIFs" },
            countResults: { one: "{count} result", other: "{count} results" },
            emptyImports: "No imported GIFs yet",
            noResults: "No results for “{query}”",
            converting: "Converting {current}/{total}: {name}",
            importedCount: { one: "{count} GIF imported", other: "{count} GIFs imported" },
            noneImported: "No GIF imported",
            attachFailed: "Could not attach the GIF",
            attached: "GIF attached to the message",
            deleted: "Imported GIF deleted",
            deletedWithFavorite: "GIF and favorite deleted",
            favoriteRemoved: "GIF removed from favorites",
            favoriteNeedsSend: "Send this GIF once before adding it to favorites",
            favoriteFailed: "Could not update favorites",
            deleteFailed: "Could not delete the GIF",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "conversion failed",
            fileTooLarge: "file too large (max 100 MB)",
            gifTooLarge: "GIF too large (max 8 MB)",
            convertedTooLarge: "converted GIF too large (max 8 MB)",
            unsupportedFormat: "unsupported format",
            noFrames: "no frame could be decoded",
            videoReadTimeout: "video loading timed out",
            videoUnsupported: "unsupported video format",
            invalidVideoDimensions: "invalid video dimensions",
            videoConvertTimeout: "video conversion timed out",
            imageUnreadable: "unreadable image"
        },
        fr: {
            categoryName: "Importés",
            importButton: "Importer des GIF",
            resizeHandle: "Redimensionner",
            resizeHandleLabel: "Redimensionner la fenêtre",
            importTile: "Importer",
            searchPlaceholder: "Rechercher dans les importés",
            back: "Retour",
            clear: "Effacer",
            addToMessage: "Ajouter {name} au message",
            deleteImport: "Supprimer {name}",
            deleteCompletely: "Supprimer complètement ce GIF importé",
            addFavorite: "Ajouter aux favoris",
            removeFavorite: "Retirer des favoris",
            countGifs: { one: "{count} GIF", other: "{count} GIFs" },
            countResults: { one: "{count} résultat", other: "{count} résultats" },
            emptyImports: "Aucun GIF importé pour le moment",
            noResults: "Aucun résultat pour « {query} »",
            converting: "Conversion {current}/{total} : {name}",
            importedCount: { one: "{count} GIF importé", other: "{count} GIFs importés" },
            noneImported: "Aucun GIF importé",
            attachFailed: "Impossible de joindre le GIF",
            attached: "GIF joint au message",
            deleted: "GIF importé supprimé",
            deletedWithFavorite: "GIF et favori supprimés",
            favoriteRemoved: "GIF retiré des favoris",
            favoriteNeedsSend: "Envoie d'abord ce GIF pour le mettre en favori",
            favoriteFailed: "Impossible de modifier les favoris",
            deleteFailed: "Impossible de supprimer le GIF",
            conversionFailed: "{name} : {message}",
            conversionFailedGeneric: "échec de la conversion",
            fileTooLarge: "fichier trop volumineux (max 100 Mo)",
            gifTooLarge: "GIF trop lourd (max 8 Mo)",
            convertedTooLarge: "GIF converti trop lourd (max 8 Mo)",
            unsupportedFormat: "format non pris en charge",
            noFrames: "aucune image décodée",
            videoReadTimeout: "délai de lecture vidéo dépassé",
            videoUnsupported: "format vidéo non pris en charge",
            invalidVideoDimensions: "dimensions vidéo invalides",
            videoConvertTimeout: "délai de conversion vidéo dépassé",
            imageUnreadable: "image illisible"
        },
        es: {
            categoryName: "Importados",
            importButton: "Importar GIF",
            resizeHandle: "Cambiar tamaño",
            resizeHandleLabel: "Cambiar el tamaño del selector",
            importTile: "Importar",
            searchPlaceholder: "Buscar en los importados",
            back: "Atrás",
            clear: "Borrar",
            addToMessage: "Añadir {name} al mensaje",
            deleteImport: "Eliminar {name}",
            deleteCompletely: "Eliminar completamente este GIF importado",
            addFavorite: "Añadir a favoritos",
            removeFavorite: "Quitar de favoritos",
            countGifs: { one: "{count} GIF", other: "{count} GIFs" },
            countResults: { one: "{count} resultado", other: "{count} resultados" },
            emptyImports: "Aún no hay GIF importados",
            noResults: "No hay resultados para «{query}»",
            converting: "Convirtiendo {current}/{total}: {name}",
            importedCount: { one: "{count} GIF importado", other: "{count} GIFs importados" },
            noneImported: "No se importó ningún GIF",
            attachFailed: "No se pudo adjuntar el GIF",
            attached: "GIF adjunto al mensaje",
            deleted: "GIF importado eliminado",
            deletedWithFavorite: "GIF y favorito eliminados",
            favoriteRemoved: "GIF eliminado de favoritos",
            favoriteNeedsSend: "Envía este GIF una vez antes de añadirlo a favoritos",
            favoriteFailed: "No se pudieron modificar los favoritos",
            deleteFailed: "No se pudo eliminar el GIF",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "error de conversión",
            fileTooLarge: "archivo demasiado grande (máx. 100 MB)",
            gifTooLarge: "GIF demasiado grande (máx. 8 MB)",
            convertedTooLarge: "GIF convertido demasiado grande (máx. 8 MB)",
            unsupportedFormat: "formato no compatible",
            noFrames: "no se pudo decodificar ningún fotograma",
            videoReadTimeout: "se agotó el tiempo de carga del vídeo",
            videoUnsupported: "formato de vídeo no compatible",
            invalidVideoDimensions: "dimensiones de vídeo no válidas",
            videoConvertTimeout: "se agotó el tiempo de conversión del vídeo",
            imageUnreadable: "imagen ilegible"
        },
        de: {
            categoryName: "Importiert",
            importButton: "GIFs importieren",
            resizeHandle: "Größe ändern",
            resizeHandleLabel: "Größe des Auswahlfensters ändern",
            importTile: "Importieren",
            searchPlaceholder: "Importierte durchsuchen",
            back: "Zurück",
            clear: "Löschen",
            addToMessage: "„{name}“ zur Nachricht hinzufügen",
            deleteImport: "„{name}“ löschen",
            deleteCompletely: "Dieses importierte GIF vollständig löschen",
            addFavorite: "Zu Favoriten hinzufügen",
            removeFavorite: "Aus Favoriten entfernen",
            countGifs: { one: "{count} GIF", other: "{count} GIFs" },
            countResults: { one: "{count} Ergebnis", other: "{count} Ergebnisse" },
            emptyImports: "Noch keine importierten GIFs",
            noResults: "Keine Ergebnisse für „{query}“",
            converting: "Konvertiere {current}/{total}: {name}",
            importedCount: { one: "{count} GIF importiert", other: "{count} GIFs importiert" },
            noneImported: "Kein GIF importiert",
            attachFailed: "GIF konnte nicht angehängt werden",
            attached: "GIF an die Nachricht angehängt",
            deleted: "Importiertes GIF gelöscht",
            deletedWithFavorite: "GIF und Favorit gelöscht",
            favoriteRemoved: "GIF aus Favoriten entfernt",
            favoriteNeedsSend: "Sende dieses GIF zuerst, bevor du es zu Favoriten hinzufügst",
            favoriteFailed: "Favoriten konnten nicht geändert werden",
            deleteFailed: "GIF konnte nicht gelöscht werden",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "Konvertierung fehlgeschlagen",
            fileTooLarge: "Datei zu groß (max. 100 MB)",
            gifTooLarge: "GIF zu groß (max. 8 MB)",
            convertedTooLarge: "Konvertiertes GIF zu groß (max. 8 MB)",
            unsupportedFormat: "nicht unterstütztes Format",
            noFrames: "kein Bild konnte dekodiert werden",
            videoReadTimeout: "Zeitüberschreitung beim Laden des Videos",
            videoUnsupported: "nicht unterstütztes Videoformat",
            invalidVideoDimensions: "ungültige Videomaße",
            videoConvertTimeout: "Zeitüberschreitung bei der Videokonvertierung",
            imageUnreadable: "Bild nicht lesbar"
        },
        it: {
            categoryName: "Importati",
            importButton: "Importa GIF",
            resizeHandle: "Ridimensiona",
            resizeHandleLabel: "Ridimensiona la finestra",
            importTile: "Importa",
            searchPlaceholder: "Cerca negli importati",
            back: "Indietro",
            clear: "Cancella",
            addToMessage: "Aggiungi {name} al messaggio",
            deleteImport: "Elimina {name}",
            deleteCompletely: "Elimina completamente questo GIF importato",
            addFavorite: "Aggiungi ai preferiti",
            removeFavorite: "Rimuovi dai preferiti",
            countGifs: { one: "{count} GIF", other: "{count} GIF" },
            countResults: { one: "{count} risultato", other: "{count} risultati" },
            emptyImports: "Nessun GIF importato per ora",
            noResults: "Nessun risultato per «{query}»",
            converting: "Conversione {current}/{total}: {name}",
            importedCount: { one: "{count} GIF importato", other: "{count} GIF importati" },
            noneImported: "Nessun GIF importato",
            attachFailed: "Impossibile allegare il GIF",
            attached: "GIF allegato al messaggio",
            deleted: "GIF importato eliminato",
            deletedWithFavorite: "GIF e preferito eliminati",
            favoriteRemoved: "GIF rimosso dai preferiti",
            favoriteNeedsSend: "Invia prima questo GIF per aggiungerlo ai preferiti",
            favoriteFailed: "Impossibile modificare i preferiti",
            deleteFailed: "Impossibile eliminare il GIF",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "conversione non riuscita",
            fileTooLarge: "file troppo grande (max 100 MB)",
            gifTooLarge: "GIF troppo grande (max 8 MB)",
            convertedTooLarge: "GIF convertito troppo grande (max 8 MB)",
            unsupportedFormat: "formato non supportato",
            noFrames: "nessun fotogramma decodificato",
            videoReadTimeout: "timeout durante il caricamento del video",
            videoUnsupported: "formato video non supportato",
            invalidVideoDimensions: "dimensioni video non valide",
            videoConvertTimeout: "timeout durante la conversione del video",
            imageUnreadable: "immagine illeggibile"
        },
        pt: {
            categoryName: "Importados",
            importButton: "Importar GIFs",
            resizeHandle: "Redimensionar",
            resizeHandleLabel: "Redimensionar a janela",
            importTile: "Importar",
            searchPlaceholder: "Pesquisar nos importados",
            back: "Voltar",
            clear: "Limpar",
            addToMessage: "Adicionar {name} à mensagem",
            deleteImport: "Excluir {name}",
            deleteCompletely: "Excluir completamente este GIF importado",
            addFavorite: "Adicionar aos favoritos",
            removeFavorite: "Remover dos favoritos",
            countGifs: { one: "{count} GIF", other: "{count} GIFs" },
            countResults: { one: "{count} resultado", other: "{count} resultados" },
            emptyImports: "Nenhum GIF importado ainda",
            noResults: "Nenhum resultado para “{query}”",
            converting: "Convertendo {current}/{total}: {name}",
            importedCount: { one: "{count} GIF importado", other: "{count} GIFs importados" },
            noneImported: "Nenhum GIF importado",
            attachFailed: "Não foi possível anexar o GIF",
            attached: "GIF anexado à mensagem",
            deleted: "GIF importado excluído",
            deletedWithFavorite: "GIF e favorito excluídos",
            favoriteRemoved: "GIF removido dos favoritos",
            favoriteNeedsSend: "Envie este GIF uma vez antes de adicioná-lo aos favoritos",
            favoriteFailed: "Não foi possível alterar os favoritos",
            deleteFailed: "Não foi possível excluir o GIF",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "falha na conversão",
            fileTooLarge: "arquivo muito grande (máx. 100 MB)",
            gifTooLarge: "GIF muito grande (máx. 8 MB)",
            convertedTooLarge: "GIF convertido muito grande (máx. 8 MB)",
            unsupportedFormat: "formato não suportado",
            noFrames: "nenhum quadro pôde ser decodificado",
            videoReadTimeout: "tempo limite ao carregar o vídeo",
            videoUnsupported: "formato de vídeo não suportado",
            invalidVideoDimensions: "dimensões de vídeo inválidas",
            videoConvertTimeout: "tempo limite na conversão do vídeo",
            imageUnreadable: "imagem ilegível"
        },
        nl: {
            categoryName: "Geïmporteerd",
            importButton: "GIF's importeren",
            resizeHandle: "Formaat wijzigen",
            resizeHandleLabel: "Formaat van het venster wijzigen",
            importTile: "Importeren",
            searchPlaceholder: "Geïmporteerde GIF's zoeken",
            back: "Terug",
            clear: "Wissen",
            addToMessage: "{name} aan bericht toevoegen",
            deleteImport: "{name} verwijderen",
            deleteCompletely: "Dit geïmporteerde GIF volledig verwijderen",
            addFavorite: "Aan favorieten toevoegen",
            removeFavorite: "Uit favorieten verwijderen",
            countGifs: { one: "{count} GIF", other: "{count} GIF's" },
            countResults: { one: "{count} resultaat", other: "{count} resultaten" },
            emptyImports: "Nog geen geïmporteerde GIF's",
            noResults: "Geen resultaten voor ‘{query}’",
            converting: "{current}/{total} converteren: {name}",
            importedCount: { one: "{count} GIF geïmporteerd", other: "{count} GIF's geïmporteerd" },
            noneImported: "Geen GIF geïmporteerd",
            attachFailed: "Kan het GIF niet toevoegen",
            attached: "GIF aan bericht toegevoegd",
            deleted: "Geïmporteerd GIF verwijderd",
            deletedWithFavorite: "GIF en favoriet verwijderd",
            favoriteRemoved: "GIF uit favorieten verwijderd",
            favoriteNeedsSend: "Verstuur dit GIF eerst voordat je het aan favorieten toevoegt",
            favoriteFailed: "Kan favorieten niet aanpassen",
            deleteFailed: "Kan het GIF niet verwijderen",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "conversie mislukt",
            fileTooLarge: "bestand te groot (max. 100 MB)",
            gifTooLarge: "GIF te groot (max. 8 MB)",
            convertedTooLarge: "geconverteerd GIF te groot (max. 8 MB)",
            unsupportedFormat: "niet-ondersteund formaat",
            noFrames: "geen frame gedecodeerd",
            videoReadTimeout: "time-out bij laden van video",
            videoUnsupported: "niet-ondersteund videoformaat",
            invalidVideoDimensions: "ongeldige videoafmetingen",
            videoConvertTimeout: "time-out bij videoconversie",
            imageUnreadable: "afbeelding onleesbaar"
        },
        pl: {
            categoryName: "Zaimportowane",
            importButton: "Importuj GIF-y",
            resizeHandle: "Zmień rozmiar",
            resizeHandleLabel: "Zmień rozmiar okna",
            importTile: "Importuj",
            searchPlaceholder: "Szukaj w zaimportowanych",
            back: "Wstecz",
            clear: "Wyczyść",
            addToMessage: "Dodaj {name} do wiadomości",
            deleteImport: "Usuń {name}",
            deleteCompletely: "Usuń całkowicie ten zaimportowany GIF",
            addFavorite: "Dodaj do ulubionych",
            removeFavorite: "Usuń z ulubionych",
            countGifs: { one: "{count} GIF", few: "{count} GIF-y", many: "{count} GIF-ów", other: "{count} GIF-a" },
            countResults: {
                one: "{count} wynik",
                few: "{count} wyniki",
                many: "{count} wyników",
                other: "{count} wyniku"
            },
            emptyImports: "Nie ma jeszcze zaimportowanych GIF-ów",
            noResults: "Brak wyników dla „{query}”",
            converting: "Konwersja {current}/{total}: {name}",
            importedCount: {
                one: "Zaimportowano {count} GIF",
                few: "Zaimportowano {count} GIF-y",
                many: "Zaimportowano {count} GIF-ów",
                other: "Zaimportowano {count} GIF-a"
            },
            noneImported: "Nie zaimportowano żadnego GIF-a",
            attachFailed: "Nie udało się dołączyć GIF-a",
            attached: "GIF dołączony do wiadomości",
            deleted: "Zaimportowany GIF usunięty",
            deletedWithFavorite: "GIF i ulubione usunięte",
            favoriteRemoved: "GIF usunięty z ulubionych",
            favoriteNeedsSend: "Wyślij ten GIF raz, aby dodać go do ulubionych",
            favoriteFailed: "Nie udało się zmienić ulubionych",
            deleteFailed: "Nie udało się usunąć GIF-a",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "konwersja nie powiodła się",
            fileTooLarge: "plik jest za duży (maks. 100 MB)",
            gifTooLarge: "GIF jest za duży (maks. 8 MB)",
            convertedTooLarge: "przekonwertowany GIF jest za duży (maks. 8 MB)",
            unsupportedFormat: "nieobsługiwany format",
            noFrames: "nie udało się zdekodować żadnej klatki",
            videoReadTimeout: "przekroczono limit czasu wczytywania wideo",
            videoUnsupported: "nieobsługiwany format wideo",
            invalidVideoDimensions: "nieprawidłowe wymiary wideo",
            videoConvertTimeout: "przekroczono limit czasu konwersji wideo",
            imageUnreadable: "nieczytelny obraz"
        },
        ru: {
            categoryName: "Импортированные",
            importButton: "Импортировать GIF",
            resizeHandle: "Изменить размер",
            resizeHandleLabel: "Изменить размер окна",
            importTile: "Импортировать",
            searchPlaceholder: "Поиск среди импортированных",
            back: "Назад",
            clear: "Очистить",
            addToMessage: "Добавить {name} в сообщение",
            deleteImport: "Удалить {name}",
            deleteCompletely: "Полностью удалить этот импортированный GIF",
            addFavorite: "Добавить в избранное",
            removeFavorite: "Удалить из избранного",
            countGifs: { one: "{count} GIF", few: "{count} GIF", many: "{count} GIF", other: "{count} GIF" },
            countResults: {
                one: "{count} результат",
                few: "{count} результата",
                many: "{count} результатов",
                other: "{count} результата"
            },
            emptyImports: "Импортированных GIF пока нет",
            noResults: "Нет результатов по запросу «{query}»",
            converting: "Преобразование {current}/{total}: {name}",
            importedCount: {
                one: "Импортирован {count} GIF",
                few: "Импортировано {count} GIF",
                many: "Импортировано {count} GIF",
                other: "Импортировано {count} GIF"
            },
            noneImported: "GIF не импортирован",
            attachFailed: "Не удалось прикрепить GIF",
            attached: "GIF прикреплён к сообщению",
            deleted: "Импортированный GIF удалён",
            deletedWithFavorite: "GIF и избранное удалены",
            favoriteRemoved: "GIF удалён из избранного",
            favoriteNeedsSend: "Сначала отправьте этот GIF, чтобы добавить его в избранное",
            favoriteFailed: "Не удалось изменить избранное",
            deleteFailed: "Не удалось удалить GIF",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "ошибка преобразования",
            fileTooLarge: "файл слишком большой (макс. 100 МБ)",
            gifTooLarge: "GIF слишком большой (макс. 8 МБ)",
            convertedTooLarge: "преобразованный GIF слишком большой (макс. 8 МБ)",
            unsupportedFormat: "неподдерживаемый формат",
            noFrames: "не удалось декодировать ни одного кадра",
            videoReadTimeout: "истекло время загрузки видео",
            videoUnsupported: "неподдерживаемый формат видео",
            invalidVideoDimensions: "недопустимые размеры видео",
            videoConvertTimeout: "истекло время преобразования видео",
            imageUnreadable: "не удалось прочитать изображение"
        },
        ja: {
            categoryName: "インポート済み",
            importButton: "GIFをインポート",
            resizeHandle: "サイズ変更",
            resizeHandleLabel: "ウィンドウのサイズを変更",
            importTile: "インポート",
            searchPlaceholder: "インポート済みを検索",
            back: "戻る",
            clear: "クリア",
            addToMessage: "{name}をメッセージに追加",
            deleteImport: "{name}を削除",
            deleteCompletely: "このインポート済みGIFを完全に削除",
            addFavorite: "お気に入りに追加",
            removeFavorite: "お気に入りから削除",
            countGifs: "{count}件のGIF",
            countResults: "{count}件の結果",
            emptyImports: "インポート済みのGIFはまだありません",
            noResults: "「{query}」の結果はありません",
            converting: "変換中 {current}/{total}: {name}",
            importedCount: "{count}件のGIFをインポートしました",
            noneImported: "GIFはインポートされませんでした",
            attachFailed: "GIFを添付できませんでした",
            attached: "GIFをメッセージに添付しました",
            deleted: "インポート済みGIFを削除しました",
            deletedWithFavorite: "GIFとお気に入りを削除しました",
            favoriteRemoved: "GIFをお気に入りから削除しました",
            favoriteNeedsSend: "お気に入りに追加するには、先にこのGIFを送信してください",
            favoriteFailed: "お気に入りを変更できませんでした",
            deleteFailed: "GIFを削除できませんでした",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "変換に失敗しました",
            fileTooLarge: "ファイルが大きすぎます（最大100MB）",
            gifTooLarge: "GIFが大きすぎます（最大8MB）",
            convertedTooLarge: "変換後のGIFが大きすぎます（最大8MB）",
            unsupportedFormat: "未対応の形式です",
            noFrames: "フレームをデコードできませんでした",
            videoReadTimeout: "動画の読み込みがタイムアウトしました",
            videoUnsupported: "未対応の動画形式です",
            invalidVideoDimensions: "動画のサイズが無効です",
            videoConvertTimeout: "動画の変換がタイムアウトしました",
            imageUnreadable: "画像を読み込めませんでした"
        },
        ko: {
            categoryName: "가져온 GIF",
            importButton: "GIF 가져오기",
            resizeHandle: "크기 조정",
            resizeHandleLabel: "창 크기 조정",
            importTile: "가져오기",
            searchPlaceholder: "가져온 GIF 검색",
            back: "뒤로",
            clear: "지우기",
            addToMessage: "{name}을(를) 메시지에 추가",
            deleteImport: "{name} 삭제",
            deleteCompletely: "이 가져온 GIF 완전히 삭제",
            addFavorite: "즐겨찾기에 추가",
            removeFavorite: "즐겨찾기에서 제거",
            countGifs: "GIF {count}개",
            countResults: "결과 {count}개",
            emptyImports: "아직 가져온 GIF가 없습니다",
            noResults: "‘{query}’에 대한 결과가 없습니다",
            converting: "변환 중 {current}/{total}: {name}",
            importedCount: "GIF {count}개를 가져왔습니다",
            noneImported: "가져온 GIF가 없습니다",
            attachFailed: "GIF를 첨부할 수 없습니다",
            attached: "GIF를 메시지에 첨부했습니다",
            deleted: "가져온 GIF를 삭제했습니다",
            deletedWithFavorite: "GIF와 즐겨찾기를 삭제했습니다",
            favoriteRemoved: "GIF를 즐겨찾기에서 제거했습니다",
            favoriteNeedsSend: "즐겨찾기에 추가하려면 먼저 이 GIF를 보내세요",
            favoriteFailed: "즐겨찾기를 변경할 수 없습니다",
            deleteFailed: "GIF를 삭제할 수 없습니다",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "변환 실패",
            fileTooLarge: "파일이 너무 큽니다(최대 100MB)",
            gifTooLarge: "GIF가 너무 큽니다(최대 8MB)",
            convertedTooLarge: "변환된 GIF가 너무 큽니다(최대 8MB)",
            unsupportedFormat: "지원하지 않는 형식",
            noFrames: "프레임을 디코딩할 수 없습니다",
            videoReadTimeout: "동영상 로드 시간 초과",
            videoUnsupported: "지원하지 않는 동영상 형식",
            invalidVideoDimensions: "동영상 크기가 잘못되었습니다",
            videoConvertTimeout: "동영상 변환 시간 초과",
            imageUnreadable: "이미지를 읽을 수 없습니다"
        },
        "zh-CN": {
            categoryName: "已导入",
            importButton: "导入 GIF",
            resizeHandle: "调整大小",
            resizeHandleLabel: "调整窗口大小",
            importTile: "导入",
            searchPlaceholder: "搜索已导入的 GIF",
            back: "返回",
            clear: "清除",
            addToMessage: "将 {name} 添加到消息",
            deleteImport: "删除 {name}",
            deleteCompletely: "彻底删除此已导入的 GIF",
            addFavorite: "添加到收藏",
            removeFavorite: "从收藏中移除",
            countGifs: "{count} 个 GIF",
            countResults: "{count} 个结果",
            emptyImports: "还没有已导入的 GIF",
            noResults: "没有找到“{query}”的结果",
            converting: "正在转换 {current}/{total}：{name}",
            importedCount: "已导入 {count} 个 GIF",
            noneImported: "未导入任何 GIF",
            attachFailed: "无法附加 GIF",
            attached: "GIF 已附加到消息",
            deleted: "已删除导入的 GIF",
            deletedWithFavorite: "GIF 和收藏已删除",
            favoriteRemoved: "GIF 已从收藏中移除",
            favoriteNeedsSend: "请先发送此 GIF，然后才能将其添加到收藏",
            favoriteFailed: "无法修改收藏",
            deleteFailed: "无法删除 GIF",
            conversionFailed: "{name}：{message}",
            conversionFailedGeneric: "转换失败",
            fileTooLarge: "文件过大（最大 100 MB）",
            gifTooLarge: "GIF 过大（最大 8 MB）",
            convertedTooLarge: "转换后的 GIF 过大（最大 8 MB）",
            unsupportedFormat: "不支持的格式",
            noFrames: "无法解码任何帧",
            videoReadTimeout: "视频加载超时",
            videoUnsupported: "不支持的视频格式",
            invalidVideoDimensions: "视频尺寸无效",
            videoConvertTimeout: "视频转换超时",
            imageUnreadable: "无法读取图像"
        },
        "zh-TW": {
            categoryName: "已匯入",
            importButton: "匯入 GIF",
            resizeHandle: "調整大小",
            resizeHandleLabel: "調整視窗大小",
            importTile: "匯入",
            searchPlaceholder: "搜尋已匯入的 GIF",
            back: "返回",
            clear: "清除",
            addToMessage: "將 {name} 加入訊息",
            deleteImport: "刪除 {name}",
            deleteCompletely: "徹底刪除此已匯入的 GIF",
            addFavorite: "加入收藏",
            removeFavorite: "從收藏中移除",
            countGifs: "{count} 個 GIF",
            countResults: "{count} 個結果",
            emptyImports: "尚無已匯入的 GIF",
            noResults: "找不到「{query}」的結果",
            converting: "正在轉換 {current}/{total}：{name}",
            importedCount: "已匯入 {count} 個 GIF",
            noneImported: "未匯入任何 GIF",
            attachFailed: "無法附加 GIF",
            attached: "GIF 已附加至訊息",
            deleted: "已刪除匯入的 GIF",
            deletedWithFavorite: "GIF 與收藏已刪除",
            favoriteRemoved: "GIF 已從收藏中移除",
            favoriteNeedsSend: "請先傳送此 GIF，才能將其加入收藏",
            favoriteFailed: "無法修改收藏",
            deleteFailed: "無法刪除 GIF",
            conversionFailed: "{name}：{message}",
            conversionFailedGeneric: "轉換失敗",
            fileTooLarge: "檔案過大（最大 100 MB）",
            gifTooLarge: "GIF 過大（最大 8 MB）",
            convertedTooLarge: "轉換後的 GIF 過大（最大 8 MB）",
            unsupportedFormat: "不支援的格式",
            noFrames: "無法解碼任何影格",
            videoReadTimeout: "影片載入逾時",
            videoUnsupported: "不支援的影片格式",
            invalidVideoDimensions: "影片尺寸無效",
            videoConvertTimeout: "影片轉換逾時",
            imageUnreadable: "無法讀取圖片"
        },
        tr: {
            categoryName: "İçe Aktarılanlar",
            importButton: "GIF içe aktar",
            resizeHandle: "Yeniden boyutlandır",
            resizeHandleLabel: "Pencere boyutunu değiştir",
            importTile: "İçe aktar",
            searchPlaceholder: "İçe aktarılanlarda ara",
            back: "Geri",
            clear: "Temizle",
            addToMessage: "{name} öğesini mesaja ekle",
            deleteImport: "{name} öğesini sil",
            deleteCompletely: "Bu içe aktarılan GIF'i tamamen sil",
            addFavorite: "Favorilere ekle",
            removeFavorite: "Favorilerden çıkar",
            countGifs: "{count} GIF",
            countResults: "{count} sonuç",
            emptyImports: "Henüz içe aktarılan GIF yok",
            noResults: "“{query}” için sonuç yok",
            converting: "Dönüştürülüyor {current}/{total}: {name}",
            importedCount: "{count} GIF içe aktarıldı",
            noneImported: "Hiç GIF içe aktarılmadı",
            attachFailed: "GIF eklenemedi",
            attached: "GIF mesaja eklendi",
            deleted: "İçe aktarılan GIF silindi",
            deletedWithFavorite: "GIF ve favori silindi",
            favoriteRemoved: "GIF favorilerden çıkarıldı",
            favoriteNeedsSend: "Favorilere eklemeden önce bu GIF'i bir kez gönderin",
            favoriteFailed: "Favoriler değiştirilemedi",
            deleteFailed: "GIF silinemedi",
            conversionFailed: "{name}: {message}",
            conversionFailedGeneric: "dönüştürme başarısız",
            fileTooLarge: "dosya çok büyük (en fazla 100 MB)",
            gifTooLarge: "GIF çok büyük (en fazla 8 MB)",
            convertedTooLarge: "dönüştürülen GIF çok büyük (en fazla 8 MB)",
            unsupportedFormat: "desteklenmeyen biçim",
            noFrames: "hiçbir kare çözülemedi",
            videoReadTimeout: "video yükleme zaman aşımına uğradı",
            videoUnsupported: "desteklenmeyen video biçimi",
            invalidVideoDimensions: "geçersiz video boyutları",
            videoConvertTimeout: "video dönüştürme zaman aşımına uğradı",
            imageUnreadable: "görüntü okunamadı"
        }
    };

    const MESSAGE_KEYS_BY_LOWER = new Map(Object.keys(MESSAGES).map((key) => [key.toLowerCase(), key]));
    const PLURAL_RULES = new Map();
    const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;
    let currentLocale = null;

    function detectDiscordLocale() {
        try {
            const common = getWebpackCommon();
            const locale =
                common?.UserSettingsProtoStore?.settings?.localization?.locale?.value ??
                findByProps("getLocale")?.getLocale?.() ??
                common?.i18n?.intl?.currentLocale;
            return locale ? String(locale) : null;
        } catch {
            return null;
        }
    }

    function normalizeLocale(locale) {
        const value = String(locale || "")
            .replace("_", "-")
            .toLowerCase();
        if (!value) return "en";
        if (value === "zh" || value.startsWith("zh-hans")) return "zh-CN";
        if (value.startsWith("zh-hant")) return "zh-TW";
        const exact = MESSAGE_KEYS_BY_LOWER.get(value);
        if (exact) return exact;
        const base = value.split("-")[0];
        return MESSAGE_KEYS_BY_LOWER.get(base) || "en";
    }

    function getLocale() {
        if (currentLocale) return currentLocale;
        const discordLocale = detectDiscordLocale();
        if (discordLocale) currentLocale = normalizeLocale(discordLocale);
        return currentLocale || normalizeLocale(navigator.language || "en");
    }

    function getPluralRules(locale) {
        let rules = PLURAL_RULES.get(locale);
        if (!rules) {
            rules = new Intl.PluralRules(locale);
            PLURAL_RULES.set(locale, rules);
        }
        return rules;
    }

    function interpolate(template, params = {}) {
        return String(template).replace(PLACEHOLDER_PATTERN, (match, name) =>
            params[name] == null ? "" : String(params[name])
        );
    }

    function t(key, params = {}) {
        const locale = getLocale();
        const table = MESSAGES[locale] || MESSAGES.en;
        let entry = table[key] ?? MESSAGES.en[key] ?? key;

        if (entry && typeof entry === "object") {
            const count = Number(params.count);
            const category = getPluralRules(locale).select(Number.isFinite(count) ? count : 0);
            entry = entry[category] ?? entry.other ?? entry.one ?? "";
        }

        return interpolate(entry, params);
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const yieldToUI = () => delay(0);
    const hasExtension = (name, extensions) => extensions.some((extension) => name.endsWith(extension));
    const fit = (width, height) => {
        if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
            return { width: 1, height: 1 };
        }
        const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
        return {
            width: Math.max(1, Math.round(width * scale)),
            height: Math.max(1, Math.round(height * scale))
        };
    };

    let dbPromise = null;
    let imports = [];
    const objectUrls = new Map();

    let drawer = null;
    let button = null;
    let input = null;
    let statusEl = null;
    let statusTimer = 0;
    let busy = false;

    let categoryCard = null;
    let categoryPreviewId = "";
    let importedView = false;
    let importedQuery = "";
    let overlay = null;
    let overlayKey = null;
    let overlayLayoutWidth = 0;

    const LAST_VIEW_COOKIE = "vcPickerLastView";
    let lastView = loadLastView();
    let pickerWasOpen = false;
    let panelWasPresent = false;
    let restorePending = false;
    let restoreTarget = null;
    let restoreDeadline = 0;
    let restoringClick = false;
    let pickerObserver = null;
    let observedDrawer = null;
    let resizeObserver = null;
    let observedResizeNode = null;
    let maintainScheduled = false;

    const GRID_GAP = 12;
    const DESIRED_TILE_WIDTH = 200;
    const MAX_COLUMNS = 8;
    const MAX_ROOT_COLUMNS = 6;
    const ROOT_TILE_HEIGHT = 110;

    const BACK_ICON = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <path fill="currentColor" d="M3.3 11.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L6.42 13H20a1 1 0 1 0 0-2H6.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"/>
        </svg>`;

    const UPLOAD_ICON = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v4h14v-4"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    const TRASH_ICON = `
        <svg class="icon__43deb" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                d="M9 3a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 1 0 0-2h-3V5a2 2 0 0 0-2-2H9Zm6 3V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v1h6ZM8 8v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8H8Zm2 2a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Z"
                clip-rule="evenodd"/>
        </svg>`;

    const STAR_ICON = `
        <svg class="icon__43deb" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M10.81 2.86c.38-1.15 2-1.15 2.38 0l1.89 5.83h6.12c1.2 0 1.71 1.54.73 2.25l-4.95 3.6 1.9 5.82a1.25 1.25 0 0 1-1.93 1.4L12 18.16l-4.95 3.6c-.98.7-2.3-.25-1.92-1.4l1.89-5.82-4.95-3.6a1.25 1.25 0 0 1 .73-2.25h6.12l1.9-5.83Z"/>
        </svg>`;

    const SEARCH_ICON = `
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                clip-rule="evenodd"/>
        </svg>`;

    const CLEAR_ICON = `
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm4.7-15.7a1 1 0 0 0-1.4 0L12 10.58l-3.3-3.3a1 1 0 0 0-1.4 1.42L10.58 12l-3.3 3.3a1 1 0 1 0 1.42 1.4L12 13.42l3.3 3.3a1 1 0 0 0 1.4-1.42L13.42 12l3.3-3.3a1 1 0 0 0 0-1.4Z"
                clip-rule="evenodd"/>
        </svg>`;

    function openDB() {
        if (!dbPromise) {
            dbPromise = new Promise((resolve, reject) => {
                if (typeof indexedDB === "undefined") {
                    reject(new Error("IndexedDB is not available"));
                    return;
                }

                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(STORE)) {
                        db.createObjectStore(STORE, { keyPath: "id" });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
                request.onblocked = () => reject(new Error("IndexedDB upgrade is blocked"));
            }).catch((error) => {
                // Allow a later call to retry after a transient failure.
                dbPromise = null;
                throw error;
            });
        }
        return dbPromise;
    }

    function requestAsPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function getAllImports() {
        const db = await openDB();
        const tx = db.transaction(STORE, "readonly");
        return (await requestAsPromise(tx.objectStore(STORE).getAll())) || [];
    }

    async function runWriteTransaction(operation) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, "readwrite");
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
            tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));

            try {
                operation(tx.objectStore(STORE));
            } catch (error) {
                try {
                    tx.abort();
                } catch {
                    /* The transaction may already be finished. */
                }
                reject(error);
            }
        });
    }

    function putImport(record) {
        return runWriteTransaction((store) => store.put(record));
    }

    function removeImport(id) {
        return runWriteTransaction((store) => store.delete(id));
    }

    function findDrawer() {
        return document.querySelector(DRAWER_SELECTOR);
    }

    function findPanel() {
        return document.getElementById(SELECTORS.gifPanelId);
    }

    function scheduleMaintain() {
        if (maintainScheduled) return;
        maintainScheduled = true;
        queueMicrotask(() => {
            maintainScheduled = false;
            safeMaintain();
        });
    }

    function ensurePickerObserver(drawerNode) {
        if (observedDrawer === drawerNode) return;
        pickerObserver?.disconnect();
        pickerObserver = null;
        observedDrawer = drawerNode;
        if (!drawerNode) return;
        pickerObserver = new MutationObserver((records) => {
            const hasElementMutation = records.some((record) =>
                [...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === 1)
            );
            if (!hasElementMutation) return;
            scheduleMaintain();
        });
        pickerObserver.observe(drawerNode, { childList: true, subtree: true });
        scheduleMaintain();
    }

    function ensureResizeObserver(node) {
        if (observedResizeNode === node) return;
        resizeObserver?.disconnect();
        resizeObserver = null;
        observedResizeNode = node;
        if (!node || typeof ResizeObserver !== "function") return;
        resizeObserver = new ResizeObserver(() => scheduleMaintain());
        resizeObserver.observe(node);
        scheduleMaintain();
    }

    function normalizeLastView(value) {
        if (ROOT_VIEWS.has(value)) {
            return { type: value };
        }
        if (value && ROOT_VIEWS.has(value.type)) {
            return { type: value.type };
        }
        if (value && value.type === "category" && typeof value.label === "string" && value.label) {
            return { type: "category", label: value.label };
        }
        return { type: "favorites" };
    }

    function loadLastView() {
        try {
            const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LAST_VIEW_COOKIE}=([^;]+)`));
            if (match) return normalizeLastView(JSON.parse(decodeURIComponent(match[1])));
        } catch {
            /* ignore */
        }
        return { type: "favorites" };
    }

    function saveLastView(view) {
        lastView = normalizeLastView(view);
        try {
            document.cookie = `${LAST_VIEW_COOKIE}=${encodeURIComponent(JSON.stringify(lastView))}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {
            /* ignore */
        }
    }

    function requestRestore() {
        restorePending = true;
        restoreTarget = normalizeLastView(lastView);
        restoreDeadline = Date.now() + TIMINGS.restoreWindow;
    }

    function finishRestore() {
        restorePending = false;
        restoreTarget = null;
    }

    function clickForRestore(element) {
        if (!element) return;
        restoringClick = true;
        try {
            element.click();
        } finally {
            restoringClick = false;
        }
    }

    function handleViewTracking(view) {
        if (!restoringClick) finishRestore();
        saveLastView(view);
    }

    function tryRestore(panel) {
        if (!restorePending) return;
        if (Date.now() > restoreDeadline) {
            finishRestore();
            return;
        }
        if (!panel) return;

        const target = restoreTarget || lastView;
        const backButton = panel.querySelector(SELECTORS.nativeBackButton);
        const hasBack = !!backButton;
        const favoritesView = hasFavoritesView(panel);
        const searchValue = panel.querySelector(SELECTORS.searchInput)?.value?.trim() || "";
        const favoritesCard = findRootGrid(panel)?.favoritesCard;

        if (target.type === "imports") {
            finishRestore();
            openImportedView();
            return;
        }

        if (target.type === "favorites") {
            if (!hasBack) {
                if (favoritesCard) {
                    finishRestore();
                    clickForRestore(favoritesCard);
                }
                return;
            }
            if (favoritesView) {
                finishRestore();
                return;
            }
            clickForRestore(backButton);
            return;
        }

        if (target.type === "root") {
            if (!hasBack) {
                if (favoritesCard) {
                    finishRestore();
                    return;
                }
                const clearButton = panel.querySelector(SELECTORS.clearButton);
                if (searchValue && clearButton) {
                    clickForRestore(clearButton);
                    return;
                }
                finishRestore();
                return;
            }
            clickForRestore(backButton);
            return;
        }

        if (target.type === "category") {
            if (!hasBack) {
                const card = [...panel.querySelectorAll(SELECTORS.rootCards)].find(
                    (item) => item.getAttribute("aria-label") === target.label
                );
                if (card) {
                    finishRestore();
                    clickForRestore(card);
                }
                return;
            }
            if (searchValue === target.label) {
                finishRestore();
                return;
            }
            clickForRestore(backButton);
        }
    }

    function trackNativeBackButton(panel) {
        const backButton = panel?.querySelector(SELECTORS.nativeBackButton);
        if (!backButton || backButton.dataset.vcViewTracking) return;
        backButton.dataset.vcViewTracking = "1";
        backButton.addEventListener("click", () => handleViewTracking({ type: "root" }), true);
    }

    function findRootGrid(panel) {
        const cards = panel?.querySelectorAll(SELECTORS.rootCards);
        if (!cards || cards.length === 0) return null;
        const favoritesCard = cards[0];
        if (!favoritesCard.querySelector(SELECTORS.categoryLabel)) return null;
        const wrapper = favoritesCard.parentElement;
        if (!wrapper) return null;
        return { favoritesCard, wrapper };
    }

    function isRootGifView(panel) {
        if (!panel || panel.querySelector(SELECTORS.nativeBackButton)) return false;
        const search = panel.querySelector(SELECTORS.searchInput);
        if (search && search.value.trim()) return false;
        return !!findRootGrid(panel);
    }

    function reflowRootGrid(wrapper) {
        const cards = [...wrapper.children].filter((child) => child.classList?.contains(SELECTORS.rootCardClass));
        if (cards.length === 0) return;

        const containerWidth = wrapper.clientWidth || wrapper.parentElement?.clientWidth || 806;
        const columns = clamp(Math.floor(containerWidth / DESIRED_TILE_WIDTH), 1, MAX_ROOT_COLUMNS);
        const tileWidth = Math.max(1, (containerWidth - GRID_GAP * 2 - (columns - 1) * GRID_GAP) / columns);

        // The wrapper is intentionally never shrunk: Discord uses it as a
        // scroll area and a smaller height would clip the last row.
        for (let index = 0; index < cards.length; index++) {
            const card = cards[index];
            card.style.position = "absolute";
            card.style.left = `${GRID_GAP + (index % columns) * (tileWidth + GRID_GAP)}px`;
            card.style.top = `${Math.floor(index / columns) * (ROOT_TILE_HEIGHT + GRID_GAP)}px`;
            card.style.width = `${tileWidth}px`;
            card.style.height = `${ROOT_TILE_HEIGHT}px`;
        }

        const rows = Math.ceil(cards.length / columns);
        const needed = rows * (ROOT_TILE_HEIGHT + GRID_GAP) - GRID_GAP;
        const current = parseFloat(wrapper.style.height) || 0;
        if (current < needed) wrapper.style.height = `${needed}px`;
    }

    function ensureInput() {
        if (!document.body) return;
        if (input?.isConnected) return;
        input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = ACCEPT;
        input.className = "vc-import-input";
        input.style.display = "none";
        input.addEventListener("change", () => {
            const files = [...(input.files || [])];
            input.value = "";
            handleFiles(files).catch((error) => {
                console.error(`${LOG_PREFIX} Import batch failed`, error);
            });
        });
        document.body.appendChild(input);
    }

    function ensureButton() {
        if (button?.isConnected) return button;

        button = document.createElement("button");
        button.type = "button";
        button.className = "vc-gif-import";
        button.title = t("importButton");
        button.setAttribute("aria-label", t("importButton"));
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v4h14v-4"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!busy) input?.click();
        });
        drawer.appendChild(button);
        return button;
    }

    function ensureStatus() {
        if (statusEl?.isConnected) return statusEl;
        statusEl = document.createElement("div");
        statusEl.className = "vc-import-status";
        statusEl.setAttribute("role", "status");
        statusEl.setAttribute("aria-live", "polite");
        statusEl.style.display = "none";
        drawer.appendChild(statusEl);
        return statusEl;
    }

    function setStatus(text, isError = false, keep = false) {
        if (!drawer?.isConnected) return;
        const el = ensureStatus();
        clearTimeout(statusTimer);
        el.textContent = text;
        el.dataset.error = isError ? "true" : "false";
        el.style.display = text ? "block" : "none";
        if (text && !keep) {
            statusTimer = setTimeout(() => {
                if (statusEl) statusEl.style.display = "none";
            }, TIMINGS.status);
        }
    }

    function createCategoryCard() {
        const card = document.createElement("div");
        card.className = `${SELECTORS.rootCardClass} vc-imported-category`;
        card.style.position = "absolute";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", t("categoryName"));
        card.innerHTML = `
            <img class="vc-imported-category-preview" alt="" draggable="false">
            <div class="vc-imported-category-fade"></div>
            <div class="categoryText_d02962 vc-imported-category-text">
                ${UPLOAD_ICON}
                <span class="categoryName_d02962">${t("categoryName")}</span>
            </div>
            <span class="vc-imported-category-count"></span>`;

        const open = (event) => {
            event.preventDefault();
            event.stopPropagation();
            openImportedView();
        };
        addActivationHandler(card, open);
        return card;
    }

    function updateCategoryCardContent() {
        if (!categoryCard?.isConnected) return;

        const latest = imports[0] ?? null;
        const preview = categoryCard.querySelector(".vc-imported-category-preview");
        if (latest) {
            if (categoryPreviewId !== latest.id) {
                categoryPreviewId = latest.id;
                preview.src = objectUrls.get(latest.id) || "";
            }
            preview.style.display = "block";
        } else {
            categoryPreviewId = "";
            preview.removeAttribute("src");
            preview.style.display = "none";
        }

        const count = categoryCard.querySelector(".vc-imported-category-count");
        const countText = imports.length > 0 ? String(imports.length) : "";
        if (count.textContent !== countText) count.textContent = countText;
        count.style.display = imports.length > 0 ? "flex" : "none";
    }

    function removeCategoryCard() {
        if (!categoryCard) return;
        const wrapper = categoryCard.parentElement;
        categoryCard.remove();
        if (wrapper) {
            const first = wrapper.firstElementChild;
            const cards = [...wrapper.children].filter((child) => child.classList?.contains(SELECTORS.rootCardClass));
            const firstHeight = parseFloat(first?.style.height) || 0;
            const uniform = cards.every((card) => Math.abs((parseFloat(card.style.height) || 0) - firstHeight) < 0.5);
            if (first?.querySelector(SELECTORS.categoryLabel) && uniform) {
                reflowRootGrid(wrapper);
            }
        }
    }

    function maintainCategoryCard(panel) {
        if (!isRootGifView(panel)) {
            removeCategoryCard();
            return;
        }

        const grid = findRootGrid(panel);
        if (!grid) {
            removeCategoryCard();
            return;
        }

        if (!categoryCard) {
            categoryCard = createCategoryCard();
        }
        if (
            !categoryCard.isConnected ||
            categoryCard.parentElement !== grid.wrapper ||
            grid.favoritesCard.nextElementSibling !== categoryCard
        ) {
            grid.favoritesCard.after(categoryCard);
        }

        for (const card of grid.wrapper.children) {
            if (
                card === categoryCard ||
                !card.classList?.contains(SELECTORS.rootCardClass) ||
                card.dataset.vcViewTracking
            )
                continue;
            card.dataset.vcViewTracking = "1";
            card.addEventListener("click", () => {
                if (card === grid.wrapper.firstElementChild) {
                    handleViewTracking({ type: "favorites" });
                    return;
                }
                const label = card.getAttribute("aria-label");
                if (label) handleViewTracking({ type: "category", label });
            });
        }

        updateCategoryCardContent();
        reflowRootGrid(grid.wrapper);
    }

    function createImportedView() {
        const view = document.createElement("div");
        view.className = "vc-imported-view";
        view.setAttribute("role", "region");
        view.setAttribute("aria-label", t("categoryName"));
        view.innerHTML = `
            <div class="vc-imported-header">
                <div class="vc-imported-back" role="button" tabindex="0" aria-label="${t("back")}">${BACK_ICON}</div>
                <h3 class="vc-imported-title">${t("categoryName")}</h3>
                <span class="vc-imported-count"></span>
                <div class="vc-imported-search">
                    <div class="vc-imported-search-icon">${SEARCH_ICON}</div>
                    <input class="vc-imported-search-input" type="text" role="searchbox"
                        placeholder="${t("searchPlaceholder")}"
                        aria-label="${t("searchPlaceholder")}">
                    <div class="vc-imported-search-clear" role="button" tabindex="0"
                        aria-label="${t("clear")}" data-visible="false">${CLEAR_ICON}</div>
                </div>
            </div>
            <div class="vc-imported-scroll">
                <div class="vc-imported-grid"></div>
                <div class="vc-imported-empty">
                    <span>${t("emptyImports")}</span>
                </div>
            </div>`;

        const back = view.querySelector(".vc-imported-back");
        const close = (event) => {
            event.preventDefault();
            event.stopPropagation();
            finishRestore();
            closeImportedView();
            saveLastView({ type: "root" });
            document.querySelector(SELECTORS.nativeBackButton)?.click();
        };
        addActivationHandler(back, close);

        const searchInput = view.querySelector(".vc-imported-search-input");
        const clearButton = view.querySelector(".vc-imported-search-clear");
        searchInput.value = importedQuery;
        const syncClear = () => {
            clearButton.dataset.visible = searchInput.value ? "true" : "false";
        };
        const runSearch = () => {
            importedQuery = searchInput.value;
            syncClear();
            renderImportedView(true);
        };
        searchInput.addEventListener("input", runSearch);
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && searchInput.value) {
                event.preventDefault();
                searchInput.value = "";
                importedQuery = "";
                syncClear();
                renderImportedView(true);
            }
        });

        const clear = (event) => {
            event.preventDefault();
            event.stopPropagation();
            searchInput.value = "";
            importedQuery = "";
            syncClear();
            renderImportedView(true);
            searchInput.focus();
        };
        addActivationHandler(clearButton, clear);
        syncClear();

        return view;
    }

    /** Renders the imported category, reusing the DOM when nothing changed. */
    function renderImportedView(force = false) {
        if (!overlay?.isConnected) return;

        const { byRecordId: favoriteKeysById } = buildImportFavoriteIndex();
        const key = imports.map((record) => `${record.id}:${favoriteKeysById.has(record.id) ? "1" : "0"}`).join("|");
        if (!force && key === overlayKey) return;
        overlayKey = key;

        const grid = overlay.querySelector(".vc-imported-grid");
        const empty = overlay.querySelector(".vc-imported-empty");
        const count = overlay.querySelector(".vc-imported-count");

        const query = importedQuery.trim().toLowerCase();
        const visibleImports = query
            ? imports.filter((record) =>
                  String(record.name || "")
                      .toLowerCase()
                      .includes(query)
              )
            : imports;

        if (imports.length === 0) {
            count.textContent = "";
        } else if (query) {
            count.textContent = t("countResults", { count: visibleImports.length });
        } else {
            count.textContent = t("countGifs", { count: imports.length });
        }

        const emptyLabel = empty.querySelector("span");
        if (emptyLabel) {
            emptyLabel.textContent = query ? t("noResults", { query: importedQuery.trim() }) : t("emptyImports");
        }
        empty.style.display = visibleImports.length === 0 ? "flex" : "none";
        grid.style.display = "grid";
        grid.textContent = "";

        if (!query) {
            const addTile = document.createElement("button");
            addTile.type = "button";
            addTile.className = "vc-imported-tile vc-imported-add";
            addTile.dataset.aspect = "1";
            addTile.setAttribute("aria-label", t("importButton"));
            addTile.innerHTML = `
                <span class="vc-imported-add-icon">${UPLOAD_ICON}</span>
                <span class="vc-imported-add-label">${t("importTile")}</span>`;
            addTile.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!busy) input?.click();
            });
            grid.appendChild(addTile);
        }

        for (const record of visibleImports) {
            const tile = document.createElement("div");
            tile.className = "vc-imported-tile";
            tile.dataset.aspect = record.width && record.height ? String(record.height / record.width) : "1";

            const attach = document.createElement("button");
            attach.type = "button";
            attach.className = "vc-imported-attach";
            attach.setAttribute("aria-label", t("addToMessage", { name: record.name }));

            const image = document.createElement("img");
            image.src = objectUrls.get(record.id) || "";
            image.alt = "";
            image.loading = "lazy";
            image.draggable = false;
            attach.appendChild(image);
            attach.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                attachToComposer(record);
            });

            const favoriteKeys = favoriteKeysById.get(record.id);
            const isFavorite = !!favoriteKeys?.size;

            const favorite = createIconAction({
                className: `favButton__2dc39 gifFavoriteButton__43deb vc-imported-favorite${isFavorite ? " selected__43deb" : ""}`,
                label: isFavorite ? t("removeFavorite") : t("addFavorite"),
                icon: STAR_ICON,
                onActivate(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const keys = getFavoriteKeysForRecord(record);
                    if (keys.length === 0) {
                        setStatus(t("favoriteNeedsSend"));
                        return;
                    }

                    const unfavorite = getUnfavoriteAction();
                    if (!unfavorite) {
                        setStatus(t("favoriteFailed"), true);
                        return;
                    }

                    for (const key of keys) {
                        try {
                            unfavorite(key);
                        } catch (error) {
                            console.error(`${LOG_PREFIX} Failed to remove favorite`, error);
                        }
                    }
                    setStatus(t("favoriteRemoved"));
                    setTimeout(() => renderImportedView(true), TIMINGS.favoriteRefresh);
                }
            });

            const remove = createIconAction({
                className: "favButton__2dc39 gifFavoriteButton__43deb vc-imported-delete",
                label: t("deleteImport", { name: record.name }),
                icon: TRASH_ICON,
                onActivate(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    deleteImportedCompletely([record], getFavoriteKeysForRecord(record)).catch((error) => {
                        console.error(`${LOG_PREFIX} Delete failed`, error);
                        setStatus(t("deleteFailed"), true);
                    });
                }
            });

            tile.append(attach, favorite, remove);
            grid.appendChild(tile);
        }

        layoutImportedTiles(true);
    }

    /** Lays out imported tiles in a balanced masonry grid. */
    function layoutImportedTiles(force = false) {
        if (!overlay?.isConnected) return;
        const grid = overlay.querySelector(".vc-imported-grid");
        if (!grid) return;
        const tiles = [...grid.children];

        const containerWidth = overlay.clientWidth;
        if (!Number.isFinite(containerWidth) || containerWidth <= 0) return;

        if (tiles.length === 0) {
            grid.style.width = `${containerWidth}px`;
            grid.style.height = "0px";
            return;
        }
        if (!force && containerWidth === overlayLayoutWidth) return;
        overlayLayoutWidth = containerWidth;

        const columns = clamp(Math.floor(containerWidth / DESIRED_TILE_WIDTH), 1, MAX_COLUMNS);
        const tileWidth = Math.max(1, (containerWidth - GRID_GAP * 2 - (columns - 1) * GRID_GAP) / columns);
        const heights = new Array(columns).fill(0);

        for (const tile of tiles) {
            let column = 0;
            for (let index = 1; index < columns; index++) {
                if (heights[index] < heights[column]) column = index;
            }

            const ratio = parseFloat(tile.dataset.aspect) || 1;
            const height = Math.round(tileWidth * ratio * 1000) / 1000;
            tile.style.position = "absolute";
            tile.style.left = `${GRID_GAP + column * (tileWidth + GRID_GAP)}px`;
            tile.style.top = `${heights[column]}px`;
            tile.style.width = `${tileWidth}px`;
            tile.style.height = `${height}px`;
            heights[column] += height + GRID_GAP;
        }

        grid.style.width = `${containerWidth}px`;
        grid.style.height = `${Math.max(0, Math.max(...heights) - GRID_GAP)}px`;
    }

    function openImportedView() {
        const panel = findPanel();
        if (!panel) return;
        finishRestore();
        saveLastView({ type: "imports" });
        importedView = true;
        maintainImportedView(panel);
        requestAnimationFrame(() => {
            overlay?.querySelector(".vc-imported-search-input")?.focus();
        });
    }

    function closeImportedView() {
        importedView = false;
        importedQuery = "";
        overlay?.remove();
        overlay = null;
        overlayKey = null;
        overlayLayoutWidth = 0;
    }

    function maintainImportedView(panel) {
        if (!importedView || !panel) {
            closeImportedView();
            return;
        }

        if (!overlay || !overlay.isConnected || overlay.parentElement !== panel) {
            overlay?.remove();
            overlay = createImportedView();
            panel.appendChild(overlay);
            overlayKey = null;
            overlayLayoutWidth = 0;
        }

        renderImportedView(false);
        layoutImportedTiles();
    }

    function getNativeFavoriteEntries() {
        const gifs = getWebpackCommon()?.UserSettingsProtoStore?.frecencyWithoutFetchingLatest?.favoriteGifs?.gifs;
        if (!gifs) return [];

        const entries = [];
        for (const [key, gif] of Object.entries(gifs)) {
            if (!gif) continue;
            const src = gif.src || gif.url || gif.gifSrc;
            if (!src) continue;
            const pathname = toPathname(src);
            if (!pathname) continue;
            try {
                const name = decodeURIComponent(pathname.split("/").pop() || "").toLowerCase();
                if (!name) continue;
                entries.push({ key, pathname, name, width: gif.width, height: gif.height });
            } catch {
                /* Ignore malformed favorite filenames. */
            }
        }
        return entries;
    }

    const FAVORITE_SIZE_TOLERANCE = 2;

    function addToIndex(map, key, value) {
        let values = map.get(key);
        if (!values) {
            values = new Set();
            map.set(key, values);
        }
        values.add(value);
    }

    /**
     * Matches local imports against native favorites once and exposes the
     * result in the shapes needed by the UI: per import, per URL path, and
     * as a flat list for tests and diagnostics.
     */
    function buildImportFavoriteIndex() {
        const entries = getNativeFavoriteEntries();
        const matches = [];
        const byRecordId = new Map();
        const byPath = new Map();

        for (const record of imports) {
            const name = String(record.name || "").toLowerCase();
            for (const entry of entries) {
                if (entry.name !== name) continue;
                if (entry.width && record.width && Math.abs(entry.width - record.width) > FAVORITE_SIZE_TOLERANCE)
                    continue;
                if (entry.height && record.height && Math.abs(entry.height - record.height) > FAVORITE_SIZE_TOLERANCE)
                    continue;

                matches.push({ record, entry });
                addToIndex(byRecordId, record.id, entry.key);

                let pathMatch = byPath.get(entry.pathname);
                if (!pathMatch) {
                    pathMatch = { records: [], entries: [] };
                    byPath.set(entry.pathname, pathMatch);
                }
                if (!pathMatch.records.includes(record)) pathMatch.records.push(record);
                if (!pathMatch.entries.includes(entry)) pathMatch.entries.push(entry);
            }
        }

        return { matches, byRecordId, byPath };
    }

    function getImportedNativeMatches() {
        return buildImportFavoriteIndex().matches;
    }

    function getFavoriteKeysForRecord(record) {
        return [...(buildImportFavoriteIndex().byRecordId.get(record.id) ?? [])];
    }

    let cachedUnfavoriteAction = null;

    function getUnfavoriteAction() {
        if (cachedUnfavoriteAction) return cachedUnfavoriteAction;
        const module = findByProps("Tr", "wg");
        if (typeof module?.Tr === "function") cachedUnfavoriteAction = module.Tr;
        return cachedUnfavoriteAction;
    }

    const nativeDeleteTargets = new WeakMap();

    function createNativeDeleteButton() {
        return createIconAction({
            className: "favButton__2dc39 gifFavoriteButton__43deb vc-native-delete",
            label: t("deleteCompletely"),
            icon: TRASH_ICON,
            onActivate(event) {
                event.preventDefault();
                event.stopPropagation();
                const target = nativeDeleteTargets.get(event.currentTarget);
                if (!target) return;
                deleteImportedCompletely(target.records, target.favoriteKeys).catch((error) => {
                    console.error(`${LOG_PREFIX} Delete failed`, error);
                    setStatus(t("deleteFailed"), true);
                });
            }
        });
    }

    function maintainNativeDeleteButtons(panel) {
        if (!hasFavoritesView(panel)) {
            panel?.querySelectorAll(".vc-native-delete").forEach((button) => button.remove());
            return;
        }

        const { byPath } = buildImportFavoriteIndex();
        const seen = new Set();
        const tiles = panel.querySelectorAll(SELECTORS.rootCards);
        for (const tile of tiles) {
            const media = tile.querySelector("img, video");
            const src = media?.currentSrc || media?.src;
            if (!src) continue;

            const pathname = toPathname(src);
            if (!pathname) continue;

            const match = byPath.get(pathname);
            if (!match) continue;

            seen.add(tile);
            let button = tile.querySelector(".vc-native-delete");
            if (!button) {
                button = createNativeDeleteButton();
                tile.appendChild(button);
            }
            nativeDeleteTargets.set(button, {
                records: match.records,
                favoriteKeys: match.entries.map((entry) => entry.key)
            });
        }

        panel.querySelectorAll(".vc-native-delete").forEach((button) => {
            if (!seen.has(button.parentElement)) button.remove();
        });
    }

    async function deleteImportedCompletely(records, favoriteKeys) {
        if (!records?.length) return;

        const keys = favoriteKeys ?? [];
        const unfavorite = getUnfavoriteAction();
        let favoriteRemoved = false;
        if (unfavorite) {
            for (const key of new Set(keys)) {
                try {
                    unfavorite(key);
                    favoriteRemoved = true;
                } catch (error) {
                    console.error(`${LOG_PREFIX} Failed to remove native favorite`, error);
                }
            }
        }

        const deleted = await deleteRecords(records);
        if (!deleted) {
            setStatus(t("deleteFailed"), true);
        } else if (favoriteRemoved) {
            setStatus(t("deletedWithFavorite"));
        } else {
            setStatus(t("deleted"));
        }
    }

    /** Single entry point for all DOM/resize/timer-driven UI synchronization. */
    function maintain() {
        const currentDrawer = findDrawer();
        const panel = findPanel();
        const isOpen = !!currentDrawer?.isConnected;

        if (isOpen && !pickerWasOpen) requestRestore();
        pickerWasOpen = isOpen;

        const panelPresent = isOpen && !!panel;
        if (isOpen && panelPresent && !panelWasPresent) requestRestore();
        panelWasPresent = panelPresent;

        if (currentDrawer !== drawer) {
            drawer = currentDrawer;
            button = drawer?.querySelector(".vc-gif-import") ?? null;
            statusEl = drawer?.querySelector(".vc-import-status") ?? null;
        }

        ensurePickerObserver(currentDrawer?.isConnected ? currentDrawer : null);
        ensureResizeObserver(currentDrawer?.isConnected ? currentDrawer : null);

        if (!drawer?.isConnected) {
            drawer = null;
            button = null;
            statusEl = null;
            finishRestore();
            closeImportedView();
            removeCategoryCard();
            return;
        }

        // Replaces the legacy 300 ms resize poll: maintain() already runs on
        // every relevant DOM/resize mutation and periodically as a fallback.
        initDrawer(currentDrawer);
        setupGifObserver();

        ensureInput();
        const btn = ensureButton();
        btn.style.display = panel ? "flex" : "none";
        btn.disabled = busy;

        if (!panel) {
            closeImportedView();
            removeCategoryCard();
            statusEl?.remove();
            statusEl = null;
            return;
        }

        maintainCategoryCard(panel);
        trackNativeBackButton(panel);
        tryRestore(panel);
        maintainImportedView(panel);

        if (importedView) {
            panel.querySelectorAll(".vc-native-delete").forEach((button) => button.remove());
        } else {
            maintainNativeDeleteButtons(panel);
        }
    }

    /** Prevents a transient Discord DOM change from breaking the UI loop. */
    function safeMaintain() {
        try {
            maintain();
        } catch (error) {
            console.error(`${LOG_PREFIX} Maintenance failed`, error);
        }
    }

    async function loadImports() {
        try {
            imports = (await getAllImports()).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to load imports`, error);
            imports = [];
        }

        for (const url of objectUrls.values()) URL.revokeObjectURL(url);
        objectUrls.clear();
        for (const record of imports) {
            try {
                objectUrls.set(record.id, URL.createObjectURL(record.blob));
            } catch (error) {
                console.error(`${LOG_PREFIX} Failed to create preview URL`, error);
            }
        }
        categoryPreviewId = "";
        if (overlay) renderImportedView(true);
        updateCategoryCardContent();
    }

    function closePicker() {
        try {
            const store = getWebpackCommon()?.ExpressionPickerStore;
            if (typeof store?.closeExpressionPicker === "function") {
                store.closeExpressionPicker();
                return true;
            }
        } catch {
            /* Fall back to the legacy action below. */
        }

        try {
            const actions = findByProps("v8", "RQ");
            if (typeof actions?.v8 === "function") {
                actions.v8();
                return true;
            }
        } catch {
            /* Discord internals changed. */
        }
        return false;
    }

    function focusComposerWhenReady(attempt = 0) {
        if (findDrawer()) {
            if (attempt < ATTEMPTS.composerFocus) {
                setTimeout(() => focusComposerWhenReady(attempt + 1), TIMINGS.composerFocusRetry);
            }
            return;
        }

        const editor = document.querySelector(SELECTORS.slateEditor);
        if (editor?.isConnected) {
            editor.focus();
            if (document.activeElement === editor) return;
        }

        if (attempt < ATTEMPTS.composerFocus) {
            setTimeout(() => focusComposerWhenReady(attempt + 1), TIMINGS.composerFocusRetry);
        }
    }

    function attachToComposer(record) {
        const common = getWebpackCommon();
        const uploadManager = common?.UploadManager;
        const channelId = common?.SelectedChannelStore?.getChannelId?.();
        if (!uploadManager || !channelId) {
            setStatus(t("attachFailed"), true);
            return;
        }

        const file = new File([record.blob], record.name, { type: "image/gif" });
        const upload = {
            id: `vc-import-${record.id}`,
            file,
            platform: UPLOAD_PLATFORM_WEB,
            origin: "file_picker"
        };

        try {
            uploadManager.addFile({
                file: upload,
                channelId,
                draftType: DRAFT_TYPE_CHANNEL_MESSAGE,
                allowOptimization: false
            });
        } catch (error) {
            console.error(`${LOG_PREFIX} Failed to attach GIF`, error);
            setStatus(t("attachFailed"), true);
            return;
        }

        const closed = closePicker();
        focusComposerWhenReady();
        if (!closed) setStatus(t("attached"));
    }

    async function deleteRecords(records) {
        const deletedIds = new Set();
        for (const record of records) {
            try {
                await removeImport(record.id);
                deletedIds.add(record.id);
            } catch (error) {
                console.error(`${LOG_PREFIX} Failed to delete import`, error);
            }
        }

        if (deletedIds.size === 0) return false;

        for (const id of deletedIds) {
            const url = objectUrls.get(id);
            if (url) URL.revokeObjectURL(url);
            objectUrls.delete(id);
        }
        imports = imports.filter((item) => !deletedIds.has(item.id));
        categoryPreviewId = "";
        renderImportedView(true);
        updateCategoryCardContent();
        return true;
    }

    /** Imports a batch sequentially so the UI stays responsive between files. */
    async function handleFiles(files) {
        if (busy || files.length === 0) return;
        busy = true;
        if (button) button.disabled = true;

        let added = 0;
        let failed = 0;
        try {
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                setStatus(
                    t("converting", {
                        current: index + 1,
                        total: files.length,
                        name: file.name
                    }),
                    false,
                    true
                );
                try {
                    const record = await importFile(file);
                    await putImport(record);
                    added++;
                } catch (error) {
                    failed++;
                    console.error(`${LOG_PREFIX} Import failed`, file.name, error);
                    setStatus(
                        t("conversionFailed", {
                            name: file.name,
                            message: error?.message || t("conversionFailedGeneric")
                        }),
                        true
                    );
                    await delay(TIMINGS.importError);
                }
                await yieldToUI();
            }

            await loadImports();
            if (added > 0) {
                openImportedView();
                setStatus(t("importedCount", { count: added }));
            } else if (failed > 0) {
                setStatus(t("noneImported"), true);
            } else {
                setStatus("");
            }
        } finally {
            busy = false;
            if (button) button.disabled = false;
        }
    }

    /** Validates an input file, converts it when needed, and builds its record. */
    async function importFile(file) {
        if (file.size > MAX_INPUT_BYTES) {
            throw new Error(t("fileTooLarge"));
        }

        const originalName = String(file.name || "import");
        const type = String(file.type || "").toLowerCase();
        const name = originalName.toLowerCase();
        let result;

        if (type === "image/gif" || hasExtension(name, GIF_EXTENSIONS)) {
            if (file.size > MAX_OUTPUT_BYTES) {
                throw new Error(t("gifTooLarge"));
            }
            const dimensions = await measureImage(file);
            result = { blob: file, width: dimensions.width, height: dimensions.height };
        } else if (type.startsWith("video/") || hasExtension(name, VIDEO_EXTENSIONS)) {
            result = await convertVideo(file);
        } else if (type.startsWith("image/") || hasExtension(name, IMAGE_EXTENSIONS)) {
            result = await convertImage(file);
        } else {
            throw new Error(t("unsupportedFormat"));
        }

        if (!result?.blob || result.blob.size > MAX_OUTPUT_BYTES) {
            throw new Error(t("convertedTooLarge"));
        }

        const id =
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        return {
            id,
            name: originalName.replace(/\.[^.]+$/, "") + ".gif",
            blob: result.blob,
            width: result.width,
            height: result.height,
            size: result.blob.size,
            createdAt: Date.now()
        };
    }

    async function measureImage(blob) {
        try {
            const bitmap = await createImageBitmap(blob);
            const dimensions = { width: bitmap.width, height: bitmap.height };
            bitmap.close?.();
            if (!dimensions.width || !dimensions.height) {
                throw new Error(t("imageUnreadable"));
            }
            return dimensions;
        } catch {
            if (typeof Image !== "function") {
                throw new Error(t("imageUnreadable"));
            }
            return new Promise((resolve, reject) => {
                const image = new Image();
                const url = URL.createObjectURL(blob);
                image.onload = () => {
                    URL.revokeObjectURL(url);
                    if (!image.naturalWidth || !image.naturalHeight) {
                        reject(new Error(t("imageUnreadable")));
                        return;
                    }
                    resolve({ width: image.naturalWidth, height: image.naturalHeight });
                };
                image.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error(t("imageUnreadable")));
                };
                image.src = url;
            });
        }
    }

    function createCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error(t("conversionFailedGeneric"));
        context.imageSmoothingQuality = "high";
        return { canvas, context };
    }

    function captureFrame(context, source, width, height, delay) {
        context.clearRect(0, 0, width, height);
        context.drawImage(source, 0, 0, width, height);
        return {
            data: context.getImageData(0, 0, width, height).data,
            delay
        };
    }

    function encodeSingleFrame(source, width, height, delay = 1000) {
        const { context } = createCanvas(width, height);
        return encodeFrames([captureFrame(context, source, width, height, delay)], width, height);
    }

    async function convertImage(file) {
        if (typeof ImageDecoder === "function") {
            let decoder = null;
            try {
                const data = await file.arrayBuffer();
                decoder = new ImageDecoder({ data, type: file.type || "image/png" });
                await decoder.tracks.ready;
                const track = decoder.tracks.selectedTrack;
                const frameCount = clamp(track?.frameCount ?? 1, 1, MAX_IMAGE_FRAMES);

                const first = await decoder.decode({ frameIndex: 0 });
                const sourceWidth = first.image.displayWidth || first.image.codedWidth;
                const sourceHeight = first.image.displayHeight || first.image.codedHeight;
                if (!sourceWidth || !sourceHeight) throw new Error(t("imageUnreadable"));
                const { width, height } = fit(sourceWidth, sourceHeight);

                const { context } = createCanvas(width, height);
                const frames = [];
                let totalDelay = 0;
                for (let index = 0; index < frameCount && totalDelay < MAX_DURATION * 1000; index++) {
                    const frame = index === 0 ? first : await decoder.decode({ frameIndex: index });
                    const rawDuration = frame.image.duration;
                    const delay =
                        frameCount === 1
                            ? 1000
                            : Math.min(1000, Math.max(20, Math.round((rawDuration || 100000) / 1000)));

                    try {
                        frames.push(captureFrame(context, frame.image, width, height, delay));
                    } finally {
                        frame.image.close?.();
                    }
                    totalDelay += delay;
                    if (index % 2 === 0) await yieldToUI();
                }

                if (frames.length === 0) throw new Error(t("noFrames"));
                return {
                    blob: encodeFrames(frames, width, height),
                    width,
                    height
                };
            } catch (error) {
                console.warn(`${LOG_PREFIX} ImageDecoder failed, trying static image`, error);
            } finally {
                try {
                    decoder?.close?.();
                } catch {
                    /* The decoder may already be closed. */
                }
            }
        }

        let bitmap;
        try {
            bitmap = await createImageBitmap(file);
        } catch {
            throw new Error(t("imageUnreadable"));
        }
        if (!bitmap.width || !bitmap.height) {
            bitmap.close?.();
            throw new Error(t("imageUnreadable"));
        }

        const { width, height } = fit(bitmap.width, bitmap.height);
        try {
            return {
                blob: encodeSingleFrame(bitmap, width, height, 1000),
                width,
                height
            };
        } finally {
            bitmap.close?.();
        }
    }

    async function convertVideo(file) {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";

        try {
            await new Promise((resolve, reject) => {
                let settled = false;
                let timeout = 0;
                const finish = (callback, value) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeout);
                    video.onloadedmetadata = null;
                    video.onerror = null;
                    callback(value);
                };

                timeout = setTimeout(() => finish(reject, new Error(t("videoReadTimeout"))), TIMINGS.videoMetadata);
                video.onloadedmetadata = () => finish(resolve);
                video.onerror = () => finish(reject, new Error(t("videoUnsupported")));
            });

            const sourceWidth = video.videoWidth;
            const sourceHeight = video.videoHeight;
            if (!sourceWidth || !sourceHeight) throw new Error(t("invalidVideoDimensions"));

            const { width, height } = fit(sourceWidth, sourceHeight);
            const duration =
                Number.isFinite(video.duration) && video.duration > 0
                    ? Math.min(video.duration, MAX_DURATION)
                    : MAX_DURATION;
            const frameCount = clamp(Math.ceil(duration * FPS), 1, MAX_VIDEO_FRAMES);

            const { context } = createCanvas(width, height);
            const frames = [];
            const frameDelay = Math.round(1000 / FPS);
            for (let index = 0; index < frameCount; index++) {
                const time = clamp(duration - 0.001, 0, index / FPS);
                await seekVideo(video, time);
                frames.push(captureFrame(context, video, width, height, frameDelay));
                if (index % 2 === 0) await yieldToUI();
            }

            return {
                blob: encodeFrames(frames, width, height),
                width,
                height
            };
        } finally {
            try {
                video.pause();
            } catch {
                /* ignore */
            }
            video.removeAttribute("src");
            try {
                video.load();
            } catch {
                /* ignore */
            }
            URL.revokeObjectURL(url);
        }
    }

    function seekVideo(video, time) {
        return new Promise((resolve, reject) => {
            let settled = false;
            let timeout = 0;

            const cleanup = () => {
                clearTimeout(timeout);
                video.removeEventListener("seeked", onSeeked);
            };
            const settle = (callback, value) => {
                if (settled) return;
                settled = true;
                cleanup();
                callback(value);
            };
            const onSeeked = () => settle(resolve);

            timeout = setTimeout(() => settle(() => reject(new Error(t("videoConvertTimeout")))), TIMINGS.videoSeek);

            if (Math.abs(video.currentTime - time) < 0.001 && video.readyState >= 2) {
                requestAnimationFrame(onSeeked);
                return;
            }

            video.addEventListener("seeked", onSeeked);
            try {
                video.currentTime = time;
            } catch (error) {
                settle(() => reject(error));
            }
        });
    }

    function encodeFrames(frames, width, height) {
        if (!frames?.length) throw new Error(t("noFrames"));
        if (!width || !height) throw new Error(t("conversionFailedGeneric"));
        const encoder = Gifenc.GIFEncoder();
        for (const frame of frames) {
            const palette = Gifenc.quantize(frame.data, 256);
            const index = Gifenc.applyPalette(frame.data, palette);
            encoder.writeFrame(index, width, height, {
                palette,
                delay: frame.delay,
                repeat: 0,
                dispose: 2
            });
        }
        encoder.finish();
        return new Blob([encoder.bytes()], { type: "image/gif" });
    }

    // Styles for the import UI, injected once next to the resize styles.
    const IMPORT_CSS = `
.vc-gif-import {
    position: absolute;
    top: 16px;
    right: 14px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--interactive-text-default);
    cursor: pointer;
    opacity: 0.75;
    transition: opacity 0.15s, background-color 0.15s, color 0.15s;
}
.vc-gif-import:hover {
    opacity: 1;
    background: var(--background-mod-subtle);
    color: var(--interactive-text-hover);
}
.vc-gif-import:disabled {
    opacity: 0.4;
    cursor: default;
}
.vc-gif-import svg {
    width: 16px;
    height: 16px;
    pointer-events: none;
}
.vc-imported-category {
    position: absolute;
    overflow: hidden;
    background: linear-gradient(135deg, #5865f2 0%, #eb459e 100%);
}
.vc-imported-category-preview {
    position: absolute;
    inset: 0;
    display: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.vc-imported-category-fade {
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: rgba(88, 101, 242, 0.8);
    pointer-events: none;
}
.vc-imported-category-text {
    z-index: 2;
}
.vc-imported-category-count {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font: 600 11px/1 var(--font-primary, sans-serif);
    pointer-events: none;
}
.vc-imported-view {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    flex-direction: column;
    background: var(--background-base-low, var(--background-base-lower));
    color: var(--text-default);
}
.vc-imported-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 0 0 auto;
    min-height: 53px;
    padding: 0 16px 12px;
    box-sizing: border-box;
    background: var(--background-surface-high);
    border-bottom: 1px solid var(--border-subtle);
}
.vc-imported-back {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: var(--interactive-text-default);
    cursor: pointer;
}
.vc-imported-back:hover {
    color: var(--interactive-text-hover);
    background: var(--background-mod-subtle);
}
.vc-imported-back svg {
    width: 24px;
    height: 24px;
}
.vc-imported-title {
    margin: 0;
    color: var(--text-strong, var(--text-default));
    font: 600 16px/20px var(--font-primary, sans-serif);
}
.vc-imported-count {
    flex: 0 0 auto;
    color: var(--text-muted);
    font: 500 12px/16px var(--font-primary, sans-serif);
}
.vc-imported-search {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    height: 40px;
    box-sizing: border-box;
    padding-left: 4px;
    border: 1px solid var(--input-border-default, transparent);
    border-radius: 8px;
    background: var(--input-background-default, var(--background-base-lowest));
}
.vc-imported-search:focus-within {
    border-color: var(--input-border-active, var(--border-focus));
    outline: 2px solid var(--input-border-active, var(--border-focus));
    outline-offset: -2px;
}
.vc-imported-search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 30px;
    height: 30px;
    color: var(--icon-strong);
}
.vc-imported-search-icon svg {
    width: 16px;
    height: 16px;
}
.vc-imported-search-input {
    flex: 1 1 auto;
    min-width: 0;
    height: 38px;
    padding: 1px 8px 1px 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text-default);
    font: 400 16px/20px var(--font-primary, sans-serif);
}
.vc-imported-search-input::placeholder {
    color: var(--text-muted);
}
.vc-imported-search-clear {
    display: none;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 30px;
    height: 30px;
    color: var(--text-muted);
    cursor: pointer;
}
.vc-imported-search-clear[data-visible="true"] {
    display: flex;
}
.vc-imported-search-clear:hover {
    color: var(--text-default);
}
.vc-imported-search-clear svg {
    width: 16px;
    height: 16px;
}
.vc-imported-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 12px 0;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: var(--background-surface-high) transparent;
}
.vc-imported-scroll::-webkit-scrollbar {
    width: 8px;
}
.vc-imported-scroll::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: var(--background-surface-high);
}
.vc-imported-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.vc-imported-grid {
    position: relative;
    display: block;
    width: 100%;
}
.vc-imported-tile {
    position: absolute;
    border-radius: 6px;
    overflow: hidden;
    background: var(--background-mod-subtle);
}
.vc-imported-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0;
    border: 1px dashed var(--border-subtle);
    background: var(--background-base-lower);
    color: var(--text-muted);
    cursor: pointer;
    font: 500 13px/16px var(--font-primary, sans-serif);
    transition: border-color 0.12s, background-color 0.12s, color 0.12s;
}
.vc-imported-add:hover {
    border-color: var(--brand-500, #5865f2);
    background: var(--background-mod-subtle);
    color: var(--text-default);
}
.vc-imported-add:disabled {
    opacity: 0.5;
    cursor: default;
}
.vc-imported-add-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}
.vc-imported-add-icon svg {
    width: 26px;
    height: 26px;
}
.vc-imported-attach {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}
.vc-imported-attach img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.vc-imported-attach:hover {
    outline: 2px solid var(--border-focus);
    outline-offset: -2px;
}
.vc-imported-delete,
.vc-imported-favorite {
    cursor: pointer;
    opacity: 0;
}
.vc-imported-delete {
    inset-inline-end: 40px;
}
.vc-imported-tile:hover .vc-imported-delete,
.vc-imported-tile:hover .vc-imported-favorite,
.vc-imported-tile:focus-within .vc-imported-delete,
.vc-imported-tile:focus-within .vc-imported-favorite {
    opacity: 1;
    transform: none;
}
.vc-imported-delete:hover,
.vc-imported-delete:focus {
    color: var(--status-danger);
}
.vc-imported-favorite:hover,
.vc-imported-favorite:focus {
    color: var(--yellow-300);
}
@media (hover: none) {
    .vc-imported-delete,
    .vc-imported-favorite {
        opacity: 1;
        transform: none;
    }
}
.vc-imported-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 100%;
    min-height: 180px;
    color: var(--text-muted);
    text-align: center;
    font: 500 14px/18px var(--font-primary, sans-serif);
}
.vc-imported-empty small {
    font: 400 12px/16px var(--font-primary, sans-serif);
    opacity: 0.8;
}
.vc-native-delete {
    inset-inline-end: 40px;
}
.vc-native-delete:hover,
.vc-native-delete:focus {
    color: var(--status-danger);
}
.vc-import-status {
    position: absolute;
    top: 48px;
    right: 14px;
    z-index: 11;
    max-width: 320px;
    padding: 6px 10px;
    border-radius: 4px;
    background: var(--background-surface-high);
    box-shadow: var(--shadow-high);
    color: var(--text-default);
    font: 500 12px/16px var(--font-primary, sans-serif);
    pointer-events: none;
}
.vc-import-status[data-error="true"] {
    color: var(--text-feedback-critical);
}
`;

    function ensureImportStyle() {
        injectStyle(IMPORT_STYLE_ID, IMPORT_CSS);
    }

    function start(attempt = 0) {
        if (!document.documentElement) {
            if (attempt < ATTEMPTS.startRetry) {
                setTimeout(() => start(attempt + 1), TIMINGS.startRetry);
            } else {
                console.error(`${LOG_PREFIX} document.documentElement never appeared`);
            }
            return;
        }
        ensureImportStyle();
        window.addEventListener("resize", scheduleMaintain, { passive: true });
        document.addEventListener(
            "click",
            (event) => {
                const tile = event.target.closest?.(`.${SELECTORS.rootCardClass}[role="button"]`);
                if (!tile) return;
                if (event.target.closest?.('[class*="favButton"]')) return;
                if (!hasFavoritesView(document)) return;
                focusComposerWhenReady();
            },
            true
        );
        setInterval(safeMaintain, TIMINGS.maintain);
        safeMaintain();
        loadImports();
    }

    if (TEST_HOOK) {
        Object.assign(TEST_HOOK, {
            resize: {
                constants: {
                    MIN_WIDTH,
                    MIN_HEIGHT,
                    MAX_HEIGHT,
                    TOP_MARGIN,
                    HANDLE_CLASS,
                    STYLE_ID,
                    VARS_STYLE_ID,
                    HEIGHT_VAR
                },
                clamp,
                round,
                loadSavedHeight,
                saveHeight,
                setDiscordWidth,
                applySavedHeight,
                initDrawer,
                markGifMedia,
                markGifMediaIn,
                getSavedHeight: () => savedHeight
            },
            imports: {
                constants: {
                    DB_NAME,
                    DB_VERSION,
                    STORE,
                    MAX_INPUT_BYTES,
                    MAX_OUTPUT_BYTES,
                    MAX_DIMENSION,
                    MAX_DURATION,
                    FPS,
                    MAX_VIDEO_FRAMES,
                    MAX_IMAGE_FRAMES,
                    ACCEPT,
                    LAST_VIEW_COOKIE,
                    GRID_GAP,
                    DESIRED_TILE_WIDTH,
                    MAX_COLUMNS,
                    MAX_ROOT_COLUMNS,
                    ROOT_TILE_HEIGHT
                },
                fit,
                normalizeLocale,
                detectDiscordLocale,
                getLocale,
                interpolate,
                t,
                normalizeLastView,
                loadLastView,
                saveLastView,
                getNativeFavoriteEntries,
                getImportedNativeMatches,
                getFavoriteKeysForRecord,
                getUnfavoriteAction,
                closePicker,
                reflowRootGrid,
                renderImportedView,
                layoutImportedTiles,
                seekVideo,
                encodeFrames,
                importFile,
                setImports(value) {
                    imports = value;
                },
                getImports: () => imports,
                setOverlay(value) {
                    overlay = value;
                },
                getOverlay: () => overlay,
                setDrawer(value) {
                    drawer = value;
                }
            }
        });
        return;
    }

    if (!startPickerObserver()) {
        document.addEventListener("DOMContentLoaded", startPickerObserver, { once: true });
    }
    start();
})();
