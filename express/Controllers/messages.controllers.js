const path = require('path')

function get(req, res) {
    const imagePath = path.join(__dirname, '..', 'public', '16.1 skimountain.jpg')
    res.sendFile(imagePath)
}

module.exports = {
    get,
}