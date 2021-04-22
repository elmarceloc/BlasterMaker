// Modules to control application life and create native browser window
const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const Menu = electron.Menu

const fs = require('fs');

var open = require("open");

var pjson = require('./package.json');

var os = require('os');
const { MenuItem, dialog } = require('electron')

//var spritesResources = require("./spritesresources");

var ipc = require('electron').ipcMain;

var request = require('request');

var cheerio = require('cheerio');

var sizeOf = require('image-size');



var mainWindow;
var tsrWindow;
var ideasWindow;
var aboutus;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
  //  resizable: false,
    width: 1280,
    height: 720,
    minWidth:400,
    minHeight:400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: __dirname + '/client/img/blaster.ico',
  })

  mainWindow.setBackgroundColor('#222222') // ???


  workerWindow = new BrowserWindow({
    webPreferences: {
      
      enableRemoteModule: true,
      nodeIntegration: true,

    },
  });

  workerWindow.hide();

 // workerWindow.hide();

  workerWindow.loadURL("file://" + __dirname + "/worker.html");
  //workerWindow.webContents.openDevTools();
  workerWindow.on("closed", () => {
      workerWindow = undefined;
  });


  // and load the index.html of the app.
  mainWindow.loadFile('client/index.html')



    mainWindow.on('close', function(e) {
      const choice = require('electron').dialog.showMessageBoxSync(this,
        {
          type: 'warning',
          buttons: ['Yes', 'No'],
          title: 'Cerrar Blaster Maker',
          message: '¿Estas segúro que deseas salir?'
        });
      if (choice === 1) {
        e.preventDefault();
      }
    });


  //mainWindow.loadURL('https://www.spriters-resource.com')

  // Open the DevTools.
   //mainWindow.webContents.openDevTools()
}



// retransmit it to workerWindow
ipc.on("printPDF", (event, content) => {
  console.log(content);
  workerWindow.webContents.send("printPDF", content);
});

function createIdeasWindow () {

  ideasWindow = new BrowserWindow({
  //  resizable: false,
    width: 932,
    height: 780,
    minWidth:400,
    minHeight:400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: true

    },
    icon: __dirname + '/client/img/blaster.ico',
    parent: mainWindow
  })

  ideasWindow.setBackgroundColor('#222222') // turns opaque brown

  //ideasWindow.setAlwaysOnTop(true);

  const ideasMenu = [
    {
      label: 'Consolas',
      submenu: [
        {
          label: 'Inicio',
          click: function(){
            tsrRedirect('main','')
          }
        },
        { type: 'separator' },
        {
          label: 'NES',
          click: function(){
            tsrRedirect('console','nes')
          }
        },
        {
          label: 'SNES',
          click: function(){
            tsrRedirect('console','snes')
          }
        },
        {
          label: 'Game Boy Advance',
          click: function(){
            tsrRedirect('console','gba')
          }
        },
        {
          label: 'Atari',
          click: function(){
            tsrRedirect('console','atari')
          }
        },
        {
          label: 'PC',
          click: function(){
            tsrRedirect('console','pc_computer')
          }
        },
        {
          label: 'Nintendo DS',
          click: function(){
            tsrRedirect('console','ds_dsi')
          }
        },
        { role: 'toggledevtools' },


        
        
        
        

      ]
    }
  ]



  const tsrMenuBar = Menu.buildFromTemplate(ideasMenu);


  ideasWindow.setMenu(tsrMenuBar);


  // and load the index.html of the app.
  
  //tsrWindow.loadURL('https://www.spriters-resource.com')
  ideasWindow.loadFile('client/ideas.html')

}

function createTSRWindow () {

  tsrWindow = new BrowserWindow({
  //  resizable: false,
    width: 932,
    height: 780,
    minWidth:400,
    minHeight:400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: true

    },
    icon: __dirname + '/client/img/blaster.ico',
    parent: mainWindow
  })

  tsrWindow.setBackgroundColor('#222222') // turns opaque brown

  tsrWindow.setAlwaysOnTop(true);

  const tsrMenu = [
    {
      label: 'Consolas',
      submenu: [
        {
          label: 'Inicio',
          click: function(){
            tsrRedirect('main','')
          }
        },
        { type: 'separator' },
        {
          label: 'NES',
          click: function(){
            tsrRedirect('console','nes')
          }
        },
        {
          label: 'SNES',
          click: function(){
            tsrRedirect('console','snes')
          }
        },
        {
          label: 'Game Boy Advance',
          click: function(){
            tsrRedirect('console','gba')
          }
        },
        {
          label: 'Atari',
          click: function(){
            tsrRedirect('console','atari')
          }
        },
        {
          label: 'PC',
          click: function(){
            tsrRedirect('console','pc_computer')
          }
        },
        {
          label: 'Nintendo DS',
          click: function(){
            tsrRedirect('console','ds_dsi')
          }
        },
        { role: 'toggledevtools' },


        
        
        
        

      ]
    }
  ]



  const tsrMenuBar = Menu.buildFromTemplate(tsrMenu);


  tsrWindow.setMenu(tsrMenuBar);


  // and load the index.html of the app.
  
  //tsrWindow.loadURL('https://www.spriters-resource.com')
  tsrWindow.loadFile('client/tsr.html')

}

function createPaletteWindow (palette) {
  // Create the browser window.
  paletteWindow = new BrowserWindow({
  //  resizable: false,
    width: 470,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,

    },
    icon: __dirname + '/client/img/blaster.ico',
  })

  paletteWindow.setBackgroundColor('#222222') // turns opaque brown

  const paletteMenu = [

  ]

  const paletteMenuBar = Menu.buildFromTemplate(paletteMenu);

  //paletteWindow.setAlwaysOnTop(true);


  paletteWindow.setMenu(paletteMenuBar);

  // and load the index.html of the app.
  switch (palette) {
    case '5mm':
      paletteWindow.loadURL('https://www.blasterchile.cl/collections/mini-2-6mm/products/bolsa-de-1000-beads-mini-2-6mm')

      paletteWindow.setTitle('Paleta de 5 mm')
      break;
  }

  // Open the DevTools.
   //mainWindow.webContents.openDevTools()
}



app.whenReady().then(() => {
  createWindow()
  
/*  const template = []

  const menu2 = Menu.buildFromTemplate('template')
  Menu.setApplicationMenu(menu2)
*/

/*
  const ctxMenu = new Menu()

  ctxMenu.append(new MenuItem({
    label: 'hello'
  }))

  mainWindow.webContents.on('context-menu',function(e, params) {
    ctxMenu.popup(mainWindow, params.x, params.y)
  })

  let currentURL = mainWindow.webContents.getURL();
  console.log(currentURL)
*/
  const mainMenu = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nuevo',
          click: function(){
            newBead()
          }
        },
        {
          label: 'Abrir',
          click: function(){
            openBead()
          }
        },
        {
          label: 'Guardar',
          //accelerator: process.platform == 'darwin' ? 'cmd + s' : 'ctrl + s',
          click: function() {
            save()
          }
        },
        {
          label: 'Guardar Como',
          click: function() {
            saveBead()
          }
        },
        {
          type: 'separator'
        },
       /* {
          label: 'Publicar',
          click: function(){
            newBead()
          }
        },*/
       /* {
          label: 'Ideas',
          click: function() {
            createIdeasWindow()
          },
        },*/
        {
          label: 'Importar Imagen',
          click: function() {
            importImg()
          },
          enabled: true
        },
       /* {
          label: 'Sprites Retro',
          click() {
            createTSRWindow()
          },*/
         // enabled: false
        //}
        //{
        //  type: 'separator'
        //},
      ]
    },
    {
      label: 'Ver',
      submenu: [
        /*{
          label: 'Estilo',
          submenu: [

            {
              label:'Bead studio free',
              //sublabel: 'ctrl + 1',
              click: function() {
                mainWindow.webContents.send('viewmode', 1)
              }
            },
            {
              label: 'Pixelart',
              //sublabel: 'ctrl + 2',
              click: function() {
                mainWindow.webContents.send('viewmode', 2)

               enabled:false
              }
            },
          ]
        },*/
        {
          label: 'Rejilla',
          click: function() {
            mainWindow.webContents.send('showGrid')
          }
        },
        {
          // TODO: rename
          label: 'Colores',
          click: function() {
            mainWindow.webContents.send('showIds')
          }
        },

       /* {
          label: 'Mostrar paletas de colores',
          submenu: [

            {
              label:'5mm',
              click: function() {
                createPaletteWindow('5mm')
              }
            },
          ]
        },
*/
        {
          type: 'separator'
        },
        { role: 'togglefullscreen' },
        { role: 'toggledevtools' },
      ]
    },
    {
      label: 'Editar',
      submenu: [
        {
          label: 'Deshacer',
        //  accelerator: process.platform == 'darwin' ? 'cmd + z' : 'ctrl + z',
          click: function() {
            mainWindow.webContents.send('action', 'undo')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Rotar a la derecha',
          click: function() {
            mainWindow.webContents.send('action', 'rotateR')
          }
        },

        {
          label: 'Rotar a la izquierda',
          click: function() {
            mainWindow.webContents.send('action', 'rotateL')
          }
        },

        {
          label: 'Invertir horizontalmente',
          click: function() {
            mainWindow.webContents.send('action', 'flipH')
          }
        },

        {
          label: 'Invertir verticalmente',
          click: function() {
            mainWindow.webContents.send('action', 'flipV')
          }
        },

        {
          label: 'Recortar',
        //  accelerator: process.platform == 'darwin' ? 'cmd + z' : 'ctrl + z',
          click: function() {
            mainWindow.webContents.send('action', 'crop')
          }
        },

        {
          type: 'separator'
        },
        {
          label: 'Limpiar',
          click: function() {
/*
            electron.dialog.showMessageBox(mainWindow, {
              title: 'Limpiar',
              buttons: ['Yes', 'No'],
              message: '¿Estas seguro que quieres vaciar el proyecto? Esto borrara tu progreso',
              type: 'warning',
            }, (response) => {
              if (response === 0){
                //Yes button pressed
                mainWindow.webContents.send('clear')
               }
               else if (response === 1) {
                //No button pressed
               }
               else if (response === 2){
                //Cancel button pressed
               }
             })
          */

          mainWindow.webContents.send('clear')

          }
        }
       /* {
          label: 'Rehacer',
          sublabel: 'ctrl + Y',
        },*/
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
       /* {
          label: 'Ayuda',
          click: function() {

          }
        },*/
        {
          label: 'Visitar blasterchile.cl',
          click: function() {
            open("https://blasterchile.cl");
          }
        },
        {
          label: 'Visitar Instagram de Blaster Chile',
          click: function() {
            open("https://www.instagram.com/blaster.chile");
          }
        },
        /*{
          label: 'Unirse al servidor de Discord',
          click: function() {
            open("https://linkdediscord.com");
          }
        },*/
        {
          label: 'Controles',
          click: function() {
            openControls()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Acerca de',
          click: function() {
            openaboutus()
          },
        },
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(mainMenu)

  Menu.setApplicationMenu(menu)


  function openaboutus(){
    aboutus = new BrowserWindow({
      width: 640,
      height: 480,
      parent: mainWindow,
      center: true,
      resizable:false,
      movable:false,
      alwaysOnTop: true,
      fullscreenable: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      icon: __dirname + '/client/img/blaster.ico',
    /* frame :false*/
    });
    aboutus.show();
    aboutus.setMenu(null)
    aboutus.loadFile('client/aboutus.html')

    aboutus.setAlwaysOnTop(true);
    
    
    aboutus.webContents.once('did-finish-load', () => {

      aboutus.webContents.send('systemInfo', 
        {
          software: pjson.version,
          os: process.platform + ' ' + os.arch
        }
      );

    })

  }

//------------------------------
//     Main window functions
//------------------------------


  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('updateScreenSize')
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('updateScreenSize')
  });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


function openBead() {
  electron.dialog
    .showOpenDialog({
      filters: [{ name: "Blaster Maker", extensions: ["bm"] }],
      properties: ["openFile"],
    })
    .then((result) => {
      if (result.canceled) return;

      fs.readFile(result.filePaths[0], "utf8", function (err, data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);

        // send data to client

        mainWindow.webContents.send("loadBeads", data, result.filePaths[0]);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}


function importImg(){
  electron.dialog.showOpenDialog({
    filters: [
      { name: 'Imágenes', extensions: ["png","jpg","jpeg",'bmp','gif'] },
    ],
    properties: ['openFile']
}).then(result => {

    if(result.canceled) return;

    var size = sizeOf(result.filePaths[0]);

   /* if (size.width > 256 || size.height > 256) {
      
      electron.dialog.showMessageBox(mainWindow, {
        title: 'Tamaño excedido',
        message: 'Imagen muy grande',
        detail: 'El maximo tamaño posible es 256x256',
        type: 'error',
      }, (response) => {



       })

    }else{*/
     // mainWindow.webContents.send('importImgSimple', result.filePaths[0],size)
     // mainWindow.webContents.send('importImg', result.filePaths[0],size)

      mainWindow.loadFile('client/cropper.html')


      mainWindow.webContents.once('did-finish-load', () => {

        mainWindow.webContents.send('loadPreview', result.filePaths[0])

    
      })


   // }


}).catch(err => {
  console.log(err)
})
}

function newBead() {
  mainWindow.webContents.send('newBead')
}

function saveBead(){
  mainWindow.webContents.send('readBeads')
}

function save(){
  mainWindow.webContents.send('save')
}

function openControls() {
  mainWindow.webContents.send('ctrls')

  ctrlsWindow = new BrowserWindow({
      width: 800,
      height: 520,
      parent: mainWindow,
      center: true,
      resizable:false,
     // movable:false,
      alwaysOnTop: true,
      fullscreenable: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      icon: __dirname + '/client/img/blaster.ico',
    /* frame :false*/
    });
    ctrlsWindow.show();
    ctrlsWindow.setMenu(null)
    ctrlsWindow.loadFile('client/controls.html')

    ctrlsWindow.setAlwaysOnTop(true);
    
}



//--------------------
//     TSR functions
//--------------------

var base_url = 'https://www.spriters-resource.com';


function tsrRedirect(type, value) {
  let base = '';

  switch (type) {
    case 'console':
      base = '/'
      break;
    case 'genre':
      base = '/genre/'
      break;
    case 'main':
      tsrWindow.webContents.send('tsrMain')
      return
    break;
  }

  tsrWindow.loadURL(base_url + base + value)

}

ipc.on('openTSR', (event, tsrURL) => {

    //let tsrURL = tsrWindow.webContents.getURL();

    request({
      method: 'GET',
      uri: tsrURL
    },function(error, response, body) {
      var $ = cheerio.load(body);

      var src = $('#sheet-container').find('img').attr('src');

      var img_url = base_url + src

    // mainWindow.webContents.send('importImg', img_url)

      tsrWindow.loadFile('client/cropper.html')


      tsrWindow.webContents.once('did-finish-load', () => {

        tsrWindow.webContents.send('loadPreview', img_url)

    
      })

  //    tsrWindow.close();

      console.log(img_url)
    })

  }
)

ipc.on('getBeads', (event, data) => {

  let options = {
    title: "Guardar Plantilla - Blaster Maker",
    defaultPath : "C:\\" + data.name,
    buttonLabel : "Guardar Plantilla",
    filters :[
      {name: 'Blaster Maker', extensions: ['bm']},
    ]
  }


  var path = electron.dialog.showSaveDialogSync(mainWindow, options)
  
  if(typeof path === 'undefined') return;
  
  fs.writeFile(path, JSON.stringify(data), function(err) {
      // file saved or err
      //todo:mandar notificacion
      mainWindow.webContents.send('saved', path)
  });
})


ipc.on('saveFile', (event, data, path) => {
  
  if(typeof path === 'undefined') return;
  
  fs.writeFile(path, JSON.stringify(data), function(err) {
      // file saved or err
      console.log('saved on path', path)
  });
})



ipc.on('exportImageData', (event, data) => {
  console.log(data)

//  tsrWindow.close();

  mainWindow.loadFile('client/index.html')


  mainWindow.webContents.once('did-finish-load', () => {

    mainWindow.webContents.send('importImg', {url: data.url, x: data.x, y: data.y, w: data.w, h: data.h, size: data.size, kit: data.kit, scale:data.scale}) //???????

  })

})


ipc.on('closecropper', (event) => {

//  tsrWindow.close();

  mainWindow.loadFile('client/index.html')

})



