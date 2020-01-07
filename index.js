const SerialPort = require('serialport')
const ioHook = require('iohook')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('com3', {
		autoOpen: true,
		baudRate: 115200,
		dataBits: 8,
		stopBits: 1,
		parity: 'none'
	})
const parser = new Readline()
port.pipe(parser)

parser.on('data', console.log)

// shortcut f1
const id = ioHook.registerShortcut([59], (keys) => {
  console.log('Shortcut called with keys:', keys)
  port.write([0x16, 0x54, 0x0d]) //开始扫描
});


// port.write([0x16, 0x55, 0x0d]) //停止扫描


// Register and start hook
ioHook.start();

// Alternatively, pass true to start in DEBUG mode.
ioHook.start(true);