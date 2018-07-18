## Before you start

- This is mostly a proof of concept and have tons of improvements to be made. It goes without saying that this is not a production-ready project.
- Altought is very easy to port to AWS its is not planned in a near future. You can ways fork and send a PR
- Note:  If you don’t have gcloud installed please refer to [gcloud sdk installation ](https://cloud.google.com/storage/docs/gsutil_install)
- Note: After you configre your project in GCP, make sure you got your own ```service-key.json``` file
- Note: if this is your first time using GCP, you need to authenticate your laptop to use GCP services by running gcloud auth login from the command line.

## Overview
This project takes a bunch of urls and it transform them into [```Jobs```](#Jobs) , these [```Jobs```](#Jobs) are published into [Pub/Nub](https://cloud.google.com/pubsub/docs/overview) and awaits there until they´re read by the [```Worker```](#Worker).
When the [```Worker```](#Worker) became aware of one Job it spawn a new crawler using [Puppeteer](https://github.com/GoogleChrome/puppeteer), after the content has been grabbed the result is persisted in [DataStore](https://cloud.google.com/datastore/docs/) and the worker moves to the next Job in line. This process is repeated as long as there are Jobs.

## Usage

### Environment
The following environment variables must be setted before testing
- GAE_APPLICATION - the name of your GCP application
- GOOGLE_APPLICATION_CREDENTIALS - the path to your ```service-key.json```

### Steps
Follow this steps to run your application locally
- Clone this repository
- Run npm install
- Rename ```urls.sample.js``` to ```urls.js``` and include the urls you want to crawl
- Rename ```config.sample.js``` to ```config.js``` and edit ```gcp``` and ```descriptor``` section

```
# generate the messages
node index.js
# when finished run the worker
node src/worker.js
```

## Config

### Descriptor
Descriptor object is the backbone of this crawler, in here you specify each one of the things you want to grab from page.

|Property   	| Type  	| Comments  	|
|---	|---	|---	|
|name	| String	|	|
|primary	| Boolean	| Wether this is a primary attribute ( think about saving process)	|
|required 	|  Boolean 	| If is set to true execution will stop when element is not found
|selector 	|  Boolean 	| A valid CSS selector
|attribute  |  String | Optional attribute to grab from selector
|format 	|  Function<String value> 	| A callback to format the value grabbed

### Puppeteer
Puppeteer configuration

|Property   	| Default  	| Comments  	|
|---	|---	|---	|
|waitUntil 	|  load 	| When to consider navigation succeeded, defaults to load. Given an array of event strings, navigation is considered to be successful after all events have been fired [See docs](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)

### Aggregates
Aggregation is a process that ocurrs after all elements have been grabbed.

|Property   	| Type  	| Comments  	|
|---	|---	|---	|
|name	| String	|	|
|source 	|  Function<Object Descriptor> 	| Descriptor object contains all elements grabbed in first step

## Saving strategies

- Data storage GCP
- Others [pending documentation]

## Publish
```
docker build -t gcr.io/$(gcloud config get-value project)/worker .
gcloud docker -- push gcr.io/$(gcloud config get-value project)/worker
```

## Final notes
- Finalize your cluster after workload has been finished is trongly recommended to avoid incurring on innecesary charges.
- If you think this project suits your needs but needs a little tweak send me a message and I´d be happy to talk about it.