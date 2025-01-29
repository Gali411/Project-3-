import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

import Auth from '../utils/auth';

const Signup = () => {
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await registerUser({
                variables: { ...formState },
            });
 
            Auth.setToken(data.registerUser.token); // Save the token
            window.location.href = '/'; // Redirect on success
        } catch (err) {
            console.error('Error registering user:', err);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formState.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formState.password}
                    onChange={handleChange}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Signup'}
                </button>
            </form>
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default Signup;

