'use strict'

const app = require('express')()
const server = require('http').Server(app)
const SerialPort = require('serialport')
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000
const portName = '/dev/cu.usbmodem1441'
const port = new SerialPort(portName, { baudRate: 9600 })
const parser = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
var keyStatus = false

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`)
})
app.get('/static/:dir/:file', (req, res, next) => {
  const dir = req.params.dir
  const file = req.params.file
  res.sendFile(`${__dirname}/dist/static/${dir}/${file}`)
})
app.get('/api/v1/labokey0', (req, res) => {
  res.json({ isKeyExist: keyStatus })
})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})

port.pipe(parser)
parser.on('data', (input) => {
  keyStatus = input === '0'
  io.sockets.json.emit('message', { isKeyExist: keyStatus })
})

io.sockets.on('connection', (socket) => {
  io.sockets.json.emit('message', { isKeyExist: keyStatus })
})
