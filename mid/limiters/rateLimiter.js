/** timePeriod values
 * 1ms = 1
 * 1s = 1000
 * 1min = 60 * 1000
 * 1hr = 60 * 60 * 1000
 * 1day = 24 * 60 * 60 * 1000
 */
const rateLimit = require('express-rate-limit');

const rate = (options) => {
  
  const limit = rateLimit({
    windowMs: options.timePeriod || 60 * 1000,
    max: options.max || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: options.message || "Too many requests from this IP, please try again later",
  });
  return { limit }
};

module.exports = rate;
