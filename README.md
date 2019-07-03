# Image Code Exporter
Export your sketch layer with data URI for code usage<br>
以data URI代码形式导出sketch中的图层


## Usage
1. Choose the layer you want to export<br>
   选择你想要导出的图层

2. Use shortcut ``` command(⌘) + ` ``` to export your code immediately<br>
    使用快捷键``` command(⌘) + ` ```立即导出代码

<img src="/doc/img/main.png" alt="test" width="500">


## Feature
- Support PNG and SVG image type, export PNG file by encoding it with base64 format while using encoded xml when export SVG file.(See this article [Probably Don’t Base64 SVG](https://css-tricks.com/probably-dont-base64-svg/) )<br>
  支持PNG和SVG图片格式, 以base64格式导出PNG图片，以XML格式导出SVG文件（为什么不用base64导出SVG,看这篇文章 [Probably Don’t Base64 SVG](https://css-tricks.com/probably-dont-base64-svg/) ）

- Provide multiple templates for different usage, including code in html(innerHtml), css background and css mask.<br>
  提供多种代码使用场景模板，包括在html中嵌入的代码(innerHtml),
  css background或css mask

- Auto save your last copy preference <br>
  自动保存你上一次复制的选项

- Compress PNG file with [advpng](https://github.com/amadvance/advancecomp)<br>
  使用[advpng](https://github.com/amadvance/advancecomp)压缩PNG文件

- Compress SVG file widh [svgo](https://github.com/svg/svgo)<br>
  使用svgo压缩SVG文件

## Installation

- [Download](../../releases/latest/download/imagecodeexporter.sketchplugin.zip) the latest release of the plugin<br>
  [下载](../../releases/latest/download/imagecodeexporter.sketchplugin.zip) 最新的发布版本

- Un-zip<br>
  解压

- Double-click on imagecodeexporter.sketchplugin<br>
  双击imagecodeexporter.sketchplugin

## Acknowledgements
Thanks to these project to give me some ideas about how to make this plugin
- [svgo-compressor](https://github.com/BohemianCoding/svgo-compressor)
sketch plugin of compressing svg while export svg file

- [sketch-image-compressor](https://github.com/BohemianCoding/sketch-image-compressor) sketch plugin of compressing image



## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```
