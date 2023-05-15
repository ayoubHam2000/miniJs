const launches = require('./launch.mongo')
const planets = require('./planet.mongo')



async function getLaunches() {
    //const arrLaunches = Array.from(launches.values())
    const arrLaunches = await launches.find({}, { "_id": 0, "__v": 0 })
    return (arrLaunches)
}

async function isLaunchExist(id) {
    const launch = await launches.findOne({
        flightNumber: +id
    })
    return !!launch
}

async function getLatestFlightNumber() {
    const launch = await launches.findOne().sort('-flightNumber')
    const DEFAULT_FLIGHT_NBR = 100
    let flightNumber = launch?.flightNumber ?? DEFAULT_FLIGHT_NBR
    return flightNumber
}

async function addNewLaunch(launch) {
    let latestFlightNumber = (await getLatestFlightNumber()) + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true,
        customer: ['ZTM', 'NASA'],
    })

    await saveLaunch(newLaunch)
}

async function saveLaunch(newLaunch) {
    try {
        const isPlanetExist = await planets.find({
            keplerName: newLaunch.target
        })

        if (!isPlanetExist) {
            throw new Error("Launch target does not match any planet")
        }

        //console.log(launch)
        //console.log(newLaunch)
        await launches.findOneAndUpdate(
            { flightNumber: newLaunch.flightNumber },
            newLaunch,
            { upsert: true })
    } catch (err) {
        console.log(`can't save launch ${err}`)
    }
}

async function abortLaunch(id) {
    try {
        const launch = await launches.updateOne({
            flightNumber: +id
        }, {
            //success: false,
            upcoming: false
        })

        return launch.ok === 1 && launch.nModified === 1
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getLaunches,
    addNewLaunch,
    abortLaunch,
    isLaunchExist
}