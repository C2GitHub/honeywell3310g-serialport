const ioHook = require('iohook')
const ScanPort = require('./scanSerialport.js')


// shortcut f1
const id = ioHook.registerShortcut([59], async (keys) => {
    console.log('scan start')
    const data = await ScanPort.getPortData()
    console.log(data)
})

// Register and start hook
ioHook.start();

// Alternatively, pass true to start in DEBUG mode.
ioHook.start(true);