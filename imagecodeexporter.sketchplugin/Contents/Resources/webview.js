!function(e){var n={};function t(a){if(n[a])return n[a].exports;var i=n[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:a})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(t.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(a,i,function(n){return e[n]}.bind(null,i));return a},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s="./resources/webview.js")}({"./resources/webview.js":
/*!******************************!*\
  !*** ./resources/webview.js ***!
  \******************************/
/*! no static exports found */function(e,n){var t=document.getElementById("selectScale"),a=document.getElementById("selectFormat"),i=document.getElementById("selectUse"),c=document.getElementById("imgPreview"),o=document.getElementById("loading"),r=document.getElementById("copyBtn"),l=document.getElementById("closeBtn"),g="2",s="png",d="bg",m={},u={};function p(){document.getElementById("code").value=u["".concat(s,"_").concat(d)]}function v(e){return e.replace(/^<\?xml.*?>/gim,"").replace(/<\!\-\-(.*(?=\-\->))\-\->/gim,"").replace(/[\r\n]/gim,"").replace(/(\r\n|\n|\r)$/,"").replace(/\t/gim," ").replace(/%/gim,"%25").replace(/</gim,"%3C").replace(/>/gim,"%3E").replace(/#/gim,"%23").replace(/\"/gim,"'")}t.onchange=function(){g=t.value,console.log("selectScale:"+g),c.style.width=m.width+"px",window.postMessage("generateCode",g)},a.onchange=function(){s=a.value,t.disabled="svg"===s,p(),console.log("selectFormat:"+s)},i.onchange=function(){d=i.value,p()},r.addEventListener("click",function(){var e=document.getElementById("code").value;window.postMessage("changeConfig",g,s,d),window.postMessage("copy",e)}),l.addEventListener("click",function(){window.postMessage("close")}),window.sendCode=function(e){o.style.display="none",m=e,c.src="data:image/png;base64,"+e.bitmap,m.imgSrc="data:image/png;base64,"+e.bitmap,m.innerHtmlImg='<img src="data:image/png;base64,'.concat(e.bitmap,'">'),m.innerHtmlSvg=e.svgXml,m.pngBg=function(e){return"display: inline-block;\n  vertical-align: middle;\n  width: ".concat(e.width,"px;\n  height: ").concat(e.height,'px;\n  background-size: cover;\n  background-image: url("data:image/png;base64,').concat(e.bitmap,'");').replace(/^ +/gm,"")}(e),m.svgBg=function(e){var n=v(e.svgXml);return"display: inline-block;\n  vertical-align: middle;\n  width: ".concat(e.width,"px;\n  height: ").concat(e.height,'px;\n  background-size: cover;\n  background-image: url("data:image/svg+xml,').concat(n,'");').replace(/^ +/gm,"")}(e),m.svgMask=function(e){var n=v(e.svgXml);return"display: inline-block;\n  vertical-align: middle;\n  width: ".concat(e.width,"px;\n  height: ").concat(e.height,'px;\n  -webkit-mask: url("data:image/svg+xml,').concat(n,'") no-repeat 50% 50%;\n  mask: url("data:image/svg+xml,').concat(n,'") no-repeat 50% 50%;\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  background-color: currentColor;').replace(/^ +/gm,"")}(e),m.pngMask=function(e){return"display: inline-block;\n  vertical-align: middle;\n  width: ".concat(e.width,"px;\n  height: ").concat(e.height,'px;\n  -webkit-mask: url("data:image/png;base64,').concat(e.bitmap,'") no-repeat 50% 50%;\n  mask: url("data:image/png;base64,').concat(e.bitmap,'") no-repeat 50% 50%;\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  background-color: currentColor;').replace(/^ +/gm,"")}(e),c.style.width=m.width+"px",u={svg_bg:m.svgBg,svg_innerHtml:m.innerHtmlSvg,svg_mask:m.svgMask,png_bg:m.pngBg,png_innerHtml:m.innerHtmlImg,png_mask:m.pngMask},p()},window.sendConfig=function(e){t.value=e.scale,a.value=e.format,i.value=e.usage,g=e.scale,s=e.format,d=e.usage,t.disabled="svg"===s,window.postMessage("generateCode",g,s,d)}}});