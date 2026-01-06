const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 640,
        height: 480,
        autoHideMenuBar: true, //hide the menu bar
        icon: path.join(__dirname, "src/images/gameIcon.png"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    win.setResizable(false); //disable resize of window
    win.setMovable(false); //disable from moving the window
    win.loadFile("./src/index.html");

    win.openDevTools();
}

app.whenReady().then(createWindow) //creates window when electron is ready

let popup = null;
ipcMain.on("open-popup", () => {
    popup = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,        // No title bar
        alwaysOnTop: true,   // Appears above your main window
        parent: BrowserWindow.getFocusedWindow(),
        modal: false,        // Don't block main window
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    popup.loadFile("./src/popup.html");
});

ipcMain.on("close-popup", () => {
    if (popup) {popup.close()}
});