import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Select, DatePicker, Button, Table, message, Space, Row, Col } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const PMReport = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');  // Changed to store MouldName
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch Mould Names from backend instead of Mould ID
    axios.get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))  // Expect MouldName from the backend
      .catch((error) => message.error('Error fetching mould names.'));
  }, []);

  const handleGenerateReport = () => {
    if (!mouldName || !startDate || !endDate) {
      message.warning("Please select Mould Name, Start Date, and End Date.");
      return;
    }

    // Fetch report data for Preventive Maintenance using MouldName instead of MouldID
    axios.post('http://localhost:5000/api/maintenance/pm', {
      mouldName,  // Passing MouldName here
      startTime: startDate.format('YYYY-MM-DD'),
      endTime: endDate.format('YYYY-MM-DD'),
    })
      .then((response) => {console.log(response.data); setReportData(response.data);})
      .catch((error) => message.error('Error fetching report data.'));
  };

  const columns = [
    { title: 'CheckList ID', dataIndex: 'CheckListID', key: 'CheckListID',onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'CheckList Name', dataIndex: 'CheckListName', key: 'CheckListName' ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })},
    { title: 'Mould Name', dataIndex: 'MouldName', key: 'MouldName' ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })},  // Changed column name to MouldName
    { title: 'User Name', dataIndex: 'UserName', key: 'UserName',onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } }) },
    { title: 'Status', dataIndex: 'PMStatus', key: 'Status',onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } }) },
    { title: 'Instance', dataIndex: 'Instance', key: 'Instance' ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })},
    { title: 'Remark', dataIndex: 'Remark', key: 'Remark',onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } }) },
    { title: 'Start Time', dataIndex: 'StartTime', key: 'StartTime',onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } }) },
    { title: 'End Time', dataIndex: 'EndTime', key: 'EndTime',onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } }) },
    { title: 'Duration', dataIndex: 'PMDuration', key: 'Duration' ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })},
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#e0e2e5', minHeight: '84vh' ,maxWidth:'57%'}}>
      <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Mould Name Dropdown, Start Date, and End Date all on one line */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontWeight: 'bold' }}>Mould Name</label>
            <Select
              placeholder="Select Mould Name"
              onChange={(value) => setMouldName(value)}  // Setting MouldName
              value={mouldName}
              style={{ width: '100%' }}
            >
              {mouldNameOptions.map((option) => (
                <Option key={option.MouldName} value={option.MouldName}>  {/* Using MouldName for value */}
                  {option.MouldName}  {/* Displaying MouldName */}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontWeight: 'bold' }}>Start Date</label>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(date) => setStartDate(date)}
              value={startDate}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontWeight: 'bold' }}>End Date</label>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(date) => setEndDate(date)}
              value={endDate}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        {/* Generate Report Button */}
        {/* <Button type="primary" onClick={handleGenerateReport} block style={{ marginTop: '24px',backgroundColor: '#00008b'  }}>
          Generate Report
        </Button> */}

<Row gutter={16} justify="end" style={{ marginTop: '3px' }}>
          <Col>
            <Button
              type="primary"
              onClick={handleGenerateReport}
              style={{ backgroundColor: '#00008b', padding: '5px 20px' }} // Smaller button style
            >
              Generate Report
            </Button>
          </Col>
        </Row>
      </Space>

      {/* Report Data Table */}
      <div style={{ marginTop: '24px' ,maxWidth:'100%'}}>
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="CheckListID"
          pagination={{ pageSize: 10 }} // Increased page size to display more rows per page
          bordered
          style={{ backgroundColor: '#fff' ,maxHeight:'50%'}}
          scroll={{ x: 1500,y:181 }} 
          title={() => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',textAlign:'center' }}>
              <strong>Preventive Maintenance CheckList </strong>
            </div>
          )}// Enables horizontal scrolling for larger tables
        />
      </div>
    </div>
  );
};
export default PMReport;
