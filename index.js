var async = require('async')
  , debug = require('debug')('component:sass')
  , fs    = require('fs')
  , path  = require('path')
  , sass  = require('node-sass');


/**
 * Replace Sass files with CSS files.
 */
module.exports = function (builder, options) {

  options = options || {};

  builder.hook('before styles', function (builder, callback) {
    if (!builder.conf.styles) return callback();

    var files = builder.conf.styles.filter(function (name) {
      return name.match(/\.[sass|scss]$/i);
    });

    processFiles(builder, files, options, callback);
  });
};



var processFiles = function (builder, files, option, callback) {

  async.forEach(files, function (file, done) {

    debug('compiling: %s', file);

    var filePath = builder.path(file)
      , output   = path.basename(file, path.ext(file)) + '.css';

    sass.compile(file, options, function (err, css) {

      if (err) {
        debug('error compiling: %s, %s', file, err);
        return done(err);
      }

      builder.addFile('styles', name, css);
      builder.removeFile('styles', filePath);
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
