toReplace = -1;

navbarSize = 60;

if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
  navbarSize = 0;
} else {
  document.getElementById("navbar").style.display = "flex";
  //todo: change by class

  $(document).ready(function () {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });
  });
}

var ctrlDown = false;
var ctrlKey = 17,
  vKey = 86,
  cKey = 67,
  zKey = 90;

document.body.onkeydown = function (e) {
  if (e.keyCode == 17 || e.keyCode == 91) {
    ctrlDown = true;
  }
  if (
    (ctrlDown && e.keyCode == zKey) ||
    (ctrlDown && e.keyCode == vKey) ||
    (ctrlDown && e.keyCode == cKey)
  ) {
    e.preventDefault();
    return false;
  }
};
document.body.onkeyup = function (e) {
  if (e.keyCode == 17 || e.keyCode == 91) {
    ctrlDown = false;
  }
};

function launchFullScreen(element) {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}
// Lanza en pantalla completa en navegadores que lo soporten
function cancelFullScreen() {
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

var fillStack = [];
var matrix = [...Array(height)].map((k) => [...Array(width)].fill(0));

function fill(x, y) {
  fillStack.push([x, y]);

  while (fillStack.length > 0) {
    var [x, y] = fillStack.pop();

    if (!(isInside(x, y) && getBeadColor(x, y) == fillBaseColor)) {
      continue;
    }

    if (matrix[y][x] == 1) {
      continue;
    }

    matrix[y][x] = 1;

    setBeadColor(x, y, color);

    fillStack.push([x + 1, y]);
    fillStack.push([x - 1, y]);
    fillStack.push([x, y + 1]);
    fillStack.push([x, y - 1]);
  }
}

function line(x1, y1, x2, y2, color) {
  // Translate coordinates
  /* var x1 = startCoordinates.left;
      var y1 = startCoordinates.top;
      var x2 = endCoordinates.left;
      var y2 = endCoordinates.top;*/
  // Define differences and error check
  // Iterators, counters required by algorithm
  let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
  // Calculate line deltas
  dx = x2 - x1;
  dy = y2 - y1;
  // Create a positive copy of deltas (makes iterating easier)
  dx1 = Math.abs(dx);
  dy1 = Math.abs(dy);
  // Calculate error intervals for both axis
  px = 2 * dy1 - dx1;
  py = 2 * dx1 - dy1;
  // The line is X-axis dominant
  if (dy1 <= dx1) {
    // Line is drawn left to right
    if (dx >= 0) {
      x = x1;
      y = y1;
      xe = x2;
    } else {
      // Line is drawn right to left (swap ends)
      x = x2;
      y = y2;
      xe = x1;
    }
    setBeadColor(x, y, color); // Draw first pixel
    // Rasterize the line
    for (i = 0; x < xe; i++) {
      x = x + 1;
      // Deal with octants...
      if (px < 0) {
        px = px + 2 * dy1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y = y + 1;
        } else {
          y = y - 1;
        }
        px = px + 2 * (dy1 - dx1);
      }
      // Draw pixel from line span at
      // currently rasterized position
      setBeadColor(x, y, color);
    }
  } else {
    // The line is Y-axis dominant
    // Line is drawn bottom to top
    if (dy >= 0) {
      x = x1;
      y = y1;
      ye = y2;
    } else {
      // Line is drawn top to bottom
      x = x2;
      y = y2;
      ye = y1;
    }
    setBeadColor(x, y, color);
    // Rasterize the line
    for (i = 0; y < ye; i++) {
      y = y + 1;
      // Deal with octants...
      if (py <= 0) {
        py = py + 2 * dx1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          x = x + 1;
        } else {
          x = x - 1;
        }
        py = py + 2 * (dx1 - dy1);
      }
      // Draw pixel from line span at
      // currently rasterized position
      setBeadColor(x, y, color);
    }
  }
}

function updateScreenSize() {
  cw = uiCanvas.width * 1;
  ch = uiCanvas.height * 1;

  uiCanvas.width = window.innerWidth;
  uiCanvas.height = window.innerHeight - navbarSize;

  panels["colors"].height = window.innerHeight - navbarSize - 19;
  panels["colors"].y = 14;

  //Marcos[1].y = window.innerHeight

  panels["tools"].x = window.innerWidth / 2 - 96 * 2;
  panels["tools"].y = window.innerHeight - 74 - navbarSize;

  // panels["transform"].x = window.innerWidth / 2 + 400;
  // panels["transform"].y = window.innerHeight - 80 - navbarSize;

  // panels["palete"].y = window.innerHeight - 150 - navbarSize;

  //document.getElementById('search').style.width = panels["colors"].width + 6
  //console.log(window.innerHeight - 232 - navbarSize + 'px')
  document.getElementById("color-table").style.height =
    window.innerHeight - 232 - navbarSize + "px";
}

setInterval(() => {
  updateScreenSize();
}, 100);

function getMousePos(e) {
  var rect = document.getElementById("uiCanvas").getBoundingClientRect();
  return [
    ((e.clientX - rect.left) / (rect.right - rect.left)) * uiCanvas.width,
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * uiCanvas.height,
  ];
}

function wheel(e) {
  scale *= 1 - e.deltaY / Math.abs(e.deltaY) / 10;
}

var oldMouse = false;

function mouseDown(e) {
  mouse = getMousePos(e);

  click = true;
  clickDown = true;

  if (isOverPanel()) return;

  /* if (isInside(...getPosScreenToGrid(e.pageX, e.pageY))) {
    save();
  }*/
  console.log('click')
  switch (e.button ) {
    case 0:
      switch (tool) {
        // move camera
        case 0:
          panZoomFrom = [
            mouse[0] - xOffset * scale,
            mouse[1] - yOffset * scale,
          ];
          panZoomTo = [mouse[0] - xOffset * scale, mouse[1] - yOffset * scale];
          isDragging = true;
          break;
        // pencil
        case 1:
          isDrawing = true;
          if (
            getBeadColor(...getPosScreenToGrid(...mouse)) != color &&
            !isInInfo(...mouse)
          ) {
            setBeadColor(...getPosScreenToGrid(...mouse), color);
            oldMouse = mouse;
            //new Audio('./bead.mp3').play()
          }
          break;
        // fill
        case 2:
          if (isInside(...getPosScreenToGrid(mouse[0], mouse[1]))) {
            fillBaseColor = getBeadColor(
              ...getPosScreenToGrid(mouse[0], mouse[1])
            );
            fill(...getPosScreenToGrid(...mouse));
            matrix = [...Array(height)].map((k) => [...Array(width)].fill(0));
          }
          break;
        // eracer
        case 3:
          isDrawing = true;
          setBeadColor(...getPosScreenToGrid(...mouse), 0);
          break;

        // color picker
        case 4:
          let newcolor = getBeadColor(...getPosScreenToGrid(...mouse));

          if (newcolor != 0) {
            color = getBeadColor(...getPosScreenToGrid(...mouse));

            if (toReplace != -1) {
              replaceBead(toReplace, color);
              toReplace = -1;
            }
          }
          // FIXME:
          setTool(lastTool);

          break;
      }

      // return if color picker if used
      if (tool != 4) {
        lastTool = tool;
      }
      break;

    case 1:
      panZoomFrom = [mouse[0] - xOffset * scale, mouse[1] - yOffset * scale];
      panZoomTo = [mouse[0] - xOffset * scale, mouse[1] - yOffset * scale];
      isDragging = true;
      break;
  }
}

function mouseUp(e) {
  click = false;
  clickUp = true;
  isDragging = false;
  switch (tool) {
    case 1:
      isDrawing = false;
      oldMouse = false;
      break;

    case 3:
      isDrawing = false;
      oldMouse = false;
      break;
  }

  if (!isOverPanel() /*&& isInside(...getPosScreenToGrid(e.pageX, e.pageY))*/) { // ?? 👀
    save();
  }

  // ???
}

function mouseMove(e) {
  mouse = getMousePos(e);

  if (isOverPanel() || isInInfo(...mouse)) return;


  switch (tool) {
    case 1:
      if (isDrawing) {
        setBeadColor(...getPosScreenToGrid(...mouse), color);
        if (oldMouse) {
          var [x1, y1, x2, y2] = [
            ...getPosScreenToGrid(...oldMouse),
            ...getPosScreenToGrid(...mouse),
          ];
          line(x1, y1, x2, y2, color);
        }

        oldMouse = mouse;
      }
      break;

    case 3:
      if (isDrawing) {
        setBeadColor(...getPosScreenToGrid(...mouse), 0);

        if (oldMouse) {
          var [x1, y1, x2, y2] = [
            ...getPosScreenToGrid(...oldMouse),
            ...getPosScreenToGrid(...mouse),
          ];
          line(x1, y1, x2, y2, 0);
        }

        oldMouse = mouse;
      }
      break;
  }
  if (isDragging) {
    panZoomTo = mouse;
    xOffset = (panZoomTo[0] - panZoomFrom[0]) / scale;
    yOffset = (panZoomTo[1] - panZoomFrom[1]) / scale;
  }
}

/*
function keyPress(e) {
  if (e.key == "w") {
    scale *= 1.1;
  }

  if (e.key == "s") {
    scale /= 1.1;
    save();
  }*/

/* if (e.key == "n" && isDevMode) {
    panels.unshift(
      new Panel(
        "_",
        ...mouse,
        50,
        50,
        8,
        20,
        20,
        true,
        true,
        () => {},
        () => {}
      )
    );
  }
};
*/

function keyDown(e) {
  if (e.ctrlKey && e.key === "z") {
    undo();
  }

  if (e.ctrlKey && e.key === "s") {
    save();
  }

  switch (e.key) {
    case "ArrowLeft":
      xOffset += 2;
      break;
    case "ArrowRight":
      xOffset -= 2;
      break;
    case "ArrowUp":
      yOffset += 2;
      break;
    case "ArrowDown":
      yOffset -= 2;
      break;
    case "q":
      rotateLeft();
      break;
    case "w":
      rotateRight();
      break;
  }

  // binds the numbers keys for color palette

  if (isNumeric(e.key)) {
    let index = parseInt(e.key) - 1;

    if (colorPalette[index] != undefined) {
      color = colors.indexOf(colorPalette[index]) + 1;
    }
  }

  // binds the tools

  let tools = ["m", "b", "f", "e", "i"];

  tools.forEach((t, i) => {
    if (t == e.key) setTool(i);
  });
}

if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
  const { remote, contextBridge } = require("electron");
  const { Menu, MenuItem } = remote;

  window.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();

      // TODO: apendiar mas opciones
      //menu.append(new MenuItem(new MenuItem({label: "This menu item is always shown"})));

      pensPerCol = Math.floor(
        (height - panels.palete.marginU - panels.palete.marginD) / uiScale
      );
      pensPerRow = Math.ceil(colorPalette.length / pensPerCol) - 1;

      if (isBead(...getPosScreenToGrid(...mouse), width)) {
        if (isInside(...getPosScreenToGrid(...mouse))) {
          let mouseOnPanel = false;

          if (isOverPanel()) return;

          if (mouseOnPanel) return;

          const menu = new Menu(); // FIXME: mover afuera si se agrega menu global

          let color = getBeadColor(...getPosScreenToGrid(...mouse));

          //  console.log(color);

          menu.append(
            new MenuItem({
              label: "Cambiar color",
              click: function () {
                //todo:
                toReplace = color;
                setTool(4);
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Borrar color",
              click: function () {
                replaceBead(color, 0);
                save();
              },
            })
          );

          menu.popup({ window: remote.getCurrentWindow() });
        }
      }
      // FIXME: no cubre toda la box

      if (
        isInRect(
          ...mouse,
          panels.palete.x,
          panels.palete.y,
          panels.palete.width,
          panels.palete.height
        )
      ) {
        if (isHorizontal) {
          let index =
            Math.floor(
              (mouse[0] - panels.palete.x - panels.palete.marginL) / uiScale
            ) +
            Math.floor(
              (mouse[1] - panels.palete.y - panels.palete.marginU) / uiScale
            ) *
              pensPerCol;
          if (index < colorPalette.length) {
            //    console.log(index);
            const menu = new Menu();

            menu.append(
              new MenuItem({
                label: "Cambiar color",
                click: function () {
                  //todo:
                  toReplace = colors.indexOf(colorPalette[index]);
                  setTool(4);
                },
              })
            );

            menu.append(
              new MenuItem({
                label: "Borrar color",
                click: function () {
                  replaceBead(colors.indexOf(colorPalette[index]) + 1, 0);
                },
              })
            );

            menu.popup({ window: remote.getCurrentWindow() });
          }
        } else {
          if (
            Math.floor(
              (mouse[1] - panels.palete.y - panels.palete.marginU) / uiScale
            ) +
              Math.floor(
                (mouse[0] - panels.palete.x - panels.palete.marginL) / uiScale
              ) *
                pensPerCol <
            colorPalette.length
          ) {
          }
        }
      }
      // mostrar "selecionar color" al darle click derecho a un color en pantalla...
    },
    false
  );
}
