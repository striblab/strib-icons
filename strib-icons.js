/**
 * Star Tribune icons (strib-icons)
 * Version: 0.0.7
 * Copyright Star Tribune
 *
 * SVG sprites can't come across different domains, protocols or ports,
 * so this gets it and inlines it.
 */

(function() {
  var version = '0.0.7';
  var location = '//static.startribune.com/assets/libs/strib-icons/' + version + '/strib-icons.sprite.svg';

  // From: https://css-tricks.com/ajaxing-svg-sprite/
  var ajax = new XMLHttpRequest();
  ajax.open('GET', location, true);
  ajax.send();
  ajax.onload = function() {
    var div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  };
}());
