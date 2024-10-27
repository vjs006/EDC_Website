const express = require("express")
const app = express()
const mongoose = require("mongoose")
const RegistrationModel = require('./models/Registrations')
app.use(express.json());
const cors = require('cors');
app.use(cors());
mongoose.connect("your-mongodb-connection-string")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB connection error:", err));

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


app.listen(3001, ()=>{
    console.log("Server Runs on port " + 3001 + "!")
});
