import { app, BrowserWindow, dialog, ipcMain } from "electron";

// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')

// const adapter = new FileSync('db.json')
// const db = low(adapter)

// // Set some defaults
// db.defaults({ posts: [], user: {} })
//     .write()

// // Add a post
// db.get('posts')
//     .push({ id: 1, title: 'lowdb is awesome' })
//     .write()

// let aa = db.get('posts');
// console.log(aa);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
    global.__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
    process.env.NODE_ENV === "development" ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 600,
        useContentSize: true,
        width: 800
    });

    mainWindow.loadURL(winURL);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    var promptResponse;
    ipcMain.on("prompt", function(eventRet, arg) {
        console.log("----ipcMain prompt envent-----");

        promptResponse = null;
        var promptWindow = new BrowserWindow({
            width: 500,
            height: 100,
            show: false,
            resizable: false,
            movable: true,
            alwaysOnTop: true,
            frame: false
        });
        arg.val = arg.val || "";
        const promptHtml =
            `<script>function myFunction(event) { 
                console.log("===key===",event);  
                if(event.key == "Enter"){
                    require('electron').ipcRenderer.send('prompt-response', document.getElementById('val').value);
                    window.close()        
                }
            } </script>` +
            '<label for="val">' +
            arg.title +
            '</label>\
    <input onkeyup="myFunction(event)" id="val" value="' +
            arg.val +
            "\" autofocus />\
    <button onclick=\"require('electron').ipcRenderer.send('prompt-response', document.getElementById('val').value);window.close()\">Ok</button>\
    <button onclick=\"window.close()\">Cancel</button>\
    <style>body {font-family: sans-serif;} button {float:right; margin-left: 10px;} label,input {margin-bottom: 10px; width: 100%; display:block;}</style>";
        promptWindow.loadURL("data:text/html," + promptHtml);
        promptWindow.show();
        promptWindow.on("closed", function() {
            eventRet.returnValue = promptResponse;
            promptWindow = null;
        });
    });
    ipcMain.on("prompt-response", function(event, arg) {
        if (arg === "") {
            arg = null;
        }
        promptResponse = arg;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})

*/