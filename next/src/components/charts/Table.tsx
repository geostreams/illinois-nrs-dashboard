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
    boldenRows: string[];
    keepAsString: string[];
}

// Quotes are added upstream to preserve leading zeros (e.g. USGS IDs)
const QUOTED_NUMERIC_STRING = /^(['"])(\d.*)\1$/;

const formatCellValue = (value: string | number | undefined, keepAsString: boolean): string | number => {
    if (typeof value === 'number' && !keepAsString) return formatNumberWithCommas(value);
    if (typeof value === 'string') return value.replace(QUOTED_NUMERIC_STRING, '$2');
    return value || '';
};

const TableComponent: React.FC<TableProps> = ({ tableData, boldenRows, keepAsString }) => {
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
        fontSize: '1.1rem',
    };

    const headerStyle = {
        backgroundColor: '#1B5C7C',
        color: 'white',
        fontWeight: 'bold',
        borderLeft: '1px solid #FFFFFF',
        borderRight: '1px solid #FFFFFF',
        borderBottom: 'none',
        fontFamily: 'Helvetica Neue, sans-serif',
        width: columnWidth,
        fontSize: '1.1rem',
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
                            {indexColumn}
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
                    {tableData.data.map((row, index) => {
                        const isBoldRow = boldenRows.includes(row.row);
                        const boldCellStyle = {
                            ...cellStyle,
                            fontWeight: isBoldRow ? 'bold' : 'normal',
                        };

                        return (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row" style={boldCellStyle} align="center">
                                    {row.row}
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column} align="center" style={boldCellStyle}>
                                        {formatCellValue(row[column], keepAsString.includes(column))}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponent;
