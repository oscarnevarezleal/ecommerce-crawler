const debug = require('debug')('ec-worker')
const config = require('./config')
// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');
const robot = require('./robot')
const co = require('co')

const {strategy} = config.output
const outputStrategy = require('./output/strategies/' + strategy.type)(config)

let primaryKey = null

/**
 *
 * @param projectId
 * @param topicName
 * @param subscriptionName
 * @param cb
 * @returns {IterableIterator<*>}
 */
function listen({projectId, topicName, subscriptionName}, cb) {

    // Instantiates a client
    const pubsub = new PubSub({
        projectId
    });

    let subscription;
    let topic = pubsub.topic(topicName)

    // Event handlers
    function handleMessage(message) {
        subscription.removeListener('message', handleMessage);
        co(function* () {
            const data = JSON.parse(message.data);
            debug({
                point: 'Worker handleMessage',
                value: {...data}
            })
            // let outputObj = yield robot.work(data)
            // let saving = yield outputStrategy.save(outputObj[primaryKey], outputObj)
            message.ack();
            subscription.on('message', handleMessage);
        })
    }

    function handleError(err) {
        debug({
            point: 'Worker handleError',
            err
        })
    }

    topic.createSubscription(subscriptionName, (err, sub) => {
        if (err) {
            debug(err)
            cb(err);
            return;
        }

        subscription = sub;

        // Listen to and handle message and error events
        subscription.on('message', handleMessage);
        subscription.on('error', handleError);

        debug(`Listening to ${topicName} with subscription ${subscriptionName}`);
    });

    // Subscription cancellation function
    return () => {
        if (subscription) {
            // Remove event listeners
            subscription.removeListener('message', handleMessage);
            subscription.removeListener('error', handleError);
            subscription = undefined;
        }
    };
}

(async () => {

    const primaryLookup = config.descriptor.elements.filter(e => e.primary)
    if (primaryLookup.length > 1) {
        debug(`There must be only one element marked as primary. ${primaryLookup.length} were found`)
        return
    }
    debug('primaryLookup', primaryLookup)
    primaryKey = primaryLookup[0].name
    await robot.provision(config);
    listen(config.gcp)
})()