module.exports = {
    "gcp": {
        'projectId': 'yourProjectID',
        'topicName': 'yourTopicName',
        'subscriptionName': 'yourSubscriptionName',
        "datastorage": {
            "kind": "Product"
        }
    },
    "puppeteer": {
        "waitUntil": 'domcontentloaded'
    },
    "descriptor": {
        "elements": [
            {
                'name': 'price',
                'required': true,
                'selector': '.price',
                'format': (e) => parseFloat(e.replace(/[^0-9.]/g, ''))
            },
            {
                'name': 'name',
                'required': true,
                'selector': 'h1'
            },
            {
                'name': 'currency',
                'required': true,
                'selector': '.currency'
            },
            {
                'name': 'code',
                'primary': true,
                'required': false,
                'selector': '.code',
                'format': (e) => e.replace(/[^0-9.]/g, '')
            }
        ]
    },
    "aggregates": [
        {
            "name": "price_formatted",
            "source": (descriptor) => parseFloat(descriptor['price']).toFixed(2)
        }
    ],
    "output": {
        "strategy": {
            "type": "datastorage"
        }
    }
}