import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSignInMutation, useSignUpMutation } from '../redux/backendAPI';  // Import your sign-up mutation
import { setUserProfile } from '../redux/UserProfileSlice';


function SignInAuthCard() {

    const [credentials, setCredentials] = useState({

        email: '',
        password: '',

    });

    const userData = useSelector((state) => state.User.userProfile)
    const [error, setError] = useState('');  // State to hold error messages
    const [signIn, { isLoading }] = useSignInMutation();  // RTK Query hook for sign-up mutation
    const dispatch = useDispatch();  // To dispatch user profile
    const navigate = useNavigate();  // To navigate after successful sign-up



    useEffect(() => {

        console.log('sign In userdata ', userData)
        if (userData) {

            navigate('/')
        }
    }, [userData])
    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Validate form data
    const validateForm = () => {
        const { email, password } = credentials;

        if (!email || !password) {
            return 'All fields are required';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }


        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }

        return ''; // No errors
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any previous errors

        // Perform validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return; // If validation fails, stop the form submission
        }

        try {
            const user = await signIn(credentials).unwrap(); // Call the sign-up mutation
            console.log(user)
            dispatch(setUserProfile(user));  // Store user profile globally in Redux
            navigate('/');  // Redirect to the home page after successful sign-up
        } catch (err) {
            console.error('Sign-in failed:', err.data);
            setError(err.data.message);
        }
    };



    return (
        <div className='authcard'>
            <h3 className='title'>Sign In</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <TextField
                    required name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    id="email" label="email" variant="outlined" />
                <TextField
                    required name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    id="password" label="password" variant="outlined" type='password' />
            </div>
            <Button variant="contained"
                onClick={handleSubmit}
                sx={{ backgroundColor: 'black' }}>Submit</Button>
            {error &&
                <div style={{ color: 'white', backgroundColor: 'red', padding: '5px' }} >{error}</div>
            }
            <p style={{ color: 'gray', }}>Don't have an Account ?
                <span
                    style={{ cursor: 'pointer', color: '#6e6e6e', fontWeight: 700 }}
                    onClick={() => navigate('/signup')}
                >SignUp</span></p>
            <p style={{ fontWeight: '500', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >go back to store</p>
        </div>
    )
}

function SignUpAuthCard() {

    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
    });

    const userData = useSelector((state) => state.User.userProfile)
    const [error, setError] = useState('');  // State to hold error messages
    const [signUp, { isLoading }] = useSignUpMutation();  // RTK Query hook for sign-up mutation
    const dispatch = useDispatch();  // To dispatch user profile
    const navigate = useNavigate();  // To navigate after successful sign-up



    useEffect(() => {

        console.log('sign Up userdata ', userData)
        if (userData) {

            navigate('/')
        }
    }, [userData])
    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Validate form data
    const validateForm = () => {
        const { username, email, password, confirmpassword } = credentials;

        if (!username || !email || !password || !confirmpassword) {
            return 'All fields are required';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }

        if (password !== confirmpassword) {
            return 'Passwords do not match';
        }

        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }

        return ''; // No errors
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any previous errors

        // Perform validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return; // If validation fails, stop the form submission
        }

        try {
            const user = await signUp(credentials).unwrap(); // Call the sign-up mutation
            console.log(user)
            dispatch(setUserProfile(user));  // Store user profile globally in Redux
            navigate('/');  // Redirect to the home page after successful sign-up
        } catch (err) {
            console.error('Sign-up failed:', err.data);
            setError(err.data.message);
        }
    };



    return (
        <div className='authcard'>
            <h3 className='title'>Sign Up</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <TextField
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    id="username" name="username" label="User Name" variant="outlined" />
                <TextField
                    required name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    id="email" label="email" variant="outlined" />
                <TextField
                    required name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    id="password" label="password" variant="outlined" type='password' />
                <TextField
                    required name='confirmpassword'
                    value={credentials.confirmpassword}
                    onChange={handleChange}
                    id="confirmpassword" label="Confirm password" variant="outlined" type='password' />
            </div>
            {error &&
                <div style={{ color: 'white', backgroundColor: 'red', padding: '5px' }} >{error}</div>
            }
            <Button variant="contained" sx={{ backgroundColor: 'black' }} onClick={handleSubmit}>Submit</Button>
            <p style={{ color: 'gray', }}>Already have an Account ?
                <span
                    style={{ cursor: 'pointer', color: '#6e6e6e', fontWeight: 700 }}
                    onClick={() => navigate('/signin')}
                >SignIn</span></p>
            <p style={{ fontWeight: '500', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >go back to store</p>
        </div>
    )
}

export { SignInAuthCard, SignUpAuthCard }