const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const database = require("./config/database")
require("dotenv").config()

const routesApi = require("./api/routes/index.route")

const app = express()
const port = process.env.PORT

app.use(cors())

database.connect()

app.use(cookieParser())

//parse application/json
app.use(bodyParser.json())

// Routes Version 1
routesApi(app)


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})