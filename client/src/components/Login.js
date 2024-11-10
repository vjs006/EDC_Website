// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import './Login.css'; // Import the CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting login for:", username);

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Login successful!');
                localStorage.setItem('token', data.token); // Store token

                // Redirect to the admin page after successful login
                navigate("/admin");
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage('Login failed.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="input-field"
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default Login;
