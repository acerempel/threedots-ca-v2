export { setUpControl, setFontSize, setColourScheme, setLineHeight };

const prefix = "colour-scheme-";
const colourSchemeClassNames = ['auto', 'light', 'dark'].map(c => prefix.concat(c));

function setColourScheme(colourScheme: string) {
  var colourSchemeClassName = prefix.concat(colourScheme);
  document.body.classList.remove(...colourSchemeClassNames);
  document.body.classList.add(colourSchemeClassName);
}

function setFontSize(size: string) {
  document.documentElement.style.setProperty("--base-font-size", size + "rem");
}

function setLineHeight(size: string) {
  document.documentElement.style.setProperty("--base-line-height", size + "rem");
}

function setUpControl(elementId: string, applyValue: (val: string) => void, setValue: (control: HTMLInputElement, val: string) => void) {
  var control = document.getElementById(elementId)! as HTMLInputElement;
  var stored = window.localStorage.getItem(elementId);
  if (stored) {
    applyValue(stored);
    setValue(control, stored);
  }
  var callback = function(event: Event) {
    var target = event.target! as HTMLInputElement;
    var val = target.type === "checkbox" ? (target.checked ? target.value : 'default') : target.value;
    applyValue(val);
    window.localStorage.setItem(elementId, val);
  };
  control.addEventListener("change", callback);
}
