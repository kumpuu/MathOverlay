const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('cbridge', {
  // node: () => process.versions.node,
  // chrome: () => process.versions.chrome,
  // electron: () => process.versions.electron
  async copy_image_to_clipboard(base64_data){return await ipcRenderer.invoke('copy_image_to_clipboard', base64_data);},
  async confirm(text){return await ipcRenderer.invoke('confirm', text);}
})