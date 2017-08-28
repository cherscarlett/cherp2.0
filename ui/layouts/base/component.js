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
                console.log(skills)
                const width = 290
                const chart = d3.select('.skill-container')
                    .append('svg:svg')
                    .attr('class', 'skill-chart')
                    .attr('width', width)
                    .attr('height', 45 * skills.length)
                const x = d3.scaleLinear()
                    .range([0, width])
                x.domain([0, d3.max(skills, (skill) => { return skill.value })])
                const bar = chart.selectAll('g')
                    .data(skills)
                    .enter().append('svg:g')
                    .attr('transform', (skills, index) => { return `translate(0, ${index * 40 })` })
                bar.append('svg:rect')
                    .attr('class', (skill) => { return x(skill.value) > 90 ? 'skill-bar skill-bar-light' : 'skill-bar skill-bar-dark' })
                    .attr('data-language', (skill) => { return skill.name })
                    .attr('x', 0)
                    .attr('y', 2)
                    .attr('width', (skill) => { return x(skill.value)} )
                    .attr('height', 38)
                    .on('mouseover', (skill) => {
                        if (x(skill.value) < 90) {
                            const barLabel = document.querySelectorAll(`.skill-label-dark[data-language='${skill.name}']`)[0]
                            barLabel.style.opacity = 1
                        }
                    })
                    .on('mouseout', (skill) => {
                        if (x(skill.value) < 90) {
                            const barLabel = document.querySelectorAll(`.skill-label-dark[data-language='${skill.name}']`)[0]
                            barLabel.style.opacity = 0
                        }
                    })
                bar.append('svg:text')
                    .attr('class', (skill) => { return x(skill.value) > 90 ? 'skill-label skill-label-light' : 'skill-label skill-label-dark' })
                    .attr('data-language', (skill) => { return skill.name })
                    .attr('x', (skill) => { return x(skill.value)} )
                    .attr('y', 40)
                    .attr('text-anchor', (skill) => { return x(skill.value) > 90 ? 'end' : 'start' })
                    .html((skill) => { return skill.name })
            })
            socket.emit('pageLoaded')
        }
    }
    onUpdate () {
        console.log(`${Date.now()}: marko components updated`)
    }
}
