import { Icon } from './Icon'
import fs from 'fs-extra' //calling fs-extra in place of fs, because there is additional functionality in that package
import path from 'path'

const ICONS_DIR_NAME: string = '/icons'
const METADATA_FILE_NAME: string = '/icons.yml'

class IconsMap {
  /**
   * List of icons in the /icons directory. File extensions have been removed from the entries
   * @protected
   */
  protected fileNames: string[] = []
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
    const fileNames = await fs.readdirSync(outDir + ICONS_DIR_NAME, {})
    for (let name of fileNames) {
      if (path.extname(name) !== '.svg') {
        continue
      }

      this.fileNames.push(name)
      let icon = new Icon(name.replace('.svg', ''))
      await icon.initialize()
      this.icons[(name as string)] = icon
    }
  }

  /**
   * Generate an updated version of the icon map so we can build the fonts from it
   */
  async generateMap(): Promise<object> {
    let map: object = {}

    //Generate an object with all the required values for each icon
    await Object.values(this.icons).forEach((icon: Icon) => {
      map[icon.getName()] = {
        name: icon.getName(),
        codepoint: icon.getCodepointString(),
        description: icon.getDescription(),
        variables: icon.getVariables(),
        aliases: icon.getAliases(),
        fileName: icon.getFileName(),
        absoluteFileName: icon.getAbsoluteFileName()
      }
    })

    //Return the map data
    return map
  }

  /**
   * Return the list of icon filenames. If the `withPath` flag has been set to true, include the absolute path to each
   * file as part of the data.
   *
   * @param {boolean} withPath
   */
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

  /**
   * Get the list of each of the icon names. This is basically the same thing as the file names but without the file
   * extension.
   */
  public async getIconNames(): Promise<string[]> {
    return this.fileNames.map((name: string) => {
      return name.replace('.svg', '')
    })
  }

  public async getAliasMap() {
    let map: object = {}

    for (const value of Object.values(this.icons)) {
      const icon: Icon = (value as Icon)
      if (icon.getAliases().length > 0) {
        for (const alias of icon.getAliases()) {
          map[alias] = icon.getCodepoint()
        }
      }
    }

    return map
  }
}

export { IconsMap }
