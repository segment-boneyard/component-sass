# component-sass

  A plugin to transpile Sass files for the component builder.

## Install

    $ npm install segmentio/component-sass#0.0.3

## Usage
  
  Add your `.sass` or `.scss` files to the `styles` array in your `component.json`:

  ```js
  {
    "styles": [
      "base.sass",
      "button.scss"
    ]
  }
  ```

  Use the plugin during your build process:

  ```js
  var fs      = require('fs')
    , Builder = require('component-builder')
    , sass    = require('component-sass');

  var builder = new Builder(__dirname);

  builder.use(sass);

  builder.build(function(err, res){
    if (err) throw err;
    fs.writeFileSync('build/build.js', res.require + res.js);
    if (res.css) fs.writeFileSync('build/build.css', res.css);
  });
  ```
