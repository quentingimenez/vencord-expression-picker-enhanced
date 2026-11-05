/*! gifenc - MIT License - https://github.com/mattdesl/gifenc
 * Bundled for the expression picker import feature.
 */
var Gifenc=(()=>{var Q=Object.defineProperty;var st=Object.getOwnPropertyDescriptor;var at=Object.getOwnPropertyNames;var ut=Object.prototype.hasOwnProperty;var xt=(t,e)=>{for(var i in e)Q(t,i,{get:e[i],enumerable:!0})},gt=(t,e,i,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of at(e))!ut.call(t,r)&&r!==i&&Q(t,r,{get:()=>e[r],enumerable:!(n=st(e,r))||n.enumerable});return t};var bt=t=>gt(Q({},"__esModule",{value:!0}),t);var kt={};xt(kt,{GIFEncoder:()=>ct,applyPalette:()=>rt,default:()=>vt,nearestColor:()=>it,nearestColorIndex:()=>W,nearestColorIndexWithDistance:()=>Z,prequantize:()=>nt,quantize:()=>j,snapColorsToPalette:()=>ot});var J={signature:"GIF",version:"89a",trailer:59,extensionIntroducer:33,applicationExtensionLabel:255,graphicControlExtensionLabel:249,imageSeparator:44,signatureSize:3,versionSize:3,globalColorTableFlagMask:128,colorResolutionMask:112,sortFlagMask:8,globalColorTableSizeMask:7,applicationIdentifierSize:8,applicationAuthCodeSize:3,disposalMethodMask:28,userInputFlagMask:2,transparentColorFlagMask:1,localColorTableFlagMask:128,interlaceFlagMask:64,idSortFlagMask:32,localColorTableSizeMask:7};function U(t=256){let e=0,i=new Uint8Array(t);return{get buffer(){return i.buffer},reset(){e=0},bytesView(){return i.subarray(0,e)},bytes(){return i.slice(0,e)},writeByte(r){n(e+1),i[e]=r,e++},writeBytes(r,o=0,f=r.length){n(e+f);for(let l=0;l<f;l++)i[e++]=r[l+o]},writeBytesView(r,o=0,f=r.byteLength){n(e+f),i.set(r.subarray(o,o+f),e),e+=f}};function n(r){var o=i.length;if(o>=r)return;var f=1024*1024;r=Math.max(r,o*(o<f?2:1.125)>>>0),o!=0&&(r=Math.max(r,256));let l=i;i=new Uint8Array(r),e>0&&i.set(l.subarray(0,e),0)}}var H=12,$=5003,dt=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function ht(t,e,i,n,r=U(512),o=new Uint8Array(256),f=new Int32Array($),l=new Int32Array($)){let x=f.length,a=Math.max(2,n);o.fill(0),l.fill(0),f.fill(-1);let s=0,c=0,g=a+1,p=g,b=!1,d=p,_=(1<<d)-1,u=1<<g-1,v=u+1,B=u+2,h=0,A=i[0],F=0;for(let y=x;y<65536;y*=2)++F;F=8-F,r.writeByte(a),I(u);let w=i.length;for(let y=1;y<w;y++)t:{let k=i[y],m=(k<<H)+A,M=k<<F^A;if(f[M]===m){A=l[M];break t}let L=M===0?1:x-M;for(;f[M]>=0;)if(M-=L,M<0&&(M+=x),f[M]===m){A=l[M];break t}I(A),A=k,B<1<<H?(l[M]=B++,f[M]=m):(f.fill(-1),B=u+2,b=!0,I(u))}return I(A),I(v),r.writeByte(0),r.bytesView();function I(y){for(s&=dt[c],c>0?s|=y<<c:s=y,c+=d;c>=8;)o[h++]=s&255,h>=254&&(r.writeByte(h),r.writeBytesView(o,0,h),h=0),s>>=8,c-=8;if((B>_||b)&&(b?(d=p,_=(1<<d)-1,b=!1):(++d,_=d===H?1<<d:(1<<d)-1)),y==v){for(;c>0;)o[h++]=s&255,h>=254&&(r.writeByte(h),r.writeBytesView(o,0,h),h=0),s>>=8,c-=8;h>0&&(r.writeByte(h),r.writeBytesView(o,0,h),h=0)}}}var tt=ht;function D(t,e,i){return t<<8&63488|e<<2&992|i>>3}function G(t,e,i,n){return t>>4|e&240|(i&240)<<4|(n&240)<<8}function R(t,e,i){return t>>4<<8|e&240|i>>4}function P(t,e,i){return t<e?e:t>i?i:t}function q(t){return t*t}function et(t,e,i){var n=0,r=1e100;let o=t[e],f=o.cnt,l=o.ac,x=o.rc,a=o.gc,s=o.bc;for(var c=o.fw;c!=0;c=t[c].fw){let p=t[c],b=p.cnt,d=f*b/(f+b);if(!(d>=r)){var g=0;i&&(g+=d*q(p.ac-l),g>=r)||(g+=d*q(p.rc-x),!(g>=r)&&(g+=d*q(p.gc-a),!(g>=r)&&(g+=d*q(p.bc-s),!(g>=r)&&(r=g,n=c))))}}o.err=r,o.nn=n}function N(){return{ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0}}function wt(t,e){let i=e==="rgb444"?4096:65536,n=new Array(i),r=t.length;if(e==="rgba4444")for(let o=0;o<r;++o){let f=t[o],l=f>>24&255,x=f>>16&255,a=f>>8&255,s=f&255,c=G(s,a,x,l),g=c in n?n[c]:n[c]=N();g.rc+=s,g.gc+=a,g.bc+=x,g.ac+=l,g.cnt++}else if(e==="rgb444")for(let o=0;o<r;++o){let f=t[o],l=f>>16&255,x=f>>8&255,a=f&255,s=R(a,x,l),c=s in n?n[s]:n[s]=N();c.rc+=a,c.gc+=x,c.bc+=l,c.cnt++}else for(let o=0;o<r;++o){let f=t[o],l=f>>16&255,x=f>>8&255,a=f&255,s=D(a,x,l),c=s in n?n[s]:n[s]=N();c.rc+=a,c.gc+=x,c.bc+=l,c.cnt++}return n}function j(t,e,i={}){let{format:n="rgb565",clearAlpha:r=!0,clearAlphaColor:o=0,clearAlphaThreshold:f=0,oneBitAlpha:l=!1}=i;if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array)&&!(t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");let x=new Uint32Array(t.buffer),a=i.useSqrt!==!1,s=n==="rgba4444",c=wt(x,n),g=c.length,p=g-1,b=new Uint32Array(g+1);for(var d=0,u=0;u<g;++u){let C=c[u];if(C!=null){var _=1/C.cnt;s&&(C.ac*=_),C.rc*=_,C.gc*=_,C.bc*=_,c[d++]=C}}q(e)/d<.022&&(a=!1);for(var u=0;u<d-1;++u)c[u].fw=u+1,c[u+1].bk=u,a&&(c[u].cnt=Math.sqrt(c[u].cnt));a&&(c[u].cnt=Math.sqrt(c[u].cnt));var v,B,h;for(u=0;u<d;++u){et(c,u,!1);var A=c[u].err;for(B=++b[0];B>1&&(h=B>>1,!(c[v=b[h]].err<=A));B=h)b[B]=v;b[B]=u}var F=d-e;for(u=0;u<F;){for(var w;;){var I=b[1];if(w=c[I],w.tm>=w.mtm&&c[w.nn].mtm<=w.tm)break;w.mtm==p?I=b[1]=b[b[0]--]:(et(c,I,!1),w.tm=u);var A=c[I].err;for(B=1;(h=B+B)<=b[0]&&(h<b[0]&&c[b[h]].err>c[b[h+1]].err&&h++,!(A<=c[v=b[h]].err));B=h)b[B]=v;b[B]=I}var y=c[w.nn],k=w.cnt,m=y.cnt,_=1/(k+m);s&&(w.ac=_*(k*w.ac+m*y.ac)),w.rc=_*(k*w.rc+m*y.rc),w.gc=_*(k*w.gc+m*y.gc),w.bc=_*(k*w.bc+m*y.bc),w.cnt+=y.cnt,w.mtm=++u,c[y.bk].fw=y.fw,c[y.fw].bk=y.bk,y.mtm=p}let M=[];var L=0;for(u=0;;++L){let Y=P(Math.round(c[u].rc),0,255),C=P(Math.round(c[u].gc),0,255),O=P(Math.round(c[u].bc),0,255),T=255;s&&(T=P(Math.round(c[u].ac),0,255),l&&(T=T<=(typeof l=="number"?l:127)?0:255),r&&T<=f&&(Y=C=O=o,T=0));let X=s?[Y,C,O,T]:[Y,C,O];if(pt(M,X)||M.push(X),(u=c[u].fw)==0)break}return M}function pt(t,e){for(let i=0;i<t.length;i++){let n=t[i],r=n[0]===e[0]&&n[1]===e[1]&&n[2]===e[2],o=n.length>=4&&e.length>=4?n[3]===e[3]:!0;if(r&&o)return!0}return!1}function E(t,e){var i=0,n;for(n=0;n<t.length;n++){let r=t[n]-e[n];i+=r*r}return i}function V(t,e){return e>1?Math.round(t/e)*e:t}function nt(t,{roundRGB:e=5,roundAlpha:i=10,oneBitAlpha:n=null}={}){let r=new Uint32Array(t.buffer);for(let o=0;o<r.length;o++){let f=r[o],l=f>>24&255,x=f>>16&255,a=f>>8&255,s=f&255;l=V(l,i),n&&(l=l<=(typeof n=="number"?n:127)?0:255),s=V(s,e),a=V(a,e),x=V(x,e),r[o]=l<<24|x<<16|a<<8|s<<0}}function rt(t,e,i="rgb565"){if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array)&&!(t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");if(e.length>256)throw new Error("applyPalette() only works with 256 colors or less");let n=new Uint32Array(t.buffer),r=n.length,o=i==="rgb444"?4096:65536,f=new Uint8Array(r),l=new Array(o),x=i==="rgba4444";if(i==="rgba4444")for(let a=0;a<r;a++){let s=n[a],c=s>>24&255,g=s>>16&255,p=s>>8&255,b=s&255,d=G(b,p,g,c),_=d in l?l[d]:l[d]=yt(b,p,g,c,e);f[a]=_}else{let a=i==="rgb444"?R:D;for(let s=0;s<r;s++){let c=n[s],g=c>>16&255,p=c>>8&255,b=c&255,d=a(b,p,g),_=d in l?l[d]:l[d]=Bt(b,p,g,e);f[s]=_}}return f}function yt(t,e,i,n,r){let o=0,f=1e100;for(let l=0;l<r.length;l++){let x=r[l],a=x[3],s=z(a-n);if(s>f)continue;let c=x[0];if(s+=z(c-t),s>f)continue;let g=x[1];if(s+=z(g-e),s>f)continue;let p=x[2];s+=z(p-i),!(s>f)&&(f=s,o=l)}return o}function Bt(t,e,i,n){let r=0,o=1e100;for(let f=0;f<n.length;f++){let l=n[f],x=l[0],a=z(x-t);if(a>o)continue;let s=l[1];if(a+=z(s-e),a>o)continue;let c=l[2];a+=z(c-i),!(a>o)&&(o=a,r=f)}return r}function ot(t,e,i=5){if(!t.length||!e.length)return;let n=t.map(f=>f.slice(0,3)),r=i*i,o=t[0].length;for(let f=0;f<e.length;f++){let l=e[f];l.length<o?l=[l[0],l[1],l[2],255]:l.length>o?l=l.slice(0,3):l=l.slice();let x=Z(n,l.slice(0,3),E),a=x[0],s=x[1];s>0&&s<=r&&(t[a]=l)}}function z(t){return t*t}function W(t,e,i=E){let n=1/0,r=-1;for(let o=0;o<t.length;o++){let f=t[o],l=i(e,f);l<n&&(n=l,r=o)}return r}function Z(t,e,i=E){let n=1/0,r=-1;for(let o=0;o<t.length;o++){let f=t[o],l=i(e,f);l<n&&(n=l,r=o)}return[r,n]}function it(t,e,i=E){return t[W(t,e,i)]}function ct(t={}){let{initialCapacity:e=4096,auto:i=!0}=t,n=U(e),r=5003,o=new Uint8Array(256),f=new Int32Array(r),l=new Int32Array(r),x=!1;return{reset(){n.reset(),x=!1},finish(){n.writeByte(J.trailer)},bytes(){return n.bytes()},bytesView(){return n.bytesView()},get buffer(){return n.buffer},get stream(){return n},writeHeader:a,writeFrame(s,c,g,p={}){let{transparent:b=!1,transparentIndex:d=0,delay:_=0,palette:u=null,repeat:v=0,colorDepth:B=8,dispose:h=-1}=p,A=!1;if(i?x||(A=!0,a(),x=!0):A=!!p.first,c=Math.max(0,Math.floor(c)),g=Math.max(0,Math.floor(g)),A){if(!u)throw new Error("First frame must include a { palette } option");At(n,c,g,u,B),ft(n,u),v>=0&&Mt(n,v)}let F=Math.round(_/10);_t(n,h,F,b,d);let w=!!u&&!A;It(n,c,g,w?u:null),w&&ft(n,u),Ct(n,s,c,g,B,o,f,l)}};function a(){lt(n,"GIF89a")}}function _t(t,e,i,n,r){t.writeByte(33),t.writeByte(249),t.writeByte(4),r<0&&(r=0,n=!1);var o,f;n?(o=1,f=2):(o=0,f=0),e>=0&&(f=e&7),f<<=2,t.writeByte(0|f|0|o),S(t,i),t.writeByte(r||0),t.writeByte(0)}function At(t,e,i,n,r=8){let l=K(n.length)-1,x=128|r-1<<4|0|l,a=0,s=0;S(t,e),S(t,i),t.writeBytes([x,a,s])}function Mt(t,e){t.writeByte(33),t.writeByte(255),t.writeByte(11),lt(t,"NETSCAPE2.0"),t.writeByte(3),t.writeByte(1),S(t,e),t.writeByte(0)}function ft(t,e){let i=1<<K(e.length);for(let n=0;n<i;n++){let r=[0,0,0];n<e.length&&(r=e[n]),t.writeByte(r[0]),t.writeByte(r[1]),t.writeByte(r[2])}}function It(t,e,i,n){if(t.writeByte(44),S(t,0),S(t,0),S(t,e),S(t,i),n){let f=K(n.length)-1;t.writeByte(128|f)}else t.writeByte(0)}function Ct(t,e,i,n,r=8,o,f,l){tt(i,n,e,r,t,o,f,l)}function S(t,e){t.writeByte(e&255),t.writeByte(e>>8&255)}function lt(t,e){for(var i=0;i<e.length;i++)t.writeByte(e.charCodeAt(i))}function K(t){return Math.max(Math.ceil(Math.log2(t)),1)}var vt=ct;return bt(kt);})();


/*
 * Vencord - Expression Picker Resize
 *
 * Adds a top-left resize handle to Discord's expression picker
 * (GIF / stickers / emoji) and remembers its height.
 *
 * Width is persisted by Discord itself (expressionPickerWidth).
 * Height is stored in %LOCALAPPDATA%\VencordPickerResize\size.json.
 *
 * Loaded in the renderer main world by a small loader appended to
 * Vencord's preload.js. The loader also exposes VencordPickerResize
 * so the saved height is known before the picker is created (no flash).
 */
(() => {
    "use strict";

    // Allow an empty hostname (preload can run before navigation) but
    // don't run in the Monaco editor window or other remote pages.
    if (location.hostname && !/(^|\.)discord\.com$/i.test(location.hostname)) return;

    const INSTALL_FLAG = "__vcExpressionPickerResizeInstalled";
    if (window[INSTALL_FLAG]) return;
    window[INSTALL_FLAG] = true;

    const MIN_WIDTH = 498;
    const MIN_HEIGHT = 320;
    const MAX_HEIGHT = 5000;
    const TOP_MARGIN = 60;
    const HANDLE_CLASS = "vc-picker-resize";
    const STYLE_ID = "vc-picker-resize-style";
    const VARS_STYLE_ID = "vc-picker-resize-vars";
    const HEIGHT_VAR = "--vc-picker-saved-height";

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const round = value => Math.round(value);

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
    min-height: 320px;
    max-height: calc(100vh - 120px);
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
.${HANDLE_CLASS}.active {
    opacity: 1;
    background: var(--background-mod-subtle);
    color: var(--interactive-text-hover);
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
            return window.Vencord?.Settings ?? null;
        } catch {
            return null;
        }
    }

    function loadSavedHeight() {
        const api = getApi();
        if (api && Number.isFinite(api.savedHeight)) {
            return clamp(api.savedHeight, MIN_HEIGHT, MAX_HEIGHT);
        }

        const value = getSettings()?.["vcExpressionPickerSize"];
        const height = Number(value?.height);
        return Number.isFinite(height) ? clamp(height, MIN_HEIGHT, MAX_HEIGHT) : null;
    }

    function saveHeight(height) {
        const value = round(clamp(height, MIN_HEIGHT, MAX_HEIGHT));

        const api = getApi();
        if (api?.saveHeight) {
            try {
                api.saveHeight(value);
            } catch (error) {
                console.error("[PickerResize] Failed to save height", error);
            }
        }

        // Keep a copy in Vencord's settings as a fallback.
        try {
            const settings = getSettings();
            if (settings) {
                settings["vcExpressionPickerSize"] = {
                    ...(settings["vcExpressionPickerSize"] ?? {}),
                    height: value
                };
            }
        } catch { /* ignore */ }
    }

    function setDiscordWidth(width) {
        try {
            const setter = window.Vencord?.Webpack?.findByProps?.("updatedUnsyncedSettings");
            setter?.updatedUnsyncedSettings({ expressionPickerWidth: round(width) });
        } catch {
            // Discord internals changed - width will fall back to its own value.
        }
    }

    function ensureStyleTag() {
        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = STATIC_CSS;
            (document.head || document.documentElement).appendChild(style);
        }
        return style;
    }

    function applySavedHeight(height) {
        if (!Number.isFinite(height)) return;
        ensureStyleTag();

        // Use a stylesheet rule instead of an inline style on <html>: Discord
        // rewrites the <html> style attribute during startup, which would
        // otherwise wipe the variable and bring the resize flash back.
        let vars = document.getElementById(VARS_STYLE_ID);
        if (!vars) {
            vars = document.createElement("style");
            vars.id = VARS_STYLE_ID;
            (document.head || document.documentElement).appendChild(vars);
        }

        // Set this before the picker exists so its very first paint already
        // uses the remembered height (no visible resize flash).
        vars.textContent = `:root { ${HEIGHT_VAR}: ${round(height)}px; }`;
    }

    let savedHeight = loadSavedHeight();

    function initStyle() {
        ensureStyleTag();
        if (savedHeight) applySavedHeight(savedHeight);
    }

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

        if (++attempts > 20) clearInterval(styleRetry);
    }, 250);

    let gifPanelObserver = null;
    let gifPanelEl = null;

    function markGifMedia(media) {
        if (!media || media.__vcGifMarked) return;
        media.__vcGifMarked = true;

        const reveal = () => {
            if (media.__vcGifReady) return;
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
        setTimeout(reveal, 10000);
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

        const panel = document.getElementById("gif-picker-tab-panel");
        if (!panel || panel === gifPanelEl) return;

        gifPanelObserver?.disconnect();
        gifPanelEl = panel;

        gifPanelObserver = new MutationObserver(mutations => {
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
        handle.title = "Redimensionner";
        handle.setAttribute("role", "button");
        handle.setAttribute("aria-label", "Redimensionner la fenêtre");
        handle.innerHTML = `
            <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                <path d="M3.25 3.25 16.75 16.75M3.25 9.25v-6h6M16.75 10.75v6h-6"
                    fill="none" stroke="currentColor" stroke-width="1.7"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

        // Keep Discord's "click outside to close" handler from firing.
        handle.addEventListener("mousedown", event => {
            event.preventDefault();
            event.stopPropagation();
        });

        return handle;
    }

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

        handle.addEventListener("pointerdown", event => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.stopPropagation();

            const rect = drawer.getBoundingClientRect();
            const parentRect = drawer.parentElement.getBoundingClientRect();

            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startWidth: rect.width,
                startHeight: rect.height,
                maxWidth: parentRect.width,
                maxHeight: Math.max(MIN_HEIGHT, rect.bottom - TOP_MARGIN)
            };

            handle.classList.add("active");
            try {
                handle.setPointerCapture(event.pointerId);
            } catch { /* ignore */ }
        });

        handle.addEventListener("pointermove", event => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            event.preventDefault();

            // The picker is anchored bottom-right: dragging left/up enlarges it.
            const width = clamp(drag.startWidth + (drag.startX - event.clientX), MIN_WIDTH, drag.maxWidth);
            const height = clamp(drag.startHeight + (drag.startY - event.clientY), MIN_HEIGHT, drag.maxHeight);

            drawer.style.width = `${round(width)}px`;
            drawer.style.height = `${round(height)}px`;
        });

        const finishDrag = event => {
            if (!drag || event.pointerId !== drag.pointerId) return;

            drag = null;
            handle.classList.remove("active");
            try {
                handle.releasePointerCapture(event.pointerId);
            } catch { /* ignore */ }

            const rect = drawer.getBoundingClientRect();
            savedHeight = rect.height;

            // Update the CSS variable so the next opening has the right size
            // from its first paint.
            applySavedHeight(rect.height);
            saveHeight(rect.height);
            setDiscordWidth(rect.width);
        };

        handle.addEventListener("pointerup", finishDrag);
        handle.addEventListener("pointercancel", finishDrag);
    }

    function initFromLayer(layer) {
        const drawer = layer.querySelector?.('[class*="drawerSizingWrapper"]');
        if (drawer) {
            initDrawer(drawer);
            return;
        }

        const observer = new MutationObserver(() => {
            const found = layer.querySelector?.('[class*="drawerSizingWrapper"]');
            if (!found) return;
            observer.disconnect();
            initDrawer(found);
        });
        observer.observe(layer, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 2000);
    }

    function startPickerObserver() {
        if (!document.body) return false;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches?.('[class*="expressionPickerPositionLayer"]')) {
                        initFromLayer(node);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return true;
    }

    function tick() {
        const drawer = document.querySelector('[class*="expressionPickerPositionLayer"] [class*="drawerSizingWrapper"]');
        if (drawer) initDrawer(drawer);
        setupGifObserver();
    }

    if (!startPickerObserver()) {
        document.addEventListener("DOMContentLoaded", startPickerObserver, { once: true });
    }
    tick();
    setInterval(tick, 300);
})();

/*
 * Vencord Expression Picker Resize - local GIF imports
 * Adds an import button to the GIF page, converts files to GIF and
 * shows them in a local "Imported" section of the Favorites tab.
 */
(() => {
    "use strict";

    if (location.hostname && !/(^|\.)discord\.com$/i.test(location.hostname)) return;
    if (window.__vcPickerImportInstalled) return;
    window.__vcPickerImportInstalled = true;

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
    const ACCEPT = [
        ".gif", ".png", ".jpg", ".jpeg", ".webp", ".avif", ".apng", ".bmp",
        "image/gif", "image/png", "image/jpeg", "image/webp", "image/avif", "image/apng", "image/bmp",
        ".mp4", ".webm", ".mov", ".mkv", ".m4v",
        "video/mp4", "video/webm", "video/quicktime", "video/x-matroska"
    ].join(",");

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const yieldUI = () => new Promise(resolve => setTimeout(resolve, 0));
    const fit = (width, height) => {
        if (!width || !height) return { width: 1, height: 1 };
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
    let section = null;
    let list = null;
    let statusEl = null;
    let statusTimer = 0;
    let busy = false;

    function openDB() {
        if (!dbPromise) {
            dbPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(STORE)) {
                        db.createObjectStore(STORE, { keyPath: "id" });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
        return dbPromise;
    }

    async function getAllImports() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, "readonly");
            const request = tx.objectStore(STORE).getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async function putImport(record) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, "readwrite");
            tx.objectStore(STORE).put(record);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function removeImport(id) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, "readwrite");
            tx.objectStore(STORE).delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    function findDrawer() {
        return document.querySelector('[class*="expressionPickerPositionLayer"] [class*="drawerSizingWrapper"]');
    }

    function findPanel() {
        return document.getElementById("gif-picker-tab-panel");
    }

    function isFavoritesView(panel) {
        return !!panel?.querySelector('[class*="favoritesHeader"]');
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
            handleFiles(files);
        });
        document.body.appendChild(input);
    }

    function ensureButton() {
        if (button?.isConnected) return button;

        button = document.createElement("button");
        button.type = "button";
        button.className = "vc-gif-import";
        button.title = "Importer des GIF";
        button.setAttribute("aria-label", "Importer des GIF");
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M12 16V4m0 0L8 8m4-4 4 4M5 15v4h14v-4"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        button.addEventListener("click", event => {
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
            }, 3500);
        }
    }

    function ensureSection(panel) {
        if (section?.isConnected) return section;

        section = document.createElement("div");
        section.className = "vc-local-gifs";
        section.innerHTML = `
            <div class="vc-local-gifs-title"><span>Importés</span></div>
            <div class="vc-local-gifs-list"></div>`;
        list = section.querySelector(".vc-local-gifs-list");

        const header = panel.querySelector(":scope > [class*=\"header_\"]");
        if (header) header.after(section);
        else panel.prepend(section);
        return section;
    }

    function renderSection() {
        const panel = findPanel();
        if (!panel) {
            section?.remove();
            return;
        }
        if (!isFavoritesView(panel) || imports.length === 0) {
            section?.remove();
            return;
        }

        ensureSection(panel);
        if (!section?.isConnected) return;
        if (!section.isConnected || section.parentElement !== panel) {
            const header = panel.querySelector(":scope > [class*=\"header_\"]");
            if (header) header.after(section);
            else panel.prepend(section);
        }

        const title = section.querySelector(".vc-local-gifs-title span");
        if (title) title.textContent = `Importés (${imports.length})`;

        list.textContent = "";
        for (const record of imports) {
            const item = document.createElement("div");
            item.className = "vc-local-item";

            const attach = document.createElement("button");
            attach.type = "button";
            attach.className = "vc-local-attach";
            attach.title = "Ajouter au message";
            attach.setAttribute("aria-label", `Ajouter ${record.name} au message`);

            const image = document.createElement("img");
            image.src = objectUrls.get(record.id) || "";
            image.alt = record.name;
            image.loading = "lazy";
            image.draggable = false;
            attach.appendChild(image);
            attach.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                attachToComposer(record);
            });

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "vc-local-delete";
            remove.title = "Supprimer";
            remove.setAttribute("aria-label", `Supprimer ${record.name}`);
            remove.textContent = "×";
            remove.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                deleteRecord(record);
            });

            item.append(attach, remove);
            list.appendChild(item);
        }
    }

    function maintain() {
        const currentDrawer = findDrawer();
        const panel = findPanel();

        if (currentDrawer !== drawer) {
            drawer = currentDrawer;
            button = drawer?.querySelector(".vc-gif-import") ?? null;
            statusEl = drawer?.querySelector(".vc-import-status") ?? null;
            section = drawer?.querySelector(".vc-local-gifs") ?? null;
            list = section?.querySelector(".vc-local-gifs-list") ?? null;
        }

        if (!drawer?.isConnected) {
            drawer = null;
            button = null;
            statusEl = null;
            section = null;
            list = null;
            return;
        }

        ensureInput();
        const btn = ensureButton();
        btn.style.display = panel ? "flex" : "none";
        btn.disabled = busy;

        if (!panel) {
            section?.remove();
            section = null;
            list = null;
            statusEl?.remove();
            statusEl = null;
            return;
        }

        renderSection();
    }

    async function loadImports() {
        try {
            imports = (await getAllImports()).sort((a, b) => b.createdAt - a.createdAt);
        } catch (error) {
            console.error("[PickerImport] Failed to load imports", error);
            imports = [];
        }

        for (const url of objectUrls.values()) URL.revokeObjectURL(url);
        objectUrls.clear();
        for (const record of imports) {
            objectUrls.set(record.id, URL.createObjectURL(record.blob));
        }
        renderSection();
    }

    function attachToComposer(record) {
        const common = window.Vencord?.Webpack?.Common;
        const uploadManager = common?.UploadManager;
        const channelId = common?.SelectedChannelStore?.getChannelId?.();
        if (!uploadManager || !channelId) {
            setStatus("Impossible de joindre le GIF", true);
            return;
        }

        const file = new File([record.blob], record.name, { type: "image/gif" });
        const upload = {
            id: `vc-import-${record.id}`,
            file,
            platform: 1, // WEB
            origin: "file_picker"
        };

        uploadManager.addFile({
            file: upload,
            channelId,
            draftType: 0, // ChannelMessage
            allowOptimization: false
        });

        setStatus("GIF joint au message");
        document.querySelector('[data-slate-editor="true"]')?.focus?.();
    }

    async function deleteRecord(record) {
        try {
            await removeImport(record.id);
        } catch (error) {
            console.error("[PickerImport] Failed to delete import", error);
            setStatus("Impossible de supprimer le GIF", true);
            return;
        }
        const url = objectUrls.get(record.id);
        if (url) URL.revokeObjectURL(url);
        objectUrls.delete(record.id);
        imports = imports.filter(item => item.id !== record.id);
        renderSection();
        setStatus("GIF supprimé");
    }

    async function handleFiles(files) {
        if (busy || files.length === 0) return;
        busy = true;
        if (button) button.disabled = true;

        let added = 0;
        let failed = 0;
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            setStatus(`Conversion ${index + 1}/${files.length} : ${file.name}`, false, true);
            try {
                const record = await importFile(file);
                await putImport(record);
                added++;
            } catch (error) {
                failed++;
                console.error("[PickerImport]", file.name, error);
                setStatus(`${file.name} : ${error?.message || "échec de la conversion"}`, true);
                await sleep(1300);
            }
            await yieldUI();
        }

        await loadImports();
        busy = false;
        if (button) button.disabled = false;
        if (added > 0) {
            setStatus(`${added} GIF importé${added > 1 ? "s" : ""}`);
        } else if (failed > 0) {
            setStatus("Aucun GIF importé", true);
        } else {
            setStatus("");
        }
    }

    async function importFile(file) {
        if (file.size > MAX_INPUT_BYTES) {
            throw new Error("fichier trop volumineux (max 100 Mo)");
        }

        const type = (file.type || "").toLowerCase();
        const name = file.name.toLowerCase();
        let result;

        if (type === "image/gif" || name.endsWith(".gif")) {
            if (file.size > MAX_OUTPUT_BYTES) {
                throw new Error("GIF trop lourd (max 8 Mo)");
            }
            const dimensions = await measureImage(file);
            result = { blob: file, width: dimensions.width, height: dimensions.height };
        } else if (type.startsWith("video/") || /\.(mp4|webm|mov|mkv|m4v)$/i.test(name)) {
            result = await convertVideo(file);
        } else if (type.startsWith("image/") || /\.(png|jpe?g|webp|avif|apng|bmp)$/i.test(name)) {
            result = await convertImage(file);
        } else {
            throw new Error("format non pris en charge");
        }

        if (!result?.blob || result.blob.size > MAX_OUTPUT_BYTES) {
            throw new Error("GIF converti trop lourd (max 8 Mo)");
        }

        return {
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name.replace(/\.[^.]+$/, "") + ".gif",
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
            return dimensions;
        } catch {
            return new Promise((resolve, reject) => {
                const image = new Image();
                const url = URL.createObjectURL(blob);
                image.onload = () => {
                    URL.revokeObjectURL(url);
                    resolve({ width: image.naturalWidth, height: image.naturalHeight });
                };
                image.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error("image illisible"));
                };
                image.src = url;
            });
        }
    }

    async function convertImage(file) {
        if (typeof ImageDecoder === "function") {
            let decoder = null;
            try {
                const data = await file.arrayBuffer();
                decoder = new ImageDecoder({ data, type: file.type || "image/png" });
                await decoder.tracks.ready;
                const track = decoder.tracks.selectedTrack;
                const frameCount = Math.max(1, Math.min(track?.frameCount ?? 1, MAX_IMAGE_FRAMES));

                const first = await decoder.decode({ frameIndex: 0 });
                const sourceWidth = first.image.displayWidth || first.image.codedWidth;
                const sourceHeight = first.image.displayHeight || first.image.codedHeight;
                const { width, height } = fit(sourceWidth, sourceHeight);

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext("2d", { willReadFrequently: true });
                context.imageSmoothingQuality = "high";

                const frames = [];
                let totalDelay = 0;
                for (let index = 0; index < frameCount && totalDelay < MAX_DURATION * 1000; index++) {
                    const frame = index === 0 ? first : await decoder.decode({ frameIndex: index });
                    const rawDuration = frame.image.duration;
                    const delay = frameCount === 1
                        ? 1000
                        : Math.min(1000, Math.max(20, Math.round((rawDuration || 100000) / 1000)));

                    context.clearRect(0, 0, width, height);
                    context.drawImage(frame.image, 0, 0, width, height);
                    frames.push({
                        data: context.getImageData(0, 0, width, height).data,
                        delay
                    });
                    frame.image.close?.();
                    totalDelay += delay;
                    if (index % 2 === 0) await yieldUI();
                }

                if (frames.length === 0) throw new Error("aucune image décodée");
                return {
                    blob: encodeFrames(frames, width, height),
                    width,
                    height
                };
            } catch (error) {
                console.warn("[PickerImport] ImageDecoder failed, trying static image", error);
            } finally {
                try { decoder?.close?.(); } catch { /* ignore */ }
            }
        }

        const bitmap = await createImageBitmap(file);
        const { width, height } = fit(bitmap.width, bitmap.height);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.imageSmoothingQuality = "high";
        context.drawImage(bitmap, 0, 0, width, height);
        bitmap.close?.();
        return {
            blob: encodeFrames([{
                data: context.getImageData(0, 0, width, height).data,
                delay: 1000
            }], width, height),
            width,
            height
        };
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
                const timeout = setTimeout(() => reject(new Error("délai de lecture vidéo dépassé")), 15000);
                video.onloadedmetadata = () => {
                    clearTimeout(timeout);
                    resolve();
                };
                video.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error("format vidéo non pris en charge"));
                };
            });

            const sourceWidth = video.videoWidth;
            const sourceHeight = video.videoHeight;
            if (!sourceWidth || !sourceHeight) throw new Error("dimensions vidéo invalides");

            const { width, height } = fit(sourceWidth, sourceHeight);
            const duration = Number.isFinite(video.duration) && video.duration > 0
                ? Math.min(video.duration, MAX_DURATION)
                : MAX_DURATION;
            const frameCount = Math.max(1, Math.min(MAX_VIDEO_FRAMES, Math.ceil(duration * FPS)));

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d", { willReadFrequently: true });
            context.imageSmoothingQuality = "high";

            const frames = [];
            for (let index = 0; index < frameCount; index++) {
                const time = Math.min(Math.max(0, duration - 0.001), index / FPS);
                await seekVideo(video, time);
                context.clearRect(0, 0, width, height);
                context.drawImage(video, 0, 0, width, height);
                frames.push({
                    data: context.getImageData(0, 0, width, height).data,
                    delay: Math.round(1000 / FPS)
                });
                if (index % 2 === 0) await yieldUI();
            }

            return {
                blob: encodeFrames(frames, width, height),
                width,
                height
            };
        } finally {
            try { video.pause(); } catch { /* ignore */ }
            video.removeAttribute("src");
            try { video.load(); } catch { /* ignore */ }
            URL.revokeObjectURL(url);
        }
    }

    function seekVideo(video, time) {
        return new Promise((resolve, reject) => {
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                video.removeEventListener("seeked", finish);
                resolve();
            };
            const timeout = setTimeout(() => {
                if (settled) return;
                settled = true;
                video.removeEventListener("seeked", finish);
                reject(new Error("délai de conversion vidéo dépassé"));
            }, 7000);

            if (Math.abs(video.currentTime - time) < 0.001 && video.readyState >= 2) {
                requestAnimationFrame(finish);
                return;
            }
            video.addEventListener("seeked", finish);
            try {
                video.currentTime = time;
            } catch (error) {
                clearTimeout(timeout);
                video.removeEventListener("seeked", finish);
                reject(error);
            }
        });
    }

    function encodeFrames(frames, width, height) {
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

    function injectStyle() {
        if (document.getElementById("vc-picker-import-style")) return;
        const style = document.createElement("style");
        style.id = "vc-picker-import-style";
        style.textContent = `
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
.vc-local-gifs {
    flex: 0 0 auto;
    padding: 8px 12px 10px;
    background: var(--background-base-lower);
    border-bottom: 1px solid var(--border-subtle);
}
.vc-local-gifs-title {
    margin-bottom: 6px;
    color: var(--text-muted);
    font: 600 11px/14px var(--font-primary, sans-serif);
    letter-spacing: 0.02em;
    text-transform: uppercase;
}
.vc-local-gifs-list {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 2px;
}
.vc-local-item {
    position: relative;
    flex: 0 0 auto;
    width: 96px;
    height: 72px;
}
.vc-local-attach {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    border-radius: 6px;
    overflow: hidden;
    background: var(--background-mod-subtle);
    cursor: pointer;
}
.vc-local-attach img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.vc-local-attach:hover {
    outline: 2px solid var(--border-focus);
    outline-offset: -2px;
}
.vc-local-delete {
    position: absolute;
    top: 2px;
    right: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--background-surface-high);
    color: var(--text-default);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.12s, background-color 0.12s;
}
.vc-local-item:hover .vc-local-delete {
    opacity: 1;
}
.vc-local-delete:hover {
    background: var(--status-danger);
    color: #fff;
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
        (document.head || document.documentElement).appendChild(style);
    }

    function start() {
        if (!document.documentElement) {
            setTimeout(start, 50);
            return;
        }
        injectStyle();
        setInterval(maintain, 250);
        maintain();
        loadImports();
    }

    start();
})();
