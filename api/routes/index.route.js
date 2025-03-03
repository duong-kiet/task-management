const taskRoutes = require("./task.route")
const userRoutes = require("./user.route")

const authMiddleware = require("../middlewares/auth.middleware")

module.exports = (app) => {
    const version = "/api"

    app.use(version + "/tasks", taskRoutes)
    
    app.use(version + "/users", userRoutes)
}
