export { setUpControl, setFontSize, setColourScheme, setLineHeight };

const prefix = "colour-scheme-";
const colourSchemeClassNames = ['auto', 'light', 'dark'].map(c => prefix.concat(c));

function setColourScheme(colourScheme: string): void {
  const colourSchemeClassName = prefix.concat(colourScheme);
  document.body.classList.remove(...colourSchemeClassNames);
  document.body.classList.add(colourSchemeClassName);
}

function setFontSize(size: string): void {
  document.documentElement.style.setProperty("--base-font-size", size + "rem");
}

function setLineHeight(size: string): void {
  document.documentElement.style.setProperty("--base-line-height", size + "rem");
}

function setUpControl(elementId: string, applyValue: (val: string) => void, setValue: (control: HTMLInputElement, val: string) => void): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const control = document.getElementById(elementId) as HTMLInputElement | null;
  const stored = window.localStorage.getItem(elementId);
  if (stored) {
    applyValue(stored);
    if (control) setValue(control, stored);
  }
  const callback = function(event: Event) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const target = event.target! as HTMLInputElement;
    const val = target.type === "checkbox" ? (target.checked ? target.value : 'default') : target.value;
    applyValue(val);
    window.localStorage.setItem(elementId, val);
  };
  if (control) control.addEventListener("change", callback);
}
