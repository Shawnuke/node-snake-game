const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)

/* App Configuration */

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'))

app.get('/:room/', function(req, res)
{
  res.sendFile(__dirname + '/')
})
let roomValue: number = 0

io.on('connection', (socket) =>
{
    console.log(socket)
    if (io.nsps['/'].adapter.rooms[roomValue] 
        && io.nsps['/'].adapter.rooms[roomValue].length == 2
    ) 
    {
        roomValue++
    }
    socket.join(roomValue)

    io.sockets.in(roomValue).emit('connectToRoom', "you are in room #" + roomValue)

    console.log('a socket connected')

    socket.emit('chat message', 'welcome aboard!')
    socket.broadcast.emit('chat message', 'somebody joined')

    socket.on('chat message', (msg) =>
    {
        console.log('message: ' + msg)
        io.emit('chat message', msg) // emit to all the sockets connected to `/`
    })
    
    socket.on('disconnect', () => 
    {
        console.log('socket disconnected')
    })
})

// const nsp = io.of('/my-namespace')


http.listen(port, () =>
{
    console.log('running on http://localhost:' + port)
})