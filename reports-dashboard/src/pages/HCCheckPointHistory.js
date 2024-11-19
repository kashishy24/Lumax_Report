import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, message, Row, DatePicker } from 'antd';

const { Option } = Select;

const HCCheckpointHistory = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [instanceOptions, setInstanceOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');
  const [instanceNo, setInstanceNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch(() => message.error('Error fetching mould names.'));
  }, []);

  useEffect(() => {
    if (mouldName && startDate && endDate) {
      axios
        .post('http://localhost:5000/api/instance-hc', { mouldName, startDate, endDate })
        .then((response) => setInstanceOptions(response.data))
        .catch(() => message.error('Error fetching instance numbers.'));
    }
  }, [mouldName, startDate, endDate]);

  const handleGenerateReport = () => {
    if (!mouldName || !instanceNo || !startDate || !endDate) {
      message.warning(
        'Please select Mould Name, Instance No, Start Date, and End Date.'
      );
      return;
    }

    axios
      .post('http://localhost:5000/api/mould-executed-hc', {
        mouldName,
        instance: instanceNo,
        startDate,
        endDate,
      })
      .then((response) => setReportData(response.data))
      .catch(() => message.error('Error fetching report data.'));
  };

  return (
    <div
    style={{
      padding: '24px',
      backgroundColor: '#e0e2e5',
      minHeight: '84vh',
      maxWidth: '73vw',
      marginTop: '-15px',
      marginLeft: '-15px',
    }}
  >
    <Row
      gutter={16}
      justify="start"
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
          style={{ width: '120px' }}
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
          onChange={(date, dateString) => setStartDate(dateString)}
          style={{ width: '120px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
          End Date
        </label>
        <DatePicker
          onChange={(date, dateString) => setEndDate(dateString)}
          style={{ width: '120px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
          Instance No
        </label>
        <Select
          placeholder="Select Instance No"
          onChange={(value) => setInstanceNo(value)}
          value={instanceNo}
          style={{ width: '120px' }}
          disabled={!instanceOptions.length}
        >
          {instanceOptions.map((option) => (
            <Option key={option.Instance} value={option.Instance}>
              {option.Instance}
            </Option>
          ))}
        </Select>
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

      <div style={{ marginTop: '12px', maxWidth: '100%', maxHeight: '450px', overflowY: 'auto', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
              <th style={tableHeaderStyle}>CheckList Name</th>
              <th style={tableHeaderStyle}>CheckPoint ID</th>
              <th style={tableHeaderStyle}>CheckPoint Name</th>
              <th style={tableHeaderStyle}>CheckPoint Category</th>
              <th style={tableHeaderStyle}>Standard Condition</th>
              <th style={tableHeaderStyle}>Checking Method</th>
              <th style={tableHeaderStyle}>CheckPoint Type</th>
              <th style={tableHeaderStyle}>UOM</th>
              <th style={tableHeaderStyle}>Upper Limit</th>
              <th style={tableHeaderStyle}>Lower Limit</th>
              <th style={tableHeaderStyle}>Standard</th>
              <th style={tableHeaderStyle}>CheckPoint Value</th>
              <th style={tableHeaderStyle}>OK/NOK</th>
              <th style={tableHeaderStyle}>Observation</th>
              <th style={tableHeaderStyle}>Instance</th>
              <th style={tableHeaderStyle}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index} style={rowStyle}>
                <td style={cellStyle}>{row.CheckListName}</td>
                <td style={cellStyle}>{row.CheckPointID}</td>
                <td style={cellStyle}>{row.CheckPointName}</td>
                <td style={cellStyle}>{row.CheckPointCategory}</td>
                <td style={cellStyle}>{row.StandardCondition}</td>
                <td style={cellStyle}>{row.CheckingMethod}</td>
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

export default HCCheckpointHistory;
