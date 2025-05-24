import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatNumberWithCommas } from '@/utils/formatters';

// Define a proper type for the data structure
interface DataRow {
    row: string;
    [key: string]: string | number;
}

interface TableProps {
    tableData: {
        data: DataRow[];
        columns: string[];
    };
}

const TableComponent: React.FC<TableProps> = ({ tableData }) => {
    // Get all unique columns from the data for columns
    const columns = tableData.columns.slice(1);
    const indexColumn = tableData.columns[0];

    // Calculate column width based on total number of columns (including Category column)
    const columnWidth = `${100 / (columns.length + 1)}%`;

    const cellStyle = {
        border: '1px solid #1B5C7C',
        padding: '8px',
        borderTop: 'none',
        width: columnWidth,
    };

    const headerStyle = {
        backgroundColor: '#1B5C7C',
        color: 'white',
        fontWeight: 'bold',
        borderLeft: '1px solid #FFFFFF',
        borderRight: '1px solid #FFFFFF',
        borderBottom: 'none',
        fontFamily: 'Helvetica Neue',
        width: columnWidth,
    };

    return (
        <TableContainer component={Paper} sx={{ borderRadius: '0px' }}>
            <Table aria-label="data table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            style={{
                                ...headerStyle,
                                borderLeft: '1px solid #1B5C7C',
                            }}
                        >
                            {indexColumn !== '' ? indexColumn : 'Category'}
                        </TableCell>
                        {columns.map((column, index) => (
                            <TableCell
                                key={column}
                                align="center"
                                style={{
                                    ...headerStyle,
                                    borderRight:
                                        index === columns.length - 1 ? '1px solid #1B5C7C' : '1px solid #FFFFFF',
                                }}
                            >
                                {column}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.data.map((row) => (
                        <TableRow key={row.row}>
                            <TableCell component="th" scope="row" style={cellStyle} align="center">
                                {row.row}
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell key={column} align="center" style={cellStyle}>
                                    {typeof row[column] === 'number'
                                        ? formatNumberWithCommas(row[column])
                                        : row[column] || ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponent;
