import styled from 'styled-components';

interface TabStyledProps {
    active: boolean;
}

export const TabStyled = styled.div<TabStyledProps>`
    width: 33%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-bottom: 3px solid white;
    background-image: linear-gradient(to bottom, rgb(218, 218, 218), rgb(218, 218, 218), rgb(255, 255, 255));
    margin: 3px;
    ${({ active }) => active && `
        background-image: linear-gradient(to bottom, rgb(218, 218, 218), rgb(218, 218, 218), rgb(132, 218, 233));
        border-bottom: 3px solid rgb(76, 214, 238);
        &:hover {
            background-image: linear-gradient(to bottom, rgb(218, 218, 218), rgb(218, 218, 218), rgb(132, 218, 233));
            border-bottom: 3px solid rgb(76, 214, 238);
        }
        &:active {
            background-image: linear-gradient(to bottom, rgb(218, 218, 218), rgb(218, 218, 218), rgb(57, 97, 104));
            border-bottom: 3px solid rgb(41, 51, 53);
        }
    `}
`;
