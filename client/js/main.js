uiCanvas = document.getElementById("uiCanvas");
renderCanvas = document.getElementById("renderCanvas");
backgroundCanvas = document.getElementById("backgroundCanvas");
//canvas4 = document.getElementById("canvas4");

uiCtx = uiCanvas.getContext("2d");
renderCtx = renderCanvas.getContext("2d");
backgroundCtx = backgroundCanvas.getContext("2d");
//context4 = canvas4.getContext("2d");

uiCanvas.width = window.innerWidth;
uiCanvas.height = window.innerHeight;

var id = null;

var path = ''

var palette = "all";
var colorPalette = [];

var isDevMode = true;

var width = 29;
var height = 29;

var viewMode = 1;

var showGrid = true;
var showIds = false;

var scale = 12;
var xOffset = 0;
var yOffset = 0;

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

grid2 = new ImageData(width, height);
grid2.data.fill(0);

background = new ImageData(width, height);

var temp = [];

var panels = [];

var gridSize = 29;

/*
var meter = new FPSMeter({
  left:'80px',
  heat:  0,
  graph:   1, // Whether to show history graph.
	history: 20 // How many history states to show in a graph.
})
*/



/**
 * Loads data in JSON format
 *
 * @param {string} file - file data as Stringified JSON

*/

function load(file) {
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
  let newGrid = decompress(code).split(" ");
  
  //projectName = name

  app.name = name;

  setColorPalete(size, kit)

  
  newDraw(width, height);
  
  for (let i = 0; i < newGrid.length; i += 4) {
    grid2.data[i] = newGrid[i];
    grid2.data[i + 1] = newGrid[i + 1];
    grid2.data[i + 2] = newGrid[i + 2];
    grid2.data[i + 3] = newGrid[i + 3];
    //agregar colores mientras se importa la imagen
    if (grid2.data[i + 3]) {
      nuevoColor = getColorId(grid2.data.slice(i, i + 3), colorPalette);
      if (nuevoColor == 0) {
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
  let savedData = compress(grid2.data.join(" "));

  return {
    width: width,
    height: height,
    code: savedData,
    name: app.name,
    palette: palette,
    size: gridSize == 29 ? '5' : '2.6'
  }

  //return width + "," + height + "," + savedData + "," +  projectName  + "," +   palette + "," + gridSize;
}

/**
 *  Apply Run-Length-Encoding to an spaced-string draw
 *
 *
 * @param {string} input data - data
 * @return {string} encoded data - encoded data as string

*/

function compress(str) {
  var output = "";
  var count = 0;
  S = str.split(" ");
  for (var i = 0; i < S.length; i++) {
    count++;
    if (S[i] != S[i + 1]) {
      output += " " + S[i] + "_" + count;
      count = 0;
    }
  }
  return output.substring(1);
}

/**
 *  Decompress Run-Length-Encoding of an spaced-string encoded draw
 *
 *
 * @param {string} `str` - data encoded
 * @return {string} `str` - decoded data

*/

function decompress(str) {
  S = str.split(" ").map((k) => k.split("_"));
  var output = "";
  for (let i = 0; i < S.length; i++) {
    output += i ? " " : "";
    for (let j = 0; j < S[i][1]; j++) {
      output += (j ? " " : "") + S[i][0];
    }
  }
  return output;
}

function save() {
  // FIXME:
  if (temp.length > 30) {
    temp.shift(1);
  }
  temp.push(generate());
  localStorage.setItem("code", JSON.stringify(generate()));

  console.log('saved')
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
    posicionInicio = getPosScreenToGrid(0, 0);
    posicionFinal = getPosScreenToGrid(uiCanvas.width, uiCanvas.height);

    diferenciaX = posicionFinal[0] - posicionInicio[0];
    diferenciaY = posicionFinal[1] - posicionInicio[1];

    for (y = 0; y < diferenciaY; y++) {
      for (
        x = getBeadPos(...posicionInicio) + width * 4 * y;
        x < getBeadPos(...posicionInicio) + diferenciaX * 4 + width * 4 * y;
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

      for (let i = 0; i <= height; i++) {
        uiCtx.fillStyle = "#aaaaaa";

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
            var [ruleX, ruleY] = getPosTableToScreen(width * j, i - 0.5);

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
            var [ruleX, ruleY] = getPosTableToScreen(i - 0.5, height * j);

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
      uiCtx.beginPath();

      switch (viewMode) {
        case 1:

          switch (tool) {
            case 3:
              uiCtx.strokeStyle = "rgb(255,0,0)";
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
              uiCtx.fillStyle = "rgba(0,0,0,0)";
              uiCtx.strokeStyle = "rgb(255,64,101)";
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

      uiCtx.globalAlpha = 0.6;
      uiCtx.fill();
      uiCtx.globalAlpha = 1;
    }
  }
}


function drawBackground() {
  
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
  
    //canvas4.style.width = scale * width + "px";
    //canvas4.style.height = scale * height + "px";
  
    //canvas4.style.left = getPosTableToScreen(0, 0)[0] + "px";
    //canvas4.style.top = getPosTableToScreen(0, 0)[1] + "px";
  
    // draw the ui
  
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
  
    renderCanvas.width = width;
    renderCanvas.height = height;
  
    backgroundCanvas.width = width;
    backgroundCanvas.height = height;

    backgroundCtx.putImageData(background, 0, 0);
}


//TODO: crear funcion que setea el estado de public, id,etc al importar un proyecto propio

function getProjects() {
  axios.get("http://localhost:4000/project", {credentials:true }).then(function (response) {
    console.log(response.data)
    self.projects = response.data

    self.projects.forEach(project =>{
      project.colors = JSON.parse(project.colors)

    })

  })
}

function updateSave() {
  // actualisar

  //todo: verificar si hay algun proyecto en curso

  if(id != null){
    /*

    usar id de proyecto para actualisar

    axios.update('http://localhost:4000/project', formData).then(resp => {

    })
    */
  }

}

function initialSave() {
  
  const canvas = document.getElementById('renderCanvas');
  canvas.toBlob(function(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'filename.png');

    formData.append('name' , app.name); 
    formData.append('type' , 'private'); 
    formData.append('size' , gridSize); 
    formData.append('palette' , palette); 
    formData.append('width' , width); 
    formData.append('height' , height); 
    formData.append('total' ,getColorsAmount()); 
    formData.append('code' , JSON.stringify(generate())); 
    formData.append('colors' , JSON.stringify(colors)); 


    formData.append('userId' , '6066682fe0fb5c09e00dc132'); //TODO: Cambiar 👀



    // Post via axios or other transport method
    axios.post('http://localhost:4000/project', formData).then(resp => {

      console.log(resp.status);
      
      switch (resp.data) {
        case '0':
          UIkit.notification({
            message: "Tu proyecto esta vacío",
            pos: "top-center",
          });
          break;
          // TODO: activar esto cuando este el online ready
       /* case '2':
          UIkit.notification({
            message: "Error al subir el proyecto a la nube",
            pos: "top-center",
          });
          break;*/

      /* case '3':
          UIkit.notification({
            message: "Proyecto guardado exitosamente en la nube",
            pos: "top-center",
          });
          break;  */
      }

    }).catch(function (error) {

     /* if (!error.response) {
        // network error
        UIkit.notification({
          message: "Error al subir el proyecto a la nube.",
          pos: "top-center",
        });
    }*/

    
    });
    


  })
}


function loadFromWeb() {
  var file = {
    width: app.selected.width,
    height: app.selected.height,
    code: app.selected.code,
    name: app.selected.name,
    palette: app.selected.palette,
    size: app.selected.size
  }

  UIkit.modal(document.getElementById('modal-project')).hide();

  
  load(JSON.stringify(file))

  initProject()
  
  app.setPublish(app.selected.type == 'public' && app.personal ? true: false )


  if (app.personal) {
    initialSave()

    // TODO:update   updateSave() en loop

    
  }else{
    app.name = 'Copia de '+app.selected.name
  }

}



/**
 * load the previews temp
 *
 */

function undo() {
  if (temp.length <= 1) return;

  if (temp.length == 0) {
    temp = [generate()];
  }

  temp.splice(-1,1)

  load(JSON.stringify(temp[temp.length-1]));



  console.log('undo'+'|'+temp.length)


  localStorage.setItem("code", JSON.stringify(generate()));
  // localStorage.setItem("saves", temp);
}

var mask = document.getElementById("mask");

var beadSize = 1280;

function resize(w, h) {
  width = Math.ceil(w/ gridSize) * gridSize;
  height = Math.ceil(h/ gridSize) * gridSize;
  grid2 = new ImageData(width, height);
  matrix = [...Array(height)].map((k) => [...Array(width)].fill(0));


 // context4.clearRect(0, 0, width * beadSize, height * beadSize);
 // canvas4.width = w * beadSize/10;
 // canvas4.height = h * beadSize/10
  

/*
  for (let j = 0; j < height; j+=1) {
    for (let i = 0; i < width; i+=1) {
      console.log(i,j)
      context4.drawImage(mask,beadSize * i, beadSize * j,beadSize,beadSize);
    }
  }*/

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

function newDraw(w, h) {
  colorPalette = [];
  // creates the new grid
  grid2.data.fill(0);

  resize(w, h);
}

/**
 * load an image from url
 * @param {str} `url` - the url of an image
 */

function loadImg(url, x, y, w , h, callback) {

  colorPalette = [];
  var img = new Image();
  img.onload = function () {
    callback(img, x, y, img.width, img.height);
  };
  img.src = url;

  /*colorPalette = [];

  var img = new Image();
  console.log(img)
  img.onload = function () {
    var renderCanvas = document.createElement("canvas");
    var tempctx = uiCanvas.getContext("2d");
    tempctx.uiCanvas.width = w;
    tempctx.uiCanvas.height = h;
    tempctx.drawImage(img, 0, 0);
    newDraw(
      Math.ceil(w / gridSize) * gridSize,
      Math.ceil(h / gridSize) * gridSize
    ); //???

    tempctx.putImageData(tempctx.getImageData(x, y, w, h)) 

    var img = document.createElement("img");
    img.src = tempctx.toDataURL("image/png");

    console.log(img)
    callback(img, w, h);
  };
  img.src = url;*/
}

function loadImgSimple(url, callback) {
  colorPalette = [];
  var img = new Image();
  img.onload = function () {
    callback(img, img.width, img.height);
  };
  img.src = url;
}

//canvas4.width = width * beadSize;
//canvas4.height = height * beadSize;

renderCanvas.style.width = width + "px";
renderCanvas.style.height = height + "px";

backgroundCanvas.style.width = width + "px";
backgroundCanvas.style.height = height + "px";

//canvas4.style.width = width * beadSize + "px";
//canvas4.style.height = height * beadSize + "px";
/*
for (let j = 0; j < height; j++) {
  for (let i = 0; i < width; i++) {
    context4.drawImage(mask, beadSize * i, beadSize * j);
  }
}*/

function draw() {

  drawBackground()

  // render the beads
  renderCtx.putImageData(grid2, 0, 0);

  
  if (scale > 20) {
    drawIds();
  }

  drawCursor()
  
  drawGrid()
  
  // TODO: arreglar el font de arriba

  for (k in panels) {
    panels[k].controller();
  }

  clickDown = false;
  clickUp = false;

	//meter.tick();

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

if (localStorage.getItem("showGrid")) {
  showGrid = localStorage.getItem("showGrid") == "true";
}

if (localStorage.getItem("showIds")) {
  showIds = localStorage.getItem("showIds") == "true";
}

if (localStorage.getItem("viewMode")) {
  viewMode = parseInt(localStorage.getItem("viewMode"));
}