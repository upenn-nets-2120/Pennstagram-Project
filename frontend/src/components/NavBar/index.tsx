import React, { useContext } from 'react';
import styled from 'styled-components';
import { headerSize } from '../../constants/headerSize';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface NavBarProps {
    isLoggedIn: boolean;
    onLogout: () => void;
}

const TopBar = styled.nav`
    background-color: #f8f9fa;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: ${headerSize}vh;
`;

const NavLinks = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 20px;

    li {
        display: inline;
    }

    a {
        text-decoration: none;
        color: #333;
    }
`;

const LoginButton = styled.a`
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const LogoutButton = styled.button`
    background-color: #dc3545;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        onLogout();
        navigate('/');
    };
    return (
        <TopBar>
            <NavLinks>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                {isLoggedIn && (
                    <>
                        <li><a href="/friends">Friends</a></li>
                        <li><a href="/chat">Chat</a></li>
                        <li><a href="/notifications">Notifications</a></li>
                        <li><a href="/profile">Profile</a></li>
                        <li><a href="/search">Search</a></li>
                    </>
                )}
            </NavLinks>
            {isLoggedIn ? (
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            ) : (
                <LoginButton href="/login">Login</LoginButton>
            )}
        </TopBar>
    );
};

export default NavBar;
