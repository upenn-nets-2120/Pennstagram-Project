import styled from 'styled-components';
import { headerSize } from '../../constants/headerSize';

export const MainStyled = styled.div`
    width: 100vw;
    height: ${100 - headerSize}vh;
    display: flex;
    flex-direction: column;
    align-items: top;
`;
