document.addEventListener('DOMContentLoaded', () => {
    const $button = document.querySelector('.js-invite');
    const url = new URL(window.location.href);
    const path = url.pathname.substring(1);
    // const room = url.get('room')
    const connect = () => {
        const socket = io();
        socket.emit('handshake', path);
        socket.on('connectToRoom', (data) => {
            document.body.innerHTML = '';
            document.write(data);
        });
        console.log('give this link to your friend');
        socket.on('chat message', (msg) => {
            console.log(msg);
        });
    };
    $button.addEventListener('click', () => {
        connect();
    });
    if (path) {
        connect();
    }
});
