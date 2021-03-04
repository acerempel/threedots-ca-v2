(function () {
  'use strict';

  var prefix = "colour-scheme-";
  var colourSchemeClassNames = ['auto', 'light', 'dark'].map(c => prefix.concat(c));

  function setColourScheme(colourScheme) {
    var element = document.querySelector("body");
    var colourSchemeClassName = prefix.concat(colourScheme);
    element.classList.remove(...colourSchemeClassNames);
    element.classList.add(colourSchemeClassName);
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

  let setValue = (control, val) => { control.value = val; };
    let loadFancyFonts = (val) => {
      if (val === 'fancy') {
        if (!window.fancyFontsLoaded) window.loadFancyFonts();
        document.body.classList.remove('fonts-default');
      } else {
        document.body.classList.add('fonts-default');
      }
    };
    setUpControl("colour-scheme", setColourScheme, setValue);
    setUpControl("line-height", setLineHeight, setValue);
    setUpControl("fonts", loadFancyFonts, (control, value) => { value === 'fancy' && (control.checked = true); });
    document.addEventListener("click", function(event) {
      let closestDropdown = event.target.closest(".dropdown");
      let dropdown;
      if (closestDropdown) return;
      if (dropdown = document.querySelector('.dropdown[open]')) {
        dropdown.open = false;
      }
      if (event.target.closest('.dropdown-nav-control')) return;
      if (dropdown = document.querySelector('.dropdown-nav.open')) {
        dropdown.classList.remove('open');
      }
    });

}());
