import React from 'react';
import { NavBar, Main } from '../../components';
import styled from 'styled-components';





const FeedPage: React.FC = () => {


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
                    <h1>You can view your posts here!</h1>

                </div>
            </Main>
        </div>
    );
};

export default FeedPage;
