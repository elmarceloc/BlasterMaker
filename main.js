require('dotenv').config()

const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const {openMainWindow} = require("./windows/main.js");

// hot reload for debugging purposes
if (process.env.dev) {
  require('electron-reload')(__dirname,{
    electron: require(`${__dirname}/node_modules/electron`)
  })
}

app.whenReady().then(() => {
  openMainWindow()
  

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) openMainWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})