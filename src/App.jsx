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
  const [K_val, setK_val] = useState('');
  const [minertiaTable, setMinertiaTable] = useState('');
  const [paramtype, setparamtype] = useState(null);
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
  const handleChangeParam = (value) => {
    setparamtype(value);
    console.log('paramtype:', value);

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

if(state==0){
  //ground state band and beta bands
  Minertia = (E1-energy) / ((state + 2) * (state + 3));
    for (let i = 0; i < num*2; i++) {
      if(i%2==0){
      const spin = i;
      const Ei = Minertia *(spin *(spin + 1)-state**2)+energy ;
      data.push({ key: i, Level: spin.toFixed(1), Energy: Ei.toFixed(3) });}
      else{continue;}
      setEiList(data);  
    }}
    
    else if(state>0 && state!==0.5){
    //other k bands
  Minertia = (E1-energy)/((state+1)*(state+2)-(state+1)*state);
    for (let i = 0; i < num; i++) {
      const spin = i+state;
      const Ei = Minertia *(spin*(spin + 1)-state*(state+1))+energy;
      data.push({ key: i, Level: spin.toFixed(1), Energy: Ei.toFixed(3) });
    
    }
    setEiList(data);
    setResult(`Rotation band of :${state}`); 
    
  }
  
  else if(state==0.5){
  
  Minertia = ((E1-energy)+1.5*(E2-energy))/15;
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
    setResult(`Input Error!`);
  }
};
  
  

  const [text, setText] = useState('');
  const [floatArray, setFloatArray] = useState([]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const parseFloats = () => {
  const rawValues = text.split(','); // assume `text` holds the user input string
  const floats = rawValues
    .map(str => parseFloat(str.trim()))
    .filter(num => !isNaN(num)); // clean floats

  setFloatArray(floats); // save to state if needed

  const { BandState, BandEnergy, BandNum } = Band;
  const state = parseFloat(BandState);
  const energy = parseFloat(BandEnergy);
  const num = parseInt(BandNum);
  let table = [];


  if (state == 0) {
    
    for (let i = 1; i < floats.length; i++) {
      const E_n = floats[i];


      const spin_n = i * 2; // even-spin steps: 0, 2, 4, ...
      const Minertia = 1/((E_n-energy) / ((spin_n ) * (spin_n + 1)))/2;

      table.push({
        index: i,
        spin: spin_n,
        minertia: Minertia.toFixed(3),
      });
    }

    console.table(table); // show in console
    setMinertiaTable(table); // optionally store to display in a Table UI
  }
  
  else if(state>0 && state!==0.5){
  for (let i = 1; i < floats.length; i++) {
      const E_n = floats[i];


      const spin_n = i+state;
      const Minertia = 1/((E_n-energy)/(spin_n*(spin_n+1)-state*(state+1)))/2 ;

      table.push({
        index: i,
        spin: spin_n,
        minertia: Minertia.toFixed(3),
      });
    }

    console.table(table); // show in console
    setMinertiaTable(table);
  
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
	
      <div style={{ display: 'flex', alignItems: 'left', marginTop: 20 }}>
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
         This calculator is based on the simplest model of an axial symmetric nucleus. The values should only be used as a quick estimation during analysis.
      </p>
      <p className="read-the-docs">
         Note: The second excitation energy is only required for band head of spin 1/2 as there is an extra parameter a need to be calculated.
      </p>
     <div>
     <h2> If the energies of band is know, enter energies from band head to calculate evolution of moment of inertia
     </h2>
     <Input
        placeholder="Enter comma-separated floats (e.g. 1.1, 2.3, 4.5)"
        value={text}
        onChange={handleTextChange}
        style={{ width: 400 }}
      />
      <Button onClick={parseFloats} type="primary" style={{ marginLeft: 10 }}>
        Parse
      </Button>
      
      <Table
  columns={[
    { title: "Index", dataIndex: "index", key: "index" },
    { title: "Spin J", dataIndex: "spin", key: "spin" },
    { title: "Moment of Inertia (ℏ²)", dataIndex: "minertia", key: "minertia" },
  ]}
  dataSource={minertiaTable} // from setMinertiaTable
  pagination={false}
/>
      </div>
    </div>
    </>
  )
}

export default App
