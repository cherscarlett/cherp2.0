'use strict'

const git = require('../../lib/github')

const flatten = (array = []) => {
    return array.reduce((x, y) => {
        return x.concat(Array.isArray(y) ? flatten(y) : y)
    }, [])
}

const getValueSum = ((array = []) => {
    const values = array.map((x) => {
        return Object.values(x)[0]
    }, [])
    return values.reduce((x,y) => {
        return x + y
    }, 0)
})

const getSkills = (percentages = []) => {
    const allSkills = flatten(percentages)
    const skills = allSkills.map((skill) => {
        return Object.keys(skill)
    })
    const skillsFlat = flatten(skills)
    return (Array.from(new Set(skillsFlat))).slice().sort()
}
const getSkillRatios = (ratios = [], skills = []) => {
    const allRatios = flatten(ratios)
    const skillsSorted = skills.map((skill) => {
        return allRatios.filter((ratio) => Object.keys(ratio)[0] === skill)
    }, [])
    const totalRatios = skillsSorted.map((skill) => {
        const value = getValueSum(skill)
        const skillKey = skill.map((lang) => {
            return Object.keys(lang)[0]
        }, [])[0]
        return {
            name: skillKey,
            value: value
        }
    })
    const filteredSkills = totalRatios.filter((skill) => skill.value >= 10)
    const values = filteredSkills.map((skill) => {
        return skill.value
    }, [])
    const maxValue = Math.max(...values)
    const skillPercentages = filteredSkills.map((skill) => {
        return {
            name: skill.name,
            value: skill.value/maxValue * 100
        }
    })
    return skillPercentages
}

module.exports = {
    init: async () => {
        try {
            const repositories = await git.getRepositories()
            const projects = repositories.map((repository) => repository.name)
            const languages = await Promise.all(projects.map( async (project) => {
                return await git.getLanguages(project)
            }))
            const percentages = git.getPercentages(languages)
            const skills =  getSkills(percentages)
            const skillRatios = getSkillRatios(percentages, skills)
            return skillRatios
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
