import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const MiniUserCardStyled = styled(Link)`
    height: 80%;
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-decoration: none;
    background-color: ${({ theme }) => theme.backgroundColor};
    &:hover {
        background-color: ${({ theme }) => theme.quaternaryColor};
    }
`;

export default MiniUserCardStyled;
