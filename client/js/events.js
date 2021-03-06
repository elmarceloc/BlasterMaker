toReplace = -1;

navbarSize = 60;

overDropDown = false;

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

function updateScreenSize() {
  uiCanvas.width = window.innerWidth;
  uiCanvas.height = window.innerHeight - navbarSize;
  
  panels["colors"].height = window.innerHeight - navbarSize - 19;
  panels["colors"].y = 14;

  panels["tools"].x = window.innerWidth / 2 - 96 * 2;
  panels["tools"].y = window.innerHeight - 74 - navbarSize;
  
  closenew.style.top = navbarSize + 20 + "px";

  openinfo.style.top = navbarSize + 20 + "px";
  closeinfo.style.top = navbarSize + 20 + "px";

  
  setTimeout(function(){
    document.getElementById('search').style.width = panels.colors.width == 30 ? 65 : panels.colors.width + 6 //FIXME
  },40) 

  // panels["transform"].x = window.innerWidth / 2 + 400;
  // panels["transform"].y = window.innerHeight - 80 - navbarSize;

  // panels["palete"].y = window.innerHeight - 150 - navbarSize;

  //document.getElementById('search').style.width = panels["colors"].width + 6
  //console.log(window.innerHeight - 232 - navbarSize + 'px')

  document.getElementById("color-table").style.height =
    window.innerHeight - 292 - navbarSize + "px";
}


onresize = () => {
  updateScreenSize();
  updateMask()
  updateBackgroundAndRender()
  drawMask()
}

function getMousePos(e) {
  var rect = document.getElementById("uiCanvas").getBoundingClientRect();

  return [
    ((e.clientX - rect.left) / (rect.right - rect.left)) * uiCanvas.width,
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * uiCanvas.height,
  ];
}

function wheel(e) {
  if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
    setScale(scale * (1 - e.deltaY / Math.abs(e.deltaY) / 10))
  } 
  
  /*if(viewMode == 1){
    if(scale < maskScale){
      maskCanvas.style.opacity = '0%'
      maskCanvasHD.style.opacity = '0%'
    }else if(scale >= maskScale && scale < maskScaleHD){
      maskCanvasHD.style.opacity = '0%'
      maskCanvas.style.opacity = '100%'
    }else{
      maskCanvas.style.opacity = '0%'
      maskCanvasHD.style.opacity = '100%'
    }
  }*/
    
}

var oldMouse = false;

function mouseDown(e) {
  mouse = getMousePos(e);

  click = true;
  clickDown = true;

  if (isOverPanel() || overDropDown) return;

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
          
          if (isInside(...getPosScreenToGrid(mouse[0], mouse[1]))){
            isDrawing = true;
          }

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
              save();
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

  if ( (isDrawing || (tool != 1 &&  !isOverPanel() && !overDropDown && isInside(...getPosScreenToGrid(mouse[0], mouse[1])) )) &&  e.button == 0) { // ?? ????
    save()
  }

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

    updateMask()
    updateBackgroundAndRender()
  }
}









var navbars = document.getElementsByClassName("uk-navbar-dropdown");
for (var i = 0; i < navbars.length; i++) {
    navbars[i].addEventListener("mouseover", function(event){
      event.stopPropagation()
    
      overDropDown = true
        
    }, false);
    
    navbars[i].addEventListener("mouseout", function(event){
        event.stopPropagation()
    
        overDropDown = false
        
    }, false);
}

function keyDown(e) {
  if (e.repeat) { return }

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

  updateBackgroundAndRender()

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
  //console.log(require('@electron/remote'))
  const {  Menu , MenuItem } = require('@electron/remote')


  window.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();

      pensPerCol = Math.floor(
        (height - panels.palete.marginU - panels.palete.marginD) / uiScale
      );
      pensPerRow = Math.ceil(colorPalette.length / pensPerCol) - 1;

      const menu = new Menu();

      if (isBead(...getPosScreenToGrid(...mouse), width)) {
        if (isInside(...getPosScreenToGrid(...mouse))) {
          let mouseOnPanel = false;

          if (isOverPanel()) return;

          if (mouseOnPanel) return;

          let color = getBeadColor(...getPosScreenToGrid(...mouse));

          //  console.log(color);

          menu.append(
            new MenuItem({
              label: "Cambiar color",
              click: function () {
                toReplace = color;
                setTool(4);
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Borrar color",
              toolTip: 'Borra todas las apariciones de este color.',
              click: function () {
                replaceBead(color, 0);
                save();
              },
            })
          );

          menu.append(
            new MenuItem({
              type: 'separator'
            })
          );

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

            menu.append(
              new MenuItem({
                type: 'separator'
              })
            );

            menu.popup({ window: require('@electron/remote').getCurrentWindow() });
          }
        }/* else {
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
        }*/
      }

      menu.append(
        new MenuItem({
          label: "Reglas",
          type: 'checkbox',
          checked: showGrid,
          click: function () {
            showGrid = !showGrid;

            if(storage){
              storage.set('showGrid', showGrid, function(error) {
              });
            }else{
              localStorage.setItem('showGrid',showGrid)
            }
          
          }
        })
      );

      menu.append(
        new MenuItem({
          label: "Colores",
          type: 'checkbox',
          checked: showIds,
          click: function () {
            showIds = !showIds;

            if(storage){
              storage.set('showIds', showIds, function(error) {
              });
            }else{
              localStorage.setItem('showIds',showIds)
            }
          }
        })
      );

      menu.popup({ window: require('@electron/remote').getCurrentWindow() });

      //TODO: mostrar "selecionar color" al darle click derecho a un color en pantalla...
    },
    false
  );
}
