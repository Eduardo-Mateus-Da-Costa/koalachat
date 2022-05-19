'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'
import Print from '../public/testedeimport.js'
import ip from 'ip'
var config = require('../public/config.json');


const express = require('express');
const cors = require('cors');
import helmet from 'helmet';
const morgan = require('morgan');
const server = express();
server.use(cors({ origin: '*' }));
server.use(helmet());
server.use(express.json());
server.use(morgan('dev'));
server.post('/login', (res) => {
    res.json({ token: '123456' });
});
const wsServer = server.listen(3000, () => {
  console.log(`App Express is running!`);
})


const WebSocket = require("ws");
function onError(err) {
    console.error(`onError: ${err.message}`);
}
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(`recebido!`);
}
function onConnection(ws) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}
const wss = new WebSocket.Server({server:wsServer});
wss.on('connection', onConnection);





// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, stream: true } },
])

var win;

async function createWindow() {
  // Create the browser window.
    win = new BrowserWindow({
    show: false,
    height: 1080,
    width: 1920,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "/preload.js")
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    try{
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    }
    catch(e){
      console.log(e + "Erro no load url");
    }
   
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  //win.setMenu(null);
  win.maximize();
  win.show();
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
};

ipcMain.on("proBack", (event, args) => {
  if (args.funcao === "fechar")
    {
      fechar();
    }
  else if (args.funcao === "print")
    {
      console.log(ip.address());
      console.log("recebi");
      var print = new Print();
      win.webContents.send("doBack", print.getNome());
    }
  else if (args.funcao === "config")
    {
      win.webContents.send("doBack", config);
    }
});

function fechar() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  else{
    app.exit();
  }
}