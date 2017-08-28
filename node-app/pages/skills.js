'use strict'

const git = require('../../lib/github')
const config = require('../../lib/config')

const flatten = (array = []) => {
    return array.reduce((x, y) => {
        return x.concat(Array.isArray(y) ? flatten(y) : y)
    }, [])
}

const getValueSum = ((values = []) => {
    return values.reduce((x,y) => {
        return x + y
    }, 0)
})

const getSkills = (percentages = []) => {
    const skills = flatten(flatten(percentages).map((skill) => {
        return skill.name
    }))
    return (Array.from(new Set(skills))).slice().sort()
}

const getLines = (size = 0) => {
    return size/config.bytesPerLine
}

const getMaxValue = (repositories = []) => {
    return Math.max(...repositories.map((repository) => {
        return getValueSum(repository.map((entry) => {
            return entry.value
        }, []))
    }, []))
}

const getAdjustedValues = (repositories = []) => {
    const maxValue = getMaxValue(repositories)
    return repositories.map((repository) => {
        const value = getValueSum(repository.map((entry) => {
            return entry.value
        }, []))
        const size = getValueSum(repository.map((entry) => {
            return entry.size
        }, []))
        const skillKey = repository.map((entry) => {
            return entry.name
        }, [])[0]
        return {
            name: skillKey,
            value: value/maxValue * 100,
            lines: getLines(size),
            count: repository.length
        }
    }, [])
}

const getPercentages = (repositories = []) => {
    return repositories.map((repository) => {
        const total = Object.values(repository).reduce((sum, size) => sum + size, 0)
        return Object.entries(repository).map(([language, size]) => ({
            name: language,
            value: size/total * 100,
            size: size
        }), []).filter(({value}) => value >= 10)
    })
}

const getSortedValues = (repositories = [], skills = []) => {
    return skills.map((skill) => {
        return flatten(repositories).filter((repository) => repository.name === skill)
    }, [])
}

module.exports = {
    init: async () => {
        try {
            const repositories = (await git.getRepositories()).map((repository) => repository.name)
            const languages = await Promise.all(repositories.map( async (repository) => {
                return await git.getLanguages(repository)
            }))
            const percentages = getPercentages(languages.filter((repository) => Object.keys(repository).length))
            const skills =  getSkills(percentages)
            return getAdjustedValues(getSortedValues(percentages, skills))
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
