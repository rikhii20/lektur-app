const routes = require('../routes')
const errorHandler = require("../middlewares/error")

module.exports = function(app) {
    app.use("/api/v1", routes);
    app.use(errorHandler)
}