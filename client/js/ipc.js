// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
  var ipc = require("electron").ipcRenderer;
  var {dialog } = require('electron').remote;
  var fs = require('fs');

  var bmdata = ipc.sendSync('get-file-data');

  if (bmdata != null) {
    load(bmdata);
    initProject()
  }

  function createNotification(body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      new Notification("Blaster Maker", {
        body: body,
        icon:
          "img/blaster.png",
      });
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          new Notification("Blaster Maker", {
            body: body,
            icon:
              "img/blaster.png",
          });
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  ipc.on("loadBeads", (event, beads, pth) => {
    path = pth;
    load(beads);
    initProject()
  });


  ipc.on("view", (event, action, mode) => {
    switch (action) {
      case "viewmode":
        setViewMode(mode);
        break;
      case "showGrid":
        toggleGrid();
        break;
      case "showIds":
        toggleIds();
        break;
      case "scale":
        setScale(1)
        break;
    }
  });

  ipc.on("readBeads", (event) => {
    // if (!showWindow) {
    ipc.send("getBeads", generate());
    //} else {
    // TODO: maybe mandar mensaje de error
    //}
  });

  ipc.on("createFromImage", (event, data) => {
    createFromImage(data);
  });


  ipc.on("save", (event) => {
    save();

    if (path != "") {
      ipc.send("saveFile", generate(), path);
    } // TODO: check
  });

  ipc.on("saved", (event, file_path) => {
    path = file_path;

    createNotification("Proyecto guardado");
  });

  ipc.on("newBead", (event) => {
    showLayout("new");
  });

  ipc.on("edit", (event, action) => {
    switch (action) {
      case "undo":
        undo();
        break;
      case "crop":
        crop();
        break;
      case "rotateR":
        rotateRight();
        break;
      case "rotateL":
        rotateLeft();
        break;
      case "flipH":
        flipHorizontal();
        break;
      case "flipV":
        flipVertical();
        break;
      case "clear":
        newDraw(width, height);
        break;
    }
  });

  ipc.on("loadPreview", (event, src) => {
    document.getElementById("previewCropOriginal").src = src;

    //  ipc.send("setProgress",0.5)

    img = new Image();
    img.onload = function () {

      changePalette(img, img.width, img.height)

      updatePreview(img, Math.min(img.width, 100))

      cropWidth = img.width
      cropHeight = img.height

      document.querySelector("#loading-container").style.visibility = 'hidden';
      document.querySelector("#previewCrop").style.display = 'block';
      
      ipc.send("setProgress", 1)

      setTimeout(function () {
        ipc.send("setProgress", 0)
      }, 500)
    }

    img.src = src;



    document.getElementById("previewCropOriginal").onload = function () {
      //document.getElementById("width").value = this.width;

      //document.getElementById("height").value = this.height;

      document.querySelector("#scale").max = this.width;

      document.querySelector("#scale").value = Math.min(this.width, 100);

      document.querySelector("#showrange").value = Math.min(this.width, 100);

    };

  });

  function exportImageData(event) {


    event.preventDefault()

/*    const x = document.querySelector("#x").value;
    const y = document.querySelector("#y").value;*/
  //  const w = document.querySelector("#width").value;
  //  const h = document.querySelector("#height").value;
    const size = document.querySelector('input[name="sizeBeads"]:checked').value;
    const kit = document.querySelector('input[name="kit"]:checked').value;
    const url = document.querySelector("#previewCropOriginal").src;
    const newWidth = document.querySelector("#scale").value;

    ipc.send("exportImageData", {
      x: 0,
      y: 0,
      w: cropWidth,
      h: cropHeight,
      size: size,
      kit: kit,
      url: url,
      newWidth: parseInt(newWidth),
      newHeight: (newWidth * cropHeight) / cropWidth,
      
    });
  }

  ipc.on("tsrMain", (event) => {
    document.getElementById("web").style.top = "0px";
    document.getElementById("web").style.visibility = "hidden";
    document.getElementById("use-btn").style.visibility = "hidden";
    document.documentElement.style.overflow = "visible";
  });

  function importFromMenu() {
    ipc.send("loadFromMenu")
  }
  
  ipc.on("debug", (event, debug) => {
    isDebug = debug
  
    console.log('Debug Mode set to', debug)
  });
}

function saveCanvasAsImage(canvas) {
  if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {

    ipc.send('saveImage',canvas.toDataURL())

  }else{

    let a = $("<a>")
    .attr("href",  canvas.toDataURL())
    .attr("download", app.name == '' ? 'imagen.png' : app.name + ".png")
    .appendTo("body");
    
    a[0].click();
    
    a.remove();
  }
}


/**
 * Downloads the page as image
 *
 */

function printTable() {
  var sheet = $("#colorssheet").html();

  let date = new Date()

  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  if (month < 10) {
    formatDate = `${day}-0${month}-${year}`
  } else {
    formatDate = `${day}-${month}-${year}`
  }

  var style = `
  <style>
  .invoice-box {
      max-width: 800px;
      margin: auto;
      padding: 30px;
      /*     border: 1px solid #eee;
      box-shadow: 0 0 10px rgba(0, 0, 0, .15);*/
      font-size: 16px;
      line-height: 24px;
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      color: #555;
  }
  #color-table{
    overflow-y: visible!important
  }
  
  .invoice-box table {
      width: 100%;
      line-height: inherit;
      text-align: left;
  }
  
  .invoice-box table td {
      padding: 5px;
      vertical-align: top;
  }
  
  .invoice-box table tr td:nth-child(2) {
      text-align: left;
  }
  
  .invoice-box table tr.top table td {
      padding-bottom: 20px;
  }
  
  .invoice-box table tr.top table td.title {
      font-size: 45px;
      line-height: 45px;
      color: #333;
  }
  
  .invoice-box table tr.information table td {
      padding-bottom: 40px;
  }
  
  .invoice-box table tr.heading th {
      background: #eee;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      padding-left: 15px!important;
  }
  
  .invoice-box table tr.details td {
      padding-bottom: 0px!important;
  }
  
  .invoice-box table tr.item td{
      border-bottom: 1px solid #eee;
  }
  
  .invoice-box table tr.item.last td {
      border-bottom: none;
  }
  
  .invoice-box table tr.total td:nth-child(2) {
      border-top: 2px solid #eee;
      font-weight: bold;
  }

  .table-container {
    margin-bottom: 30px;
  }
  @media only screen and (max-width: 600px) {
      .invoice-box table tr.top table td {
          width: 100%;
          display: block;
          text-align: center;
      }
      
      .invoice-box table tr.information table td {
          width: 100%;
          display: block;
          text-align: center;
      }
  }

  @media print
  {    
    #pdf,#file-image,#publicTr,#modal-publish,#nameInput,.icon-reset
      {
          display: none !important;
      }
  }

  #nameInput,.icon-reset,#modal-publish{
    display: none !important;
  }
  
  /** RTL **/
  .rtl {
      direction: rtl;
      font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  }
  
  .rtl table {
      text-align: right;
  }
  
  .rtl table tr td:nth-child(2) {
      text-align: left;
  }
  </style>`


  var page = `
  <!doctype html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>${app.name}</title>
      ${style}
  </head>
  
  <body>
      <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">

              
              <tr class="information">
                  <td colspan="2">
                      <table>
                          <tr>
                              <td>
                                  Nombre: ${app.name}<br>
                                  Fecha: ${formatDate}<br>
                                  
                              </td>
                              

                          </tr>
                      </table>
                  </td>
              </tr>

            </table>

              ${sheet}
      </div>
  </body>
  </html>`;

  if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
    ipc.send("printPDF", page);
  } else {
    var w = window.open();

    w.document.write(
      `<!doctype html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>${app.name}</title>
          
          ${style}
      </head>
      
      <body>
          <div class="invoice-box">
              <table cellpadding="0" cellspacing="0">

                  
                  <tr class="information">
                      <td colspan="2">
                          <table>
                              <tr>
                                  <td>
                                      Nombre: ${app.name}<br>
                                      Fecha: ${formatDate}<br>
                                      
                                  </td>
                                  

                              </tr>
                          </table>
                      </td>
                  </tr>

                </table>

                  ${sheet}
          </div>
      </body>
      </html>`
    );
    w.window.print();
    w.document.close();
    return false;
  }
}


function printReal(images) {

  var style = `
    <style>
      body{    margin: 10mm 10mm 10mm 10mm; }
      img{
        image-rendering: auto;
        image-rendering: crisp-edges;
        image-rendering: pixelated;

        width: calc(${gridSize == 29 ? 5 : 2.6}mm * ${gridSize});
        border: 1px dashed black;
      }
      .piece{
        margin: 0.5cm;
        float: left;
      }
      .piece img{
        margin-top: 30px;
      }
      .number{ 
        position: absolute;
        font-family: sans-serif;
        height: 29px;
        width: 40px;
        vertical-align: baseline;
        font-weight: bold;
        
        border: black solid 1px;
        text-align: center;
    </style>
  `

  var page = `
  <!doctype html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>${app.name}</title>
       ${style}
  </head>
  
  <body>
     ${images}
  </body>
  </html>`;

  if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
    ipc.send("printPDF", page);
  } else {
    var w = window.open();
    w.document.write(
      `<!doctype html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>${app.name}</title>
          ${style}
      </head>
      
      <body>
         ${images}
      </body>
      </html>`
    );
    setTimeout(() => {
      w.window.print();
      w.document.close();
    }, 500)

    return false;
  }
}


//ipc.send('invokeAction', 'someData');
