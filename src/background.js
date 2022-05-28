'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'
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

const WebSocket = require("ws");
const wss = new WebSocket.Server({server:wsServer});
wss.on('connection', onServerConnection);

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



var serverData = {
  name: "Sala 1",
  port: "3000",
  ip: "duducdi.com",
  password: null,
  maxusers: 50,
  users: [
    {
      name: "teste",
    }
  ],
  status: true,
  messages: [
    {
      text: "teste",
      user_name: "teste",
      message_date: "2020-01-01 00:00:00"
    }
  ],
};


function onError(ws, err) {
  console.error(`onError: ${err.message}`);
  var data ={
    error: true,
    errorMessage: err.message
  }
  ws.send(JSON.stringify(data));
}

function clientOnError(err) {
  var data = {
    error: true,
    errorMessage: err.message
  }
  win.webContents.send("doBack", data);
  console.log(err);
}

function decode(data) {
  return JSON.parse(String.fromCharCode(...Buffer.from(data).toJSON().data));
}

function clientOnMessage(ws, data) {
  win.webContents.send("doBack", decode(data));
}


function findUser(user_name) {
  var user = null;
  try{
    user = serverData.users.find(user => user.name == user_name);
  }catch(e){
    user = null;
  }
  return user;
}


function confirmJoin(data) {
  var response = {
    funcao: "confirmJoin",
    error: true,
    roomName: null,
    name: null,
    roomIp: null,
    errorMessage: "Erro inesperado",
  }
  try{
    if (serverData.name != data.roomName) {
      throw new Error("Nome da sala não confere");
    }
    if (serverData.password != data.password) {
      throw new Error("Senha não confere");
    }
    if (serverData.users.length >= serverData.maxusers) {
      throw new Error("Sala cheia");
    }
    serverData.users.forEach(user => {
      if (user.name == data.name) {
        throw new Error("Usuário já existe");
      }
    });
    var newUser = {name : data.name};
    serverData.users.push(newUser);
    response.error = false;
    response.errorMessage = "";
    response.roomName = serverData.name;
    response.name = data.name;
    response.roomIp = serverData.ip + ":" + serverData.port;
  }catch(e){
    response.error = true;
    response.errorMessage = e.message;
  }
  return response;
}

function confirmSendMessage(data){
  var response = {
    funcao: "confirmSendMessage",
    error: true,
    message: null,
    errorMessage: "Erro inesperado",
  }
  try{
    if (serverData.name != data.roomName) {
      throw new Error("Nome da sala não confere");
    }
    if (findUser(data.name) == null){
      throw new Error("Usuário não existe");
    }
    serverData.messages.push(data.message);
    response.error = false;
    response.message = data.message;
    response.errorMessage = "";
  }catch(e){
    response.error = true;
    response.errorMessage = e.message;
  }
  return response;
}


function getMessages(data){
  var response = {
    funcao: "getMessages",
    error: true,
    errorMessage: "Erro inesperado",
    messages: []
  }
  try{
    if (serverData.name != data.roomName) {
      throw new Error("Nome da sala não confere");
    }
    if (findUser(data.name) == null){
      throw new Error("Usuário não existe");
    }
    response.messages = serverData.messages;
    response.error = false;
    response.errorMessage = "";
  }catch(e){
    response.error = true;
    response.errorMessage = e.message;
  }
  return response;
}



function serverOnMessage(ws, data) {
  if (serverData.status != false){
    var data = decode(data);
    var response;
    if (data.funcao == "join") {
      response = confirmJoin(data);
    }
    if (data.funcao == "sendMessage") {
      response = confirmSendMessage(data);
    }
    if (data.funcao == "getMessages") {
      response = getMessages(data);
    }
    ws.send(JSON.stringify(response));
  }
  else{
    var response = {
      error: true,
      errorMessage: "Servidor offline"
    }
    ws.send(JSON.stringify(response));
  }
}

function onServerConnection(ws) {
  ws.on('message', data => serverOnMessage(ws, data));
  ws.on('error', error => onError(ws, error));
}


function enviar(data) {
  if (clientSockect.readyState === WebSocket.OPEN) {
    clientSockect.send(JSON.stringify(data));
  }
  else{
    conectar(data);
  }
}

function createServer(data) {
  serverData.ip = ip.address("public", "ipv4");
  serverData.name = data.roomName;
  serverData.password = data.password;
  serverData.maxusers = data.maxUsers;
  serverData.status = true;
  serverData.messages = [];
  serverData.users = [];
  win.webContents.send("doBack", {funcao: "serverConfig", error: false, errorMessage: "", serverIp: serverData.ip + ":" + serverData.port});
}

function conectar(data) {
  clientSockect = new WebSocket(data.roomIp);
  clientSockect.on('message', data => clientOnMessage(clientSockect, data));
  clientSockect.on('error', error => clientOnError(error));
  clientSockect.on("open", () => enviar(data));
}

ipcMain.on("proBack", (event, args) => {
  if (args.data.funcao === "fechar")
    {
      fechar();
    }
  else if (args.data.funcao === "config")
    {
      var response = {
        funcao: "config",
        error: false,
        errorMessage: "",
        config: null
      };
      try{
        response.config = config;
      }
      catch(e){
        response.error = true;
        response.errorMessage = "Erro ao ler configurações";
      }
      win.webContents.send("doBack", response);
    }
  else if (args.data.funcao === "join"){
    conectar(args.data);
  }
  else if (args.data.funcao === "sendMessage"){
    enviar(args.data);
  }
  else if (args.data.funcao === "getMessages"){
    enviar(args.data);
  }
  else if (args.data.funcao === "createServer"){
    createServer(args.data);
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