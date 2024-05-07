import React from 'react';
import { MainStyled } from './styled';

interface MainProps {
    children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
    return (
        <MainStyled>
            {children}
        </MainStyled>
    );
};
  
export default Main;
