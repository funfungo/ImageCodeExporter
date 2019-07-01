// disable the context menu (eg. the right click menu) to have a more native feel
const selectScale = document.getElementById('selectScale');
const selectFormat = document.getElementById('selectFormat');
const selectUse = document.getElementById('selectUse');
const imgPreview = document.getElementById('imgPreview');
const loading = document.getElementById('loading');
const copyBtn = document.getElementById('copyBtn');
const closeBtn = document.getElementById('closeBtn');
let scale = '2',
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
  let text = document.getElementById('code').value;
  changeConfig();
  window.postMessage('copy', text);
}

function close() {
  window.postMessage('close');
}

function getPngBackground(data) {
  let code = `display: inline-block;
  vertical-align: middle;
  width: ${data.width}px;
  height: ${data.height}px;
  background-size: cover;
  background-image: url("data:image/png;base64,${data.bitmap}");`;
  return code.replace(/^ +/gm, '');
}

function getSvgBackground(data) {
  let build = buildSvgDataURI(data.svgXml);
  let code = `display: inline-block;
  vertical-align: middle;
  width: ${data.width}px;
  height: ${data.height}px;
  background-size: cover;
  background-image: url("data:image/svg+xml,${build}");`;
  return code.replace(/^ +/gm, '');
}

function getSvgMask(data) {
  let build = buildSvgDataURI(data.svgXml);
  let code = `display: inline-block;
  vertical-align: middle;
  width: ${data.width}px;
  height: ${data.height}px;
  -webkit-mask: url("data:image/svg+xml,${build}") no-repeat 50% 50%;
  mask: url("data:image/svg+xml,${build}") no-repeat 50% 50%;
  -webkit-mask-size: cover;
  mask-size: cover;
  background-color: currentColor;`;
  return code.replace(/^ +/gm, '');
}

function getPngMask(data){
  let code = `display: inline-block;
  vertical-align: middle;
  width: ${data.width}px;
  height: ${data.height}px;
  -webkit-mask: url("data:image/png;base64,${data.bitmap}") no-repeat 50% 50%;
  mask: url("data:image/png;base64,${data.bitmap}") no-repeat 50% 50%;
  -webkit-mask-size: cover;
  mask-size: cover;
  background-color: currentColor;`;
  return code.replace(/^ +/gm, '');
}

function changeScale() {
  window.postMessage('generateCode', scale);
}

function changeConfig() {
  window.postMessage('changeConfig', scale, format, usage);
}

const actions = {

}
function changeCode() {
  document.getElementById('code').value = codeMap[`${format}_${usage}`];
}

/**
 * Returns encoded string of svg file.
 * @method buildSvgDataURI
 * @param {String} data Contents of svg file.
 */
function buildSvgDataURI(svgContent) {
  return svgContent
    .replace(/^<\?xml.*?>/gim, '') // Xml declaration
    .replace(/<\!\-\-(.*(?=\-\->))\-\->/gim, '') // Comments
    .replace(/[\r\n]/gim, '') // Line breaks
    .replace(/(\r\n|\n|\r)$/, '') // New line end of file
    .replace(/\t/gim, ' ') // Tabs (replace with space)
    .replace(/%/gim, '%25') // %
    .replace(/</gim, '%3C') // <
    .replace(/>/gim, '%3E') // >
    .replace(/#/gim, '%23') // #
    .replace(/\"/gim, "'"); // "
}


// call the wevbiew from the plugin
window.sendCode = data => {
  loading.style.display = 'none';
  layerInfo = data;
  imgPreview.src = 'data:image/png;base64,' + data.bitmap;
  layerInfo.imgSrc = 'data:image/png;base64,' + data.bitmap;
  layerInfo.innerHtmlImg = `<img src="data:image/png;base64,${data.bitmap}">`;
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
  }
  changeCode();
};

window.sendConfig = data => {
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
}
