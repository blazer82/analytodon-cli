/* eslint-disable */
const nrPino = require('@newrelic/pino-enricher');
const pino = require('pino');

const logger = pino(nrPino());

export {logger};
/* eslint-enable */
