function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const SPACE_BETWEEN_IF_TOOLTIP_ON_TOP = 96;
const SPACE_BETWEEN_IF_TOOLTIP_AT_BOTTOM = 50;
const SPACE_BETWEEN_TOOLTIP_TO_RIGHT = 30;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { image } = request;
  const img = new Image();

  const canvas = document.createElement("canvas");
  let context = canvas.getContext("2d", { willReadFrequently: true });

  img.src = image;
  const { innerWidth: screenWidth, innerHeight: screenHeight } = window;

  img.onload = function () {
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    context.drawImage(img, 0, 0, screenWidth, screenHeight);
  };

  canvas.classList.add("mainCanvas");
  canvas.style.setProperty("z-index", Number.MAX_SAFE_INTEGER - 1);
  document.body.appendChild(canvas);

  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip-color-detect");

  const colorPreview = document.createElement("div");
  colorPreview.classList.add("colorPreview-color-detect");
  tooltip.appendChild(colorPreview);

  const colorHexCode = document.createElement("span");
  colorHexCode.classList.add("colorHexCode-color-detect");
  tooltip.appendChild(colorHexCode);

  tooltip.style.setProperty("z-index", Number.MAX_SAFE_INTEGER);
  document.body.appendChild(tooltip);

  canvas.addEventListener("mousemove", function (e) {
    let pos = {
      x: canvas.offsetLeft,
      y: canvas.offsetTop,
    };
    let x = e.pageX - pos.x;
    let y = e.pageY - pos.y;

    let p = context.getImageData(x, y, 1, 1).data;
    actualColor = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

    colorPreview.style.backgroundColor = actualColor;
    colorHexCode.textContent = actualColor;
    let xPointer = e.clientX,
      yPointer = e.clientY;

    let tooltipTop = yPointer - SPACE_BETWEEN_IF_TOOLTIP_ON_TOP;

    const isContainFlippedClass = tooltip.classList.contains(
      "tooltip-color-detect-flip"
    );

    if (tooltipTop < 0) {
      tooltipTop = yPointer + SPACE_BETWEEN_IF_TOOLTIP_AT_BOTTOM;

      if (!isContainFlippedClass) {
        tooltip.classList.add("tooltip-color-detect-flip");
      }
    } else {
      if (isContainFlippedClass) {
        tooltip.classList.remove("tooltip-color-detect-flip");
      }
    }

    tooltip.style.transform = `translateY(${tooltipTop}px) translateX(${
      xPointer - SPACE_BETWEEN_TOOLTIP_TO_RIGHT
    }px)`;
  });

  //   prevPositionValue = document.body.style.getPropertyValue("position");

  //To prevent scrolling
  document.body.style.setProperty("position", "fixed");
});
