const mongoose = require("mongoose")
const RegistrationSchema = new mongoose.Schema({
    regId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phNo: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    dept: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    refCode: {
        type: String,
    }
});

const RegistrationModel = mongoose.model("Registration", RegistrationSchema, "Registrations");
module.exports = RegistrationModel