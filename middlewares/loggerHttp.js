const LoggerHttp = require('../utils/logger').http


module.exports.addLogger = (req, res, next) => {
    LoggerHttp(req, res)
    next()
}