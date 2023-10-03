const { getUsers, getUserByUsername, postUser } = require('../controllers/users.controllers')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:username', getUserByUsername)

usersRouter.post('/', postUser)

module.exports = usersRouter