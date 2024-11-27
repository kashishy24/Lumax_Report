import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, message, Row, DatePicker, Input } from 'antd';

const { Option } = Select;

const PMCheckpointHistory = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [instanceOptions, setInstanceOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');
  const [instanceNo, setInstanceNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);


  const [partName, setPartName] = useState('');
  const [mouldIdNumber, setMouldIdNumber] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rawMaterial, setRawMaterial] = useState('');
  const [partNo, setPartNo] = useState('');
  const [pmFrequency, setPmFrequency] = useState('');
  const [noOfShots, setNoOfShots] = useState('');
  const [month, setMonth] = useState('');
  const [gateType, setGateType] = useState('');
  const [mcTonnage, setMcTonnage] = useState('');
  // Fetch mould names on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch(() => message.error('Error fetching mould names.'));
  }, []);

  // Fetch instance options dynamically based on filters
  useEffect(() => {
    if (mouldName && startDate && endDate) {
      axios
        .post('http://localhost:5000/api/instance', { mouldName, startDate, endDate })
        .then((response) => setInstanceOptions(response.data))
        .catch(() => message.error('Error fetching instance numbers.'));
    }
  }, [mouldName, startDate, endDate]);







   // Fetch part details when a Mould Name is selected
   const handleMouldChange = (value) => {
    setMouldName(value);
    setPartName(''); // Reset part details during loading
  
    axios
      .post('http://localhost:5000/api/getMetadata', { mouldName: value }) // Corrected the data payload
      .then((response) => {
        const data = response.data;
        setPartName(data['Part Name'] || '');
        setCustomerName(data['Customer Name'] || '');
        setGateType(data['Gate Type'] || '');
        setRawMaterial(data['Material Name'] || '');
        setMcTonnage(data['MC Tonnage'] || '');
      })
      .catch(() => {
        message.error('Error fetching part details.');
        setPartName('');
        setCustomerName('');
        setGateType('');
        setRawMaterial('');
        setMcTonnage('');
      });
  };
  



  const handleGenerateReport = () => {
    if (!mouldName || !instanceNo || !startDate || !endDate) {
      message.warning('Please select a Mould Name.');
      return;
    }
  

  
    // Fetch table data based on filters
    // if (startDate && endDate && instanceNo) {
    //   axios
    //     .post('http://localhost:5000/api/mould-executed-pm', {
    //       mouldName,
    //       instance: instanceNo,
    //       startDate,
    //       endDate,
    //     })
    //     .then((response) => setReportData(response.data))
    //     .catch(() => message.error('Error fetching report data.'));
    // }

    axios
    .post('http://localhost:5000/api/mould-executed-pm', {
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
        style={{ marginBottom: '5px', gap: '16px', marginLeft: '-17px' ,marginTop:'-20px'}}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
            Mould Name
          </label>
          <Select
            placeholder="Select Mould Name"
            onChange={handleMouldChange}
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
          <label style={{ fontWeight: 'bold', marginRight: '4px' }}>
            Instance No
          </label>
          <Select
            placeholder="Select Instance No"
            onChange={(value) => setInstanceNo(value)}
            value={instanceNo}
            style={{ width: '70px' }}
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
            width: '60px',
            marginLeft: '-10px'
          }}
        >
          Generate
        </Button>
      </Row>
      <Row
        gutter={16}
        justify="start"
        style={{ marginBottom: '5px', gap: '16px', marginLeft: '-17px' }}
      >


     
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <label style={{ marginRight: '8px' }}>Part Name</label>
          <Input value={partName} placeholder="Part Name" readOnly style={{ width: '136px' }} />
        </div>
    </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{  marginRight: '-15px', minWidth: '100px' ,marginLeft:'-5px'}}>
            Model Code
          </label>
          <Input
            placeholder="Model Code"
            value={modelCode}
            style={{ width: '100px',marginLeft:'-3px' }}
            onChange={(e) => setModelCode(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{marginRight: '4px', minWidth: '100px', marginLeft:'-5px'}}>
            Customer Name
          </label>
          <Input
            placeholder="Customer Name"
            value={customerName}
            style={{ width: '100px' }}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '8px', minWidth: '100px', marginLeft: '-4px'}}>
            Raw Material
          </label>

          <Input
            placeholder="Raw Material"
            value={rawMaterial}
            style={{ width: '148px' ,marginLeft: '-22px'}}
            onChange={(e) => setRawMaterial(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center',marginTop:'-12px' }}>
          <label style={{ marginRight: '8px', minWidth: '100px' }}>
            Part No
          </label>

          <Input
            placeholder="Part No"
            value={partNo}
            style={{ width: '80px' ,marginLeft:'-55px'}}
            onChange={(e) => setPartNo(e.target.value)}
          />
        </div>

        {/* <div style={{ display: 'flex', alignItems: 'center' ,marginTop:'-25px' }}>
          <label style={{ marginRight: '8px', minWidth: '100px' }}>
            PM Frequency
          </label>

          <Input
            placeholder="PM Frequency"
            value={pmFrequency}
            style={{ width: '50px' }}
            onChange={(e) => setPmFrequency(e.target.value)}
          /></div> */}

        <div style={{ display: 'flex', alignItems: 'center',marginTop:'-12px'  }}>
          <label style={{  marginRight: '8px', minWidth: '90px' ,marginLeft:'-4px'}}>
            FrequencyCount
          </label>
          <Input
            placeholder="No. of Shots"
            value={noOfShots}
            style={{ width: '50px' ,marginLeft:'-2px'}}
            onChange={(e) => setNoOfShots(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' ,marginTop:'-12px' }}>
          <label style={{  marginRight: '4px', minWidth: '50px' ,marginLeft:'-4px'}}>
          FrequencyMonth
          </label>
          <Input
            placeholder="Month"
            value={month}
            style={{ width: '100px' }}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' ,marginTop:'-12px' }}>
          <label style={{  minWidth: '100px',marginLeft:'-4px' }}>
            Gate Type
          </label>
          <Input
            placeholder="Gate Type"
            value={gateType}
            style={{ width: '80px',marginLeft:'-30px'}}
            onChange={(e) => setGateType(e.target.value)}
          />
        </div>
     <div style={{ marginTop:'-12px' }} >
     <label style={{ marginLeft:'-4px' }}>
            M/C Tonnage
          </label>
          <Input
            placeholder="M/C Tonnage"
            value={mcTonnage}
            style={{ width: '80px',marginRight:'4px'}}
            onChange={(e) => setMcTonnage(e.target.value)}
          />
     </div>
       
      </Row>


      <div
        style={{
          marginTop: '12px',
          maxWidth: '100%',
          maxHeight: '388px',
          marginLeft: '-17px',
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
              <th style={{ ...tableHeaderStyle, width: '100px',borderRight: '1px solid #ddd'}}>
                CheckListName
              </th>
              <th style={{ ...tableHeaderStyle, width: '100px' ,borderRight: '1px solid #ddd'}}>
                CheckPointID
              </th>
              <th style={{ ...tableHeaderStyle, width: '120px',borderRight: '1px solid #ddd' }}>
                CheckPointName
              </th>
              <th style={{ ...tableHeaderStyle, width: '80px' ,borderRight: '1px solid #ddd'}}>
                CheckArea
              </th>
              <th style={{ ...tableHeaderStyle, width: '130px',borderRight: '1px solid #ddd' }}>
                CheckPointItems
              </th>
              <th style={{ ...tableHeaderStyle, width: '130px',borderRight: '1px solid #ddd' }}>
                CheckPointArea
              </th>
              <th style={{ ...tableHeaderStyle, width: '130px' ,borderRight: '1px solid #ddd'}}>
                CheckingMethod
              </th>
              <th style={{ ...tableHeaderStyle, width: '130px',borderRight: '1px solid #ddd' }}>
                JudgementCriteria
              </th>
              <th style={{ ...tableHeaderStyle, width: '110px',borderRight: '1px solid #ddd' }}>
                CheckListType
              </th>
              <th style={{ ...tableHeaderStyle, width: '130px' ,borderRight: '1px solid #ddd'}}>
                CheckPointType
              </th>
              <th style={{ ...tableHeaderStyle, width: '70px' ,borderRight: '1px solid #ddd'}}>UOM</th>
              <th style={{ ...tableHeaderStyle, width: '100px',borderRight: '1px solid #ddd' }}>
                UpperLimit
              </th>
              <th style={{ ...tableHeaderStyle, width: '100px',borderRight: '1px solid #ddd' }}>
                LowerLimit
              </th>
              <th style={{ ...tableHeaderStyle, width: '100px',borderRight: '1px solid #ddd' }}>Standard</th>
              <th style={{ ...tableHeaderStyle, width: '100px' ,borderRight: '1px solid #ddd'}}>
                CheckPointValue
              </th>
              <th style={{ ...tableHeaderStyle, width: '70px',borderRight: '1px solid #ddd' }}>OKNOK</th>
              <th style={{ ...tableHeaderStyle, width: '100px',borderRight: '1px solid #ddd' }}>
                Observation
              </th>
              <th style={{ ...tableHeaderStyle, width: '100px',borderRight: '1px solid #ddd' }}>Instance</th>
              <th style={{ ...tableHeaderStyle, width: '100px', borderRight: '1px solid #ddd'}}>
                Timestamp
              </th>
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
    </div>
  );
};

const tableHeaderStyle = {
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '12px',
  textAlign: 'center',
  borderBottom: '2px solid #ddd',
  backgroundColor: '#f5f5f5',
        textAlign: 'left',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        
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
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

const rowStyle = {
  fontWeight: '500',
  fontSize: '14px',
  textAlign: 'center',
};

export default PMCheckpointHistory;   