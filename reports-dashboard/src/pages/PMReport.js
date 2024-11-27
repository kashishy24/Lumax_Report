import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, DatePicker, Button, message, Row ,Input} from 'antd';

const { Option } = Select;

const PMReport = () => {
  const [mouldNameOptions, setMouldNameOptions] = useState([]);
  const [mouldName, setMouldName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  useEffect(() => {
    // Fetch Mould Names from backend
    axios.get('http://localhost:5000/api/moulds')
      .then((response) => setMouldNameOptions(response.data))
      .catch(() => message.error('Error fetching mould names.'));
  }, []);
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
    if (!mouldName || !startDate || !endDate) {
      message.warning("Please select Mould Name, Start Date, and End Date.");
      return;
    }

      // Fetch part details when a Mould Name is selected
 

    // Fetch report data for Preventive Maintenance using MouldName instead of MouldID
    axios.post('http://localhost:5000/api/maintenance/pm', {
      mouldName,
      startTime: startDate.format('YYYY-MM-DD'),
      endTime: endDate.format('YYYY-MM-DD'),
    })
      .then((response) => setReportData(response.data))
      .catch(() => message.error('Error fetching report data.'));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#e0e2e5', minHeight: '89.5vh', maxWidth: '73vw', marginTop: '-15px', marginLeft: '-15px' }}>
      <Row justify="start" align="middle" style={{ marginBottom: '5px', gap: '16px',marginLeft: '-17px',marginTop:'-20px'}}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Mould Name</label>
          <Select
            placeholder="Select Mould Name"
             onChange={handleMouldChange}
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
            style={{ width: '160px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>End Date</label>
          <DatePicker
            onChange={(date) => setEndDate(date)}
            value={endDate}
            style={{ width: '160px' }}
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

      {/* Report Data Table with scrollable container */}
      <div style={{ marginTop: '12px', maxWidth: '100%', maxHeight: '450px', overflowY: 'auto', border: '1px solid #ddd' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
    <thead>
      <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
        <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckList ID</th>
        <th style={{ ...tableHeaderStyle, width: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>CheckList Name</th>
        <th style={{ ...tableHeaderStyle, width: '120px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Mould Name</th>
        <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>User Name</th>
        <th style={{ ...tableHeaderStyle, width: '80px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Status</th>
        <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Instance</th>
        <th style={{ ...tableHeaderStyle, width: '200px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Remark</th>
        <th style={{ ...tableHeaderStyle, width: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Start Time</th>
        <th style={{ ...tableHeaderStyle, width: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>End Time</th>
        <th style={{ ...tableHeaderStyle, width: '100px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>Duration</th>
      </tr>
    </thead>
    <tbody>
      {reportData.map((row) => (
        <tr key={row.CheckListID} style={rowStyle}>
          <td style={cellStyle}>{row.CheckListID}</td>
          <td style={cellStyle}>{row.CheckListName}</td>
          <td style={cellStyle}>{row.MouldName}</td>
          <td style={cellStyle}>{row.UserName}</td>
          <td style={cellStyle}>{row.PMStatus}</td>
          <td style={cellStyle}>{row.Instance}</td>
          <td style={cellStyle}>{row.Remark}</td>
          <td style={cellStyle}>{row.StartTime}</td>
          <td style={cellStyle}>{row.EndTime}</td>
          <td style={cellStyle}>{row.PMDuration}</td>
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
  whiteSpace: 'nowrap', // Prevent wrapping
  textOverflow: 'ellipsis', // Add ellipsis if the text overflows
  overflow: 'hidden', // Hide overflowing text
};

const cellStyle = {
  padding: '8px',
  fontSize: '12px',
  textAlign: 'center',
  border: '1px solid #ddd',
  maxHeight: '30px', // Define max height for each row
  overflow: 'hidden',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
};

const rowStyle = {
  height: '40px', // Fixed row height
  borderBottom: '1px solid #ddd',
};

export default PMReport;
