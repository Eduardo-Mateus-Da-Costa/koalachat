'use strict'

// Imports
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import ip from 'ip'
import helmet from 'helmet';

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const WebSocket = require("ws");

const isDevelopment = process.env.NODE_ENV !== 'production'
const server = express();

// Configuração do servidor
server.use(cors({ origin: '*' }));
server.use(helmet());
server.use(express.json());
server.use(morgan('dev'));
server.post('/login', (res) => {
    res.json({ token: '123456' });
});
const wsServer = tryOpen();
var globalPort = 3000;

function tryOpen() {
    var retry = true;
    while (retry) {
        try {
            var tryServer = server.listen(globalPort, () => {})
            retry = false;
            return tryServer;
        } catch (e) {
            globalPort++;
        }
    }
}

const wss = new WebSocket.Server({server:wsServer});
wss.on('connection', onServerConnection);


var clientSockect;


// Schema de arquivos do vuejs
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, stream: true } },
])


// Decodificador
function decode(data) {
  var json = JSON.parse(new TextDecoder("utf-8").decode(data));
  return json;
}


// Inicialização da janela do electron
var win;

async function createWindow() {
    win = new BrowserWindow({
    show: false,
    height: 1080,
    width: 1920,
    icon: process.env.WEBPACK_DEV_SERVER_URL ? path.join(__dirname, './public/koala_mac.png') : path.join(__dirname, '/koala_mac.png'),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "/preload.js")
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    try{
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    }
    catch(e){
      console.log(e + "Erro no load da url");
    }

  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  //win.setMenu(null);
  win.maximize();
  win.show();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

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
}


// Dados do servidor
var serverData = {
  owner: null,
  name: null,
  port: globalPort,
  ip: null,
  password: null,
  maxusers: null,
  users: [],
  status: false,
  messages: [],
};

// OnError Do Servidor
function onError(ws, err) {
  console.error(`onError: ${err.message}`);
  var data ={
    error: true,
    errorMessage: err.message
  }
  ws.send(JSON.stringify(data));
}

// OnError Do Cliente
function clientOnError(err) {
  var data = {
    error: true,
    funcao: "GeneralError",
    errorMessage: err.message
  }
  win.webContents.send("doBack", data);
  console.log(err);
}

// OnMessage Do Cliente
function clientOnMessage(ws, data) {
  win.webContents.send("doBack", decode(data));
}

// Conexão do servidor
function onServerConnection(ws) {
  ws.on('message', data => serverOnMessage(ws, data));
  ws.on('error', error => onError(ws, error));
}

// OnMessage Do Servidor (Router)
function serverOnMessage(ws, data) {
  var response;
  if (serverData.status !== false){
    data = decode(data);
    if (data.funcao === "join") {
      response = confirmJoin(data);
    }
    if (data.funcao === "sendMessage") {
      response = confirmSendMessage(data);
    }
    if (data.funcao === "getMessages") {
      response = getMessages(data);
    }
    if (data.funcao === "logout"){
      response = confirmLogout(data);
    }
    if (data.funcao === "getUsers"){
      response = getUsers(data);
    }
    if (data.funcao === "banUser") {
      response = banUser(data);
    }
    ws.send(JSON.stringify(response));
  }
  else{
    response = {
      error: true,
      errorMessage: "Servidor offline"
    }
    ws.send(JSON.stringify(response));
  }
}


// Busca de usuários
function findUser(userData) {
  var user;
  try{
    user = serverData.users.find(user => user.name === userData.name);
  }catch(e){
    user = null;
  }
  return user;
}


// Confirmação de entrada na sala
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
    if (serverData.name !== data.roomName) {
      throw new Error("Nome da sala não confere");
    }
    if (serverData.password !== data.password) {
      throw new Error("Senha não confere");
    }
    if (serverData.users.length >= serverData.maxusers && data.mode !== "join") {
      throw new Error("Sala cheia");
    }
    var index;
    if (data.is_owner === true){
      if (serverData.owner.online === true) {
        throw new Error("Dono da sala já está online!");
      }
      else if(serverData.owner.password !== data.user_password){
        throw new Error("Senha de administrador não confere!");
      }
      serverData.owner.online = true;
      index = serverData.users.findIndex(user => user.name === data.name && user.password === data.user_password);
      serverData.users[index].online = true;
    }
    else{
      var theuser;
      if (data.mode === "join") {
        theuser = findUser(data);
        if (theuser == null) {
          throw new Error("Usuário não encontrado");
        }
        else if (theuser.online === true) {
          throw new Error("Usuário já está online");
        }
        else if (theuser.password !== data.user_password) {
          throw new Error("Senha não confere");
        }
        index = serverData.users.findIndex(user => user.name === theuser.name && user.password === theuser.password);
        serverData.users[index].online = true;
      }
      else if (data.mode === "create") {
        theuser = findUser(data);
        if (theuser != null) {
          throw new Error("Usuário já existe");
        }
        theuser = {name : data.name, password : data.user_password, online : true};
        serverData.users.push(theuser);
      }
    }
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


// Confirmação de envio de mensagem
function confirmSendMessage(data){
  var response = {
    funcao: "confirmSendMessage",
    error: true,
    message: null,
    errorMessage: "Erro inesperado",
  }
  try{
    if (serverData.name !== data.roomName) {
      throw new Error("Nome da sala não confere");
    }
    if (findUser(data) == null){
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


// Busca de mensagens
function getMessages(data){
  var response = {
    funcao: "getMessages",
    error: true,
    errorMessage: "Erro inesperado",
    messages: [],
    users_count: null,
    owner: false,
  }
  try{
    if (serverData.name !== data.roomName) {
      throw new Error("Nome da sala não confere");
    }
    if (findUser(data) == null){
      throw new Error("Usuário não existe");
    }
    response.messages = serverData.messages;
    response.error = false;
    response.errorMessage = "";
    response.users_count = serverData.users.length;
    response.owner = serverData.owner.name === data.name;
  }catch(e){
    response.error = true;
    response.errorMessage = e.message;
  }
  return response;
}


// Confirmação de saída da sala
function confirmLogout(data){
    var response = {
      funcao: "confirmLogout",
      error: true,
      errorMessage: "Erro inesperado",
    }
    try{
        if (serverData.name !== data.roomName) {
            throw new Error("Nome da sala não confere");
        }
        var theUser = findUser(data);
        if (theUser == null){
            throw new Error("Usuário não existe");
        }
        var index = serverData.users.findIndex(user => user.name === theUser.name && user.password === theUser.password);
        serverData.users[index].online = false;
        if (serverData.owner.name === data.name){
            serverData.owner.online = false;
        }
        response.error = false;
        response.errorMessage = "";
    }catch(e){
        response.error = true;
        response.errorMessage = e.message;
    }
    return response;
}


// Busca de usuários da sala
function getUsers(data){
    var response = {
      funcao: "getUsers",
      error: true,
      errorMessage: "Erro inesperado",
      users: [],
      owner: false,
    }
    try{
        if (serverData.name !== data.roomName) {
            throw new Error("Nome da sala não confere");
        }
        if (findUser(data) == null){
            throw new Error("Usuário não existe");
        }
        response.users = serverData.users;
        response.error = false;
        response.errorMessage = "";
        response.owner = serverData.owner.name === data.name;
    }
    catch(e){
        response.error = true;
        response.errorMessage = e.message;
    }
    return response;
}


// Remove usuário da sala
function banUser(data){
    var response = {
      funcao: "banUser",
      error: true,
      errorMessage: "Erro inesperado",
    };
    try{
        if (serverData.name !== data.roomName) {
            throw new Error("Nome da sala não confere");
        }
        if (findUser(data) == null){
            throw new Error("Usuário não existe");
        }
        var theUser = findUser(data);
        if (theUser.name === serverData.owner.name){
            throw new Error("Não é possível banir o dono da sala");
        }
        var index = serverData.users.findIndex(user => user.name === theUser.name && user.password === theUser.password);
        serverData.users.splice(index, 1);
        response.error = false;
        response.errorMessage = "";
    }
    catch(e){
        response.error = true;
        response.errorMessage = e.message;
    }
    return response;
}

// Envio de informações do cliente para o servidor
function enviar(data) {
  if (clientSockect.readyState === WebSocket.OPEN) {
    try{
      clientSockect.send(JSON.stringify(data));
    }catch(e){
      conectar(data);
    }
  }
  else{
    conectar(data);
  }
}


// Cria o servidor
function createServer(data) {
  serverData.ip = ip.address("public", "ipv4");
  serverData.name = data.roomName;
  serverData.password = data.password;
  serverData.maxusers = data.maxUsers;
  serverData.owner = {name: data.name, password: data.user_password, online: false};
  serverData.status = true;
  serverData.messages = [];
  serverData.users = [serverData.owner];
  win.webContents.send("doBack", {funcao: "serverConfig", error: false, errorMessage: "", serverIp: serverData.ip + ":" + serverData.port, owner_password: serverData.owner.password});
}


// Cria o socket do cliente e tenta conectar no servidor
function conectar(data) {
  try {
    clientSockect = new WebSocket(data.roomIp);
    clientSockect.on('message', data => clientOnMessage(clientSockect, data));
    clientSockect.on('error', error => clientOnError(error));
    clientSockect.on("open", () => enviar(data));
  }
  catch (e) {
    win.webContents.send("doBack",  {funcao: "GeneralError", error: true, errorMessage: "Erro de conexão", serverIp: "", owner_password: ""});
  }
}



// Tenta ler as configurações da última sala conectada, (linux requer permissão de leitura)
function readConfig(){
  var data;
  try{
    data = fs.readFileSync(path.join(__dirname, "config.json"), "utf8");
    data = JSON.parse(data);
    return data;
  }
  catch(e){
    try{
      data = fs.readFileSync("./public/config.json", "utf8");
      data = JSON.parse(data);
      return data;
    }
    catch(e){
      throw new Error("Arquivo de configuração não encontrado");
    }
  }
}


// Salva as configurações da última sala conectada (linux requer permissão de escrita)
function writeConfig(data){
  var config = {
    roomName: data.roomName,
    roomPassword: data.roomPassword,
    name: data.name,
    roomIp: data.roomIp,
  }
  try{
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config), "utf8");
  }
  catch(e){
    win.webContents.send("doBack", {funcao: "GeneralError", error: true, write:true, errorMessage: e.message});
    try{
      fs.writeFileSync("./public/config.json", JSON.stringify(config), "utf8");
    }catch(e){
      win.webContents.send("doBack", {funcao: "GeneralError", error: true, write:true, errorMessage: e.message});
      throw new Error("Erro ao salvar arquivo de configuração");
    }
  }
}


// Router de conexão entre o frontend e o backend
ipcMain.on("proBack", (event, args) => {
  if (args.data.funcao === "fechar")
    {
      fechar(args.data);
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
        response.config = readConfig();
      }
      catch(e){
        response.error = true;
        response.errorMessage = e.message;
      }
      win.webContents.send("doBack", response);
    }
  else if (args.data.funcao === "join"){
    try{
      writeConfig(args.data);
    }catch(e){
      win.webContents.send("doBack", {funcao: "writeConfig", error: true, errorMessage: e.message});
    }
    conectar(args.data);
  }
  else if (args.data.funcao === "sendMessage"){
    enviar(args.data);
  }
  else if (args.data.funcao === "getMessages"){
    enviar(args.data);
  }
  else if (args.data.funcao === "createServer"){
    try{
      createServer(args.data);
    }catch(e){
      win.webContents.send("doBack", {funcao: "createServer", error: true, errorMessage: e.message, serverIp: "", owner_password: ""});
    }
  }
  else if (args.data.funcao === "logout") {
    enviar(args.data);
  }
  else if (args.data.funcao === "getUsers") {
    enviar(args.data);
  }
  else if (args.data.funcao === "banUser") {
    enviar(args.data);
  }
});


// Fecha o electron
function fechar(data) {
  if (data.online === true){
    try{
      enviar(data.exit);
      clientSockect.close();
    }catch (e) {
      console.log(e);
    }
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
  else{
    app.exit();
  }
}