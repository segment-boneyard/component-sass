var fs    = require('fs')
  , Batch = require('batch')
  , debug = require('debug')('component:sass')
  , sass  = require('node-sass');



/**
 * Settings.
 */

var compass = false;

var importPath = null;


/**
 * Replace Sass files with CSS files.
 */

module.exports = function compileSass (builder) {

  builder.hook('before styles', function (builder, callback) {
    if (!builder.conf.styles) return callback();

    var sassFiles = builder.conf.styles.filter(function (name) {
      return name.match(/\.[sass|scss]$/i);
    });

    var batch = new Batch();

    sassFiles.forEach(function (sassFile) {
      batch.push(function (done) {
        var path = builder.path(sassFile)
          , name = sassFile.split('.')[0] + '.css';

        debug('compiling: %s', sassFile);

        // TODO this isnt real...
        //
        // What needs to happen:
        // - Use compass (check if enabled and installed)
        // - otherwise use sass
        // - add the -I directive if we have something to import
        sass.render(sassString, function (err, css) {
          builder.addFile('styles', name, css);
          builder.removeFile('styles', sassFile);
          done();
        });
      });
    });

    batch.end(callback);
  });
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
