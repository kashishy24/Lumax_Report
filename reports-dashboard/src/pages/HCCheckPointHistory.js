import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Select, Button, Table, message, Space, Row, Col } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const HCCheckpointHistory = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [instanceOptions, setInstanceOptions] = useState([]); // State for instance options
  const [monthOptions, setMonthOptions] = useState([]);  // State for month options
  const [mouldName, setMouldName] = useState('');
  const [instanceNo, setInstanceNo] = useState('');
  const [month, setMonth] = useState('');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch Mould Names from backend
    axios.get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch((error) => message.error('Error fetching mould names.'));

    // Fetch Instance No from backend
    axios.get('http://localhost:5000/api/instance')
      .then((response) => setInstanceOptions(response.data))
      .catch((error) => message.error('Error fetching instance numbers.'));

    // Fetch available months from backend
    axios.get('http://localhost:5000/api/month')  // Updated to match the API endpoint you specified
      .then((response) => {
        // Set the month options based on the API response format
        setMonthOptions(response.data.map(item => item.Month_Name));
      })
      .catch((error) => message.error('Error fetching month options.'));
  }, []);

  const handleGenerateReport = () => {
    if (!mouldName || !instanceNo || !month) {
      message.warning("Please select Mould Name, Instance No, and Month.");
      return;
    }

    // Fetch report data for HC Checkpoint History from the correct API endpoint
    axios.post('http://localhost:5000/api/mould-executed-hc', {
      mouldName,
      instance: instanceNo,
      month,
    })
      .then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
      .catch((error) => message.error('Error fetching report data.'));
  };

  const columns = [
   // { title: 'UID', dataIndex: 'UID', key: 'UID',ellipsis: true ,width: 60 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })   },
    { title: 'CheckListName', dataIndex: 'CheckListName', key: 'CheckListName' ,ellipsis: true,width: 140 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })   },
    { title: 'CheckPointID', dataIndex: 'CheckPointID', key: 'CheckPointID' ,ellipsis: true,width: 130 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })   },
    { title: 'CheckPointName', dataIndex: 'CheckPointName', key: 'CheckPointName',ellipsis: true,width: 150 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'CheckPointCategory', dataIndex: 'CheckPointCategory', key: 'CheckPointCategory' ,ellipsis: true,width: 170 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'StandardCondition', dataIndex: 'StandardCondition', key: 'StandardCondition',ellipsis: true,width: 160 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })   },
    { title: 'CheckingMethod', dataIndex: 'CheckingMethod', key: 'CheckingMethod',ellipsis: true,width: 150 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'CheckPointType', dataIndex: 'CheckPointType', key: 'CheckPointType',ellipsis: true,width: 140 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'UOM', dataIndex: 'UOM', key: 'UOM',ellipsis: true,width: 70 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'UpperLimit', dataIndex: 'UpperLimit', key: 'UpperLimit',ellipsis: true,width: 120 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'LowerLimit', dataIndex: 'LowerLimit', key: 'LowerLimit' ,ellipsis: true,width: 120 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'Standard', dataIndex: 'Standard', key: 'Standard',ellipsis: true,width: 100 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'CheckPointValue', dataIndex: 'CheckPointValue', key: 'CheckPointValue',ellipsis: true,width: 150,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })   },
    { title: 'OKNOK', dataIndex: 'OKNOK', key: 'OKNOK',ellipsis: true,width: 90 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'Observation', dataIndex: 'Observation', key: 'Observation',ellipsis: true,width: 130 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
    { title: 'Instance', dataIndex: 'Instance', key: 'Instance',ellipsis: true,width: 100,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })   },
    { title: 'Timestamp', dataIndex: 'Timestamp', key: 'Timestamp' ,ellipsis: true,width: 130 ,onHeaderCell: () => ({ style: { backgroundColor: '#f5f5f5' } })  },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#e0e2e5', minHeight: '84vh' ,maxWidth:'41%' }}>
      <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Mould Name Dropdown, Instance No, and Month all on one line */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontWeight: 'bold' }}>Mould Name</label>
            <Select
              placeholder="Select Mould Name"
              onChange={(value) => setMouldName(value)}
              value={mouldName}
              style={{ width: '100%' }}
            >
              {mouldNameOptions.map((option) => (
                <Option key={option.MouldName} value={option.MouldName}>
                  {option.MouldName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontWeight: 'bold' }}>Instance No</label>
            <Select
              placeholder="Select Instance No"
              onChange={(value) => setInstanceNo(value)}
              value={instanceNo}
              style={{ width: '100%' }}
            >
              {instanceOptions.map((option) => (
                <Option key={option.Instance} value={option.Instance}>
                  {option.Instance}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <label style={{ fontWeight: 'bold' }}>Month</label>
            <Select
              placeholder="Select Month"
              onChange={(value) => setMonth(value)}
              value={month}
              style={{ width: '100%' }}
            >
              {monthOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
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
      <div style={{ marginTop: '24px', maxWidth: '100%' }}>
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="UID"  // Use UID as the unique key for rows
          pagination={{ pageSize: 10 }}
          bordered
          style={{ backgroundColor: '#fff' }}
         // scroll={{ x: 1500 }} 
          scroll={{ x: 1500, y: 181 }}  // Horizontal scrolling for wide tables
          title={() => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',textAlign:'center' }}>
              <strong>Health Check CheckPoint History</strong>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default HCCheckpointHistory;
