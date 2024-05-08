import React from 'react';
import { LinkContainerStyled } from './styled';

interface LinkContainerProps {
    children: React.ReactNode,
    to: string;
}

const LinkContainer: React.FC<LinkContainerProps> = ({ children, to }) => {
    return (
        <LinkContainerStyled to={to}>
            {children}
        </LinkContainerStyled>

    );
};

export default LinkContainer;
