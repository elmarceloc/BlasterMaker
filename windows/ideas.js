const electron = require('electron')

const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

function openIdeasWindow() {
  ideasWindow = new BrowserWindow({
    //  resizable: false,
    width: 932,
    height: 780,
    minWidth: 400,
    minHeight: 400,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: true

    },
    icon: __dirname + '../../client/img/blaster.ico',
    parent: mainWindow
  })

  ideasWindow.setBackgroundColor('#222222')

  //ideasWindow.setAlwaysOnTop(true);

  const tsrMenuBar = Menu.buildFromTemplate(null); // ??


  ideasWindow.setMenu(tsrMenuBar);


  ideasWindow.loadFile('client/ideas.html')

}

module.exports = { openIdeasWindow };