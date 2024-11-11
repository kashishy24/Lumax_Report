// src/components/DataTable.js
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const DataTable = ({ mouldId, checklist }) => {
    // Sample data
    const allData = [
        { mouldId: "Mould 1", checklist: "PM Checklist", task: "Check Oil Level", status: "Completed" },
        { mouldId: "Mould 1", checklist: "Health Check Checklist", task: "Check Temperature", status: "Pending" },
        { mouldId: "Mould 2", checklist: "PM Checklist", task: "Inspect Valves", status: "Completed" },
        // Add more rows as necessary
    ];

    // Filter data based on selections
    const filteredData = allData.filter(
        (row) => row.mouldId === mouldId && row.checklist === checklist
    );

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ bgcolor: "primary.main" }}>
                    <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Task</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.length > 0 ? (
                        filteredData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.task}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} align="center">
                                No data available for the selected options
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
