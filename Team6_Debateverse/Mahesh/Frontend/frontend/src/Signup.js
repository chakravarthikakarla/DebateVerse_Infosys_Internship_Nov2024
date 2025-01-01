import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';


function Signup() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' 
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");  // State to hold success message

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (isSubmitting && Object.keys(errors).length === 0) {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    // If signup is successful, display success message
                    setSuccessMessage("Registration link has been sent to your account. Please click on it to confirm registration.");
                    setIsSubmitting(false);
                })
                .catch(err => {
                    if (err.response && err.response.status === 400) {
                        setErrors({ email: "User  already exists with this email." });
                    } else {
                        console.error(err);
                    }
                    setIsSubmitting(false);
                });
        }
    }, [errors, isSubmitting, navigate, values]);

    return (
        <div className='d-flex justify-content-center align-items-center bg-gradient vh-100'>
            <div className='card shadow-lg p-4 rounded w-25'>
                <h2 className='text-center mb-4'>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name='email'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name='password'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='confirmPassword'><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name='confirmPassword'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword}</span>}
                    </div>

                    <button type='submit' className='btn btn-primary w-100'>Signup</button>
                    <p className='text-center mt-3'>You agree to our terms and policies</p>
                    <Link to="/" className='btn btn-light border w-100 text-decoration-none'>Login</Link>
                </form>

                {successMessage && (
                    <div className='alert alert-success mt-3'>
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Signup;
