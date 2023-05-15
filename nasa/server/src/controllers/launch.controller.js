const {
    getLaunches,
    addNewLaunch,
    abortLaunch,
    isLaunchExist
} = require('../models/launch.model')

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getLaunches())
}

async function httpAddNewLaunch(req, res) {
    let launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({
            error: "Missing required launch property"
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch Date"
        })
    }

    await addNewLaunch(launch)
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
    const id = req.params.id

    console.log(id)
    if (!(await isLaunchExist(id))) {
        return (res.status(404).json({
            "Error": "Launch Does Not Exist"
        }))
    }

    const aborted = await abortLaunch(id)

    if (!aborted) {
        return res.status(400).json("Launch not aborted")
    }
    return (res.status(200).json(aborted))
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}

