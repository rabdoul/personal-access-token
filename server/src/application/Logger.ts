import pino = require('pino');

const LOGGER = pino({
    base: null,
    formatters: {
        level: (label) => {
          return { level: label };
        },
    },
    timestamp: () => `,"time": "${new Date().toISOString()}"`
})

export default LOGGER