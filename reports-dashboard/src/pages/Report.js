import React from 'react';
// import { Image } from 'antd';
import reportImage from '../img/REPORTS.jpg'; 
import {Img} from 'react-image'

const Report = () => {
  // const myComponent = () => <Img src={reportImage} />
  return (
    <div style={{ padding: '0', backgroundColor: '#e0e2e5', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Image displayed on the page */}
      {/* <Image 
        src={reportImage} 
        alt="Report Image"
        style={{ maxWidth: '200%', height:'50%' }} 
      /> */}
      <Img src={reportImage} style={{height:'95%' , width:'95%'}} />
    </div>
  );
};

export default Report;
