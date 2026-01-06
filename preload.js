const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    openPopup: () => ipcRenderer.send("open-popup"),
    closePopup: () => ipcRenderer.send("close-popup")
});
