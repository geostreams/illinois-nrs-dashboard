import Divider from '@mui/material/Divider';

interface PageDividerProps {
    width?: string | number;
    my?: string | number;
    mx?: string | number;
}

export const PageDivider = ({
    width = '80%',
    my = '3rem',
    mx = '0',
}: PageDividerProps) => {
    return (
        <Divider
            sx={{
                borderBottomWidth: '2px',
                height: '2px',
            }}
            style={{
                width,
                margin: `${my} ${mx}`,
            }}
        />
    );
};
