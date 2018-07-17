// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');
const debug = require('debug')('ec-o-datastorage')

const p = (config) => {

    debug('DataStorage', config)

    let {projectId} = config.gcp
    // Creates a client
    const datastore = new Datastore({
        projectId,
    });

// The kind for the new entity
    const kind = config.gcp.datastorage.kind;

    const save = (name, props) => {

        // The Cloud Datastore key for the new entity
        const taskKey = datastore.key([kind, name]);

        // Prepares the new entity
        const task = {
            key: taskKey,
            data: {...props},
        };

        debug(task)
        // Saves the entity
        return datastore.save(task)
    }

    return {save}
}

module.exports = p