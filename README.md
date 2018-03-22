# Star Tribune Icons

Icons used in projects as different formats.

## Usage

(todo)

## Adding and managing icons.

### Icons

* Icons should be in SVG format. The canvas/artboard should be square and the icon should take up as much space as possible with a slight pit of padding (i.e. not flush to the canvas).
* Put icons in `source/icons/`
  * The file name of the icon will become the class name of the icon in CSS, so be consistent and reasonable, use only lowercase and dashes, i.e. `category-name-modifier.svg`

### Developing and building

* Make sure NodeJS is installed and run: `npm install`
* To compile the fonts one time, run: `npm run build`
* To watch for changes and run a local server to see the example page: `run npm develop`

### Templates

Templates are managed in `source/templates/` and are used to output the CSS and HTML.

## Publishing

(todo)

## License

All images, content are copyright material of Star Tribune and require permission for re-use. Other code or similar assets fall under the `LICENSE.code` license.
