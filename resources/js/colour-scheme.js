'use strict';

var prefix = "colour-scheme-";
var colourSchemeClassNames = ['auto', 'light', 'dark'].map(c => prefix.concat(c));

function setColourScheme(colourScheme) {
  var colourSchemeClassName = prefix.concat(colourScheme);
  document.body.classList.remove(...colourSchemeClassNames);
  document.body.classList.add(colourSchemeClassName);
}

function setFontSize(size) {
  document.documentElement.style.setProperty("--base-font-size", size + "rem");
}

function setLineHeight(size) {
  document.documentElement.style.setProperty("--base-line-height", size + "rem");
}

function setUpControl(elementId, applyValue, setValue) {
  var control = document.getElementById(elementId);
  var stored = window.localStorage.getItem(elementId);
  if (stored) {
    applyValue(stored);
    setValue(control, stored);
  }
  var callback = function(event) {
    var target = event.target;
    var val = target.type === "checkbox" ? (target.checked ? target.value : 'default') : target.value;
    applyValue(val);
    window.localStorage.setItem(elementId, val);
  };
  control.addEventListener("change", callback);
}

export { setUpControl, setFontSize, setColourScheme, setLineHeight };
