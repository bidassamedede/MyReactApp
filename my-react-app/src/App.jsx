import { useState } from "react";
import abi from "./abi.json";
import "./App.css";
import { ethers } from "ethers";

function App() {
    const [userInput, setUserInput] = useState("");
    const [retrievedMessage, setRetrievedMessage] = useState("");

    const contractAdress = "0x32871De03345ECfba742e1BC163E66C2903F7640";

    // Function to request MetaMask account access
    async function requestAccounts() {
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed!");
            return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    // Function to set a message on the contract
    async function setUserMessage() {
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed!");
            return;
        }

        await requestAccounts();

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(contractAdress, abi, signer);
        try {
            const tx = await contract.setMessage(userInput);
            const receipt = await tx.wait();
            console.log("Transaction successful:", receipt);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    // Function to retrieve a message from the contract
    async function getUserMessage() {
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed!");
            return;
        }

        await requestAccounts();

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAdress, abi, provider);

        try {
            const message = await contract.getMessage();
            setRetrievedMessage(message);
            console.log("Message retrieved successfully:", message);
        } catch (error) {
            console.error("Failed to retrieve message:", error);
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Set your message"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={setUserMessage}>Set Message</button>
            <button onClick={getUserMessage}>Get Message</button>
            <p style={{ color: "red" }}>Retrieved Message: {retrievedMessage}</p>
        </div>
    );
}

export default App;
