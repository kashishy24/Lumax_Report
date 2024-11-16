import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, DatePicker, Button, message, Row } from 'antd';

const { Option } = Select;

const HCReport = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch(() => message.error('Error fetching mould names.'));
  }, []);

  const handleGenerateReport = () => {
    if (!mouldName || !startDate || !endDate) {
      message.warning('Please select Mould Name, Start Date, and End Date.');
      return;
    }

    axios
      .post('http://localhost:5000/api/maintenance/hc', {
        mouldName,
        startTime: startDate.format('YYYY-MM-DD'),
        endTime: endDate.format('YYYY-MM-DD'),
      })
      .then((response) => setReportData(response.data))
      .catch(() => message.error('Error fetching report data.'));
  };

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#e0e2e5',
        minHeight: '89.5vh',
        maxWidth: '73vw',
        marginTop: '-15px',
        marginLeft: '-15px',
      }}
    >
      <Row
        justify="start"
        align="middle"
        style={{ marginBottom: '16px', gap: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
            Mould Name
          </label>
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
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
            Start Date
          </label>
          <DatePicker
            onChange={(date) => setStartDate(date)}
            value={startDate}
            style={{ width: '180px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
            End Date
          </label>
          <DatePicker
            onChange={(date) => setEndDate(date)}
            value={endDate}
            style={{ width: '180px' }}
          />
        </div>

        <Button
          type="primary"
          onClick={handleGenerateReport}
          style={{
            backgroundColor: '#00008b',
            padding: '4px 12px',
            height: '32px',
            lineHeight: '1',
          }}
        >
          Generate
        </Button>
      </Row>

      {/* Report Data Table with scrollable container */}
      <div
        style={{
          marginTop: '12px',
          maxWidth: '100%',
          maxHeight: '450px',
          overflowY: 'auto',
          border: '1px solid #ddd',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
              <th style={tableHeaderStyle}>CheckList ID</th>
              <th style={tableHeaderStyle}>CheckList Name</th>
              <th style={tableHeaderStyle}>Mould Name</th>
              <th style={tableHeaderStyle}>User Name</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Instance</th>
              <th style={tableHeaderStyle}>Remark</th>
              <th style={tableHeaderStyle}>Start Time</th>
              <th style={tableHeaderStyle}>End Time</th>
              <th style={tableHeaderStyle}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr key={row.CheckListID} style={rowStyle}>
                <td style={cellStyle}>{row.CheckListID}</td>
                <td style={cellStyle}>{row.CheckListName}</td>
                <td style={cellStyle}>{row.MouldName}</td>
                <td style={cellStyle}>{row.UserName}</td>
                <td style={cellStyle}>{row.HCStatus}</td>
                <td style={cellStyle}>{row.Instance}</td>
                <td style={cellStyle}>{row.Remark}</td>
                <td style={cellStyle}>{row.StartTime}</td>
                <td style={cellStyle}>{row.EndTime}</td>
                <td style={cellStyle}>{row.HCDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        th,
        td {
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
  position: 'sticky',
  top: 0,
  backgroundColor: '#f5f5f5',
  zIndex: 1,
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

export default HCReport;
