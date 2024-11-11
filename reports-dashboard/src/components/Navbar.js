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

      {/* Navigation Menu */}
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/report">Report</Link>
        </Menu.Item>
      </Menu> */}
    </div>
  </Header>
);

export default Navbar;
