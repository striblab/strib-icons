# Star Tribune Icons

Icons used in projects as different formats. Shout out to [Bootstrap Icons](https://icons.getbootstrap.com/) for the
foundation of this library.

## Requirements

- Node 18 or higher
- Yarn 4

## Things to note

- Colors embedded in an icon do not display in the font version of the icon. This is expected behavior. To use the color
  version of an icon, you will need to use the sprite or embed the SVG info directly on the page.
- There are many icons in this font that are designated "color" icons and will not work as a normal font icon because
  the color coverage is near 100%. In these situations, you will need to use the Sprite or embed the SVG directly in
  your project.
    - These icons all have the suffix `-color` in the icon name. Examples: `sports-league-nhl-color` and
      `weather-day-sunny-lg-color`
- Self-hosted is required to be able to verify certain features on the site:
    - Download SVG - The download button on icon pages will only trigger an actual download when viewing the self-hosted
      site. Otherwise, it will just navigate you to the svg file.
    - Sprite displays - Sprite displays might only display (both on the icon page and the sprites page) when viewing the
      self-hosted site. This is related to [an issue with chrome-based browsers](https://bugs.chromium.org/p/chromium/issues/detail?id=470601).
- The `company-name` icon looks super-duper small in the icon list because the text itself is so wide.

## Adding and managing icons

### Setting up the Application

* Open a terminal window and navigate to the application's root directory
    1. Make sure your computer supports the appropriate version of NodeJS and run: `npm install`
    2. Run: `pwd` to output the full path of the application's root directory (aka: your "application root path"). Copy
       this value so you can use it below
        * Example: `/Users/riggllm/GitHub/strib-icons`
* Add your application root path to the "local development" configuration file
    1. In your IDE, open the `config/local/hugo.yml` file
    2. Add your application root path value to the `baseUrl` property in the config file
        * Example: `baseURL: "/Users/riggllm/GitHub/strib-icons"`
    3. Add `/_site` to the end of the `baseUrl` value.
        * Example: `baseURL: "/Users/riggllm/GitHub/strib-icons/_site"`
* Instruct your local GitHub to ignore any changes to the local development configuration.
    1. Run the following command: `git update-index --assume-unchanged config/local/hugo.yml`
        * This will allow you to work locally on your computer without having to worry about accidentally committing
          your local file path to the GitHub repo.
        * **Note:** Doing this will update your computer's GitHub configuration, but will not affect any other computer
          or user, nor will it change the repo itself. If work in this repo on multiple computers, you will need to run
          this on every computer you work on.
* The old version of the application had a self-hosting option that is replicated in this version of the application.
  However, self-hosting is only required to verify specific features. See "Scrips and Commands" below for more info
  about building and self-hosting.

### Icons

* Icons should be in SVG format.
    * Canvas/artboard dimensions are 16px x 16px.
    * SVG should be centered in the canvas, with a 1px gap on each of the widest sides
    * <img src="readme-images/artboard-gap-example.png" width="400" height="400" /> 
* Do not set a fill color on SVG paths unless the color is very important, such as with company logos.
    * When Icons are processed into the font, most properties are stripped off of the SVG to condense the information as
      much as possible. "fill" is **not** one of the properties that is stripped.
    * If you need to maintain a fill color on an icon, use a CSS variable with a default hex color. Example:
      ```
      fill="var(--company-logo-top, #65cc5c)"
      ```
      Doing this allows control over the icon colors while also providing a working color to already be present.
    * Do NOT use "white" to create a hole in the icon. This should be avoided by eliminating overlaps between layers in
      your image editor.
        * Note: There are technically two icons that do this at this time: `social-youtube` and `social-spotify`. This
          is because the white is actually part of the color logo, and the "hole" in question is coincidentally
          necessary for the font version of the icon.
    * You may need to manually edit the SVG to do these things.
* Icon originals are stored in `icons/`. To add new icons, add them here.
    * The file name of the icon will become the class name of the icon in CSS, so be consistent and reasonable, use only
      lowercase and dashes, i.e. `category-name-modifier.svg`. Example: `sports-league-nba.svg` or `weather-day-sunny-lg.svg`
    * The codepoint for new icons will automatically be generated at the end of the list.
* Run: `npm run pages` to generate markdown files for new icons. Once the markdown files have been created, go into them
  and add any additional information as needed.
    * Things like `categories` and `tags` aid with the search field.
    * `variables` provides additional information to display on the icon detail page

### Scripts and Commands

* Run: `npm run pages` to generate markdown files for any icons that were added.
* Run: `npm run icons` generate new font files and code points for new icons.
* Run: `npm run docs:build` to build a non-hosted version of the site for local development.
    * Non hosted site found at location you added to `/config/local/hugo.yml`.
    * URL Example: `file:///Users/riggllm/GitHub/strib-icons/_site/index.html`
    * **Note:** Sometimes changed icons do not display properly when running this command on its own. Running the icons
      command prior to this (either independently, or as part of the same command line) typically fixes this.
        * Example: `npm run icons && npm run docs:build`
* Run: `npm run start` to build and serve a hosted version of the site for local development.
    * Hosted site is, by default, found at: `http://localhost:4000`.
    * If the port or default address is not working in your browser, check the terminal output for a line that looks like:
      `Web Server is available at //localhost:4000/ (bind address 127.0.0.1)`
* Run: `npm run version:increment` to modify the version number of the production application.
    * You need to supply the "current" version number (example: `1.0`) and the "new" version number (example: `1.1`) to
      the command.
        * Example: `npm run version:increment 1.0 1.1`
    * The "new" version number will need to match the folder the production application lives in
* Run: `npm run release:build` to build the production code for deployment.
    * This rebuilds the icon and html files using the production base URL, rather than your local computer.
    * Note: This should be the last command run when prepping for release.

### Templates

Templates are managed in `docs/` and are used to output the CSS and HTML. The application uses Hugo to build and serve
the HTML pages for development. For information on templating with Hugo, go
to: https://gohugo.io/templates/introduction/

There are also two handlebar templates in `/build/font` and are used to generate the scss/css files for the font. For
information on handlebars, go to: https://handlebarsjs.com/

## Deployment

The production code lives in the `static.startribune.com` S3 bucket. Multiple versions of the font exist and are hosted
simultaneously in versioned folders. To deploy a new version of the icon font, do the following:

1. Increment the version number with the `version:increment` script. Make sure to provide the current and new versions
   to the command.
    * Example: Moving from version 1.0 to 1.1, run: `npm run version:increment 1.0 1.1`
2. Create a new folder in S3 to match the version number that was set in the previous step.
    * Icon versions are found in the `/static.startribune.com/assets/libs/strib-icons` folder
3. Build fresh versions of the font and web files
    * Run: `npm run release:build`
4. Copy everything from your  `/_site` folder into the folder you created on S3.

## License

All images, content are copyright material of Star Tribune and require permission for re-use. Other code or similar
assets fall under the `LICENSE` license.
