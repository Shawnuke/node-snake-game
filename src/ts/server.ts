const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)


/* App Configuration */

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public/'))

// app.get('/', function(req, res)
// {
//     res.sendFile('/public/index.html/')
// })

app.get('/:room', function(req, res)
{
    // console.log('req.params.room=', req.params.room)
    res.sendFile(__dirname + '/public/index.html')
})

let roomValue: number = 0

io.on('connection', (socket) =>
{
    console.log('a socket connected')

    const origin: string = socket.handshake.headers.referer // url of client
    const url = new URL(origin)
    const path = url.pathname.substring(1)

    const assignRoom = (requestedRoom: string) =>
    {
        console.log('requestedRoom is', requestedRoom? requestedRoom : 'none')
        if (!requestedRoom) // first player entering the room
        {
            // if roomValue is taken, take next room
            if (io.nsps['/'].adapter.rooms[roomValue]) roomValue++
            // if roomValue is empty
            return roomValue
        }
        else // 2nd or 3rd player entering the room
        {
            const roomTested = io.nsps['/'].adapter.rooms[requestedRoom]
            if (roomTested && roomTested.length == 1) // if room exists and is not full
            {
                return requestedRoom 
            }
            else // in any other cases, whether it exists but is full, or empty, or doesn't exist
            {
                console.log('already full/totally empty/doesnt exist')
                return null
            }
        }
    }
    const currentRoom = assignRoom(path)

    console.log('the room assigned is', currentRoom)

    if (currentRoom == null) 
    {
        socket.emit('errorMsg', '1')
        socket.disconnect()
        console.log('socket was forced disconnect')
    }

    socket.join(currentRoom)
    socket.broadcast.emit('chat message', 'your friend joined the party')
    
    socket.on('disconnect', (reason) => 
    {
        console.log('socket disconnected from room#' + currentRoom)
        console.log('reason: ', reason)
        // io.sockets.in(roomValue).emit('chat message', 'your friend abandonned you')
        socket.broadcast.emit('chat message', 'your friend left the party')
    })
})

// const nsp = io.of('/my-namespace')


http.listen(port, () =>
{
    console.log('running on http://localhost:' + port)
})