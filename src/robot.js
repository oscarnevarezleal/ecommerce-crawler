const puppeteer = require('puppeteer');
const request = require('request');
const util = require('util');
const requestPromise = util.promisify(request);
const parser = require('xml2json');
const debug = require('debug')('ec-robot')

let browser, page, config;

module.exports = {
    /**
     *
     * @returns {Promise<void>}
     * @param _descriptor
     */
    provision: async (_config) => {
        config = _config;
        debug('Worker provision', _config)
        if (!browser) {
            browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--enable-logging', '--v=1'
                ]
            });
            page = await browser.newPage();
        }
    },
    /**
     *
     */
    work: ((message) => {

        /**debug(await page.evaluate(() => {
            return document.body.innerHTML
        }))**/

        return new Promise((async (resolve, reject) => {
            let {descriptor, aggregates} = config
            let waitUntil = 'networkidle2'
            if ('waitUntil' in config.puppeteer) {
                waitUntil = config.puppeteer.waitUntil
            }
            let {url} = message
            let result = {}
            debug('I´m on it')
            // debug(`Navigating to ${url}`)
            await page.goto(url, {waitUntil});
            try {
                for (e in descriptor.elements) {
                    const element = descriptor.elements[e]
                    // debug(`${e} - Looking for ${element.selector} selector`);
                    try {
                        result[element.name] = await
                            page.evaluate((e) => e.attribute ?
                                document.querySelector(e.selector).getAttribute(e.attribute) :
                                document.querySelector(e.selector).textContent, element);
                        if ('format' in element) {
                            result[element.name] = element.format(result[element.name])
                        }
                    } catch (ex) {
                        if (!result[element.name] && element.required) {
                            debug('Required element was not found, skipping')
                            reject(ex)
                        }
                    }
                    // debug(element.name, result[element.name])
                }

                for (a in aggregates) {
                    let aggregate = aggregates[a]
                    // debug(`working in ${aggregate.name} aggregation`);
                    result[aggregate.name] = aggregates[a].source(result)
                }

                debug('result', result)
                resolve(result)

            } catch (e) {
                reject(e)
            }
        }))
    }),

    /**
     *
     */
    dispose: () => {
        browser.close();
    }
}