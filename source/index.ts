import fs from 'fs-extra' //calling fs-extra in place of fs, because there is additional functionality in that package
import path from 'path'
import { IconsMap } from './IconsMap'
import SVGSprite from 'svg-sprite'
import webfont from 'webfonts-generator'
import handlebars from 'handlebars'
import { CodepointsMap } from './CodepointsMap'

(async () => {
  const packageData = require('../package.json')

  let map = new IconsMap()
  await map.initialize()
  await map.generateMap()

  const fileNames = map.getFileNames(true)

  // let map = new CodepointsMap()
  // await map.initialize()

  // let icon = new Icon('data-drop')
  // await icon.initialize()
  // console.log(icon.name, icon.codepoint, icon.description, icon.variables)

  let fontOptions = {
    files: fileNames,
    dest: 'test/',
    fontName: 'strib-icons',
    types: [ 'svg', 'ttf', 'woff', 'woff2', 'eot' ],
    normalize: true,
    fontHeight: 1010,
    html: true,
    cssTemplate: './bin/templates/template.css.hbs',
    htmlTemplate: './bin/templates/template.html.hbs',
    htmlDest: './test/index.html',
    templateOptions: {
      classPrefix: 'strib-',
      baseSelector: '.strib-icon',
      pkg: packageData,
      meta: require('./icons.map.json')
    },
    scssSourceUrls: ''
  }

  fontOptions['scssSourceUrls'] = await generateScssSourceUrls(fontOptions)

  await generateSprites(fontOptions)

  let jsonTemplate = handlebars.compile(
    fs.readFileSync(path.join(__dirname, 'templates/template.json.hbs'), 'utf-8')
  );
  let scssTemplate = handlebars.compile(
    fs.readFileSync(path.join(__dirname, 'templates/template.scss.hbs'), 'utf-8')
  );
  let jsTemplate = handlebars.compile(
    fs.readFileSync(path.join(__dirname, 'templates/template.js.hbs'), 'utf-8')
  );

  webfont(fontOptions, error => {
    if (error) {
      console.error(error);
      console.error('\nThere was an error building fonts.');
    }

    // Manually create JSON and SASS files
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.json`),
      jsonTemplate({
        options: fontOptions,
        classes: map.getIconNames()
      })
    );
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.scss`),
      scssTemplate({
        options: fontOptions,
        classes: map.getIconNames(),
        scssSrc: fontOptions.scssSourceUrls,
        codepoints: CodepointsMap.getStringMap()
      })
    );
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.js`),
      jsTemplate({
        pkg: packageData,
        options: fontOptions,
        classes: map.getIconNames(),
        scssSrc: fontOptions.scssSourceUrls
      })
    );

    console.error('Done building fonts!');
  })

  /**
   * Generate the sprite file for when we want to use the SVGs directly, rather than the font version of the icon
   * @param fontOptions
   */
  async function generateSprites(fontOptions) {
    let spriteOptions = {
      shape: {
        meta: path.join(__dirname, '/icons.yml'),
        id: {
          generator: 'strib-%s'
        }
      },
      mode: {
        symbol: true,
      }
    }

    let sprites = new SVGSprite(spriteOptions);
    fileNames.forEach(name => {
      sprites.add(name, null, fs.readFileSync(name, 'utf-8'));
    });
    sprites.compile(async (error, result) => {
      if (error) {
        console.error(error);
        console.error('', 'There was an error building SVG sprite.');
      }

      // Write files.  This doesn't really account for all the different options
      // of svg-sprite that well.
      for (let mode in result) {
        for (let resource in result[mode]) {
          await fs.writeFileSync(
            path.join(
              fontOptions.dest,
              `${fontOptions.fontName}.${mode === 'symbol' ? '' : mode + '-'}sprite.svg`
            ),
            result[mode][resource].contents
          );
        }
      }

      console.log('Done building SVG sprites!');
    })
  }

  /**
   * Generate the font URLs (with cache busting) that will be included in the generated style files
   * @param options
   */
  async function generateScssSourceUrls(options) {
    let formats = {
      eot: { suffix: '#iefix', format: 'embedded-opentype' },
      woff2: { format: 'woff2' },
      woff: { format: 'woff' },
      ttf: { format: 'truetype' },
      svg: { suffix: `#${options.fontName}`, format: 'embedded-opentype' }
    };
    let timestamp = +new Date();

    let output = '';
    for (const [ index, type ] of Object.entries(options.types)) {
      let url = `url("#{$strib-fonts-location}#{$strib-fonts-font-name}.${type}?${timestamp}${
        formats[(type as string)].suffix ? formats[(type as string)].suffix : ''
      }") format("${formats[(type as string)].format}")${
        +index < (options.types.length - 1) ? ",\n" : ""
      }`;

      output += url
    }

    return output;
  }
})()
