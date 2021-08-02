require('dotenv').config()

const electron = require('electron')

const {BrowserWindow, Menu, ipcMain, shell} = require('electron')

const sizeOf = require('image-size');

const fs = require('fs')

const path = require('path')

const { openAboutUs } = require("./aboutus");
const { openControls } = require("./controls");
//const { openTSRWindow } = require("./tsr");
//const { openIdeasWindow } = require("./ideas");

var workerWindow;

function openMainWindow() {
    mainWindow = new BrowserWindow({
        //  resizable: false,
        width: 1280,
        height: 720,
        minWidth: 400,
        minHeight: 400,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: __dirname + '../../client/img/blaster.ico',
    })

    mainWindow.setBackgroundColor('#222222') // ???

    mainWindow.on('blur', function(){
        mainWindow.webContents.send('onToggleBlur',true);
    });

    mainWindow.on('focus', function(){
        mainWindow.webContents.send('onToggleBlur',false);
    });

    workerWindow = new BrowserWindow({
        webPreferences: {

            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,

        },
    });

    workerWindow.hide();

    workerWindow.loadURL("file://" +  path.join(__dirname, '../') + "/worker.html");

    if (process.env.DEV == 'true') mainWindow.webContents.openDevTools();

    workerWindow.on("closed", () => {
        workerWindow = undefined;
    });


    // and load the index.html of the app.
    mainWindow.loadFile('client/index.html')

    if (process.env.DEV == 'false') {

        mainWindow.on('close', function (e) {
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
    }

    const mainMenu = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Nuevo',
                    click: function () {
                        newBead()
                    }
                },
                {
                    label: 'Abrir',
                    click: function () {
                        openBead()
                    }
                },
                {
                    label: 'Guardar',
                    accelerator: process.platform == 'darwin' ? 'cmd + s' : 'ctrl + s',
                    /*acele*/
                    click: function () {
                        save()
                    }
                },
                {
                    label: 'Guardar Como',
                    click: function () {
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
                    click: function () {
                        showOpenImageDialog()
                    },
                    enabled: true
                },
                /*{
                  label: 'Sprites Retro',
                  click() {
                    openTSRWindow(mainWindow)
                  },*/
                // enabled: false
                // }
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
                      }
                    },
                  ]
                },*/
                {
                    label: 'Reglas',
                    click: function () {
                        mainWindow.webContents.send('view', 'showGrid')
                    }
                },
                {
                    label: 'Colores',
                    click: function () {
                        mainWindow.webContents.send('view', 'showIds')
                    }
                },
                {
                    label: 'Ver a escala',
                    click: function () {
                        mainWindow.webContents.send('view', 'scale')
                    }
                },

                /* {
                   label: 'Mostrar paletas de colores',
                   submenu: [
         
                     {
                       label:'5mm',
                       click: function() {
                         openPaletteWindow('5mm')
                       }
                     },
                   ]
                 },
         */
                {
                    type: 'separator'
                },
                { role: 'togglefullscreen' },
                ...(process.env.DEV == 'true') ?[{ role: 'toggledevtools' }] : [],
            ]
        },
        {
            label: 'Editar',
            submenu: [
                {
                    label: 'Deshacer',
                    //  accelerator: process.platform == 'darwin' ? 'cmd + z' : 'ctrl + z',
                    click: function () {
                        mainWindow.webContents.send('edit', 'undo')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Rotar a la derecha',
                    click: function () {
                        mainWindow.webContents.send('edit', 'rotateR')
                    }
                },

                {
                    label: 'Rotar a la izquierda',
                    click: function () {
                        mainWindow.webContents.send('edit', 'rotateL')
                    }
                },

                {
                    label: 'Invertir horizontalmente',
                    click: function () {
                        mainWindow.webContents.send('edit', 'flipH')
                    }
                },

                {
                    label: 'Invertir verticalmente',
                    click: function () {
                        mainWindow.webContents.send('edit', 'flipV')
                    }
                },

                {
                    label: 'Recortar',
                    //  accelerator: process.platform == 'darwin' ? 'cmd + z' : 'ctrl + z',
                    click: function () {
                        mainWindow.webContents.send('edit', 'crop')
                    },
                   // enabled: false,
                },

                {
                    type: 'separator'
                },
                {
                    label: 'Limpiar',
                    click: function () {
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

                        mainWindow.webContents.send('edit','clear')

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
                    click: function () {
                        shell.openExternal("https://blasterchile.cl");
                    }
                },
                {
                    label: 'Visitar Instagram de Blaster Chile',
                    click: function () {
                        shell.openExternal("https://www.instagram.com/blaster.chile");
                    }
                },
                {
                    label: 'Discord de la Comunidad',
                    click: function () {
                        shell.openExternal("https://discord.gg/FpSxx6FZkF");
                    }
                },
                {
                    label: 'Reportar un bug',
                    click: function () {
                        shell.openExternal("");
                    }
                },,
                {
                    label: 'Realizar una sugerencia',
                    click: function () {
                        shell.openExternal("");
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
                    click: function () {
                        openControls()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Acerca de',
                    click: function () {
                        openAboutUs()
                    },
                },
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(mainMenu)

    Menu.setApplicationMenu(menu)


    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
}


function showOpenImageDialog() {
    electron.dialog.showOpenDialog({
        filters: [
            { name: 'Imágenes', extensions: ["png", "jpg", "jpeg", 'bmp', 'gif', 'svg'] },
        ],
        properties: ['openFile']
    }).then(result => {

        if (result.canceled) return;

        var size = sizeOf(result.filePaths[0]);

        /* if (size.width > 256 || size.height > ) {
           
           electron.dialog.showMessageBox(mainWindow, {
             title: 'Tamaño excedido',
             message: 'Imagen muy grande',
             detail: 'El maximo tamaño posible es 256x256',
             type: 'error',
           }, (response) => {
     
     
     
            })
     
         }else{*/

        mainWindow.loadFile('client/cropper.html')


        mainWindow.webContents.once('did-finish-load', () => {

            mainWindow.webContents.send('loadPreview', result.filePaths[0])

        })

        // }

    }).catch(err => {
        console.log(err)
    })
}

ipcMain.on('exportImageData', (event, data) => {
    console.log('Exporting image data',data)

    mainWindow.loadFile('client/index.html')

    mainWindow.webContents.once('did-finish-load', () => {
        console.log('createFromImage called from main process')

        mainWindow.webContents.send('createFromImage', data ) 

    })

})

ipcMain.on('loadFromMenu', (event) => {
    console.log('Loading image from menu')
    showOpenImageDialog()
})


function newBead() {
    if(getPage() != 'index.html'){
        mainWindow.loadFile('client/index.html')

        mainWindow.webContents.once('did-finish-load', () => {
    
            mainWindow.webContents.send('newBead')
    
        })
    }else{
        mainWindow.webContents.send('newBead')
    }
}

function saveBead() {
    mainWindow.webContents.send('readBeads')
}

function save() {
    mainWindow.webContents.send('save')
}


function openBead() {

    if(getPage() != 'index.html'){
        mainWindow.loadFile('client/index.html')

        mainWindow.webContents.once('did-finish-load', () => {
    
            openFile()
    
        })
    }else{
        openFile()
    }
}


// retransmit it to workerWindow
ipcMain.on("printPDF", (event, content) => {
    workerWindow.webContents.send("printPDF", content);
});


ipcMain.on('getBeads', (event, data) => {

    let options = {
        title: "Guardar Plantilla - Blaster Maker",
        defaultPath: "C:\\" + data.name,
        buttonLabel: "Guardar Plantilla",
        filters: [
            { name: 'Blaster Maker', extensions: ['bm'] },
        ]
    }


    var path = electron.dialog.showSaveDialogSync(mainWindow, options)

    if (typeof path === 'undefined') return;

    fs.writeFile(path, JSON.stringify(data), function (err) {
        // file saved or err
        //todo:mandar notificacion
        mainWindow.webContents.send('saved', path)
    });
})


ipcMain.on('saveFile', (event, data, path) => {

    if (typeof path === 'undefined') return;

    fs.writeFile(path, JSON.stringify(data), function (err) {
        // file saved or err
        console.log('saved on path', path)
    });
})



ipcMain.on('setProgress', (event, value) => {

    mainWindow.setProgressBar(value)

})


ipcMain.on('closecropper', (event) => {

    mainWindow.loadFile('client/index.html')

})

ipcMain.on('saveImage', async function (event, img) {
    console.log('open save dialog..')
    const options = {
     title: 'Guardar como Imagen',
     filters: [
      { name: 'Images', extensions: ['png'] }
     ]
    }
    const result = await electron.dialog.showSaveDialog(options)

    if(!result.canceled){

        // strip off the data: url prefix to get just the base64-encoded bytes
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(data, 'base64');
        console.log(buf)

        console.log(result)

        fs.writeFile(result.filePath, buf, (err) => {

            let op = { buttons: ['Close'] };
            if(err) {
                op = _.extend(op, {
                    title: 'Error al guardar',
                    type: 'error',
                    message: err.name || 'Export Error',
                    detail: err.toString()
                });

                electron.dialog.showMessageBox(BrowserWindow.getFocusedWindow(), op);

            }
        });
    }
})

// TODO: test on mac/linux

// read the file and send data to the render process
ipcMain.on('get-file-data', function (event) {

    mainWindow.webContents.send('debug', process.env.DEV  == 'true')

    var data = null;
    console.log(process.argv)
    if (process.platform == 'win32' && process.argv.length >= 2 && process.argv[1] != '.' && !process.argv[1].includes('electron.exe')) {
        var openFilePath = process.argv[1];
        try {
            data = fs.readFileSync(openFilePath, 'utf-8');

        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other errors
        }
    }
    event.returnValue = data;

});

function getPage(){
    return mainWindow.webContents.getURL().split('/')[mainWindow.webContents.getURL().split('/').length -1]
}

function openFile(){
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

            mainWindow.webContents.send("loadBeads", data, result.filePaths[0]);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}



module.exports = { openMainWindow };