import { IconsMap } from './IconsMap'
import { CodepointsMap } from './CodepointsMap'

import fs from 'fs-extra' //calling fs-extra in place of fs, because there is additional functionality in that package
import path from 'path'
import SVGSprite from 'svg-sprite'
import webfont from 'webfonts-generator'
import handlebars from 'handlebars'

(async () => {
  const packageData = require('../package.json')
  const buildDate = new Date()

  //Generate a new icon map so that we have all the icon names, codepoints, and metadata in one file
  let map = new IconsMap()
  await map.initialize()
  await map.generateMap()

  const fileNames = map.getFileNames(true)
  const aliases: {} = await map.getAliasMap()
  const metadata: {} = require('./icons.map.json')

  //Generate a list of codepoints that include any known aliases for icons
  const codepoints = {
    ...CodepointsMap.getMap({}),
    ...CodepointsMap.getMap(await map.getAliasMap())
  }

  //Generate a list of codepoints that include any known aliases for icons
  const hexCodepoints = {
    ...CodepointsMap.getMap({}, true),
    ...CodepointsMap.getMap(await map.getAliasMap(), true)
  }

  /**
   * NOTE: We could let the font generator create the css and html itself, but the automated system doesn't follow the
   * codepoints supplied.
   * */
  let fontOptions = {
    files: fileNames,
    dest: 'build/',
    fontName: 'strib-icons',
    types: [ 'eot', 'woff2', 'woff', 'ttf', 'svg' ],
    normalize: true,
    fontHeight: 1010,
    html: false, //We are no longer letting the webfont generator generate the non-font files, but doing it manually to have more control over the output
    codepoints: codepoints,
    templateOptions: {
      classPrefix: 'strib-',
      baseSelector: '.strib-icon',
      pkg: packageData,
      meta: metadata, //icon map file generated above
      buildDate: buildDate.toLocaleDateString() + ' ' + buildDate.toLocaleTimeString(),
      aliases: aliases
    },
    scssSourceUrls: '',
    cssSourceUrls: ''
  }
  fontOptions['scssSourceUrls'] = await generateSourceUrls(fontOptions, 'scss')
  fontOptions['cssSourceUrls'] = await generateSourceUrls(fontOptions, 'css')

  //Generate the sprite file used when accessing the svg's directly in the template
  await generateSprites(fontOptions, metadata)

  //Generate the webfont files in the build folder
  webfont(fontOptions, async error => {
    if (error) {
      console.error(error)
      console.error('\nThere was an error building fonts.')
    }

    /**
     * Manually generate all the additional files for the icon set, since the webfont builder does not do a good enough
     * job maintaining codepoints for icons between builds
     */
    //Generate the index page for the icon set
    fs.writeFileSync(
      path.join(fontOptions.dest, `index.html`),
      handlebarTemplate('templates/index.html.hbs')({
        options: fontOptions,
        names: await map.getIconNames(),
      })
    )

    //Make sure the directory all the icons go into exists
    if (!fs.existsSync(fontOptions.dest + '/icons')) {
      await fs.mkdirSync(fontOptions.dest + '/icons')
    }

    //Generate info pages for each of the icons
    for (const name of await map.getIconNames()) {
      fs.writeFileSync(
        path.join(fontOptions.dest + '/icons', `${name}.html`),
        handlebarTemplate('templates/icon.html.hbs')({
          options: fontOptions,
          name: name,
          metadata: fontOptions.templateOptions.meta[name],
          // svg: handlebars.Utils.escapeExpression(await fs.readFileSync(fontOptions.templateOptions.meta[name].absoluteFileName))
          svg: await fs.readFileSync(fontOptions.templateOptions.meta[name].absoluteFileName)
        })
      )
    }
    //Generate the css file for the icon set
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.css`),
      handlebarTemplate('templates/template.css.hbs')({
        options: fontOptions,
        classes: await map.getIconNames(),
        src: fontOptions.cssSourceUrls,
        codepoints: hexCodepoints,
      })
    )
    //Generate the JS file needed for using the svg images
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.js`),
      handlebarTemplate('templates/template.js.hbs')({
        pkg: packageData,
        options: fontOptions,
        classes: await map.getIconNames(),
      })
    )
    //Generate the json file for th icon set
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.json`),
      handlebarTemplate('templates/template.json.hbs')({
        options: fontOptions,
        classes: await map.getIconNames()
      })
    )
    //Generate the scss file for the icon set
    fs.writeFileSync(
      path.join(fontOptions.dest, `${fontOptions.fontName}.scss`),
      handlebarTemplate('templates/template.scss.hbs')({
        options: fontOptions,
        classes: await map.getIconNames(),
        scssSrc: fontOptions.scssSourceUrls,
        codepoints: hexCodepoints
      })
    )

    console.log('Done building fonts!')
  })

  /**
   * Access the provided template
   * @param {string} templateName
   */
  function handlebarTemplate(templateName: string) {
    return handlebars.compile(
      fs.readFileSync(path.join(__dirname, templateName), 'utf-8')
    )
  }

  handlebars.registerHelper('eq', (a, b) => {
    return (a === b);
  })

  /**
   * Generate the sprite file for when we want to use the SVGs directly, rather than the font version of the icon.
   * Includes aliased icons when building sprite file
   *
   * @param fontOptions
   * @param metadata
   */
  async function generateSprites(fontOptions, metadata): Promise<void> {
    const spriteOptions = {
      shape: {
        meta: metadata,
        id: {
          generator: 'strib-%s'
        }
      },
      mode: {
        symbol: true,
      }
    }

    let sprites = new SVGSprite(spriteOptions)
    for (const icon of Object.values(metadata)) {
      sprites.add(icon['absoluteFileName'], icon['fileName'], fs.readFileSync(icon['absoluteFileName'], 'utf-8'))

      if (icon['aliases'].length > 0) {
        for (const alias of icon['aliases']) {
          const absoluteFileName: string = icon['absoluteFileName'].replace(icon['name'], alias)
          let contents: string = fs.readFileSync(icon['absoluteFileName'], 'utf-8')

          /**
           * These three icons had malformed variable names putting the word 'strib' in the name twice. To support
           * backwards compatibility, we are adding the double-strib back into the SVG contents for the alias icons
           */
          if (icon['name'] == 'star' || icon['name'] == 'logo' || icon['name'] == 'z1-account-widget') {
            contents = contents.replace(/--strib/g, '--strib-strib')
          }

          sprites.add(absoluteFileName, alias + '.svg', contents)
        }
      }
    }
    sprites.compile(async (error, result) => {
      if (error) {
        console.error(error)
        console.error('', 'There was an error building SVG sprite.')
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
          )
        }
      }

      console.log('Done building SVG sprites!')
    })
  }

  /**
   * Generate the font URLs (with cache busting) that will be included in the generated style files. String output
   * looks like:
   *
   * url("#{$strib-fonts-location}#{$strib-fonts-font-name}.svg?1680891038609#strib-icons") format("embedded-opentype"),
   * url("#{$strib-fonts-location}#{$strib-fonts-font-name}.ttf?1680891038609") format("truetype"),
   * url("#{$strib-fonts-location}#{$strib-fonts-font-name}.woff?1680891038609") format("woff"),
   * url("#{$strib-fonts-location}#{$strib-fonts-font-name}.woff2?1680891038609") format("woff2"),
   * url("#{$strib-fonts-location}#{$strib-fonts-font-name}.eot?1680891038609#iefix") format("embedded-opentype")
   *
   * @param options
   * @param {string} type
   */
  async function generateSourceUrls(options, type: string = 'css'): Promise<string> {
    const formats = {
      eot: { suffix: '#iefix', format: 'embedded-opentype' },
      woff2: { format: 'woff2' },
      woff: { format: 'woff' },
      ttf: { format: 'truetype' },
      svg: { suffix: `#${options.fontName}`, format: 'svg' }
    }
    const timestamp: number = +new Date()

    let output: string = ''
    for (const [ index, type ] of Object.entries(options.types)) {
      let url = ''
      if (type === 'scss') {
        url = `url("#{$strib-fonts-location}#{$strib-fonts-font-name}.${type}?${timestamp}${
          formats[(type as string)].suffix ? formats[(type as string)].suffix : ''
        }") format("${formats[(type as string)].format}")${
          +index < (options.types.length - 1) ? ",\n    " : ""
        }`
      } else {
        url = `url("${options.fontName}.${type}?${timestamp}${
          formats[(type as string)].suffix ? formats[(type as string)].suffix : ''}") format("${
          formats[(type as string)].format}")${+index < options.types.length - 1 ? ",\n  " : ""}`
      }

      output += url
    }

    return output
  }
})()
