const urls = require('./urls')
const config = require('./src/config')
const topicMessenger = require('./src/topic-messenger')
const publisher = require(`./src/publisher.js`)(config.gcp)

async function _() {
    let len = urls.length
    for (let u in urls) {
        let url = urls[u]
        let dataBuffer = topicMessenger.generateJobMessage(url)
        let customAttributes = {}
        let results = await publisher.publish(dataBuffer, customAttributes)
        if (results) {
            const messageId = results;
            console.log(`[${u}/${len}] Published `, messageId)
        } else {
            console.log(`[${u}/${len}] An error ocurred `, results)
        }
    }
}

_()