const electron = require('electron')

const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

function openPaletteWindow(palette) {
    paletteWindow = new BrowserWindow({
        //  resizable: false,
        width: 470,
        height: 860,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,

        },
        icon: __dirname + '../../client/img/blaster.ico',
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

module.exports = { openPaletteWindow };