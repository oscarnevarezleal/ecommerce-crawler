const debug = require('debug')('ec-publisher');
const util = require('util');
// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');

const p = (config) => {
    const {topicName, projectId} = config

    debug({
        point: 'Publisher boot',
        value: {topicName, projectId}
    })

    // Instantiates a client
    const pubsub = new PubSub({
        projectId
    });

    const publish = (message, attributes) => {
        let topic = pubsub.topic(topicName)
        let publisher = topic.publisher()

        /**debug({
            point: 'topic-publisher',
            value: {topic, publisher}
        })**/

        return publisher.publish(message, attributes)
    }

    return {publish}
}


module.exports = p
