import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import config from '../../config.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../entities/User';

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

const ForgotPasswordButton = styled.button`
    background-color: transparent;
    color: #007bff;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
    margin-top: -10px;

    &:hover {
        color: #0056b3;
    }
`;


const LoginPage: React.FC = () => {
    const rootURL = config.serverRootURL;
    const navigate = useNavigate(); 

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useContext(UserContext);

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
          console.log("User and pass", {username, password});
          const response = await axios.post(`${rootURL}/login`, {
            username: username,
            password: password
          });
          console.log("Status:", response.status);
          console.log(response);
          // console.log(response.status);
          // console.log("Response:", response);
          if (response.status === 200) {
            console.log('success!');
            console.log(response.data[0].userID);
            console.log(response.data);
            


            const user: User = {
                userID: response.data[0].userID || null,
                username: username || '',
                firstName: null,
                lastName: null,
                profilePic: null,
                salted_password: null,
                emailID: null,
                actors: undefined,
                birthday: null,
                affiliation: null,
                linked_actor_nconst: null,
                inviters: undefined,
                userProfilePic: null,
                userScore: null,
                userVisibility: null,
                sessionToken: null,
                follows_back: null,
                requested: null,
                online: null
            }

            login(user);

            navigate('/chat'); 
          } else if (response.status === 400){
            alert('Invalid username or password.'); 
          }
        } catch (error) {
          alert('Invalid username or password!');
        }  
      };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
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
                <SubmitButton type="submit">Submit</SubmitButton>
                <ForgotPasswordButton type="button" onClick={handleForgotPassword}>
                    Forgot Password?
                </ForgotPasswordButton>
            </LoginForm>
        </LoginContainer>
    );
};

export default LoginPage;
