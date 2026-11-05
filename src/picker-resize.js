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
 * shows them in a dedicated "Importés" category of the GIF picker.
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
    let statusEl = null;
    let statusTimer = 0;
    let busy = false;

    let categoryCard = null;
    let categoryPreviewId = "";
    let importedView = false;
    let importedQuery = "";
    let overlay = null;
    let overlayKey = "";
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

    function scheduleMaintain() {
        if (maintainScheduled) return;
        maintainScheduled = true;
        queueMicrotask(() => {
            maintainScheduled = false;
            maintain();
        });
    }

    function ensurePickerObserver(drawerNode) {
        if (observedDrawer === drawerNode) return;
        pickerObserver?.disconnect();
        pickerObserver = null;
        observedDrawer = drawerNode;
        if (!drawerNode) return;
        pickerObserver = new MutationObserver(records => {
            const hasElementMutation = records.some(record =>
                [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === Node.ELEMENT_NODE)
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
        if (value === "root" || value === "favorites" || value === "imports") {
            return { type: value };
        }
        if (value && ["root", "favorites", "imports"].includes(value.type)) {
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
        } catch { /* ignore */ }
        return { type: "favorites" };
    }

    function saveLastView(view) {
        lastView = normalizeLastView(view);
        try {
            document.cookie = `${LAST_VIEW_COOKIE}=${encodeURIComponent(JSON.stringify(lastView))}; path=/; max-age=31536000; SameSite=Lax`;
        } catch { /* ignore */ }
    }

    function requestRestore() {
        restorePending = true;
        restoreTarget = normalizeLastView(lastView);
        restoreDeadline = Date.now() + 5000;
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
        const backButton = panel.querySelector(".backButton_fed6d3");
        const hasBack = !!backButton;
        const favoritesView = !!panel.querySelector('[class*="favoritesHeader"]');
        const searchValue = panel.querySelector('input[role="searchbox"]')?.value?.trim() || "";
        const favoritesCard = panel.querySelector('.content_fed6d3 .result__2dc39[role="button"][aria-label="Favoris"]');

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
                const clearButton = panel.querySelector('[class*="clearButton"]');
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
                const card = [...panel.querySelectorAll('.content_fed6d3 .result__2dc39[role="button"]')]
                    .find(item => item.getAttribute("aria-label") === target.label);
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
        const backButton = panel?.querySelector(".backButton_fed6d3");
        if (!backButton || backButton.dataset.vcViewTracking) return;
        backButton.dataset.vcViewTracking = "1";
        backButton.addEventListener("click", () => handleViewTracking({ type: "root" }), true);
    }

    function findRootGrid(panel) {
        const cards = panel?.querySelectorAll('.content_fed6d3 .result__2dc39[role="button"]');
        if (!cards || cards.length === 0) return null;
        const favoritesCard = cards[0];
        if (favoritesCard.getAttribute("aria-label") !== "Favoris") return null;
        const wrapper = favoritesCard.parentElement;
        if (!wrapper) return null;
        return { favoritesCard, wrapper };
    }

    function isRootGifView(panel) {
        if (!panel || panel.querySelector(".backButton_fed6d3")) return false;
        const search = panel.querySelector('input[role="searchbox"]');
        if (search && search.value.trim()) return false;
        return !!findRootGrid(panel);
    }

    function reflowRootGrid(wrapper) {
        const cards = [...wrapper.children].filter(child => child.classList?.contains("result__2dc39"));
        if (cards.length === 0) return;

        const containerWidth = wrapper.clientWidth || wrapper.parentElement?.clientWidth || 806;
        const columns = Math.min(
            Math.max(Math.floor(containerWidth / DESIRED_TILE_WIDTH), 1),
            MAX_ROOT_COLUMNS
        );
        const tileWidth = (containerWidth - GRID_GAP * 2 - (columns - 1) * GRID_GAP) / columns;

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

    function createCategoryCard() {
        const card = document.createElement("div");
        card.className = "result__2dc39 vc-imported-category";
        card.style.position = "absolute";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", "Importés");
        card.innerHTML = `
            <img class="vc-imported-category-preview" alt="" draggable="false">
            <div class="vc-imported-category-fade"></div>
            <div class="categoryText_d02962 vc-imported-category-text">
                ${UPLOAD_ICON}
                <span class="categoryName_d02962">Importés</span>
            </div>
            <span class="vc-imported-category-count"></span>`;

        const open = event => {
            event.preventDefault();
            event.stopPropagation();
            openImportedView();
        };
        card.addEventListener("click", open);
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") open(event);
        });
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
            const cards = [...wrapper.children].filter(child => child.classList?.contains("result__2dc39"));
            const firstHeight = parseFloat(first?.style.height) || 0;
            const uniform = cards.every(card => Math.abs((parseFloat(card.style.height) || 0) - firstHeight) < 0.5);
            if (first?.getAttribute("aria-label") === "Favoris" && uniform) reflowRootGrid(wrapper);
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
        if (!categoryCard.isConnected
            || categoryCard.parentElement !== grid.wrapper
            || grid.favoritesCard.nextElementSibling !== categoryCard) {
            grid.favoritesCard.after(categoryCard);
        }

        for (const card of grid.wrapper.children) {
            if (card === categoryCard || !card.classList?.contains("result__2dc39") || card.dataset.vcViewTracking) continue;
            card.dataset.vcViewTracking = "1";
            card.addEventListener("click", () => {
                if (card === grid.wrapper.firstElementChild) {
                    handleViewTracking({ type: "favorites" });
                    return;
                }
                const label = card.getAttribute("aria-label");
                if (label && label !== "Importés") handleViewTracking({ type: "category", label });
            });
        }

        updateCategoryCardContent();
        reflowRootGrid(grid.wrapper);
    }

    function createImportedView() {
        const view = document.createElement("div");
        view.className = "vc-imported-view";
        view.innerHTML = `
            <div class="vc-imported-header">
                <div class="vc-imported-back" role="button" tabindex="0" aria-label="Retour">${BACK_ICON}</div>
                <h3 class="vc-imported-title">Importés</h3>
                <span class="vc-imported-count"></span>
                <div class="vc-imported-search">
                    <div class="vc-imported-search-icon">${SEARCH_ICON}</div>
                    <input class="vc-imported-search-input" type="text" role="searchbox"
                        placeholder="Rechercher dans les importés"
                        aria-label="Rechercher dans les importés">
                    <div class="vc-imported-search-clear" role="button" tabindex="0"
                        aria-label="Effacer" data-visible="false">${CLEAR_ICON}</div>
                </div>
            </div>
            <div class="vc-imported-scroll">
                <div class="vc-imported-grid"></div>
                <div class="vc-imported-empty">
                    <span>Aucun GIF importé pour le moment</span>
                </div>
            </div>`;

        const back = view.querySelector(".vc-imported-back");
        const close = event => {
            event.preventDefault();
            event.stopPropagation();
            finishRestore();
            closeImportedView();
            saveLastView({ type: "root" });
            document.querySelector(".backButton_fed6d3")?.click();
        };
        back.addEventListener("click", close);
        back.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") close(event);
        });

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
        searchInput.addEventListener("keydown", event => {
            if (event.key === "Escape" && searchInput.value) {
                event.preventDefault();
                searchInput.value = "";
                importedQuery = "";
                syncClear();
                renderImportedView(true);
            }
        });

        const clear = event => {
            event.preventDefault();
            event.stopPropagation();
            searchInput.value = "";
            importedQuery = "";
            syncClear();
            renderImportedView(true);
            searchInput.focus();
        };
        clearButton.addEventListener("click", clear);
        clearButton.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") clear(event);
        });
        syncClear();

        return view;
    }

    function renderImportedView(force = false) {
        if (!overlay?.isConnected) return;

        const nativeMatches = getImportedNativeMatches();
        const favoriteKeysById = new Map();
        for (const { record, entry } of nativeMatches) {
            let keys = favoriteKeysById.get(record.id);
            if (!keys) {
                keys = new Set();
                favoriteKeysById.set(record.id, keys);
            }
            keys.add(entry.key);
        }

        const key = imports
            .map(record => `${record.id}:${favoriteKeysById.has(record.id) ? "1" : "0"}`)
            .join("|");
        if (!force && key === overlayKey) return;
        overlayKey = key;

        const grid = overlay.querySelector(".vc-imported-grid");
        const empty = overlay.querySelector(".vc-imported-empty");
        const count = overlay.querySelector(".vc-imported-count");

        const query = importedQuery.trim().toLowerCase();
        const visibleImports = query
            ? imports.filter(record => record.name.toLowerCase().includes(query))
            : imports;

        if (imports.length === 0) {
            count.textContent = "";
        } else if (query) {
            count.textContent = `${visibleImports.length} résultat${visibleImports.length > 1 ? "s" : ""}`;
        } else {
            count.textContent = `${imports.length} GIF${imports.length > 1 ? "s" : ""}`;
        }

        const emptyLabel = empty.querySelector("span");
        if (emptyLabel) {
            emptyLabel.textContent = query
                ? `Aucun résultat pour « ${importedQuery.trim()} »`
                : "Aucun GIF importé pour le moment";
        }
        empty.style.display = visibleImports.length === 0 ? "flex" : "none";
        grid.style.display = "grid";
        grid.textContent = "";

        if (!query) {
            const addTile = document.createElement("button");
            addTile.type = "button";
            addTile.className = "vc-imported-tile vc-imported-add";
            addTile.dataset.aspect = "1";
            addTile.setAttribute("aria-label", "Importer des GIF");
            addTile.innerHTML = `
                <span class="vc-imported-add-icon">${UPLOAD_ICON}</span>
                <span class="vc-imported-add-label">Importer</span>`;
            addTile.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                if (!busy) input?.click();
            });
            grid.appendChild(addTile);
        }

        for (const record of visibleImports) {
            const tile = document.createElement("div");
            tile.className = "vc-imported-tile";
            tile.dataset.aspect = record.width && record.height
                ? String(record.height / record.width)
                : "1";

            const attach = document.createElement("button");
            attach.type = "button";
            attach.className = "vc-imported-attach";
            attach.setAttribute("aria-label", `Ajouter ${record.name} au message`);

            const image = document.createElement("img");
            image.src = objectUrls.get(record.id) || "";
            image.alt = "";
            image.loading = "lazy";
            image.draggable = false;
            attach.appendChild(image);
            attach.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                attachToComposer(record);
            });

            const favoriteKeys = favoriteKeysById.get(record.id);
            const isFavorite = !!favoriteKeys?.size;

            const favorite = document.createElement("div");
            favorite.className = `favButton__2dc39 gifFavoriteButton__43deb vc-imported-favorite${isFavorite ? " selected__43deb" : ""}`;
            favorite.setAttribute("role", "button");
            favorite.setAttribute("tabindex", "0");
            favorite.setAttribute("aria-label", isFavorite ? "Retirer des favoris" : "Ajouter aux favoris");
            favorite.innerHTML = STAR_ICON;

            const toggleFavorite = event => {
                event.preventDefault();
                event.stopPropagation();
                const keys = [...new Set(getFavoriteKeysForRecord(record))];
                if (keys.length === 0) {
                    setStatus("Envoie d'abord ce GIF pour le mettre en favori");
                    return;
                }

                const unfavorite = getUnfavoriteAction();
                if (!unfavorite) {
                    setStatus("Impossible de modifier les favoris", true);
                    return;
                }

                for (const key of keys) {
                    try {
                        unfavorite(key);
                    } catch (error) {
                        console.error("[PickerImport] Failed to remove favorite", error);
                    }
                }
                setStatus("GIF retiré des favoris");
                setTimeout(() => renderImportedView(true), 350);
            };
            favorite.addEventListener("click", toggleFavorite);
            favorite.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") toggleFavorite(event);
            });

            const remove = document.createElement("div");
            remove.className = "favButton__2dc39 gifFavoriteButton__43deb vc-imported-delete";
            remove.setAttribute("role", "button");
            remove.setAttribute("tabindex", "0");
            remove.setAttribute("aria-label", `Supprimer ${record.name}`);
            remove.innerHTML = TRASH_ICON;

            const activate = event => {
                event.preventDefault();
                event.stopPropagation();
                deleteImportedCompletely([record], getFavoriteKeysForRecord(record));
            };
            remove.addEventListener("click", activate);
            remove.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") activate(event);
            });

            tile.append(attach, favorite, remove);
            grid.appendChild(tile);
        }

        layoutImportedTiles(true);
    }

    function layoutImportedTiles(force = false) {
        if (!overlay?.isConnected) return;
        const grid = overlay.querySelector(".vc-imported-grid");
        const tiles = [...(grid?.children || [])];
        if (!grid) return;

        const containerWidth = overlay.clientWidth;
        if (!containerWidth) return;

        if (tiles.length === 0) {
            grid.style.width = `${containerWidth}px`;
            grid.style.height = "0px";
            return;
        }
        if (!force && containerWidth === overlayLayoutWidth) return;
        overlayLayoutWidth = containerWidth;

        const columns = Math.min(Math.max(Math.floor(containerWidth / DESIRED_TILE_WIDTH), 1), MAX_COLUMNS);
        const tileWidth = (containerWidth - GRID_GAP * 2 - (columns - 1) * GRID_GAP) / columns;
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
        grid.style.height = `${Math.max(...heights) - GRID_GAP}px`;
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
        overlayKey = "";
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
            overlayKey = "";
            overlayLayoutWidth = 0;
        }

        renderImportedView(false);
        layoutImportedTiles();
    }

    function getNativeFavoriteEntries() {
        const gifs = window.Vencord?.Webpack?.Common?.UserSettingsProtoStore
            ?.frecencyWithoutFetchingLatest?.favoriteGifs?.gifs;
        if (!gifs) return [];

        const entries = [];
        for (const [key, gif] of Object.entries(gifs)) {
            const src = gif.src || gif.url || gif.gifSrc;
            if (!src) continue;
            try {
                const pathname = new URL(src, location.href).pathname.toLowerCase();
                const name = decodeURIComponent(pathname.split("/").pop() || "").toLowerCase();
                if (!name) continue;
                entries.push({ key, pathname, name, width: gif.width, height: gif.height });
            } catch { /* ignore */ }
        }
        return entries;
    }

    function getImportedNativeMatches() {
        const entries = getNativeFavoriteEntries();
        const matches = [];

        for (const record of imports) {
            const name = record.name.toLowerCase();
            for (const entry of entries) {
                if (entry.name !== name) continue;
                if (entry.width && record.width && Math.abs(entry.width - record.width) > 2) continue;
                if (entry.height && record.height && Math.abs(entry.height - record.height) > 2) continue;
                matches.push({ record, entry });
            }
        }

        return matches;
    }

    function getFavoriteKeysForRecord(record) {
        return getImportedNativeMatches()
            .filter(match => match.record.id === record.id)
            .map(match => match.entry.key);
    }

    function getUnfavoriteAction() {
        try {
            const module = window.Vencord?.Webpack?.findByProps?.("Tr", "wg");
            if (typeof module?.Tr === "function") return module.Tr;
        } catch { /* ignore */ }
        return null;
    }

    function createNativeDeleteButton() {
        const button = document.createElement("div");
        button.className = "favButton__2dc39 gifFavoriteButton__43deb vc-native-delete";
        button.setAttribute("role", "button");
        button.setAttribute("tabindex", "0");
        button.setAttribute("aria-label", "Supprimer complètement ce GIF importé");
        button.innerHTML = TRASH_ICON;

        const activate = event => {
            event.preventDefault();
            event.stopPropagation();
            const records = button.__records || [];
            const favoriteKeys = button.__favoriteKeys || [];
            deleteImportedCompletely(records, favoriteKeys);
        };
        button.addEventListener("click", activate);
        button.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") activate(event);
        });
        return button;
    }

    function maintainNativeDeleteButtons(panel) {
        const favoritesView = !!panel?.querySelector('[class*="favoritesHeader"]');
        if (!favoritesView) {
            panel?.querySelectorAll(".vc-native-delete").forEach(button => button.remove());
            return;
        }

        const matches = getImportedNativeMatches();
        const byPath = new Map();
        for (const { record, entry } of matches) {
            let match = byPath.get(entry.pathname);
            if (!match) {
                match = { records: [], entries: [] };
                byPath.set(entry.pathname, match);
            }
            if (!match.records.includes(record)) match.records.push(record);
            if (!match.entries.includes(entry)) match.entries.push(entry);
        }

        const seen = new Set();
        const tiles = panel.querySelectorAll('.content_fed6d3 .result__2dc39[role="button"]');
        for (const tile of tiles) {
            const media = tile.querySelector("img, video");
            const src = media?.currentSrc || media?.src;
            if (!src) continue;

            let pathname;
            try {
                pathname = new URL(src, location.href).pathname.toLowerCase();
            } catch {
                continue;
            }

            const match = byPath.get(pathname);
            if (!match) continue;

            seen.add(tile);
            let button = tile.querySelector(".vc-native-delete");
            if (!button) {
                button = createNativeDeleteButton();
                tile.appendChild(button);
            }
            button.__records = match.records;
            button.__favoriteKeys = match.entries.map(entry => entry.key);
        }

        panel.querySelectorAll(".vc-native-delete").forEach(button => {
            if (!seen.has(button.parentElement)) button.remove();
        });
    }

    async function deleteImportedCompletely(records, favoriteKeys) {
        if (!records?.length) return;

        const unfavorite = getUnfavoriteAction();
        if (unfavorite) {
            for (const key of new Set(favoriteKeys)) {
                try {
                    unfavorite(key);
                } catch (error) {
                    console.error("[PickerImport] Failed to remove native favorite", error);
                }
            }
        }

        for (const record of records) {
            await deleteRecord(record);
        }

        if (favoriteKeys.length > 0) setStatus("GIF et favori supprimés");
    }

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
            panel.querySelectorAll(".vc-native-delete").forEach(button => button.remove());
        } else {
            maintainNativeDeleteButtons(panel);
        }
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
        categoryPreviewId = "";
        if (overlay) renderImportedView(true);
        updateCategoryCardContent();
    }

    function closePicker() {
        try {
            const store = window.Vencord?.Webpack?.Common?.ExpressionPickerStore;
            if (typeof store?.closeExpressionPicker === "function") {
                store.closeExpressionPicker();
                return true;
            }
        } catch { /* ignore */ }
        try {
            const actions = window.Vencord?.Webpack?.findByProps?.("v8", "RQ");
            if (typeof actions?.v8 === "function") {
                actions.v8();
                return true;
            }
        } catch { /* ignore */ }
        return false;
    }

    function focusComposerWhenReady(attempt = 0) {
        if (findDrawer()) {
            if (attempt < 12) setTimeout(() => focusComposerWhenReady(attempt + 1), 50);
            return;
        }

        const editor = document.querySelector('[data-slate-editor="true"]');
        if (editor?.isConnected) {
            editor.focus();
            if (document.activeElement === editor) return;
        }

        if (attempt < 12) setTimeout(() => focusComposerWhenReady(attempt + 1), 50);
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

        const closed = closePicker();
        focusComposerWhenReady();
        if (!closed) setStatus("GIF joint au message");
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
        renderImportedView(true);
        updateCategoryCardContent();
        setStatus("GIF importé supprimé");
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
            openImportedView();
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
        (document.head || document.documentElement).appendChild(style);
    }

    function start() {
        if (!document.documentElement) {
            setTimeout(start, 50);
            return;
        }
        injectStyle();
        window.addEventListener("resize", scheduleMaintain, { passive: true });
        document.addEventListener("click", event => {
            const tile = event.target.closest?.('.result__2dc39[role="button"]');
            if (!tile) return;
            if (event.target.closest?.('[class*="favButton"]')) return;
            if (!document.querySelector('[class*="favoritesHeader"]')) return;
            focusComposerWhenReady();
        }, true);
        setInterval(maintain, 250);
        maintain();
        loadImports();
    }

    start();
})();
