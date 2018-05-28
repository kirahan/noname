import { app, BrowserWindow } from 'electron'
const {ipcMain} = require('electron')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        // useContentSize: true,
        width:360,
        height:840,
        title:'弹幕监控',
        frame: false,
        // transparent: true,
        autoHideMenuBar:true,
        alwaysOnTop:true,
        x:1500,
        y:50,
        webPreferences : {
            devTools : true
        },
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}


let onvifWindow
const onvifURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#onvif`
    : `file://${__dirname}/index.html#onvif`

function creatOnvifWindw() {
    /**
     * Initial window options
     */
    onvifWindow = new BrowserWindow({
        // useContentSize: true,
        width:360,
        height:380,
        title:'onvif',
        frame: false,
        resize : false,
        // transparent: true,
        autoHideMenuBar:true,
        alwaysOnTop:true,
        x:1100,
        y:50,
        webPreferences : {
            devTools : true
        },
        backgroundColor: '#2e2c29'
    })

    onvifWindow.loadURL(onvifURL)

    onvifWindow.on('closed', () => {
        mainWindow = null
    })
}



let controlWindow
const controlURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#control`
    : `file://${__dirname}/index.html#control`
function creatControlWindw() {
    /**
     * Initial window options
     */
    controlWindow = new BrowserWindow({
        // useContentSize: true,
        width:1280,
        height:720,
        title:'GAMEPAD',
        // frame: false,
        // fullscreen : true,
        // transparent: true,
        autoHideMenuBar:true,
        // alwaysOnTop:true,
        center : true,
        webPreferences : {
            // devTools : true
        },
        backgroundColor: '#00FF00'

    })

    controlWindow.loadURL(controlURL)

    controlWindow.on('closed', () => {
        mainWindow = null
    })
}



let backendWindow
const backendURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#backend`
    : `file://${__dirname}/index.html#backend`
function creatBackendWindw(){
    /**
     * Initial window options
     */
    backendWindow = new BrowserWindow({
        width:1280,
        height:720,
        title:'后台管理',
        // frame: false,
        // fullscreen : true,
        // transparent: true,
        autoHideMenuBar:true,
        // alwaysOnTop:true,
        center : true,
        webPreferences : {
            // devTools : true
        },
        // backgroundColor: '#00FF00'

    })

    backendWindow.loadURL(backendURL)

    backendWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', function () {
    createWindow()
    creatOnvifWindw()
    creatControlWindw()
    creatBackendWindw()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        // createWindow()
        creatOnvifWindw()
        // creatGamepadWindw()
    }
})

let renderOfControl

//显示记录面板
ipcMain.on('render-show-cubing-record', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-show-cubing-record', arg)
    })

//显示排名面板
ipcMain.on('render-show-cubing-rank', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-show-cubing-rank', arg)
})

//显示赛程面板
ipcMain.on('render-show-cubing-schedule', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-show-cubing-schedule', arg)
})

//显示预排名面板
ipcMain.on('render-show-cubing-prerank', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-show-cubing-prerank', arg)
})

//显示个人资料面板
ipcMain.on('render-show-cubing-personalinfo', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-show-cubing-personalinfo', arg)
})

//升级记录面板
ipcMain.on('render-update-cubing-record', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-update-cubing-record', arg)
})


// 握手从 control 界面 到主界面，然后把control界面的 render 对象保存下来
ipcMain.on('render-handshake-from-control', (event, arg) => {
    renderOfControl = event
    event.sender.send('main-handshake-to-control', arg)
})

//live面板
ipcMain.on('render-show-cubing-live', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-show-cubing-live', arg)
})


//live面板
ipcMain.on('render-change-cubing-live-setting', (event, arg) => {
    console.log('[main]',arg) // prints "ping"
    renderOfControl.sender.send('main-change-cubing-live-setting', arg)
})


