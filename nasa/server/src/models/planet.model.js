const fs = require('fs')
const { parse } = require('csv-parse')
const path = require('path')

let planets = []

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

function loadHabitablePlanet() {
    return new Promise((resolove, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    planets.push(data)
                }
            })
            .on('error', (error) => {
                console.log(`error loding planet ${error}`)
                reject(error)
            })
            .on('end', () => {
                console.log("loding planet done")
                resolove(45)
            })
    })
}


function getPlanet() {
    return planets
}


module.exports = {
    loadHabitablePlanet,
    getPlanet
}
