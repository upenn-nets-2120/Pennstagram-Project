import React from 'react';
import { ContentStyled, ContentStyledProps } from './styled';

interface ContentProps extends ContentStyledProps {
    children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children, ...styleProps }) => {
    return (
        <ContentStyled {...styleProps}>
            {children}
        </ContentStyled>
    );
};
  
export default Content;
