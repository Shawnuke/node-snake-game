const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public/'));
http.listen(port, () => {
    console.log('running on http://localhost:' + port);
});
/**
 * Routes management
 */
/* no need for app.get('/') since default convention is to redirect to index.html */
app.get('/:room', function (req, res) {
    // console.log('req.params.room=', req.params.room)
    res.sendFile(__dirname + '/public/index.html');
});
/**
 * Function to assign a room to a client depending of its URL
 */
const assignRoom = (requestedRoom) => {
    console.log('requestedRoom is', requestedRoom ? requestedRoom : 'none');
    if (!requestedRoom) // first player entering the room
     {
        // if roomValue is taken, take next room
        if (io.nsps['/'].adapter.rooms[roomValue])
            roomValue++;
        // if roomValue is empty
        return roomValue;
    }
    else // 2nd or 3rd player entering the room
     {
        // const roomTested = io.nsps['/'].adapter.rooms[requestedRoom]
        // if (roomTested && roomTested.length == 1) // if room exists and is not full
        // {
        //     return requestedRoom 
        // }
        // else // in any other cases, whether it exists but is full, or empty, or doesn't exist
        // {
        //     console.log('already full/totally empty/doesnt exist')
        //     return null
        // }
        return requestedRoom;
    }
};
let roomValue = 0;
/**
 * Socket connection management
 */
const newConnection = (socket) => {
    console.log('new connection:', socket.id);
    /**
     * Rooms management
     */
    const origin = socket.handshake.headers.referer; // url of client
    // global.URL = require('url').URL
    // const url = new URL(origin)
    // const path = url.pathname.substring(1)
    const url = socket.handshake.headers.referer;
    const newURL = url.substring(url.lastIndexOf("/") + 1, url.length);
    const currentRoom = assignRoom(newURL); // assign a room to the client
    console.log('the room assigned is', currentRoom);
    if (currentRoom == null) // if joining a room failed
     {
        socket.emit('errorMsg', '1');
        socket.disconnect();
        console.log('socket was disconnected by force');
    }
    socket.join(currentRoom);
    // socket.emit('snakeParam', { posX: 9, posY: 3, dirX: 0, dirY: 1})
    // socket.emit('enemyParam', { posX: 3, posY: 9, dirX: 0, dirY: -1})
    /**
     * A room is now filled with 2 players
     */
    if (io.nsps['/'].adapter.rooms[currentRoom].length == 2) {
        io.emit('chat message', 'connected with player 2');
        console.log('players are connected');
        // socket.broadcast.emit('snakeParam', { posX: 3, posY: 9, dirX: 0, dirY: -1})
        // socket.broadcast.emit('enemyParam', { posX: 9, posY: 3, dirX: 0, dirY: 1})
        // if room is full, socket = x:9, y: 3, the other something else
        const inputData = (direction) => {
            console.log('direction received:', direction);
            socket.broadcast.emit('enemyInput', direction);
        };
        socket.on('input', inputData);
    }
    // socket.on('disconnect', (reason) => 
    // {
    //     console.log('socket disconnected from room#' + currentRoom)
    //     console.log('reason: ', reason)
    //     // io.sockets.in(roomValue).emit('chat message', 'your friend abandonned you')
    //     socket.broadcast.emit('chat message', 'your friend left the party')
    // })
};
io.on('connection', newConnection);
