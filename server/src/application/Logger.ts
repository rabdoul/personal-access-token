import pino = require('pino');

const LOGGER = pino({
    base: null,
    useLevelLabels: true,
    timestamp: () => `,"time": "${new Date().toISOString()}"`
})

export default LOGGER