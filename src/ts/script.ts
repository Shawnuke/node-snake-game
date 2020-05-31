declare const io
document.addEventListener('DOMContentLoaded', () => 
{
    const $button = document.querySelector('.js-invite')
    
    const connect = () =>
    {
        const socket = io()
        socket.on('connectToRoom', (data) =>
        {
            document.body.innerHTML = ''
            document.write(data)
        })
        console.log('give this link to your friend')
        socket.emit('chat message', 'anything')

        socket.on('chat message', (msg: string) => 
        {
            console.log(msg)
        })
    }
    
    $button.addEventListener('click', () =>
    {
        connect()
    })
    
})
