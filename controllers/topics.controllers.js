const { fetchTopics, addTopic } = require("../models/topics.models")

exports.getTopics = async (request, response, next) => {
    const topics = await fetchTopics().catch(next)
    response.status(200).send({ topics })
}

exports.postTopic = async (request, response, next) => {
    const topic = request.body
    try{
        const newTopic = await addTopic(topic)
        response.status(201).send({ topic: newTopic })
    } catch (err) {
        next(err)
    }
}