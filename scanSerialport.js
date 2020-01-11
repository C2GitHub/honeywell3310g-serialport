const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

/**
 * @description 异步获取本地设备扫描枪物理串口
 * @returns Promise <pending>
 */
const getScanSerialport = async () => {
	const list = await SerialPort.list()
	const scanGuns = list.filter(item => {
		return item.productId === '0B6A' // 扫描枪产品ID
	})
	const scanPort = scanGuns.map(item => {
		return item.path // 扫描枪串口号
	})
	return scanPort
}

/**
 * @description 初始化端口号
 * @returns Array
 */
const initScanPorts = async () => {
	let ports = []
	const scanPorts = await getScanSerialport()
	scanPorts.forEach(item => {
		const port = new SerialPort(item, {
			autoOpen: true,
			baudRate: 115200,
			dataBits: 8,
			stopBits: 1,
			parity: 'none'
		})
		port.pipe(new Readline())
		ports.push(port)
	})
	return ports
}

/**
 * @description 单机异步发送扫码指令、读取扫描数据
 * @param {port} port 
 * @returns Promise <pending>
 */
const getPortScanData = port => {
	if (!port) { return }
	return new Promise((resolve, reject) => {
		port.write([0x16, 0x54, 0x0d]) // 开始扫描
		// port.write([0x16, 0x55, 0x0d]) //停止扫描
		port.on('data', data => {
			resolve(data.toString())
		})
	})
}

let ports  // 初始化扫码枪端口
initScanPorts().then(data => { // get serialport with async 
	ports = data
	exports.ports = data
	exports.port1 = data[0]
	exports.port2 = data[1]
})

/**
 * @description *** 发送串口指令 & 读取串口数据 ***
 * @param Array | Object
 */
const getPortData = (param) => {
	let scanPorts = ports
	if (param && param instanceof Object) { scanPorts = [param] }
	return new Promise((resolve, reject) => {
		if (scanPorts instanceof Array) {
			const ps = scanPorts.map(item => {
				return getPortScanData(item)
			})
			Promise.all(ps).then(data => {
				resolve(data)
			})
		}
	})
}

// 导出扫码串口通讯接口模块
exports.initScanPorts = initScanPorts
exports.getPortScanData = getPortScanData
exports.getPortData = getPortData
