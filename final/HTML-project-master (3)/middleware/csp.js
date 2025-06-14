const csp = require('helmet-csp');

const cspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
        imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
        connectSrc: ["'self'", "https:", "http:"],
        fontSrc: ["'self'", "https:", "http:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "https:", "http:"],
        frameSrc: ["'self'", "https:", "http:"],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'", "blob:"]
    },
    useDefaults: false,
    loose: true
};

module.exports = csp(cspConfig); 