var Builder = require('component-builder')
  , fs      = require('fs')
  , mkdir   = require('mkdirp')
  , path    = require('path')
  , sass    = require('../');

var builder = new Builder(path.resolve(__dirname, '../example'));

builder.use(sass);

builder.build(function(err, res){
  if (err) throw err;
  mkdir.sync('build');
  fs.writeFileSync('build/build.js', res.require + res.js);
  if (res.css) fs.writeFileSync('build/build.css', res.css);
});