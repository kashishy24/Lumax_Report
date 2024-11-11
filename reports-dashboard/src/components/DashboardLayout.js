// src/components/DashboardLayout.js
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => (
    <Box display="flex" minHeight="100vh" bgcolor="#f4f6f8">
        <CssBaseline />
        <Sidebar />
        <Box flexGrow={1}>
            <Navbar />
            <Box padding={3}>{children}</Box>
        </Box>
    </Box>
);

export default DashboardLayout;
