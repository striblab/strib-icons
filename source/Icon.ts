import { CodepointsMap } from './CodepointsMap';
import yaml from 'js-yaml'
import fs from 'fs'

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
   * Any deprecated names that use the same icon
   */
  protected aliases: string[]

  constructor(name: string = '') {
    this.name = name
    this.description = ''
    this.variables = []
    this.aliases = []
  }

  /**
   * Code that should be called when the object is created. Moved to a separate function so we can use promises
   */
  public async initialize() {
    let map = new CodepointsMap()
    await map.initialize()

    //Get a codepoint for the icon
    let point = await map.getPointFromMap(this.name)
    if (point) {
      this.codepoint = point
    } else {
      this.codepoint = await map.addIcon(this.name)
    }

    //Get the metadata for the icon
    let metadata = await yaml.safeLoad(await fs.readFileSync('./source/icons.yml'))
    if (metadata.hasOwnProperty(this.name)) {
      this.description = metadata[this.name].description ?? ''
      this.variables = metadata[this.name].variables ?? []
    }
  }

  public getName(): string {
    return this.name
  }

  public getDescription(): string {
    return this.description
  }

  public getVariables(): string[] {
    return this.variables
  }

  public getAliases(): string[] {
    return this.aliases
  }

  public getCodepoint(): number {
    return this.codepoint
  }

  public getCodepointString(): string {
    return this.codepoint.toString(16)
  }
}

export { Icon }
