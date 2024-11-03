const express = require("express")
const app = express()
const mongoose = require("mongoose")
const RegistrationModel = require('./models/Registrations')
app.use(express.json());
const cors = require('cors');
app.use(cors());
mongoose.connect("mongodb://localhost:27017/test")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "pran126387192879123x0alkjasfa09123";

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    });
}

app.get("/registrations", async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0){
            console.log("No query parameters - So fetchAll");
            const result = await RegistrationModel.find(); // No more callback, use await
            console.log(result);
            res.json(result);
        } else {
            // console.log(req.query); // Log the incoming query parameters
            const result = await RegistrationModel.find(req.query); // No more callback, use await
            res.json(result);
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle error
    }
});

app.post("/registrations", async (req, res) => {
    try {
        const registrationData = {...req.body}
        console.log(registrationData);
        const maxRegIdDoc = await RegistrationModel.aggregate([
            {
                $addFields: {
                    regIdInt: {
                        $toInt: { $substr: ["$regId", 3, -1] } // Extract numeric part starting from index 3
                    }
                }
            },
            { $sort: { regIdInt: -1 } }, // Sort by the numeric part in descending order
            { $limit: 1 } // Limit to the document with the highest regId
        ]);

        console.log(maxRegIdDoc);
        console.log(!req.body.regId);

        if (maxRegIdDoc.length == 0){
            registrationData.regId = "RID1";
        }
        else if(!req.body.regId){
            const numericPart = parseInt(maxRegIdDoc[0].regId.slice(3), 10); // Extract and convert number part to an integer
            registrationData.regId = "RID" + (numericPart + 1); // Generate the next regId
        }
        else{
            const found = await RegistrationModel.findOne({ regId: req.body.regId });
            if (found){
                res.status(201).json({ message: "RegId already exists." });
            }
        }
        const newRegistration = new RegistrationModel(registrationData);
        console.log(newRegistration);
        await newRegistration.save();
        console.log("saved");
        res.status(201).json({ message: "Inserted new registration successfully." });
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle error
    }
});

app.delete("/registrations", async (req, res) => {
    try {
        const { regId } = req.query; // Get regId from the request parameters

        // Attempt to find and delete the regId with the specified regId
        const result = await RegistrationModel.findOneAndDelete({ "regId": regId });

        // Check if a document was deleted
        if (!result) {
            return res.status(404).json({ message: "RegId not found." });
        }

        res.json({ message: "regId deleted successfully." });
    } catch (err) {
        console.error("Error in DELETE /Registrations/:regId:", err);
        res.status(500).json({ message: err.message });
    }
});


app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt with:", { username, password });

        // Find the user by email
        const user = await RegistrationModel.findOne({ email: username });
        if (!user) {
            console.log("No user found with the provided email.");
            return res.status(400).json({ message: "Invalid credentials." });
        }

        console.log("User Input Password:", password);
        console.log("Stored Password:", user.password);

        // Check if the stored password is hashed by looking for the bcrypt format
        let isPasswordHashed = user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

        // If the password is not hashed, hash it, update the database, and compare
        if (!isPasswordHashed) {
            console.log("Plaintext password found, hashing it for security.");

            // Hash the plain password and update the user record
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save();
        }

        // Now compare the provided password with the stored hash (whether updated or originally hashed)
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Password does not match.");
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: "1h" });
        console.log("Token generated:", token);

        res.json({ message: "Login successful", token, redirectTo: "/admin" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: err.message });
    }
});

// In server.js
app.get("/admin", async (req, res) => {
    try {
        const filter = {};

        // Build the filter object dynamically based on query parameters
        if (req.query.regId) filter.regId = req.query.regId;
        if (req.query.name) filter.name = new RegExp(req.query.name, "i"); // Case-insensitive
        if (req.query.phNo) filter.phNo = req.query.phNo;
        if (req.query.year) filter.year = req.query.year;
        if (req.query.dept) filter.dept = req.query.dept;
        if (req.query.email) filter.email = req.query.email;
        if (req.query.college) filter.college = new RegExp(req.query.college, "i"); // Case-insensitive
        if (req.query.refCode) filter.refCode = req.query.refCode;

        // Search in the database using the filter
        const users = await RegistrationModel.find(filter);
        res.json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users." });
    }
});


app.listen(3001, ()=>{
    console.log("Server Runs on port " + 3001 + "!")
});
