const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explirer IS1',
    launchDate: new Date("December 27, 2030"),
    destination: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

function getLaunches() {
    const arrLaunches = Array.from(launches.values())
    return (arrLaunches)
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true,
        customer: ['ZTM', 'NASA'],
    }))
}

module.exports = {
    getLaunches,
    addNewLaunch
}