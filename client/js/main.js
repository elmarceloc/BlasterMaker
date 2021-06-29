try {
  storage = require('electron-json-storage')
} catch (ex) {
  storage = null;
}

var id = null;

var path = ''

var palette = "all";
var colorPalette = [];

var isDebug = false;

var width = 29;
var height = 29;

var viewMode = 1

var showGrid = storage ? storage.getSync('showGrid') : localStorage.getItem('showGrid')
var showIds = storage ? storage.getSync('showIds') : localStorage.getItem('showIds')

var scale = 12;
var xOffset = 0;
var yOffset = 0;

var maskScale = 10;
var maskScaleHD = 40;

var tool = 1;
var lastTool = tool;

var color = 1;
var fillBaseColor = 0;

var mouse = [0, 0];

var click = false;
var clickDown = false;
var clickUp = false;

var isDragging = false;
var isDrawing = false;

var panZoomFrom = [0, 0];
var panZoomTo = [0, 0];

var uiScale = 22;
var isHorizontal = true; //sentido de los beads en la paleta

var grid2 = new ImageData(width, height);
grid2.data.fill(0);

var background = new ImageData(width, height);

var temp = [];

var panels = [];

var gridSize = 29;

var uiCanvas = document.getElementById("uiCanvas");
var renderCanvas = document.getElementById("renderCanvas");
var backgroundCanvas = document.getElementById("backgroundCanvas");
var maskCanvas = document.getElementById("maskCanvas");
var maskCanvasHD = document.getElementById("maskCanvasHD");


var uiCtx = uiCanvas.getContext("2d");
var renderCtx = renderCanvas.getContext("2d");
var backgroundCtx = backgroundCanvas.getContext("2d");
var maskCtx = maskCanvas.getContext("2d");
var maskCtxHD = maskCanvasHD.getContext("2d");

uiCanvas.width = window.innerWidth;
uiCanvas.height = window.innerHeight;


// ========= Show debug info =========

if(storage){
  storage.getAll(function(error, data) {
    if (error) throw error;

    console.log(data);
  });
}
// ====================================


/**
 * load the previews temp
 *
 */

 function undo() {
  if (temp.length <= 1) return;

  //if (temp.length == 0) {
  //  temp = [generate()];
 // }

  temp.splice(-1,1)

  load(JSON.stringify(temp[temp.length-1]));

  console.log('undo'+'|'+temp.length)

  if(storage){
    storage.set('code', generate(), function(error) {
    });
  }else{
    localStorage.setItem('code',JSON.stringify(generate()))
  }

  // localStorage.setItem("saves", temp);
}

/**
 * Loads data in JSON format
 *
 * @param {string} file - file data as Stringified JSON

*/

function load(file, isCompressed = true) {
  if (!file) return;

  try {
    var data = JSON.parse(file);
  } catch(e) {
    UIkit.notification({
        message: 'No se ha podido importar el proyecto',
        pos: 'top-center'
    });
    return
  }

  let width = data.width;
  let height = data.height;
  let name = data.name;
  let kit = data.palette;
  let size = data.size;
  let code = data.code;

  let newGrid = decompress(code).split(" ")
  
  //projectName = name

  app.name = name;

  setColorPalete(size, kit)

  
  newDraw(width, height);
  
  for (let i = 0; i < newGrid.length; i += 4) {
    grid2.data[i] = newGrid[i];
    grid2.data[i + 1] = newGrid[i + 1];
    grid2.data[i + 2] = newGrid[i + 2];
    grid2.data[i + 3] = newGrid[i + 3];

    // agregar colores mientras se importa la imagen

    if (grid2.data[i + 3]) {
      let newColor = getColorId(grid2.data.slice(i, i + 3), colorPalette);
      if (newColor == 0) {
        colorPalette.push(
          colors[getColorId(grid2.data.slice(i, i + 3), colors) - 1]
        );
      }
    }

  }
}

/**
 * Generates the data for save in file,temp,etc
 *
 * @return {string} encoded data as object

*/

function generate() {
  let code = grid2.data.join(" ")

  code = compress(code)

  return {
    width: width,
    height: height,
    code: code,
    name: app.name,
    palette: palette,
    size: gridSize == 29 ? '5' : '2.6'
  }

  //return width + "," + height + "," + savedData + "," +  projectName  + "," +   palette + "," + gridSize;
}

function save() {
  // FIXME:
  if (temp.length > 30) {
    temp.shift(1);
  }
  temp.push(generate());

  if(storage){
    storage.set('code', generate(), function(error) {
    });
  }else{
    localStorage.setItem('code',JSON.stringify(generate()))
  }

  console.log('saved')
}

function newDraw(w, h) {
  colorPalette = [];
  // creates the new grid
  grid2.data.fill(0);

  resize(w, h);
}

function resize(w, h) {
  width = Math.ceil(w/ gridSize) * gridSize;
  height = Math.ceil(h/ gridSize) * gridSize;
  grid2 = new ImageData(width, height);
  matrix = [...Array(height)].map((k) => [...Array(width)].fill(0));

  background = new ImageData(width, height);

  background.data.forEach((element, index, array) => {
    if (index % 4 == 0) {
      i = Math.floor(index / 4) % width; // Colores alternados
      j = Math.floor(index / (4 * width));
      if ((i + j) % 2 == 0) {
        array[index] = 255;
        array[index + 1] = 255;
        array[index + 2] = 255;
        array[index + 3] = 255;
      } else {
        array[index] = 200;
        array[index + 1] = 200;
        array[index + 2] = 200;
        array[index + 3] = 255;
      }
    }
  });  
}


/**
 * Draws a bead in spesific position
 *
 * @param {number} X - the x position of the bead
 * @param {number} Y - the y position of the bead

*/

function drawBead(X, Y, radius, color, selected) {
  uiCtx.beginPath();
  uiCtx.lineWidth = selected ? 8 : 5;
  uiCtx.arc(
    X,
    Y,
    (radius - uiCtx.lineWidth * 2) * 0.5 * (selected ? 2.3 : 1),
    0,
    2 * Math.PI,
    0
  );
  uiCtx.strokeStyle =
    "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
  uiCtx.stroke();
}

/**
 * Label every color by its id
 *
*/

function drawIds() {
  if (showIds) {
    uiCtx.fillStyle = "rgba(255,255,255,1)";

    uiCtx.font = scale / 3 + "px Arial";
    uiCtx.textBaseline = "middle";
    uiCtx.textAlign = "center";
    startPos = getPosScreenToGrid(0, 0);
    finalPos = getPosScreenToGrid(uiCanvas.width, uiCanvas.height);

    xDiff = finalPos[0] - startPos[0];
    yDiff = finalPos[1] - startPos[1];

    for (let y = 0; y < yDiff; y++) {
      for (
        let x = getBeadPos(...startPos) + width * 4 * y;
        x < getBeadPos(...startPos) + xDiff * 4 + width * 4 * y;
        x += 4
      ) {
        //    for (x = 0; x < 4 * width * height; x += 4) {
        var r = grid2.data[x + 0];
        var g = grid2.data[x + 1];
        var b = grid2.data[x + 2];
        var a = grid2.data[x + 3];

        var c = 255 - Math.round((r + g + b) / 3/255) * 255;

        uiCtx.fillStyle = "rgba(" + c + "," + c + "," + c + ",1)";

        if (a) {
          uiCtx.fillText(
            colors[getColorId([r, g, b], colors) - 1].id,
            ...s(
              getPosGridToScreen(
                (x % (4 * width)) / 4,
                Math.floor(x / (4 * width))
              ),
              [scale / 2, scale / 2]
            )
          );
        }
      }
    }
    uiCtx.font = "12px Arial";
    uiCtx.textAlign = "initial";
  }
}

function drawGrid() {
  if (showGrid) {
    if (Math.log(scale) * 0.3 > 0) {
      uiCtx.font = scale / 2 + "px Arial";
      uiCtx.textBaseline = "middle";
      uiCtx.textAlign = "center";

      var fixedScale = Math.min(scale, 25);


      uiCtx.fillStyle = "#aaaaaa";

      for (let i = 0; i <= height; i++) {

        if (i % gridSize == 0 && !(i == height || i == 0)) {
          // ????
          uiCtx.beginPath();
          uiCtx.lineWidth = scale / 8;
          uiCtx.moveTo(...getPosTableToScreen(0, i));
          uiCtx.lineTo(...getPosTableToScreen(width, i));
          uiCtx.stroke();
        } else if (viewMode == 3) {
          // uiCtx.lineWidth = Math.log(scale) * 0.3;
        }

        if (i > 0 && scale > 8) {
          let value = i % gridSize == 0 ? gridSize : i % gridSize;

          for (let j = 0; j < 2; j++) {
            let [ruleX, ruleY] = getPosTableToScreen(width * j, i - 0.5);

            switch (j) {
              case 0:
                ruleX = Math.max(panels["colors"].width, ruleX - fixedScale);
                break;

              case 1:
                ruleX = Math.min(uiCanvas.width - fixedScale, ruleX);
                break;
            }

            uiCtx.beginPath();

            if (!(i % gridSize) && height / gridSize > 1){
              uiCtx.fillStyle = "rgba(60,60,60,0.9)";
            }else{
              uiCtx.fillStyle = "rgba(40,40,40,0.9)";
            }

            uiCtx.rect(
              ruleX - 1,
              ruleY - scale / 2 - 1,
              fixedScale + 2,
              1 * scale + 2
            );
            uiCtx.fill();

            if (!(i % gridSize) && height / gridSize > 1){
              uiCtx.fillStyle = "rgb(200,200,200)";
            }else{
              uiCtx.fillStyle = "#aaaaaa";
            }

            uiCtx.font = fixedScale / 2 + "px Arial";

            uiCtx.fillText(value, ruleX + fixedScale / 2, ruleY);
          }
        }
      }

      for (let i = 0; i <= width; i++) {
        uiCtx.fillStyle = "#aaaaaa";

        if (i % gridSize == 0 && !(i == width || i == 0)) {
          uiCtx.beginPath();
          uiCtx.lineWidth = scale / 8;
          uiCtx.moveTo(...getPosTableToScreen(i, 0));
          uiCtx.lineTo(...getPosTableToScreen(i, height));
          uiCtx.stroke();
        } else if (viewMode == 3) {
          //  uiCtx.lineWidth = Math.log(scale) * 0.3;
        }

        if (i > 0 && scale > 8) {
          let value = i % gridSize == 0 ? gridSize : i % gridSize;

          for (let j = 0; j < 2; j++) {
            let [ruleX, ruleY] = getPosTableToScreen(i - 0.5, height * j);

            switch (j) {
              case 0:
                ruleY = Math.max(ruleY - fixedScale, 0);
                break;

              case 1:
                ruleY = Math.min(ruleY, uiCanvas.height - fixedScale);
                break;
            }

            uiCtx.beginPath();

            if (!(i % gridSize) && width / gridSize > 1){
              uiCtx.fillStyle = "rgba(60,60,60,0.9)";
            }else{
              uiCtx.fillStyle = "rgba(40,40,40,0.9)";
            }

            uiCtx.rect(
              ruleX - scale / 2 - 1,
              ruleY - 1,
              1 * scale + 2,
              1 * fixedScale + 2
            );
            uiCtx.fill();

            if (!(i % gridSize) && width / gridSize > 1){
              uiCtx.fillStyle = "rgb(200,200,200)";
            }else{
              uiCtx.fillStyle = "#aaaaaa";
            }
            uiCtx.font = fixedScale / 2 + "px Arial";

            uiCtx.fillText(value, ruleX, ruleY + fixedScale / 2);
          }
        }
      }
    }
  }
}

function drawCursor(){
  if (isInside(...getPosScreenToGrid(...mouse)) && tool != 0) {
    if (!isOverPanel()) {

      switch (viewMode) {
        case 1:

          switch (tool) {
            case 3:
              uiCtx.lineWidth =  scale/10;

              [eracerX, eracerY] = [...s(getPosGridToScreen(...getPosScreenToGrid(...mouse)), [
                scale / 2,
                scale / 2,
              ])]

              uiCtx.beginPath();
              uiCtx.moveTo(eracerX - scale /5, eracerY - scale /5);
              uiCtx.lineTo(eracerX + scale/5, eracerY + scale/5);
              uiCtx.stroke();

              uiCtx.beginPath();
              uiCtx.moveTo(eracerX + scale /5, eracerY - scale /5);
              uiCtx.lineTo(eracerX - scale/5, eracerY + scale/5);
              uiCtx.stroke();

              break;
            case 4:
              uiCtx.beginPath();
              uiCtx.lineWidth =  scale/10;

              [pickerX, pickerY] = [...s(getPosGridToScreen(...getPosScreenToGrid(...mouse)), [
                scale / 2,
                scale / 2,
              ])]

              uiCtx.beginPath();
              uiCtx.arc(
                pickerX, pickerY,
                (scale * 0.5) - scale / 6 ,
                0,
                6.29,
                0
              );
              uiCtx.stroke()

              uiCtx.beginPath();
              uiCtx.arc(
                pickerX, pickerY,
                (scale * 0.5) - scale / 3  ,
                0,
                6.29,
                0
              );
              uiCtx.stroke()


              break;
            
            default:
              if (color - 1 < colors.length) {
                uiCtx.fillStyle =
                  "rgb(" +
                    colors[color - 1].rgb[0] +
                  "," +
                    colors[color - 1].rgb[1] +
                  "," +
                    colors[color - 1].rgb[2] +
                  ")";
              }

              uiCtx.rect(
                ...getPosGridToScreen(...getPosScreenToGrid(...mouse)),
                scale,
                scale
              );
              break;
          }
          break;

        case 2:
          uiCtx.arc(
            ...s(getPosGridToScreen(...getPosScreenToGrid(...mouse)), [
              scale / 2,
              scale / 2,
            ]),
            scale * 0.5,
            0,
            6.29,
            0
          );
          break;
      }
      uiCtx.fillStyle = "#aaaaaa";

      uiCtx.globalAlpha = 1;
    }
  }
}

function drawInfo(){

  let baseX = panels['colors'].x + panels['colors'].width + 20
  let baseY = 30

  uiCtx.fillStyle = "rgba(196, 196, 174 ,255)";
  uiCtx.font = "14px Arial";
  uiCtx.textAlign = "left";

  // General
  let [x,y] = [...getPosScreenToGrid(...mouse)]


  if(isInside(x,y)) uiCtx.fillText(`Pos: ${x+1} x ${y+1}`, baseX, baseY);
  
  uiCtx.fillText(`Color: ${color}`, baseX, baseY + 20);
  uiCtx.fillText(`Tool: ${tool}`, baseX, baseY + 40);
  uiCtx.fillText(`Scale: ${Math.floor(scale)}`, baseX, baseY + 60);

}

function updateMask(){
  // resizes the mask
  /*if(scale >= maskScale && scale < maskScaleHD){
    maskCanvas.style.width =  (scale * Math.min(width, window.screen.width/maskScale)) + "px";
    maskCanvas.style.height = (scale * Math.min(height, window.screen.height/maskScale)) + "px";
  
    maskCanvas.style.left = Math.max(getPosTableToScreen(0, 0)[0] % scale, getPosTableToScreen(0, 0)[0])   + "px";
    maskCanvas.style.top = Math.max(getPosTableToScreen(0, 0)[1] % scale, getPosTableToScreen(0, 0)[1]) +  "px";
  }else{
    maskCanvasHD.style.width =  (scale * Math.min(width, window.screen.width/maskScaleHD)) + "px";
    maskCanvasHD.style.height = (scale * Math.min(height, window.screen.height/maskScaleHD)) + "px";
  
    maskCanvasHD.style.left = Math.max(getPosTableToScreen(0, 0)[0] % scale, getPosTableToScreen(0, 0)[0])   + "px";
    maskCanvasHD.style.top = Math.max(getPosTableToScreen(0, 0)[1] % scale, getPosTableToScreen(0, 0)[1]) +  "px";
  }*/

}

function drawMask(){

 /* for (let c = 1; c < 3; c++) {
      let canvas = maskCtx
      if(c == 2){
        canvas = maskCtxHD
        mskScale = maskScaleHD
      }else{
        mskScale = maskScale
      }

      canvas.fillStyle = "rgb(40, 40, 40)"

      for (let i = 0; i < Math.min(width, window.screen.width/(mskScale)); i++) {
        for (let j = 0; j < Math.min(height, window.screen.height/(mskScale)); j++) {
        
          canvas.beginPath();
          canvas.arc(i * mskScale + mskScale/2,j * mskScale + mskScale/2,mskScale/6,0,2 * Math.PI, false);
          canvas.fill()

          canvas.beginPath();
          canvas.arc(i * mskScale + mskScale/2,j * mskScale + mskScale/2,mskScale/2,Math.PI/2,Math.PI, false);
          canvas.lineTo(i * mskScale + -mskScale/2 + mskScale/2,j * mskScale + mskScale/2 + mskScale/2);
          canvas.fill()
        
          canvas.beginPath();
          canvas.arc(i * mskScale + mskScale/2,j * mskScale + mskScale/2,mskScale/2,0,Math.PI/2, false);
          canvas.lineTo(i * mskScale + mskScale/2 + mskScale/2,j * mskScale + mskScale/2 + mskScale/2);
          canvas.fill()
        
          canvas.beginPath();
          canvas.arc(i * mskScale + mskScale/2,j * mskScale + mskScale/2,mskScale/2,Math.PI,3 * Math.PI/2, false);
          canvas.lineTo(i * mskScale + -mskScale/2 + mskScale/2,j * mskScale + -mskScale/2 + mskScale/2);
          canvas.fill()
        
          canvas.beginPath();
          canvas.arc(i * mskScale + mskScale/2,j * mskScale + mskScale/2,mskScale/2,3 * Math.PI/2,2*Math.PI, false);
          canvas.lineTo(i * mskScale + mskScale/2 + mskScale/2,j * mskScale + -mskScale/2 + mskScale/2);
          canvas.fill()
        
        }
    }
  }*/
}
function updateBackgroundAndRender() {
    // resizes the background and render canvases

    renderCanvas.style.width = scale * width + "px";
    renderCanvas.style.height = scale * height + "px";
  
    backgroundCanvas.style.width = scale * width + "px";
    backgroundCanvas.style.height = scale * height + "px";
  

    // reposicionates the background and render canvases
  
    renderCanvas.style.left = getPosTableToScreen(0, 0)[0] + "px";
    renderCanvas.style.top = getPosTableToScreen(0, 0)[1] + "px";
  
    backgroundCanvas.style.left = getPosTableToScreen(0, 0)[0] + "px";
    backgroundCanvas.style.top = getPosTableToScreen(0, 0)[1] + "px";

    // draw the ui
    
    renderCanvas.width = width;
    renderCanvas.height = height;
  
    backgroundCanvas.width = width;
    backgroundCanvas.height = height;
}

function drawBackground() {

    backgroundCtx.putImageData(background, 0, 0);

   
}

function draw() {

  drawBackground()

  // render the beads
  renderCtx.putImageData(grid2, 0, 0);

  uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
  if (scale > 20) {
    drawIds();
  }

  drawCursor()
  
  drawGrid()
  
  // TODO: arreglar el font de arriba



  for (let k in panels) {
    panels[k].controller();
  }

  clickDown = false;
  clickUp = false;

  if (isDebug){
    drawInfo()
  }
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);