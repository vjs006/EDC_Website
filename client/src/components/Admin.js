// src/components/Admin.js
import React, { useState } from "react";

const Admin = () => {
    const [filters, setFilters] = useState({
        regId: "",
        name: "",
        phNo: "",
        year: "",
        dept: "",
        email: "",
        college: "",
        refCode: "",
    });
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        const queryString = Object.entries(filters)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        try {
            const response = await fetch(`http://localhost:3001/admin?${queryString}`);
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users);
                setMessage(data.users.length > 0 ? "" : "No users found.");
            } else {
                setMessage("Error fetching users.");
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Error fetching users.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Admin User Search</h2>
            <form onSubmit={handleSearch} style={styles.form}>
                {Object.keys(filters).map((key) => (
                    <div key={key} style={styles.inputContainer}>
                        <label style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input
                            name={key}
                            value={filters[key]}
                            onChange={handleChange}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            style={styles.input}
                        />
                    </div>
                ))}
                <button type="submit" style={styles.button}>Search</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
            <div style={styles.results}>
                {users.map(user => (
                    <div key={user._id} style={styles.userCard}>
                        <h3 style={styles.userName}>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Department: {user.dept}</p>
                        <p>Year: {user.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        fontSize: "24px",
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "10px",
        marginBottom: "20px",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: "14px",
        marginBottom: "4px",
        color: "#555",
    },
    input: {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
    },
    button: {
        gridColumn: "span 2",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    message: {
        fontSize: "16px",
        textAlign: "center",
        color: "#d9534f",
    },
    results: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "15px",
    },
    userCard: {
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "15px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    userName: {
        fontSize: "18px",
        margin: "0 0 10px",
        color: "#007bff",
    },
};

export default Admin;
