import fs from 'fs-extra' //calling fs-extra in place of fs, because there is additional functionality in that package
import path from 'path'
import { Icon } from './Icon'

const ICONS_DIR_NAME: string = '/icons'
const METADATA_FILE_NAME: string = '/icons.yml'
const MAP_FILE_NAME: string = 'icons.map.json'

class IconsMap {
  /**
   * List of icons in the /icons directory. File extensions have been removed from the entries
   * @protected
   */
  protected fileNames: string[]
  /**
   *
   * @protected
   */
  protected icons = {}

  /**
   * Code that should be called when the object is created. Moved to a separate function so we can use promises
   */
  async initialize() {
    //Move all required source files to the output directory
    const outDir = './bin'
    const sourceDir = './source'

    //Remove any outdated versions of the following files: icons.yml, /icons/*, /templates/*
    if (fs.existsSync(outDir + METADATA_FILE_NAME)) {
      await fs.unlinkSync(outDir + METADATA_FILE_NAME)
    }
    if (fs.existsSync(outDir + ICONS_DIR_NAME)) {
      await fs.rmSync(outDir + ICONS_DIR_NAME, { recursive: true })
    }
    if (fs.existsSync(outDir + '/templates')) {
      await fs.rmSync(outDir + '/templates', { recursive: true })
    }

    //Copy over fresh versions of the following files: icons.yml, icons/*, templates/*
    await fs.copyFileSync(sourceDir + METADATA_FILE_NAME, outDir + METADATA_FILE_NAME)
    await fs.copySync(sourceDir + ICONS_DIR_NAME, outDir + ICONS_DIR_NAME)
    await fs.copySync(sourceDir + '/templates', outDir + '/templates')

    //Get the list of icons from the icons directory and generate data for them
    this.fileNames = await fs.readdirSync(outDir + ICONS_DIR_NAME)
    for (let name of this.fileNames) {
      let icon = new Icon(name.replace('.svg', ''))
      await icon.initialize()
      this.icons[(name as string)] = icon
    }
  }

  /**
   * Generate an updated version of the icon map so we can build the fonts from it
   */
  async generateMap(): Promise<void> {
    let map = {}

    //Generate an object with all the required values for each icon
    await Object.values(this.icons).forEach((icon: Icon) => {
      map[icon.getName()] = {
        name: icon.getName(),
        codepoint: icon.getCodepointString(),
        description: icon.getDescription(),
        variables: icon.getVariables()
      }
    })

    //Generate a file with the map data in it
    try {
      await fs.writeFileSync('./source/' + MAP_FILE_NAME, JSON.stringify(map, null, 2))
      await fs.writeFileSync('./bin/' + MAP_FILE_NAME, JSON.stringify(map, null, 2))
    } catch (error) {
      console.log('Unable to generate icon map', error)
    }
  }

  public getFileNames(withPath: boolean = false): string[] {
    if (!withPath) {
      return this.fileNames
    }

    let fileNames: string[] = []
    for (const fileName of this.fileNames) {
      fileNames.push(path.resolve('./source/icons/', fileName))

    }

    return fileNames
  }

  public getIconNames(): string[] {
    return this.fileNames.map((name: string) => {
      return name.replace('.svg', '')
    })
  }
}

export { IconsMap }
