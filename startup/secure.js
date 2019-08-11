
const helmet = require('helmet')
const rateLimit = require("express-rate-limit")
module.exports = function(app) {
  const limiter = rateLimit({
    windowMs: 1 * 1 * 1000, // 1 hour
    max: 1
  });
  app.use(limiter)
  app.use(helmet())
  app.use(helmet.xssFilter())
  app.use(helmet.frameguard())
};



