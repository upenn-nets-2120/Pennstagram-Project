import styled from 'styled-components';

interface BorderStyledProps {
  thickness?: string;
  color?: string;
  sides?: string;
}

export const BorderStyled = styled.div<BorderStyledProps>`
  height: 100%;
  width: 100%;
  border-width: ${({ thickness }) => thickness || '1px'};
  border-style: solid;
  border-color: ${({ color }) => color || 'black'};
  border-top-width: ${({ sides }) => sides === 'top' || sides === 'vertical' ? '1px' : '0'};
  border-right-width: ${({ sides }) => sides === 'right' || sides === 'horizontal' ? '1px' : '0'};
  border-bottom-width: ${({ sides }) => sides === 'bottom' || sides === 'vertical' ? '1px' : '0'};
  border-left-width: ${({ sides }) => sides === 'left' || sides === 'horizontal' ? '1px' : '0'};
`;
