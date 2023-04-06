module.exports = {
  inputDir: './source/icons', // (required)
  outputDir: './dist', // (required)
  fontTypes: ['ttf', 'woff', 'woff2', 'eot', 'svg'],
  assetTypes: ['ts', 'css', 'json', 'html'],
  name: 'strib-icons',
  selector: '.strib-icon',
  prefix: 'strib-',
  formatOptions: {
    // Pass options directly to `svgicons2svgfont`
    woff: {
      // Woff Extended Metadata Block - see https://www.w3.org/TR/WOFF/#Metadata
      metadata: '...'
    },
    json: {
      // render the JSON human readable with two spaces indentation (default is none, so minified)
      indent: 2
    },
    ts: {
      // select what kind of types you want to generate (default `['enum', 'constant', 'literalId', 'literalKey']`)
      types: ['constant', 'literalId'],
      // render the types with `'` instead of `"` (default is `"`)
      singleQuotes: true,
      // customise names used for the generated types and constants
      enumName: 'MyIconType',
      constantName: 'MY_CODEPOINTS'
      // literalIdName: 'IconId',
      // literalKeyName: 'IconKey'
    }
  },
  // Use a custom Handlebars template
  templates: {
    scss: './source/templates/template.scss.hbs',
    css: './source/templates/template.css.hbs',
    html: './source/templates/template.html.hbs',
    js: './source/templates/template.js.hbs',
    json: './source/templates/template.json.hbs'
  },
  pathOptions: {
    html: 'dist/index.html',
  },
  codepoints: {
    // 'arrow-right': 'f101', // decimal representation of 0xe000
    // 'chevron-right': 57345,
    // 'thumbs-up': 57358,
    // 'thumbs-down': 57359
  },
  // Customize generated icon IDs (unavailable with `.json` config file)
  getIconId: ({
    basename, // `string` - Example: 'foo';
    relativeDirPath, // `string` - Example: 'sub/dir/foo.svg'
    absoluteFilePath, // `string` - Example: '/var/icons/sub/dir/foo.svg'
    relativeFilePath, // `string` - Example: 'foo.svg'
    index // `number` - Example: `0`
  }) => basename // [index, basename].join('_') // '0_foo'
};