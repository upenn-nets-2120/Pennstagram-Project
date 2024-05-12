import React, { useContext } from 'react';
import { NavBar, Main } from '../../components';
import styled from 'styled-components';



const AnchorButton = styled.a`
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border: none;
    padding: 10px 15px;
    margin-right: 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const HomePage: React.FC = () => {


    return (
        <div>
            {/* Title */}
            <header>
                <h1>Welcome to InstaLite</h1>
                <NavBar />
            </header>

            {/* Main Section */}
            <Main>
                <div>
                    <h1>Or Here: Welcome to InstaLite</h1>
                    <AnchorButton href="/register">Register</AnchorButton>
                    <AnchorButton href="/login">Login</AnchorButton>
                </div>
            </Main>
        </div>
    );
};

export default HomePage;
