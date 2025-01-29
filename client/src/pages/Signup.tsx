import React, { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement signup logic (e.g., API call to create user)
    console.log(`User signed up with email: ${email}`);
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;