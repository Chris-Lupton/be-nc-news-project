const { fetchTopics } = require("../models/topics.models")

exports.getTopics = async (request, response, next) => {
    const topics = await fetchTopics().catch(next)
    response.status(200).send({ topics })
}