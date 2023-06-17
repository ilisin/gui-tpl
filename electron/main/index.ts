/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'node:path'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const rawLog = require('electron-log')

const logger = rawLog.scope('main')

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')

// const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1200,
    height: 800,
    frame: false,

    // icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,

      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(process.env.VITE_DEV_SERVER_URL)

    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)

    return { action: 'deny' }
  })

  // win.webContents.on('will-navigate', (event, url) => { }) #344
  console.log('start install vue-devtools')
  installExtension(VUEJS_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length)
    allWindows[0].focus()

  else
    createWindow()
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL)
    childWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${arg}`)

  else
    childWindow.loadFile(indexHtml, { hash: arg })
})

// Window control example arg: 'minimize' | 'maximize' | 'unmaximize' | 'close'
ipcMain.on('win-control', (_, arg) => {
  logger.debug('win-control', arg)
  if (win) {
    if (arg === 'maximize') {
      if (!win.isMaximized())
        win.maximize()
      else win.unmaximize()
    }
    else if (arg === 'close') {
      win.close()
    }
    else if (arg === 'minimize') {
      if (win.isMinimized())
        win.restore()
      else win.minimize()
    }
  }
})
