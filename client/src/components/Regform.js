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
    const[event,setEvent] = useState('');

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

    const handleEventChange = (e) => {
        setEvent(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const department = e.target.dept.value.trim();
        //const email = e.target.email.value.trim();
        const college = e.target.college.value.trim();
        const refCode = e.target.refcode.value.trim();

        // Check if all fields have values
        if (!name || !phoneNumber || phoneError || !year || !department || !email || !college || !refCode || !event) {
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
            event,
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
        <div class="container">
      <div class="text">
         Registration Form
      </div>
      <form onSubmit={handleSubmit}>
         <div class="form-row">
            <div class="input-data">
                <input type="text" name = "name" required/>
                <div class="underline"></div>
                <label for="">Full Name</label>
                </div>
            
         </div>
         <div class="form-row">
         <div class="input-data">
                <input type="number" name = "phno" value={phoneNumber}
                        onChange={handlePhoneChange}
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => setIsPhoneFocused(false)} required/>
                <div class="underline"></div>
                <label for="">Phone Number</label>
                </div>
         </div>
         
         
         <div class="form-row">
            <div class="input-data">
               <select name="year" value={year} onChange={handleYearChange}>
                        <option value="">Select your year</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value = "Mtech1">Mtech Int.1</option>
                        <option value = "Mtech2">Mtech Int.2</option>
                    </select>
            </div>
         </div>
          <div class="form-row">
          <div class="input-data">
                <input type="text" name = "dept" required/>
                <div class="underline"></div>
                <label for="">Department</label>
                </div>
         </div>
          <div class="form-row">
          <div class="input-data">
                <input type="text" name = "email" onChange={handleEmailChange} required/>
                <div class="underline"></div>
                <label for="">Email</label>
                </div>
         </div>
         <div class="form-row">
         <div class="input-data">
                <input type="text" name = "college"  required/>
                <div class="underline"></div>
                <label for="">College</label>
                </div>
         </div>
          <div class="form-row">
            <div class="input-data">
               <select name="event" value={event} onChange={handleEventChange}>
                        <option value="">Select event</option>
                        <option value="Marketize">Marketize</option>
                        <option value="Mela">Mela</option>
                        <option value="Udaan">Udaan</option>
                        <option value="Sycon">Sycon</option>
                        <option value = "Ventura">Ventura</option>
                    </select>
            </div>
         </div>
         <div class="form-row">
         <div class="input-data">
                <input type="text" name = "refcode"  required/>
                <div class="underline"></div>
                <label for="">Reference Code</label>
                </div>
         </div>
         <button type="submit">Submit</button>
      </form>
      </div>
    );
};

export default Regform;
