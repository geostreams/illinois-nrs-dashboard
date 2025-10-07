import React from 'react';
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

interface RowSpanTableProps {
    tableData: {
        data: DataRow[];
        columns: string[];
    };
    boldenRows?: string[];
    rowSpanColumn: string;
}

const RowSpanTable: React.FC<RowSpanTableProps> = ({ tableData, boldenRows, rowSpanColumn }) => {
    // Get all unique columns from the data for columns, excluding the rowSpanColumn
    const columns = tableData.columns.slice(1).filter((column) => column !== rowSpanColumn);
    const indexColumn = tableData.columns[0];

    // Calculate column width based on total number of columns (including Category column)
    const columnWidth = `${100 / (columns.length + 1)}%`;

    // Group data by the specified rowSpanColumns value
    const groupedData = tableData.data.reduce(
        (groups, row) => {
            const groupKey = row[rowSpanColumn] as string;
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(row);
            return groups;
        },
        {} as Record<string, DataRow[]>
    );

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

    const subheadingStyle = {
        backgroundColor: '#E8F4F8',
        color: '#1B5C7C',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        padding: '12px 8px',
        border: '1px solid #1B5C7C',
        borderTop: 'none',
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: '0px',
                maxHeight: '600px',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            <Table aria-label="data table" stickyHeader>
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
                    {Object.entries(groupedData).map(([groupKey, groupRows]) => (
                        <React.Fragment key={groupKey}>
                            {/* Subheading row */}
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} style={subheadingStyle} align="left">
                                    {groupKey}
                                </TableCell>
                            </TableRow>
                            {/* Data rows for this group */}
                            {groupRows.map((row, index) => {
                                const isBoldRow = boldenRows?.includes(row.row) ?? false;
                                const boldCellStyle = {
                                    ...cellStyle,
                                    fontWeight: isBoldRow ? 'bold' : 'normal',
                                };

                                return (
                                    <TableRow key={`${groupKey}-${index}`}>
                                        <TableCell component="th" scope="row" style={boldCellStyle} align="center">
                                            {row.row}
                                        </TableCell>
                                        {columns.map((column) => (
                                            <TableCell key={column} align="center" style={boldCellStyle}>
                                                {typeof row[column] === 'number'
                                                    ? formatNumberWithCommas(row[column])
                                                    : row[column] || ''}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RowSpanTable;
