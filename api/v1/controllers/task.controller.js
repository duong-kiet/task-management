const Task = require("../models/task.model")

// GET /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    // console.log(req.query)
    if(req.query.status) {
        find.status = req.query.status
    }

    const tasks = await Task.find(find)

    res.json(tasks)
}

// GET /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
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
}