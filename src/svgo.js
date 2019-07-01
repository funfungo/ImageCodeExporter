/**
 *  refer to svgo-compressor
 *  source:
 *  https://github.com/BohemianCoding/svgo-compressor
 */

import * as fs from '@skpm/fs';
import svgo from 'svgo';
import svgoPlugins from './svgo-plugins';
import svgoJSON from './defaultConfig.js';
const parsedSVGOPlugins = [];

export function runSvgo(path) {
  if (svgoJSON.debug) log('Let‘s go…');
  if (typeof svgoJSON.full === 'undefined') {
    svgoJSON.full = true;
  }
  if (typeof svgoJSON.multipass === 'undefined') {
    svgoJSON.multipass = true;
  }
  if (typeof svgoJSON.pretty === 'undefined') {
    svgoJSON.pretty = true;
  }
  if (typeof svgoJSON.indent === 'undefined') {
    svgoJSON.indent = 2;
  }
  const svgCompressor = new svgo({
    full: svgoJSON.full,
    js2svg: {
      pretty: svgoJSON.pretty,
      indent: svgoJSON.indent
    },
    plugins: parsedSVGOPlugins,
    multipass: svgoJSON.multipass
  });
  const svgString = fs.readFileSync(path, 'utf8');
  svgCompressor.config.plugins.forEach(([plugin]) => {
    // cleanupIDs
    if (plugin.pluginName == 'cleanupIDs') {
      const parts = path.split('/');
      var prefix =
        parts[parts.length - 1]
          .replace('.svg', '')
          .replace(/\s+/g, '-')
          .toLowerCase() + '-';
      if (svgoJSON.debug) log('Setting cleanupIDs prefix to: ' + prefix);
      plugin.params['prefix'] = prefix;
    }
  });
  return svgCompressor.optimize(svgString).then(result => {
    fs.writeFileSync(path, result.data, 'utf8');
  });
}

export function svgoLoadPlugin() {
  if (typeof svgoJSON.enabled !== 'undefined' && !svgoJSON.enabled) {
    return;
  }
  const floatPrecision =
    typeof svgoJSON.floatPrecision !== 'undefined'
      ? Number(svgoJSON.floatPrecision)
      : undefined;
  svgoJSON.plugins.forEach(item => {
    if (typeof item.enabled !== 'undefined' && !item.enabled) {
      return;
    }
    let plugin = svgoPlugins[item.name];
    if (item.path) {
      try {
        const loadedPlugin = coscript.require(
          path.join(
            String(MSPluginManager.mainPluginsFolderURL().path()),
            item.path
          )
        );

        // loadedPlugin is an NSDictionary so if we try to set something on it,
        // it will crash. Instead we move the values to a proper JS object.
        var keys = Object.keys(loadedPlugin);
        plugin = {};
        Object.keys(loadedPlugin).forEach(k => {
          plugin[k] = loadedPlugin[k];
        });
        if (loadedPlugin.params) {
          plugin.params = {};
          Object.keys(loadedPlugin.params).forEach(k => {
            plugin.params[k] = loadedPlugin.params[k];
          });
        }
      } catch (err) {
        log(err);
      }
    }
    if (!plugin) {
      log('Plugin not found: ' + (item.name || item.path));
      return;
    }
    if (svgoJSON.debug) log('Enabled plugin: ' + (item.name || item.path));
    plugin.pluginName = item.name;
    plugin.active = true;
    if (plugin.params) {
      // Plugin supports params

      // Set floatPrecision across all the plugins
      if (floatPrecision && 'floatPrecision' in plugin.params) {
        plugin.params.floatPrecision = floatPrecision;
      }
      if (svgoJSON.debug)
        log('—› default params: ' + JSON.stringify(plugin.params, null, 2));
    }
    if (item.params != null) {
      if (typeof plugin.params === 'undefined') {
        plugin.params = {};
      }
      for (var attrname in item.params) {
        plugin.params[attrname] = item.params[attrname];
      }
      if (svgoJSON.debug)
        log('—› resulting params: ' + JSON.stringify(plugin.params, null, 2));
    }
    parsedSVGOPlugins.push([plugin]);
  });
}
