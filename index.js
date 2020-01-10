const SerialPort = require('serialport')
const ioHook = require('iohook')
const Readline = SerialPort.parsers.Readline
const port6 = new SerialPort('com6', {
	autoOpen: true,
	baudRate: 115200,
	dataBits: 8,
	stopBits: 1,
	parity: 'none'
})
const port7 = new SerialPort('com7', {
	autoOpen: true,
	baudRate: 115200,
	dataBits: 8,
	stopBits: 1,
	parity: 'none'
})

const parser6 = new Readline()
const parser7 = new Readline()

port6.pipe(parser6)
port6.pipe(parser7)

// 单次触发，异步获取数据
var getPortData = port => {
	if (!port) { return }
	return new Promise((resolve, reject) => {
		port.write([0x16, 0x54, 0x0d]) //开始扫描
		port.on('data', data => {
			resolve(data)
		})
	}) 
}

// shortcut f1
const id = ioHook.registerShortcut([59], (keys) => {
	console.log('scan start')

	// let data6 = await getPortData(port6) // com6 同步触发
	// let data7 = await getPortData(port7) // com7 同步触发

	// console.log('com6 data:  ' + data6)
	// console.log('com7 data:  ' + data7)

	let data6, data7
	// com6 异步触发 & 获取数据
	getPortData(port6).then(data => {
		data6 = data
		console.log('com6 data:  ' + data6)
	}) 
	// com7 异步触发 & 获取数据
	getPortData(port7).then(data => {
		data7 = data
		console.log('com7 data:  ' + data7)
	}) 
});

// port.write([0x16, 0x55, 0x0d]) //停止扫描

// Register and start hook
ioHook.start();

// Alternatively, pass true to start in DEBUG mode.
ioHook.start(true);