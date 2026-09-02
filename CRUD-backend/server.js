const express = require("express")
const mongoose = require("mongoose")
const Task = require("./task.model")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/FinalTaskApp")
    .then(() => {
        console.log("MongoDB connected successfully")
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error)
    })

// Create/Upload new task
app.post("/tasks", async (req, res) => {

    try {
        const task = new Task({
            _id: req.body.id,
            title: req.body.title,
            status: req.body.status
        })
        const savedTask = await task.save()
        res.status(201).json(savedTask)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
})

// To Fetch/Get all tasks
app.get("/tasks", async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.status(200).json(tasks)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
})

// To Fetch/Get specific tasks using id
app.get("/tasks/:id", async (req, res) => {

    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        res.status(200).json(task)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
})

// To Update existing task using id
app.put("/tasks/:id", async (req, res) => {

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                status: req.body.status
            },

            {
                new : true
            }
        )

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        res.status(200).json(task)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
})

// To Remove/Delete task
app.delete("/tasks/:id", async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        res.status(200).json({
            message: "Task deleted successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
})

// Server
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})