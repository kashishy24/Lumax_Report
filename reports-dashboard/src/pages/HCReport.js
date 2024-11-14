import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, DatePicker, Button, Table, message, Row, Col } from 'antd';

const { Option } = Select;

const HCReport = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch(() => message.error('Error fetching mould names.'));
  }, []);

  const handleGenerateReport = () => {
    if (!mouldName || !startDate || !endDate) {
      message.warning("Please select Mould Name, Start Date, and End Date.");
      return;
    }

    axios.post('http://localhost:5000/api/maintenance/hc', {
      mouldName,
      startTime: startDate.format('YYYY-MM-DD'),
      endTime: endDate.format('YYYY-MM-DD'),
    })
      .then((response) => setReportData(response.data))
      .catch(() => message.error('Error fetching report data.'));
  };

  const columns = [
    { title: 'CheckList ID', dataIndex: 'CheckListID', key: 'CheckListID' },
    { title: 'CheckList Name', dataIndex: 'CheckListName', key: 'CheckListName' },
    { title: 'Mould Name', dataIndex: 'MouldName', key: 'MouldName' },
    { title: 'User Name', dataIndex: 'UserName', key: 'UserName' },
    { title: 'Status', dataIndex: 'HCStatus', key: 'Status' },
    { title: 'Instance', dataIndex: 'Instance', key: 'Instance' },
    { title: 'Remark', dataIndex: 'Remark', key: 'Remark' },
    { title: 'Start Time', dataIndex: 'StartTime', key: 'StartTime' },
    { title: 'End Time', dataIndex: 'EndTime', key: 'EndTime' },
    { title: 'Duration', dataIndex: 'HCDuration', key: 'Duration' },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#e0e2e5', minHeight: '84vh', maxWidth: '71vw' }}>
      <Row justify="start" align="middle" style={{ marginBottom: '24px', gap: '16px' }}>
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
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Start Date</label>
          <DatePicker
            onChange={(date) => setStartDate(date)}
            value={startDate}
            style={{ width: '180px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>End Date</label>
          <DatePicker
            onChange={(date) => setEndDate(date)}
            value={endDate}
            style={{ width: '180px' }}
          />
        </div>

        <Button
          type="primary"
          onClick={handleGenerateReport}
          style={{ backgroundColor: '#00008b', padding: '4px 12px', height: '32px', lineHeight: '1' }}
        >
          Generate
        </Button>
      </Row>

      <div style={{ marginTop: '12px', maxWidth: '100%' }}>
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="CheckListID"
          pagination={{ pageSize: 10 }}
          bordered
          style={{ backgroundColor: '#fff' }}
          scroll={{ x: 1500, y: 181 }}
          rowClassName={() => 'custom-row-height'}
          title={() => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
              <strong>Health Check CheckList</strong>
            </div>
          )}
        />
      </div>

      <style jsx>{`
        .custom-row-height .ant-table-cell {
          padding: 0px;
          white-space: normal;
          word-wrap: break-word;
          vertical-align: top;
        }
      `}</style>
    </div>
  );
};

export default HCReport;
