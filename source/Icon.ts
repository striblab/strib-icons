import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

class Icon {
  /**
   * Name of the icon
   * @protected
   */
  protected name: string
  /**
   * Unique codepoint for the icon
   */
  protected codepoint: number
  /**
   * description of the icon
   */
  protected description: string
  /**
   * Any variables available in the icon
   */
  protected variables: string[]
  /**
   * Any deprecated names that use the same icon. This is not used yet.
   */
  protected aliases: string[]
  /**
   * Icon file name
   * @protected
   */
  protected fileName: string
  /**
   * Absolute path of the icon file name
   * @protected
   */
  protected absoluteFileName: string

  constructor(name: string = '', codepoint: number = null) {
    this.name = name
    this.codepoint = codepoint
    this.description = ''
    this.variables = []
    this.aliases = []
  }

  /**
   * Code that should be called when the object is created. Moved to a separate function so we can use promises
   */
  public async initialize() {
    //Get the metadata for the icon
    const metadata = await yaml.safeLoad(await fs.readFileSync('./source/icons.yml'))
    if (metadata.hasOwnProperty(this.name)) {
      this.description = metadata[this.name].description ?? ''
      this.variables = metadata[this.name].variables ?? []
      this.aliases = metadata[this.name].aliases ?? []
    }

    this.fileName = this.name + '.svg'
    this.absoluteFileName = path.resolve('./source/icons', this.fileName)
  }

  /**
   * Get the icon's name
   */
  public getName(): string {
    return this.name
  }

  /**
   * Get the icon's description
   */
  public getDescription(): string {
    return this.description
  }

  /**
   * Get the icon's variables
   */
  public getVariables(): string[] {
    return this.variables
  }

  /**
   * Get the icon's aliases. This is not used yet.
   */
  public getAliases(): string[] {
    return this.aliases
  }

  /**
   * Get the icon's codepoint value
   */
  public getCodepoint(): number {
    return this.codepoint
  }

  /**
   * Get the hex/string version of the icon's codepoint value
   */
  public getCodepointString(): string {
    return this.codepoint.toString(16)
  }

  /**
   * Get the file name of the icon
   */
  public getFileName(): string {
    return this.fileName
  }

  /**
   * Get the absolute path file name
   */
  public getAbsoluteFileName(): string {
    return this.absoluteFileName
  }
}

export { Icon }
