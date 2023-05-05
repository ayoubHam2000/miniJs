const API_URL = 'http://localhost:8080'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planet`)
  return await response.json()
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launche`)
  const launches = await response.json()
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};