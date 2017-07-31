module.exports = class {
    onInput (input, out) {
        this.input = null
    }
    onMount () {
        console.log(`${Date.now()}: marko components mounted`)
        if (io) {
            const socket = io(window.location.host)
            socket.on('dataResolved', (data) => {
                const skills = data.app.skills
                d3.select('.skill-container')
                  .selectAll('div')
                  .data(skills)
                  .enter()
                  .append('div')
                  .style('width', (d) => { return d.value + '%'})
                  .text((d) => { return d.name })
            })
            socket.emit('pageLoaded')
        }
    }
    onUpdate () {
        console.log(`${Date.now()}: marko components updated`)
    }
}
