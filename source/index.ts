import fs from 'fs-extra' //calling fs-extra in place of fs, because there is additional functionality in that package
import { CodepointsMap } from './CodepointsMap'
import { Icon } from './Icon'
import { IconsMap } from './IconsMap'

(async () => {
  let map = new IconsMap()
  await map.initialize()
  await map.generateMap()

  console.log(map.getFileNames())

  // let map = new CodepointsMap()
  // await map.initialize()

  // let icon = new Icon('data-drop')
  // await icon.initialize()
  // console.log(icon.name, icon.codepoint, icon.description, icon.variables)

  // let fontOptions = {
  //   files: files,
  //   dest: 'build/',
  //   fontName: 'strib-icons',
  //   types: [ 'svg', 'ttf', 'woff', 'woff2', 'eot' ],
  //   normalize: true,
  //   fontHeight: 1010,
  //   html: true,
  //   cssTemplate: 'source/templates/template.hbs.css',
  //   htmlTemplate: 'source/templates/template.hbs.html',
  //   htmlDest: 'build/index.html',
  //   templateOptions: {
  //     classPrefix: 'strib-',
  //     baseSelector: '.strib-icon',
  //     pkg: pkg,
  //     meta: metaData
  //   }
  // }
})()
