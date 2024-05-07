import styled from 'styled-components';

export const RowStyled = styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 2px;
    padding-left: 1%;
    padding-right: 1%;
    align-items: top;
    justify-content: left;
    box-sizing: border-box;
    background-color: rgb(223, 225, 227);
    border: 1px solid white;
    transition: background-color 0.3s ease;

    &:hover {
        background-image: linear-gradient(to right, rgb(223, 225, 227), rgb(41, 93, 135));
    }
`;
