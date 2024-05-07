import styled from 'styled-components';

export interface ContentStyledProps {
    width?: string;
    marginTop?: string;
    padding?: string;
}

export const ContentStyled = styled.div<ContentStyledProps>`
    width: ${(props) => props.width || '60%'};
    margin-top: ${(props) => props.marginTop || '10%'};
    padding: ${(props) => props.padding || '5%'};
    display: flex;
    flex-direction: column;
    align-items: top;
    justify-content: center;
    border: 1px rgba(0, 0, 0, 0.3) solid;
`;
