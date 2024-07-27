const express = require("express")
const database = require("./config/database")
require("dotenv").config()
const app = express()
const port = process.env.PORT

database.connect()

const Task = require("./models/task.model")

app.get("/tasks", async (req,res) => {
    const tasks = await Task.find({
        deleted: false
    }) // chọc vào database và lấy ra mảng tasks

    res.json(tasks) // trả về 1 chuỗi json
})

app.get("/tasks/detail/:id", async (req,res) => {
    // Thêm try catch vào để tránh trường hợp người ta gõ linh tinh vào id , gây crash ctr
    try {
        const id = req.params.id

        const task = await Task.findOne({
            _id: id,
            deleted: false
        })

        res.json(task) // trả về 1 chuỗi json
    } catch(error) {
        res.json("Không tìm thấy")
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})