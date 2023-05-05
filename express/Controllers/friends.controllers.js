const { friends } = require('../Models/friends.model')

function post(req, res) {
    if (!req.body.name) {
        return res.status(400).json({
            error: "Error missing name"
        })
    }
    const name = req.body.name;
    const id = friends.length;
    const newFriend = {
        name: name,
        id: id
    }
    friends.push(newFriend)
    res.send(newFriend)
}

function getAll(req, res) {
    res.json(friends)
}

function getById(req, res) {
    const friendId = req.params.friendId;
    const friend = friends[friendId]
    if (friend) {
        res.status(200).json(friend);
    } else {
        res.status(404).json({
            error: "Friend not found"
        })
    }
}

module.exports = {
    getAll,
    getById,
    post
}