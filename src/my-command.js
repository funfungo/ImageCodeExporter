import * as fs from '@skpm/fs';
import BrowserWindow from 'sketch-module-web-view';
import compressor from './compressor';
import sketch from 'sketch';
import {
  getWebview
} from 'sketch-module-web-view/remote';
import UI from 'sketch/ui';
import {
  svgoLoadPlugin,
  runSvgo
} from './svgo';

const webviewIdentifier = 'imagecodeexporter.webview';
const pluginIdentifier = 'com.funfungo.imagecodeexporter';
let layerInfo = {};
let webContents;
let layer;
const doc = context.document;
const selection = context.selection;
let browserWindow;
let config = {
  scale: 2,
  format: 'png',
  usage: 'bg'
};

let userDefaults = NSUserDefaults.standardUserDefaults();
if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
  setPreferences('scale', config.scale);
  setPreferences('format', config.format);
  setPreferences('usage', config.usage);
} else {
  config.scale = Number(getPreferences('scale'));
  config.format = String(getPreferences('format'));
  config.usage = String(getPreferences('usage'));
}

export default function () {
  layer = selection[0];
  svgoLoadPlugin();
  const options = {
    parent: sketch.getSelectedDocument(),
    modal: true,
    identifier: webviewIdentifier,
    width: 500,
    height: 470,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    minimizable: false,
    maximizable: false
    // alwaysOnTop: true
  };

  browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();
  });

  webContents = browserWindow.webContents;

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded!');
    layerInfo.name = layer.name();
    console.log(config);
    webContents
      .executeJavaScript(`sendConfig(${JSON.stringify(config)})`)
      .catch(console.error);
  });

  // buildExports(doc, layer, scale);

  // add a handler for a call from web content's javascript
  webContents.on('generateCode', (scale, format, usage) => {
    buildExports(doc, layer, scale);
  });

  webContents.on('copy', text => {
    copyToClipboard(text);
  });

  webContents.on('close', () => {
    browserWindow.close();
  });

  webContents.on('changeConfig', (scale, format, usage) => {
    saveConfig(scale, format, usage);
  });

  browserWindow.loadURL(require('../resources/webview.html'));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}

function saveConfig(scale, format, usage) {
  setPreferences('scale', scale);
  setPreferences('format', format);
  setPreferences('usage', usage);
}

function playSound() {
  const SystemSounds = {
    Glass: 'Glass',
    Pop: 'Pop',
    Tink: 'Tink'
  };
  let soundFile = String(
    context.plugin.urlForResourceNamed('popcopied.mp3').path()
  );
  let sound = NSSound.alloc().initWithContentsOfFile_byReference(
    soundFile,
    true
  );
  sound.play();
}

function copyToClipboard(text) {
  var pasteBoard = NSPasteboard.generalPasteboard();
  pasteBoard.declareTypes_owner(
    NSArray.arrayWithObject(NSPasteboardTypeString),
    null
  );
  pasteBoard.setString_forType(text, NSPasteboardTypeString);
  playSound();
  browserWindow.close();
}

function exportLayerAsBitmap(document, layer, scale, type) {
  let slice,
    result = {},
    rect = layer.absoluteRect(),
    path = NSTemporaryDirectory() + layer.objectID() + '.' + type;

  NSMakeRect(rect.x(), rect.y(), rect.width(), rect.height());
  result.width = (rect.width() * scale) / 2;
  result.height = (rect.height() * scale) / 2;
  slice = MSExportRequest.exportRequestsFromExportableLayer(
    layer
  ).firstObject();
  slice.page = document.currentPage();
  slice.format = type;
  slice.scale = scale;
  document.saveArtboardOrSlice_toFile(slice, path);
  let originalFileSize = fs.statSync(path).size;

  // using optipng compress png file
  if (type === 'png') {
    return compressor(path).then(() => {
      let url = NSURL.fileURLWithPath(path),
        bitmap = NSData.alloc().initWithContentsOfURL(url),
        base64 = bitmap.base64EncodedStringWithOptions(0) + '';
      let compressFileSize = fs.statSync(path).size;
      console.log(`finish compressing : ${originalFileSize} → ${compressFileSize}`)
      // delete temporary file
      NSFileManager.defaultManager().removeItemAtURL_error(url, nil);
      let imgRep = NSBitmapImageRep.imageRepWithData(bitmap);
      result.bitmap = base64;
      return result;
    });
  } else {
    return runSvgo(path).then(() => {
      return String(fs.readFileSync(path, 'utf8'));
    });
  }
}

function buildExports(doc, layer, scale) {
  let promises = [];
  promises.push(
    exportLayerAsBitmap(doc, layer, scale, 'png').then(data => {
      const {
        bitmap,
        width,
        height
      } = data;

      layerInfo.bitmap = bitmap;
      layerInfo.width = width;
      layerInfo.height = height;
    })
  );

  promises.push(
    exportLayerAsBitmap(doc, layer, scale, 'svg').then(data => {
      layerInfo.svgXml = data;
    })
  );
  Promise.all(promises).then(() => {
    webContents
      .executeJavaScript(`sendCode(${JSON.stringify(layerInfo)})`)
      .catch(console.error);
  });
}

function setPreferences(key, value) {
  if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
    var preferences = NSMutableDictionary.alloc().init();
  } else {
    var preferences = NSMutableDictionary.dictionaryWithDictionary(
      userDefaults.dictionaryForKey(pluginIdentifier)
    );
  }
  preferences.setObject_forKey(value, key);
  userDefaults.setObject_forKey(preferences, pluginIdentifier);
  userDefaults.synchronize();
}

function getPreferences(key) {
  if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
    var defaultPreferences = NSMutableDictionary.alloc().init();
    // Your defult preferences
    defaultPreferences.setObject_forKey('value1', 'key1');
    defaultPreferences.setObject_forKey('value2', 'key2');

    userDefaults.setObject_forKey(defaultPreferences, pluginIdentifier);
    userDefaults.synchronize();
  }
  return userDefaults.dictionaryForKey(pluginIdentifier).objectForKey(key);
}
