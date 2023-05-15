const fs = require('fs')
const { parse } = require('csv-parse')
const path = require('path')

const habitablePlanet = require('./planet.mongo')


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
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data.kepler_name)
                    //planets.push(data)
                }
            })
            .on('error', (error) => {
                console.log(`error loding planet ${error}`)
                reject(error)
            })
            .on('end', async () => {
                const count = (await getPlanet()).length
                console.log(` ${count} planet found loding planet done`)
                resolove(45)
            })
    })
}


async function getPlanet() {
    return await habitablePlanet.find({},
        "-_id -__v"
    )
}

async function savePlanet(planetName) {
    try {
        await habitablePlanet.updateOne({
            keplerName: planetName
        }, {
            keplerName: planetName
        }, {
            upsert: true
        })
    } catch (err) {
        console.log(`Can't save planet: ${err}`)
    }
}

module.exports = {
    loadHabitablePlanet,
    getPlanet
}
