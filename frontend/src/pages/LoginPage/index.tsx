import React, { useState } from 'react';
import styled from 'styled-components';
import config from '../../config.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const LoginForm = styled.form`
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


const LoginPage: React.FC = () => {
    const rootURL = config.serverRootURL;
    const navigate = useNavigate(); 

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
          const response = await axios.post(`${rootURL}/login`, {
            username: username,
            password: password
          });

          console.log(response.status);
          console.log(response);
          if (response.status === 200) {
            console.log('success!')
            navigate(`/${username}/feed`); 
          } else {
            alert('Log in failed'); 
          }
        } catch (error) {
          alert('Log in failed: ' + error);
        }  
      };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleLogin}>
                <h2>Login</h2>
                <InputField
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <SubmitButton type="submit" onClick={handleLogin}>Submit</SubmitButton>
            </LoginForm>
        </LoginContainer>
    );
};

export default LoginPage;
