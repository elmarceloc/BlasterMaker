// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

if (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) {
  var ipc = require("electron").ipcRenderer;

  function createNotification(body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("Blaster Maker", {
        body: body,
        icon:
          "https://blasterchile.cl/wp-content/uploads/2019/09/logo_rojo.png",
      });
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("Blaster Maker", {
            body: body,
            icon:
              "https://blasterchile.cl/wp-content/uploads/2019/09/logo_rojo.png",
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

  //TODO: guardar estas cosas en la version web tambien

  ipc.on("viewmode", (event, mode) => {
    setViewMode(mode);
  });

  ipc.on("showGrid", (event) => {
    toggleGrid();
  });

  ipc.on("showIds", (event) => {
    toggleIds();
  });

  ipc.on("clear", (event, mode) => {
    newDraw(width, height);
  });

  ipc.on("readBeads", (event) => {
    // if (!showWindow) {
    ipc.send("getBeads", generate());
    //} else {
    // TODO: maybe mandar mensaje de error
    //}
  });

  ipc.on("importImg", (event, data) => {
    importImg(
      data.url,
      data.x,
      data.y,
      data.w,
      data.h,
      data.size,
      data.kit,
      data.scale
    );
  });

  ipc.on("importImgSimple", (event, url) => {
    importImgSimple(url);
  });

  ipc.on("save", (event) => {
    save();

    if (path != "") {
      ipc.send("saveFile", generate(), path);
    }
  });

  ipc.on("saved", (event, file_path) => {
    path = file_path;

    createNotification("Proyecto guardado");
  });

  ipc.on("newBead", (event) => {
    showLayout("new");
  });

  ipc.on("updateScreenSize", (event) => {
    updateScreenSize();
  });

  ipc.on("action", (event, action) => {
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
    }
  });

  ipc.on("loadPreview", (event, src) => {
    document.getElementById("previewCropOriginal").src = src;



    img = new Image();
    img.onload = function() {
      updatePreview(img, Math.min(img.width,100))

    } 
    img.src = src//src;



    document.getElementById("previewCropOriginal").onload = function () {
      document.getElementById("width").value = this.width;
      document.getElementById("height").value = this.height;

      document.querySelector("#scale").max = this.width;

      document.querySelector("#scale").value = Math.min(this.width,100);

      document.querySelector("#showrange").innerHTML = Math.min(this.width,100);

    };

  });

  ipc.on("ctrls", (event, src) => {
    //showCtrls()
  });

  function exportImageData(event) {


    event.preventDefault()

    const x = document.querySelector("#x").value;
    const y = document.querySelector("#y").value;
    const w = document.querySelector("#width").value;
    const h = document.querySelector("#height").value;
    const size = document.querySelector('input[name="sizeBeads"]:checked').value;
    const kit = document.querySelector('input[name="kit"]:checked').value;
    const url = document.querySelector("#previewCropOriginal").src;
    const scaleFac = document.querySelector("#scale").value;

    ipc.send("exportImageData", {
      x: x,
      y: y,
      w: w,
      h: h,
      size: size,
      kit: kit,
      url: url,
      scale: scaleFac,
    });
  }

  ipc.on("tsrMain", (event) => {
    document.getElementById("web").style.top = "0px";
    document.getElementById("web").style.visibility = "hidden";
    document.getElementById("use-btn").style.visibility = "hidden";
    document.documentElement.style.overflow = "visible";
  });

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
  
  if(month < 10){
    formatDate = `${day}-0${month}-${year}`
  }else{
    formatDate = `${day}-${month}-${year}`
  }

  var page = `
  <!doctype html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>${app.name}</title>
      
      <style>
      .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, .15);
          font-size: 16px;
          line-height: 24px;
          font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
          color: #555;
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
      #color-table{
        min-height: 500px;

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
        #pdf,#file-image,#publicTr,#modal-publish,#nameInput
          {
              display: none !important;
          }
      }

      #nameInput{
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
      </style>
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
          
          <style>
          .invoice-box {
              max-width: 800px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, .15);
              font-size: 16px;
              line-height: 24px;
              font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              color: #555;
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
          #color-table{
            min-height: 500px;

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
              #pdf,#file-image,#publicTr,#modal-publish,#nameInput
              {
                  display: none !important;
              }
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
          </style>
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

//ipc.send('invokeAction', 'someData');