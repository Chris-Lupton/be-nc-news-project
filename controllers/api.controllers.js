const { fetchEndpoints } = require("../models/api.models")

exports.getEndpoints = async (request, response, next) => {7
    const endpoints = await fetchEndpoints().catch(next)
    response.status(200).send({ endpoints })
}