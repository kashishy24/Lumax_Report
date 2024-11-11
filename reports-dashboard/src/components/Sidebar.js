// src/components/Sidebar.js
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, FileSearchOutlined } from "@ant-design/icons";
import logo from "../img/logo.jpeg"; // Import your logo here

const { Sider } = Layout;

const Sidebar = () => (
  <Sider width={350} style={{ backgroundColor: "#00008b", height: "100vh", boxShadow: "4px 0px 20px rgba(0, 0, 0, 0.4)" }}>
    <div style={{ padding: "10px",textAlign:"center" }}>
      <img src={logo} alt="Logo" style={{ maxWidth: "60vw", height: "12vh" }} /> {/* Use the logo image */}
    </div>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ backgroundColor: "#00008b", borderRight: 0 }}>
      <Menu.Item key="1" icon={<HomeOutlined />} style={{ fontSize: "16px" }}>
        <Link to="/">Report</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<FileSearchOutlined />} style={{ fontSize: "16px" }}>
        <Link to="/pmreport">Preventive Maintenance Summary Report</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<FileSearchOutlined />} style={{ fontSize: "16px" }}>
        <Link to="/hcreport">Health Check Maintenance Summary Report</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<FileSearchOutlined />} style={{ fontSize: "16px" }}>
        <Link to="/pmCheckpointHistory">Preventive Maintenance Report</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<FileSearchOutlined />} style={{ fontSize: "16px" }}>
        <Link to="/hcCheckpointHistory"> Health Check Maintenance Report</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default Sidebar;
