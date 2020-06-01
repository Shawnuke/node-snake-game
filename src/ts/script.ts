declare const io
document.addEventListener('DOMContentLoaded', () => 
{
    const $button = document.querySelector('.js-invite')
    
    const url = new URL(window.location.href)
    const path = url.pathname.substring(1)

    // const room = url.get('room')

    const connect = () =>
    {
        const socket = io()

        if (path)   // 2nd or 3rd player
        {
            socket.emit('handshake', path)
        }
        else    // 1st player
        {
            console.log('give this link to your friend')
        }

        
        socket.on('chat message', (msg: string) => 
        {
            console.log(msg)
        })
        let silent = false

        socket.on('errorMsg', (msg: string) => 
        {
            switch (msg) 
            {
                case '1':
                    console.log('Sorry, but the party you\'re trying to join is either full or empty. Make sure you wrote the address right, or please ask your friend to try again.')
                    break;
            
                default:
                console.log(msg)
                    break;
            }
            silent = true
        })

        socket.on('disconnect', () =>
        {
            if (!silent) console.log('oops, you were disconnected. Please verify the quality of your connection')
        })
    }
    
    $button.addEventListener('click', () =>
    {
        connect()
    })
    
    if (path)
    {
        connect()
    }
})
