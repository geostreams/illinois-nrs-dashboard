import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
interface PageDividerProps {
    width?: string | number;
    my?: string | number;
    mx?: string | number;
    label?: string;
}

export const PageDivider = ({
    width = '80%',
    my = '3rem',
    mx = '0',
    label,
}: PageDividerProps) => {
    return (
        <>
            {label ? (
                <Divider
                    sx={{
                        borderBottomWidth: '2px',
                    }}
                    style={{
                        width,
                        margin: `${my} ${mx}`,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            color: 'black',
                            fontFamily: 'Source Sans',
                            textTransform: 'uppercase',
                        }}
                    >
                        {label}
                    </Typography>
                </Divider>
            ) : (
                <Divider
                    sx={{
                        borderBottomWidth: '2px',
                    }}
                    style={{
                        width,
                        margin: `${my} ${mx}`,
                    }}
                />
            )}
        </>
    );
};
