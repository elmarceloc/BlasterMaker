const electron = require('electron')

const BrowserWindow = electron.BrowserWindow

function openAboutUs() {
    aboutus = new BrowserWindow({
        width: 640,
        height: 520,
        parent: mainWindow,
        center: true,
        resizable: false,
        movable: true,
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
    aboutus.show();
    aboutus.setMenu(null)
    aboutus.loadFile('client/aboutus.html')

    aboutus.setAlwaysOnTop(true);

}


module.exports = { openAboutUs };