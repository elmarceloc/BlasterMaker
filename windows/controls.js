const electron = require('electron')

const BrowserWindow = electron.BrowserWindow

function openControls() {
    ctrlsWindow = new BrowserWindow({
        width: 800,
        height: 520,
        parent: mainWindow,
        center: true,
        resizable: false,
        // movable:false,
        alwaysOnTop: true,
        fullscreenable: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: __dirname + '../../client/img/blaster.ico',
        /* frame :false*/
    });
    ctrlsWindow.show();
    ctrlsWindow.setMenu(null)
    ctrlsWindow.loadFile('client/controls.html')

    ctrlsWindow.setAlwaysOnTop(true);

}

module.exports =  { openControls };