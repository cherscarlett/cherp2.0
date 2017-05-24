const socket = io(window.location.host)

socket.on('dataLoaded', (data) => {
    console.log(data)
})

socket.emit('pageLoaded')
