module.exports = class {
    onInput (input, out) {
        this.input = null
    }
    onMount () {
        console.log(`${Date.now()}: marko components mounted`)
        if (io) {
            const socket = io(window.location.host)
            socket.on('dataResolved', (data) => {
                console.log(`${Date.now()}: data from server resolved`)
                console.log(data)
            })
            socket.emit('pageLoaded')
        }
    }
    onUpdate () {
        console.log(`${Date.now()}: marko components updated`)
    }
}
