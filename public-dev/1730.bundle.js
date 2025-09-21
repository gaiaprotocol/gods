/*! For license information please see 1730.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkgods=self.webpackChunkgods||[]).push([[1730],{6399:(t,e,i)=>{i.d(e,{J:()=>a.J});var a=i(25675)},21969:(t,e,i)=>{i.d(e,{H:()=>a.H});var a=i(46445)},37695:(t,e,i)=>{var a=i(26535),n=i(82073),o=i(21969),r=i(53183),s=i(59640);const c=a.AH`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var l=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let h=class extends a.WF{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`\n      --local-align: ${this.align};\n      --local-color: var(--wui-color-${this.color});\n    `,a.qy`<slot class=${(0,o.H)(t)}></slot>`}};h.styles=[r.W5,c],l([(0,n.MZ)()],h.prototype,"variant",void 0),l([(0,n.MZ)()],h.prototype,"color",void 0),l([(0,n.MZ)()],h.prototype,"align",void 0),l([(0,n.MZ)()],h.prototype,"lineClamp",void 0),h=l([(0,s.E)("wui-text")],h)},47337:(t,e,i)=>{var a=i(26535),n=i(82073),o=(i(56718),i(53183)),r=i(59640);const s=a.AH`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var c=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let l=class extends a.WF{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const t=this.iconSize||this.size,e="lg"===this.size,i="xl"===this.size,n=e?"12%":"16%",o=e?"xxs":i?"s":"3xl",r="gray"===this.background,s="opaque"===this.background,c="accent-100"===this.backgroundColor&&s||"success-100"===this.backgroundColor&&s||"error-100"===this.backgroundColor&&s||"inverse-100"===this.backgroundColor&&s;let l=`var(--wui-color-${this.backgroundColor})`;return c?l=`var(--wui-icon-box-bg-${this.backgroundColor})`:r&&(l=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`\n       --local-bg-value: ${l};\n       --local-bg-mix: ${c||r?"100%":n};\n       --local-border-radius: var(--wui-border-radius-${o});\n       --local-size: var(--wui-icon-box-size-${this.size});\n       --local-border: ${"wui-color-bg-125"===this.borderColor?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}\n   `,a.qy` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `}};l.styles=[o.W5,o.fD,s],c([(0,n.MZ)()],l.prototype,"size",void 0),c([(0,n.MZ)()],l.prototype,"backgroundColor",void 0),c([(0,n.MZ)()],l.prototype,"iconColor",void 0),c([(0,n.MZ)()],l.prototype,"iconSize",void 0),c([(0,n.MZ)()],l.prototype,"background",void 0),c([(0,n.MZ)({type:Boolean})],l.prototype,"border",void 0),c([(0,n.MZ)()],l.prototype,"borderColor",void 0),c([(0,n.MZ)()],l.prototype,"icon",void 0),l=c([(0,r.E)("wui-icon-box")],l)},55997:(t,e,i)=>{var a=i(26535),n=i(82073),o=i(53183),r=i(59640);const s=a.AH`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var c=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let l=class extends a.WF{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`\n      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      `,a.qy`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};l.styles=[o.W5,o.ck,s],c([(0,n.MZ)()],l.prototype,"src",void 0),c([(0,n.MZ)()],l.prototype,"alt",void 0),c([(0,n.MZ)()],l.prototype,"size",void 0),l=c([(0,r.E)("wui-image")],l)},56718:(t,e,i)=>{var a=i(26535),n=i(82073),o=i(63178),r=i(38122),s=i(76207);class c{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}}class l{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t)}resume(){this.Z?.(),this.Y=this.Z=void 0}}var h=i(36806);const d=t=>!(0,r.sO)(t)&&"function"==typeof t.then,g=1073741823;class w extends s.Kq{constructor(){super(...arguments),this._$Cwt=g,this._$Cbt=[],this._$CK=new c(this),this._$CX=new l}render(...t){return t.find(t=>!d(t))??o.c0}update(t,e){const i=this._$Cbt;let a=i.length;this._$Cbt=e;const n=this._$CK,r=this._$CX;this.isConnected||this.disconnected();for(let t=0;t<e.length&&!(t>this._$Cwt);t++){const o=e[t];if(!d(o))return this._$Cwt=t,o;t<a&&o===i[t]||(this._$Cwt=g,a=0,Promise.resolve(o).then(async t=>{for(;r.get();)await r.get();const e=n.deref();if(void 0!==e){const i=e._$Cbt.indexOf(o);i>-1&&i<e._$Cwt&&(e._$Cwt=i,e.setValue(t))}}))}return o.c0}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}const p=(0,h.u$)(w),v=new class{constructor(){this.cache=new Map}set(t,e){this.cache.set(t,e)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}};var u=i(53183),f=i(59640);const y=a.AH`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var b=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};const m={add:async()=>(await i.e(8186).then(i.bind(i,28186))).addSvg,allWallets:async()=>(await i.e(7265).then(i.bind(i,37265))).allWalletsSvg,arrowBottomCircle:async()=>(await i.e(891).then(i.bind(i,50891))).arrowBottomCircleSvg,appStore:async()=>(await i.e(6638).then(i.bind(i,36638))).appStoreSvg,apple:async()=>(await i.e(3753).then(i.bind(i,53753))).appleSvg,arrowBottom:async()=>(await i.e(5294).then(i.bind(i,95294))).arrowBottomSvg,arrowLeft:async()=>(await i.e(6688).then(i.bind(i,46688))).arrowLeftSvg,arrowRight:async()=>(await i.e(5603).then(i.bind(i,25603))).arrowRightSvg,arrowTop:async()=>(await i.e(5930).then(i.bind(i,85930))).arrowTopSvg,bank:async()=>(await i.e(6451).then(i.bind(i,26451))).bankSvg,browser:async()=>(await i.e(3025).then(i.bind(i,3025))).browserSvg,card:async()=>(await i.e(5839).then(i.bind(i,85839))).cardSvg,checkmark:async()=>(await i.e(7400).then(i.bind(i,77400))).checkmarkSvg,checkmarkBold:async()=>(await i.e(9862).then(i.bind(i,39862))).checkmarkBoldSvg,chevronBottom:async()=>(await i.e(5816).then(i.bind(i,35816))).chevronBottomSvg,chevronLeft:async()=>(await i.e(6034).then(i.bind(i,96034))).chevronLeftSvg,chevronRight:async()=>(await i.e(2261).then(i.bind(i,52261))).chevronRightSvg,chevronTop:async()=>(await i.e(9936).then(i.bind(i,39936))).chevronTopSvg,chromeStore:async()=>(await i.e(655).then(i.bind(i,40655))).chromeStoreSvg,clock:async()=>(await i.e(3851).then(i.bind(i,13851))).clockSvg,close:async()=>(await i.e(3897).then(i.bind(i,13897))).closeSvg,compass:async()=>(await i.e(4961).then(i.bind(i,54961))).compassSvg,coinPlaceholder:async()=>(await i.e(351).then(i.bind(i,10351))).coinPlaceholderSvg,copy:async()=>(await i.e(6164).then(i.bind(i,36164))).copySvg,cursor:async()=>(await i.e(7183).then(i.bind(i,37183))).cursorSvg,cursorTransparent:async()=>(await i.e(9800).then(i.bind(i,59800))).cursorTransparentSvg,desktop:async()=>(await i.e(4733).then(i.bind(i,64733))).desktopSvg,disconnect:async()=>(await i.e(1803).then(i.bind(i,1803))).disconnectSvg,discord:async()=>(await i.e(1601).then(i.bind(i,1601))).discordSvg,etherscan:async()=>(await i.e(9828).then(i.bind(i,69828))).etherscanSvg,extension:async()=>(await i.e(3728).then(i.bind(i,13728))).extensionSvg,externalLink:async()=>(await i.e(2395).then(i.bind(i,2395))).externalLinkSvg,facebook:async()=>(await i.e(5761).then(i.bind(i,95761))).facebookSvg,farcaster:async()=>(await i.e(9524).then(i.bind(i,69524))).farcasterSvg,filters:async()=>(await i.e(5142).then(i.bind(i,35142))).filtersSvg,github:async()=>(await i.e(4810).then(i.bind(i,54810))).githubSvg,google:async()=>(await i.e(9650).then(i.bind(i,29650))).googleSvg,helpCircle:async()=>(await i.e(7795).then(i.bind(i,57795))).helpCircleSvg,image:async()=>(await i.e(4948).then(i.bind(i,94948))).imageSvg,id:async()=>(await i.e(9604).then(i.bind(i,79604))).idSvg,infoCircle:async()=>(await i.e(5658).then(i.bind(i,55658))).infoCircleSvg,lightbulb:async()=>(await i.e(5574).then(i.bind(i,55574))).lightbulbSvg,mail:async()=>(await i.e(9130).then(i.bind(i,59130))).mailSvg,mobile:async()=>(await i.e(539).then(i.bind(i,20539))).mobileSvg,more:async()=>(await i.e(7640).then(i.bind(i,7640))).moreSvg,networkPlaceholder:async()=>(await i.e(4779).then(i.bind(i,4779))).networkPlaceholderSvg,nftPlaceholder:async()=>(await i.e(8880).then(i.bind(i,58880))).nftPlaceholderSvg,off:async()=>(await i.e(2860).then(i.bind(i,62860))).offSvg,playStore:async()=>(await i.e(9547).then(i.bind(i,49547))).playStoreSvg,plus:async()=>(await i.e(753).then(i.bind(i,30753))).plusSvg,qrCode:async()=>(await i.e(4146).then(i.bind(i,74146))).qrCodeIcon,recycleHorizontal:async()=>(await i.e(4581).then(i.bind(i,74581))).recycleHorizontalSvg,refresh:async()=>(await i.e(7506).then(i.bind(i,77506))).refreshSvg,search:async()=>(await i.e(2165).then(i.bind(i,62165))).searchSvg,send:async()=>(await i.e(7927).then(i.bind(i,77927))).sendSvg,swapHorizontal:async()=>(await i.e(3186).then(i.bind(i,3186))).swapHorizontalSvg,swapHorizontalMedium:async()=>(await i.e(3117).then(i.bind(i,63117))).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await i.e(8765).then(i.bind(i,98765))).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await i.e(298).then(i.bind(i,40298))).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await i.e(8136).then(i.bind(i,78136))).swapVerticalSvg,telegram:async()=>(await i.e(3702).then(i.bind(i,73702))).telegramSvg,threeDots:async()=>(await i.e(3634).then(i.bind(i,33634))).threeDotsSvg,twitch:async()=>(await i.e(8002).then(i.bind(i,8002))).twitchSvg,twitter:async()=>(await i.e(2769).then(i.bind(i,2769))).xSvg,twitterIcon:async()=>(await i.e(6991).then(i.bind(i,76991))).twitterIconSvg,verify:async()=>(await i.e(7720).then(i.bind(i,37720))).verifySvg,verifyFilled:async()=>(await i.e(5785).then(i.bind(i,5785))).verifyFilledSvg,wallet:async()=>(await i.e(8040).then(i.bind(i,98040))).walletSvg,walletConnect:async()=>(await i.e(3220).then(i.bind(i,63220))).walletConnectSvg,walletConnectLightBrown:async()=>(await i.e(3220).then(i.bind(i,63220))).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await i.e(3220).then(i.bind(i,63220))).walletConnectBrownSvg,walletPlaceholder:async()=>(await i.e(9348).then(i.bind(i,19348))).walletPlaceholderSvg,warningCircle:async()=>(await i.e(2534).then(i.bind(i,22534))).warningCircleSvg,x:async()=>(await i.e(2769).then(i.bind(i,2769))).xSvg,info:async()=>(await i.e(2373).then(i.bind(i,2373))).infoSvg,exclamationTriangle:async()=>(await i.e(9725).then(i.bind(i,19725))).exclamationTriangleSvg,reown:async()=>(await i.e(3432).then(i.bind(i,83432))).reownSvg};let S=class extends a.WF{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`\n      --local-color: var(--wui-color-${this.color});\n      --local-width: var(--wui-icon-size-${this.size});\n      --local-aspect-ratio: ${this.aspectRatio}\n    `,a.qy`${p(async function(t){if(v.has(t))return v.get(t);const e=(m[t]??m.copy)();return v.set(t,e),e}(this.name),a.qy`<div class="fallback"></div>`)}`}};S.styles=[u.W5,u.ck,y],b([(0,n.MZ)()],S.prototype,"size",void 0),b([(0,n.MZ)()],S.prototype,"name",void 0),b([(0,n.MZ)()],S.prototype,"color",void 0),b([(0,n.MZ)()],S.prototype,"aspectRatio",void 0),S=b([(0,f.E)("wui-icon")],S)},65044:(t,e,i)=>{i(88365)},67546:(t,e,i)=>{i(56718)},67806:(t,e,i)=>{var a=i(26535),n=i(82073),o=i(53183),r=i(59640);const s=a.AH`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var c=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let l=class extends a.WF{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText="--local-color: "+("inherit"===this.color?"inherit":`var(--wui-color-${this.color})`),this.dataset.size=this.size,a.qy`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};l.styles=[o.W5,s],c([(0,n.MZ)()],l.prototype,"color",void 0),c([(0,n.MZ)()],l.prototype,"size",void 0),l=c([(0,r.E)("wui-loading-spinner")],l)},76458:(t,e,i)=>{var a=i(26535),n=i(82073),o=(i(37695),i(53183)),r=i(59640);const s=a.AH`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;var c=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let l=class extends a.WF{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const t="md"===this.size?"mini-700":"micro-700";return a.qy`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `}};l.styles=[o.W5,s],c([(0,n.MZ)()],l.prototype,"variant",void 0),c([(0,n.MZ)()],l.prototype,"size",void 0),l=c([(0,r.E)("wui-tag")],l)},82073:(t,e,i)=>{i.d(e,{MZ:()=>a.M,wk:()=>n.w});var a=i(66956),n=i(27492)},88365:(t,e,i)=>{var a=i(26535),n=i(82073),o=i(53183),r=i(39430),s=i(59640);const c=a.AH`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var l=function(t,e,i,a){var n,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let h=class extends a.WF{render(){return this.style.cssText=`\n      flex-direction: ${this.flexDirection};\n      flex-wrap: ${this.flexWrap};\n      flex-basis: ${this.flexBasis};\n      flex-grow: ${this.flexGrow};\n      flex-shrink: ${this.flexShrink};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&r.Z.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&r.Z.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&r.Z.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&r.Z.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&r.Z.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&r.Z.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&r.Z.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&r.Z.getSpacingStyles(this.margin,3)};\n    `,a.qy`<slot></slot>`}};h.styles=[o.W5,c],l([(0,n.MZ)()],h.prototype,"flexDirection",void 0),l([(0,n.MZ)()],h.prototype,"flexWrap",void 0),l([(0,n.MZ)()],h.prototype,"flexBasis",void 0),l([(0,n.MZ)()],h.prototype,"flexGrow",void 0),l([(0,n.MZ)()],h.prototype,"flexShrink",void 0),l([(0,n.MZ)()],h.prototype,"alignItems",void 0),l([(0,n.MZ)()],h.prototype,"justifyContent",void 0),l([(0,n.MZ)()],h.prototype,"columnGap",void 0),l([(0,n.MZ)()],h.prototype,"rowGap",void 0),l([(0,n.MZ)()],h.prototype,"gap",void 0),l([(0,n.MZ)()],h.prototype,"padding",void 0),l([(0,n.MZ)()],h.prototype,"margin",void 0),h=l([(0,s.E)("wui-flex")],h)},98204:(t,e,i)=>{i(37695)}}]);