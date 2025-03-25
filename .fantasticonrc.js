'use strict'

const codepoints = require('./font/strib-icons.json')

module.exports = {
  inputDir: './icons',
  outputDir: './font',
  fontTypes: ['woff2', 'woff', 'ttf', 'eot'],
  assetTypes: ['css', 'scss', 'json'],
  codepoints,
  name: 'strib-icons',
  prefix: 'strib',
  selector: '.strib-icon',
  fontsUrl: './fonts',
  formatOptions: {
    json: {
      indent: 2
    }
  },
  // Use our custom Handlebars templates
  templates: {
    css: './build/font/css.hbs',
    scss: './build/font/scss.hbs'
  },
  pathOptions: {
    json: './font/strib-icons.json',
    css: './font/strib-icons.css',
    scss: './font/strib-icons.scss',
    woff: './font/fonts/strib-icons.woff',
    woff2: './font/fonts/strib-icons.woff2',
    ttf: './font/fonts/strib-icons.ttf',
    eot: './font/fonts/strib-icons.eot'
  }
}
