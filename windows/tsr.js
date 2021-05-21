const electron = require('electron')
const ipc = require('electron').ipcMain;

const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

const cheerio = require('cheerio');
const request = require('request');

function openTSRWindow (parent) {

    tsrWindow = new BrowserWindow({
    //  resizable: false,
      width: 932,
      height: 780,
      minWidth:400,
      minHeight:400,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        webviewTag: true
  
      },
      icon: __dirname + '../../client/img/blaster.ico',
      parent: parent
    })
  
    tsrWindow.setBackgroundColor('#222222')
  
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
      
    tsrWindow.loadFile('client/tsr.html')
  
  }

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
      console.log(img_url)
    })

  }
)

module.exports =  { openTSRWindow };