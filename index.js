var Batch = require('batch')
  , fs    = require('fs')
  , path  = require('path')
  , sass  = require('node-sass-wrapper')
  , debug = require('debug')('component-sass');



/**
 * Options.
 */

var options = {
  compass   : true,
  style     : 'nested',
  precision : 3,
  loadPath  : null,
  require   : null,
};


/**
 * Replace Sass files with CSS files.
 */

module.exports = function (builder) {

  builder.hook('before styles', function (builder, callback) {
    if (!builder.conf.styles) return callback();

    var files = builder.conf.styles.filter(sassFilter)
      , batch = new Batch();

    files.forEach(function (file) {
      batch.push(function (done) {
        debug('compiling: %s', file);

        var filePath = builder.path(file)
          , name     = path.basename(file, path.extname(file)) + '.css';

        sass.compile(filePath, options, function (err, css) {
          if (err) {
            debug('error compiling: %s, %s', file, err);
            return done(err);
          }

          builder.addFile('styles', name, css);
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
 * Set output style.
 */

module.exports.style = function (style) {
  options.style = style;
};


/**
 * Set decimal precision.
 */

module.exports.precision = function (precision) {
  options.precision = precision;
};


/**
 * Add a path to the IMPORT_PATH sass option, which lets files in that directory
 * findable by Sass's @import directive.
 */

module.exports.loadPath = function (path) {
  options.loadPath = path;
};


/**
 * Require Sass plugin.
 */

module.exports.require = function (plugin) {
  options.require = plugin;
};


/**
 * Filtering function for .sass and .scss files.
 */

function sassFilter (filename) {
  var ext = path.extname(filename);
  if (ext === '.sass' || ext === '.scss') return true;
}