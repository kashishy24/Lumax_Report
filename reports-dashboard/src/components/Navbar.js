// src/components/Navbar.js
import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => (
  <Header style={{ backgroundColor: "#00008b", padding: "0 20px" ,maxWidth:'158vh'}}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Title level={3} style={{ color: "#fff", margin: 0 ,paddingTop:"13px"}}>
        Mould Maintenance Reports
      </Title>

      
    </div>
  </Header>
);

export default Navbar;
