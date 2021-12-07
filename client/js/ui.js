var app = new Vue({
  el: "#app",
  data: {
    name: "",
    colorPalette: "",
    beadSize: "",
    total: 3,
    onLine: navigator.onLine,
    sidemenu: 3,
    size: '',
    colors: [],
    beads: [],
    cost: 0,
    realSize: 0,
    customPrice: 0,
    amountToDo: 1,
    priceFive: 3.78,
    priceTwo: 1.445,
    margin: 0,

    // projects
    selected: [],
    myprojects: [],
    projects: [],
    personal: false,
    query: '',
    category: 0,
    beta: false,

    isElectron: navigator.userAgent.toLowerCase().indexOf(" electron/") > -1,

    renderMode: 'pixels',
    renderDefinition:'hight',
    renderType:'color'
  },
  methods: {
    toggleLogin: function (value) {
      this.sidemenu = value;
    },

    select: function (from, index) {
      switch (from) {
        case "personal":
          this.personal = true
          this.selected = this.myprojects[index];
          break;

        case "browser":
          this.personal = false
          this.selected = this.projects[index];
          break;
      }
    },

    doFav: function(from, index) {
     /* switch (from) {
        case "personal":
            this.myprojects[index].liked = !this.myprojects[index].liked;
          break;

        case "browser":*/
    /*        console.log(from,index)
            console.log(this.projects[index].liked)
            this.projects[index].liked = !this.projects[index].liked;*/
     /*     break;
      }*/
    },

    onlogin: function () {
      // my projects

      /* fetch("http://localhost:4000/project/")
      .then(response => response.json())
      .then(projects => {
        this.myprojects = projects
      })*/

      // other proyects

      /*  fetch("https://api.npms.io/v2/search?q=vue")
      .then(response => response.json())
      .then(data => (this.projects = data.total));
*/
      var self = this;

      // DEBUG


        this.projects.forEach(project =>{
          project.liked = true
        })


    
    },
    togglePublish: function () {
      const canvas = document.getElementById("renderCanvas");
  canvas.toBlob(function (blob) {
    const formData = new FormData();
    formData.append("file", blob, "filename.png");

    formData.append("name", app.name);
    formData.append("type", "private");
    formData.append("size", gridSize);
    formData.append("palette", palette);
    formData.append("width", width);
    formData.append("height", height);
    formData.append("total", getColorsAmount());
    formData.append("code", JSON.stringify(generate()));
    formData.append("colors", JSON.stringify(colors));

    formData.append("userId", "6066682fe0fb5c09e00dc132"); //TODO: Cambiar 👀

    // Post via axios or other transport method
    axios
      .post("http://localhost:4000/project", formData)
      .then((resp) => {
        console.log(resp.status);

        switch (resp.data) {
         /* case "0":
            UIkit.notification({
              message: "Tu proyecto esta vacío",
              pos: "top-center",
            });
            break;*/
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
      })
      .catch(function (error) {
        /* if (!error.response) {
          // network error
          UIkit.notification({
            message: "Error al subir el proyecto a la nube.",
            pos: "top-center",
          });
      }*/
      });
  });
    },

    onChangeCustomPrice(){
      let pricePerBead = this.beadSize  == '5 mm' ? this.priceFive : this.priceTwo
      let price = Math.floor( this.total * pricePerBead )
      let finalPrice = this.amountToDo * (this.margin/100 * price + price)

      this.customPrice = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(finalPrice)

    },
    setPrice(){
      this.onChangeCustomPrice()
    }
    /*setPublish: function(state) {
      document.getElementById("public").checked = state;
      this.publicState = state;

    }*/
  },
  computed: {
    filteredProjects: function () {
      var self = this;
      return self.projects.filter(function (project) {
        let name = project.name.toLowerCase().indexOf(self.query) !== -1
        let category = project.category == self.category

        return name && (category || self.category == 0);
      })
    }
  }
});

//app.onlogin();

function updatePreview() {
  document.getElementById("previewCanvas").src = renderCanvas.toDataURL();
}

function resizePreview() {
  if (height > width) {
    //   document.getElementById("previewCanvas").style.width= document.querySelector('#previewContainer').clientWidth -100
    //  document.getElementById("previewCanvas").style.height="auto"

    document.getElementById("previewCanvas").style.height =
      window.innerHeight - 10 - navbarSize;
    document.getElementById("previewCanvas").style.width =
      (document.getElementById("previewCanvas").clientHeight * width) / height;
  } else {
    document.getElementById("previewCanvas").style.width =
      document.querySelector("#previewContainer").clientWidth - 130;
    document.getElementById("previewCanvas").style.height = "auto";
  }
}
setInterval(resizePreview, 200);

document.getElementById("openinfo").onclick = function () {
  
  app.total = getColorsAmount();

  if (app.total == 0) {
    UIkit.notification({
      message: "Tu proyecto esta vacío",
      pos: "top-center",
    });
    return;
  }
  
  updateColors()

  updateMoney()

  updatePreview();

  resizePreview()

  updateRealSize()

  showLayout("info");

};

document.getElementById("closeinfo").onclick = function () {
  showLayout("main");
};

document.getElementById("closenew").onclick = function () {
  if (colors.length > 0) {
    showLayout("main");
  } else {
    UIkit.notification({
      message: "Tienes que crear un proyecto primero",
      pos: "top-center",
    });
  }
};

function updateRealSize(){
  let { x1,y1,x2,y2 } = getBoundries()
  
  let realWidth = x2 - x1 + 1
  let realHeight = y2 - y1 + 1

  if(app.beadSize == '5 mm'){    
    realSize = 5
  }else{
    realSize = 2.6
  }
  realWidth = realWidth * realSize
  realHeight = realHeight * realSize

  let min = Math.min(realWidth, realHeight)

  console.log(realWidth, realHeight, min)

  if(min < 10) {
    app.realSize = realWidth + ' mm X ' + realHeight +' mm'
  }else if(min >= 10  && min < 1000) {
    app.realSize = realWidth/10 + ' cm X ' + realHeight/10 +' cm'
  }else if(min >= 1000) {
    app.realSize = realWidth/1000 + ' m X ' + realHeight/1000 +' m'
  }
}

function updateMoney(){
  let costPerBead = null;

  if(app.beadSize == '5 mm'){
    costPerBead = app.priceFive
  }else{
    costPerBead = app.priceTwo
  }
  
  app.cost = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(Math.floor(app.total * costPerBead))

}

function updateColors(){
  app.colors = [];

  colorsUsed = [];
  colorsAmount = [];

  for (let x = 0; x < 4 * width * height; x += 4) {
    var r = grid2.data[x + 0];
    var g = grid2.data[x + 1];
    var b = grid2.data[x + 2];
    var a = grid2.data[x + 3];

    if (a) {
      if (!colorsUsed.includes([r, g, b] + "")) {
        colorsUsed.push([r, g, b] + "");
        colorsAmount[[r, g, b] + ""] = 1;
      } else {
        colorsAmount[[r, g, b] + ""]++;
      }
    }
  }

  colorsUsed.forEach((c) => {
    let color = c.split(",");

    app.colors.push({
      id: colorPalette[getColorId(color, colorPalette) - 1].id,
      rgb: "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")",
      name: colorPalette[getColorId(color, colorPalette) - 1].name,
      amount: colorsAmount[c + ""],
    });
  });
}


function toggleEvents(bool) {
  if (bool) {
    document.addEventListener("wheel", wheel);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("keydown", keyDown);
  } else {
    document.removeEventListener("wheel", wheel);
    document.removeEventListener("mousedown", mouseDown);
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("keydown", keyDown);
  }
}

function showLayout(layout) {

  document.getElementById("new").style.display = "none";
  document.getElementById("info").style.display = "none";
  document.getElementById("main").style.display = "none";

  document.getElementById("closeinfo").style.background = "#ff1744";   

  toggleEvents(false);

  switch (layout) {
    case "new":
      app.name = "";
      document.getElementById("name").value = "";
      document.getElementById("x").value = 1;
      document.getElementById("y").value = 1;

      document.getElementById("new").style.display = "block";
      break;

    case "info":
      document.getElementById("info").style.display = "block";
      document.getElementById("body").style.overflowY = "visible !important"; // poner important
      document.getElementById("closeinfo").style.background = "rgb(34,34,34)";   
      break;

    case "main":
      toggleEvents(true);

      document.getElementById("main").style.display = "block";
      document.getElementById("body").style.overflowY = "hidden"; // poner important

      break;
  }
}

function showTutorial(){
  tippy('#openinfo', {
    content: '¡Aca puedes ver la informacion de tu proyecto!',
    theme: 'light',
    placement: 'left-end',

  })

  tippy('#search', {
    content: '¡Aca puedes buscar colores!',
    theme: 'light',
    placement: 'right-end',

  })

  
  document.querySelector('#overlay').style.opacity = '100%'

  document.querySelector('#openinfo')._tippy.show();
  document.querySelector('#search')._tippy.show();

  document.body.addEventListener('click', closeTutorial, true); 
}

function closeTutorial(){
  document.querySelector('#overlay').style.opacity = '0%'
  setTimeout(function(){
    document.querySelector('#openinfo')._tippy.disable();
    document.body.removeEventListener("click", closeTutorial);

  },2000)

}

function initProject() {
  app.size = width / gridSize + " x " + height / gridSize;

  app.colorPalette = palette == "all" ? "Completa" : "Basica";
  app.beadSize = gridSize == 29 ? "5 mm" : "2.6 mm";

  color = 1;

  xOffset = 0;
  yOffset = 0;

  scale = 12;
  temp = [];
  
  updateMask()
  drawMask()
  drawBackground()

  showLayout("main");

  save();

  updateScreenSize()
  updateBackgroundAndRender()

  
  // if tutorial didnt show up
  if (storage) {
    if(storage.getSync('showTutorial') && Object.keys(storage.getSync('showTutorial')).length === 0 && storage.getSync('showTutorial').constructor === Object){

      showTutorial()

      storage.set('showTutorial', true, function(error) {

      });
    }
  }else{
    if( localStorage.getItem("showTutorial") === null){

      showTutorial()
      
      localStorage.setItem("showTutorial", true);
    }
  }
  //app.setPublish(false)

  /*maskCanvas.width = Math.min(width, window.screen.width/maskScale)* maskScale;
  maskCanvas.height = Math.min(height, window.screen.height/maskScale)* maskScale;

  maskCanvasHD.width = Math.min(width, window.screen.width/maskScaleHD)* maskScaleHD;
  maskCanvasHD.height = Math.min(height, window.screen.height/maskScaleHD)* maskScaleHD;

  maskCanvas.style.opacity = '0%'
  maskCanvasHD.style.opacity = '0%'*/

}
/*
function hasKit(kit) {

  return true
}
*/
/*function checkKits() {
  app.basico = hasKit('basic') ? 'SI' : 'NO'
  app.medio = hasKit('medium') ? 'SI' : 'NO'
}*/

function createNew() {
  var x = document.getElementById("x").value;
  var y = document.getElementById("y").value;
  var kit = document.querySelector('input[name="kit"]:checked').value;
  var size = document.querySelector('input[name="size"]:checked').value;

  if (!x || !y) {
    UIkit.notification({
      message: "La cantidad de placas incorrecta",
      pos: "top-center",
    });

    return;
  } else if (x <= 0 || y <= 0) {
    UIkit.notification({
      message: "La cantidad de placas no puede ser 0",
      pos: "top-center",
    });

    return;
  } else if (Number.isInteger(x) || Number.isInteger(y)) {
    UIkit.notification({
      message: "La cantidad de placas es incorrecta",
      pos: "top-center",
    });

    return;
  }


  if (app.name == "") {
    UIkit.notification({
      message: "Falta el nombre del proyecto",
      pos: "top-center",
    });
    return;
  }

  setColorPalete(size, kit);

  resize(x * gridSize, y * gridSize);

  initProject();

  //initialSave()

}

function openRecent() {

  if (localStorage.getItem('code') != null) {
    // TODO:mostrar q no hay en el else
    console.log(localStorage.getItem('code'))
    load( localStorage.getItem('code') )
    initProject();
  } 
  if (storage) {
    storage.has('code', function(error, hasKey) {
      if (hasKey) {
        load( JSON.stringify(storage.getSync('code')) )
        initProject();
      }
    });
  }
    
}

/**
 * Create a proyect from image
 * @param {str} `data` -  {x, y, w, h, size, kit, url, scale}
 */

function createFromImage(data) {
  setColorPalete(data.size, data.kit);
  
  loadImg(data, function (newImg, newX, newY, oldWidth, oldHeight, newWidth, newHeight ) { // TODO: rotation.etc
    var canvas2 = document.createElement("canvas");
    var canvas3 = document.createElement("canvas");

    var oldCtx = canvas2.getContext("2d");
    var newCtx = canvas3.getContext("2d");

    oldCtx.canvas.width = oldWidth;
    oldCtx.canvas.height = oldHeight;

    oldCtx.drawImage(newImg, 0, 0);

    // scales the image using neirest neighbourn algorithm

    var panX = 0; // scaled image pan
    var panY = 0;
    var ang = 0;

    newCtx.canvas.width = newWidth; 
    newCtx.canvas.height = newHeight; 

    // use 32bit ints as we are not interested in the channels
    var src = oldCtx.getImageData(0, 0, oldWidth, oldHeight);

    var data = new Uint32Array(src.data.buffer); // source
    var dest = newCtx.createImageData(newWidth, newHeight);
    var zoomData = new Uint32Array(dest.data.buffer); // destination
    var xdx = (Math.cos(ang) * oldWidth) / newWidth; // xAxis vector x
    var xdy = (Math.sin(ang) * oldHeight) / newWidth; // xAxis vector y
    var ind = 0;
    var xx, yy;

    resize(newWidth, newHeight);

    for (var newY = 0; newY < newHeight; newY++) {
      for (var newX = 0; newX < newWidth; newX++) {
        // transform point
        xx = newX * xdx - newY * xdy + panX;
        yy = newX * xdy + newY * xdx + panY;
        // is the lookup pixel in bounds
        if (xx >= 0 && xx < oldWidth && yy >= 0 && yy < oldHeight) {
          // use the nearest pixel to set the new pixel
          zoomData[ind++] = data[(xx | 0) + (yy | 0) * oldWidth]; // set the pixel
        } else {
          zoomData[ind++] = 0; // pixels outside bound are transparent
        }
      }
    }

    newCtx.putImageData(dest, 0, 0); // put the pixels onto the destination canvas

   // document.getElementById("app").appendChild(canvas2);     
   // document.getElementById("app").appendChild(canvas3);     

    for (var i = 0; i < dest.data.length; i += 4) {
      // get color of pixel
      var r = dest.data[i]; // Red
      var g = dest.data[i + 1]; // Green
      var b = dest.data[i + 2]; // Blue
      var a = dest.data[i + 3]; // Alpha

      let min = 9999999;
      let idMin = 0;

      for (let j in colors) {
        let rgb = colors[j].rgb;
        let dis = distanceRGB(rgb[0], rgb[1], rgb[2], r, g, b, 2);

        if (dis < min) {
          min = dis;
          idMin = j;
        }
      }

      if (a == 0) {
        idMin = -1;
      }

      setBeadColor((i / 4) % newWidth, Math.floor(i / 4 / newWidth), parseInt(idMin) + 1);
    }

    //    }

    //checkKits()

    initProject();

    //initialSave()


    //dis=( Math.abs(rgb[0]-r) + Math.abs(rgb[1]-g) + Math.abs(rgb[2]-b) )
  });
}

//setInterval(updateSave,60*1000*3) // TODO: online version

function downloadTable() {


  
  //var container = document.getElementById("image-wrap"); //specific element on page
  window.scrollTo(0, 0);

    var container = document.getElementById("colorsheet-container"); // full page
    html2canvas(container, {
      allowTaint: true,
      backgroundColor: "#222222",
    }).then(function (canvas) {

      if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {

        ipc.send('saveImage',canvas.toDataURL())
    
      }else{
  
        var link = document.createElement("a");
        document.body.appendChild(link);
        
        link.download = app.name + ".jpg";

        link.href = canvas.toDataURL();
        link.target = "_blank";
        link.click();

      }
    });

}


function downloadImage() {

  var imagePreview = document.getElementById('previewCanvas');
  //var template = document.getElementById('template');

  var c2 = document.createElement('canvas');
  let ctx2 = c2.getContext('2d');

  var c3 = document.createElement('canvas');
  let ctx3 = c3.getContext('2d');

  switch (app.renderMode) {
    case 'pixels':
  
      let zoom = 20
  
      c2.width = width * zoom
      c2.height = height * zoom
      

      // scales the image using neirest neighbourn algorithm
  
      var offtx = document.createElement('canvas').getContext('2d');

      offtx.drawImage(imagePreview, 0, 0);
      
    //   ctx2.drawImage(template, 0, 0, width * zoom , height * zoom );
      
      var imgData = offtx.getImageData(0, 0, imagePreview.width, imagePreview.height).data;

      // Draw the zoomed-up pixels to a different canvas context
      for (var x = 0; x < imagePreview.width; ++x) {
        for (var y = 0; y < imagePreview.height; ++y) {
          // Find the starting index in the one-dimensional image data
          let i = (y * imagePreview.width + x) * 4;
          let r = imgData[i];
          let g = imgData[i + 1];
          let b = imgData[i + 2];
          let a = imgData[i + 3];

          ctx2.fillStyle =
            "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
          ctx2.fillRect(x * zoom + 30, y * zoom + 30, zoom, zoom);
        }
      }


      var cnv = ''
  
      if(app.renderDefinition == 'original'){
        cnv = renderCanvas
      }else if(app.renderDefinition == 'hight'){
        cnv = c2
      }
      break;
  
    case 'beads':

      let beadScale = 16
      let radius = (beadScale / 2 - beadScale/6)

      c2.width = imagePreview.width * beadScale;
      c2.height = imagePreview.height * beadScale;
  
      c3.width = width * beadScale
      c3.height = height * beadScale

      ctx2.drawImage(imagePreview, 0, 0);
  
      let imageData = ctx2.getImageData(0, 0, imagePreview.width, imagePreview.height);    
  
      for (let row = 0; row < height * imagePreview.height; row++) {
        for (let col = 0; col < imagePreview.width; col++) {
            let index = (col + row * imagePreview.width) * 4;
  
            let r = imageData.data[index];
            let g = imageData.data[index + 1];
            let b = imageData.data[index + 2];
            let a = imageData.data[index + 3];
  
            ctx3.beginPath();
            ctx3.fillStyle = "rgba(0, 0, 0, 0";
            ctx3.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
            ctx3.lineWidth = beadScale/3;
            ctx3.arc(
                beadScale * col + beadScale / 2,
                beadScale * row + beadScale / 2,
                radius,
                0,
                2 * Math.PI,
                false
            );
            ctx3.fill("evenodd");
  
            ctx3.stroke();
        }
        cnv = c3
      }
      break;
  }

  saveCanvasAsImage(cnv)
  
}



function printToScale(){
  var images = `<div>`

  const circleRadius = 32

  for (let i = 0; i < width / gridSize; i++) {
    
    for (let j = 0; j < height / gridSize; j++) {
    
      var tempCanvas = document.createElement('canvas');

      var finalCanvas = document.createElement('canvas');


      tempCanvas.width = gridSize
      tempCanvas.height = gridSize

      finalCanvas.width = gridSize * circleRadius
      finalCanvas.height = gridSize * circleRadius
    
      var tempCtx    = tempCanvas.getContext('2d')
      var image  = document.getElementById('previewCanvas')

      var finalCtx    = finalCanvas.getContext('2d'),
          clip   = getClippedRegion(image, i * gridSize, j * gridSize, gridSize, gridSize);

      tempCtx.drawImage(clip, 0, 0);

      let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

      var isEmpty = true

      for (let k = 0; k < imageData.data.length; k += 4) {

        if (!(imageData.data[k + 0] == 0 &&
          imageData.data[k + 1] == 0 &&
          imageData.data[k + 2] == 0 &&
          imageData.data[k + 3] == 0)){

          isEmpty = false;
        }
      }


      if(!isEmpty){      

        for (let row = 0; row <   gridSize; row++) {
          for (let col = 0; col <   gridSize; col++) {
            let index = (col + (row *  gridSize)) * 4;

            let r = imageData.data[index]
            let g = imageData.data[index + 1] 
            let b = imageData.data[index + 2] 
            let a = imageData.data[index + 3]
            
            let [hue, saturation, lightness] = [...rgbToHsl(r,g,b)]

            if (a > 0){
              
              if(app.renderType == 'color'){ //??
                finalCtx.beginPath();
                finalCtx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 255 + ")";
                finalCtx.arc(circleRadius * col + circleRadius/2, circleRadius* row+ circleRadius/2, circleRadius/2 -1, 0, 2 * Math.PI, false);
                finalCtx.fill();
              }else if(app.renderType == 'code'){
                finalCtx.font = "25px Arial";
                finalCtx.textBaseline = "middle";
                finalCtx.textAlign = "center";
                finalCtx.fillText(colors[getColorId([r, g, b], colors) - 1].id.substr(2), circleRadius * col + circleRadius/2, circleRadius* row+ circleRadius/2);
              }
            }

            finalCtx.beginPath();

            if(a == 0 ) {
              finalCtx.fillStyle = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 255 + ")";
              finalCtx.arc(circleRadius * col + circleRadius/2, circleRadius* row+ circleRadius/2, circleRadius/8, 0, 2 * Math.PI, false);
            }else if(lightness >= 0.5 && app.renderType == 'color'){
              finalCtx.fillStyle = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 255 + ")";
              finalCtx.arc(circleRadius * col + circleRadius/2, circleRadius* row+ circleRadius/2, circleRadius/8, 0, 2 * Math.PI, false);
            }else if(lightness < 0.5 && app.renderType == 'color'){
              finalCtx.fillStyle = "rgba(" + 255 + "," + 255 + "," + 255 + "," + 255 + ")";
              finalCtx.arc(circleRadius * col + circleRadius/2, circleRadius* row+ circleRadius/2, circleRadius/8, 0, 2 * Math.PI, false);
            }
            finalCtx.fill();

          }
        }
      var dataURL = finalCanvas.toDataURL();
        // draws the clipped image onto the on-screen canvas
  
        images += `<div class="piece"> <span  class="number">${j+1}-${i+1}</span> <img src="${dataURL}"> </img>  <div class="mask">  </div>   </div>`;

    
      }


    }
    
  }
  images += `  </div> `;

 

  printReal(images)

}

function fullscreen() {
  img_box(document.getElementById("preview"));
}