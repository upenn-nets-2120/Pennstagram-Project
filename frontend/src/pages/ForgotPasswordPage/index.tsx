import React, { useState } from 'react';
import styled from 'styled-components';
import config from '../../config.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const ForgotPasswordForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
    gap: 15px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const ForgotPasswordPage: React.FC = () => {
    const rootURL = config.serverRootURL;
    const navigate = useNavigate(); 

    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            localStorage.setItem('email', email);
            const response = await axios.post(`${rootURL}/login/forgot-password`, { email });
            if (response.status === 200) {
                alert('Password reset link has been sent to your email.');
                navigate('/verification');
            } else {
                alert('Failed to send password reset link.');
            }
        } catch (error) {
            alert('Failed to send password reset link.');
        }
    };

    return (
        <ForgotPasswordContainer>
            <ForgotPasswordForm onSubmit={handleForgotPassword}>
                <h2>Reset Password</h2>
                <InputField
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
            </ForgotPasswordForm>
        </ForgotPasswordContainer>
    );
};

export default ForgotPasswordPage;
