import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import * as serviceWorker from './serviceWorker';

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
} from 'recharts';
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
  sampleArray.map(dt => ({
    temperature: (maxTemp + Math.exp(-(K * dt)) * (minTemp - maxTemp)).toFixed(2),
    minute: dt,
  }));

const App = () => {
  const [tou, setTou] = React.useState(20);
  const [sampleNumber, setSampleNumber] = React.useState(120);
  const [sampleInterval, setSampleInterval] = React.useState(1);
  const [temperatureRange, setTemperatureRange] = React.useState([0, 100]);

  const k = calculateK(1, tou);
  const sampleArray = createIntervalSampleArray(sampleNumber, sampleInterval);

  const data = calculateTemperature(sampleArray, k, ...temperatureRange);

  return (
    <React.Fragment>
      Tou (minutes)
      <InputNumber min={1} max={50} defaultValue={20} onChange={setTou} />
      Sampling Interval
      <InputNumber min={1} max={60} defaultValue={1} onChange={setSampleInterval} />
      <Slider range marks={marks} defaultValue={[0, 100]} onChange={setTemperatureRange} />
      <LineChart
        width={1024}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="minute" label={{ value: 'Minutes', offset: -5,  position: 'insideBottom'}} type="number" domain={[0, 120]} />
        <YAxis label={{ value: 'Temperature', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} label={{ value: "Minimum Temperature", offset: 10, position: 'top' }} stroke="blue" strokeDasharray="3 3" />
        <ReferenceLine y={50} label={{ value: "Reference Temperature", offset: 10, position: 'top' }} stroke="green" strokeDasharray="3 3" />
        <ReferenceLine y={100} label={{ value: "Maximum Temperature", offset: 10, position: 'bottom' }} stroke="red" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="temperature" dot={false} stroke="#8884d8" />
      </LineChart>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
