var Builder = require('component-builder')
  , fs      = require('fs')
  , sass    = require('../');



var builder = new Builder(__dirname);

sass.style('expanded');
sass.compass(true);
builder.use(sass);

builder.build(function (err, res) {
  if (err) throw err;
  fs.writeFileSync('example/build.css', res.css);
});