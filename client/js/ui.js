var app = new Vue({
  el: "#app",
  data: {
    name: "",
    colorPalette: "",
    beadSize: "",
    ctrl: false,
    cmd: false,
    total: 3,
    onLine: navigator.onLine,
    sidemenu: 3,
    //  basico: 'NO',
    //  medio: 'NO',
    //  palete: "ARTKAL midi S",
    size: width + "x" + height,
    colors: [],
    beads: [],
    // projects
    selected: [],
    myprojects: [],
    projects: [],
    publicState: false,
    query: '',
    category: 0,
  },
  methods: {
    toggleLogin: function (value) {
      this.sidemenu = value;
    },

    select: function (from, index) {
      switch (from) {
        case "personal":
          this.selected = this.myprojects[index];
          break;

        case "browser":
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
            console.log(from,index)
            console.log(this.projects[index].liked)
            this.projects[index].liked = !this.projects[index].liked;
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

      this.myprojects = [
        {
          _id: "603c45fc2812eb3f68140622",
          width: 29,
          height: 29,
          type: "private",
          code:
            "0_499 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_75 255_1 0_3 255_1 0_39 255_1 0_3 255_1 0_67 255_1 0_47 255_1 0_3 255_1 0_59 255_1 0_15 255_1 0_39 255_1 0_59 255_1 0_15 255_1 0_43 255_1 0_55 255_1 0_27 255_1 0_3 255_1 0_3 255_1 0_23 255_1 0_51 255_1 0_3 255_1 0_63 255_1 0_47 255_1 0_67 255_1 0_47 255_1 0_67 255_1 0_47 255_1 0_15 255_1 0_51 255_1 0_47 255_1 0_3 255_1 0_11 255_1 0_31 255_1 0_19 255_1 0_51 255_1 0_15 255_1 0_27 255_1 0_19 255_1 0_51 255_1 0_15 255_1 0_3 255_1 0_23 255_1 0_19 255_1 0_55 255_1 0_15 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_23 255_1 0_55 255_1 0_3 255_1 0_55 255_1 0_59 255_1 0_3 255_1 0_3 255_1 0_43 255_1 0_3 255_1 0_67 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_27 255_1 0_3 255_1 0_87 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_844",
          name: "3sdfsdf5",
          palette: "all",
          size: "5",
          total: 2343,
          img:
            "https://cdn.discordapp.com/attachments/739291798219915266/815351283023085578/unknown.png",
        },
      ];


      getProjects()

     

        for (let i = 0; i < 16; i++) {

          this.projects.push( 
            {
              _id: "603c45fc2812eb3f68140622",
              name: makeid(5),
              category: Math.floor(Math.random()*3),
              type: "public",
              size: "5",
              palette: "all",
              width: 174,
              height: 174,
              total: 777,
              code:
                "0_499 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_75 255_1 0_3 255_1 0_39 255_1 0_3 255_1 0_67 255_1 0_47 255_1 0_3 255_1 0_59 255_1 0_15 255_1 0_39 255_1 0_59 255_1 0_15 255_1 0_43 255_1 0_55 255_1 0_27 255_1 0_3 255_1 0_3 255_1 0_23 255_1 0_51 255_1 0_3 255_1 0_63 255_1 0_47 255_1 0_67 255_1 0_47 255_1 0_67 255_1 0_47 255_1 0_15 255_1 0_51 255_1 0_47 255_1 0_3 255_1 0_11 255_1 0_31 255_1 0_19 255_1 0_51 255_1 0_15 255_1 0_27 255_1 0_19 255_1 0_51 255_1 0_15 255_1 0_3 255_1 0_23 255_1 0_19 255_1 0_55 255_1 0_15 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_23 255_1 0_55 255_1 0_3 255_1 0_55 255_1 0_59 255_1 0_3 255_1 0_3 255_1 0_43 255_1 0_3 255_1 0_67 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_27 255_1 0_3 255_1 0_87 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_3 255_1 0_844",
              likes: 150,
              img:
                Math.random() > 0.5 ? "https://cdn.discordapp.com/attachments/739291798219915266/815742376902393866/download.png" : 'https://i.imgur.com/fuTEIL1.png',
              colors:
                "[{'breads':110,'id':'S-13','name':'Black'},{'breads':178,'id':'S-52','name':'Picasso'},{'breads':200,'id':'S-83','name':'Siena'},{'breads':22,'id':'S-11','name':'Dark Blue'},{'breads':123,'id':'S-78','name':'Ash Gray'},{'breads':12,'id':'S-58','name':'Paprika'}]",
              createdAt: "2021-03-01T01:40:12.146Z",
              updatedAt: "2021-03-01T01:40:12.146Z",
            },
          )
          
        }

      // DEBUG


        this.projects.forEach(project =>{
          project.liked = true
        })


    
    },
    togglePublish: function () {
      // publicar
      if (this.publicState) {
        document.getElementById("public").checked = false;
      } else {
        document.getElementById("public").checked = true;
      }
      this.publicState = !this.publicState;
      console.log(this.publicState);
    },
    setPublish: function(state) {
      document.getElementById("public").checked = state;
      this.publicState = state;

    }
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

app.onlogin();

/*

  
document.getElementById("closeCtrls").onclick = function () {
    document.getElementById("main").style.visibility = "visible";

    document.getElementById("controls").style.visibility = "hidden";

}
*/

closenew.style.top = navbarSize + 20 + "px";

openinfo.style.top = navbarSize + 20 + "px";
closeinfo.style.top = navbarSize + 20 + "px";

function updatePreview() {
  /* renderCtx.beginPath()
  renderCtx.fillStyle = "rgb(20,20,20)"
  renderCtx.rect(0,0, width * scale, height * scale)
  renderCtx.fill()
*/

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

  app.colors = [];

  colorsUsed = [];
  colorsAmount = [];

  for (x = 0; x < 4 * width * height; x += 4) {
    var r = grid2.data[x + 0];
    var g = grid2.data[x + 1];
    var b = grid2.data[x + 2];
    var a = grid2.data[x + 3];

    if (a) {
      if (!colorsUsed.includes([r, g, b] + "")) {
        colorsUsed.push([r, g, b] + "");
        colorsAmount[[r, g, b] + ""] = 0;
      } else {
        colorsAmount[[r, g, b] + ""]++;
      }
    }
  }

  colorsUsed.forEach((c) => {
    console.log(c);
    let color = c.split(",");
    app.colors.push({
      id: colorPalette[getColorId(color, colorPalette) - 1].id,
      rgb: "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")",
      name: colorPalette[getColorId(color, colorPalette) - 1].name,
      amount: colorsAmount[c + ""],
    });
  });

  //checkKits()

  updatePreview();

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

/**
 * Gets the amount of beads from color
 *
 * @param {number} `id` - the id of bead color
 * @return {number} amount of beads

*/

function getColorAmount(id) {
  let count = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (getBeadColor(i, j) == id) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Gets the total amount of beads
 *
 * @return {number} amount of beads

*/

function getColorsAmount() {
  let count = 0;
  //console.log(grid)
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (isBead(i, j)) {
        count++;
      }
    }
  }
  return count;
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
  switch (layout) {
    case "new":
      toggleEvents(false);

      projectName = "";
      document.getElementById("name").value = "";
      document.getElementById("x").value = 1;
      document.getElementById("y").value = 1;

      document.getElementById("new").style.visibility = "visible";
      document.getElementById("info").style.visibility = "hidden";
      document.getElementById("main").style.visibility = "hidden";
      break;

    case "info":
      toggleEvents(false);

      document.getElementById("new").style.visibility = "hidden";
      document.getElementById("info").style.visibility = "visible";
      document.getElementById("main").style.visibility = "hidden";

      document.getElementById("body").style.overflowY = "visible !important"; // poner important
      break;

    case "main":
      toggleEvents(true);

      document.getElementById("new").style.visibility = "hidden";
      document.getElementById("info").style.visibility = "hidden";
      document.getElementById("main").style.visibility = "visible";

      document.getElementById("body").style.overflowY = "hidden"; // poner important
      break;
  }
}

function initProject() {
  app.size = width / gridSize + " x " + height / gridSize;
  app.name = projectName;
  app.colorPalette = palette == "all" ? "Completa" : "Basica";
  app.beadSize = gridSize == 29 ? "5 mm" : "2.6 mm";

  color = 1;

  xOffset = 0;
  yOffset = 0;

  scale = 12;

  showLayout("main");

  // colorPalette = []

  temp = []; //??

  save();

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
  projectName = document.getElementById("name").value;

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

  console.log(projectName);

  if (projectName == "") {
    UIkit.notification({
      message: "Falta el nombre del proyecto",
      pos: "top-center",
    });
    return;
  }

  setColorPalete(size, kit);

  resize(x * gridSize, y * gridSize);

  localStorage.setItem("palette", palette);

  localStorage.setItem("gridSize", gridSize);

  initProject();

  initialSave()

}

function openRecent() {
  if (localStorage.getItem("code")) {
    load(localStorage.getItem("code"));

    palette = localStorage.getItem("palette");

    gridSize = localStorage.getItem("gridSize");

    initProject();
  } else {
    // muestra un error, porque no hay un recent proyect
  }
}

function importImg(url, x, y, w, h, size, kit, newWidth) {
  // ??

  setColorPalete(size, kit);

  loadImg(url, x, y, w, h, function (img, x, y, width, height) {
    var canvas2 = document.createElement("canvas");
    var canvas3 = document.createElement("canvas");

    var ctx = canvas2.getContext("2d");
    var ctx1 = canvas3.getContext("2d");

    ctx.canvas.width = w;
    ctx.canvas.height = h;

    ctx.drawImage(img, 0, 0);

    var panX = 0; // scaled image pan
    var panY = 0;
    var ang = 0;
    var wd = ctx.canvas.width; // destination image
    var hd = ctx.canvas.height;

    ctx1.canvas.width = w; // ??
    ctx1.canvas.height = h; // ??

    // use 32bit ints as we are not interested in the channels
    var src = ctx.getImageData(0, 0, w, h);

    var data = new Uint32Array(src.data.buffer); // source
    var dest = ctx1.createImageData(wd, hd);
    var zoomData = new Uint32Array(dest.data.buffer); // destination
    var xdx = (Math.cos(ang) * wd) / newWidth; // xAxis vector x
    var xdy = (Math.sin(ang) * hd) / newWidth; // xAxis vector y
    var ind = 0;
    var xx, yy;

    // FIXME: corregir tamaño

    resize(newWidth, hd / (wd / newWidth));

    for (var y = 0; y < hd; y++) {
      for (var x = 0; x < wd; x++) {
        // transform point
        xx = x * xdx - y * xdy + panX;
        yy = x * xdy + y * xdx + panY;
        // is the lookup pixel in bounds
        if (xx >= 0 && xx < w && yy >= 0 && yy < h) {
          // use the nearest pixel to set the new pixel
          zoomData[ind++] = data[(xx | 0) + (yy | 0) * w]; // set the pixel
        } else {
          zoomData[ind++] = 0; // pixels outside bound are transparent
        }
      }
    }

    ctx1.putImageData(dest, 0, 0); // put the pixels onto the destination canvas

    //document.getElementById("app").appendChild(canvas);     // Append <li> to <ul> with id="myList"
    //document.getElementById("app").appendChild(canvas2);     // Append <li> to <ul> with id="myList"
    //document.getElementById("app").appendChild(canvas3);     // Append <li> to <ul> with id="myList"

    for (var i = 0; i < dest.data.length; i += 4) {
      // get color of pixel
      var r = dest.data[i]; // Red
      var g = dest.data[i + 1]; // Green
      var b = dest.data[i + 2]; // Blue
      var a = dest.data[i + 3]; // Alpha

      min = 9999999;
      idMin = 0;

      for (let j in colors) {
        rgb = colors[j].rgb;
        dis = distanceRGB(rgb[0], rgb[1], rgb[2], r, g, b, 2);

        if (dis < min) {
          min = dis;
          idMin = j;
        }
      }

      if (a == 0) {
        idMin = -1;
      }

      setBeadColor((i / 4) % wd, Math.floor(i / 4 / wd), parseInt(idMin) + 1);
    }

    //    }

    //checkKits()

    initProject();

    initialSave()


    //dis=( Math.abs(rgb[0]-r) + Math.abs(rgb[1]-g) + Math.abs(rgb[2]-b) )
  });
}

/*
function importImg(url, x, y, w, h, size, kit, scale) {

  temp= [generate()];

  setColorPalete(size, kit)


  loadImg(url,x,y,w,h,function(data, width, height) {

    for (var i = 0; i < data.length; i+=4) {
        // get color of pixel
        var r = data[i]; // Red
        var g = data[i+1]; // Green
        var b = data[i+2]; // Blue
        var a = data[i+3]; // Alpha
      
        
        min = 9999999;
        idMin = 0;
        
        for(let j in colors){
          rgb = colors[j].rgb;
          dis = distanceRGB(rgb[0], rgb[1], rgb[2], r, g, b, 1)
          
          if(dis < min){
            min = dis
            idMin = j
          }
        }
        
        if (a == 0){
          idMin = -1
        }

        setBeadColor(
          (i / 4) % width,
          Math.floor(i / 4 / width),
          parseInt(idMin) + 1
        );
      }

      save()

      //TODO: ver si es compatible con pack basico y medio
    
      previewScale = preview.width / width

      checkKits()


      
      app.size = width/gridSize + 'x' + height/gridSize + ' ('+ width + 'x' + height +')'
      
      color = 1

      xOffset = 0
      yOffset = 0
    
      scale = 12

      showLayout('main')

  
      //dis=( Math.abs(rgb[0]-r) + Math.abs(rgb[1]-g) + Math.abs(rgb[2]-b) )
});

}
*/

setInterval(updateSave,60*1000*3)

function downloadTable() {
  window.scrollTo(0, 0);

  //var container = document.getElementById("image-wrap"); //specific element on page
  var container = document.getElementById("colorsheet-container"); // full page
  html2canvas(container, {
    allowTaint: true,
    backgroundColor: "#222222",
  }).then(function (canvas) {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = projectName + ".jpg";
    link.href = canvas.toDataURL();
    link.target = "_blank";
    link.click();
  });
}

function fullscreen() {
  img_box(document.getElementById("preview"));
}
