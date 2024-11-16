import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
    const location = useLocation();
    const [title, setTitle] = useState("");

    useEffect(() => {
        // Update title based on the current route
        switch (location.pathname) {
            case "/pmreport":
                setTitle("Preventive Maintenance Summary Report");
                break;
            case "/hcreport":
                setTitle("Health Check Maintenance Summary Report");
                break;
            case "/pmCheckpointHistory":
                setTitle("Preventive Maintenance Report");
                break;
            case "/hcCheckpointHistory":
                setTitle("Health Check Maintenance Report");
                break;
            default:
                setTitle("Mould Maintenance");
        }
    }, [location.pathname]); // Runs when location.pathname changes

    return (
        <AppBar position="static" sx={{
          backgroundColor: "#00008b", // Use sx for custom styles
          color: "#ffffff", // Set the text color to white for visibility
      }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {title} {/* Display the dynamic title */}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
