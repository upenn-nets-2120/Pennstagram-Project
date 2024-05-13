import React from 'react';
import { NavBar, Main } from '../../components';
import styled from 'styled-components';
import{ useAuth } from '../../contexts/AuthContexts';
import { log } from 'console';

// Styles
const StyledHeader = styled.header`
    background-color: #f8f9fa;
    padding: 20px 0;
    text-align: center;
`;

const Title = styled.h1`
    color: #343a40;
    font-size: 2.5em;
    margin-bottom: 0;
`;

const SubTitle = styled.h2`
    color: #6c757d;
    font-weight: normal;
    font-size: 1.2em;
`;

const AnchorButton = styled.a`
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border: none;
    padding: 12px 20px;
    margin: 0 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1em;
    display: inline-block;

    &:hover {
        background-color: #0056b3;
    }
`;

const ButtonContainer = styled.div`
    margin-top: 20px;
`;



const HomePage: React.FC = () => {
    const { isLoggedIn, logout } = useAuth(); // Use the auth context

    return (
        <div>
            <StyledHeader>
                <Title>Welcome to InstaLite</Title>
                <SubTitle>The simple, fast and secure photo sharing app</SubTitle>
                <NavBar isLoggedIn={isLoggedIn} onLogout={logout} />
            </StyledHeader>
            <Main>
                <ButtonContainer>
                    {!isLoggedIn && (
                        <>
                            <AnchorButton href="/register">Register</AnchorButton>
                            <AnchorButton href="/login">Login</AnchorButton>
                        </>
                    )}
                </ButtonContainer>
            </Main>
        </div>
    );
};

export default HomePage;
