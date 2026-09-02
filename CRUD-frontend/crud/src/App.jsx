import { useEffect, useState } from "react"
import "./App.css"

function App() {

    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("Pending")

    // Get tasks
    const getTasks = async () => {
        const response = await fetch("http://localhost:8080/tasks")
        const data = await response.json()

        setTasks(data)
    }

    useEffect(() => {
        getTasks()
    }, [])

    // Add task
    const addTask = async (e) => {
        e.preventDefault()

        const newTask = {
            id: Date.now(),
            title: title,
            status: status
        }

        await fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        })

        setTitle("")
        setStatus("Pending")

        getTasks()
    }

    // Delete task
    const deleteTask = async (id) => {

        await fetch(`http://localhost:8080/tasks/${id}`, {
            method: "DELETE"
        })

        getTasks()
    }

    return (
        <div className="container">

            <h1>Task Manager</h1>

            <form onSubmit={addTask}>

                <input
                    type="text"
                    placeholder="Enter task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <button>Add Task</button>

            </form>

            {tasks.map((task) => (

                <div className="task" key={task._id}>

                    <h3>{task.title}</h3>

                    <p>Status: {task.status}</p>

                    <button onClick={() => deleteTask(task._id)}>
                        Delete
                    </button>

                </div>

            ))}

        </div>
    )
}

export default App
