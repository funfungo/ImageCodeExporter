/**
 *  refer to sketch-image-compressor
 *  source:
 *  https://github.com/BohemianCoding/sketch-image-compressor
 */
import child_process from '@skpm/child_process';

export default function (path) {
  // use optipng for simplification because we just provide png exportation
  /*
  Synopsis:
      optipng [options] files ...
  Files:
      Image files of type: PNG, BMP, GIF, PNM or TIFF
  Basic options:
      -?, -h, -help	show the extended help
      -o <level>		optimization level (0-7)		[default: 2]
      -v			run in verbose mode / show copyright and version info
  Examples:
      optipng file.png						(default speed)
      optipng -o5 file.png					(slow)
      optipng -o7 file.png					(very slow)
  Type "optipng -h" for extended help.
  */
  const optipng = {
    type: 'png',
    name: 'optipng',
    path: String(context.plugin.urlForResourceNamed('optipng').path()), //optipng binary exec file
    config: ['-o5', path]
  };

  /*
  advancecomp v1.21 by Andrea Mazzoleni, http://www.advancemame.it
  Usage: advpng [options] [FILES...]
  Modes:
    -l, --list            List the content of the files
    -z, --recompress      Recompress the specified files
  Options:
    -0, --shrink-store    Don't compress
    -1, --shrink-fast     Compress fast (zlib)
    -2, --shrink-normal   Compress normal (7z)
    -3, --shrink-extra    Compress extra (7z)
    -4, --shrink-insane   Compress extreme (zopfli)
    -i N, --iter=N        Compress iterations
    -f, --force           Force the new file also if it's bigger
    -q, --quiet           Don't print on the console
    -h, --help            Help of the program
    -V, --version         Version of the program
  */
  const advpng = {
    type: 'png',
    name: 'advpng',
    path: String(context.plugin.urlForResourceNamed('advpng').path()),  //optipng binary exec file
    config: ['-z3', path]
  };

  // set compressing arguments

  return new Promise((resolve, reject) => {
    const task = child_process.spawn(advpng.path, advpng.config);

    task.on('error', reject);

    task.on('close', resolve);
  });
}
