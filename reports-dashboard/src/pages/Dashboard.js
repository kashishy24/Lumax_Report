// src/pages/Dashboard.js
import { Box, Typography, Grid, Paper } from "@mui/material";
import DataTable from "../components/DataTable";
import Chart from "../components/Charts";

const Dashboard = () => (
    <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">Dashboard</Typography>
        
        <Grid container spacing={4}>
            {/* Sales Chart Section */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom>Sales Chart</Typography>
                    <Chart />
                </Paper>
            </Grid>
            
            {/* Sales Data Table Section */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom>Sales Data</Typography>
                    <DataTable />
                </Paper>
            </Grid>
        </Grid>
    </Box>
);

export default Dashboard;
