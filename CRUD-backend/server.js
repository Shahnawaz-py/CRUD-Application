const express = require("express")
const mongoose = require("mongoose")
const Task = require("./task.model")
const User = require("./user.model")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const app = express()

const authMiddleware = require("./auth.middleware")

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/FinalTaskApp")
    .then(() => {
        console.log("MongoDB connected successfully")
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error)
    })

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(201).json({
            message: "User registered successfully"
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message
        })
    }
})

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            "mysecretkey",
            {
                expiresIn: "1h"
            }
        )

        res.status(200).json({
            message: "Login successful",
            token: token
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: error.message
        })
    }
})

app.post("/tasks", authMiddleware, async (req, res) => {

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

app.get("/tasks", authMiddleware, async (req, res) => {

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

app.get("/tasks/:id", authMiddleware, async (req, res) => {

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

app.put("/tasks/:id", authMiddleware, async (req, res) => {

    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                status: req.body.status
            },
            {
                new: true
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

app.delete("/tasks/:id", authMiddleware, async (req, res) => {

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


const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})