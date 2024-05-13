import React, { useState } from 'react';
import styled from 'styled-components';
import config from '../../config.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerificationContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const VerificationForm = styled.form`
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

const VerificationPage: React.FC = () => {
    const rootURL = config.serverRootURL;
    const navigate = useNavigate(); 

    const [code, setCode] = useState('');

    const handleVerification = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            console.log("Code: ", code);
            const response = await axios.get(`${rootURL}/login/verify-code/${code}}`);
            if (response.status === 200) {
                alert('Verification successful.');
                navigate('/new-password');
            } else {
                alert('Invalid verification code.');
            }
        } catch (error) {
            alert('Verification failed.');
            let errorMessage: string;
            
            // Type guard to ensure it's an instance of AxiosError
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                errorMessage = error.response?.data.error || 'An error occurred';
                console.error(`Error Verifying: ${errorMessage}`);
                const errorDetails = {
                    message: errorMessage,
                    status: error.response?.status || 'Unknown status'
                };
                return errorDetails;
            } else {
                // Generic error handling
                errorMessage = 'An unexpected error occurred';
                console.error(errorMessage);
                return { message: errorMessage, status: 'Unknown status' };
            }
        }
    };

    return (
        <VerificationContainer>
            <VerificationForm onSubmit={handleVerification}>
                <h2>Verify Your Account</h2>
                <p>We sent you a verification code, please enter the 6-digit code:</p>
                <InputField
                    type="text"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
            </VerificationForm>
        </VerificationContainer>
    );
};

export default VerificationPage;
