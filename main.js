const { app, BrowserWindow, ipcMain, clipboard, nativeImage, dialog } = require('electron/main')
const windowStateKeeper = require('electron-window-state');
const path = require('node:path')

let main_win;

const createWindow = () => {
  let main_win_state = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 410
  });

  main_win = new BrowserWindow({
    icon:'./icons/icon.png',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    'x': main_win_state.x,
    'y': main_win_state.y,
    'width': main_win_state.width,
    'height': main_win_state.height
  })

  main_win_state.manage(main_win);
  main_win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle("copy_image_to_clipboard", async (event, base64_data) => 
{
  try {
    // Base64-Bild in ein nativeImage-Objekt umwandeln
    const image = nativeImage.createFromDataURL(base64_data);

    clipboard.writeImage(image);
  } catch (error) {
    return error;
  }
})

ipcMain.handle("confirm", async (event, text) => 
  {
    var options = {
      type: 'question',
      buttons: ["Ok", "Cancel"],
      defaultId: 0,
      cancelId:1,
      detail: text,
      message: ""
    }
    return (dialog.showMessageBoxSync(main_win, options) == 0);
  })