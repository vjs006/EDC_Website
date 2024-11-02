
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
    phoneNumber: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    department: {
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
    event : {
        type : String,
        required : true,
    },
    refCode: {
        type: String,
    }
});

const RegistrationModel = mongoose.model("Registration", RegistrationSchema, "Registrations");
module.exports = RegistrationModel
