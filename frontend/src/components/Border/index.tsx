import React from 'react';
import { BorderStyled } from './styled';

interface BorderProps {
    children: React.ReactNode;
    thickness?: string;
    color?: string;
    sides?: string;
}

const Border: React.FC<BorderProps> = ({ thickness, color, sides, children }) => {
    return (
        <BorderStyled thickness={thickness} color={color} sides={sides}>
            {children}
        </BorderStyled>
    );
};

export default Border;
