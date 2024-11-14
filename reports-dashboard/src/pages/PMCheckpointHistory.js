import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Table, message, Row, Col } from 'antd';

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

  const columns = [
    { title: 'CheckListName', dataIndex: 'CheckListName', key: 'CheckListName', ellipsis: true, width: 140 },
    { title: 'CheckPointID', dataIndex: 'CheckPointID', key: 'CheckPointID', ellipsis: true, width: 130 },
    { title: 'CheckPointName', dataIndex: 'CheckPointName', key: 'CheckPointName', ellipsis: true, width: 150 },
    { title: 'CheckArea', dataIndex: 'CheckArea', key: 'CheckArea', ellipsis: true, width: 110 },
    { title: 'CheckPointItems', dataIndex: 'CheckPointItems', key: 'CheckPointItems', ellipsis: true, width: 150 },
    { title: 'CheckPointArea', dataIndex: 'CheckPointArea', key: 'CheckPointArea', ellipsis: true, width: 150 },
    { title: 'CheckingMethod', dataIndex: 'CheckingMethod', key: 'CheckingMethod', ellipsis: true, width: 150 },
    { title: 'JudgementCriteria', dataIndex: 'JudgementCriteria', key: 'JudgementCriteria', ellipsis: true, width: 160 },
    { title: 'CheckListType', dataIndex: 'CheckListType', key: 'CheckListType', ellipsis: true, width: 150 },
    { title: 'CheckPointType', dataIndex: 'CheckPointType', key: 'CheckPointType', ellipsis: true, width: 150 },
    { title: 'UOM', dataIndex: 'UOM', key: 'UOM', ellipsis: true, width: 70 },
    { title: 'UpperLimit', dataIndex: 'UpperLimit', key: 'UpperLimit', ellipsis: true, width: 130 },
    { title: 'LowerLimit', dataIndex: 'LowerLimit', key: 'LowerLimit', ellipsis: true, width: 130 },
    { title: 'Standard', dataIndex: 'Standard', key: 'Standard', ellipsis: true, width: 140 },
    { title: 'CheckPointValue', dataIndex: 'CheckPointValue', key: 'CheckPointValue', ellipsis: true, width: 160 },
    { title: 'OKNOK', dataIndex: 'OKNOK', key: 'OKNOK', ellipsis: true, width: 90 },
    { title: 'Observation', dataIndex: 'Observation', key: 'Observation', ellipsis: true, width: 130 },
    { title: 'Instance', dataIndex: 'Instance', key: 'Instance', ellipsis: true, width: 100 },
    { title: 'Timestamp', dataIndex: 'Timestamp', key: 'Timestamp', ellipsis: true, width: 130 },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#e0e2e5', minHeight: '84vh', maxWidth: '71vw' }}>
      <Row gutter={16} justify="start" style={{ marginBottom: '24px', gap: '16px' }}>
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
          Generate Report
        </Button>
      </Row>

      <div style={{ marginTop: '12px', maxWidth: '100%' }}>
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey="UID"
          pagination={{ pageSize: 10 }}
          bordered
          style={{ backgroundColor: '#fff' }}
          scroll={{ x: 1500, y: 181 }}
          rowClassName={() => 'custom-row-height'}
          title={() => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
              <strong>Preventive Maintenance CheckPoint History</strong>
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

export default PMCheckpointHistory;
