const socket = io()

socket.on('dataLoaded', (data) => {
    console.log(data)
})

socket.emit('pageLoaded')
