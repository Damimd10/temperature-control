import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { InputNumber, Slider } from 'antd';

const marks = {
  0: '0°C',
  20: '20°C',
  40: '40°C',
  60: '60°C',
  80: '80°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};

const createIntervalSampleArray = (size, sampleInterval) =>
  [...Array(size)].map((_, i) => i * sampleInterval);

const calculateK = (dt, tou) => dt / tou;

const calculateTemperature = (sampleArray, K, minTemp, maxTemp) =>
  console.log('HERE', minTemp, maxTemp, K) ||
  sampleArray.map(dt => maxTemp + Math.exp(-(K * dt)) * (minTemp - maxTemp));

const App = () => {
  const [tou, setTou] = React.useState(20);
  const [sampleNumber, setSampleNumber] = React.useState(120);
  const [sampleInterval, setSampleInterval] = React.useState(1);
  const [temperatureRange, setTemperatureRange] = React.useState([0, 100]);

  const k = calculateK(1, tou);
  const sampleArray = createIntervalSampleArray(sampleNumber, sampleInterval);

  console.log('HERE', calculateTemperature(sampleArray, k, ...temperatureRange));

  return (
    <React.Fragment>
      Tou (minutes)
      <InputNumber min={1} max={50} defaultValue={20} onChange={setTou} />
      Sampling Interval
      <InputNumber min={1} max={60} defaultValue={1} onChange={setSampleInterval} />
      <Slider range marks={marks} defaultValue={[0, 100]} onChange={setTemperatureRange} />
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
