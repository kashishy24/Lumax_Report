import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, message, Row } from 'antd';

const { Option } = Select;

const PMCheckpointHistory = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [instanceOptions, setInstanceOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');
  const [instanceNo, setInstanceNo] = useState('');
  const [month, setMonth] = useState('');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch(() => message.error('Error fetching mould names.'));

    axios.get('http://localhost:5000/api/instance')
      .then((response) => setInstanceOptions(response.data))
      .catch(() => message.error('Error fetching instance numbers.'));

    axios.get('http://localhost:5000/api/month')
      .then((response) => setMonthOptions(response.data.map(item => item.Month_Name)))
      .catch(() => message.error('Error fetching month options.'));
  }, []);

  const handleGenerateReport = () => {
    if (!mouldName || !instanceNo || !month) {
      message.warning("Please select Mould Name, Instance No, and Month.");
      return;
    }

    axios.post('http://localhost:5000/api/mould-executed-pm', {
      mouldName,
      instance: instanceNo,
      month,
    })
      .then((response) => setReportData(response.data))
      .catch(() => message.error('Error fetching report data.'));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#e0e2e5', minHeight: '84vh', maxWidth: '73vw' ,marginTop: '-15px', marginLeft: '-15px'}}>
      <Row gutter={16} justify="start" style={{ marginBottom: '16px', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Mould Name</label>
          <Select
            placeholder="Select Mould Name"
            onChange={(value) => setMouldName(value)}
            value={mouldName}
            style={{ width: '180px' }}
          >
            {mouldNameOptions.map((option) => (
              <Option key={option.MouldName} value={option.MouldName}>
                {option.MouldName}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Instance No</label>
          <Select
            placeholder="Select Instance No"
            onChange={(value) => setInstanceNo(value)}
            value={instanceNo}
            style={{ width: '180px' }}
          >
            {instanceOptions.map((option) => (
              <Option key={option.Instance} value={option.Instance}>
                {option.Instance}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Month</label>
          <Select
            placeholder="Select Month"
            onChange={(value) => setMonth(value)}
            value={month}
            style={{ width: '180px' }}
          >
            {monthOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          type="primary"
          onClick={handleGenerateReport}
          style={{ backgroundColor: '#00008b', padding: '4px 12px', height: '32px', lineHeight: '1' }}
        >
          Generate
        </Button>
      </Row>

      <div style={{ marginTop: '12px', maxWidth: '100%', maxHeight: '450px', overflowY: 'auto', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckListName</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckPointID</th>
              <th style={{ ...tableHeaderStyle, width: '120px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckPointName</th>
              <th style={{ ...tableHeaderStyle, width: '80px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckArea</th>
              <th style={{ ...tableHeaderStyle, width: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckPointItems</th>
              <th style={{ ...tableHeaderStyle, width: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckPointArea</th>
              <th style={{ ...tableHeaderStyle, width: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckingMethod</th>
              <th style={{ ...tableHeaderStyle, width: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>JudgementCriteria</th>
              <th style={{ ...tableHeaderStyle, width: '110px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckListType</th>
              <th style={{ ...tableHeaderStyle, width: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckPointType</th>
              <th style={{ ...tableHeaderStyle, width: '70px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>UOM</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>UpperLimit</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>LowerLimit</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Standard</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckPointValue</th>
              <th style={{ ...tableHeaderStyle, width: '70px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>OKNOK</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Observation</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Instance</th>
              <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index} style={rowStyle}>
                <td style={cellStyle}>{row.CheckListName}</td>
                <td style={cellStyle}>{row.CheckPointID}</td>
                <td style={cellStyle}>{row.CheckPointName}</td>
                <td style={cellStyle}>{row.CheckArea}</td>
                <td style={cellStyle}>{row.CheckPointItems}</td>
                <td style={cellStyle}>{row.CheckPointArea}</td>
                <td style={cellStyle}>{row.CheckingMethod}</td>
                <td style={cellStyle}>{row.JudgementCriteria}</td>
                <td style={cellStyle}>{row.CheckListType}</td>
                <td style={cellStyle}>{row.CheckPointType}</td>
                <td style={cellStyle}>{row.UOM}</td>
                <td style={cellStyle}>{row.UpperLimit}</td>
                <td style={cellStyle}>{row.LowerLimit}</td>
                <td style={cellStyle}>{row.Standard}</td>
                <td style={cellStyle}>{row.CheckPointValue}</td>
                <td style={cellStyle}>{row.OKNOK}</td>
                <td style={cellStyle}>{row.Observation}</td>
                <td style={cellStyle}>{row.Instance}</td>
                <td style={cellStyle}>{row.Timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        th, td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
};

const tableHeaderStyle = {
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '12px',
  textAlign: 'center',
  borderBottom: '2px solid #ddd',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

const cellStyle = {
  padding: '8px',
  fontSize: '12px',
  textAlign: 'center',
  border: '1px solid #ddd',
  maxHeight: '30px',
  overflow: 'hidden',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
};

const rowStyle = {
  height: '40px',
  borderBottom: '1px solid #ddd',
};

export default PMCheckpointHistory;
