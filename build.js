/**
 * Build fonts
 */

// Depdencies
const glob = require('glob');
const webfontsGenerator = require('webfonts-generator');
const pkg = require('./package.json');

// Get list of files
glob('source/icons/**/*.svg', {}, (error, files) => {
  if (error) {
    console.error(error);
    console.error('\nThere was an error finding icons.');
  }

  // Generate
  webfontsGenerator(
    {
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
        pkg: pkg
      }
    },
    error => {
      if (error) {
        console.error(error);
        console.error('\nThere was an error building fonts.');
      }
      else {
        console.error('Done building fonts!');
      }
    }
  );
});
