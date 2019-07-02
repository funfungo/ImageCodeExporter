/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/webview.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/webview.js":
/*!******************************!*\
  !*** ./resources/webview.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// disable the context menu (eg. the right click menu) to have a more native feel
var selectScale = document.getElementById('selectScale');
var selectFormat = document.getElementById('selectFormat');
var selectUse = document.getElementById('selectUse');
var imgPreview = document.getElementById('imgPreview');
var loading = document.getElementById('loading');
var copyBtn = document.getElementById('copyBtn');
var closeBtn = document.getElementById('closeBtn');
var scale = '2',
    format = 'png',
    usage = 'bg',
    layerInfo = {},
    codeMap = {};

selectScale.onchange = function () {
  scale = selectScale.value;
  console.log('selectScale:' + scale);
  imgPreview.style.width = layerInfo.width + 'px';
  changeScale();
};

selectFormat.onchange = function () {
  format = selectFormat.value;

  if (format === 'svg') {
    selectScale.disabled = true;
  } else {
    selectScale.disabled = false;
  }

  changeCode();
  console.log('selectFormat:' + format);
};

selectUse.onchange = function () {
  usage = selectUse.value;
  changeCode();
};

copyBtn.addEventListener('click', copy);
closeBtn.addEventListener('click', close);

function copy() {
  var text = document.getElementById('code').value;
  changeConfig();
  window.postMessage('copy', text);
}

function close() {
  window.postMessage('close');
}

function getPngBackground(data) {
  var code = "display: inline-block;\n  vertical-align: middle;\n  width: ".concat(data.width, "px;\n  height: ").concat(data.height, "px;\n  background-size: cover;\n  background-image: url(\"data:image/png;base64,").concat(data.bitmap, "\");");
  return code.replace(/^ +/gm, '');
}

function getSvgBackground(data) {
  var build = buildSvgDataURI(data.svgXml);
  var code = "display: inline-block;\n  vertical-align: middle;\n  width: ".concat(data.width, "px;\n  height: ").concat(data.height, "px;\n  background-size: cover;\n  background-image: url(\"data:image/svg+xml,").concat(build, "\");");
  return code.replace(/^ +/gm, '');
}

function getSvgMask(data) {
  var build = buildSvgDataURI(data.svgXml);
  var code = "display: inline-block;\n  vertical-align: middle;\n  width: ".concat(data.width, "px;\n  height: ").concat(data.height, "px;\n  -webkit-mask: url(\"data:image/svg+xml,").concat(build, "\") no-repeat 50% 50%;\n  mask: url(\"data:image/svg+xml,").concat(build, "\") no-repeat 50% 50%;\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  background-color: currentColor;");
  return code.replace(/^ +/gm, '');
}

function getPngMask(data) {
  var code = "display: inline-block;\n  vertical-align: middle;\n  width: ".concat(data.width, "px;\n  height: ").concat(data.height, "px;\n  -webkit-mask: url(\"data:image/png;base64,").concat(data.bitmap, "\") no-repeat 50% 50%;\n  mask: url(\"data:image/png;base64,").concat(data.bitmap, "\") no-repeat 50% 50%;\n  -webkit-mask-size: cover;\n  mask-size: cover;\n  background-color: currentColor;");
  return code.replace(/^ +/gm, '');
}

function changeScale() {
  window.postMessage('generateCode', scale);
}

function changeConfig() {
  window.postMessage('changeConfig', scale, format, usage);
}

var actions = {};

function changeCode() {
  document.getElementById('code').value = codeMap["".concat(format, "_").concat(usage)];
}
/**
 * Returns encoded string of svg file.
 * @method buildSvgDataURI
 * @param {String} data Contents of svg file.
 */


function buildSvgDataURI(svgContent) {
  return svgContent.replace(/^<\?xml.*?>/gim, '') // Xml declaration
  .replace(/<\!\-\-(.*(?=\-\->))\-\->/gim, '') // Comments
  .replace(/[\r\n]/gim, '') // Line breaks
  .replace(/(\r\n|\n|\r)$/, '') // New line end of file
  .replace(/\t/gim, ' ') // Tabs (replace with space)
  .replace(/%/gim, '%25') // %
  .replace(/</gim, '%3C') // <
  .replace(/>/gim, '%3E') // >
  .replace(/#/gim, '%23') // #
  .replace(/\"/gim, "'"); // "
} // call the wevbiew from the plugin


window.sendCode = function (data) {
  loading.style.display = 'none';
  layerInfo = data;
  imgPreview.src = 'data:image/png;base64,' + data.bitmap;
  layerInfo.imgSrc = 'data:image/png;base64,' + data.bitmap;
  layerInfo.innerHtmlImg = "<img src=\"data:image/png;base64,".concat(data.bitmap, "\">");
  layerInfo.innerHtmlSvg = data.svgXml;
  layerInfo.pngBg = getPngBackground(data);
  layerInfo.svgBg = getSvgBackground(data);
  layerInfo.svgMask = getSvgMask(data);
  layerInfo.pngMask = getPngMask(data);
  imgPreview.style.width = layerInfo.width + 'px';
  codeMap = {
    'svg_bg': layerInfo.svgBg,
    'svg_innerHtml': layerInfo.innerHtmlSvg,
    'svg_mask': layerInfo.svgMask,
    'png_bg': layerInfo.pngBg,
    'png_innerHtml': layerInfo.innerHtmlImg,
    'png_mask': layerInfo.pngMask
  };
  changeCode();
};

window.sendConfig = function (data) {
  selectScale.value = data.scale;
  selectFormat.value = data.format;
  selectUse.value = data.usage;
  scale = data.scale;
  format = data.format;
  usage = data.usage;

  if (format === 'svg') {
    selectScale.disabled = true;
  } else {
    selectScale.disabled = false;
  }

  window.postMessage('generateCode', scale, format, usage);
};

/***/ })

/******/ });
//# sourceMappingURL=webview.js.map