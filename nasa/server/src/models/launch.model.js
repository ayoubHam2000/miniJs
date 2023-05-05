const launches = new Map()

let latestFlightNumber = 100

function getLaunches() {
    const arrLaunches = Array.from(launches.values())
    return (arrLaunches)
}

function isLaunchExist(id) {
    return launches.has(+id)
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

function abortLaunch(id) {
    const launch = launches.get(+id)

    launch.success = false
    launch.upcomming = false
    return launch
}

module.exports = {
    getLaunches,
    addNewLaunch,
    abortLaunch,
    isLaunchExist
}