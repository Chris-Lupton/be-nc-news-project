const { readFile } = require('fs/promises')

exports.fetchEndpoints = async () => {
    const data = await readFile('./endpoints.json')
    return JSON.parse(data)
}