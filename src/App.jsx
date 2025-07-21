import { useState } from 'react'
import './App.css'
import { Typography } from 'antd';
import { Select } from 'antd';
import { Table, Button, Input, Space } from "antd";
function App() {

  const [result, setResult] = useState('');
  const [FirstE, setFirstE] = useState('');
  const [SecondE, setSecondE] = useState('');
  const [EiList, setEiList] = useState([]);
	

  const [Band, setBand] = useState({BandState: "",
    BandEnergy: "",BandNum: "",});

  
  const handleChangeBand = (e) => {
    
    const { name, value } = e.target;
    setBand((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
  };
  

  const handleChangeE1 = (e) => {
    
    setFirstE(e.target.value);
    
  };
    const handleChangeE2 = (e) => {
    
    setSecondE(e.target.value);
    
  };
  
  
const CalBestFit = () => {
  const { BandState, BandEnergy, BandNum } = Band;
  const E1 = parseFloat(FirstE); // or Number(FirstE)
  const E2 = parseFloat(SecondE);
  const state = parseFloat(BandState);
  const energy = parseFloat(BandEnergy);
  const num = parseInt(BandNum);

  if (isNaN(state) || isNaN(energy) || isNaN(num) || isNaN(E1)) {
    setResult("Please enter valid numbers for all inputs.");
    return;
  }

  let resultEnergy = energy;
  let Minertia;
  let a_val;
  let data = [];

  if (state !== 0.5 && state !== 0) {
    Minertia = (E1-energy) / ((state + 1) * (state + 2) - state * (state + 1));
    for (let i = 0; i < num; i++) {
      const spin = state + i;
      const Ei = Minertia * spin * (spin + 1) - Minertia * state * (state + 1)+energy;
      data.push({ key: i, Level: spin.toFixed(1), Energy: Ei.toFixed(3) });
    }
    setEiList(data);
  } 
  else if(state==0){
  Minertia = (E1-energy) / ((state + 1) * (state + 2) - state * (state + 1));
    for (let i = 0; i < num*2; i++) {
      if(i%2==0){
      const spin = state + i;
      const Ei = Minertia * spin * (spin + 1) - Minertia * state * (state + 1)+energy;
      data.push({ key: i, Level: spin.toFixed(1), Energy: Ei.toFixed(3) });}
    }
    setEiList(data);  
  }
  else if(state==0.5){
  
  Minertia = (1.5*(E1-energy)+(E2-energy))/15;
  a_val = 1/3*((E1-energy)/Minertia-3);
    for (let i = 0; i < num; i++) {
     
      const spin = state + i;
      const Ei = Minertia * (spin * (spin + 1)+a_val*Math.pow(-1, spin+0.5)*(spin+0.5))- Minertia * (state * (state + 1) -a_val )+energy;
      data.push({ key: i, Level: spin.toFixed(1), Energy: Ei.toFixed(3) });
    }
    setEiList(data);  
  }
  
  
  else {
    setEiList([]);
    setResult(`BandHead Energy: ${resultEnergy.toFixed(3)} keV`);
  }
};
  
  
  


  return (
    <>
      <div>
      <div>
      <h1>Rotation band calculator for Gamma Spectroscopy
      </h1>
      <h2>For detailed information of calculations please refer to: 
      </h2>
      <h3>
      	<a href="http://eng-web1.eng.famu.fsu.edu/~dommelen/quantum/style_a/ntcs.html#eq:rott" target="_blank">
      		Collective structure introduction 
      	</a>
      </h3>
       
      </div>     
      <div style={{ display: 'flex', alignItems: 'left', marginTop: 20 }}>
      <Input
            name="BandState"
            addonBefore={<span className="addon-label">BandHead State</span>}
            placeholder="Enter total angular momentum of band head in decimals"
            allowClear
            value={Band.BandState}
            onChange={handleChangeBand}
            style={{ width: 300 }}
          />

          <Input
            name="BandEnergy"
            addonBefore={<span className="addon-label">BandHead Energy</span>}
            placeholder="Enter Energy of band head"
            allowClear
            value={Band.BandEnergy}
            onChange={handleChangeBand}
            style={{ width: 300 }}
          />
         <Input
  	   name="FirstE"
  	   addonBefore={<span className="addon-label">First Excitation Energy</span>}
  	   placeholder="Enter Energy of first excitation"
  	   allowClear
  	   value={FirstE}
  	   onChange={handleChangeE1}
  	   style={{ width: 300 }}
	 />
           <Input
            name="BandNum"
            addonBefore={<span className="addon-label">Number of Excitaion states</span>}
            placeholder="Enter number of excitation states inclued in the calculation"
            allowClear
            value={Band.BandNum}
            onChange={handleChangeBand}
            style={{ width: 300 }}
          />
      <Input
  	   name="SecondE"
  	   addonBefore={<span className="addon-label">Second Excitation Energy</span>}
  	   placeholder="Enter Energy of second excitation"
  	   allowClear
  	   value={SecondE}
  	   onChange={handleChangeE2}
  	   style={{ width: 300 }}
	 />
      </div>
      <Space direction="vertical" size="large">
      <div />
	
      <div>
       <Button type="primary" onClick={CalBestFit}>
            Calculate
          </Button>
 
     
      </div>
      </Space>
      {EiList.length > 0 && (
  <Table
    columns={[
      {
        title: "J (Spin)",
        dataIndex: "Level",
        key: "Level",
      },
      {
        title: "Eᵢ (keV)",
        dataIndex: "Energy",
        key: "Energy",
      },
    ]}
    dataSource={EiList}
    pagination={false}
    style={{ marginTop: 24, width: 400 }}
  />
)}
   
      
      <p className="read-the-docs">
         Note: The second excitation energy is only required for band head of spin 1/2 as there is an extra parameter a need to be calculated.
      </p>
     
      
    </div>
    </>
  )
}

export default App
