const { fetchUsers, fetchUserByUsername } = require("../models/users.models")

exports.getUsers = async (request, response, next) => {
    const users = await fetchUsers()
    response.status(200).send({ users })
}

exports.getUserByUsername = async (request, response, next) => {
    try {
        const { username } = request.params
        const user = await fetchUserByUsername(username)
        response.status(200).send({ user })
    } catch (err) {
        next(err)
    }
}