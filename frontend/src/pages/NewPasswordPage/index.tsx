import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config.json';


const NewPasswordContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const NewPasswordForm = styled.form`
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

const NewPasswordPage: React.FC = () => {
    const rootURL = config.serverRootURL;
    const navigate = useNavigate(); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        const email = localStorage.getItem('email');
        localStorage.removeItem('email');
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.put(`${rootURL}/login/new-password`, { email,
                newPassword,
            });

            if (response.status === 200) {
                alert('Password reset successful');
                navigate('/login');
            } else {
                alert('Password reset failed');
            }
        } catch (error) {
            alert('An error occurred while resetting the password');
        }
    };

    return (
        <NewPasswordContainer>
            <NewPasswordForm onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <InputField
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
            </NewPasswordForm>
        </NewPasswordContainer>
    );
};

export default NewPasswordPage;
