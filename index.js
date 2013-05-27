var Batch = require('batch')
  , fs    = require('fs')
  , path  = require('path')
  , sass  = require('node-sass-wrapper')
  , debug = require('debug')('component-sass');



/**
 * Options.
 *
 * Keep em null so that we just their Sass defaults.
 */

var options = {
  compass   : null,
  import    : null,
  loadPath  : null,
  noCache   : null,
  precision : null,
  require   : null,
  style     : null
};


/**
 * Replace Sass files with CSS files.
 */

module.exports = function (builder) {

  builder.hook('before styles', function (builder, callback) {
    if (!builder.config.styles) return callback();

    var files = builder.config.styles.filter(sassFilter)
      , batch = new Batch();

    files.forEach(function (file) {
      batch.push(function (done) {
        debug('compiling: %s', file);

        sass.compile(builder.path(file), options, function (err, css) {
          if (err) {
            debug('error compiling: %s, %s', file, err);
            return done(err);
          }

          var newFile = path.basename(file, path.extname(file)) + '.css';
          builder.addFile('styles', newFile, css);
          builder.removeFile('styles', file);
          done();
        });
      });
    });

    batch.end(callback);
  });
};


/**
 * Use Compass.
 */

module.exports.compass = function (enabled) {
  options.compass = enabled;
};


/**
 * Add a path to the IMPORT_PATH sass option, which lets files in that directory
 * findable by Sass's @import directive.
 */

module.exports.loadPath = function (path) {
  options.loadPath = path;
};


/**
 * Cache compilation.
 */

module.exports.noCache = function (enabled) {
  options.noCache = enabled;
};


/**
 * Set decimal precision.
 */

module.exports.precision = function (precision) {
  options.precision = precision;
};


/**
 * Require Sass plugin.
 */

module.exports.require = function (plugin) {
  options.require = plugin;
};


/**
 * Set output style.
 */

module.exports.style = function (style) {
  options.style = style;
};


/**
 * Specify a file to import. This is different thatn `loadPath` in that it will
 * actually wrap your sass files in an import for this file each time, so you
 * don't need to manually import them.
 *
 * This is useful for adding utils like mixins, functions to all your Sass files
 * in your project (like your own project-specific Compass).
 */
module.exports.import = function (file) {
  options.import = file;
};


/**
 * Filtering function for .sass and .scss files.
 */

function sassFilter (filename) {
  var ext = path.extname(filename);
  if (ext === '.sass' || ext === '.scss') return true;
}
