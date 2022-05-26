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
})

var serverData = {
  rooms: [
    {
      name: "Sala 1",
      id: "1",
      port: "3000",
      ip: "duducdi.com",
      password: null,
      maxusers: 50,
      users: [
        {
          name: "teste",
          id: "1",
        }
      ],
      status: true,
      messages: [
        {
          text: "teste",
          id: "1",
          user: {
            name: "teste",
            id: "1",
          },
          message_date: "2020-01-01 00:00:00"
        }
      ]
    },
  ],
};
  

const WebSocket = require("ws");

var clientSockect;


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


function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

function clientOnError(err) {
  // win.webContents.send("doBack", { error: true });
  // var data = {
  //   funcao: funcao,
  //   error: true
  // }
  // win.webContents.send("doBack", data);
  console.log(err);
}

function clientOnMessage(ws, data) {
  win.webContents.send("doBack", JSON.parse(String.fromCharCode(...Buffer.from(data).toJSON().data)));
}

function serverOnMessage(ws, data) {
  console.log(data.toString());
  serverData.rooms.forEach(room => {
    try{
      if (room.id == data.room_id) {
        room.messages.push(data);
        var response = {
          funcao: "serverOnMessage",
          error: false,
        }
        ws.send(JSON.stringify(response));
      }
    }catch(e){
      var response = {
        funcao: "serverOnMessage",
        error: true,
      }
      ws.send(JSON.stringify(response));
    }
  });
  ws.send(JSON.stringify(data.toString()));
}

function onServerConnection(ws) {
  ws.on('message', data => serverOnMessage(ws, data));
  ws.on('error', error => onError(ws, error));
  console.log(`onConnection`);
}

function onClientConnection(ws) {
  ws.on('message', data => clientOnMessage(ws, data));
  ws.on('error', error => clientOnError(ws, error));
  console.log(`onClientConnection`);
}

const wss = new WebSocket.Server({server:wsServer});
wss.on('connection', onServerConnection);


function enviar(url, data) {
  if (clientSockect.readyState === WebSocket.OPEN) {
    clientSockect.send(JSON.stringify(data));
    console.log("enviado");
  }
  else{
    conectar(url, data);
    // colocar window.webContents.send("doBack", { error: true });
    console.log("Não conectado");
  }
}

function conectar(url, data) {
  clientSockect = new WebSocket(url);
  clientSockect.on('connection', onClientConnection);
  clientSockect.on('message', data => clientOnMessage(clientSockect, data));
  console.log("conectando");
  clientSockect.on("open", () => enviar(url, data));
}

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
    else if (args.funcao === "sendMessage"){
      console.log(args.data.text);
      if(typeof clientSockect === 'undefined'){
        conectar(args.data.url, args.data);
      }
      else{
        enviar(args.data.url, args.data);
      }
    }
    else if (args.funcao === "connectServer"){
      clientSockect = new WebSocket(args.url);
      clientSockect.on('connection', onClientConnection);
      clientSockect.on("open", () => clientSockect.send(JSON.stringify(args.data)));
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