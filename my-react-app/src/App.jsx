import { useState } from "react";
import abi from "./abi.json";
import "./App.css";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x25D657363FC00bCd03a610D121c70f5754D46ec3";

function App() {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskText, setTaskText] = useState("");
    const [tasks, setTasks] = useState([]);
    const [account, setAccount] = useState(null);

    async function requestAccounts() {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
    }

    async function addTask() {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        try {
            const tx = await contract.addTask(taskText, taskTitle, 0);
            await tx.wait();
            console.log("Task added successfully!");
            getMyTasks(); // Refresh tasks after adding
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    async function getMyTasks() {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        try {
            const data = await contract.getMyTask();
            setTasks(data);
            console.log("Tasks retrieved successfully:", data);
        } catch (error) {
            console.error("Error retrieving tasks:", error);
        }
    }

    async function deleteTask(taskId) {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }

        await requestAccounts();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        try {
            const tx = await contract.deleteTask(taskId);
            await tx.wait();
            console.log("Task deleted successfully!");
            getMyTasks(); // Refresh tasks after deletion
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Task Manager (Core Blockchain)</h1>
            {!account ? (
                <button onClick={requestAccounts}>Connect MetaMask</button>
            ) : (
                <>
                    <h3>Account: {account}</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                        />
                        <button onClick={addTask}>Add Task</button>
                    </div>
                    <h2>My Tasks</h2>
                    <ul>
                        {tasks.map((task, index) => (
                            <li key={index}>
                                <strong>{task.taskTitle}</strong> - {task.taskText}{" "}
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={getMyTasks}>Refresh Tasks</button>
                </>
            )}
        </div>
    );
}

export default App;
