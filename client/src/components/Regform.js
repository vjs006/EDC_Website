import React, { useState } from "react";
import '../App.css';

const Regform = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [year, setYear] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const[email, setEmailId] = useState('');
    const [isEmailValid , setIsEmailValid] = useState(false);

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmailId(inputEmail);
        const isEmailValid = /^[a-zA-Z]+[0-9]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputEmail);
        setIsEmailValid(!isEmailValid);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        const isValidPhone = /^\d{10}$/.test(value);
        setPhoneError(!isValidPhone);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const department = e.target.dept.value.trim();
        //const email = e.target.email.value.trim();
        const college = e.target.college.value.trim();
        const refCode = e.target.refcode.value.trim();

        // Check if all fields have values
        if (!name || !phoneNumber || phoneError || !year || !department || !email || !college || !refCode) {
            alert('Please fill in all fields correctly.');
            return;
        }

        // Create a data object to send to the server
        const formData = {
            name,
            phoneNumber,
            year,
            department,
            email,
            college,
            refCode,
            regId : ""
        };

        try {
            // Send data to the server
            const response = await fetch('http://localhost:3001/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Submission Successful!');
                // Reset the form and state
                e.target.reset();
                setPhoneNumber('');
                setYear('');
                setSuccessMessage('');
            } else {
                // Handle server error
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Submission failed.'}`);
            }
        } catch (error) {
            alert('An error occurred while submitting the form.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="register-form">
            <h3>Event Registration Form</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>1. Full Name</label>
                    <input type="text" placeholder="Enter your full name" name="name" />
                </div>
                <div className="form-group">
                    <label>2. Phone Number  <br/>{isPhoneFocused && phoneError && (
                        <span className="error" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                            Please enter a valid 10-digit phone number.
                        </span>
                    )}</label>
                    <input
                        type="text"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => setIsPhoneFocused(false)}
                    />
                </div>
                <div className="form-group">
                    <label>3. Year</label>
                    <select name="year" value={year} onChange={handleYearChange}>
                        <option value="">Select your year</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>4. Department</label>
                    <input type="text" placeholder="Enter your department" name="dept" />
                </div>
                <div className="form-group">
                    <label>5. Email Id
                    <br/>
                    {isEmailValid && (
                        <span className="error" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                        Please enter a valid email id.
                    </span>
                    )}
                    

                    </label>
                    <input type="email" placeholder="Enter your email id" name="email" onChange={handleEmailChange}/>
                </div>
                <div className="form-group">
                    <label>6. College</label>
                    <input type="text" placeholder="Enter your college" name="college" />
                </div>
                <div className="form-group">
                    <label>7. Reference Code</label>
                    <input type="text" placeholder="Enter the reference code" name="refcode" />
                </div>
                <button type="submit">Submit</button>
            </form>
            {successMessage && <div className="success-message" style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
        </div>
    );
};

export default Regform;
