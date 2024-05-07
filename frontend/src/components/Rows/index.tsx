import { RowsStyled } from './styled';

interface RowsProps {
    children: React.ReactNode;
}

const Rows: React.FC<RowsProps> = ({ children }) => {
    return (
        <RowsStyled>
            {children}
        </RowsStyled>
    );
};

export default Rows;
