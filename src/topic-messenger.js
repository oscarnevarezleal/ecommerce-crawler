module.exports = {
    generateJobMessage: (url, config) => Buffer.from(JSON.stringify({url, config}))
}