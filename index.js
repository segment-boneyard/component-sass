var fs    = require('fs')
  , Batch = require('batch')
  , debug = require('debug')('component:sass')
  , sass  = require('node-sass');



/**
 * Settings.
 */

var compass = false;


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
        sass.render(sassString, function (err, css) {
          builder.addFile('styles', name, css);
          builder.removeFile('styles', sassFile);
          done();
        });

      });
    });

  });

};


/**
 * Whether to use Compass.
 */

module.exports.compass = function (enabled) {
  compass = enabled;
};