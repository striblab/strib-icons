/**
 * Build fonts
 */

// Depdencies
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const handlebars = require('handlebars');
const webfontsGenerator = require('webfonts-generator');
const SVGSprite = require('svg-sprite');
const yaml = require('js-yaml');
const pkg = require('./package.json');

// Get list of files
glob(path.join(__dirname, 'source/icons/**/*.svg'), {}, (error, files) => {
  if (error) {
    console.error(error);
    console.error('\nThere was an error finding icons.');
  }

  // Read YAML data
  let metaData = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'source/icons.yml'), 'utf8'));

  // Webfont generator options
  let fontOptions = {
    files: files,
    dest: 'build/',
    fontName: 'strib-icons',
    types: ['svg', 'ttf', 'woff', 'woff2', 'eot'],
    normalize: true,
    fontHeight: 1010,
    html: true,
    cssTemplate: 'source/templates/template.hbs.css',
    htmlTemplate: 'source/templates/template.hbs.html',
    htmlDest: 'build/index.html',
    templateOptions: {
      classPrefix: 'strib-',
      baseSelector: '.strib-icon',
      pkg: pkg,
      meta: metaData
    }
  };

  // Sprite options
  let spriteOptions = {
    shape: {
      meta: path.join(__dirname, 'source/icons.yml')
    },
    mode: {
      symbol: true,
    }
  };

  // SVG sprite
  let spriter = new SVGSprite(spriteOptions);
  files.forEach(f => {
    spriter.add(f, null, fs.readFileSync(f, 'utf-8'));
  });
  spriter.compile((error, result) => {
    if (error) {
      console.error(error);
      console.error('\nThere was an error building SVG sprite.');
    }

    // Write files.  This doesn't really account for all the different options
    // of svg-sprite that well.
    for (let mode in result) {
      for (let resource in result[mode]) {
        fs.writeFileSync(
          path.join(
            fontOptions.dest,
            `${fontOptions.fontName}.${
              mode === 'symbol' ? '' : mode + '-'
            }sprite.svg`
          ),
          result[mode][resource].contents
        );
      }
    }

    console.error('Done building SVG sprites!');
  });

  // Get some templates
  let jsonTemplate = handlebars.compile(
    fs.readFileSync(
      path.join(__dirname, 'source/templates/template.hbs.json'),
      'utf-8'
    )
  );
  let scssTemplate = handlebars.compile(
    fs.readFileSync(
      path.join(__dirname, 'source/templates/template.hbs.scss'),
      'utf-8'
    )
  );

  // Classes from file names
  let classes = files.map(f => {
    return f
      .replace('.svg', '')
      .split('/')
      .pop();
  });

  // The src for the font is rendered and then included in template,
  // so we make something a bit more template helpful
  //

  // Generate
  webfontsGenerator(fontOptions, error => {
    if (error) {
      console.error(error);
      console.error('\nThere was an error building fonts.');
    }

    // Manually create JSON and SASS files
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.json`),
      jsonTemplate({
        options: fontOptions,
        classes: classes
      })
    );
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.scss`),
      scssTemplate({
        options: fontOptions,
        classes: classes,
        scssSrc: scssFontSource(fontOptions)
      })
    );

    console.error('Done building fonts!');
  });
});

// To help with some template, specifically SCSS, where
// we want to make the base URL a variable
function scssFontSource(options) {
  let formats = {
    eot: { suffix: '#iefix', format: 'embedded-opentype' },
    woff2: { format: 'woff2' },
    woff: { format: 'woff' },
    ttf: { format: 'truetype' },
    svg: { suffix: `#${options.fontName}`, format: 'embedded-opentype' }
  };
  let ts = +new Date();

  let output = '';
  options.types.forEach((t, ti) => {
    output += `url("#{$strib-fonts-location}#{$strib-fonts-font-name}.${t}?${ts}${
      formats[t].suffix ? formats[t].suffix : ''
    }") format("${formats[t].format}")${
      ti < options.types.length - 1 ? ',\n' : ''
    }`;
  });

  return output;
}
