import styled from 'styled-components';

export const RowStyled = styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 2px;
    padding: 10px; /* Simplify padding */
    align-items: center; /* Align items to the center */
    justify-content: space-between; /* Push the follow button to the end */
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.quaternaryColor};
    border: 1px solid ${({ theme }) => theme.lineColor};
    transition: background-color 0.3s ease;

    &:hover {
        background-image: linear-gradient(to right, ${({ theme }) => theme.tertiaryColor}, ${({ theme }) => theme.tertiaryColor});
    }
`;
