require('dotenv').config()

const electron = require('electron')

const BrowserWindow = electron.BrowserWindow

const Menu = electron.Menu

const sizeOf = require('image-size');

const ipc = require('electron').ipcMain;

const fs = require('fs')

const { openAboutUs } = require("./aboutus");
const { openControls } = require("./controls");
const { openTSRWindow } = require("./tsr");
const { openIdeasWindow } = require("./ideas");

function openMainWindow() {
    // Create the browser window.
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

    workerWindow.loadURL("file://" + __dirname + "/worker.html");

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
        
                       enabled:false
                      }
                    },
                  ]
                },*/
                {
                    label: 'Reglas',
                    click: function () {
                        mainWindow.webContents.send('showGrid')
                    }
                },
                {
                    // TODO: rename
                    label: 'Colores',
                    click: function () {
                        mainWindow.webContents.send('showIds')
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
                        mainWindow.webContents.send('action', 'undo')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Rotar a la derecha',
                    click: function () {
                        mainWindow.webContents.send('action', 'rotateR')
                    }
                },

                {
                    label: 'Rotar a la izquierda',
                    click: function () {
                        mainWindow.webContents.send('action', 'rotateL')
                    }
                },

                {
                    label: 'Invertir horizontalmente',
                    click: function () {
                        mainWindow.webContents.send('action', 'flipH')
                    }
                },

                {
                    label: 'Invertir verticalmente',
                    click: function () {
                        mainWindow.webContents.send('action', 'flipV')
                    }
                },

                {
                    label: 'Recortar',
                    //  accelerator: process.platform == 'darwin' ? 'cmd + z' : 'ctrl + z',
                    click: function () {
                        mainWindow.webContents.send('action', 'crop')
                    },
                    enabled: false,
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
                    click: function () {
                        open("https://blasterchile.cl");
                    }
                },
                {
                    label: 'Visitar Instagram de Blaster Chile',
                    click: function () {
                        open("https://www.instagram.com/blaster.chile");
                    }
                },
                {
                    label: 'Discord de la Comunidad',
                    click: function () {
                        open("https://discord.gg/FpSxx6FZkF");
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

ipc.on('exportImageData', (event, data) => {
    console.log('Exporting image data',data)

    mainWindow.loadFile('client/index.html')

    mainWindow.webContents.once('did-finish-load', () => {
        console.log('createFromImage called from main process')

        mainWindow.webContents.send('createFromImage', data ) 

    })

})

ipc.on('loadFromMenu', (event) => {
    console.log('Loading image from menu')
    showOpenImageDialog()
})


function newBead() {
    mainWindow.webContents.send('newBead')
}

function saveBead() {
    mainWindow.webContents.send('readBeads')
}

function save() {
    mainWindow.webContents.send('save')
}


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

                mainWindow.webContents.send("loadBeads", data, result.filePaths[0]);
            });
        })
        .catch((err) => {
            console.log(err);
        });
}


// retransmit it to workerWindow
ipc.on("printPDF", (event, content) => {
    workerWindow.webContents.send("printPDF", content);
});


ipc.on('getBeads', (event, data) => {

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


ipc.on('saveFile', (event, data, path) => {

    if (typeof path === 'undefined') return;

    fs.writeFile(path, JSON.stringify(data), function (err) {
        // file saved or err
        console.log('saved on path', path)
    });
})



ipc.on('setProgress', (event, value) => {

    mainWindow.setProgressBar(value)

})


ipc.on('closecropper', (event) => {

    mainWindow.loadFile('client/index.html')

})

// TODO: test on mac/linux

// read the file and send data to the render process
ipc.on('get-file-data', function (event) {

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

module.exports = { openMainWindow };