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
                const skills = data.app.skills
                const width = 290
                const chart = d3.select('.skill-container')
                    .append('svg:svg')
                    .attr('class', 'skill-chart')
                    .attr('width', width)
                    .attr('height', 45 * skills.length)
                const x = d3.scaleLinear()
                    .range([0, width])
                x.domain([0, d3.max(skills, (skill) => { return skill.value })])
                chart.selectAll('rect.bar')
                    .data(skills)
                    .enter().append('svg:rect')
                    .attr('class', 'bar')
                    .attr('x', 0)
                    .attr('y', (skill, index) => { return index * 40})
                    .attr('width', (skill) => {return x(skill.value)})
                    .attr('height', 40)
            })
            socket.emit('pageLoaded')
        }
    }
    onUpdate () {
        console.log(`${Date.now()}: marko components updated`)
    }
}
