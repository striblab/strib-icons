# Star Tribune Icons

Icons used in projects as different formats.

## Usage

See the [striblab.github.io/strib-icons](https://striblab.github.io/strib-icons/).

## Adding and managing icons.

### Icons

* Icons should be in SVG format. The canvas/artboard should be tight around the icon with a slight bit of padding (i.e. not flush to the canvas).
* Do not set a fill color unless the color is very important, such as with the Star Tribune star logo.
  * Manage fills with a CSS variable that has the `strib-` prefix; for example:
    ```
    fill="var(--strib-strib-star-top, #61BF1A)"
    ```
  * You may need to set a "white" color to create a "hole", though this should be avoided if possible. Use the following:
    ```
    fill="var(--strib-icon-background, #FFFFFF)"
    ```
  * You may need to manually edit the SVG to do these things.
* Put icons in `source/icons/`
  * The file name of the icon will become the class name of the icon in CSS, so be consistent and reasonable, use only lowercase and dashes, i.e. `category-name-modifier.svg`
  * You must have a filename that will place the new character at the end of the character set. Preface your filename with "z1-" or somthing similar ensuring the character is inserted as the last character in the font. The reason for this is inserting a new SVG into the font will change the character positions for existing icons, disrupting icon references already being used.
* Add an entry in `sources/icons.yml`. This is used for the SVG version of the icons for accessibility.

### Developing and building and deploying to static.startribune.com

* Make sure NodeJS is installed and run: `npm install`
* To compile the fonts one time, run: `npm run build`
* To watch for changes and run a local server to see the example page: `npm run develop`
* After determining that your new icon looks as expected, copy the files from the strib-icons/build directory to static.startribune.com/assets/libs/strib-icons/0.0.13/. We no longer increment the version numbers. This is the folder where these should always live going forward. This deployment method is an alternate method for folks who have trouble deploying using the steps outlined in the "Publishing" section. 

### Templates

Templates are managed in `source/templates/` and are used to output the CSS and HTML.

## Publishing

### NPM

To publish up to [npm](https://npm.org):

1.  Make sure you have an account and are in the Star Tribune organization.
1.  Update version in `package.json`
1.  Run `npm install` (this updates the package lock file)
1.  Commit
1.  Push changes up
1.  Run `npm run npm-publish`

### CDN

To publish up to our CDN, use [static-libs](https://github.com/striblab/static-libs).

### Example

Example page is hosted with Github. Run `npm run gh-publish` to easily push up.

## License

All images, content are copyright material of Star Tribune and require permission for re-use. Other code or similar assets fall under the `LICENSE.code` license.
