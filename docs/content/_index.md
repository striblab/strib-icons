---
aliases:
  - /font/
---

## Usage

Bootstrap Icons are SVGs, so you can include them into your HTML in a few ways depending on how your project is setup. We recommend using a `width: 1em` (and optionally `height: 1em`) for easy resizing via `font-size`.

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
### Embedded
Embed your icons within the HTML of your page (as opposed to an external image file). Here we've used a custom `width` and `height`.
{{< /md >}}
  </div>
  <div class="col-md-8">
    {{< example >}}<svg fill="currentcolor" id="strib-location-filled" viewBox="0 0 16 16" width="16" height="16" class="strib-icon strib-location-filled" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.5.5a5.9 5.9 0 0 0-5.893 5.893 5.83 5.83 0 0 0 1.187 3.536s.161.211.187.242L7.5 15.5l4.521-5.332c.023-.028.185-.239.185-.239v-.002a5.83 5.83 0 0 0 1.187-3.534A5.9 5.9 0 0 0 7.5.5m0 8.036c-.424 0-.838-.126-1.191-.361a2.15 2.15 0 0 1-.911-2.2 2.14 2.14 0 0 1 1.684-1.684 2.142 2.142 0 0 1 1.932 3.616 2.14 2.14 0 0 1-1.514.629" clip-rule="evenodd"/></svg>{{< /example >}}
  </div>
</div>

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
### Sprite
Use the SVG sprite to insert any icon through the `<use>` element. Use the icon's filename as the fragment identifier (e.g., `toggles` is `#toggles`). SVG sprites allow you to reference an external file similar to an `<img>` element, but with the power of `currentcolor` for easy theming.

**Heads up!** There's an issue with Chrome where [`<use>` doesn't work across domains](https://bugs.chromium.org/p/chromium/issues/detail?id=470601).
{{< /md >}}
  </div>
  <div class="col-md-8">

<div class="bd-example" style="font-size: 32px;">
  <i class="strib-icon strib-video"></i>
  <i class="strib-icon strib-flag"></i>
  <i class="strib-icon strib-home"></i>
</div>
{{< highlight html >}}
<svg class="strib-icon" width="32" height="32" fill="currentcolor">
  <use xlink:href="strib-icons.svg#video"/>
</svg>
<svg class="strib-icon" width="32" height="32" fill="currentcolor">
  <use xlink:href="strib-icons.svg#flag"/>
</svg>
<svg class="strib-icon" width="32" height="32" fill="currentcolor">
  <use xlink:href="strib-icons.svg#home"/>
</svg>
{{< /highlight >}}
  </div>
</div>

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
### External image
Copy the Bootstrap Icons SVGs to your directory of choice and reference them like normal images with the `<img>` element.
{{< /md >}}
  </div>
  <div class="col-md-8">
    {{< example >}}<img src="./assets/icons/company-logo.svg" alt="Bootstrap" width="32" height="32">{{< /example >}}
  </div>
</div>

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
### Icon font
Icon fonts with classes for every icon are also included for Bootstrap Icons. Include the icon web fonts in your page via CSS, then reference the class names as needed in your HTML (e.g., `<i class="strib-icon strib-alarm-clock"></i>`).

Use `font-size` and `color` to change the icon appearance.
{{< /md >}}
  </div>
  <div class="col-md-8">
    {{< example >}}<i class="strib-icon strib-comment-disabled"></i>{{< /example >}}
    {{< example >}}<i class="strib-icon strib-comment-disabled" style="font-size: 2rem; color: cornflowerblue;"></i>{{< /example >}}
  </div>
</div>

<div class="row">
  <div class="col-md-4">
{{< md >}}
### CSS
You can also use the SVG within your CSS (**be sure to escape any characters**, such as `#` to `%23` when specifying hex color values). When no dimensions are specified via `width` and `height` on the `<svg>`, the icon will fill the available space.

The `viewBox` attribute is required if you wish to resize icons with `background-size`. Note that the `xmlns` attribute is required.
{{< /md >}}
  </div>
  <div class="col-md-8">
{{< highlight css >}}
.bi::before, .strib-icon::before {
  display: inline-block;
  content: "";
  vertical-align: -.125em;
  background-image: url("data:image/svg+xml,<svg viewBox='0 0 16 16' fill='%23333' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' clip-rule='evenodd'/></svg>");
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
}

{{< /highlight >}}
  </div>
</div>

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
## Styling
Color can be changed by setting a `.text-*` class or custom CSS:
{{< /md >}}
  </div>
  <div class="col-md-8">
    <div class="bd-example">
      <svg width="16" height="16" class="strib-icon strib-error text-success" fill="currentcolor" xmlns="http://www.w3.org/2000/svg" clip-rule="evenodd" fill-rule="evenodd">
        <path d="M8 12a.74.74 0 0 0 .416-.127.74.74 0 0 0 .319-.77.746.746 0 0 0-1.358-.269.75.75 0 0 0 .093.946c.141.141.331.22.53.22m-.666-8h1.334v5H7.334z"/>
        <path d="M8 15a7.005 7.005 0 0 1-6.467-4.321A7 7 0 1 1 15 8a7 7 0 0 1-2.051 4.949A7 7 0 0 1 8 15M8 2a6 6 0 1 0-.001 12.002A6 6 0 0 0 8 2"/>
      </svg>
    </div>
{{< highlight html >}}
  ...
<svg class="strib-icon strib-error text-success" width="16" height="16" fill="currentcolor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
</svg>
{{< /highlight >}}
  </div>
</div>

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
## Accessibility
For purely decorative icons, add `aria-hidden="true"`. Otherwise, provide an appropriate text alternative. Depending on which method you're using to add the icons, and where you're using them (e.g. as standalone images, or as the only content of a button or similar control), there are various possible approaches. Here are a few examples:
{{< /md >}}
  </div>
  <div class="col-md-8">
    <div class="bd-example">
      <img src="./assets/icons/company-logo.svg" alt="Bootstrap" width="32" height="32">
    </div>
{{< highlight html >}}
<!-- alt="..." on <img> element -->
<img src="/assets/icons/bootstrap.svg" alt="Bootstrap" ...>
{{< /highlight >}}
    <div class="bd-example">
      <i class="bi-avatar strib-icon strib-avatar" role="img" style="font-size: 2em" aria-label="Tools"></i>
    </div>
{{< highlight html >}}
<svg class="strib-icon" ... role="img" aria-label="Tools">
  <use xlink:href="strib-icons.svg#avatar"/>
</svg>
{{< /highlight >}}
    <div class="bd-example">
      <button type="button" class="btn btn-primary" aria-label="Mute">
        <svg class="strib-icon strib-volume-mute-fill" width="32" height="32" viewBox="0 0 16 16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6.717 3.55A.5.5 0 017 4v8a.5.5 0 01-.812.39L3.825 10.5H1.5A.5.5 0 011 10V6a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06zm7.137 2.096a.5.5 0 010 .708L12.207 8l1.647 1.646a.5.5 0 01-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 01-.708-.708L10.793 8 9.146 6.354a.5.5 0 11.708-.708L11.5 7.293l1.646-1.647a.5.5 0 01.708 0z"></path></svg>
      </button>
    </div>
{{< highlight html >}}
<!-- aria-label="..." on the control -->
<button ... aria-label="Mute">
  <svg class="strib-icon strib-volume-mute-fill" aria-hidden="true" ...>
  ...
  </svg>
</button>
{{< /highlight >}}
  </div>
</div>

<div class="row my-4">
  <div class="col-md-4">
{{< md >}}
## Working with SVGs
SVGs are awesome to work with, but they do have some known quirks to work around. Given the numerous ways in which SVGs can be used, we haven't included these attributes and workarounds in our code.
{{< /md >}}
  </div>
  <div class="col-md-8">
{{< md >}}
Known issues include:

- **SVGs receive focus by default in Internet Explorer and Edge Legacy.** When embedding your SVGs, add `focusable="false"` to the `<svg>` element. [Learn more on Stack Overflow.](https://stackoverflow.com/questions/18646111/disable-onfocus-event-for-svg-element)

- **When using SVGs with `<img>` elements, screen readers may not announce them as images, or skip the image completely.** Include an additional `role="img"` on the `<img>` element to avoid any issues. [See this article for details.](https://web.archive.org/web/20201112013541/https://simplyaccessible.com/article/7-solutions-svgs/#acc-heading-2)

- **External SVG sprites may not function correctly in Internet Explorer.** Use the [svg4everybody](https://github.com/jonathantneal/svg4everybody) polyfill as needed.

Found another issue with SVGs we should note? Please open [an issue]({{< param repo >}}/issues) to share details.
{{< /md >}}
  </div>
</div>
