const API_URL = 'http://localhost:8080'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planet`)
  return await response.json()
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launch`)
  const launches = await response.json()
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launch`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch)
    })
  } catch (err) {
    console.log(err)
    return {
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launch/${id}`, {
      "method": "delete"
    })
  } catch (err) {
    console.log(err)
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};