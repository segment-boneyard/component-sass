var async = require('async')
  , debug = require('debug')('component-sass')
  , fs    = require('fs')
  , path  = require('path')
  , sass  = require('sass');


var compass    = true
  , importPath;


/**
 * Replace Sass files with CSS files.
 */
module.exports = function (builder, options) {

  options = options || {
    useCompass : compass
  };

  builder.hook('before styles', function (builder, callback) {
    if (!builder.conf.styles) return callback();

    var files = builder.conf.styles.filter(function (name) {
      return /\.(sass|scss)/i.test(path.extname(name));
    });

    processFiles(builder, files, options, callback);
  });
};



var processFiles = function (builder, files, options, callback) {

  async.forEach(files, function (file, done) {

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

  }, callback);
};


/**
 * Toggle using Compass.
 */

module.exports.compass = function (enabled) {
  compass = enabled;
};


/**
 * Add a path to the IMPORT_PATH sass option, which lets files in that directory
 * findable by Sass's @import directive.
 */

module.exports.import = function (path) {
  importPath = path;
};
