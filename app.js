//variable
const colorDivs = document.querySelectorAll(".color");
const generateButton = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;
const lockBtn = document.querySelectorAll(".lock");
const adjustBtn = document.querySelectorAll(".adjust");
let indexWrite = 0;
const popup = document.querySelector(".copy-container");
const popupSave = document.querySelector(".save-container");
const popupLibrary = document.querySelector(".library-container");
const sliderContainers = document.querySelectorAll(".sliders");
let t;
const btnCloseAdjust = document.querySelectorAll(".close-adjust");
const btnSave = document.querySelector(".save");
const btnCloseSave = document.querySelector(".close-save");
const btnCloseLibrary = document.querySelector(".close-library");
const btnLibrary = document.querySelector(".library");
const btnSavePalette = document.querySelector(".save-submit");
const inputSavePallete = document.querySelector(".save-name");
let savePalletes = [];
//functions
//color generate
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}
function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-saturation") ||
    e.target.getAttribute("data-hue");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');

  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const text = colorDivs[index].querySelector("h2");
  const bgColor = initialColors[index];
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;
  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUi(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
  checkTextContrast(color, textHex);
}
function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    savePalletes = [...paletteObjects];
    paletteObjects.forEach((paletteObj, index) => {
      createColorPallete(
        paletteObj.name,
        paletteObj.colors,
        index,
        paletteObjects
      );
    });
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-saturation")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}
function lockPan(index) {
  colorDivs[index].classList.toggle("locked");
  if (colorDivs[index].classList.value === "color locked") {
    lockBtn[index].innerHTML = '<i class="fa-solid fa-lock"></i>';
  } else {
    lockBtn[index].innerHTML = '<i class="fa-solid fa-lock-open"></i>';
  }
}

function createColorPallete(input, colors, index, savPal) {
  const newPallete = document.createElement("div");
  newPallete.classList.add("new-pallete");
  newPallete.classList.add(`${index}`);
  const namePallete = document.createElement("h2");
  namePallete.innerText = input;
  const colorPalleteBox = document.createElement("div");
  colorPalleteBox.classList.add("color-pallete-container");
  newPallete.appendChild(namePallete);
  colors.forEach((color, index) => {
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-pallete" + `${index}`);
    colorBox.style.backgroundColor = color;
    colorPalleteBox.appendChild(colorBox);
  });
  newPallete.appendChild(colorPalleteBox);
  popupLibrary.children[0].appendChild(newPallete);
  newPallete.addEventListener("click", (e) => {
    CloseLibraryPopup();
    const paletteIndex = e.target.classList[1];
    initialColors = [];
    savPal[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      checkTextContrast(color, text);
      checkTextContrast(color, colorDivs[index].children[1].children[0]);
      checkTextContrast(color, colorDivs[index].children[1].children[1]);
      updateTextUi(index);
    });
    resetInputs();
  });
}

function openSavePopup() {
  const popupBox = popupSave.children[0];
  popupSave.classList.add("active");
  popupBox.classList.add("active");
}
function openLibraryPopup() {
  const popupBox = popupLibrary.children[0];
  popupLibrary.classList.add("active");
  popupBox.classList.add("active");
}
function CloseLibraryPopup() {
  const popupBox = popupLibrary.children[0];
  popupLibrary.classList.remove("active");
  popupBox.classList.remove("active");
}

function CloseSavePopup() {
  const popupBox = popupSave.children[0];
  popupSave.classList.remove("active");
  popupBox.classList.remove("active");
}

function copyToClip(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  //pop up
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustPan(index) {
  sliderContainers[index].classList.toggle("active");
}
function closeAdjustPan(index) {
  sliderContainers[index].classList.remove("active");
}

//random Colors
function randomColors() {
  initialColors = [];

  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    //check contrast
    checkTextContrast(randomColor, hexText);

    checkTextContrast(randomColor, div.children[1].children[0]);
    checkTextContrast(randomColor, div.children[1].children[1]);

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  resetInputs();
}

//check contrast
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "#403e42";
  } else {
    text.style.color = "rgb(228, 225, 225)";
  }
}

function writeText() {
  let text = "Copied to ClickBoard ";
  let innerText = document.querySelector(".copy-popup h3");
  innerText.innerText = text.slice(0, indexWrite);
  indexWrite++;
  if (indexWrite >= text.length) {
    indexWrite = 0;
  }
}

function savePallete() {
  popupSave.classList.remove("active");
  popupSave.children[0].classList.remove("active");
  const name = inputSavePallete.value;
  inputSavePallete.value = "";
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });
  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else paletteNr = savePalletes.length;
  const paletteObj = {
    name,
    colors,
    nr: paletteNr,
  };
  savePalletes.push(paletteObj);
  //save to local Storage
  savetoLocal(paletteObj);
  createColorPallete(
    paletteObj.name,
    paletteObj.colors,
    paletteNr,
    savePalletes
  );
}

function savetoLocal(palleteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else localPalettes = JSON.parse(localStorage.getItem("palettes"));
  localPalettes.push(palleteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function colorizeSliders(color, hue, brightness, saturation) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)},${scaleBright(1)}`;

  //input update colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )},${scaleSat(1)}`;

  hue.style.backgroundImage = `linear-gradient(to right , rgb(204,75,75), rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}
getLocal();
randomColors();
//event listeners
btnSavePalette.addEventListener("click", savePallete);

btnLibrary.addEventListener("click", () => {
  openLibraryPopup();
});
btnCloseLibrary.addEventListener("click", () => {
  CloseLibraryPopup();
});
btnSave.addEventListener("click", () => {
  openSavePopup();
});

btnCloseSave.addEventListener("click", () => {
  CloseSavePopup();
});

btnCloseAdjust.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    closeAdjustPan(index);
  });
});

adjustBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    openAdjustPan(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    clearInterval(writeText);
    copyToClip(hex);
    t = setInterval(writeText, 100);
  });
});

lockBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    lockPan(index);
  });
});

popup.addEventListener("click", () => {
  popupBox = popup.children[0];
  popupBox.classList.remove("active");
  popup.classList.remove("active");
  clearInterval(t);
});
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
generateButton.addEventListener("click", () => {
  randomColors();
});
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUi(index);
  });
});
