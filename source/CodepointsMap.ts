import fs from 'fs'

/**
 * Starting point for incrementing new codepoints. If we are starting fresh with no map, the first point generated
 * will actually be 0xF101 because we increment the value before saving
 *
 * @protected
 */
const STARTING_CODEPOINT: number = 0xF100
/**
 * Name of the map this file processes and updates
 */
const MAP_FILE_NAME: string = 'codepoints.map.json'

class CodepointsMap {
  /**
   * icon names and their codepoints, as imported from the map file (icon name is key, point is value)
   * @protected
   */
  protected codepoints = {}
  /**
   * Same as codepoints, but with the names and points inverted (point is key, icon name is value)
   * @protected
   */
  protected invertedCodepoints = {}

  /**
   * Code that should be called when the object is created. Moved to a separate function so we can use promises
   */
  public async initialize() {
    //Import the map contents so we can process
    let map = require('./' + MAP_FILE_NAME)

    //Add any map data to the object for use
    if (!await this.isMapEmpty(map)) {
      this.codepoints = await this.convertMapToObject(map)
      this.invertedCodepoints = await this.convertMapToObject(map, true)
    }
  }

  /**
   * Validate the map file by checking if all the point entries are unique. This is done by checking the length of the
   * JSON as imported (icon name = point) against the length of the passed map. If no map is passed to the function,
   * compare against the length of the inverted map (point = icon name)
   *
   * If the map is not valid, then there is an issue in the codebase that should be addressed
   *
   * @param {object} map
   */
  public async isValidMap(map: object = {}): Promise<boolean> {
    //If we passed a map to the function, compare that to the codepoints object
    if (!await this.isMapEmpty(map)) {
      return Object.keys(this.codepoints).length === Object.keys(map).length;
    }

    //If no map was passed to the function, compare to the inverted map
    return Object.keys(this.codepoints).length === Object.keys(this.invertedCodepoints).length;
  }

  /**
   * Check to see if the codepoint map is empty. This means we've either not created any icons in the font or there
   * was an issue importing the map. Returns true when empty
   *
   * @param {object} map
   */
  public async isMapEmpty(map: object = {}): Promise<boolean> {

    return Object.keys(map).length < 1
  }

  /**
   * Add a new icon to the codepoint map
   * @param {string} name
   */
  public async addIcon(name: string): Promise<number | null> {
    //If the icon already exists in the map, just return
    if (this.codepoints.hasOwnProperty(name)) {
      return this.codepoints[name]
    }

    const sanitizedName = await this.slugify(name)

    //Generate a codepoint number for the new icon and add it to the map objects
    let point = await this.generateCodepoint()
    this.codepoints[sanitizedName] = point
    this.invertedCodepoints[point] = sanitizedName

    // //Write the current map to the map file
    if (await this.isValidMap()) {
      try {
        await this.generateMap()
      } catch (error) {
        console.log('Unable to update ' + MAP_FILE_NAME, error)
        return null
      }

      return point
    }

    //If we got to this point, then there was a problem
    return null
  }

  /**
   * Get a single point from the map (based on the icon name)
   *
   * @param {string} name
   */
  public async getPointFromMap(name: string): Promise<number | null> {
    const sanitizedName = await this.slugify(name)

    if (this.codepoints.hasOwnProperty(sanitizedName)) {
      return this.codepoints[sanitizedName]
    }

    return null
  }

  /**
   * Convert a codepoint map (format { iconName: point, iconName: point}) to a formatted object (we want to make sure
   * the name is a string and the point is a number)
   * @param {object} map
   * @param {boolean} invert
   * @protected
   */
  protected async convertMapToObject(map: object, invert: boolean = false): Promise<object> {
    let codepoints = {}
    for (const [ name, point ] of Object.entries(map)) {
      if (invert) {
        codepoints[(point as number)] = (name as string)
      } else {
        codepoints[(name as string)] = (point as number)
      }
    }

    return codepoints
  }

  /**
   * Sanitize the text so it can be used as an icon name
   *
   * @param {string} text
   * @protected
   */
  protected async slugify(text: string): Promise<string> {
    return text.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Write the updated map data to the map file, then collect the written file to a new variable so we can validate it
   * against what is saved to the class
   *
   * @protected
   */
  protected async generateMap(): Promise<void> {
    //Write the file with the updated json data (write it in both the source directory and the generated directory just to be safe
    await fs.writeFileSync('./source/' + MAP_FILE_NAME, JSON.stringify(this.codepoints, null, 2))
    await fs.writeFileSync('./bin/' + MAP_FILE_NAME, JSON.stringify(this.codepoints, null, 2))
  }

  /**
   * Generate a new codepoint by either incrementing from the starting point number (STARTING_CODEPOINT constant) or
   * from the highest number on the existing codepoint map
   * @protected
   */
  protected async generateCodepoint(): Promise<number> {
    //Let's start with the default
    let lastCodepoint: number = STARTING_CODEPOINT
    if (!await this.isMapEmpty(this.codepoints)) {
      //If our map isn't empty, use the last item in the map
      lastCodepoint = +Object.keys(this.invertedCodepoints).sort().reverse()[0]
    }

    //Increment the point and return for use
    return ++lastCodepoint
  }
}

export { CodepointsMap }
