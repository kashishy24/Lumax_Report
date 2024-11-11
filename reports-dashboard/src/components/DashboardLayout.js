// src/components/DashboardLayout.js
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => (
    <Box 
        display="flex" 
        width="100vw" 
        height="100vh" 
        overflow="hidden" 
        bgcolor="#f4f6f8"
    >
        <CssBaseline />
        <Sidebar />
        <Box flexGrow={1} display="flex" flexDirection="column" height="100vh">
            <Navbar />
            <Box 
                padding={3} 
                flexGrow={1} 
                height="100%" 
                overflow="hidden" // Remove vertical scroll
            >
                {children}
            </Box>
        </Box>
    </Box>
);

export default DashboardLayout;
